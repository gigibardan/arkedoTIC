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
      return lang === 'ro'
        ? `Pagina ${pageNum} din ${totalPages}`
        : `Page ${pageNum} of ${totalPages}`;
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
              <span>{lang === 'ro' ? 'Misiunea 1B • Nivelul 2 din 7' : 'Mission 1B • Level 2 of 7'}</span>
              <span>•</span>
              <span>{lang === 'ro' ? 'Manual pag. 20-22' : 'Textbook pp. 20-22'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Arhitectura Antet & Subsol și Numerotarea Automată'
                : 'Header & Footer Architecture & Automated Numbering'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              {lang === 'ro'
                ? 'Învață cum să structurezi profesional cărțile și referatele: de ce numerele de pagină nu se tastează niciodată de mână, cum eliminăm numerotarea de pe copertă cu Different First Page și cum aliniem numerele pe marginea exterioară a paginilor deschise.'
                : 'Learn how to professionally structure books and reports: why page numbers must never be typed manually, how to remove numbering from covers using Different First Page, and how to align page numbers along outer margins.'}
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
            <span>{lang === 'ro' ? 'Zona de Antet (Header)' : 'Header Zone (Top Margin)'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Apare în marginea de sus a fiecărei pagini. Conține titlul lucrării, capitolul sau autorul. Se accesează cu dublu-clic în partea de sus a oricărei pagini din Word.'
              : 'Appears in the top margin of every page. Contains paper title, chapter, or author. Accessed via double-clicking the top edge of any page in Word.'}
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
            <FileCode className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Câmpuri Dinamice vs Text Static' : 'Dynamic Fields vs Static Text'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Dacă tastezi cifra „1” în subsol, Word o va multiplica pe toate paginile! Numerotarea se face exclusiv prin câmpuri automate (Page Number), calculate în direct de procesor.'
              : 'If you type the number “1” into the footer, Word duplicates it across every single page! Real numbering relies solely on dynamic Page Number fields computed live by the processor.'}
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-pink-400 font-bold mb-2">
            <Layers className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Pagini Pare și Impare Diferite' : 'Different Odd & Even Pages'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Într-o carte deschisă, numărul de pagină trebuie să fie întotdeauna pe marginea exterioară (la stânga pe paginile pare, la dreapta pe paginile impare), vizibil când răsfoiești rapid.'
              : 'In an open book, page numbers must always sit along the outer margin (left on even pages, right on odd pages), clearly visible when flipping through sheets.'}
          </p>
        </div>
      </div>

      {/* Interactive Book & Header/Footer Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider">
              {lang === 'ro' ? 'Laborator Practic' : 'Hands-on Lab'}
            </span>
            <h2 className="text-xl font-black text-white">
              {lang === 'ro'
                ? 'Simulator de Publicație: Carte Deschisă & Reguli de Paginare'
                : 'Publication Simulator: Open Book & Page Numbering Rules'}
            </h2>
          </div>

          {/* Quick Page Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 px-2 font-medium">
              {lang === 'ro' ? 'Navighează:' : 'Navigate:'}
            </span>
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
                {lang === 'ro'
                  ? `Pagina ${p} ${p === 1 ? '(Copertă)' : ''}`
                  : `Page ${p} ${p === 1 ? '(Cover)' : ''}`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Settings Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-300">
                {lang === 'ro'
                  ? 'Opțiuni Avansate Word (Ribbon Antet & Subsol):'
                  : 'Advanced Word Options (Header & Footer Ribbon):'}
              </span>

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
                  <span className="text-xs font-bold text-white block">
                    {lang === 'ro'
                      ? 'Primă pagină diferită (Different First Page)'
                      : 'Different First Page'}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {lang === 'ro'
                      ? 'Elimină antetul și numărul de pagină de pe copertă sau foaia de gardă.'
                      : 'Suppresses the header and page number on the cover or title page.'}
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
                  <span className="text-xs font-bold text-white block">
                    {lang === 'ro'
                      ? 'Pagini pare și impare diferite (Odd & Even)'
                      : 'Different Odd & Even Pages'}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {lang === 'ro'
                      ? 'Permite numerotarea pe colțul exterior al cărții (stânga pe pare, dreapta pe impare).'
                      : 'Enables page numbering on the outside edge (left for even, right for odd pages).'}
                  </span>
                </div>
              </button>

              {/* Numbering Format Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {lang === 'ro' ? 'Format Numerotare Câmp:' : 'Numbering Field Format:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-700">
                  {[
                    { id: 'simple', label: '1, 2, 3...' },
                    { id: 'extended', label: lang === 'ro' ? 'Pag. X din Y' : 'Page X of Y' },
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'ro' ? 'Titlu în Antet:' : 'Header Title Text:'}
                </label>
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
              <span>
                {lang === 'ro' ? 'Examinare: Pagina ' : 'Inspection: Page '}
                {activePreviewPage}{' '}
                {activePreviewPage === 1
                  ? (lang === 'ro' ? '— Copertă' : '— Cover')
                  : activePreviewPage % 2 === 0
                  ? (lang === 'ro' ? '— Pagină Pară (Verso)' : '— Even Page (Verso)')
                  : (lang === 'ro' ? '— Pagină Impară (Recto)' : '— Odd Page (Recto)')}
              </span>
              <span className="text-indigo-400 font-bold">
                {activePreviewPage === 1 && differentFirstPage
                  ? (lang === 'ro' ? 'Copertă Protejată' : 'Protected Cover')
                  : (lang === 'ro' ? 'Pagină Structurată' : 'Structured Page')}
              </span>
            </div>

            {/* Rendered Physical Page */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 text-slate-800 relative flex flex-col justify-between min-h-[290px] border border-slate-300">
              {/* HEADER AREA */}
              <div className="border-b border-dashed border-indigo-300 pb-2 flex items-center justify-between text-[11px] text-slate-500 font-serif">
                {activePreviewPage === 1 && differentFirstPage ? (
                  <span className="text-slate-400 italic text-[10px]">
                    {lang === 'ro'
                      ? '[Antet ascuns: Opțiunea „Primă pagină diferită” este activată]'
                      : '[Header hidden: “Different First Page” option is active]'}
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
                    <div className="text-xs uppercase tracking-widest text-indigo-600 font-bold mb-1">
                      {lang === 'ro' ? 'Portofoliu Școlar' : 'Academic Portfolio'}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 font-serif">
                      {lang === 'ro' ? 'Revista Digitală a Gimnaziului' : 'Middle School Digital Journal'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">
                      {lang === 'ro'
                        ? 'Culegere de Articole și Tehnoredactare Profesională'
                        : 'Curated Essays & Professional Typesetting'}
                    </p>
                    <div className="mt-4 text-[10px] text-slate-400 font-mono">
                      {lang === 'ro'
                        ? '(Coperta nu trebuie să conțină număr de pagină tipărit!)'
                        : '(Covers must never show a printed page number!)'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-serif">
                    <p className="font-bold text-slate-900 text-sm">
                      {lang === 'ro'
                        ? `Capitolul ${activePreviewPage - 1}: Reguli de Structurare a Manuscrisului`
                        : `Chapter ${activePreviewPage - 1}: Manuscript Structuring Rules`}
                    </p>
                    <p className="indent-4 text-justify">
                      {lang === 'ro'
                        ? 'În publicațiile tipărite, antetul și subsolul ghidează cititorul prin volumul de pagini. Textul curge armonios, fără a interfera cu marginile rezervate.'
                        : 'In printed books, headers and footers gently guide the reader across page ranges. Body text flows harmoniously without colliding with reserved margins.'}
                    </p>
                    <p className="indent-4 text-justify">
                      {lang === 'ro'
                        ? 'Prin setarea paginilor pare și impare diferite, numerotarea migrează automat spre latura opusă cotorului cărții.'
                        : 'By designating different odd and even pages, numbering automatically migrates to the outer edge away from the binding.'}
                    </p>
                  </div>
                )}
              </div>

              {/* FOOTER AREA */}
              <div className="border-t border-dashed border-indigo-300 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-600">
                {activePreviewPage === 1 && differentFirstPage ? (
                  <span className="text-slate-400 italic text-[10px] w-full text-center">
                    {lang === 'ro'
                      ? '[Fără număr pe copertă • Format profesional]'
                      : '[No number on cover • Professional format]'}
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
                {lang === 'ro' ? 'Antet & Subsol izolate' : 'Isolated Header & Footer'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                {lang === 'ro' ? 'Numerotare dinamică automată' : 'Dynamic Automated Numbering'}
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
            {lang === 'ro'
              ? 'Verificarea Cunoștințelor • Reguli de Antet, Subsol & Numerotare'
              : 'Knowledge Check • Headers, Footers & Numbering Rules'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: gândește-te ce se întâmplă dacă tastezi manual o cifră într-o zonă repetitivă a documentului!'
                : 'Reflection time: think about what happens when you type a static character into a recurring document zone!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '1. De ce este o greșeală gravă să tastezi manual cifra „1” în subsolul paginii pentru a numerota documentul?'
              : '1. Why is it a serious mistake to manually type the digit "1" in the page footer to number a document?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Pentru că imprimanta va refuza să printeze orice cifră',
                labelEn: 'Because printers refuse to print numeric digits',
              },
              {
                id: 'b',
                labelRo: 'Pentru că dimensiunea fontului se va mări automat la 72 pt',
                labelEn: 'Because the font size blows up to 72 pt automatically',
              },
              {
                id: 'c',
                labelRo: 'Pentru că cifra „1” va apărea neschimbată pe absolut toate paginile documentului',
                labelEn: 'Because the digit "1" will appear unchanged across every single page of the document',
              },
              {
                id: 'd',
                labelRo: 'Pentru că Word va șterge automat textul din tot documentul',
                labelEn: 'Because Word will automatically delete all document body text',
              },
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
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q1Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Antetul și subsolul sunt zone repetitive. Orice caracter static tastat de mână se propagă automat pe fiecare pagină.'
                : 'Headers and footers are repeating template zones. Any static text typed by hand repeats on every page.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation={
              lang === 'ro'
                ? 'Exact! Subsolul este o zonă repetitivă. Dacă scrii cifra „1” de la tastatură, pagina 2, 3, 10 vor avea toate scris „1”! Numerotarea corectă se inserează prin comanda Insert > Page Number (care introduce un câmp dinamic calculat automat).'
                : 'Exactly! Footers are recurring templates. Typing "1" will make pages 2, 3, and 10 all display "1"! Real numbering is inserted via Insert > Page Number (which inserts a dynamic, auto-computed field).'
            }
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: gândește-te la aspectul copertei unui referat sau al unei cărți tipărite!'
                : 'Reflection time: think about the look of an essay or book cover!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '2. Ce rol are opțiunea „Primă pagină diferită” (Different First Page) din fila Instrumente Antet și Subsol?'
              : '2. What is the role of the "Different First Page" option in the Header & Footer tools?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Transformă prima pagină într-o foaie de calcul Excel',
                labelEn: 'Converts the first page into an Excel spreadsheet',
              },
              {
                id: 'b',
                labelRo: 'Permite eliminarea antetului și a numărului de pagină de pe copertă fără a afecta restul paginilor',
                labelEn: 'Allows removing headers and page numbers from the cover without affecting subsequent pages',
              },
              {
                id: 'c',
                labelRo: 'Inversează ordinea paginilor din document',
                labelEn: 'Reverses the overall page sequence in the document',
              },
              {
                id: 'd',
                labelRo: 'Colorează prima pagină cu vopsea galbenă',
                labelEn: 'Fills the first page with yellow ink',
              },
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
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q2Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Coperta oricărei lucrări academice sau cărți nu are niciodată număr de pagină tipărit pe ea.'
                : 'The cover of any book or academic paper never shows a printed page number.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation={
              lang === 'ro'
                ? 'Corect! Opțiunea „Primă pagină diferită” rupe legătura primei pagini de antetul și subsolul general, permițând ca pe copertă să avem un design curat, fără număr de pagină.'
                : 'Correct! "Different First Page" breaks the first page’s link to default headers/footers, allowing a clean cover design free of page numbers.'
            }
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: imaginează-ți că ții în mână o carte deschisă la mijloc!'
                : 'Reflection time: picture holding an open book spread in your hands!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '3. De ce într-o carte tipărită activăm „Pagini pare și impare diferite” (Different Odd & Even)?'
              : '3. Why do we activate "Different Odd & Even Pages" in a printed book?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Pentru a schimba limba de redactare la fiecare pagină',
                labelEn: 'To alternate languages on alternating pages',
              },
              {
                id: 'b',
                labelRo: 'Pentru a salva automat fișierul de două ori',
                labelEn: 'To auto-save the document twice',
              },
              {
                id: 'c',
                labelRo: 'Pentru a plasa numărul de pagină pe marginea exterioară (stânga pe pare, dreapta pe impare)',
                labelEn: 'To position page numbers on the outer edge (left on even, right on odd pages)',
              },
              {
                id: 'd',
                labelRo: 'Pentru a interzice citirea paginilor pare pe ecran',
                labelEn: 'To forbid reading even pages on digital screens',
              },
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
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q3Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Când răsfoiești rapid o carte cu degetul mare, privirea ta urmărește colțul exterior, nu cotorul cărții.'
                : 'When thumbing quickly through a book, your eye follows the outer edges, not the bound spine.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation={
              lang === 'ro'
                ? 'Excelent! La o carte tipărită, colțul exterior este la stânga pentru pagina din stânga (pagină pară) și la dreapta pentru pagina din dreapta (pagină impară). Această opțiune garantează că numărul nu ajunge prins în cotorul legat al cărții!'
                : 'Excellent! In print layouts, the outer margin is on the left for even pages and on the right for odd pages. This prevents page numbers from getting swallowed by the binding!'
            }
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
        promptText={
          allCorrect
            ? (lang === 'ro' ? 'Ai înțeles perfect antetul și subsolul! Treci la Ruperi de Secțiune!' : 'You understood headers and footers perfectly! Proceed to Section Breaks!')
            : (lang === 'ro' ? 'Răspunde corect la cele 3 întrebări de verificare pentru a debloca nivelul următor!' : 'Answer all 3 verification questions correctly to unlock the next level!')
        }
      />
    </div>
  );
};
