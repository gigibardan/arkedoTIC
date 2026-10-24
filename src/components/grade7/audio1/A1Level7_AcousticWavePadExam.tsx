import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A1Level7Props {
  onPass: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
}

export const A1Level7_AcousticWavePadExam: React.FC<A1Level7Props> = ({ onPass }) => {
  const questions: Question[] = [
    {
      id: 1,
      question: 'Care este intervalul de frecvențe perceput de urechea umană sănătoasă și în ce unitate de măsură se exprimă numărul de oscilații pe secundă?',
      options: [
        { id: 'A', text: '0 dB – 100 dB, măsurat în Decibeli.' },
        { id: 'B', text: '20 Hz – 20.000 Hz (20 kHz), măsurat în Hertz (Hz).' },
        { id: 'C', text: '128 kbps – 320 kbps, măsurat în biți pe secundă.' },
        { id: 'D', text: '10 Hz – 100.000 Hz, măsurat în MegaHertz.' },
      ],
      correct: 'B',
      explanation: 'Urechea umană aude sunete cuprinse între 20 Hz (frecvențe foarte joase/grave) și 20.000 Hz (frecvențe foarte înalte/acute). Sub 20 Hz sunt Infrasunetele, iar peste 20 kHz sunt Ultrasunetele.',
    },
    {
      id: 2,
      question: 'De ce este rata de eșantionare standard a formatului Audio CD stabilită la 44.100 Hz (44.1 kHz) pe 16 biți?',
      options: [
        { id: 'A', text: 'Pentru că microfonul fizic poate trimite doar 44 de impulsuri electrice pe secundă.' },
        { id: 'B', text: 'Pentru că este numărul maxim de caractere dintr-un fișier text.' },
        { id: 'C', text: 'Conform teoremei Nyquist-Shannon, eșantionarea trebuie să fie de cel puțin 2 ori frecvența maximă auzită (2 × 20 kHz = 40 kHz + 10% marjă de filtrare), iar 16 biți oferă 65.536 trepte curate de dinamică.' },
        { id: 'D', text: 'Pentru că 44.100 Hz funcționează exclusiv pe calculatoare cu Windows.' },
      ],
      correct: 'C',
      explanation: 'Teorema Nyquist-Shannon impune ca rata de eșantionare să depășească dublul celei mai înalte frecvențe de captat (2 × 20 kHz = 40 kHz). Cu marja de filtrare trece-jos, s-a adoptat 44.1 kHz și 16 biți (96 dB dinamică).',
    },
    {
      id: 3,
      question: 'Cât spațiu ocupă 1 minut (60 sec) de sunet necomprimat WAV Stereo (44.1 kHz, 16 biți, 2 canale) comparativ cu un fișier comprimat MP3 la 192 kbps?',
      options: [
        { id: 'A', text: 'WAV ocupă aproximativ 10,1 MB, în timp ce MP3 ocupă doar ~1,4 MB (reducere de peste 7-8 ori prin model psihoacustic).' },
        { id: 'B', text: 'WAV ocupă doar 50 KB, iar MP3 ocupă 1 GB.' },
        { id: 'C', text: 'Ambele formate ocupă exact același spațiu de stocare de 100 MB.' },
        { id: 'D', text: 'WAV nu poate fi stocat pe hard-disk, doar în memoria RAM.' },
      ],
      correct: 'A',
      explanation: 'Calculul oficial: 44.100 Hz × (16/8 octeți) × 2 canale × 60s = 10.584.000 octeți ≈ 10,09 MB. MP3 elimină frecvențele inaudibile și reduce fișierul la ~1,4 MB/minut.',
    },
    {
      id: 4,
      question: 'Care este diferența critică dintre comanda Trim (Decupare) și comanda Silence (Liniște) într-un editor precum WavePad?',
      options: [
        { id: 'A', text: 'Trim funcționează doar cu imagini, iar Silence doar cu video.' },
        { id: 'B', text: 'Trim păstrează doar fragmentul selectat și șterge restul; Silence aduce volumul selecției la 0 dB fără a modifica durata totală a piesei sau sincronizarea.' },
        { id: 'C', text: 'Nu există nicio diferență între ele, ambele șterg întreaga melodie.' },
        { id: 'D', text: 'Silence crește volumul la maxim, iar Trim oprește calculatorul.' },
      ],
      correct: 'B',
      explanation: 'Trim (Decupare) izolează selecția și șterge ce este în jur. Silence (Liniște) transformă selecția în liniște absolută (amplitudine zero) FĂRĂ a scurta durata piesei, păstrând sincronizarea intactă.',
    },
    {
      id: 5,
      question: 'În tehnica Paste Mix (Ctrl+Shift+V), cum trebuie reglate volumele celor două piste (Voce vs Melodie de fundal) pentru a asigura claritatea și a preveni clipping-ul?',
      options: [
        { id: 'A', text: 'Muzica la 100% și vocea la 10% pentru a se auzi doar ritmul.' },
        { id: 'B', text: 'Ambele la 100%, indiferent de distorsiuni.' },
        { id: 'C', text: 'Vocea naratorului la 80–90% (clară), muzica de fundal la 15–25% (subtilă), iar suma lor să nu depășească 100% (0 dB) pentru a preveni clipping-ul.' },
        { id: 'D', text: 'Ambele la 0%, sunetul se generează automat din titlu.' },
      ],
      correct: 'C',
      explanation: 'Regula de aur a mixajului: Vocea trebuie să domine clar (80-90%), fundalul sonor trebuie să fie discret (15-25%), iar suma totală nu trebuie să depășească 100% (0 dB) pentru a evita tăierea distorsionată a vârfurilor (clipping).',
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
      setErrorMsg(`Răspuns greșit la întrebarea ${curQ.id}! ${curQ.explanation}`);
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
              <span>Evaluare Sumativă Unitatea 2 • Manual Art Klett pag. 28–35</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">Nivelul 7/7</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              Marele Examen de Acustică & Inginerie Audio WavePad
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 font-bold">
            Întrebarea {currentIdx + 1} din {questions.length}
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
              title={`Întrebarea ${idx + 1}`}
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
            {curQ.question}
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
                <span className="flex-1 mt-0.5">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Error Cooldown Message */}
        {cooldown > 0 && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold font-mono">Cooldown Didactic: {cooldown} secunde</div>
              <div className="mt-0.5 leading-relaxed">{errorMsg}</div>
            </div>
          </div>
        )}

        {/* Success Message for Current Question */}
        {selectedAnswers[curQ.id] && (
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Răspuns confirmat corect! {curQ.explanation}</span>
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
                Examen Promovat cu Brio! (100 puncte • Nota 10)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Ai demonstrat stăpânirea deplină a acusticii digitale, frecvențelor Hz, decibelilor dB, eșantionării CD 44.1 kHz și tehnicilor de studio WavePad!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinalSubmit}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
          >
            <span>Revendică Diploma de Inginer Audio</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
          <span>Progres Examen: {answeredCount} din {questions.length} întrebări validate.</span>
          {currentIdx < questions.length - 1 && selectedAnswers[curQ.id] && (
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Următoarea Întrebare</span>
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
