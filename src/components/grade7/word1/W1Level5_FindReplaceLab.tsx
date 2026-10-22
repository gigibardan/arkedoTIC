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
      setLastActionInfo(`Nicio potrivire găsită pentru: "${findStr}"`);
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
    setLastActionInfo(`S-au efectuat înlocuiri pentru "${findStr}" ➔ "${repStr}".`);
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
    setLastActionInfo('Textul a fost resetat la starea inițială contaminată.');
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
              <span>NIVELUL 5 DIN 7 • CĂUTARE ȘI ÎNLOCUIRE AVANSATĂ (CTRL+H)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Curățarea Automată în Loturi & Caractere Speciale
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Când primești un manuscris de 80 de pagini plin de spații duble, sedile greșite și punctuație defectuoasă, nu corectezi manual cuvânt cu cuvânt! Folosești instrumentul „Find and Replace” (Ctrl+H) și codurile speciale (^p, ^t) pentru curățare instantanee.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-blue-500/40 text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Punctaj Nivel 5</span>
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
              <h2 className="text-lg font-bold text-white">Laboratorul Interactiv: Consola Word Find & Replace (Ctrl+H)</h2>
              <p className="text-xs text-slate-400">
                Curăță textul contaminat folosind comenzile rapide sau completând manual câmpurile de căutare.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetDocument}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resetează Textul</span>
          </button>
        </div>

        {/* Live Document Preview Box */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Manuscris în lucru:</span>
            <span className="flex items-center gap-2">
              Stare igienă text:{' '}
              {isDocumentPristine ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Curat & Conform
                </span>
              ) : (
                <span className="text-amber-400 font-bold">
                  {remainingFlaws} {remainingFlaws === 1 ? 'problemă rămasă' : 'probleme rămase'}
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
              {hasDoubleSpaces ? '✗ Spații duble detectate' : '✓ Fără spații duble'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border ${
                hasSedillaS
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasSedillaS ? '✗ Sedilă turcească „ş” detectată' : '✓ Virgulă „ș” conformă'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border ${
                hasSedillaT
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasSedillaT ? '✗ Sedilă turcească „ţ” detectată' : '✓ Virgulă „ț” conformă'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border ${
                hasSpaceBeforeDot
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasSpaceBeforeDot ? '✗ Spațiu înainte de punct „ .”' : '✓ Punct lipit corect'}
            </span>
          </div>
        </div>

        {/* Quick Batch Fixes (Pre-set Macros) */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Macro-Comenzi Rapide de Curățare (Recomandate de Tipografi):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('  ', ' ')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Elimină spații duble</span>
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
                <span>Repară sedila ş</span>
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
                <span>Repară sedila ţ</span>
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
                <span>Lipește punctele</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">" ." ➔ "."</div>
            </button>
          </div>
        </div>

        {/* Manual Find & Replace Form */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Caseta Oficială Word „Găsire și Înlocuire” (Find and Replace)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Ce se caută (Find what):</label>
              <input
                type="text"
                value={findQuery}
                onChange={(e) => setFindQuery(e.target.value)}
                placeholder="Ex: ş sau dublu spațiu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Înlocuire cu (Replace with):</label>
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="Ex: ș sau un singur spațiu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs font-mono text-cyan-400">
              {lastActionInfo || 'Gata pentru executare comandă.'}
            </div>

            <button
              type="button"
              onClick={() => handleApplyReplaceAll(findQuery, replaceQuery)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm font-mono flex items-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Replace className="w-4 h-4" />
              <span>Înlocuire Peste Tot (Replace All)</span>
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
            <h2 className="text-lg font-bold text-white">Verificarea Cunoștințelor: Găsire și Înlocuire</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări de eficiență editorială.</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Ce combinație de taste deschide direct fereastra „Înlocuire” (Replace) în Microsoft Word?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'ctrl_h', text: 'Ctrl + H' },
              { id: 'ctrl_f', text: 'Ctrl + F (deschide doar căutarea simplă)' },
              { id: 'ctrl_r', text: 'Ctrl + R (aliniază la dreapta)' },
              { id: 'f5', text: 'F5 (salt la pagină)' },
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
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Ține minte: Ctrl+F este pentru Find (Găsire simplă), iar Ctrl+H deschide direct fila Înlocuire."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Ctrl + H este scurtătura standardizată care deschide fereastra Find and Replace cu focus direct pe câmpurile de substituție."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Ce cod special se folosește în câmpul de căutare Word pentru a identifica un marcaj de sfârșit de paragraf (apăsarea tastei Enter)?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'caret_p', text: '^p (de la Paragraph break)' },
              { id: 'caret_t', text: '^t (de la Tabulator)' },
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
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Simbolul ^ (caret, obținut cu Shift+6) urmat de prima literă din cuvântul 'paragraph'."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Exact! ^p reprezintă caracterul invizibil de paragraf (Pilcrow ¶). De exemplu, căutând ^p^p și înlocuind cu ^p elimini toate paragrafele goale consecutive create din greșeală."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Cum se procedează corect pentru a curăța rapid toate spațiile duble sau triple dintr-un document lung?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'repeat_replace_all',
                text: 'Se caută două spații consecutive („  ”), se înlocuiesc cu un spațiu („ ”) și se apasă „Înlocuire peste tot” (Replace All) repetat până când Word raportează 0 înlocuiri.',
              },
              {
                id: 'manual_backspace',
                text: 'Se citește documentul rând cu rând și se apasă tasta Backspace de fiecare dată.',
              },
              {
                id: 'delete_document',
                text: 'Se șterge tot textul și se rescrie de la zero cu atenție sporită.',
              },
              {
                id: 'font_size',
                text: 'Se mărește dimensiunea fontului la 48pt pentru a acoperi spațiile albe.',
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
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Dacă într-un loc au fost 4 spații, prima înlocuire le reduce la 2 spații. O a doua rulare le reduce la 1 spațiu perfect!"
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Foarte adevărat! Rularea repetată a înlocuirii „  ” ➔ „ ” reduce exponențial orice succesiune de spații multiple la un singur spațiu regulamentar."
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
