import React, { useState } from 'react';
import {
  FileCode,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  BookMarked,
  Layers,
  ArrowRight,
  Bookmark,
  CheckSquare,
  Square
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level2_HeaderFooterNumbering: React.FC<W2Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Book Layout Simulator State
  const [differentFirstPage, setDifferentFirstPage] = useState<boolean>(true);
  const [differentOddEven, setDifferentOddEven] = useState<boolean>(true);
  const [numberingFormat, setNumberingFormat] = useState<'simple' | 'extended' | 'roman'>('extended');
  const [headerTitle, setHeaderTitle] = useState<string>('Tehnoredactare Digitală • Clasa a VII-a');
  const [authorName, setAuthorName] = useState<string>('Redacția Școlară');
  const [activePreviewPage, setActivePreviewPage] = useState<number>(1);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const totalPages = 4;

  const getPageNumberText = (pageNum: number) => {
    if (pageNum === 1 && differentFirstPage) {
      return ''; // Cover has no visible page number
    }
    if (numberingFormat === 'simple') {
      return `${pageNum}`;
    }
    if (numberingFormat === 'extended') {
      return `Pagina ${pageNum} din ${totalPages}`;
    }
    // roman
    const rom = ['', 'I', 'II', 'III', 'IV'][pageNum] || `${pageNum}`;
    return `- ${rom} -`;
  };

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

  const isQ1Correct = q1Answer === 'c';
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
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-blue-900/40 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>Misiunea 1B • Nivelul 2 din 7</span>
              <span>•</span>
              <span>Manual pag. 20-22</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Arhitectura Antet & Subsol și Numerotarea Automată
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Învață cum să structurezi profesional cărțile și referatele: de ce numerele de pagină nu se tastează niciodată de mână, cum eliminăm numerotarea de pe copertă cu <code className="text-indigo-300 font-mono">Different First Page</code> și cum aliniem numerele pe marginea exterioară a paginilor deschise.
            </p>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400 self-start sm:self-auto">
            <BookMarked className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Theory Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Bookmark className="w-5 h-5" />
            <span>Zona de Antet (Header)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Apare în marginea de sus a fiecărei pagini. Conține titlul lucrării, capitolul sau autorul. Se accesează cu <strong>dublu-clic în partea de sus</strong> a oricărei pagini din Word.
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
            <FileCode className="w-5 h-5" />
            <span>Câmpuri Dinamice vs Text Static</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dacă tastezi cifra „1” în subsol, Word o va multiplica pe <strong>toate paginile</strong>! Numerotarea se face exclusiv prin câmpuri automate (Page Number), calculate în direct de procesor.
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-pink-400 font-bold mb-2">
            <Layers className="w-5 h-5" />
            <span>Pagini Pare și Impare Diferite</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Într-o carte deschisă, numărul de pagină trebuie să fie întotdeauna pe <strong>marginea exterioară</strong> (la stânga pe paginile pare, la dreapta pe paginile impare), vizibil când răsfoiești rapid.
          </p>
        </div>
      </div>

      {/* Interactive Book & Header/Footer Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider">Laborator Practic</span>
            <h2 className="text-xl font-black text-white">Simulator de Publicație: Carte Deschisă & Reguli de Paginare</h2>
          </div>

          {/* Quick Page Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 px-2 font-medium">Navighează:</span>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => {
                  sounds.playClick();
                  setActivePreviewPage(p);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activePreviewPage === p
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pagina {p} {p === 1 ? '(Copertă)' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Settings Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-300">Opțiuni Avansate Word (Ribbon Antet & Subsol):</span>

              {/* Checkbox 1: Different First Page */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setDifferentFirstPage(!differentFirstPage);
                }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 transition text-left cursor-pointer"
              >
                <div className="mt-0.5 text-indigo-400">
                  {differentFirstPage ? <CheckSquare className="w-5 h-5 text-indigo-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Primă pagină diferită (Different First Page)</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Elimină antetul și numărul de pagină de pe copertă sau foaia de gardă.
                  </span>
                </div>
              </button>

              {/* Checkbox 2: Different Odd & Even Pages */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setDifferentOddEven(!differentOddEven);
                }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 transition text-left cursor-pointer"
              >
                <div className="mt-0.5 text-indigo-400">
                  {differentOddEven ? <CheckSquare className="w-5 h-5 text-indigo-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Pagini pare și impare diferite (Odd & Even)</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Permite numerotarea pe colțul exterior al cărții (stânga pe pare, dreapta pe impare).
                  </span>
                </div>
              </button>

              {/* Numbering Format Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Format Numerotare Câmp:</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-700">
                  {[
                    { id: 'simple', label: '1, 2, 3...' },
                    { id: 'extended', label: 'Pag. X din Y' },
                    { id: 'roman', label: 'I, II, III...' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => {
                        sounds.playClick();
                        setNumberingFormat(fmt.id as any);
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        numberingFormat === fmt.id
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Header Title Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Titlu în Antet:</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Interactive Visual Book Mockup */}
          <div className="lg:col-span-7 flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 min-h-[360px]">
            <div className="flex items-center justify-between w-full mb-3 text-xs text-slate-400 font-mono">
              <span>Examinare: Pagina {activePreviewPage} {activePreviewPage === 1 ? '— Copertă' : (activePreviewPage % 2 === 0 ? '— Pagină Pară (Verso)' : '— Pagină Impară (Recto)')}</span>
              <span className="text-indigo-400 font-bold">
                {activePreviewPage === 1 && differentFirstPage ? 'Copertă Protejată' : 'Pagină Structurată'}
              </span>
            </div>

            {/* Rendered Physical Page */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 text-slate-800 relative flex flex-col justify-between min-h-[290px] border border-slate-300">
              {/* HEADER AREA */}
              <div className="border-b border-dashed border-indigo-300 pb-2 flex items-center justify-between text-[11px] text-slate-500 font-serif">
                {activePreviewPage === 1 && differentFirstPage ? (
                  <span className="text-slate-400 italic text-[10px]">
                    [Antet ascuns: Opțiunea „Primă pagină diferită” este activată]
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-indigo-900 truncate max-w-[200px]">{headerTitle}</span>
                    <span className="text-[10px] text-slate-400">{authorName}</span>
                  </>
                )}
              </div>

              {/* PAGE BODY */}
              <div className="py-4 my-auto">
                {activePreviewPage === 1 ? (
                  <div className="text-center py-6">
                    <div className="text-xs uppercase tracking-widest text-indigo-600 font-bold mb-1">Portofoliu Școlar</div>
                    <h3 className="text-lg font-black text-slate-900 font-serif">Revista Digitală a Gimnaziului</h3>
                    <p className="text-xs text-slate-500 mt-2">Culegere de Articole și Tehnoredactare Profesională</p>
                    <div className="mt-4 text-[10px] text-slate-400 font-mono">
                      (Coperta nu trebuie să conțină număr de pagină tipărit!)
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-serif">
                    <p className="font-bold text-slate-900 text-sm">
                      Capitolul {activePreviewPage - 1}: Reguli de Structurare a Manuscrisului
                    </p>
                    <p className="indent-4 text-justify">
                      În publicațiile tipărite, antetul și subsolul ghidează cititorul prin volumul de pagini. Textul curge armonios, fără a interfera cu marginile rezervate.
                    </p>
                    <p className="indent-4 text-justify">
                      Prin setarea paginilor pare și impare diferite, numerotarea migrează automat spre latura opusă cotorului cărții.
                    </p>
                  </div>
                )}
              </div>

              {/* FOOTER AREA */}
              <div className="border-t border-dashed border-indigo-300 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-600">
                {activePreviewPage === 1 && differentFirstPage ? (
                  <span className="text-slate-400 italic text-[10px] w-full text-center">
                    [Fără număr pe copertă • Format profesional]
                  </span>
                ) : (
                  <>
                    {/* Position based on Odd/Even setting */}
                    {differentOddEven ? (
                      activePreviewPage % 2 === 0 ? (
                        <>
                          <span className="font-bold text-indigo-700">{getPageNumberText(activePreviewPage)}</span>
                          <span className="text-[10px] text-slate-400">ArkyEdu Gimnaziu</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] text-slate-400">ArkyEdu Gimnaziu</span>
                          <span className="font-bold text-indigo-700">{getPageNumberText(activePreviewPage)}</span>
                        </>
                      )
                    ) : (
                      <>
                        <span className="text-[10px] text-slate-400">ArkyEdu Gimnaziu</span>
                        <span className="font-bold text-indigo-700">{getPageNumberText(activePreviewPage)}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Antet & Subsol izolate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                Numerotare dinamică automată
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Quiz */}
      <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-indigo-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-xl font-black text-white font-heading">
            Verificarea Cunoștințelor • Reguli de Antet, Subsol & Numerotare
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message="Timp de reflecție: gândește-te ce se întâmplă dacă tastezi manual o cifră într-o zonă repetitivă a documentului!"
          />
          <span className="text-sm font-bold text-slate-200">
            1. De ce este o greșeală gravă să tastezi manual cifra „1” în subsolul paginii pentru a numerota documentul?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Pentru că imprimanta va refuza să printeze orice cifră' },
              { id: 'b', label: 'Pentru că dimensiunea fontului se va mări automat la 72 pt' },
              { id: 'c', label: 'Pentru că cifra „1” va apărea neschimbată pe absolut toate paginile documentului' },
              { id: 'd', label: 'Pentru că Word va șterge automat textul din tot documentul' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q1') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q1Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="Antetul și subsolul sunt zone repetitive. Orice caracter static tastat de mână se propagă automat pe fiecare pagină." />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation="Exact! Subsolul este o zonă repetitivă. Dacă scrii cifra „1” de la tastatură, pagina 2, 3, 10 vor avea toate scris „1”! Numerotarea corectă se inserează prin comanda Insert > Page Number (care introduce un câmp dinamic calculat automat)."
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message="Timp de reflecție: gândește-te la aspectul copertei unui referat sau al unei cărți tipărite!"
          />
          <span className="text-sm font-bold text-slate-200">
            2. Ce rol are opțiunea „Primă pagină diferită” (Different First Page) din fila Instrumente Antet și Subsol?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Transformă prima pagină într-o foaie de calcul Excel' },
              { id: 'b', label: 'Permite eliminarea antetului și a numărului de pagină de pe copertă fără a afecta restul paginilor' },
              { id: 'c', label: 'Inversează ordinea paginilor din document' },
              { id: 'd', label: 'Colorează prima pagină cu vopsea galbenă' },
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

          <QuestionHint hint="Coperta oricărei lucrări academice sau cărți nu are niciodată număr de pagină tipărit pe ea." />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation="Corect! Opțiunea „Primă pagină diferită” rupe legătura primei pagini de antetul și subsolul general, permițând ca pe copertă să avem un design curat, fără număr de pagină."
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message="Timp de reflecție: imaginează-ți că ții în mână o carte deschisă la mijloc!"
          />
          <span className="text-sm font-bold text-slate-200">
            3. De ce într-o carte tipărită activăm „Pagini pare și impare diferite” (Different Odd & Even)?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Pentru a schimba limba de redactare la fiecare pagină' },
              { id: 'b', label: 'Pentru a salva automat fișierul de două ori' },
              { id: 'c', label: 'Pentru a plasa numărul de pagină pe marginea exterioară (stânga pe pare, dreapta pe impare)' },
              { id: 'd', label: 'Pentru a interzice citirea paginilor pare pe ecran' },
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

          <QuestionHint hint="Când răsfoiești rapid o carte cu degetul mare, privirea ta urmărește colțul exterior, nu cotorul cărții." />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation="Excelent! La o carte tipărită, colțul exterior este la stânga pentru pagina din stânga (pagină pară) și la dreapta pentru pagina din dreapta (pagină impară). Această opțiune garantează că numărul nu ajunge prins în cotorul legat al cărții!"
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
        promptText={allCorrect ? 'Ai înțeles perfect antetul și subsolul! Treci la Ruperi de Secțiune!' : 'Răspunde corect la cele 3 întrebări de verificare pentru a debloca nivelul următor!'}
      />
    </div>
  );
};
