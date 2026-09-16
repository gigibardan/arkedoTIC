import React, { useState } from 'react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';
import { Calculator, Award, CheckCircle2, HardDrive, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HLevel5Props {
  onComplete: () => void;
}

export const HLevel5_BitsQuiz: React.FC<HLevel5Props> = ({ onComplete }) => {
  const { lang, t } = useLanguage();

  // Task 1: Capacity math problem (pag. 20, ex. 3)
  const [step1GB, setStep1GB] = useState<string>('');
  const [step2TotalGB, setStep2TotalGB] = useState<string>('');
  const [step3MB, setStep3MB] = useState<string | null>(null);

  // Task 2: Magnetic storage device identification (pag. 20, ex. 2)
  const [selectedMagneticDevice, setSelectedMagneticDevice] = useState<string | null>(null);

  // Task 3: Animal riddle (Rebus pag. 20)
  const [riddleWord, setRiddleWord] = useState<string>('');

  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const isMathValid =
    step1GB.trim() === '1024' &&
    step2TotalGB.trim() === '1536' &&
    step3MB === '1572864';

  const isMagneticValid = selectedMagneticDevice === 'hdd';
  const isRiddleValid = riddleWord.trim().toUpperCase() === 'MOUSE';

  const canValidate = step3MB !== null && selectedMagneticDevice !== null && riddleWord.trim().length > 0;

  const handleValidate = () => {
    if (!canValidate) {
      sounds.playWrong();
      setShowErrors(true);
      return;
    }

    if (isMathValid && isMagneticValid && isRiddleValid) {
      sounds.playVictory();
      setCompleted(true);
      onComplete();
    } else {
      sounds.playWrong();
      setShowErrors(true);
    }
  };

  const storageDevices = [
    {
      id: 'ssd',
      icon: '🔲',
      title: lang === 'en' ? 'SSD (Solid-State Drive)' : 'SSD (Solid-State)',
      desc: lang === 'en' ? 'Flash Memory Chips' : 'Cipuri Flash / Semiconductori'
    },
    {
      id: 'hdd',
      icon: '🧲',
      title: lang === 'en' ? 'HDD (Hard Disk Drive)' : 'HDD (Discul Dur)',
      desc: lang === 'en' ? 'Rotating magnetic platters ✓' : 'Discuri magnetice rotative ✓'
    },
    {
      id: 'usb',
      icon: '🔌',
      title: lang === 'en' ? 'USB Flash Drive' : 'Stick USB',
      desc: lang === 'en' ? 'Flash Memory Chips' : 'Cipuri Flash / Semiconductori'
    },
    {
      id: 'cd',
      icon: '💿',
      title: lang === 'en' ? 'CD / DVD Optical Disc' : 'Disc CD / DVD',
      desc: lang === 'en' ? 'Optical / Laser Beam' : 'Optic / Rază Laser'
    },
  ];

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-black uppercase tracking-wider font-mono">
              {lang === 'en' ? 'Level 5 of 5 • Final Assessment' : 'Nivelul 5 din 5 • Autoevaluare & Final'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {t.bookPagePrefix} 18–20</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            {lang === 'en' ? 'The Grand Bit Challenge & ICT Riddle 🎯' : 'Marea Provocare a Biților & Rebusul TIC 🎯'}
          </h2>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            {lang === 'en' ? 'Reward: +20 points (100 Max)' : 'Recompensă: +20 puncte (100 Max)'}
          </span>
        </div>
      </div>

      {/* Teacher Pro Tip */}
      <TeacherTip
        title={lang === 'en' ? 'Teacher Pro Tip: Why is 1 KB = 1024 Bytes and not 1000?' : 'Sfat de Profesionist: De ce 1 KB = 1024 Bytes și nu 1000?'}
        tip={lang === 'en'
          ? '• In daily life we use base-10 decimals (1 kilometer = 1000 meters), but inside computers everything is built on powers of 2 (2¹⁰ = 1024)! Hence: 1 Byte = 8 bits, 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB!'
          : '• În viața obișnuită lucrăm în sistem zecimal (1 kilometru = 1000 metri), dar în calculatoare totul se bazează pe puteri ale lui 2 (2¹⁰ = 1024)! Așadar: 1 Byte = 8 biți, 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB!'}
        bookPage="19–20"
        extraAdvice={lang === 'en'
          ? 'When a manufacturer sells a 1 TB SSD labeled 1,000,000 MB, Windows calculates in binary (dividing by 1024), which is why ~931 GB is shown as available!'
          : 'Când un producător vinde un SSD de 1 TB cu 1.000.000 MB, Windows calculează binar (împarte la 1024), de aceea apar circa 931 GB disponibili!'}
      />

      {/* Task 1: The official textbook math problem (pag. 20, ex. 3) */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-rose-400" />
            <span>{lang === 'en' ? 'Challenge 1: Problem from textbook (p. 20, ex. 3)' : 'Provocarea 1: Problema din manual (pag. 20, ex. 3)'}</span>
          </h3>
          <span className="text-xs font-mono text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
            {lang === 'en' ? 'Binary Math' : 'Calcul Binar'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
          {lang === 'en'
            ? '“A computer is equipped with a 1 TB HDD and a 512 GB SSD. What is the total storage capacity of this computer expressed in MB?”'
            : '„Un calculator dispune de un 1 TB HDD și de un 512 GB SSD. Care este capacitatea de stocare totală pentru acel calculator, exprimată în MB?”'}
        </p>

        {/* Guided Step-by-Step interactive inputs */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-300">
              <strong>{lang === 'en' ? 'Step 1:' : 'Pasul 1:'}</strong> {lang === 'en' ? 'How many GB are in 1 TB according to textbook p. 19?' : 'Câți GB conține 1 TB conform manualului pag. 19?'}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                value={step1GB}
                onChange={(e) => setStep1GB(e.target.value)}
                placeholder={lang === 'en' ? 'Enter GB...' : 'Introdu GB...'}
                className={`w-32 bg-slate-900 border px-3 py-1.5 rounded-lg text-xs text-white font-mono focus:outline-none ${
                  step1GB === '1024'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-slate-700'
                }`}
              />
              <span className="font-mono text-slate-400">GB</span>
              {step1GB === '1024' && <span className="text-emerald-400 font-bold">✓</span>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-300">
              <strong>{lang === 'en' ? 'Step 2:' : 'Pasul 2:'}</strong> {lang === 'en' ? 'Total combined storage in GB (1024 GB + 512 GB):' : 'Capacitatea totală adunată în GB (1024 GB + 512 GB):'}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                value={step2TotalGB}
                onChange={(e) => setStep2TotalGB(e.target.value)}
                placeholder="1024 + 512..."
                className={`w-32 bg-slate-900 border px-3 py-1.5 rounded-lg text-xs text-white font-mono focus:outline-none ${
                  step2TotalGB === '1536'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-slate-700'
                }`}
              />
              <span className="font-mono text-slate-400">GB</span>
              {step2TotalGB === '1536' && <span className="text-emerald-400 font-bold">✓</span>}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-300 block mb-2 font-semibold">
              <strong>{lang === 'en' ? 'Step 3:' : 'Pasul 3:'}</strong> {lang === 'en' ? 'Multiply 1536 GB by 1024 to determine total MB:' : 'Înmulțim 1536 GB cu 1024 pentru a afla capacitatea totală în MB:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: '1500000', label: lang === 'en' ? '1,500,000 MB (decimal rounded)' : '1.500.000 MB (calcul zecimal rotunjit)' },
                { id: '1572864', label: lang === 'en' ? '1,572,864 MB (1536 × 1024) ✓' : '1.572.864 MB (1536 × 1024) ✓' },
                { id: '2048000', label: '2.048.000 MB' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    sounds.playClick();
                    setStep3MB(opt.id);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-mono font-bold transition border text-left cursor-pointer ${
                    step3MB === opt.id
                      ? opt.id === '1572864'
                        ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 shadow'
                        : 'bg-rose-950/40 text-rose-300 border-rose-500'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task 2: Magnetic storage device identification (pag. 20, ex. 2) */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-6">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 mb-2">
          <HardDrive className="w-5 h-5 text-amber-400" />
          <span>{lang === 'en' ? 'Challenge 2: Magnetic storage device (p. 20, ex. 2)' : 'Provocarea 2: Dispozitivul de stocare magnetic (pag. 20, ex. 2)'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 mb-3">
          {lang === 'en'
            ? 'Which of these storage media uses rotating magnetic platters with read/write heads?'
            : 'Care dintre aceste medii de stocare folosește discuri magnetice rotative cu capete de citire?'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {storageDevices.map(dev => (
            <button
              key={dev.id}
              onClick={() => {
                sounds.playClick();
                setSelectedMagneticDevice(dev.id);
              }}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-between min-h-[110px] ${
                selectedMagneticDevice === dev.id
                  ? dev.id === 'hdd'
                    ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 ring-1 ring-emerald-400 shadow'
                    : 'bg-rose-950/40 text-rose-300 border-rose-500'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              <span className="text-3xl">{dev.icon}</span>
              <span className="text-xs font-bold text-white mt-1">{dev.title}</span>
              <span className="text-[10px] text-slate-400">{dev.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task 3: Riddle from textbook crossword (pag. 20, ex. 3) */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-6">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span>{lang === 'en' ? 'Challenge 3: Crossword riddle from textbook (p. 20, vertical clue)' : 'Provocarea 3: Rebusul din manual (pag. 20, rebus vertical)'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 mb-3">
          {lang === 'en'
            ? '“The pointing and selection input device named after a small rodent in English:”'
            : '„Dispozitivul de intrare pentru indicare și selecție pe ecran, numit după un mic animal în limba engleză:”'}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            maxLength={10}
            value={riddleWord}
            onChange={(e) => setRiddleWord(e.target.value.toUpperCase())}
            placeholder="M _ _ _ _"
            className="bg-slate-950 border-2 border-teal-500/60 px-4 py-2.5 rounded-xl text-base sm:text-lg font-mono font-black text-teal-300 uppercase tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-teal-400/40"
          />

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>{lang === 'en' ? 'Hint: 5 letters (M - O - U - S - E)' : 'Indiciu: 5 litere (M - O - U - S - E)'}</span>
            {isRiddleValid && (
              <span className="text-emerald-400 font-bold ml-2">
                {lang === 'en' ? '✓ Correct: MOUSE!' : '✓ Corect: MOUSE!'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Validation / Final Victory Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          {completed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'You earned 100/100 Points! Generating diploma...' : 'Ai obținut 100/100 Puncte! Diploma se generează acum...'}
            </span>
          ) : (
            <span>{lang === 'en' ? 'Calculate storage capacity, choose magnetic device, and solve the riddle.' : 'Completează calculul capacității, alege dispozitivul magnetic și scrie cuvântul din rebus.'}</span>
          )}
        </div>

        <button
          onClick={handleValidate}
          disabled={completed}
          className={`px-6 py-3.5 rounded-2xl font-black text-sm transition flex items-center gap-2 shadow-xl cursor-pointer ${
            completed
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 active:scale-95'
          }`}
        >
          <Award className="w-5 h-5 text-amber-300" />
          <span>{completed ? (lang === 'en' ? 'Mission Finished!' : 'Misiune Încheiată!') : (lang === 'en' ? 'Complete Mission & Claim Diploma' : 'Finalizează Misiunea & Revendică Diploma')}</span>
        </button>
      </div>
    </div>
  );
};
