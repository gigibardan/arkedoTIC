import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  GraduationCap,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level7_LayoutExam: React.FC<W2Level7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState<string | null>(null);
  const [q5Answer, setQ5Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleSelectAnswer = (qKey: 'q1' | 'q2' | 'q3' | 'q4' | 'q5', answer: string, correct: string) => {
    if (isLocked(qKey)) return;

    if (qKey === 'q1') setQ1Answer(answer);
    if (qKey === 'q2') setQ2Answer(answer);
    if (qKey === 'q3') setQ3Answer(answer);
    if (qKey === 'q4') setQ4Answer(answer);
    if (qKey === 'q5') setQ5Answer(answer);

    if (answer === correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qKey);
    }
  };

  const isQ1Correct = q1Answer === 'b';
  const isQ2Correct = q2Answer === 'c';
  const isQ3Correct = q3Answer === 'b';
  const isQ4Correct = q4Answer === 'a';
  const isQ5Correct = q5Answer === 'c';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct, isQ4Correct, isQ5Correct].filter(Boolean).length;
  const allCorrect = correctCount === 5;

  const calculateFinalScore = () => {
    // 5 questions * 20 pts = 100 max score
    return correctCount * 20;
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900/50 via-indigo-900/50 to-blue-900/50 border border-sky-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>Misiunea 1B • Nivelul 7 din 7</span>
              <span>•</span>
              <span>Examen Final Sumativ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Marele Examen de Machetare & Tipografie Românească
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Demonstrează că stăpânești toate conceptele de tehnoredactare din clasa a VII-a: geometria paginii A4, marginea de îndosariere, antetul și subsolul cărților, ruperile de secțiune pentru documente hibride, tabelele profesionale și notele de subsol.
            </p>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-sky-400 self-start sm:self-auto">
            <Trophy className="w-10 h-10" />
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">Răspunsuri Corecte:</span>
          <span className={`font-black text-sm ${allCorrect ? 'text-emerald-400' : 'text-sky-300'}`}>
            {correctCount} / 5 Întrebări Rezolvate ({correctCount * 20} puncte)
          </span>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {/* Q1 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message="Timp de reflecție: reanalizează dimensiunile fizice A4 și rolul marginii de îndosariere!"
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>ÎNTREBAREA 1 DIN 5</span>
            <span>20 PUNCTE</span>
          </div>
          <span className="text-sm font-bold text-white">
            Care sunt dimensiunile formatului internațional A4 și ce rol îndeplinește „Marginea de îndosariere” (Gutter)?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              { id: 'a', label: '100 × 200 mm; lasă spațiu pentru imagini de fundal colorate' },
              { id: 'b', label: '210 × 297 mm; rezervă spațiu suplimentar în stânga/interior pentru perforare și legare în dosar' },
              { id: 'c', label: '216 × 279 mm; mărește automat spațiul dintre cuvintele fiecărui rând' },
              { id: 'd', label: '297 × 420 mm; forțează textul să fie scris cu litere majuscule' },
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
          <QuestionHint hint="210 x 297 mm este standardul A4; marginea de îndosariere previne tăierea textului de către inelele dosarului." />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation="Corect! Formatul A4 are 210 × 297 mm, iar marginea de îndosariere (Gutter margin) de 1–1.5 cm asigură spațiul fizic necesar găurilor perforatorului sau spiralei fără a afecta textul."
          />
        </div>

        {/* Q2 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message="Timp de reflecție: gândește-te la opțiunea Ribbon dedicată primei pagini dintr-un referat!"
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>ÎNTREBAREA 2 DIN 5</span>
            <span>20 PUNCTE</span>
          </div>
          <span className="text-sm font-bold text-white">
            Cum procedăm corect pentru a numerota automat un referat de 10 pagini fără ca numărul de pagină să apară pe copertă?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              { id: 'a', label: 'Tastăm de mână cifra 1 pe pagina 2, cifra 2 pe pagina 3 etc.' },
              { id: 'b', label: 'Ștergem manual numărul de pe copertă cu tasta Delete sau Backspace' },
              { id: 'c', label: 'Bifăm opțiunea „Primă pagină diferită” (Different First Page) din fila Antet și Subsol' },
              { id: 'd', label: 'Micșorăm marginea inferioară a copertei la 0 cm' },
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
          <QuestionHint hint="Dacă ștergi manual numărul dintr-un subsol comun, acesta se va șterge automat de pe toate paginile! Opțiunea dedicată este Different First Page." />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation="Excelent! Opțiunea „Primă pagină diferită” decuplează antetul și subsolul primei pagini de restul documentului, permițând ca pe copertă să nu apară numărul de pagină, în timp ce pagina 2 va continua numerotarea corectă."
          />
        </div>

        {/* Q3 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message="Timp de reflecție: amintește-ți de ce este nevoie de o barieră de secțiune pentru a schimba orientarea!"
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>ÎNTREBAREA 3 DIN 5</span>
            <span>20 PUNCTE</span>
          </div>
          <span className="text-sm font-bold text-white">
            Cum putem configura un document astfel încât doar Pagina 5 (ce conține un tabel amplu) să fie în Vedere (Landscape), iar restul paginilor să rămână în Portret?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              { id: 'a', label: 'Apăsăm Ctrl+Enter înainte și după tabel și alegem Landscape' },
              { id: 'b', label: 'Inserăm o Rupere de Secțiune: Pagina Următoare înainte și după Pagina 5, apoi rotim doar acea secțiune' },
              { id: 'c', label: 'Micșorăm dimensiunea fontului la 4 pt pentru a încăpea tabelul pe foaia verticală' },
              { id: 'd', label: 'Salvăm tabelul ca imagine PNG și îl rotim cu mouse-ul' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q3')}
                onClick={() => handleSelectAnswer('q3', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q3') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q3Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>
          <QuestionHint hint="Orientarea paginii este o proprietate a secțiunii. Numai Section Break (Next Page) izolează o pagină într-o secțiune de sine stătătoare." />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation="Corect! Doar Ruperile de Secțiune (Section Break - Next Page) permit schimbarea orientării fizice între Portret și Landscape pe parcursul aceluiași fișier Word."
          />
        </div>

        {/* Q4 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q4'] || 0}
            message="Timp de reflecție: reamintește-ți regula de aur a alinierii valorilor numerice!"
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>ÎNTREBAREA 4 DIN 5</span>
            <span>20 PUNCTE</span>
          </div>
          <span className="text-sm font-bold text-white">
            Care este standardul tipografic corect pentru alinierea valorilor numerice (note, prețuri, punctaje) într-un tabel?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              { id: 'a', label: 'Aliniate la Dreapta (Right Align), astfel încât unitățile, zecile și virgulele zecimale să se alinieze vertical' },
              { id: 'b', label: 'Aliniate obligatoriu la Stânga, la fel ca orice text narativ' },
              { id: 'c', label: 'Aliniate pe diagonală prin spații repetate' },
              { id: 'd', label: 'Scrise cu caractere minuscule fără punctuație' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q4')}
                onClick={() => handleSelectAnswer('q4', opt.id, 'a')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q4Answer === opt.id
                    ? opt.id === 'a'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q4') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q4Answer === opt.id && (opt.id === 'a' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>
          <QuestionHint hint="Alinierea la dreapta permite cititorului să compare instantaneu mărimile numerice." />
          <AnswerExplanation
            isCorrect={isQ4Correct}
            explanation="Exact! În orice tabel profesional, numerele se aliniază întotdeauna la Dreapta, garantând o citire clară și alinierea precisă a zecimalelor."
          />
        </div>

        {/* Q5 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q5'] || 0}
            message="Timp de reflecție: reamintește-ți diferența dintre Footnote și Endnote și scurtătura aferentă!"
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>ÎNTREBAREA 5 DIN 5</span>
            <span>20 PUNCTE</span>
          </div>
          <span className="text-sm font-bold text-white">
            Unde se afișează o Notă de Subsol (Footnote) în comparație cu o Notă de Final (Endnote) și ce scurtătură se folosește în Word?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              { id: 'a', label: 'Ambele apar în meniul Fișier; scurtătura este Ctrl + P' },
              { id: 'b', label: 'Nota de subsol este pe copertă, iar nota de final în bara de căutare; scurtătura este F1' },
              { id: 'c', label: 'Nota de subsol este la baza paginii curente (Alt+Ctrl+F); nota de final este colectată la sfârșitul lucrării' },
              { id: 'd', label: 'Nota de subsol se șterge automat la tipărire; scurtătura este Shift + Esc' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q5')}
                onClick={() => handleSelectAnswer('q5', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q5Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q5') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q5Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>
          <QuestionHint hint="Alt + Ctrl + F introduce instant nota la baza paginii curente (Footnote)." />
          <AnswerExplanation
            isCorrect={isQ5Correct}
            explanation="Corect! Nota de subsol (Footnote, Alt+Ctrl+F) apare la baza paginii curente sub linia de separare de 5 cm, în timp ce nota de final (Endnote) este centralizată la sfârșitul întregului document."
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={allCorrect}
        onNext={() => {
          sounds.playFanfare();
          onCompletePage(calculateFinalScore());
        }}
        promptText={
          allCorrect
            ? 'Felicitări depline! Ai obținut punctaj maxim la Examenul de Machetare! Apasă pentru a revendica Marea Diplomă a Misiunii 1B!'
            : `Răspunde corect la toate cele 5 întrebări ale examenului pentru a primi diploma! (${correctCount}/5 corecte).`
        }
      />
    </div>
  );
};
