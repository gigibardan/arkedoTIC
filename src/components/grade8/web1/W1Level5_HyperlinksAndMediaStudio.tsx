import React, { useState } from 'react';
import {
  Link2,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Eye,
  Sliders,
  Code2,
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

interface W1Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const W1Level5_HyperlinksAndMediaStudio: React.FC<W1Level5Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

  // Link Simulator State
  const [targetBlank, setTargetBlank] = useState(true);
  const [linkText, setLinkText] = useState(
    lang === 'en' ? 'Open the ArkyEdu Platform' : 'Deschide Platforma ArkyEdu'
  );
  const [linkUrl, setLinkUrl] = useState('https://www.arkyedu.ro');
  const [tooltipTitle, setTooltipTitle] = useState(
    lang === 'en'
      ? 'Interactive robotics & computer science platform'
      : 'Platformă interactivă de robotică și informatică'
  );

  // Image Simulator State
  const [simulateBrokenImage, setSimulateBrokenImage] = useState(false);
  const [altText, setAltText] = useState(
    lang === 'en'
      ? 'Educational programmable robot with ultrasonic sensors'
      : 'Robot educațional programabil cu senzori ultrasonici'
  );
  const [imageWidth, setImageWidth] = useState(240);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

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

  const quizDone = Object.keys(quizSubmitted).length >= 2;

  // Generated code strings
  const anchorCode = `<a href="${linkUrl}"${targetBlank ? ' target="_blank"' : ''} title="${tooltipTitle}">
  ${linkText}
</a>`;

  const imageCode = `<img src="${simulateBrokenImage ? 'wrong_path/deleted_robot.png' : '/assets/educational_robot.png'}" 
     alt="${altText}" 
     width="${imageWidth}">`;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Pages 42–43' : 'Manual Art Klett 2025 • Pag. 42–43'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Link2 className="w-8 h-8 text-cyan-400" />
              {lang === 'en'
                ? 'Level 5: Hyperlinks & Multimedia Images (Interactive Web)'
                : 'Nivelul 5: Hiperlegături & Imagini Multimedia (Web Interactiv)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Transform static text into an interactive network: configure the <a> tag with href and target attributes, and embed images with essential alt attributes for accessibility.'
                : 'Transformă un text static într-o rețea interactivă: configurează eticheta <a> cu atributele href și target, și integrează imagini cu atributul esențial alt pentru accesibilitate.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-cyan-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Standard W3C</div>
            <div className="text-2xl font-black text-cyan-400">&lt;a&gt; &amp; &lt;img&gt;</div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Multimedia Elements' : 'Elemente Multimedia'}
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Interactive Hyperlink Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Link2 className="w-4 h-4" />
            {lang === 'en'
              ? '1. Hyperlink Simulator (<a href="...">)'
              : '1. Simulator de Hiperlegătură (<a href="...">)'}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {lang === 'en' ? 'Textbook p. 42' : 'Manual pag. 42'}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'en'
                  ? 'Anchor Text (visible underlined label):'
                  : 'Textul Ancoră (ce se afișează subliniat):'}
              </label>
              <input
                type="text"
                value={linkText}
                onChange={e => setLinkText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'en' ? 'Destination Address (href):' : 'Adresa Destinație (href):'}
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-300">
                {lang === 'en'
                  ? 'Open in new tab (target="_blank"):'
                  : 'Deschide în filă nouă (target="_blank"): '}
              </span>
              <button
                onClick={() => { sounds.playClick(); setTargetBlank(!targetBlank); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  targetBlank ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {targetBlank
                  ? (lang === 'en' ? 'ACTIVE (_blank)' : 'ACTIVAT (_blank)')
                  : (lang === 'en' ? 'INACTIVE (same tab)' : 'DEZACTIVAT (aceeași filă)')}
              </button>
            </div>
          </div>

          {/* Generated Code & Visual Result */}
          <div className="space-y-3">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-200">
              <div className="text-[10px] text-slate-500 uppercase mb-1">
                {lang === 'en' ? 'Generated HTML Code:' : 'Cod HTML Generat:'}
              </div>
              <pre className="whitespace-pre-wrap">{anchorCode}</pre>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-300 text-slate-900 flex items-center justify-center">
              <a
                href="#demo"
                onClick={e => { e.preventDefault(); sounds.playClick(); }}
                title={tooltipTitle}
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 underline font-semibold text-sm cursor-pointer"
              >
                {linkText}
                {targetBlank && <ExternalLink className="w-3.5 h-3.5" />}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Interactive Image & Accessibility Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" />
            {lang === 'en'
              ? '2. Image Insertion & Accessibility Test (<img src="..." alt="...">)'
              : '2. Inserarea Imaginilor & Testul de Accesibilitate (<img src="..." alt="...">)'}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {lang === 'en' ? 'Textbook p. 43' : 'Manual pag. 43'}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'en'
                  ? 'Alternative Text (alt attribute for accessibility):'
                  : 'Text Alternativ (Atributul alt pentru accesibilitate):'}
              </label>
              <input
                type="text"
                value={altText}
                onChange={e => setAltText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-300">
                {lang === 'en' ? 'Simulate missing file / broken link:' : 'Simulează fișier șters / link corupt:'}
              </span>
              <button
                onClick={() => { sounds.playClick(); setSimulateBrokenImage(!simulateBrokenImage); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  simulateBrokenImage ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {simulateBrokenImage
                  ? (lang === 'en' ? '404 Broken Link ON' : 'Simulare Eroare 404 ON')
                  : (lang === 'en' ? 'Valid Image (OK)' : 'Imagine Validă')}
              </button>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300 leading-relaxed">
              <strong>{lang === 'en' ? 'Why is "alt" vital?' : 'De ce este esențial „alt”?'}</strong>{' '}
              {lang === 'en'
                ? 'If the image fails to load or if a visually impaired student uses a screen reader, the browser reads the text inside alt in place of the graphic!'
                : 'Dacă imaginea nu se poate încărca sau dacă pagina este citită de un utilizator cu deficiențe de vedere prin screen-reader, browserul citește textul din alt în locul imaginii!'}
            </div>
          </div>

          {/* Generated Code & Image Render */}
          <div className="space-y-3">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-200">
              <div className="text-[10px] text-slate-500 uppercase mb-1">
                {lang === 'en' ? 'Generated HTML Code:' : 'Cod HTML Generat:'}
              </div>
              <pre className="whitespace-pre-wrap">{imageCode}</pre>
            </div>

            {/* Live Render Area */}
            <div className="bg-white p-4 rounded-xl border border-slate-300 text-slate-900 flex items-center justify-center min-h-[140px]">
              {!simulateBrokenImage ? (
                <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Educational_Robot.png (OK)</span>
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-rose-300 bg-rose-50 rounded-xl text-center space-y-1 w-full">
                  <div className="text-rose-500 text-xs font-bold flex items-center justify-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {lang === 'en' ? 'Broken Image (404 Not Found)' : 'Imagine nedescărcată (Broken Link)'}
                  </div>
                  <div className="text-xs text-slate-700 font-medium italic">
                    {lang === 'en' ? `Fallback Alt Display: "${altText}"` : `Afișare text alternativ: „${altText}”`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Hypertext & Web Accessibility'
                : 'Reflecție Pedagogică: Hipertext & Accesibilitate Web'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Art Klett Manual pages 42–43' : 'Manual Art Klett pag. 42–43'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '1. What happens when a user clicks a hyperlink configured with target="_blank"?'
              : <>1. Ce se întâmplă când un utilizator face click pe un link definit cu atributul <code className="text-cyan-400 font-mono">target="_blank"</code>?</>}
          </div>
          <QuestionHint
            hintRo="Termenul „blank” indică o filă goală nouă."
            hintEn="The term 'blank' suggests a fresh new tab."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Pagina destinație se deschide într-o filă nouă (sau fereastră separată), lăsând pagina curentă deschisă în continuare',
                textEn: 'The destination page opens in a new browser tab (or separate window), leaving the current page open in place',
                correct: true
              },
              {
                textRo: 'Linkul deschide automat calculatorul de buzunar',
                textEn: 'The link automatically launches the desktop calculator',
                correct: false
              },
              {
                textRo: 'Browserul închide toate conexiunile și se oprește',
                textEn: 'The browser closes all connections and terminates',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w1_l5_q1';
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
          {isLocked('w1_l5_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l5_q1'] || 0} />
          )}
          {quizSubmitted['w1_l5_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Textbook page 42: target="_blank" is the standard attribute used for external links to avoid navigating visitors away from your own site.'
                : 'Corect! Manual pag. 42: target="_blank" este atributul standard utilizat pentru legături externe pentru a nu pierde vizitatorul de pe propriul site.'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. Why does the <img> tag lack a closing </img> tag in standard HTML5?'
              : <>2. De ce eticheta <code className="text-emerald-400 font-mono">&lt;img&gt;</code> nu are o etichetă de închidere <code className="text-slate-400 font-mono">&lt;/img&gt;</code>?</>}
          </div>
          <QuestionHint
            hintRo="Este o etichetă vidă (void element / self-closing)."
            hintEn="It is a void element / self-closing tag."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Pentru că <img> este o etichetă vidă (autoînchizătoare) care nu conține text în interior, toate datele (sursa, descrierea, dimensiunile) fiind transmise prin atribute (src, alt, width)',
                textEn: 'Because <img> is a void (self-closing) element containing no inner text nodes; all parameters (source, description, dimensions) are passed via attributes (src, alt, width)',
                correct: true
              },
              {
                textRo: 'Pentru că dezvoltatorii web au uitat să creeze eticheta de închidere',
                textEn: 'Because browser creators forgot to implement a closing tag',
                correct: false
              },
              {
                textRo: 'Pentru că imaginile ocupă prea multă memorie',
                textEn: 'Because images consume too much system memory',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w1_l5_q2';
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
          {isLocked('w1_l5_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l5_q2'] || 0} />
          )}
          {quizSubmitted['w1_l5_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exactly! Textbook page 43: Tags like <img>, <br>, or <hr> are void elements with no inner body. In HTML5 they are written simply as <img> without a closing partner.'
                : 'Exact! Manual pag. 43: Etichetele precum <img>, <br> sau <hr> sunt etichete vide (fără conținut intern). În HTML5 se scriu simplu <img> fără etichetă de închidere.'}
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={quizDone}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel={lang === 'en'
          ? 'To Level 6: HTML Code Inspector & Bug Clinic'
          : 'Spre Nivelul 6: Clinica de Depanare a Codului HTML'}
      />
    </div>
  );
};
