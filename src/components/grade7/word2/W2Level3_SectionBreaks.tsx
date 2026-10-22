import React, { useState } from 'react';
import {
  SplitSquareVertical,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  Scissors,
  ArrowRight,
  FileSpreadsheet,
  Columns,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level3_SectionBreaks: React.FC<W2Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Multi-Section Architecture Lab State
  // Page 1: Portrait (Intro)
  // Page 2: Portrait (Text)
  // Page 3: The Wide Data Table (Target for Landscape!)
  // Page 4: Portrait (Conclusions)
  const [hasSectionBreakBeforeP3, setHasSectionBreakBeforeP3] = useState<boolean>(false);
  const [hasSectionBreakAfterP3, setHasSectionBreakAfterP3] = useState<boolean>(false);
  const [p3Orientation, setP3Orientation] = useState<'portrait' | 'landscape'>('portrait');
  const [activeViewPage, setActiveViewPage] = useState<number>(3);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // If user tries to rotate P3 without section breaks, what happens?
  // In Word without section break, changing orientation changes the ENTIRE document!
  const isDocumentBroken = p3Orientation === 'landscape' && (!hasSectionBreakBeforeP3 || !hasSectionBreakAfterP3);
  const isHybridDocumentPerfect = p3Orientation === 'landscape' && hasSectionBreakBeforeP3 && hasSectionBreakAfterP3;

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

  const isQ1Correct = q1Answer === 'a';
  const isQ2Correct = q2Answer === 'b';
  const isQ3Correct = q3Answer === 'c';
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
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>Misiunea 1B • Nivelul 3 din 7</span>
              <span>•</span>
              <span>Manual pag. 22-24</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Ruperi de Secțiune vs Ruperi de Pagină
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Învață secretul documentelor complexe hibride: de ce o simplă rupere de pagină (<code className="text-purple-300 font-mono">Ctrl+Enter</code>) nu poate roti o singură pagină în Landscape și cum izolăm tabelele largi folosind <code className="text-cyan-300 font-mono">Section Break (Next Page)</code>.
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400 self-start sm:self-auto">
            <SplitSquareVertical className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Theory Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Scissors className="w-5 h-5" />
            <span>Rupere de Pagină (Page Break)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Se introduce instant cu <strong>Ctrl + Enter</strong>. Forțează textul să continue pe o pagină nouă curată, dar <strong>păstrează aceleași margini, orientare și antet</strong> pentru întregul fișier.
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
            <SplitSquareVertical className="w-5 h-5" />
            <span>Rupere Secțiune: Pagina Următoare</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Creează o barieră completă de configurare. Doar o secțiune nouă poate avea <strong>orientare diferită (Vedere/Landscape)</strong>, numerotare repornită de la 1 sau margini unice!
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
            <Columns className="w-5 h-5" />
            <span>Rupere Secțiune Continuă</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nu trece pe o pagină nouă, ci împarte aceeași foaie! Esențială când vrei ca titlul să fie pe o coloană lată, iar articolul de dedesubt să fie <strong>aranjat pe 2 coloane paralele de ziar</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Multi-Section Hybrid Document Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider">Laborator Practic</span>
            <h2 className="text-xl font-black text-white">Misiune: Rotește doar Pagina 3 cu Tabelul în Landscape!</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Examinare:</span>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => {
                  sounds.playClick();
                  setActiveViewPage(p);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeViewPage === p
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800'
                }`}
              >
                P{p} {p === 3 ? '(Tabel)' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls & Tools */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col gap-3.5">
              <span className="text-xs font-bold text-slate-300">Instrumente Machetare & Ruperi:</span>

              {/* Step 1: Break before P3 */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setHasSectionBreakBeforeP3(!hasSectionBreakBeforeP3);
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  hasSectionBreakBeforeP3
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">1. Inserează Rupere Secțiune ÎNAINTE de Pagina 3</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Separă pagina 2 de pagina 3 într-o secțiune autonomă.
                  </span>
                </div>
                {hasSectionBreakBeforeP3 ? <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /> : <Scissors className="w-5 h-5 text-slate-500 shrink-0" />}
              </button>

              {/* Step 2: Rotate P3 */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-300 block mb-2">2. Orientare Pagina 3:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setP3Orientation('portrait');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      p3Orientation === 'portrait' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Portret (210 mm)
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setP3Orientation('landscape');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      p3Orientation === 'landscape' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Vedere (297 mm) 📐
                  </button>
                </div>
              </div>

              {/* Step 3: Break after P3 */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setHasSectionBreakAfterP3(!hasSectionBreakAfterP3);
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  hasSectionBreakAfterP3
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">3. Inserează Rupere Secțiune DUPĂ Pagina 3</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Permite Paginii 4 (Concluzii) să revină la orientarea verticală Portret.
                  </span>
                </div>
                {hasSectionBreakAfterP3 ? <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /> : <Scissors className="w-5 h-5 text-slate-500 shrink-0" />}
              </button>
            </div>

            {/* Diagnostic Message */}
            {isDocumentBroken && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <strong className="block font-bold">Eroare tipică în Word!</strong>
                  Ai rotit pagina în Landscape fără ambele Ruperi de Secțiune. Fără secțiuni izolate, Word va roti automat întregul referat sau va lăsa pagina 4 decuplată incorect!
                </div>
              </div>
            )}

            {isHybridDocumentPerfect && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <div>
                  <strong className="block font-bold">Document Hibrid Impecabil! 🎉</strong>
                  Pagina 1 și 2 sunt în Portret, Pagina 3 cu tabelul amplu este izolată în Landscape, iar Pagina 4 revine la Portret. O realizare de profesionist!
                </div>
              </div>
            )}
          </div>

          {/* Interactive Document Flow Mockup */}
          <div className="lg:col-span-7 flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 min-h-[380px]">
            <span className="text-xs font-mono text-slate-400 mb-4">
              Harta Secțiunilor Documentului (Vizualizare de Ansamblu):
            </span>

            {/* Thumbnail representation of all 4 pages */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mb-6">
              {[1, 2, 3, 4].map((pNum) => {
                const isP3 = pNum === 3;
                const isLand = isP3 && p3Orientation === 'landscape' && hasSectionBreakBeforeP3;
                const isCorrupted = isDocumentBroken;

                return (
                  <div
                    key={pNum}
                    onClick={() => {
                      sounds.playClick();
                      setActiveViewPage(pNum);
                    }}
                    className={`flex flex-col items-center p-2 rounded-xl border transition cursor-pointer ${
                      activeViewPage === pNum
                        ? 'border-purple-400 bg-purple-950/30'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`bg-white rounded shadow text-[6px] text-slate-800 p-1 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                        isLand
                          ? 'w-16 h-11'
                          : isCorrupted && p3Orientation === 'landscape'
                          ? 'w-16 h-11 bg-rose-50'
                          : 'w-11 h-16'
                      }`}
                    >
                      <div className="font-bold border-b border-slate-300 pb-0.5 truncate">
                        P{pNum}: {pNum === 1 ? 'Intro' : pNum === 2 ? 'Text' : pNum === 3 ? 'Tabel' : 'Concluzii'}
                      </div>
                      <div className="space-y-0.5 my-auto">
                        <div className="h-0.5 bg-slate-300 rounded w-full"></div>
                        <div className="h-0.5 bg-slate-300 rounded w-4/5"></div>
                      </div>
                      <div className="text-[5px] text-right text-slate-400 font-mono">
                        {pNum}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2">
                      {isLand ? 'Landscape 📐' : 'Portrait 📄'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Zoomed Detailed View of Selected Page */}
            <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  Pagina {activeViewPage}: {activeViewPage === 3 ? 'Tabel Date Olimpiade (Lățime mare)' : 'Conținut Standard'}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {activeViewPage === 3 && p3Orientation === 'landscape' && hasSectionBreakBeforeP3 && hasSectionBreakAfterP3
                    ? 'Secțiunea 2 • Landscape (297 mm)'
                    : 'Secțiunea 1 • Portrait (210 mm)'}
                </span>
              </div>

              {activeViewPage === 3 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left border-collapse border border-slate-700">
                    <thead>
                      <tr className="bg-slate-800 text-cyan-300">
                        <th className="border border-slate-700 p-1.5">Elev</th>
                        <th className="border border-slate-700 p-1.5">Clasa</th>
                        <th className="border border-slate-700 p-1.5">Disciplina</th>
                        <th className="border border-slate-700 p-1.5">Punctaj</th>
                        <th className="border border-slate-700 p-1.5">Premiu</th>
                        <th className="border border-slate-700 p-1.5">Calificare Națională</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr>
                        <td className="border border-slate-700 p-1.5">Popescu Andrei</td>
                        <td className="border border-slate-700 p-1.5">7A</td>
                        <td className="border border-slate-700 p-1.5">Informatică & TIC</td>
                        <td className="border border-slate-700 p-1.5 font-mono text-emerald-400">98.50</td>
                        <td className="border border-slate-700 p-1.5">Premiul I</td>
                        <td className="border border-slate-700 p-1.5 text-cyan-400 font-bold">DA</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-700 p-1.5">Ionescu Elena</td>
                        <td className="border border-slate-700 p-1.5">7B</td>
                        <td className="border border-slate-700 p-1.5">Informatică & TIC</td>
                        <td className="border border-slate-700 p-1.5 font-mono text-emerald-400">95.00</td>
                        <td className="border border-slate-700 p-1.5">Premiul II</td>
                        <td className="border border-slate-700 p-1.5 text-cyan-400 font-bold">DA</td>
                      </tr>
                    </tbody>
                  </table>
                  <span className="text-[10px] text-slate-400 block mt-2 italic">
                    Acest tabel are 6 coloane dense. Pe formatul vertical (Portret) textul s-ar fi înghesuit inestetic!
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-300 text-xs">
                  <p>
                    Textul din pagina {activeViewPage} curge în format Portret standard, cu marginile clasice de 2.54 cm.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Datorită ruperilor de secțiune, modificarea paginii 3 nu a afectat alinierea acestor paragrafe.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Quiz */}
      <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-indigo-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-xl font-black text-white font-heading">
            Verificarea Cunoștințelor • Ruperi de Secțiune & Pagină
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message="Timp de reflecție: amintește-ți scurtătura universală de rupere de pagină curată!"
          />
          <span className="text-sm font-bold text-slate-200">
            1. Care este combinația rapidă de taste pentru inserarea unei Ruperi de Pagină (Page Break) în Word?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Ctrl + Enter' },
              { id: 'b', label: 'Shift + Space' },
              { id: 'c', label: 'Alt + F4' },
              { id: 'd', label: 'Ctrl + Alt + Delete' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id, 'a')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'a'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q1') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q1Answer === opt.id && (opt.id === 'a' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="Tastează Ctrl concomitent cu tasta Enter pentru a trece instant pe foaia nouă fără să apeși Enter de 20 de ori." />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation="Corect! Ctrl + Enter este comanda rapidă standard pentru inserarea unei ruperi de pagină curate (Page Break)."
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message="Timp de reflecție: gândește-te ce se întâmplă dacă documentul conține o singură secțiune globală!"
          />
          <span className="text-sm font-bold text-slate-200">
            2. Ce se întâmplă dacă încerci să schimbi orientarea unei singure pagini în Vedere (Landscape) fără a insera Ruperi de Secțiune?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Procesorul Word se va închide forțat cu eroare critică' },
              { id: 'b', label: 'Toate paginile din întregul document se vor roti automat în Landscape' },
              { id: 'c', label: 'Doar imaginile din pagină se vor roti cu 90 de grade' },
              { id: 'd', label: 'Numerele de pagină se vor șterge automat' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q2') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q2Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="În Word, orientarea și marginile sunt proprietăți definite la nivel de secțiune, nu la nivel de pagină individuală!" />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation="Exact! Orientarea paginii este o proprietate a secțiunii. Dacă nu creezi o secțiune nouă cu Section Break (Next Page), comanda de orientare se va propaga peste tot documentul!"
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message="Timp de reflecție: gândește-te la o rupere care nu sare pe pagina următoare, ci continuă pe aceeași foaie!"
          />
          <span className="text-sm font-bold text-slate-200">
            3. Ce tip de rupere de secțiune se folosește când vrem ca titlul să ocupe toată lățimea paginii, iar textul de dedesubt să fie împărțit pe 2 coloane pe aceeași foaie?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Rupere de pagină simplă (Page Break)' },
              { id: 'b', label: 'Rupere de coloană (Column Break)' },
              { id: 'c', label: 'Rupere de secțiune Continuă (Continuous Section Break)' },
              { id: 'd', label: 'Rupere de paragraf forțată (Shift + Enter)' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q3')}
                onClick={() => handleSelectAnswer('q3', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q3') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q3Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="Termenul „Continuu” indică faptul că secțiunea nouă începe pe același rând al foii curente, fără a forța o pagină albă nouă." />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation="Corect! Ruperea de secțiune Continuă (Continuous) permite schimbarea numărului de coloane (de la 1 la 2 sau 3) pe exact aceeași pagină, tehnica de bază folosită la machetarea ziarelor și revistelor."
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
        promptText={allCorrect ? 'Ai stăpânit ruperile de secțiune! Treci la Tabele Profesionale!' : 'Răspunde corect la cele 3 întrebări de verificare pentru a debloca nivelul următor!'}
      />
    </div>
  );
};
