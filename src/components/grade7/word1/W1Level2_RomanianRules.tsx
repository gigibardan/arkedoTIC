import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Wand2,
  SpellCheck,
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

interface W1Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface CorruptedToken {
  id: string;
  original: string;
  fixed: string;
  type: 'sedilla' | 'punct_space' | 'quotes' | 'parenthesis' | 'hyphen';
  rule: string;
}

export const W1Level2_RomanianRules: React.FC<W1Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Typography Corrector Tokens
  const initialTokens: CorruptedToken[] = [
    {
      id: 't1',
      original: '"',
      fixed: '„',
      type: 'quotes',
      rule: 'Ghilimelele românești se deschid jos (forma 99)',
    },
    {
      id: 't2',
      original: 'Şcoala',
      fixed: 'Școala',
      type: 'sedilla',
      rule: 'Diacritică cu virgulă dedesubt (Ș), nu sedilă turcească (Ş)',
    },
    {
      id: 't3',
      original: 'Românească "',
      fixed: 'Românească”',
      type: 'quotes',
      rule: 'Ghilimelele românești se închid sus (forma 99 sus)',
    },
    {
      id: 't4',
      original: 'elevii ,profesorii',
      fixed: 'elevii, profesorii',
      type: 'punct_space',
      rule: 'Virgula se lipește de cuvântul precedent și este urmată de un spațiu',
    },
    {
      id: 't5',
      original: '( o comunitate )',
      fixed: '(o comunitate)',
      type: 'parenthesis',
      rule: 'Parantezele se lipesc de textul interior fără spații parazite',
    },
    {
      id: 't6',
      original: 's -au',
      fixed: 's-au',
      type: 'hyphen',
      rule: 'Cratima de legătură leagă cuvintele fără spații',
    },
    {
      id: 't7',
      original: 'învăţătură',
      fixed: 'învățătură',
      type: 'sedilla',
      rule: 'Litera ț cere virgulă dedesubt conform standardului SR 13411',
    },
  ];

  const [fixedTokenIds, setFixedTokenIds] = useState<Record<string, boolean>>({});
  const [selectedToken, setSelectedToken] = useState<CorruptedToken | null>(null);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleFixToken = (token: CorruptedToken) => {
    sounds.playCorrect();
    setFixedTokenIds((prev) => ({ ...prev, [token.id]: true }));
    setSelectedToken(token);
  };

  const handleFixAllTokens = () => {
    sounds.playLevelUp();
    const allFixed: Record<string, boolean> = {};
    initialTokens.forEach((t) => {
      allFixed[t.id] = true;
    });
    setFixedTokenIds(allFixed);
  };

  const handleResetTokens = () => {
    sounds.playClick();
    setFixedTokenIds({});
    setSelectedToken(null);
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'comma_below') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'punct_attached') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'quotes_ro') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1Answer === 'comma_below';
  const isQ2Correct = q2Answer === 'punct_attached';
  const isQ3Correct = q3Answer === 'quotes_ro';

  const fixedCount = Object.keys(fixedTokenIds).length;
  const allTokensFixed = fixedCount === initialTokens.length;

  let totalScore = 0;
  if (allTokensFixed) totalScore += 25;
  else if (fixedCount >= 3) totalScore += 15;
  if (isQ1Correct) totalScore += 25;
  if (isQ2Correct) totalScore += 25;
  if (isQ3Correct) totalScore += 25;

  const canProceed = totalScore >= 70;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/40">
              <SpellCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>NIVELUL 2 DIN 7 • REGULILE DE AUR ALE TIPOGRAFIEI ROMÂNEȘTI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Standardul SR 13411, Diacritice & Ghilimele Românești
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              O tehnoredactare de nota 10 respectă normele Academiei Române: diacritice cu virgulă dedesubt (nu sedilă turcească!), semne de punctuație lipite de cuvânt și ghilimele românești „99 jos / 99 sus”.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-indigo-500/40 text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Punctaj Nivel 2</span>
              <span className="text-2xl font-black font-mono text-cyan-400">{totalScore} / 100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Typography Repair Lab */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <SpellCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Laboratorul Interactiv: Scanarea & Corectarea Textului Contaminat</h2>
              <p className="text-xs text-slate-400">
                Apasă pe fiecare cuvânt marcat în roșu pentru a aplica norma tipografică corectă.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetTokens}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-mono transition cursor-pointer"
              title="Resetează textul"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleFixAllTokens}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Corectează Automat Tot</span>
            </button>
          </div>
        </div>

        {/* Live Article Text Box */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span>Fragment din revista liceului:</span>
            <span>
              Erori remediate: <b className="text-cyan-400">{fixedCount} / {initialTokens.length}</b>
            </span>
          </div>

          <div className="text-base sm:text-lg leading-loose text-slate-200 font-serif">
            La revista{' '}
            {/* Token 1 */}
            <span
              onClick={() => handleFixToken(initialTokens[0])}
              className={`cursor-pointer px-1 py-0.5 rounded font-mono font-bold transition ${
                fixedTokenIds['t1']
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 underline decoration-wavy'
              }`}
            >
              {fixedTokenIds['t1'] ? initialTokens[0].fixed : initialTokens[0].original}
            </span>
            {/* Token 2 */}
            <span
              onClick={() => handleFixToken(initialTokens[1])}
              className={`cursor-pointer px-1 py-0.5 rounded transition ${
                fixedTokenIds['t2']
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 underline decoration-wavy'
              }`}
            >
              {fixedTokenIds['t2'] ? initialTokens[1].fixed : initialTokens[1].original}
            </span>{' '}
            {/* Token 3 */}
            <span
              onClick={() => handleFixToken(initialTokens[2])}
              className={`cursor-pointer px-1 py-0.5 rounded transition ${
                fixedTokenIds['t3']
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 underline decoration-wavy'
              }`}
            >
              {fixedTokenIds['t3'] ? initialTokens[2].fixed : initialTokens[2].original}
            </span>
            , toți{' '}
            {/* Token 4 */}
            <span
              onClick={() => handleFixToken(initialTokens[3])}
              className={`cursor-pointer px-1.5 py-0.5 rounded transition ${
                fixedTokenIds['t4']
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 underline decoration-wavy'
              }`}
            >
              {fixedTokenIds['t4'] ? initialTokens[3].fixed : initialTokens[3].original}
            </span>{' '}
            și părinții{' '}
            {/* Token 5 */}
            <span
              onClick={() => handleFixToken(initialTokens[4])}
              className={`cursor-pointer px-1.5 py-0.5 rounded transition ${
                fixedTokenIds['t5']
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 underline decoration-wavy'
              }`}
            >
              {fixedTokenIds['t5'] ? initialTokens[4].fixed : initialTokens[4].original}
            </span>{' '}
            {/* Token 6 */}
            <span
              onClick={() => handleFixToken(initialTokens[5])}
              className={`cursor-pointer px-1 py-0.5 rounded transition ${
                fixedTokenIds['t6']
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 underline decoration-wavy'
              }`}
            >
              {fixedTokenIds['t6'] ? initialTokens[5].fixed : initialTokens[5].original}
            </span>{' '}
            implicat activ pentru o{' '}
            {/* Token 7 */}
            <span
              onClick={() => handleFixToken(initialTokens[6])}
              className={`cursor-pointer px-1 py-0.5 rounded transition ${
                fixedTokenIds['t7']
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 underline decoration-wavy'
              }`}
            >
              {fixedTokenIds['t7'] ? initialTokens[6].fixed : initialTokens[6].original}
            </span>{' '}
            de înaltă ținută editorială.
          </div>
        </div>

        {/* Selected token rule feedback */}
        {selectedToken && (
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs sm:text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white mb-0.5">Norma aplicată: {selectedToken.rule}</span>
              <span className="text-slate-300 font-mono text-xs">
                Modificare: <span className="line-through text-rose-400">{selectedToken.original}</span> ➔{' '}
                <span className="text-emerald-400 font-bold">{selectedToken.fixed}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pedagogical Questions Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificarea Cunoștințelor: Norme Tipografice Românești</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări de conformitate editorială.</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Care este diferența tehnică și vizuală dintre diacriticele corecte românești și cele turcești?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'comma_below',
                text: 'În limba română (SR 13411), literele ș și ț au virgulă dedesubt detașată, pe când în turcă (ş, ţ) au o sedilă lipită de literă.',
              },
              {
                id: 'same_thing',
                text: 'Sunt identice și nu există nicio diferență de codare Unicode sau aspect vizual.',
              },
              {
                id: 'cedilla_romanian',
                text: 'Sedila este standardul oficial românesc din anul 2024, iar virgula a fost retrasă.',
              },
              {
                id: 'only_t',
                text: 'Doar litera ţ are voie să aibă sedilă, litera ș folosește obligatoriu un punct.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'comma_below'
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
            hint="Privește cu atenție codul Unicode U+0219 (S with comma below) vs U+015F (S with cedilla). Academia Română cere virgulă!"
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Exact! Standardul național SR 13411 impune virgula dedesubt (comma below) pentru caracterele ș și ț. Sedila turcească este o greșeală moștenită din sistemele de operare vechi."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Care este regula universală de tehnoredactare pentru semnele de punctuație (. , ; : ! ?)?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'punct_attached',
                text: 'Se lipesc întotdeauna de cuvântul din stânga (fără spațiu înainte) și sunt urmate obligatoriu de exact un spațiu.',
              },
              {
                id: 'space_both',
                text: 'Se pun spații atât înainte, cât și după semnul de punctuație (ex: salut , prieteni).',
              },
              {
                id: 'no_space_after',
                text: 'Se pune spațiu înainte de virgulă, dar niciun spațiu după.',
              },
              {
                id: 'double_space',
                text: 'Orice punct de la sfârșitul frazei cere obligatoriu trei spații consecutive.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'punct_attached'
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
            hint="Gândește-te la un magnet: semnul de punctuație este atras ca un magnet de cuvântul de dinainte, iar după el se ia o pauză de respirație (un spațiu)."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Perfect! Dacă pui spațiu înainte de virgulă sau punct, procesorul de text ar putea împinge semnul singuratic pe rândul următor (greșeală gravă de tipar numită orfană)."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Care este forma corectă a ghilimelelor românești în tehnoredactarea documentelor?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'quotes_ro', text: '„deschidere jos (99 jos) și ”închidere sus (99 sus)' },
              { id: 'quotes_us', text: '"" ghilimele duble drepte de tip mașină de scris' },
              { id: 'quotes_french', text: '« » ghilimele franțuzești tip paranteză ascuțită' },
              { id: 'quotes_single', text: "'' apostrofuri simple repetate" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'quotes_ro'
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
            hint="Ține minte regula „99 jos / 99 sus”: paranteza citatului pornește de la baza textului și se încheie la înălțimea majusculei."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Corect! Ghilimelele românești oficiale sunt „la deschidere” și ”la închidere”. Ghilimelele drepte sunt o limitare a vechilor tastaturi americane."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={2}
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
