import React, { useState } from 'react';
import {
  Table2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Maximize,
  Minimize2,
  Grid,
  Check,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level4_ProfessionalTables: React.FC<W2Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Table Designer Interactive State
  const [isHeaderMerged, setIsHeaderMerged] = useState<boolean>(false);
  const [hasProfessionalAlignment, setHasProfessionalAlignment] = useState<boolean>(false);
  const [hasHeaderShading, setHasHeaderShading] = useState<boolean>(false);
  const [hasBordersStyled, setHasBordersStyled] = useState<boolean>(false);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const sampleData = [
    { nr: '1', nume: 'Popescu Andrei', disciplina: 'Informatică', punctaj: '98.50', bursa: '500 lei' },
    { nr: '2', nume: 'Ionescu Elena', disciplina: 'Matematică', punctaj: '95.00', bursa: '450 lei' },
    { nr: '3', nume: 'Radu Mihai', disciplina: 'Fizică', punctaj: '91.25', bursa: '400 lei' },
    { nr: '4', nume: 'Stan Maria', disciplina: 'Chimie', punctaj: '88.75', bursa: '350 lei' },
  ];

  // Professional score indicator
  const criteriaMetCount = [
    isHeaderMerged,
    hasProfessionalAlignment,
    hasHeaderShading,
    hasBordersStyled,
  ].filter(Boolean).length;

  const handleSelectAnswer = (qKey: 'q1' | 'q2' | 'q3', answer: string, correct: string) => {
    if (isLocked(qKey)) return;

    if (qKey === 'q1') setQ1Answer(answer);
    if (qKey === 'q2') setQ2Answer(answer);
    if (qKey === 'q3') setQ3Answer(answer);

    if (answer === correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qKey);
    }
  };

  const isQ1Correct = q1Answer === 'b';
  const isQ2Correct = q2Answer === 'c';
  const isQ3Correct = q3Answer === 'a';
  const allCorrect = isQ1Correct && isQ2Correct && isQ3Correct;

  const calculateScore = () => {
    let score = 70;
    if (isQ1Correct) score += 10;
    if (isQ2Correct) score += 10;
    if (isQ3Correct) score += 10;
    return score;
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/40 via-emerald-900/40 to-blue-900/40 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>Misiunea 1B • Nivelul 4 din 7</span>
              <span>•</span>
              <span>Manual pag. 24-25</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Tabele Profesionale, Îmbinare Celule & Aliniere Date
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Învață regulile de aur ale tabelelor academice: de ce numerele se aliniază întotdeauna la Dreapta, cum unim celulele de titlu cu <code className="text-teal-300 font-mono">Merge Cells</code> și cum stilizăm bordurile și umbrirea antetului pentru lizibilitate maximă.
            </p>
          </div>
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-400 self-start sm:self-auto">
            <Table2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Theory Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Grid className="w-5 h-5" />
            <span>Rânduri, Coloane & Celule</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rândurile (orizontale) și coloanele (verticale) se intersectează formând <strong>celule</strong>. Fiecare celulă este un recipient independent ce poate conține text, numere sau chiar imagini.
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
            <AlignRight className="w-5 h-5" />
            <span>Alinierea Numerelor la Dreapta</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Regulă matematică de aur: <strong>valorile numerice se aliniază obligatoriu la dreapta</strong>! Aceasta permite ca unitățile, zecile și virgulele zecimale să cadă exact unele sub altele.
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
            <Maximize className="w-5 h-5" />
            <span>Îmbinare Celule (Merge Cells)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Comandă care combină două sau mai multe celule adiacente într-o singură celulă mare. Se folosește pentru <strong>titlul general de deasupra coloanelor</strong> sau categorii comune.
          </p>
        </div>
      </div>

      {/* Interactive Table Designer Studio */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-teal-400 font-mono font-bold uppercase tracking-wider">Laborator Practic</span>
            <h2 className="text-xl font-black text-white">Atelier Interactiv: Optimizează Tabelul după Standardul Tipografic</h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">Scor Conformitate:</span>
            <span className={`text-xs font-bold font-mono ${
              criteriaMetCount === 4 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {criteriaMetCount} / 4 Standarde Aplicate
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Action Toolbar */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-300">Instrumente Ribbon Tabel (Design & Layout):</span>

            {/* Action 1: Merge Header */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsHeaderMerged(!isHeaderMerged);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                isHeaderMerged
                  ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">1. Îmbină Celule Titlu (Merge Cells)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Unește cele 5 căsuțe din rândul 1 într-o singură celulă centrată.
                </span>
              </div>
              {isHeaderMerged ? <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> : <Maximize className="w-5 h-5 text-slate-500 shrink-0" />}
            </button>

            {/* Action 2: Professional Alignment */}
            <button
              onClick={() => {
                sounds.playClick();
                setHasProfessionalAlignment(!hasProfessionalAlignment);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                hasProfessionalAlignment
                  ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">2. Aliniere Inteligentă a Datelor</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Textul la stânga, numerele la dreapta, capetele centrate.
                </span>
              </div>
              {hasProfessionalAlignment ? <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> : <AlignRight className="w-5 h-5 text-slate-500 shrink-0" />}
            </button>

            {/* Action 3: Header Shading */}
            <button
              onClick={() => {
                sounds.playClick();
                setHasHeaderShading(!hasHeaderShading);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                hasHeaderShading
                  ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">3. Umbrirea Capului de Tabel (Shading)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Aplică fundal contrastant pentru rândurile de antet.
                </span>
              </div>
              {hasHeaderShading ? <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> : <Sparkles className="w-5 h-5 text-slate-500 shrink-0" />}
            </button>

            {/* Action 4: Border Styling */}
            <button
              onClick={() => {
                sounds.playClick();
                setHasBordersStyled(!hasBordersStyled);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                hasBordersStyled
                  ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">4. Borduri Fine & Deschise (Clean Borders)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Înlocuiește grila greoaie cu linii fine orizontale aerisite.
                </span>
              </div>
              {hasBordersStyled ? <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> : <Grid className="w-5 h-5 text-slate-500 shrink-0" />}
            </button>
          </div>

          {/* Live Table Preview */}
          <div className="lg:col-span-8 flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 min-h-[380px]">
            <span className="text-xs font-mono text-slate-400 mb-4 self-start">
              Previzualizare Document Word • Modulul de Evaluare Școlară:
            </span>

            <div className="w-full bg-white rounded-xl shadow-xl p-6 text-slate-800 overflow-x-auto">
              <table
                className={`w-full text-xs transition-all duration-300 ${
                  hasBordersStyled
                    ? 'border-t-2 border-b-2 border-slate-900 border-collapse'
                    : 'border-collapse border-2 border-slate-400'
                }`}
              >
                {/* TITLE ROW */}
                <thead>
                  {isHeaderMerged ? (
                    <tr>
                      <th
                        colSpan={5}
                        className={`p-2.5 font-bold text-center text-sm ${
                          hasHeaderShading ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
                        } ${hasBordersStyled ? 'border-b border-slate-400' : 'border border-slate-400'}`}
                      >
                        SITUAȚIA BURSELOR DE PERFORMANȚĂ • SEMESTRUL I
                      </th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Titlu col 1</th>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Titlu col 2</th>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Titlu col 3</th>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Titlu col 4</th>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Titlu col 5</th>
                    </tr>
                  )}

                  {/* SUB-HEADER ROW */}
                  <tr className={`${
                    hasHeaderShading ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-slate-100 text-slate-700 font-semibold'
                  } ${hasBordersStyled ? 'border-b-2 border-slate-900' : ''}`}>
                    <th className={`p-2 ${hasProfessionalAlignment ? 'text-center' : 'text-left'} ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      Nr.
                    </th>
                    <th className={`p-2 ${hasProfessionalAlignment ? 'text-left' : 'text-center'} ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      Nume Elev
                    </th>
                    <th className={`p-2 text-left ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      Disciplina
                    </th>
                    <th className={`p-2 ${hasProfessionalAlignment ? 'text-right' : 'text-left'} ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      Punctaj
                    </th>
                    <th className={`p-2 ${hasProfessionalAlignment ? 'text-right' : 'text-left'} ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      Cuantum Bursă
                    </th>
                  </tr>
                </thead>

                {/* DATA BODY */}
                <tbody className="divide-y divide-slate-200">
                  {sampleData.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 1 && hasHeaderShading ? 'bg-slate-50' : 'bg-white'}
                    >
                      <td className={`p-2 ${hasProfessionalAlignment ? 'text-center font-mono text-slate-500' : 'text-left'} ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {row.nr}.
                      </td>
                      <td className={`p-2 font-medium text-slate-900 ${hasProfessionalAlignment ? 'text-left' : 'text-center'} ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {row.nume}
                      </td>
                      <td className={`p-2 text-slate-600 ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {row.disciplina}
                      </td>
                      <td className={`p-2 font-mono font-bold ${
                        hasProfessionalAlignment ? 'text-right text-emerald-700' : 'text-left'
                      } ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {row.punctaj}
                      </td>
                      <td className={`p-2 font-mono ${
                        hasProfessionalAlignment ? 'text-right font-bold text-slate-800' : 'text-left'
                      } ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {row.bursa}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {criteriaMetCount === 4 && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Formatare impecabilă! Tabelul respectă toate standardele de publicație academică și lizibilitate.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Quiz */}
      <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-teal-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-xl font-black text-white font-heading">
            Verificarea Cunoștințelor • Reguli Tipografice de Tabele
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message="Timp de reflecție: reamintește-ți termenii de bază ai structurii tabelare!"
          />
          <span className="text-sm font-bold text-slate-200">
            1. Cum se numesc elementele orizontale, respectiv verticale ale unui tabel și căsuțele rezultate la intersecția lor?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Paragrafe, Linii și Spații' },
              { id: 'b', label: 'Rânduri (linii), Coloane și Celule' },
              { id: 'c', label: 'Cadre, Diapozitive și Butoane' },
              { id: 'd', label: 'Foldere, Fișiere și Căi' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q1') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q1Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="Orizontal = rând, Vertical = coloană, căsuța individuală = celulă." />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation="Corect! Structura de bază a oricărui tabel este compusă din rânduri (orizontale), coloane (verticale) și celule (la intersecția lor)."
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message="Timp de reflecție: gândește-te cum aduni două numere pe o foaie de matematică!"
          />
          <span className="text-sm font-bold text-slate-200">
            2. De ce este o regulă obligatorie ca valorile numerice (note, sume de bani, măsurători) să fie aliniate la Dreapta într-o coloană?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Pentru că tastatura scrie doar de la stânga spre dreapta' },
              { id: 'b', label: 'Pentru a ascunde virgula zecimală de cititor' },
              { id: 'c', label: 'Pentru ca unitățile, zecile și virgulele zecimale să fie aliniate vertical una sub alta' },
              { id: 'd', label: 'Pentru a permite imprimantei să consume mai puțin tuș negru' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q2') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q2Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="Dacă aliniezi numerele la stânga, 1000 și 10 vor părea decalate; alinierea la dreapta păstrează coloana unităților curată." />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation="Exact! Alinierea la dreapta a numerelor este standardul internațional contabil și științific, permițând compararea instantanee a ordinelor de mărime (unități sub unități, zeci sub zeci)."
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message="Timp de reflecție: amintește-ți comanda dedicată pentru combinarea mai multor celule!"
          />
          <span className="text-sm font-bold text-slate-200">
            3. Ce comandă din fila Machetare Tabel (Table Layout) se folosește pentru a uni celulele din primul rând într-o singură celulă mare de titlu?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Îmbinare celule (Merge Cells)' },
              { id: 'b', label: 'Divizare celule (Split Cells)' },
              { id: 'c', label: 'Distribuire rânduri în mod egal' },
              { id: 'd', label: 'Conversie tabel în text' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q3')}
                onClick={() => handleSelectAnswer('q3', opt.id, 'a')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'a'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q3') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q3Answer === opt.id && (opt.id === 'a' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="„Merge” înseamnă a contopi / a îmbina mai multe elemente într-unul singur." />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation="Corect! Comanda Îmbinare celule (Merge Cells) unește celulele selectate, permițând titlurilor să ocupe armonios întreaga lățime a tabelului."
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={allCorrect}
        onNext={() => {
          sounds.playFanfare();
          onCompletePage(calculateScore());
        }}
        promptText={allCorrect ? 'Ai stăpânit tabelele profesionale! Treci la Note de Subsol & Note de Final!' : 'Răspunde corect la cele 3 întrebări de verificare pentru a debloca nivelul următor!'}
      />
    </div>
  );
};
