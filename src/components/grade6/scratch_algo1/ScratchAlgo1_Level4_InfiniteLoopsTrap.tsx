import React, { useState } from 'react';
import {
  AlertTriangle,
  Bug,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  StopCircle,
  Zap,
  RotateCcw,
  Terminal
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

interface BugCase {
  id: string;
  title: string;
  codeSnippet: string[];
  bugDescription: string;
  solutions: {
    id: string;
    label: string;
    isCorrect: boolean;
    fixNote: string;
  }[];
}

const BUG_CASES: BugCase[] = [
  {
    id: 'bug1',
    title: 'Cazul 1: Variabila Înghețată (Uitarea Incrementării)',
    codeSnippet: [
      'setează [pas] la (0)',
      'repetă până când <pas = 5>:',
      '  mergi 10 pași',
      '  spune "Mergi!" pentru 1 sec'
    ],
    bugDescription: 'Variabila [pas] rămâne mereu 0! Condiția <pas = 5> nu va fi atinsă niciodată.',
    solutions: [
      {
        id: 's1',
        label: 'Adaugă „modifică [pas] cu (1)” în interiorul buclei',
        isCorrect: true,
        fixNote: 'Excelent! La fiecare iterație variabila crește cu 1, ajungând la 5 după exact 5 pași!'
      },
      {
        id: 's2',
        label: 'Adaugă „setează [pas] la (0)” în interiorul buclei',
        isCorrect: false,
        fixNote: 'Greșit! Asta ar forța variabila să fie mereu 0, menținând bucla infinită.'
      },
      {
        id: 's3',
        label: 'Schimbă cu blocul „la infinit”',
        isCorrect: false,
        fixNote: 'Greșit! Blocul „la infinit” nu se oprește deloc.'
      }
    ]
  },
  {
    id: 'bug2',
    title: 'Cazul 2: Saltul Peste Țintă (Numere Impare)',
    codeSnippet: [
      'setează [x] la (1)',
      'repetă până când <x = 10>:',
      '  modifică [x] cu (2)',
      '  mergi 10 pași'
    ],
    bugDescription: 'x ia valorile: 1, 3, 5, 7, 9, 11, 13... x sare peste 10 și devine infinit!',
    solutions: [
      {
        id: 's1',
        label: 'Schimbă condiția în „repetă până când <x > 9>” (sau x >= 10)',
        isCorrect: true,
        fixNote: 'Briliant! Folosind inegalitatea „> 9”, bucla se oprește imediat când x ajunge la 11!'
      },
      {
        id: 's2',
        label: 'Modifică pasul la „modifică [x] cu (-2)”',
        isCorrect: false,
        fixNote: 'Greșit! x ar scădea spre -1, -3, îndepărtându-se și mai mult de 10.'
      }
    ]
  },
  {
    id: 'bug3',
    title: 'Cazul 3: Butonul de Urgență (Emergency Stop)',
    codeSnippet: [
      'când se dă clic pe stegulețul verde',
      'la infinit:',
      '  rotește 15 grade',
      '  dacă <tasta [q] apăsată?> atunci:'
    ],
    bugDescription: 'Cum oprim imediat întregul joc când jucătorul apasă tasta Q de urgență?',
    solutions: [
      {
        id: 's1',
        label: 'Adaugă blocul „oprește [toate]” (Stop All)',
        isCorrect: true,
        fixNote: 'Perfect! Blocul „oprește [toate]” termină instantaneu orice script activ din tot proiectul.'
      },
      {
        id: 's2',
        label: 'Adaugă blocul „așteaptă 1 secunde”',
        isCorrect: false,
        fixNote: 'Incorect! Așteptarea nu oprește deloc bucla.'
      }
    ]
  }
];

export const ScratchAlgo1_Level4_InfiniteLoopsTrap: React.FC<Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [activeBugIdx, setActiveBugIdx] = useState<number>(0);
  const [fixedBugs, setFixedBugs] = useState<Record<string, string>>({});

  const currentBug = BUG_CASES[activeBugIdx];
  const selectedSolutionId = fixedBugs[currentBug.id];

  const handleSelectSolution = (solId: string, isCorrect: boolean) => {
    if (fixedBugs[currentBug.id]) return;
    setFixedBugs((prev) => ({ ...prev, [currentBug.id]: solId }));
    if (isCorrect) sounds.playCorrect();
    else sounds.playWrong();
  };

  const solvedCount = BUG_CASES.filter((b) => {
    const sel = fixedBugs[b.id];
    const s = b.solutions.find((x) => x.id === sel);
    return s?.isCorrect;
  }).length;

  const canProceed = solvedCount === BUG_CASES.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/60 via-rose-950/40 to-slate-900 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                {isEn ? 'Grade 6 • Unit 4A • Level 4 of 7' : 'Clasa a VI-a • Unitatea 4A • Nivelul 4 din 7'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Manual pag. 70–73</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <span>{isEn ? 'The Infinite Loop Trap & Debugging' : 'Capcana Buclelor Infinite & Tehnici de Depanare'}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'What freezes a Scratch project? Learn how infinite loops occur, why computers hang, and master the emergency stop blocks!'
                : 'De ce „îngheață” un joc Scratch? Învață de ce apar buclele infinite, cum consumă 100% din procesor și stăpânește blocurile de oprire salvatoare!'}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-red-400/80">REWARD</span>
            <span className="text-xl font-black text-red-300 font-mono">+15 XP</span>
          </div>
        </div>
      </div>

      {/* Anatomy of Infinite Loop Warning Box */}
      <div className="bg-slate-900/90 border border-red-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm uppercase tracking-wider">
          <Bug className="w-5 h-5" />
          <span>Cum se naște o buclă infinită?</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          O buclă devine <strong>infinită</strong> atunci când condiția de oprire din antetul buclei nu are nicio șansă matematică sau logică de a deveni ADEVĂRATĂ. Calculatorul continuă să execute instrucțiunile la nesfârșit, blocând pagina de Scratch sau provocând blocarea personajului!
        </p>

        {/* 3 Stop blocks in Scratch */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="font-mono font-bold text-xs text-red-400 mb-1">
              oprește [toate]
            </div>
            <p className="text-[11px] text-slate-400">
              Oprește complet jocul și toate scripturile din toate personajele.
            </p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="font-mono font-bold text-xs text-amber-400 mb-1">
              oprește [acest script]
            </div>
            <p className="text-[11px] text-slate-400">
              Oprește doar bucla sau scriptul curent, lăsând restul jocului să ruleze.
            </p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="font-mono font-bold text-xs text-blue-400 mb-1">
              oprește [alte scripturi]
            </div>
            <p className="text-[11px] text-slate-400">
              Oprește celelalte fire de execuție ale personajului curent.
            </p>
          </div>
        </div>
      </div>

      {/* Bug Hunter Lab */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white">
              {isEn ? 'Bug Hunter: Fix the 3 Infinite Loops' : 'Laborator: Vânătorul de Bug-uri Infinite (3 Cazuri)'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {BUG_CASES.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => {
                  setActiveBugIdx(idx);
                  sounds.playClick();
                }}
                className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                  activeBugIdx === idx
                    ? 'bg-red-600 text-white'
                    : fixedBugs[b.id]
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Bug Display */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{currentBug.title}</span>
          </h3>

          {/* Faulty Code Snippet */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/30 font-mono text-xs space-y-1.5">
            <div className="text-[11px] text-red-400 uppercase font-bold mb-2 flex items-center justify-between">
              <span>Cod Scratch cu Bug:</span>
              <span className="text-xs">⚠️ BUCLĂ BLOCATĂ</span>
            </div>
            {currentBug.codeSnippet.map((line, i) => (
              <div key={i} className="text-amber-200">
                {line}
              </div>
            ))}
          </div>

          <div className="text-xs text-rose-300 bg-rose-950/30 p-3 rounded-xl border border-rose-500/30">
            🔍 <strong>Diagnosticul:</strong> {currentBug.bugDescription}
          </div>

          <div className="text-sm font-bold text-white pt-2">
            {isEn ? 'Choose the correct fix to restore normal loop termination:' : 'Alege remediul corect pentru a asigura oprirea normală a buclei:'}
          </div>

          {/* Solutions */}
          <div className="grid grid-cols-1 gap-3">
            {currentBug.solutions.map((sol) => {
              const isSelected = selectedSolutionId === sol.id;
              const hasAnswered = !!selectedSolutionId;

              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (hasAnswered) {
                if (sol.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={sol.id}
                  onClick={() => handleSelectSolution(sol.id, sol.isCorrect)}
                  className={`p-4 rounded-2xl border text-left transition flex items-start justify-between gap-3 cursor-pointer ${style}`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm">{sol.label}</div>
                    {hasAnswered && isSelected && (
                      <p className="text-xs text-slate-300 mt-1">{sol.fixNote}</p>
                    )}
                  </div>
                  <div>
                    {hasAnswered && sol.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !sol.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <QuestionHint
          hint={
            isEn
              ? 'Always ensure that the condition variable changes INSIDE the loop body towards the termination target.'
              : 'Verifică întotdeauna dacă variabila care decide oprirea buclei își schimbă valoarea ÎN INTERIORUL buclei spre condiția de oprire!'
          }
        />
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canProceed}
        onNext={() => onCompletePage(15)}
        nextLabel={isEn ? 'Level 5: Sensors in Loops' : 'Nivelul 5: Senzorii Inteligenți Scratch'}
      />
    </div>
  );
};
