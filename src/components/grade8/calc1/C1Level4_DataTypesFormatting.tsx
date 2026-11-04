import React, { useState } from 'react';
import {
  Binary,
  AlignLeft,
  AlignRight,
  DollarSign,
  Percent,
  Calendar,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  Type
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C1Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C1Level4_DataTypesFormatting: React.FC<C1Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Column width slider simulator (Manual pag. 16 - #### phenomenon)
  const [colWidth, setColWidth] = useState<number>(140); // in px; when < 100, trigger '####'

  // Formatting studio
  const [appliedFormat, setAppliedFormat] = useState<'general' | 'currency' | 'percent' | 'decimals'>('currency');
  const [sampleValue, setSampleValue] = useState<number>(149.99);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'right') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'currencyFormat') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'tooNarrow') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'right';
  const isQ2Correct = q2Answer === 'currencyFormat';
  const isQ3Correct = q3Answer === 'tooNarrow';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  const isOverflowing = colWidth < 105;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-emerald-950/40 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Textbook 2025 • pp. 15–17' : 'Manual Art Klett 2025 • Pag. 15–17'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Binary className="w-8 h-8 text-teal-400" />
              {lang === 'en' ? 'Level 4: Data Types, Number Formatting & the #### Symbol' : 'Nivelul 4: Tipuri de Date, Formatare & Simbolul ####'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'How does Excel distinguish text from numeric values? Why should you never type currency labels directly, and what does the cryptic "####" cell indicator mean?'
                : 'Cum recunoaște Excel textele și numerele? De ce nu scriem „150 lei” direct de la tastatură și ce înseamnă misteriosul simbol „####” apărut într-o celulă?'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Current Step' : 'Pas Curent'}</div>
            <div className="text-2xl font-black text-teal-400">4 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Experiment 1: The #### Column Width Phenomenon (Manual pag. 16) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en' ? 'Lab: The Mystery of the "####" Symbol' : 'Laborator: Misterul Simbolului „####”'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Adjust column width slider to simulate and fix the textbook phenomenon'
                  : 'Ajustează lățimea coloanei din glisor pentru a reproduce și repara comportamentul din manual'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { sounds.playClick(); setColWidth(150); }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition cursor-pointer flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Autofit (Double-click divider)' : 'Autofit (Dublu-clic pe separator)'}</span>
          </button>
        </div>

        {/* Live Width Slider */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">{lang === 'en' ? 'Column B Width Slider:' : 'Glisor Lățime Coloană B:'}</span>
            <span className="text-amber-300 font-bold">{colWidth} {lang === 'en' ? 'pixels' : 'pixeli'}</span>
          </div>
          <input
            type="range"
            min={50}
            max={220}
            value={colWidth}
            onChange={(e) => setColWidth(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>{lang === 'en' ? '50px (Too narrow)' : '50px (Prea îngustă)'}</span>
            <span>{lang === 'en' ? '105px (Critical threshold)' : '105px (Prag critic)'}</span>
            <span>{lang === 'en' ? '220px (Spacious)' : '220px (Spațioasă)'}</span>
          </div>
        </div>

        {/* Simulated Sheet Table with Dynamic Column B Width */}
        <div className="border border-slate-700 rounded-2xl overflow-x-auto bg-slate-950 font-mono text-xs shadow-inner">
          <div className="flex bg-slate-900 border-b border-slate-800 font-bold text-center">
            <div className="w-12 p-2 border-r border-slate-800 bg-slate-850 text-slate-500">◢</div>
            <div className="w-40 p-2 border-r border-slate-800 text-slate-400">{lang === 'en' ? 'Column A' : 'Coloana A'}</div>
            <div
              style={{ width: `${colWidth}px` }}
              className="p-2 border-r border-slate-800 bg-amber-500/20 text-amber-200 transition-all duration-75 relative group text-center"
            >
              {lang === 'en' ? 'Column B' : 'Coloana B'}
              <span className="text-[9px] block text-amber-400/80 font-normal">({colWidth}px)</span>
            </div>
            <div className="flex-1 p-2 text-slate-400 text-left pl-4">{lang === 'en' ? 'Column C (Explanation)' : 'Coloana C (Explicație)'}</div>
          </div>

          <div className="flex border-b border-slate-850 items-center">
            <div className="w-12 p-3 border-r border-slate-850 text-center bg-slate-900 font-bold text-slate-400">1</div>
            <div className="w-40 p-3 border-r border-slate-850 text-slate-300">{lang === 'en' ? 'Total Budget 2026' : 'Buget Total 2026'}</div>
            <div
              style={{ width: `${colWidth}px` }}
              className={`p-3 border-r border-slate-850 text-right font-bold transition-all duration-75 ${
                isOverflowing ? 'bg-rose-500/20 text-rose-300 tracking-widest' : 'bg-emerald-500/10 text-emerald-300'
              }`}
            >
              {isOverflowing ? '######' : (lang === 'en' ? '$2,845,900.00' : '2.845.900,00 lei')}
            </div>
            <div className="flex-1 p-3 text-slate-400 text-xs pl-4 font-sans">
              {isOverflowing ? (
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {lang === 'en'
                    ? 'Number overflow! Excel renders pound signs to protect you from misreading truncated numbers.'
                    : 'Numărul nu are loc! Excel pune diezuri pentru a te proteja de citirea trunchiată a sumei.'}
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {lang === 'en' ? 'Optimal width. Value is fully and accurately displayed.' : 'Lățime optimă. Valoarea este afișată complet și corect.'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">{lang === 'en' ? 'Textbook Explanation (p. 16):' : 'Explicația din Manual (pag. 16):'}</strong>{' '}
          {lang === 'en'
            ? 'The "####" indicator is not a mathematical calculation error! Excel intentionally refuses to truncate numbers (e.g., displaying "2845" instead of "2,845,900", which would cause dangerous accounting errors). The fix is instant: expand the column width!'
            : 'Simbolul #### nu este o eroare matematică! Excel refuză să taie jumătate dintr-un număr (de exemplu, să afișeze doar „2845” în loc de „2.845.900 lei”, ceea ce ar induce utilizatorul în eroare). Remedierea este simplă: mărești lățimea coloanei!'}
        </div>
      </div>

      {/* Interactive Experiment 2: Text vs Number & The Currency Trap (Manual pag. 15) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Curriculum Trap: Text vs Currency' : 'Capcana Manualului: Text vs Monedă'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Why you should never type currency unit names from the keyboard inside data cells'
                : 'De ce nu scriem niciodată cuvântul „lei” de la tastatură în interiorul celulei'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wrong way */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <XCircle className="w-4 h-4" />
              {lang === 'en' ? 'WRONG METHOD: Directly typing "$150" or "150 USD"' : 'Metoda GREȘITĂ: „150 lei” tastat direct'}
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs flex justify-between items-center">
              <span className="text-slate-400">{lang === 'en' ? 'Cell A1:' : 'Celula A1:'}</span>
              <span className="text-rose-300 font-bold bg-rose-500/10 px-2 py-1 rounded">
                {lang === 'en' ? '150 USD (LEFT aligned)' : '150 lei (Aliniat STÂNGA)'}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs flex justify-between items-center">
              <span className="text-slate-400">{lang === 'en' ? 'Formula: =A1 + 50' : 'Formula: =A1 + 50'}</span>
              <span className="text-rose-400 font-bold bg-rose-500/20 px-2 py-1 rounded">
                {lang === 'en' ? 'ERROR: #VALUE!' : 'EROARE: #VALUE!'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Because it contains alphabetic characters, Excel parses the cell as pure text and strictly rejects mathematical calculations.'
                : 'Deoarece conține literele „l-e-i”, Excel consideră conținutul ca fiind text pur și refuză să facă adunări sau înmulțiri matematice cu el.'}
            </p>
          </div>

          {/* Right way */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'en' ? 'CORRECT METHOD: Pure Number + Currency Formatting' : 'Metoda CORECTĂ: Valoare numerică + Format Monedă'}
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs flex justify-between items-center">
              <span className="text-slate-400">{lang === 'en' ? 'Typed in cell:' : 'Tastat în celulă:'}</span>
              <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                {lang === 'en' ? '150 (RIGHT aligned)' : '150 (Aliniat DREAPTA)'}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs flex justify-between items-center">
              <span className="text-slate-400">{lang === 'en' ? 'Rendered display:' : 'Afișat după formatare:'}</span>
              <span className="text-teal-300 font-bold bg-teal-500/20 px-2 py-1 rounded">
                {lang === 'en' ? '$150.00 (Valid Number)' : '150,00 lei (Număr valid)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'The format visually renders the currency symbol, but memory stores a pure number, allowing seamless arithmetic operations and totals.'
                : 'Formatul aplică vizual simbolul monetar, dar în memoria calculatorului valoarea rămâne pur numerică, permițând calcule și sume perfecte.'}
            </p>
          </div>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Pedagogical Check: Data Types & Formatting' : 'Verificare Pedagogică: Tipuri de Date & Formatare'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Answer all 3 curriculum questions correctly to advance' : 'Răspunde corect la cele 3 întrebări din programa națională'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. How are numbers and text aligned by default inside an Excel cell?'
                : '1. Cum sunt aliniate în mod implicit (automat) numerele și textele într-o celulă Excel?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'right', text: lang === 'en' ? 'Text is aligned to the LEFT, while numbers align to the RIGHT' : 'Textele sunt aliniate la STÂNGA, iar valorile numerice la DREAPTA' },
              { id: 'invert', text: lang === 'en' ? 'Text is aligned to the RIGHT, while numbers align to the LEFT' : 'Textele sunt aliniate la DREAPTA, iar numerele la STÂNGA' },
              { id: 'center', text: lang === 'en' ? 'All data is strictly forced to the exact center of the worksheet' : 'Toate datele sunt aliniate obligatoriu la centrul exact al foii' },
              { id: 'random', text: lang === 'en' ? 'Alignment is random depending on system clock' : 'Alinierea este aleatorie în funcție de ora din zi' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'right'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint={lang === 'en' ? 'Think about arithmetic addition: units and tens places need to align on the right margin.' : 'Gândește-te la operațiile matematice: cifrele unităților și zecilor trebuie să se alinieze la dreapta.'} />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={lang === 'en'
                ? 'Correct! By default, strings (text) align to the left, while numeric values align to the right, ensuring proper vertical place-value alignment (units, tens, hundreds).'
                : 'Corect! În mod implicit, șirurile de caractere (text) se aliniază la stânga, iar numerele și sumele la dreapta, pentru ca ordinele de mărime (unități, zeci, sute) să fie aliniate pe verticală.'}
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. According to curriculum guidelines (p. 15), how should you enter a value like 150 so it shows currency and remains usable in formulas?'
                : '2. Conform manualului (pag. 15), cum procedăm corect pentru ca o valoare precum 150 să fie afișată ca „150,00 lei” și să poată fi inclusă în calcule?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'currencyFormat', text: lang === 'en' ? 'Enter the raw number 150 and apply Currency formatting' : 'Introducem numărul 150 și aplicăm formatul Monedă (Currency / Contabilitate)' },
              { id: 'typeRaw', text: lang === 'en' ? 'Type "150 USD" or "150 lei" directly from keyboard' : 'Scriem de la tastatură direct „150 lei” în interiorul celulei' },
              { id: 'screenshot', text: lang === 'en' ? 'Take a phone photo of a 100-dollar bill and insert it as an image' : 'Facem o poză cu telefonul la o bancnotă de 100 de lei și o inserăm ca imagine' },
              { id: 'comment', text: lang === 'en' ? 'Add a comment in MS Word and send it via email' : 'Adăugăm un comentariu în Word și îl trimitem pe e-mail' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'currencyFormat'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint={lang === 'en' ? 'Type the raw number and let cell formatting attach the monetary symbol.' : 'Tastăm numărul curat și lăsăm comanda de formatare a celulei să atașeze simbolul \'lei\'.'} />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={lang === 'en'
                ? "Excellent! Always type the pure numeric value (150), then select Currency from the 'Number' group on the Home ribbon."
                : "Excelent! Se introduce exclusiv valoarea numerică (150), apoi din grupul 'Număr' de pe Panglica Pornire se alege formatul Monedă (lei sau RON)."}
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. What does the "####" character sequence in a cell indicate and how is it resolved?'
                : '3. Ce semnifică apariția șirului de caractere „####” într-o celulă și cum se rezolvă?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'tooNarrow', text: lang === 'en' ? 'Column is too narrow to display the number; fix by expanding column width (Autofit)' : 'Lățimea coloanei este prea mică pentru a afișa numărul; se rezolvă prin lărgirea coloanei (Autofit)' },
              { id: 'virus', text: lang === 'en' ? 'Computer has been compromised by a trojan malware virus' : 'Calculatorul a fost infectat cu un virus informatic de tip troian' },
              { id: 'hardwareFail', text: lang === 'en' ? 'CPU is overheating and monitor must be turned off' : 'Procesorul s-a supraîncălzit și trebuie stins monitorul' },
              { id: 'deleteExcel', text: lang === 'en' ? 'MS Excel must be uninstalled from Windows immediately' : 'Trebuie dezinstalat complet programul Excel din Windows' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'tooNarrow'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint={lang === 'en' ? 'Recall the column width slider experiment.' : 'Amintește-te de experimentul cu glisorul de lățime a coloanei.'} />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={lang === 'en'
                ? "Exact! '####' only appears when a column is too narrow to render a full number or date. Double-clicking the column divider automatically resizes it to the optimal width."
                : "Exact! Semnul '####' apare doar atunci când coloana este prea îngustă pentru a reda numărul sau data calendaristică. Un simplu dublu-clic pe separatorul coloanei ajustează automat lățimea optimă."}
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={4}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
