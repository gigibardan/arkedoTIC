import React, { useState } from 'react';
import {
  Search,
  Replace,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Wand2,
  Filter,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W1Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W1Level5_FindReplaceLab: React.FC<W1Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const initialDocumentText =
    'Revista   şcolară   a  fost  tipărită  cu  succes .  Toţi   elevii  au  participat  la  concursul  de   creaţie  literară .';

  const [documentText, setDocumentText] = useState<string>(initialDocumentText);
  const [findQuery, setFindQuery] = useState<string>('  ');
  const [replaceQuery, setReplaceQuery] = useState<string>(' ');
  const [lastActionInfo, setLastActionInfo] = useState<string | null>(null);

  // Targets to clean:
  // 1. Double spaces ('  ' -> ' ')
  // 2. Turkish 'ş' -> 'ș'
  // 3. Turkish 'ţ' -> 'ț'
  // 4. Space before punctuation (' .' -> '.')
  const hasDoubleSpaces = documentText.includes('  ');
  const hasSedillaS = documentText.includes('ş');
  const hasSedillaT = documentText.includes('ţ');
  const hasSpaceBeforeDot = documentText.includes(' .');

  const remainingFlaws =
    (hasDoubleSpaces ? 1 : 0) +
    (hasSedillaS ? 1 : 0) +
    (hasSedillaT ? 1 : 0) +
    (hasSpaceBeforeDot ? 1 : 0);

  const isDocumentPristine = remainingFlaws === 0;

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleApplyReplaceAll = (findStr: string, repStr: string) => {
    if (!findStr) return;
    sounds.playClick();
    if (!documentText.includes(findStr)) {
      setLastActionInfo(
        lang === 'en'
          ? `No matches found for: "${findStr}"`
          : `Nicio potrivire găsită pentru: "${findStr}"`
      );
      return;
    }

    let updated = documentText;
    let count = 0;
    while (updated.includes(findStr) && count < 50) {
      updated = updated.replace(findStr, repStr);
      count++;
    }

    setDocumentText(updated);
    sounds.playCorrect();
    setLastActionInfo(
      lang === 'en'
        ? `Replacements performed for "${findStr}" ➔ "${repStr}".`
        : `S-au efectuat înlocuiri pentru "${findStr}" ➔ "${repStr}".`
    );
  };

  const handleQuickPreset = (findStr: string, repStr: string) => {
    setFindQuery(findStr);
    setReplaceQuery(repStr);
    handleApplyReplaceAll(findStr, repStr);
  };

  const handleResetDocument = () => {
    sounds.playClick();
    setDocumentText(initialDocumentText);
    setFindQuery('  ');
    setReplaceQuery(' ');
    setLastActionInfo(
      lang === 'en'
        ? 'Text reset to contaminated initial state.'
        : 'Textul a fost resetat la starea inițială contaminată.'
    );
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'ctrl_h') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'caret_p') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'repeat_replace_all') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1Answer === 'ctrl_h';
  const isQ2Correct = q2Answer === 'caret_p';
  const isQ3Correct = q3Answer === 'repeat_replace_all';

  let totalScore = 0;
  if (isDocumentPristine) totalScore += 25;
  else if (remainingFlaws <= 2) totalScore += 15;
  if (isQ1Correct) totalScore += 25;
  if (isQ2Correct) totalScore += 25;
  if (isQ3Correct) totalScore += 25;

  const canProceed = totalScore >= 70;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/40">
              <Replace className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {lang === 'en'
                  ? 'LEVEL 5 OF 7 • ADVANCED FIND & REPLACE (CTRL+H)'
                  : 'NIVELUL 5 DIN 7 • CĂUTARE ȘI ÎNLOCUIRE AVANSATĂ (CTRL+H)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {lang === 'en'
                ? 'Batch Auto-Cleaning & Special Characters'
                : 'Curățarea Automată în Loturi & Caractere Speciale'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'When you receive an 80-page manuscript riddled with double spaces, corrupted cedillas, and detached punctuation, you do not fix it word-by-word! You utilize Find & Replace (Ctrl+H) and special tokens (^p, ^t) for instant global hygiene.'
                : 'Când primești un manuscris de 80 de pagini plin de spații duble, sedile greșite și punctuație defectuoasă, nu corectezi manual cuvânt cu cuvânt! Folosești instrumentul „Find and Replace” (Ctrl+H) și codurile speciale (^p, ^t) pentru curățare instantanee.'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-blue-500/40 text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">
                {lang === 'en' ? 'Level 5 Score' : 'Punctaj Nivel 5'}
              </span>
              <span className="text-2xl font-black font-mono text-cyan-400">{totalScore} / 100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Ctrl+H Find and Replace Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <Replace className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'Interactive Lab: Word Find & Replace Console (Ctrl+H)'
                  : 'Laboratorul Interactiv: Consola Word Find & Replace (Ctrl+H)'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Clean the contaminated text using quick presets or manual find/replace fields.'
                  : 'Curăță textul contaminat folosind comenzile rapide sau completând manual câmpurile de căutare.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetDocument}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'Reset Text' : 'Resetează Textul'}</span>
          </button>
        </div>

        {/* Live Document Preview Box */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{lang === 'en' ? 'Working manuscript:' : 'Manuscris în lucru:'}</span>
            <span className="flex items-center gap-2">
              {lang === 'en' ? 'Text hygiene status:' : 'Stare igienă text:'}{' '}
              {isDocumentPristine ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                  {lang === 'en' ? '100% Clean & Compliant' : '100% Curat & Conform'}
                </span>
              ) : (
                <span className="text-amber-400 font-bold">
                  {lang === 'en'
                    ? `${remainingFlaws} ${remainingFlaws === 1 ? 'issue remaining' : 'issues remaining'}`
                    : `${remainingFlaws} ${remainingFlaws === 1 ? 'problemă rămasă' : 'probleme rămase'}`}
                </span>
              )}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-base sm:text-lg text-slate-200 font-mono tracking-wide leading-relaxed">
            {documentText}
          </div>

          {/* Quick Issue Indicators */}
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
            <span
              className={`px-2 py-0.5 rounded-md border ${
                hasDoubleSpaces
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasDoubleSpaces
                ? lang === 'en'
                  ? '✗ Double spaces detected'
                  : '✗ Spații duble detectate'
                : lang === 'en'
                ? '✓ No double spaces'
                : '✓ Fără spații duble'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border ${
                hasSedillaS
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasSedillaS
                ? lang === 'en'
                  ? '✗ Turkish cedilla "ş" detected'
                  : '✗ Sedilă turcească „ş” detectată'
                : lang === 'en'
                ? '✓ Proper "ș" comma-below'
                : '✓ Virgulă „ș” conformă'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border ${
                hasSedillaT
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasSedillaT
                ? lang === 'en'
                  ? '✗ Turkish cedilla "ţ" detected'
                  : '✗ Sedilă turcească „ţ” detectată'
                : lang === 'en'
                ? '✓ Proper "ț" comma-below'
                : '✓ Virgulă „ț” conformă'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border ${
                hasSpaceBeforeDot
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasSpaceBeforeDot
                ? lang === 'en'
                  ? '✗ Space before period " ."'
                  : '✗ Spațiu înainte de punct „ .”'
                : lang === 'en'
                ? '✓ Period properly attached'
                : '✓ Punct lipit corect'}
            </span>
          </div>
        </div>

        {/* Quick Batch Fixes (Pre-set Macros) */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            {lang === 'en'
              ? 'Quick Batch Cleaning Macros (Typesetter Recommended):'
              : 'Macro-Comenzi Rapide de Curățare (Recomandate de Tipografi):'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('  ', ' ')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'en' ? 'Remove double spaces' : 'Elimină spații duble'}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">"  " ➔ " "</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPreset('ş', 'ș')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'en' ? 'Fix cedilla ş' : 'Repară sedila ş'}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">"ş" ➔ "ș"</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPreset('ţ', 'ț')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'en' ? 'Fix cedilla ţ' : 'Repară sedila ţ'}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">"ţ" ➔ "ț"</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPreset(' .', '.')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'en' ? 'Attach periods' : 'Lipește punctele'}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">" ." ➔ "."</div>
            </button>
          </div>
        </div>

        {/* Manual Find & Replace Form */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            {lang === 'en'
              ? 'Official Word "Find and Replace" Dialog Box'
              : 'Caseta Oficială Word „Găsire și Înlocuire” (Find and Replace)'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">
                {lang === 'en' ? 'Find what:' : 'Ce se caută (Find what):'}
              </label>
              <input
                type="text"
                value={findQuery}
                onChange={(e) => setFindQuery(e.target.value)}
                placeholder={lang === 'en' ? 'E.g. ş or double space' : 'Ex: ş sau dublu spațiu'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">
                {lang === 'en' ? 'Replace with:' : 'Înlocuire cu (Replace with):'}
              </label>
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder={lang === 'en' ? 'E.g. ș or single space' : 'Ex: ș sau un singur spațiu'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs font-mono text-cyan-400">
              {lastActionInfo || (lang === 'en' ? 'Ready for command execution.' : 'Gata pentru executare comandă.')}
            </div>

            <button
              type="button"
              onClick={() => handleApplyReplaceAll(findQuery, replaceQuery)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm font-mono flex items-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Replace className="w-4 h-4" />
              <span>{lang === 'en' ? 'Replace All' : 'Înlocuire Peste Tot (Replace All)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pedagogical Questions Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Knowledge Check: Find and Replace'
                : 'Verificarea Cunoștințelor: Găsire și Înlocuire'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Answer the 3 editorial efficiency questions correctly.'
                : 'Răspunde corect la cele 3 întrebări de eficiență editorială.'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. Which keyboard shortcut directly opens the "Replace" dialog in Microsoft Word?'
                : '1. Ce combinație de taste deschide direct fereastra „Înlocuire” (Replace) în Microsoft Word?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'ctrl_h', text: 'Ctrl + H' },
              {
                id: 'ctrl_f',
                textRo: 'Ctrl + F (deschide doar căutarea simplă)',
                textEn: 'Ctrl + F (opens simple search only)',
              },
              {
                id: 'ctrl_r',
                textRo: 'Ctrl + R (aliniază la dreapta)',
                textEn: 'Ctrl + R (right aligns text)',
              },
              {
                id: 'f5',
                textRo: 'F5 (salt la pagină)',
                textEn: 'F5 (Go to page)',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'ctrl_h'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.textEn && lang === 'en' ? option.textEn : option.textRo || option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'en'
                ? 'Remember: Ctrl+F is for Find (simple search), while Ctrl+H opens directly into the Replace tab.'
                : 'Ține minte: Ctrl+F este pentru Find (Găsire simplă), iar Ctrl+H deschide direct fila Înlocuire.'
            }
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! Ctrl + H is the standardized shortcut that opens the Find and Replace dialog focused directly on replacement fields.'
                  : 'Corect! Ctrl + H este scurtătura standardizată care deschide fereastra Find and Replace cu focus direct pe câmpurile de substituție.'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. Which special token is used in Word Find box to target a paragraph break (Enter key mark)?'
                : '2. Ce cod special se folosește în câmpul de căutare Word pentru a identifica un marcaj de sfârșit de paragraf (apăsarea tastei Enter)?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'caret_p',
                textRo: '^p (de la Paragraph break)',
                textEn: '^p (Paragraph mark)',
              },
              {
                id: 'caret_t',
                textRo: '^t (de la Tabulator)',
                textEn: '^t (Tab character)',
              },
              { id: 'enter_word', text: '[ENTER]' },
              { id: 'slash_n', text: '\\endl' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'caret_p'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.textEn && lang === 'en' ? option.textEn : option.textRo || option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'en'
                ? 'The caret symbol ^ (Shift+6) followed by the first letter of "paragraph".'
                : 'Simbolul ^ (caret, obținut cu Shift+6) urmat de prima literă din cuvântul \'paragraph\'.'
            }
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                lang === 'en'
                  ? 'Exactly! ^p represents the invisible paragraph symbol (Pilcrow ¶). For instance, finding ^p^p and replacing with ^p eliminates all unintentional blank lines.'
                  : 'Exact! ^p reprezintă caracterul invizibil de paragraf (Pilcrow ¶). De exemplu, căutând ^p^p și înlocuind cu ^p elimini toate paragrafele goale consecutive create din greșeală.'
              }
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. What is the standard professional method to eliminate all double or triple spaces from a long document?'
                : '3. Cum se procedează corect pentru a curăța rapid toate spațiile duble sau triple dintr-un document lung?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'repeat_replace_all',
                textRo:
                  'Se caută două spații consecutive („  ”), se înlocuiesc cu un spațiu („ ”) și se apasă „Înlocuire peste tot” (Replace All) repetat până când Word raportează 0 înlocuiri.',
                textEn:
                  'Search for two consecutive spaces ("  "), replace with a single space (" "), and click "Replace All" repeatedly until Word reports 0 replacements made.',
              },
              {
                id: 'manual_backspace',
                textRo: 'Se citește documentul rând cu rând și se apasă tasta Backspace de fiecare dată.',
                textEn: 'Read through the manuscript line-by-line and hit Backspace manually each time.',
              },
              {
                id: 'delete_document',
                textRo: 'Se șterge tot textul și se rescrie de la zero cu atenție sporită.',
                textEn: 'Delete all content and retype from scratch with heightened care.',
              },
              {
                id: 'font_size',
                textRo: 'Se mărește dimensiunea fontului la 48pt pentru a acoperi spațiile albe.',
                textEn: 'Increase font size to 48pt to camouflage the white space.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'repeat_replace_all'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'en'
                ? 'If there were 4 spaces in a row, the first pass cuts them to 2. A second run reduces them to 1 pristine space!'
                : 'Dacă într-un loc au fost 4 spații, prima înlocuire le reduce la 2 spații. O a doua rulare le reduce la 1 spațiu perfect!'
            }
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={
                lang === 'en'
                  ? 'Very true! Repeatedly running "  " ➔ " " exponentially halves any string of multiple spaces down to a single standard space.'
                  : 'Foarte adevărat! Rularea repetată a înlocuirii „  ” ➔ „ ” reduce exponențial orice succesiune de spații multiple la un singur spațiu regulamentar.'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={5}
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
