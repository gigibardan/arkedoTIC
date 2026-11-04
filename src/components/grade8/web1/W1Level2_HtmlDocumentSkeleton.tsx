import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  Terminal,
  Eye,
  FileCode,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W1Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const W1Level2_HtmlDocumentSkeleton: React.FC<W1Level2Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

  // Skeleton assembly state
  const [assembledTags, setAssembledTags] = useState<string[]>([
    '<!DOCTYPE html>'
  ]);

  const [pageTitle, setPageTitle] = useState(lang === 'en' ? 'My Web Project' : 'Proiectul Meu Web');
  const [bodyText, setBodyText] = useState(
    lang === 'en'
      ? 'Hello, world! This is my first HTML5 page.'
      : 'Salut, lume! Aceasta este prima mea pagină HTML5.'
  );

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const requiredPieces = [
    {
      tag: `<html lang="${lang === 'en' ? 'en' : 'ro'}">`,
      descRo: 'Elementul rădăcină (Root) care cuprinde întreaga pagină',
      descEn: 'The root element wrapping the entire web page'
    },
    {
      tag: '<head>',
      descRo: 'Zona tehnică de metadate invizibile direct pe pagină',
      descEn: 'The technical metadata zone invisible directly on the rendered page'
    },
    {
      tag: `<title>${pageTitle}</title>`,
      descRo: 'Titlul afișat pe fila browserului',
      descEn: 'The title displayed on the browser tab'
    },
    {
      tag: '</head>',
      descRo: 'Închiderea zonei tehnice',
      descEn: 'Closing of the technical head zone'
    },
    {
      tag: '<body>',
      descRo: 'Începutul conținutului vizual al paginii',
      descEn: 'Opening tag of the page visual body content'
    },
    {
      tag: `<h1>${bodyText}</h1>`,
      descRo: 'Titlul principal vizibil în corpul paginii',
      descEn: 'Primary headline visible in the body'
    },
    {
      tag: '</body>',
      descRo: 'Închiderea corpului paginii',
      descEn: 'Closing of the visual body'
    },
    {
      tag: '</html>',
      descRo: 'Închiderea documentului HTML',
      descEn: 'Closing of the root HTML document'
    }
  ];

  const handleAddNextPiece = () => {
    sounds.playClick();
    const nextIdx = assembledTags.length - 1;
    if (nextIdx < requiredPieces.length) {
      const nextPiece = requiredPieces[nextIdx].tag;
      setAssembledTags(prev => [...prev, nextPiece]);
      sounds.playCorrect();
    }
  };

  const handleResetSkeleton = () => {
    sounds.playClick();
    setAssembledTags(['<!DOCTYPE html>']);
  };

  const handleQuizAnswer = (qId: string, optIdx: number, isCorrect: boolean) => {
    if (quizSubmitted[qId] || isLocked(qId)) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const isSkeletonComplete = assembledTags.length === requiredPieces.length + 1;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = isSkeletonComplete && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/70 via-indigo-950/40 to-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Pages 38–39' : 'Manual Art Klett 2025 • Pag. 38–39'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Code2 className="w-8 h-8 text-sky-400" />
              {lang === 'en'
                ? 'Level 2: Canonical Skeleton of an HTML5 Document'
                : 'Nivelul 2: Scheletul Canonic al Documentului HTML5'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Every web page on Earth adheres to the exact same foundational structure: DOCTYPE declaration, root html element, technical head metadata, and visual body content.'
                : 'Fiecare pagină de pe glob respectă aceeași structură fundamentală: declarația DOCTYPE, elementul rădăcină html, antetul tehnic head și corpul vizual body.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-sky-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Skeleton Progress' : 'Progres Schelet'}
            </div>
            <div className="text-2xl font-black text-sky-400">{assembledTags.length}/{requiredPieces.length + 1}</div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Tags Assembled' : 'Etichete Asamblate'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Code Lab & Split View */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'HTML5 Construction Studio (Split-Screen)'
                  : 'Atelierul de Construcție HTML5 (Split-Screen)'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Assemble the canonical skeleton and observe live rendering in the simulated browser'
                  : 'Asamblează scheletul canonic și observă randarea live în browser'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSkeletonComplete ? (
              <button
                onClick={handleAddNextPiece}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-300" />
                {lang === 'en' ? 'Add Next Tag' : 'Adaugă Eticheta Următoare'}
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'en' ? 'Valid & Complete HTML5 Skeleton' : 'Schelet HTML5 Valid & Complet'}
              </span>
            )}
            <button
              onClick={handleResetSkeleton}
              className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs text-slate-400 cursor-pointer"
            >
              {lang === 'en' ? 'Reset' : 'Reia'}
            </button>
          </div>
        </div>

        {/* Split Screen: Editor HTML (Left) vs Browser Simulator (Right) */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Editor Window */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900 text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-sky-400" /> index.html
              </span>
              <span className="text-[10px]">HTML5 Standard</span>
            </div>

            <div className="space-y-1 text-slate-300 min-h-[220px]">
              {assembledTags.map((line, idx) => {
                const isDoctype = line.includes('!DOCTYPE');
                const isHead = line.includes('head') || line.includes('title');
                const isBody = line.includes('body') || line.includes('h1');

                let lineIndent = 'pl-0';
                if (line.includes('title') || line.includes('h1')) lineIndent = 'pl-8';
                else if (line.includes('head') || line.includes('body')) lineIndent = 'pl-4';

                return (
                  <div key={idx} className={`flex items-center gap-3 ${lineIndent} hover:bg-slate-900/60 py-0.5 rounded px-1`}>
                    <span className="text-slate-600 text-[10px] w-4 text-right select-none">{idx + 1}</span>
                    <span className={
                      isDoctype ? 'text-amber-400 font-bold' :
                      isHead ? 'text-sky-300' :
                      isBody ? 'text-emerald-300' :
                      'text-indigo-400 font-semibold'
                    }>
                      {line}
                    </span>
                  </div>
                );
              })}

              {!isSkeletonComplete && (
                <div className="text-slate-600 italic text-[11px] pt-2 pl-7 animate-pulse">
                  {lang === 'en'
                    ? '// Click "Add Next Tag" for the next structural element...'
                    : '// Apasă „Adaugă Eticheta Următoare” pentru pasul următor...'}
                </div>
              )}
            </div>
          </div>

          {/* Browser Preview Window */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            {/* Browser Window Header */}
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="bg-slate-950 px-3 py-1 rounded-md text-[11px] font-mono text-slate-300 flex items-center gap-2 max-w-[200px] truncate border border-slate-800">
                <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="truncate">
                  {assembledTags.some(t => t.includes('title'))
                    ? pageTitle
                    : (lang === 'en' ? 'Untitled Page' : 'Fără Titlu (Untitled)')}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">127.0.0.1</span>
            </div>

            {/* Browser Rendered Content (Body) */}
            <div className="p-6 bg-white text-slate-900 flex-1 min-h-[190px] flex flex-col justify-center">
              {assembledTags.some(t => t.includes('h1')) ? (
                <div className="space-y-3">
                  <h1 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">
                    {bodyText}
                  </h1>
                  <p className="text-xs text-slate-600">
                    {lang === 'en'
                      ? 'This is the visual content rendered by the browser engine from inside the <body> tag.'
                      : 'Acesta este conținutul vizual randat de motorul browserului din eticheta <body>.'}
                  </p>
                </div>
              ) : (
                <div className="text-center text-slate-400 text-xs italic">
                  {lang === 'en'
                    ? 'The <body> section is still empty or unmounted.'
                    : 'Corpul paginii <body> este încă gol sau neasamblat.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Input Controls to show dynamic binding */}
        {isSkeletonComplete && (
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'en'
                  ? 'Edit title in <title> (Browser tab bar):'
                  : 'Modifică titlul din <title> (Bara de file a browserului):'}
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={e => setPageTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'en'
                  ? 'Edit text in <h1> (Visible page body):'
                  : 'Modifică titlul din <h1> (Corpul vizibil al paginii):'}
              </label>
              <input
                type="text"
                value={bodyText}
                onChange={e => setBodyText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Hierarchy & Role of Fundamental Tags'
                : 'Reflecție Pedagogică: Ierarhia și Rolul Etichetelor Fundamentale'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Art Klett Manual pages 38–39' : 'Manual Art Klett pag. 38–39'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '1. Where is the text enclosed between paired <title>...</title> tags displayed?'
              : <>1. Unde este afișat textul cuprins între etichetele pereche <code className="text-sky-300 font-mono">&lt;title&gt;...&lt;/title&gt;</code>?</>}
          </div>
          <QuestionHint
            hintRo="Verifică antetul ferestrei browserului și fila activă de sus."
            hintEn="Check the browser window header and active top tab."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Pe bara de titlu sau pe fila (tab-ul) deschisă în browserul web, și nu pe suprafața paginii albe',
                textEn: 'On the title bar or active tab opened in the web browser, rather than on the white page body surface',
                correct: true
              },
              {
                textRo: 'În mijlocul paginii cu litere îngroșate de culoare roșie',
                textEn: 'In the middle of the page with bold red font',
                correct: false
              },
              {
                textRo: 'În subsolul paginii ca notă de final',
                textEn: 'At the bottom footer of the page as a footnote',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w1_l2_q1';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l2_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l2_q1'] || 0} />
          )}
          {quizSubmitted['w1_l2_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Textbook page 39: The <title> tag must be nested inside <head> and dictates the browser tab label, while also being indexed by search engines (Google).'
                : 'Corect! Manual pag. 39: Eticheta <title> se plasează obligatoriu în interiorul <head> și dă denumirea filei din browser, fiind utilizată și de motoarele de căutare (Google).'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. What purpose does the <!DOCTYPE html> declaration serve at the very first line of any web document?'
              : <>2. Ce rol are declarația <code className="text-amber-300 font-mono">&lt;!DOCTYPE html&gt;</code> plasată pe prima linie a oricărui document web?</>}
          </div>
          <QuestionHint
            hintRo="DOCTYPE vine de la Document Type Definition."
            hintEn="DOCTYPE stands for Document Type Definition."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Informează browserul că fișierul este scris conform standardului modern HTML5, asigurând interpretarea și randarea corectă a etichetelor',
                textEn: 'Informs the browser that the file adheres to the modern HTML5 standard, ensuring standard rendering compliance',
                correct: true
              },
              {
                textRo: 'Criptează fișierul cu o parolă secretă',
                textEn: 'Encrypts the file with a secret password',
                correct: false
              },
              {
                textRo: 'Conectează automat computerul la o imprimantă wireless',
                textEn: 'Automatically connects the computer to a wireless printer',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w1_l2_q2';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l2_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l2_q2'] || 0} />
          )}
          {quizSubmitted['w1_l2_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exactly! Textbook page 38: <!DOCTYPE html> is the mandatory initial preamble specifying the document language specification and triggering standards mode.'
                : 'Exact! Manual pag. 38: <!DOCTYPE html> este instrucțiunea inițială obligatorie care specifică versiunea limbajului și comută browserul în modul standard de afișare.'}
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canFinish}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel={lang === 'en'
          ? 'To Level 3: Headings Hierarchy & Paragraphs'
          : 'Spre Nivelul 3: Ierarhia Titlurilor & Paragrafe'}
      />
    </div>
  );
};
