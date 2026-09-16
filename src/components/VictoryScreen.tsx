import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, RotateCcw, Star, Clock, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { logStudentResult } from '../lib/resultsService';

interface VictoryScreenProps {
  score: number;
  maxScore: number;
  studentName?: string;
  elapsedSeconds?: number;
  courseId?: 'hardware' | 'files';
  onReset: () => void;
  onBackToCatalog?: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  score,
  maxScore,
  studentName: initialStudentName = '',
  elapsedSeconds = 0,
  courseId = 'files',
  onReset,
  onBackToCatalog,
}) => {
  const { t } = useLanguage();
  const [studentName, setStudentName] = useState<string>(
    initialStudentName.trim() || t.vDiplomaDefaultName
  );
  const [isLoggedToFirebase, setIsLoggedToFirebase] = useState<boolean>(false);
  const hasLoggedRef = useRef<boolean>(false);

  const isHardware = courseId === 'hardware';
  const courseDbTitle = isHardware
    ? 'Misiunea Sisteme de calcul și comunicații (Manual pag. 10-20)'
    : 'Misiunea Arborele Secret (Manual pag. 27-30)';

  const formatCompletionTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins === 0) return `${remainingSec} sec`;
    return `${mins} min ${remainingSec} sec`;
  };

  useEffect(() => {
    sounds.playVictory();
    
    // Automatically log results to Firebase Firestore
    if (!hasLoggedRef.current) {
      hasLoggedRef.current = true;
      const finalName = initialStudentName.trim() || studentName.trim() || 'Elev Anonim';
      logStudentResult(
        finalName,
        courseDbTitle,
        score,
        maxScore,
        elapsedSeconds
      ).then((docId) => {
        if (docId) {
          setIsLoggedToFirebase(true);
        }
      });
    }

    // Launch festive confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 500);
      return () => clearTimeout(timeout);
    } catch {
      // Fallback
    }
  }, []);

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
      {/* Decorative Icon & Glow */}
      <div className="text-6xl sm:text-7xl mb-3 animate-float drop-shadow-xl inline-block">
        {isHardware ? '💻⚡' : '🌳✨'}
      </div>

      <div className="flex justify-center mb-2">
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm uppercase font-black tracking-widest border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
          <Award className="w-4 h-4 text-emerald-400" /> {t.vBadgeMission}
        </span>
      </div>

      <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 font-heading tracking-tight">
        {isHardware ? 'Felicitări, Tehnician Hardware & TIC!' : t.vTitle}
      </h2>

      <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-3 mb-6 leading-relaxed">
        {isHardware
          ? 'Ai finalizat cu succes evaluarea completă a Unității 1: cunoști regulile de securitate, ergonomia, istoria calculatoarelor, piesele unității centrale și calculul biților!'
          : t.vDesc}
      </p>

      {/* Score Summary Box */}
      <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-900/90 border border-amber-500/40 px-6 py-3.5 rounded-2xl mb-6 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="flex text-amber-400 text-2xl gap-1">
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div className="text-left border-l border-slate-700 pl-4">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {t.vScoreLabel}
            </div>
            <div className="text-2xl font-black text-amber-300 font-heading">
              {score} / {maxScore} ({t.vScorePerfect})
            </div>
          </div>
        </div>

        {elapsedSeconds > 0 && (
          <div className="text-left sm:border-l border-slate-700 sm:pl-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.vDurationLabel}</span>
            </div>
            <div className="text-lg font-black text-cyan-300 font-mono">
              {formatCompletionTime(elapsedSeconds)}
            </div>
          </div>
        )}
      </div>

      {/* Cloud Sync Status */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-sm">
          <CheckCircle2 className={`w-4 h-4 text-emerald-400 ${isLoggedToFirebase ? '' : 'animate-spin'}`} />
          <span>{isLoggedToFirebase ? t.vCloudSaved : t.vCloudSaving}</span>
        </div>
      </div>

      {/* Autoevaluation from manual page 30 */}
      <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-700 rounded-2xl p-5 mb-8 text-left">
        <div className="flex justify-between items-center mb-2.5 border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            {t.vAutoevalTitle}
          </span>
          <span className="text-xs text-emerald-400 font-bold font-mono">
            {t.vAutoevalTime}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mb-3">
          {t.vAutoevalQuestion}
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => sounds.playCorrect()}
            className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-500/80 text-emerald-200 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelExcited}</span>
          </button>
          <button
            onClick={() => sounds.playClick()}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelPleased}</span>
          </button>
          <button
            onClick={() => sounds.playClick()}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelSad}</span>
          </button>
        </div>
      </div>

      {/* Badges Earned Grid (All 5 levels) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-3xl mx-auto mb-8 text-left">
        {isHardware ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-xs font-bold text-white">Inspector TIC</div>
                <div className="text-[10px] text-emerald-400">Norme & Ergonomie</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">⏳</span>
              <div>
                <div className="text-xs font-bold text-white">Crononaut</div>
                <div className="text-[10px] text-teal-400">1642 - Pascalina</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🖥️</span>
              <div>
                <div className="text-xs font-bold text-white">Asamblor PC</div>
                <div className="text-[10px] text-cyan-400">CPU, RAM, Mobo</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔌</span>
              <div>
                <div className="text-xs font-bold text-white">Triere Flux</div>
                <div className="text-[10px] text-purple-400">Intrare / Ieșire</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-xs font-bold text-white">Maestru Biți</div>
                <div className="text-[10px] text-rose-400">1 TB = 1024 GB</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📁</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge1Title}</div>
                <div className="text-[10px] text-emerald-400">{t.vBadge1Sub}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge2Title}</div>
                <div className="text-[10px] text-teal-400">{t.vBadge2Sub}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">⚡️</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge3Title}</div>
                <div className="text-[10px] text-cyan-400">{t.vBadge3Sub}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge4Title}</div>
                <div className="text-[10px] text-purple-400">{t.vBadge4Sub}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge5Title}</div>
                <div className="text-[10px] text-rose-400">{t.vBadge5Sub}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Printable ARKEDO Diploma */}
      <div
        id="diploma-to-print"
        className="bg-gradient-to-tr from-amber-50 via-white to-amber-100 text-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border-4 border-amber-400 shadow-2xl text-center relative mb-8"
      >
        <div className="border-2 border-dashed border-amber-600/40 p-6 sm:p-8 rounded-2xl relative">
          {/* Header Diploma */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                {isHardware ? '💻' : '🌳'}
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-widest">
                {t.schoolName}
              </span>
            </div>
            <div className="text-3xl">🏅</div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-wide text-slate-900 uppercase font-heading">
            {isHardware ? t.hwDiplomaTitle : t.vDiplomaTitle}
          </h3>
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mt-1">
            {t.vDiplomaDept}
          </p>

          <p className="text-xs text-slate-500 mt-4">{t.vDiplomaAwardTo}</p>

          {/* Student Name Input / Display */}
          <div className="my-3">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={t.vDiplomaDefaultName}
              className="w-full text-center text-xl sm:text-3xl font-black text-emerald-700 bg-amber-50/70 border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-700 py-1.5 px-3 rounded-lg"
              title="Apasă pentru a edita numele tău pe diplomă"
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto mt-3">
            {isHardware ? t.hwDiplomaText : t.vDiplomaText}
          </p>

          {/* Signatures & Date */}
          <div className="mt-8 pt-5 border-t border-amber-300 flex items-center justify-between text-xs text-slate-700">
            <div className="text-left">
              <div className="font-extrabold text-slate-900">{t.vDiplomaTeacher}</div>
              <div className="text-[11px] text-slate-600">{t.schoolName}</div>
            </div>
            <div className="text-right">
              <div className="font-extrabold text-slate-900">{t.vDiplomaDate}</div>
              <div className="text-[11px] text-slate-600">ARKEDO TIC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handlePrint}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 font-heading cursor-pointer active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>{t.vBtnPrint}</span>
        </button>

        {onBackToCatalog && (
          <button
            onClick={onBackToCatalog}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 font-heading cursor-pointer active:scale-95 shadow-md shadow-emerald-600/30"
          >
            <span>Înapoi la Catalog Cursuri</span>
          </button>
        )}

        <button
          onClick={onReset}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 font-heading cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.vBtnReset}</span>
        </button>
      </div>
    </div>
  );
};

