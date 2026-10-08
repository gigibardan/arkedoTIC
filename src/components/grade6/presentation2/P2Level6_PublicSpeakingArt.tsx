import React, { useState } from 'react';
import { 
  Mic, 
  Eye, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Star, 
  Check, 
  MonitorPlay, 
  Users, 
  Smile, 
  Award,
  Zap,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P2Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P2Level6_PublicSpeakingArt: React.FC<P2Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Public Speaking Simulator State
  const [testedEyeContact, setTestedEyeContact] = useState<boolean>(false);
  const [testedDiction, setTestedDiction] = useState<boolean>(false);
  const [testedF5Shortcut, setTestedF5Shortcut] = useState<boolean>(false);
  const [audienceMood, setAudienceMood] = useState<'neutral' | 'happy' | 'inspired'>('neutral');

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleTriggerEyeContact = () => {
    sounds.playRetro('coin');
    setTestedEyeContact(true);
    setAudienceMood(prev => (prev === 'neutral' ? 'happy' : 'inspired'));
  };

  const handleTriggerDiction = () => {
    sounds.playRetro('powerup');
    setTestedDiction(true);
    setAudienceMood('inspired');
  };

  const handleTriggerF5 = (type: 'f5' | 'shiftF5') => {
    sounds.playRetro('shoot');
    setTestedF5Shortcut(true);
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'f5_key') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: Date.now() + 4000 }));
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'look_at_audience') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: Date.now() + 4000 }));
    }
  };

  const isQ1Correct = q1Answer === 'f5_key';
  const isQ2Correct = q2Answer === 'look_at_audience';
  const hasTestedLab = testedEyeContact && testedDiction && testedF5Shortcut;
  const isComplete = hasTestedLab && isQ1Correct && isQ2Correct;

  const handleFinish = () => {
    if (isComplete) {
      sounds.playVictory();
      onCompletePage(100);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Pedagogical Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-2 border-teal-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🎤
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-400/20 border border-rose-400/40 text-[11px] font-mono font-bold text-rose-300 uppercase">
                  {lang === 'en' ? 'Unit 1 • Lesson 6 (p. 22-23)' : 'Unitatea 1 • Lecția 6 (pag. 22-23)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 6/7' : 'Ecranul 6/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'The Art of Public Speaking & Slide Show Delivery' 
                  : 'Arta Susținerii Prezentării & Public Speaking'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-rose-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'F5 Key • Body Language • Diction' : 'Tasta F5 • Contact Vizual • Dicție'}</span>
          </div>
        </div>
      </div>

      {/* Public Speaking Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
            <Eye className="w-5 h-5" />
            <span>{lang === 'en' ? '1. Eye Contact' : '1. Contactul Vizual'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Scan the entire classroom room naturally. Do not stare only at your teacher, down at the floor, or with your back to the audience reading the projection screen!'
              : 'Privește sala de la stânga la dreapta. Nu te uita exclusiv în podea, doar la profesor și mai ales NU sta cu spatele la public citind de pe ecranul de proiecție!'}
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Mic className="w-5 h-5" />
            <span>{lang === 'en' ? '2. Voice & Diction' : '2. Voce, Dicție & Ritm'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Speak clearly, with moderate volume, and breathe calmly. Use intentional pauses instead of filler words (such as "ăăă", "um").'
              : 'Vorbește clar, cu volum potrivit și pauze intenționate. Evită ticurile verbale („ăăă”, „deci”) și respiră adânc pentru a elimina emoțiile.'}
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-base">
            <MonitorPlay className="w-5 h-5" />
            <span>{lang === 'en' ? '3. Slide Show Shortcuts' : '3. Scurtături de Expunere'}</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 pl-2 font-mono">
            <li>• <strong className="text-white">F5</strong> : Pornire de la început</li>
            <li>• <strong className="text-white">Shift + F5</strong> : Pornire slide curent</li>
            <li>• <strong className="text-white">Esc</strong> : Ieșire din expunere</li>
            <li>• <strong className="text-white">B</strong> : Ecran Negru (Blackout)</li>
          </ul>
        </div>
      </div>

      {/* Interactive Public Speaking & Stage Simulator */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>{lang === 'en' ? 'Live Stage & Classroom Simulator' : 'Simulatorul Interactiv de Scenă & Public Speaking'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Step into the speaker role! Activate public speaking techniques and observe the audience reaction in real time.'
                : 'Pășește pe scenă! Activează tehnicile oratorice și urmărește reacția colegilor din sală în timp real.'}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-teal-300">
            <span>Stare Public:</span>
            <span className="font-bold">
              {audienceMood === 'neutral' ? '😐 Atent / Calmat' : audienceMood === 'happy' ? '😃 Captivat & Zâmbitor' : '🤩 Super Inspirat!'}
            </span>
          </div>
        </div>

        {/* Action Buttons for Speaker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleTriggerEyeContact}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              testedEyeContact
                ? 'bg-rose-950/60 border-rose-400 text-rose-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-xl shrink-0">
              👁️
            </div>
            <div>
              <div className="text-xs font-bold">1. Stabilește Contact Vizual</div>
              <div className="text-[10px] text-slate-400">Privește toți colegii din sală</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleTriggerDiction}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              testedDiction
                ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
              🎙️
            </div>
            <div>
              <div className="text-xs font-bold">2. Voce Caldă & Dicție Clară</div>
              <div className="text-[10px] text-slate-400">Fără ticuri, cu respirație calmă</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTriggerF5('f5')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              testedF5Shortcut
                ? 'bg-teal-950/60 border-teal-400 text-teal-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-xl shrink-0">
              ⌨️
            </div>
            <div>
              <div className="text-xs font-bold">3. Lansează Expunerea (F5)</div>
              <div className="text-[10px] text-slate-400">Pornire ecran complet (Slide Show)</div>
            </div>
          </button>
        </div>

        {/* Live Audience & Podium Visualizer */}
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
          {/* Virtual Stage */}
          <div className="w-full max-w-xl bg-gradient-to-t from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative text-center">
            {/* Stage Spotlight effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-amber-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-900/90 border border-teal-400/40 text-xs font-mono text-teal-300">
                🎙️ Sala de Clasă TIC • Susținerea Proiectului
              </div>

              <div className="flex items-center justify-center gap-6 py-2">
                <div className="flex flex-col items-center">
                  <span className="text-5xl drop-shadow-md">🧑‍🏫</span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">Profesor Evaluator</span>
                </div>

                <div className="w-px h-16 bg-slate-700"></div>

                {/* Audience Classmates Row */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl transition-transform hover:scale-125 cursor-pointer" title="Coleg 1">
                    {audienceMood === 'neutral' ? '👦' : audienceMood === 'happy' ? '😃' : '🤩'}
                  </span>
                  <span className="text-4xl transition-transform hover:scale-125 cursor-pointer" title="Coleg 2">
                    {audienceMood === 'neutral' ? '👧' : audienceMood === 'happy' ? '😊' : '👏'}
                  </span>
                  <span className="text-4xl transition-transform hover:scale-125 cursor-pointer" title="Coleg 3">
                    {audienceMood === 'neutral' ? '🧒' : audienceMood === 'happy' ? '😁' : '⭐'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic">
                {testedEyeContact && testedDiction && testedF5Shortcut
                  ? '„Un discurs excelent! Prezentarea este clară, vocea este sigură, iar publicul este complet cucerit!”'
                  : '„Prezentatorul se pregătește să înceapă. Activează tehnicile de oratorie din butoanele de mai sus!”'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <span className={hasTestedLab ? 'text-emerald-400' : 'text-amber-400'}>
            {hasTestedLab 
              ? '✨ Ai exersat toate tehnicile de Public Speaking!' 
              : '👉 Testează Contactul Vizual, Dicția și Tasta F5 pentru a continua.'}
          </span>
          <span className="text-slate-400 text-[11px]">Manual pag. 22-23</span>
        </div>
      </div>

      {/* Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quiz 1 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'F5 starts from slide 1; Shift+F5 starts from current slide.' : 'Tasta F5 este scurtătura universală pentru lansarea Slide Show de la început.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which keyboard key starts the full-screen Slide Show presentation from the very first slide?'
              : 'Care tastă de pe tastatură pornește expunerea (Slide Show) pe tot ecranul de la primul diapozitiv?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'f5_key', label: lang === 'en' ? 'F5 key (Universal Presentation Start)' : 'Tasta F5' },
              { id: 'ctrl_s', label: lang === 'en' ? 'Ctrl + S (Salvare fișier)' : 'Combinația Ctrl + S' },
              { id: 'space_key', label: lang === 'en' ? 'Space bar (Tasta Spațiu)' : 'Tasta Spațiu singură' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'f5_key'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                isQ1Correct
                  ? (lang === 'en'
                      ? 'Correct! F5 launches the slideshow from slide 1, while Shift+F5 starts from the selected slide.'
                      : 'Excelent! Tasta F5 pornește expunerea de la primul diapozitiv, iar Shift+F5 o pornește de la diapozitivul selectat curent.')
                  : (lang === 'en'
                      ? 'Not quite. F5 is the dedicated slideshow shortcut key.'
                      : 'Incorect. Tasta F5 este scurtătura dedicată pentru lansarea expunerii.')
              }
            />
          )}
        </div>

        {/* Quiz 2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'Never turn your back on your audience to read off the screen!' : 'Nu sta niciodată cu spatele la public citind de pe perete!'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What is the correct posture for a speaker during a class presentation?'
              : 'Care este comportamentul corect al elevului când își susține prezentarea în fața clasei?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'look_at_audience', label: lang === 'en' ? 'Stands upright, maintains eye contact with the audience, and speaks clearly' : 'Stă drept, menține contactul vizual cu sala și vorbește clar și expresiv' },
              { id: 'turn_back', label: lang === 'en' ? 'Turns their back to the audience and reads all text from the projected wall' : 'Se întoarce cu spatele la colegi și citește tot textul de pe perete' },
              { id: 'whisper_floor', label: lang === 'en' ? 'Whispers quietly looking down at their shoes' : 'Șoptește încet uitându-se exclusiv în podea' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'look_at_audience'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                isQ2Correct
                  ? (lang === 'en'
                      ? 'Spot on! Eye contact, clear posture, and confidence are the secrets of successful public speaking.'
                      : 'Exact! Contactul vizual, poziția deschisă a corpului și dicția clară transformă o simplă temă într-un discurs memorabil.')
                  : (lang === 'en'
                      ? 'Incorrect. Reading with your back turned disconnects you from the audience.'
                      : 'Incorect. Cititul cu spatele la sală plictisește publicul și arată lipsă de pregătire.')
              }
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isComplete}
        onAdvance={handleFinish}
        cooldownRemaining={0}
      />
    </div>
  );
};
