import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';

interface A1Level7Props {
  onPass: (score: number) => void;
}

interface Question {
  id: number;
  questionRo: string;
  questionEn: string;
  options: { id: string; textRo: string; textEn: string }[];
  correct: string;
  explanationRo: string;
  explanationEn: string;
}

export const A1Level7_AcousticWavePadExam: React.FC<A1Level7Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  const questions: Question[] = [
    {
      id: 1,
      questionRo: 'Care este intervalul de frecvențe perceput de urechea umană sănătoasă și în ce unitate de măsură se exprimă numărul de oscilații pe secundă?',
      questionEn: 'What is the frequency range perceived by healthy human hearing and in what unit of measurement are oscillations per second expressed?',
      options: [
        {
          id: 'A',
          textRo: '0 dB – 100 dB, măsurat în Decibeli.',
          textEn: '0 dB – 100 dB, measured in Decibels.',
        },
        {
          id: 'B',
          textRo: '20 Hz – 20.000 Hz (20 kHz), măsurat în Hertz (Hz).',
          textEn: '20 Hz – 20,000 Hz (20 kHz), measured in Hertz (Hz).',
        },
        {
          id: 'C',
          textRo: '128 kbps – 320 kbps, măsurat în biți pe secundă.',
          textEn: '128 kbps – 320 kbps, measured in bits per second.',
        },
        {
          id: 'D',
          textRo: '10 Hz – 100.000 Hz, măsurat în MegaHertz.',
          textEn: '10 Hz – 100,000 Hz, measured in MegaHertz.',
        },
      ],
      correct: 'B',
      explanationRo: 'Urechea umană aude sunete cuprinse între 20 Hz (frecvențe foarte joase/grave) și 20.000 Hz (frecvențe foarte înalte/acute). Sub 20 Hz sunt Infrasunetele, iar peste 20 kHz sunt Ultrasunetele.',
      explanationEn: 'The human ear perceives sounds between 20 Hz (deep bass frequencies) and 20,000 Hz (sharp treble frequencies). Below 20 Hz are Infrasounds, and above 20 kHz are Ultrasounds.',
    },
    {
      id: 2,
      questionRo: 'De ce este rata de eșantionare standard a formatului Audio CD stabilită la 44.100 Hz (44.1 kHz) pe 16 biți?',
      questionEn: 'Why is the standard sampling rate of the Audio CD format set at 44,100 Hz (44.1 kHz) at 16 bits?',
      options: [
        {
          id: 'A',
          textRo: 'Pentru că microfonul fizic poate trimite doar 44 de impulsuri electrice pe secundă.',
          textEn: 'Because physical microphones can only transmit 44 electrical impulses per second.',
        },
        {
          id: 'B',
          textRo: 'Pentru că este numărul maxim de caractere dintr-un fișier text.',
          textEn: 'Because it is the maximum number of characters in a text file.',
        },
        {
          id: 'C',
          textRo: 'Conform teoremei Nyquist-Shannon, eșantionarea trebuie să fie de cel puțin 2 ori frecvența maximă auzită (2 × 20 kHz = 40 kHz + 10% marjă de filtrare), iar 16 biți oferă 65.536 trepte curate de dinamică.',
          textEn: 'According to Nyquist-Shannon theorem, sampling must be at least double the highest audible frequency (2 × 20 kHz = 40 kHz + 10% filter margin), and 16 bits provides 65,536 clean dynamic levels.',
        },
        {
          id: 'D',
          textRo: 'Pentru că 44.100 Hz funcționează exclusiv pe calculatoare cu Windows.',
          textEn: 'Because 44,100 Hz functions exclusively on Windows computers.',
        },
      ],
      correct: 'C',
      explanationRo: 'Teorema Nyquist-Shannon impune ca rata de eșantionare să depășească dublul celei mai înalte frecvențe de captat (2 × 20 kHz = 40 kHz). Cu marja de filtrare trece-jos, s-a adoptat 44.1 kHz și 16 biți (96 dB dinamică).',
      explanationEn: 'The Nyquist-Shannon theorem dictates that the sampling rate must exceed double the highest frequency to capture (2 × 20 kHz = 40 kHz). With low-pass anti-aliasing margins, 44.1 kHz and 16 bits (96 dB dynamic range) was adopted.',
    },
    {
      id: 3,
      questionRo: 'Cât spațiu ocupă 1 minut (60 sec) de sunet necomprimat WAV Stereo (44.1 kHz, 16 biți, 2 canale) comparativ cu un fișier comprimat MP3 la 192 kbps?',
      questionEn: 'How much space does 1 minute (60 sec) of uncompressed Stereo WAV audio (44.1 kHz, 16-bit, 2 channels) occupy compared to a 192 kbps MP3 compressed file?',
      options: [
        {
          id: 'A',
          textRo: 'WAV ocupă aproximativ 10,1 MB, în timp ce MP3 ocupă doar ~1,4 MB (reducere de peste 7-8 ori prin model psihoacustic).',
          textEn: 'WAV occupies ~10.1 MB, while MP3 takes only ~1.4 MB (7-8x reduction through a psychoacoustic model).',
        },
        {
          id: 'B',
          textRo: 'WAV ocupă doar 50 KB, iar MP3 ocupă 1 GB.',
          textEn: 'WAV takes only 50 KB, and MP3 takes 1 GB.',
        },
        {
          id: 'C',
          textRo: 'Ambele formate ocupă exact același spațiu de stocare de 100 MB.',
          textEn: 'Both formats consume the exact same storage space of 100 MB.',
        },
        {
          id: 'D',
          textRo: 'WAV nu poate fi stocat pe hard-disk, doar în memoria RAM.',
          textEn: 'WAV cannot be stored on disk, only in RAM.',
        },
      ],
      correct: 'A',
      explanationRo: 'Calculul oficial: 44.100 Hz × (16/8 octeți) × 2 canale × 60s = 10.584.000 octeți ≈ 10,09 MB. MP3 elimină frecvențele inaudibile și reduce fișierul la ~1,4 MB/minut.',
      explanationEn: 'Official formula: 44,100 Hz × 2 bytes × 2 channels × 60s = 10,584,000 bytes ≈ 10.09 MB. MP3 discards inaudible frequencies and compresses file size to ~1.4 MB/min.',
    },
    {
      id: 4,
      questionRo: 'Care este diferența critică dintre comanda Trim (Decupare) și comanda Silence (Liniște) într-un editor precum WavePad?',
      questionEn: 'What is the critical difference between the Trim and Silence commands in an audio editor like WavePad?',
      options: [
        {
          id: 'A',
          textRo: 'Trim funcționează doar cu imagini, iar Silence doar cu video.',
          textEn: 'Trim works only on still images, while Silence works only on video.',
        },
        {
          id: 'B',
          textRo: 'Trim păstrează doar fragmentul selectat și șterge restul; Silence aduce volumul selecției la 0 dB fără a modifica durata totală a piesei sau sincronizarea.',
          textEn: 'Trim retains only the selected range and deletes everything else; Silence sets selection volume to 0 dB without altering total duration or sync.',
        },
        {
          id: 'C',
          textRo: 'Nu există nicio diferență între ele, ambele șterg întreaga melodie.',
          textEn: 'There is no difference between them; both erase the entire song.',
        },
        {
          id: 'D',
          textRo: 'Silence crește volumul la maxim, iar Trim oprește calculatorul.',
          textEn: 'Silence cranks volume to maximum, and Trim powers down the PC.',
        },
      ],
      correct: 'B',
      explanationRo: 'Trim (Decupare) izolează selecția și șterge ce este în jur. Silence (Liniște) transformă selecția în liniște absolută (amplitudine zero) FĂRĂ a scurta durata piesei, păstrând sincronizarea intactă.',
      explanationEn: 'Trim isolates the selection and eliminates what is outside. Silence mutes the selection to 0 dB WITHOUT altering track length, preserving sync intact.',
    },
    {
      id: 5,
      questionRo: 'În tehnica Paste Mix (Ctrl+Shift+V), cum trebuie reglate volumele celor două piste (Voce vs Melodie de fundal) pentru a asigura claritatea și a preveni clipping-ul?',
      questionEn: 'In Paste Mix technique (Ctrl+Shift+V), how should volume levels of the two tracks (Voice vs Music bed) be set to ensure clarity and prevent clipping?',
      options: [
        {
          id: 'A',
          textRo: 'Muzica la 100% și vocea la 10% pentru a se auzi doar ritmul.',
          textEn: 'Music at 100% and voice at 10% so only the rhythm is audible.',
        },
        {
          id: 'B',
          textRo: 'Ambele la 100%, indiferent de distorsiuni.',
          textEn: 'Both at 100%, regardless of distortion.',
        },
        {
          id: 'C',
          textRo: 'Vocea naratorului la 80–90% (clară), muzica de fundal la 15–25% (subtilă), iar suma lor să nu depășească 100% (0 dB) pentru a preveni clipping-ul.',
          textEn: 'Narrator voice at 80–90% (distinct), background music at 15–25% (subtle), with their sum below 100% (0 dB) to avoid clipping.',
        },
        {
          id: 'D',
          textRo: 'Ambele la 0%, sunetul se generează automat din titlu.',
          textEn: 'Both at 0%, sound auto-generates from track title.',
        },
      ],
      correct: 'C',
      explanationRo: 'Regula de aur a mixajului: Vocea trebuie să domine clar (80-90%), fundalul sonor trebuie să fie discret (15-25%), iar suma totală nu trebuie să depășească 100% (0 dB) pentru a evita tăierea distorsionată a vârfurilor (clipping).',
      explanationEn: 'Golden rule of mixing: Voice must lead clearly (80-90%), background music must remain discreet (15-25%), and total sum must not exceed 100% (0 dB) to avoid clipped peaks.',
    },
  ];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [cooldown, setCooldown] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const curQ = questions[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optId: string) => {
    if (cooldown > 0) return;
    if (optId === curQ.correct) {
      sounds.playCorrect();
      setErrorMsg('');
      setSelectedAnswers((prev) => ({ ...prev, [curQ.id]: optId }));

      if (currentIdx < questions.length - 1) {
        setTimeout(() => {
          setCurrentIdx((prev) => prev + 1);
        }, 600);
      } else {
        setIsCompleted(true);
      }
    } else {
      sounds.playWrong();
      setCooldown(5);
      setErrorMsg(
        lang === 'ro'
          ? `Răspuns greșit la întrebarea ${curQ.id}! ${curQ.explanationRo}`
          : `Incorrect answer to Question ${curQ.id}! ${curQ.explanationEn}`
      );
    }
  };

  const handleFinalSubmit = () => {
    sounds.playCorrect();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-white rounded-3xl border border-amber-500/40 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
            🏆
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <span>{lang === 'ro' ? 'Evaluare Sumativă Unitatea 2 • Manual Art Klett pag. 28–35' : 'Summative Assessment Unit 2 • Art Klett Textbook pp. 28–35'}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                {lang === 'ro' ? 'Nivelul 7/7' : 'Level 7/7'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              {lang === 'ro'
                ? 'Marele Examen de Acustică & Inginerie Audio WavePad'
                : 'Comprehensive Acoustics & WavePad Audio Engineering Exam'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 font-bold">
            {lang === 'ro'
              ? `Întrebarea ${currentIdx + 1} din ${questions.length}`
              : `Question ${currentIdx + 1} of ${questions.length}`}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isDone = selectedAnswers[q.id] !== undefined;
          const isCurrent = currentIdx === idx;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                if (isDone || isCurrent) {
                  setCurrentIdx(idx);
                  sounds.playClick();
                }
              }}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                isDone
                  ? 'bg-emerald-500 shadow-md shadow-emerald-500/40'
                  : isCurrent
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-slate-800'
              }`}
              title={lang === 'ro' ? `Întrebarea ${idx + 1}` : `Question ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-slate-800 flex flex-col gap-5 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-sm font-bold font-mono shrink-0">
            {curQ.id}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white leading-relaxed">
            {lang === 'ro' ? curQ.questionRo : curQ.questionEn}
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {curQ.options.map((opt) => {
            const isSelected = selectedAnswers[curQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={cooldown > 0}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-2xl text-xs sm:text-sm text-left transition font-medium cursor-pointer border flex items-start gap-3 ${
                  isSelected
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold shadow-lg'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                } disabled:opacity-50`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-amber-400 shrink-0">
                  {opt.id}
                </span>
                <span className="flex-1 mt-0.5">{lang === 'ro' ? opt.textRo : opt.textEn}</span>
              </button>
            );
          })}
        </div>

        {/* Error Cooldown Message */}
        {cooldown > 0 && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold font-mono">
                {lang === 'ro' ? `Cooldown Didactic: ${cooldown} secunde` : `Pedagogical Cooldown: ${cooldown} seconds`}
              </div>
              <div className="mt-0.5 leading-relaxed">{errorMsg}</div>
            </div>
          </div>
        )}

        {/* Success Message for Current Question */}
        {selectedAnswers[curQ.id] && (
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'ro'
                ? `Răspuns confirmat corect! ${curQ.explanationRo}`
                : `Correct answer confirmed! ${curQ.explanationEn}`}
            </span>
          </div>
        )}
      </div>

      {/* Completion Banner & Finish Button */}
      {isCompleted ? (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎓</div>
            <div>
              <h3 className="text-base font-black text-white font-heading">
                {lang === 'ro'
                  ? 'Examen Promovat cu Brio! (100 puncte • Nota 10)'
                  : 'Exam Passed with Distinction! (100 points • Grade 10)'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'ro'
                  ? 'Ai demonstrat stăpânirea deplină a acusticii digitale, frecvențelor Hz, decibelilor dB, eșantionării CD 44.1 kHz și tehnicilor de studio WavePad!'
                  : 'You demonstrated complete mastery of digital acoustics, Hz frequencies, dB levels, 44.1 kHz CD sampling, and WavePad studio editing!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinalSubmit}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
          >
            <span>{lang === 'ro' ? 'Revendică Diploma de Inginer Audio' : 'Claim Audio Engineering Diploma'}</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
          <span>
            {lang === 'ro'
              ? `Progres Examen: ${answeredCount} din ${questions.length} întrebări validate.`
              : `Exam Progress: ${answeredCount} of ${questions.length} questions validated.`}
          </span>
          {currentIdx < questions.length - 1 && selectedAnswers[curQ.id] && (
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question'}</span>
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
