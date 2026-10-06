import React, { useState, useEffect } from 'react';
import { 
  Music,
  Music2, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  ExternalLink,
  Volume2,
  ListMusic,
  Square
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { scratchSynth } from '../../utils/scratchMusicSynth';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface S2Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

interface SongNote {
  midi: number;
  duration: number; // beats
  name: string;
}

// C Major Scale: Do-Re-Mi-Fa-Sol-La-Si-Do
const C_MAJOR_SCALE: SongNote[] = [
  { midi: 60, duration: 0.5, name: 'Do (60)' },
  { midi: 62, duration: 0.5, name: 'Re (62)' },
  { midi: 64, duration: 0.5, name: 'Mi (64)' },
  { midi: 65, duration: 0.5, name: 'Fa (65)' },
  { midi: 67, duration: 0.5, name: 'Sol (67)' },
  { midi: 69, duration: 0.5, name: 'La (69)' },
  { midi: 71, duration: 0.5, name: 'Si (71)' },
  { midi: 72, duration: 1.0, name: 'Do (72)' }
];

// "În pădurea cu alune" motif notes: Sol Sol Mi, Sol Sol Mi, Fa Fa Re, Fa Fa Re, Sol Sol Mi...
const PADUREA_CU_ALUNE: SongNote[] = [
  { midi: 67, duration: 0.4, name: 'Sol' },
  { midi: 67, duration: 0.4, name: 'Sol' },
  { midi: 64, duration: 0.8, name: 'Mi' },
  { midi: 67, duration: 0.4, name: 'Sol' },
  { midi: 67, duration: 0.4, name: 'Sol' },
  { midi: 64, duration: 0.8, name: 'Mi' },
  { midi: 65, duration: 0.4, name: 'Fa' },
  { midi: 65, duration: 0.4, name: 'Fa' },
  { midi: 62, duration: 0.8, name: 'Re' },
  { midi: 65, duration: 0.4, name: 'Fa' },
  { midi: 65, duration: 0.4, name: 'Fa' },
  { midi: 62, duration: 0.8, name: 'Re' },
  { midi: 60, duration: 0.4, name: 'Do' },
  { midi: 64, duration: 0.4, name: 'Mi' },
  { midi: 67, duration: 0.8, name: 'Sol' }
];

export const S2Level5_DoMajorSongs: React.FC<S2Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number>(-1);
  const [currentSong, setCurrentSong] = useState<'scale' | 'song' | null>(null);
  const [listenedToBoth, setListenedToBoth] = useState<{ scale: boolean; song: boolean }>({
    scale: false,
    song: false
  });

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0);
    if (!hasActive) return;
    const timer = setInterval(() => {
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const [k, v] of Object.entries(prev)) {
          const val = v as number;
          if (val > 1) next[k] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldowns]);

  // Play routine
  const handlePlayTune = (tuneType: 'scale' | 'song') => {
    if (isPlaying) return;
    sounds.playClick();
    setIsPlaying(true);
    setCurrentSong(tuneType);

    const notesList = tuneType === 'scale' ? C_MAJOR_SCALE : PADUREA_CU_ALUNE;
    let currentIdx = 0;

    const playNext = () => {
      if (currentIdx >= notesList.length) {
        setIsPlaying(false);
        setActiveNoteIdx(-1);
        if (tuneType === 'scale') {
          setListenedToBoth(prev => ({ ...prev, scale: true }));
        } else {
          setListenedToBoth(prev => ({ ...prev, song: true }));
        }
        sounds.playStar();
        return;
      }

      const note = notesList[currentIdx];
      setActiveNoteIdx(currentIdx);
      scratchSynth.playNote(note.midi, note.duration * 0.9, 'piano');

      setTimeout(() => {
        currentIdx++;
        playNext();
      }, note.duration * 600);
    };

    playNext();
  };

  const handleStopPlayback = () => {
    setIsPlaying(false);
    setActiveNoteIdx(-1);
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'scale_sequence') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'loop_music') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'scale_sequence';
  const isQ2Correct = q2Answer === 'loop_music';

  const isChallengeComplete = listenedToBoth.scale || listenedToBoth.song;

  let totalScore = 0;
  if (isChallengeComplete) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = isChallengeComplete || (q1Answer !== null && q2Answer !== null) || totalScore >= 40;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/40 text-purple-300">
              <Music2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0 (Mission 2)' : 'Unitatea 6 • Scratch 3.0 (Misiunea 2)'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 5 of 7' : 'Pagina 5 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'The C Major Scale & Romanian Folk Melodies in Scratch'
                  : 'Gama Do Major și Cântecul „În pădurea cu alune”'}
              </h1>
            </div>
          </div>
          <a
            href="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-200 text-xs font-semibold transition cursor-pointer"
          >
            <span>{lang === 'en' ? 'Open MIT Scratch' : 'Deschide Scratch Oficial'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Educational Guide Card */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Music Coding in Scratch (Textbook pp. 91–92)' : 'Programarea Melodiilor în Scratch (Manual pag. 91–92)'}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'Any melody can be programmed sequentially by combining note pitch blocks with rhythm durations. By connecting loops, songs can repeat seamlessly in games as background soundtracks.'
            : 'Orice melodie poate fi compusă secvențial îmbinând înălțimea notelor MIDI cu duratele ritmice. Prin integrarea într-o buclă „la nesfârșit”, cântecul devine coloana sonoră de fundal a oricărui joc Scratch.'}
        </p>
      </div>

      {/* Interactive Music Player & Score Highlighter */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <ListMusic className="w-5 h-5 text-purple-400" />
            <h3>{lang === 'en' ? 'Scratch Melodic Player & Note Visualizer' : 'Laborator Interactiv: Player Melodic Scratch'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isPlaying}
              onClick={() => handlePlayTune('scale')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{lang === 'en' ? 'Play C Major Scale' : 'Cântă Gama Do Major'}</span>
            </button>
            <button
              type="button"
              disabled={isPlaying}
              onClick={() => handlePlayTune('song')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{lang === 'en' ? 'Play "În pădurea cu alune"' : 'Cântă „În pădurea cu alune”'}</span>
            </button>
            {isPlaying && (
              <button
                type="button"
                onClick={handleStopPlayback}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Listen to the C Major Scale or the Romanian classic song. The active block lights up as each note sounds!'
            : 'Ascultă Gama Do Major sau cântecul românesc din manual. Urmărește iluminarea notelor în timp real!'}
        </p>

        {/* Live Note Blocks Stream */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {currentSong === 'song'
              ? (lang === 'en' ? 'Active Score: "În pădurea cu alune"' : 'Partitură Activă: „În pădurea cu alune”')
              : (lang === 'en' ? 'Active Score: C Major Scale (60..72)' : 'Partitură Activă: Gama Do Major (60..72)')}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {(currentSong === 'song' ? PADUREA_CU_ALUNE : C_MAJOR_SCALE).map((note, idx) => {
              const isActive = isPlaying && activeNoteIdx === idx;
              return (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-pink-500 border-white text-white ring-4 ring-pink-400/50 scale-110 shadow-lg animate-bounce'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Music className="w-3 h-3 text-pink-400" />
                  <span>{note.name}</span>
                  <span className="text-[10px] opacity-60">({note.duration}b)</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span>Tempo: <strong>60 BPM (Bătăi pe minut)</strong></span>
            <span>Instrument: <strong>Pian Acustic</strong></span>
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>{lang === 'en' ? 'Scale & Soundtrack Coding Quiz' : 'Evaluare: Gama și Coloana Sonoră'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Gama Do major urcă treptat prin cele 8 note fundamentale de la Do4 (60) până la Do5 (72)."
              hintEn="The C major scale steps gradually through the 8 natural notes from C4 (60) to C5 (72)."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is the numeric MIDI sequence to play the ascending C Major scale in Scratch?'
              : 'Care este succesiunea numerică MIDI pentru a reda gama Do major ascendentă în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'scale_sequence', ro: '60 (Do), 62 (Re), 64 (Mi), 65 (Fa), 67 (Sol), 69 (La), 71 (Si), 72 (Do)', en: '60 (C), 62 (D), 64 (E), 65 (F), 67 (G), 69 (A), 71 (B), 72 (C)' },
              { id: 'scale_wrong_1', ro: '10, 20, 30, 40, 50, 60, 70, 80', en: '10, 20, 30, 40, 50, 60, 70, 80' },
              { id: 'scale_wrong_2', ro: '1, 2, 3, 4, 5, 6, 7, 8', en: '1, 2, 3, 4, 5, 6, 7, 8' },
              { id: 'scale_wrong_3', ro: '72, 71, 69, 67, 65, 64, 62, 60 (descendentă)', en: '72, 71, 69, 67, 65, 64, 62, 60 (descending)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'scale_sequence'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q1}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Înțelegerea succesiunii 60..72 permite transpunerea oricărei partituri în Scratch!"
              customMessageEn="Pedagogical reflection: Mastering 60..72 enables transcribing sheet music into Scratch!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Între Mi (64) și Fa (65), precum și între Si (71) și Do (72) este un singur semiton (diferență de 1 unitate numerică)."
              explanationEn="Between E (64) and F (65), as well as B (71) and C (72), there is a single semitone (+1 MIDI step)."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Pentru ca un cântec să ruleze continuu ca muzică ambientală într-un joc, este încapsulat într-o buclă infinită „la nesfârșit”."
              hintEn="To loop a track continuously as ambient music in a game, wrap it inside a 'forever' block."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'How can you make a melody repeat endlessly as background music during a Scratch game?'
              : 'Cum poți face ca o melodie să se repete continuu ca fond sonor pe tot parcursul jocului în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'loop_music', ro: 'Introducând succesiunea de note în interiorul blocului „la nesfârșit” (forever)', en: 'Enclosing the note sequence inside a "forever" loop block' },
              { id: 'copy_1000', ro: 'Copiind manual cele 15 blocuri de 1000 de ori unul sub altul', en: 'Manually duplicating the 15 blocks 1000 times' },
              { id: 'delete_flag', ro: 'Ștergând Steagul Verde de pe ecran', en: 'Deleting the Green Flag from stage' },
              { id: 'change_costume', ro: 'Schimbând costumul pisicii la fiecare milisecundă', en: 'Switching cat costume every millisecond' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'loop_music'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Bucla infinită este structura ideală pentru fundalul sonor continuu!"
              customMessageEn="Pedagogical reflection: The infinite loop is ideal for continuous background audio!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Blocul „la nesfârșit” reia automat prima notă imediat ce ultima notă din partitură și-a încheiat durata."
              explanationEn="The 'forever' block immediately replays the first note as soon as the last note finishes."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={5}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 6: Jocul de Concurs „Prinde Peștișorul”"
        nextButtonLabelEn="Proceed to Page 6: Contest Game 'Catch the Fish'"
      />
    </div>
  );
};
