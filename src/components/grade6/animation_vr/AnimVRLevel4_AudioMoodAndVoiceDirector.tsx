import React, { useState } from 'react';
import {
  Music,
  Volume2,
  Mic,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Headphones,
  Sliders,
  Zap,
  Play
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';

interface Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

type MoodType = 'dramatic' | 'happy' | 'spooky' | 'heroic' | 'scifi';

export const AnimVRLevel4_AudioMoodAndVoiceDirector: React.FC<Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [activeMood, setActiveMood] = useState<MoodType>('happy');
  const [testedMoods, setTestedMoods] = useState<Set<MoodType>>(new Set(['happy']));

  // Matching game: Match 3 scenes with best mood
  const [match1, setMatch1] = useState<MoodType | null>(null); // Scene 1: Robot finding a prize -> heroic
  const [match2, setMatch2] = useState<MoodType | null>(null); // Scene 2: Virus warning -> dramatic
  const [match3, setMatch3] = useState<MoodType | null>(null); // Scene 3: Playing in park -> happy

  // Quiz questions
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);

  // Play audio synthesised chords for mood preview using Web Audio
  const playMoodAudio = (mood: MoodType) => {
    setActiveMood(mood);
    setTestedMoods((prev) => new Set(prev).add(mood));

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (mood === 'happy') {
        sounds.playStar();
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
        });
      } else if (mood === 'dramatic') {
        sounds.playRetro('boss_alert');
        [146.83, 174.61, 220.0, 130.81].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.15);
          osc.stop(ctx.currentTime + idx * 0.15 + 0.5);
        });
      } else if (mood === 'heroic') {
        sounds.playFanfare();
        [392.0, 523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
        });
      } else if (mood === 'spooky') {
        sounds.playRetro('hit');
        [311.13, 293.66, 277.18, 261.63].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.2);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.2 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.2);
          osc.stop(ctx.currentTime + idx * 0.2 + 0.55);
        });
      } else if (mood === 'scifi') {
        sounds.playRetro('powerup');
        [440, 880, 1320, 1760].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      }
    } catch {
      // Audio fallback
    }
  };

  const handleQ1 = (val: string) => {
    setQ1(val);
    if (val === 'emotion') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleQ2 = (val: string) => {
    setQ2(val);
    if (val === 'distance') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isMatchingCorrect = match1 === 'heroic' && match2 === 'dramatic' && match3 === 'happy';
  const allCompleted = isMatchingCorrect && q1 === 'emotion' && q2 === 'distance';

  const handleContinue = () => {
    if (!allCompleted) return;
    sounds.playLevelUp();
    onCompletePage(15);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-orange-900/40 to-slate-900/60 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wider uppercase">
                {isEn ? 'Unit 2B • Lesson 3 (Part IV)' : 'Unitatea 2B • Lecția 3 (Partea a IV-a)'}
              </span>
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-mono font-bold">
                Manual pag. 39–40
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
              {isEn ? 'Soundtrack Moods & Voice Direction' : 'Coloana Sonoră, Dispoziția (Mood) & Regie Vocală'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isEn
                ? 'Sound is half the movie experience! Learn how background music shapes the emotion of each scene and master recording hygiene.'
                : 'Muzica reprezintă 50% din emoția unui film! Învață cum fundalul sonor (Mood) dictează starea spectatorului și descoperă regulile de aur ale înregistrării vocale la microfon.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Music className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Mood Selector Studio */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
              🎵
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                {isEn ? 'The 5 Cinematic Moods of Toontastic' : 'Consola de Sunet: Cele 5 Dispoziții (Moods) în Toontastic'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {isEn
                  ? 'Click each mood button to listen to synthesized soundscapes that alter the emotional weight of your animation.'
                  : 'Apasă pe fiecare buton pentru a asculta acordurile de sintetizator care schimbă dispoziția scenei.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
            <Headphones className="w-4 h-4 text-amber-400" />
            <span>{testedMoods.size} / 5 audiate</span>
          </div>
        </div>

        {/* 5 Mood Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            {
              id: 'happy',
              labelRo: 'Vesel (Happy)',
              emoji: '☀️',
              descRo: 'Tonuri luminoase, ritm antrenant. Perfect pentru introducere și prietenie.'
            },
            {
              id: 'dramatic',
              labelRo: 'Dramatic (Suspense)',
              emoji: '⚡',
              descRo: 'Bas grav, tensiune crescută. Ideal pentru apariția conflictului!'
            },
            {
              id: 'spooky',
              labelRo: 'Misterios (Spooky)',
              emoji: '👻',
              descRo: 'Acorduri stranii, ecou. Perfect pentru castele părăsite sau pericole ascunse.'
            },
            {
              id: 'heroic',
              labelRo: 'Eroic (Triumphant)',
              emoji: '🏆',
              descRo: 'Trompete victorioase, tobe solemne. Perfect pentru finalul victorios!'
            },
            {
              id: 'scifi',
              labelRo: 'Sci-Fi (Cosmic)',
              emoji: '🚀',
              descRo: 'Bipuri electronice, lasere și spațiu cosmic. Ideal pentru roboți și tehnologie.'
            }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => playMoodAudio(item.id as MoodType)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeMood === item.id
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-2 ring-amber-500/30 scale-105'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-2xl mb-2 flex items-center justify-between">
                <span>{item.emoji}</span>
                <Play className={`w-3.5 h-3.5 ${activeMood === item.id ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
              </div>
              <div className="text-xs font-bold text-white mb-1">{item.labelRo}</div>
              <div className="text-[10px] text-slate-400 leading-snug">{item.descRo}</div>
            </button>
          ))}
        </div>

        {/* Audio Matching Exercise */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              {isEn ? 'Exercise: Match the Best Mood for Each Story Moment' : 'Exercițiu de Regie: Alege Mood-ul Optim pentru Fiecare Scenă'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scene 1: Robot finding prize */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">🏆 Scena 1: Deznodământ Triumfal</div>
              <div className="text-[11px] text-slate-400">
                Arky salvează serverul școlii și toți colegii aplaudă fericiți.
              </div>
              <select
                value={match1 || ''}
                onChange={(e) => {
                  setMatch1(e.target.value as MoodType);
                  sounds.playPop();
                }}
                className={`w-full p-2 rounded-lg text-xs font-mono font-bold border ${
                  match1 === 'heroic'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-700 text-slate-300'
                }`}
              >
                <option value="">Alege dispoziția sonoră...</option>
                <option value="happy">☀️ Vesel (Happy)</option>
                <option value="dramatic">⚡ Dramatic (Suspense)</option>
                <option value="spooky">👻 Misterios (Spooky)</option>
                <option value="heroic">🏆 Eroic (Triumphant) - Optim</option>
                <option value="scifi">🚀 Sci-Fi (Cosmic)</option>
              </select>
            </div>

            {/* Scene 2: Virus warning */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">⚡ Scena 2: Conflictul cu Virusul</div>
              <div className="text-[11px] text-slate-400">
                O alarmă roșie începe să sune, iar fișierele sunt în pericol de ștergere.
              </div>
              <select
                value={match2 || ''}
                onChange={(e) => {
                  setMatch2(e.target.value as MoodType);
                  sounds.playPop();
                }}
                className={`w-full p-2 rounded-lg text-xs font-mono font-bold border ${
                  match2 === 'dramatic'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-700 text-slate-300'
                }`}
              >
                <option value="">Alege dispoziția sonoră...</option>
                <option value="happy">☀️ Vesel (Happy)</option>
                <option value="dramatic">⚡ Dramatic (Suspense) - Optim</option>
                <option value="spooky">👻 Misterios (Spooky)</option>
                <option value="heroic">🏆 Eroic (Triumphant)</option>
                <option value="scifi">🚀 Sci-Fi (Cosmic)</option>
              </select>
            </div>

            {/* Scene 3: Playing in park */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">☀️ Scena 3: Introducere Prietenoasă</div>
              <div className="text-[11px] text-slate-400">
                Copiii își prezintă animalele de companie într-o zi însorită de primăvară.
              </div>
              <select
                value={match3 || ''}
                onChange={(e) => {
                  setMatch3(e.target.value as MoodType);
                  sounds.playPop();
                }}
                className={`w-full p-2 rounded-lg text-xs font-mono font-bold border ${
                  match3 === 'happy'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-700 text-slate-300'
                }`}
              >
                <option value="">Alege dispoziția sonoră...</option>
                <option value="happy">☀️ Vesel (Happy) - Optim</option>
                <option value="dramatic">⚡ Dramatic (Suspense)</option>
                <option value="spooky">👻 Misterios (Spooky)</option>
                <option value="heroic">🏆 Eroic (Triumphant)</option>
                <option value="scifi">🚀 Sci-Fi (Cosmic)</option>
              </select>
            </div>
          </div>

          {isMatchingCorrect && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Asociere impecabilă de regizor! Muzica potrivită amplifică impactul dramatic al fiecărei scene.</span>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Quiz */}
      <div className="bg-slate-900/90 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-xl">
            🎙️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? 'Evaluation Questions' : 'Verificare de Regie Audio (2 Întrebări)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Test your knowledge on sound design and microphone hygiene.'
                : 'Testează-ți cunoștințele despre coloana sonoră și bunele practici de înregistrare.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">1</span>
                {isEn
                  ? 'What is the primary role of the background soundtrack (Mood) in an animation?'
                  : 'Care este rolul principal al coloanei sonore de fundal (Mood) într-o scenă animată?'}
              </h3>
              <QuestionHint
                hintRo="Coloana sonoră induce spectatorului starea emoțională potrivită (bucurie, spaimă, suspans) fără a folosi cuvinte."
                hintEn="The soundtrack induces the emotional state (joy, fear, suspense) without words."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'cover', label: 'Să acopere complet vocile personajelor să nu se audă nimic' },
                { id: 'emotion', label: 'Să transmită emoție și să amplifice starea dramatică a scenei' },
                { id: 'memory', label: 'Să ocupe spațiul de stocare al calculatorului' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q1 === opt.id
                      ? opt.id === 'emotion'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q1 === opt.id && (opt.id === 'emotion' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {q1 && (
              <AnswerExplanation
                isCorrect={q1 === 'emotion'}
                explanationRo="Corect! Muzica ghidează starea de spirit a spectatorului, făcând o scenă veselă să pară cu adevărat luminoasă, iar un conflict să fie trăit cu suspans."
                explanationEn="Correct! Music guides the viewer's emotional state, making a happy scene truly joyful and a conflict suspenseful."
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">2</span>
                {isEn
                  ? 'Which rule ensures high-quality voice recording into the microphone?'
                  : 'Care este regula de aur pentru o înregistrare vocală clară și fără distorsiuni la microfon?'}
              </h3>
              <QuestionHint
                hintRo="Trebuie păstrată o distanță optimă (15-20 cm) fără a sufla direct în capsula microfonului."
                hintEn="Maintain optimal distance (15-20 cm) without blowing into the mic capsule."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'distance', label: 'Vorbit clar, la o distanță optimă de 15–20 cm, într-o cameră fără ecou' },
                { id: 'blow', label: 'Lipit gura direct de microfon și suflat cu putere' },
                { id: 'tv', label: 'Dat televizorul la maxim în fundal pentru ambianță' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q2 === opt.id
                      ? opt.id === 'distance'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q2 === opt.id && (opt.id === 'distance' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {q2 && (
              <AnswerExplanation
                isCorrect={q2 === 'distance'}
                explanationRo="Exact! Păstrarea unei distanțe constante de 15-20 cm, evitarea suflului direct și liniștea în încăpere asigură un sunet profesional fără distorsiuni."
                explanationEn="Exactly! Keeping a steady distance of 15-20 cm, avoiding direct plosives, and a quiet room ensure clear, professional audio."
              />
            )}
          </div>
        </div>

        {/* Level Complete Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            {allCompleted ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {isEn ? 'Sound design mastered! You earned 15 XP.' : 'Regia sonoră a fost finalizată cu succes! Ai obținut 15 XP.'}
              </span>
            ) : (
              <span>{isEn ? 'Complete the matching and answer both questions to advance.' : 'Asociază cele 3 scene și răspunde la întrebări pentru a debloca Nivelul 5.'}</span>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!allCompleted}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm font-heading flex items-center justify-center gap-2 transition-all ${
              allCompleted
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/30 cursor-pointer scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isEn ? 'Advance to Level 5: VR vs AR vs MR' : 'Treci la Nivelul 5: Realitate Virtuală (VR) vs Augmentată (AR)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
