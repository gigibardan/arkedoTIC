import React, { useState, useEffect } from 'react';
import { 
  Music, 
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
  Sliders,
  Disc3
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { scratchSynth } from '../../utils/scratchMusicSynth';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface S2Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

interface NoteKey {
  noteName: string;
  midiNumber: number;
  solfege: string;
  isBlackKey?: boolean;
}

const PIANO_KEYS: NoteKey[] = [
  { noteName: 'C4', midiNumber: 60, solfege: 'Do (60)' },
  { noteName: 'C#4', midiNumber: 61, solfege: 'Do# (61)', isBlackKey: true },
  { noteName: 'D4', midiNumber: 62, solfege: 'Re (62)' },
  { noteName: 'D#4', midiNumber: 63, solfege: 'Re# (63)', isBlackKey: true },
  { noteName: 'E4', midiNumber: 64, solfege: 'Mi (64)' },
  { noteName: 'F4', midiNumber: 65, solfege: 'Fa (65)' },
  { noteName: 'F#4', midiNumber: 66, solfege: 'Fa# (66)', isBlackKey: true },
  { noteName: 'G4', midiNumber: 67, solfege: 'Sol (67)' },
  { noteName: 'G#4', midiNumber: 68, solfege: 'Sol# (68)', isBlackKey: true },
  { noteName: 'A4', midiNumber: 69, solfege: 'La (69)' },
  { noteName: 'A#4', midiNumber: 70, solfege: 'La# (70)', isBlackKey: true },
  { noteName: 'B4', midiNumber: 71, solfege: 'Si (71)' },
  { noteName: 'C5', midiNumber: 72, solfege: 'Do5 (72)' }
];

export const S2Level4_MusicExtension: React.FC<S2Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Active instrument
  const [instrument, setInstrument] = useState<'piano' | 'synth' | 'flute'>('piano');
  const [lastPlayedNote, setLastPlayedNote] = useState<number | null>(60);
  const [playedNotesCount, setPlayedNotesCount] = useState<number>(0);

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

  const handlePlayKey = (midi: number) => {
    scratchSynth.playNote(midi, 0.6, instrument);
    setLastPlayedNote(midi);
    setPlayedNotesCount(c => c + 1);
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'note_60_do') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'tempo_beats') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'note_60_do';
  const isQ2Correct = q2Answer === 'tempo_beats';

  let totalScore = 0;
  if (playedNotesCount >= 3) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = playedNotesCount >= 2 || (q1Answer !== null && q2Answer !== null) || totalScore >= 40;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-600/30 via-purple-600/20 to-slate-900 border border-pink-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-500/20 rounded-xl border border-pink-500/40 text-pink-300">
              <Music className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0 (Mission 2)' : 'Unitatea 6 • Scratch 3.0 (Misiunea 2)'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 4 of 7' : 'Pagina 4 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'The Music Extension: MIDI Notes & Digital Instruments'
                  : 'Extensia Muzică: Portativ Numeric MIDI și Instrumente Digitale'}
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
        <div className="flex items-center gap-2 text-pink-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Music Extension Mechanics (Textbook pp. 90–92)' : 'Mecanismele Extensiei Muzică (Manual pag. 90–92)'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-pink-300 flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-pink-400" />
              {lang === 'en' ? '1. MIDI Numeric Pitches' : '1. Portativul Numeric MIDI'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Standard Middle C (Do central) is note 60. Each consecutive semitone adds 1 (60=Do, 62=Re, 64=Mi, 65=Fa, 67=Sol, 69=La, 71=Si, 72=Do).'
                : 'Nota Do central este 60. Fiecare notă are un număr standard: 60=Do, 62=Re, 64=Mi, 65=Fa, 67=Sol, 69=La, 71=Si, 72=Do de sus.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-purple-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              {lang === 'en' ? '2. Instrument Selection' : '2. Alegerea Instrumentului'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Block `set instrument to [Piano/Synth/Flute]` changes the audio timbre for all subsequent notes.'
                : 'Blocul `setează instrumentul la [Pian/Sintetizator/Flaut]` schimbă timbrul sunetului pentru notele următoare.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-sky-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-sky-400" />
              {lang === 'en' ? '3. Beats & Musical Rests' : '3. Bătăi și Pauze Muzicale'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? '`play note (60) for (0.5) beats` sounds the note for the specified duration. `rest for (0.25) beats` inserts silence.'
                : '`cântă nota (60) timp de (0.5) bătăi` redă nota pe durata specificată. `fă o pauză de (0.25) bătăi` introduce o pauză sonoră.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Scratch Piano Keyboard */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Music className="w-5 h-5 text-pink-400" />
            <h3>{lang === 'en' ? 'Interactive Scratch Piano & Synthesizer' : 'Laborator Interactiv: Claviatură și Sintetizator Scratch'}</h3>
          </div>
          {/* Instrument select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? 'Instrument:' : 'Instrument:'}</span>
            <button
              type="button"
              onClick={() => setInstrument('piano')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                instrument === 'piano' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🎹 Pian (1)
            </button>
            <button
              type="button"
              onClick={() => setInstrument('synth')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                instrument === 'synth' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⚡ Synth (20)
            </button>
            <button
              type="button"
              onClick={() => setInstrument('flute')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                instrument === 'flute' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🎶 Flaut (14)
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Click any piano key to play real notes using Web Audio API! Task: Play at least 3 notes to unlock the challenge score (+40 Pts).'
            : 'Apasă pe clapele pianului pentru a asculta notele sintetizate în timp real! Misiune: Cântă cel puțin 3 note pentru punctaj (+40 Pcte).'}
        </p>

        {/* Piano Keyboard Container */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
          <div className="flex items-start justify-center gap-1 sm:gap-2 p-3 bg-slate-900 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-x-auto max-w-full">
            {PIANO_KEYS.map(key => {
              const isSelected = lastPlayedNote === key.midiNumber;
              return (
                <button
                  key={key.midiNumber}
                  type="button"
                  onClick={() => handlePlayKey(key.midiNumber)}
                  className={`relative flex flex-col items-center justify-end pb-3 rounded-b-xl transition-all cursor-pointer select-none active:scale-95 shadow-md ${
                    key.isBlackKey
                      ? 'w-7 sm:w-9 h-28 sm:h-32 bg-slate-950 border-2 border-slate-700 text-slate-300 hover:bg-slate-800 z-10 -mx-3.5 sm:-mx-4.5'
                      : 'w-10 sm:w-13 h-40 sm:h-48 bg-white border-2 border-slate-300 text-slate-950 hover:bg-slate-100 z-0'
                  } ${isSelected ? 'ring-4 ring-pink-500 scale-[1.02]' : ''}`}
                >
                  <span className={`text-[9px] sm:text-[10px] font-bold font-mono ${key.isBlackKey ? 'text-pink-300' : 'text-slate-900'}`}>
                    {key.solfege.split(' ')[0]}
                  </span>
                  <span className={`text-[8px] font-mono opacity-60 ${key.isBlackKey ? 'text-slate-400' : 'text-slate-600'}`}>
                    {key.midiNumber}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active note readout */}
          {lastPlayedNote && (
            <div className="mt-4 flex items-center gap-3 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-xs font-mono">
              <span className="text-slate-400">Bloc Scratch:</span>
              <span className="text-pink-300 font-bold">
                cântă nota ({lastPlayedNote}) timp de (0.5) bătăi
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-400" />
          <span>{lang === 'en' ? 'Music Extension Quiz' : 'Evaluare: Extensia Muzică'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Nota Do centrală pe portativul Scratch corespunde standardului internațional MIDI cu numărul 60."
              hintEn="Middle C on the Scratch music stave matches the international MIDI standard number 60."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What numeric value represents Middle C (Do central) in the Scratch Music extension?'
              : 'Ce valoare numerică reprezintă nota Do centrală în extensia Muzică din Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'note_60_do', ro: '60 (Do central / Middle C)', en: '60 (Middle C)' },
              { id: 'note_0', ro: '0 (niciun sunet)', en: '0 (no sound)' },
              { id: 'note_100', ro: '100 (Do foarte ascuțit)', en: '100 (high C)' },
              { id: 'note_12', ro: '12 (lungimea gamei)', en: '12 (scale length)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'note_60_do'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-pink-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Numărul 60 este reperul fundamental pentru nota Do în sistemul MIDI Scratch!"
              customMessageEn="Pedagogical reflection: Number 60 is the fundamental baseline for Middle C in Scratch MIDI!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Gama pornește de la 60 (Do), urmată de 62 (Re), 64 (Mi), 65 (Fa), 67 (Sol), 69 (La), 71 (Si) și 72 (Do de sus)."
              explanationEn="The C scale ascends from 60 (C), 62 (D), 64 (E), 65 (F), 67 (G), 69 (A), 71 (B) to 72 (high C)."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Durata unei note se exprimă în bătăi (beats), iar viteza generală a melodiei este controlată de tempo (bătăi pe minut)."
              hintEn="Note duration is measured in beats, while overall speed is governed by tempo (beats per minute)."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'In what unit of measurement is note duration specified in the Scratch Music block "play note () for ()"?'
              : 'În ce unitate de măsură este specificată durata unei note în blocul „cântă nota () timp de ()” în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'tempo_beats', ro: 'Bătăi muzicale (beats), raportate la tempoul setat (ex: 0.25, 0.5, 1 bătăi)', en: 'Musical beats, governed by the tempo (e.g. 0.25, 0.5, 1 beats)' },
              { id: 'kilograms', ro: 'Kilograme de presiune pe clape', en: 'Kilograms of key pressure' },
              { id: 'centimeters', ro: 'Centimetri de deplasare', en: 'Centimeters of displacement' },
              { id: 'pixels', ro: 'Pixeli pe ecran', en: 'Pixels on stage' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'tempo_beats'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-pink-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Bătăile muzicale permit adaptarea ritmică prin modificarea tempoului global!"
              customMessageEn="Pedagogical reflection: Musical beats allow rhythmic scaling via global tempo!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="O bătaie (1 beat) corespunde unei pătrimi, 0.5 bătăi unei optimi, iar 2 bătăi unei doimi în notația muzicală clasică."
              explanationEn="1 beat equals a quarter note, 0.5 equals an eighth note, and 2 beats equal a half note in standard sheet music."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={4}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 5: Gama Do Major & Cântece"
        nextButtonLabelEn="Proceed to Page 5: C Major Scale & Songs"
      />
    </div>
  );
};
