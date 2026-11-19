import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, RotateCcw, Star, Clock, CheckCircle2, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { useArky } from '../context/ArkyContext';
import { useHints } from '../context/HintContext';
import { MascotaArky } from './MascotaArky';
import { logStudentResult } from '../lib/resultsService';
import { saveStudentDiploma } from '../lib/studentAuthService';
import { MISSION_META_BY_ID } from '../lib/carnetService';
import { VICTORY_MISSION_DATA, VictoryBadgeItem } from '../data/victoryMissionData';
import { computeGradeDetails } from '../utils/pedagogicalGrading';
import { AllMissionId, StudentDiploma } from '../types';

interface VictoryScreenProps {
  score: number;
  maxScore: number;
  studentName?: string;
  elapsedSeconds?: number;
  courseId?: AllMissionId | string;
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
  const { t, lang } = useLanguage();
  const arky = useArky();
  const { hintsCount } = useHints();
  const [studentName, setStudentName] = useState<string>(
    initialStudentName.trim() || t.vDiplomaDefaultName
  );
  const [isLoggedToFirebase, setIsLoggedToFirebase] = useState<boolean>(false);
  const hasLoggedRef = useRef<boolean>(false);

  const gradeDetails = computeGradeDetails(score, maxScore);
  const missionCfg = VICTORY_MISSION_DATA[courseId as AllMissionId];
  const diplomaMeta = MISSION_META_BY_ID[String(courseId)];

  const courseDbTitle = missionCfg
    ? lang === 'en'
      ? missionCfg.courseDbTitleEn
      : missionCfg.courseDbTitleRo
    : lang === 'en'
    ? 'Secret Tree Mission (Textbook pp. 27-30)'
    : 'Misiunea Arborele Secret (Manual pag. 27-30)';

  const heroEmoji = missionCfg?.heroEmoji || (diplomaMeta ? `${diplomaMeta.emoji}✨` : '🌳✨');
  const diplomaCornerEmoji = missionCfg?.diplomaCornerEmoji || diplomaMeta?.emoji || '🌳';

  const resolvedHeading = missionCfg?.headingEn
    ? lang === 'en'
      ? missionCfg.headingEn
      : missionCfg.headingRo
    : t.vTitle;

  const resolvedDesc = missionCfg?.descEn
    ? lang === 'en'
      ? missionCfg.descEn
      : missionCfg.descRo
    : t.vDesc;

  // Preserve specialized translation keys for early Grade 5 courses when omitted in VICTORY_MISSION_DATA
  const legacyDiplomaTitles: Record<string, string> = {
    hardware: t.hwDiplomaTitle,
    internet1: t.internet1DiplomaTitle,
    internet2: t.internet2DiplomaTitle,
    text1: t.text1DiplomaTitle,
    text2: t.text2DiplomaTitle,
  };

  const legacyDiplomaTexts: Record<string, string> = {
    hardware: t.hwDiplomaText,
    internet1: t.internet1DiplomaText,
    internet2: t.internet2DiplomaText,
    text1: t.text1DiplomaText,
    text2: t.text2DiplomaText,
  };

  const resolvedDiplomaTitle = missionCfg?.diplomaTitleEn
    ? lang === 'en'
      ? missionCfg.diplomaTitleEn
      : missionCfg.diplomaTitleRo
    : legacyDiplomaTitles[String(courseId)] || t.vDiplomaTitle;

  const resolvedDiplomaText = missionCfg?.diplomaTextEn
    ? lang === 'en'
      ? missionCfg.diplomaTextEn
      : missionCfg.diplomaTextRo
    : legacyDiplomaTexts[String(courseId)] || t.vDiplomaText;

  const defaultBadges: VictoryBadgeItem[] = [
    { emoji: '📁', titleRo: t.vBadge1Title, titleEn: t.vBadge1Title, subRo: t.vBadge1Sub, subEn: t.vBadge1Sub, subColorClass: 'text-emerald-400' },
    { emoji: '🎯', titleRo: t.vBadge2Title, titleEn: t.vBadge2Title, subRo: t.vBadge2Sub, subEn: t.vBadge2Sub, subColorClass: 'text-teal-400' },
    { emoji: '⚡️', titleRo: t.vBadge3Title, titleEn: t.vBadge3Title, subRo: t.vBadge3Sub, subEn: t.vBadge3Sub, subColorClass: 'text-cyan-400' },
    { emoji: '🔍', titleRo: t.vBadge4Title, titleEn: t.vBadge4Title, subRo: t.vBadge4Sub, subEn: t.vBadge4Sub, subColorClass: 'text-purple-400' },
    { emoji: '🛡️', titleRo: t.vBadge5Title, titleEn: t.vBadge5Title, subRo: t.vBadge5Sub, subEn: t.vBadge5Sub, subColorClass: 'text-rose-400' },
  ];

  const earnedBadges = missionCfg?.badges && missionCfg.badges.length > 0 ? missionCfg.badges : defaultBadges;

  const formatCompletionTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins === 0) return `${remainingSec} sec`;
    return `${mins} min ${remainingSec} sec`;
  };

  const buildDiplomaPayload = (resolvedName: string): StudentDiploma => ({
    id: String(courseId),
    courseId: String(courseId),
    titleRo: diplomaMeta?.diplomaTitleRo || courseDbTitle,
    titleEn: diplomaMeta?.diplomaTitleEn || courseDbTitle,
    grade: diplomaMeta?.gradeLabelRo || 'Clasa a V-a',
    studentName: resolvedName,
    awardedAt: new Date().toISOString(),
    score,
    maxScore,
    calificativ: lang === 'en' ? gradeDetails.calificativEn : gradeDetails.calificativRo,
    timeSpentSeconds: elapsedSeconds,
    officialRef: diplomaMeta
      ? `ARKY-${diplomaMeta.gradeNum}-${diplomaMeta.moduleCode}-${score}`
      : `ARKY-${String(courseId).toUpperCase()}-${score}`,
  });

  useEffect(() => {
    sounds.playVictory();
    arky.triggerFinished();

    // Ensure mission completed state is explicitly persisted to localStorage
    try {
      localStorage.setItem(`arkedo_completed_${courseId}`, 'true');
    } catch {}

    // Persist official diploma into Student Profile (localStorage + Cloud Firestore)
    const resolvedName = initialStudentName.trim() || studentName.trim() || t.vDiplomaDefaultName;
    saveStudentDiploma(buildDiplomaPayload(resolvedName));

    // Automatically log results to Firebase Firestore only once per active mission run
    const finalName = initialStudentName.trim() || studentName.trim() || (lang === 'en' ? 'Anonymous Student' : 'Elev Anonim');
    const sessionLogKey = `arkedo_victory_logged_${courseId}_${finalName}_${score}`;

    if (!hasLoggedRef.current && !sessionStorage.getItem(sessionLogKey)) {
      if (elapsedSeconds > 0 && finalName.toUpperCase() !== 'PRO') {
        hasLoggedRef.current = true;
        sessionStorage.setItem(sessionLogKey, 'true');

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
      } else {
        hasLoggedRef.current = true;
        sessionStorage.setItem(sessionLogKey, 'true');
      }
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
    const cleanName = studentName.trim() || t.vDiplomaDefaultName;
    saveStudentDiploma(buildDiplomaPayload(cleanName));
    window.print();
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
      {/* Decorative Icon */}
      <div className="text-6xl sm:text-7xl mb-3 drop-shadow-xl inline-block">
        {heroEmoji}
      </div>

      <div className="flex justify-center mb-2">
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm uppercase font-black tracking-widest border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
          <Award className="w-4 h-4 text-emerald-400 shrink-0" /> {t.vBadgeMission}
        </span>
      </div>

      <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 font-heading tracking-tight text-balance">
        {resolvedHeading}
      </h2>

      <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-3 mb-6 leading-relaxed">
        {resolvedDesc}
      </p>

      {/* Score & Statistics Summary Box */}
      <div className="w-full max-w-2xl inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-900/90 border border-amber-500/40 px-5 sm:px-6 py-4 rounded-2xl mb-6 shadow-inner">
        <div className="flex flex-wrap justify-center sm:flex-nowrap items-center gap-3 sm:gap-4">
          <div className="flex text-amber-400 text-2xl gap-1 shrink-0">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
          </div>
          <div className="text-center sm:text-left sm:border-l border-slate-700 sm:pl-4">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {t.vScoreLabel}
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-heading tabular-nums">
              {score} / {maxScore} ({lang === 'en' ? gradeDetails.calificativEn : gradeDetails.calificativRo})
            </div>
          </div>
        </div>

        {/* Duration */}
        {elapsedSeconds > 0 && (
          <div className="text-center sm:text-left sm:border-l border-slate-700 sm:pl-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{t.vDurationLabel}</span>
            </div>
            <div className="text-lg font-black text-cyan-300 font-mono tabular-nums">
              {formatCompletionTime(elapsedSeconds)}
            </div>
          </div>
        )}

        {/* Hints Used Metric */}
        <div className="text-center sm:text-left sm:border-l border-slate-700 sm:pl-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{lang === 'en' ? 'Hints Used' : 'Indicii folosite'}</span>
          </div>
          <div className="text-lg font-black font-mono tabular-nums">
            {hintsCount === 0 ? (
              <span className="text-emerald-300 flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" /> 0 ({lang === 'en' ? 'Autonomous' : 'Autonom'})
              </span>
            ) : (
              <span className="text-amber-300">
                {hintsCount} {hintsCount === 1 ? (lang === 'en' ? 'hint' : 'indiciu') : (lang === 'en' ? 'hints' : 'indicii')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cloud Sync Status */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-sm">
          {isLoggedToFirebase ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
          )}
          <span>{isLoggedToFirebase ? t.vCloudSaved : t.vCloudSaving}</span>
        </div>
      </div>

      {/* Autoevaluation from manual page 30 */}
      <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-700 rounded-2xl p-5 mb-8 text-left">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-2.5 border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            {t.vAutoevalTitle}
          </span>
          <span className="text-xs text-emerald-400 font-bold font-mono tabular-nums">
            {t.vAutoevalTime}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mb-3">
          {t.vAutoevalQuestion}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => sounds.playCorrect()}
            className="p-3 min-h-[44px] rounded-xl bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-500/80 text-emerald-200 text-xs font-bold text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelExcited}</span>
          </button>
          <button
            type="button"
            onClick={() => sounds.playClick()}
            className="p-3 min-h-[44px] rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelPleased}</span>
          </button>
          <button
            type="button"
            onClick={() => sounds.playClick()}
            className="p-3 min-h-[44px] rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelSad}</span>
          </button>
        </div>
      </div>

      {/* Badges Earned Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-w-3xl mx-auto mb-8 text-left">
        {earnedBadges.map((badge, idx) => (
          <div
            key={`${badge.titleEn}-${idx}`}
            className={`bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 ${
              idx === earnedBadges.length - 1 ? 'col-span-2 lg:col-span-1' : ''
            }`}
          >
            <span className="text-2xl">{badge.emoji}</span>
            <div>
              <div className="text-xs font-bold text-white">
                {lang === 'en' ? badge.titleEn : badge.titleRo}
              </div>
              <div className={`text-[10px] ${badge.subColorClass}`}>
                {lang === 'en' ? badge.subEn : badge.subRo}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arky Master Graduate Inline Greeting */}
      <div className="max-w-2xl mx-auto mb-8">
        <MascotaArky
          state="finished"
          position="inline"
          customMessage={
            lang === 'en'
              ? 'Mission Accomplished! You are officially an ArkyEdu Master of Files & Tech! Print your diploma below! 🏆🎓'
              : 'Misiune îndeplinită cu succes! Ești oficial un Maestru ArkyEdu în Fișiere și Tehnologie! Printează diploma de mai jos! 🏆🎓'
          }
        />
      </div>

      {/* Printable ArkyEdu Diploma */}
      <div
        id="diploma-to-print"
        className="bg-gradient-to-tr from-amber-50 via-white to-amber-100 text-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border-4 border-amber-400 shadow-2xl text-center relative mb-8"
      >
        <div className="border-2 border-dashed border-amber-600/40 p-6 sm:p-8 rounded-2xl relative">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {diplomaCornerEmoji}
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-widest text-left">
                {t.schoolName}
              </span>
            </div>
            <div className="text-3xl">🏅</div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-wide text-slate-900 uppercase font-heading text-balance">
            {resolvedDiplomaTitle}
          </h3>
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mt-1">
            {t.vDiplomaDept}
          </p>

          <p className="text-xs text-slate-500 mt-4">{t.vDiplomaAwardTo}</p>

          <div className="my-3">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={t.vDiplomaDefaultName}
              className="w-full text-center text-xl sm:text-3xl font-black text-emerald-700 bg-amber-50/70 border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-700 py-1.5 px-3 rounded-lg"
              title={lang === 'en' ? 'Click to edit your name on the certificate' : 'Apasă pentru a edita numele tău pe diplomă'}
            />
          </div>

          <div className="my-3 inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-200/70 border-2 border-amber-600/40 shadow-sm">
            <span className="text-base">⭐</span>
            <span className="text-xs sm:text-sm font-black text-amber-950 font-mono tabular-nums">
              {score} / {maxScore} Puncte • {lang === 'en' ? gradeDetails.calificativEn : gradeDetails.calificativRo}
            </span>
            <span className="text-base">⭐</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto mt-2">
            {resolvedDiplomaText}
          </p>

          <div className="mt-8 pt-5 border-t border-amber-300 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
            <div className="text-left">
              <div className="font-extrabold text-slate-900">{t.vDiplomaTeacher}</div>
              <div className="text-[11px] text-slate-600">{t.schoolName}</div>
            </div>
            <div className="text-right ml-auto">
              <div className="font-extrabold text-slate-900">{t.vDiplomaDate}</div>
              <div className="text-[11px] text-slate-600">ArkyEdu TIC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handlePrint}
          className="min-h-[44px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 font-heading cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <Printer className="w-4 h-4 shrink-0" />
          <span>{t.vBtnPrint}</span>
        </button>

        {onBackToCatalog && (
          <button
            type="button"
            onClick={onBackToCatalog}
            className="min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 font-heading cursor-pointer active:scale-95 shadow-md shadow-emerald-600/30 whitespace-nowrap"
          >
            <span>{t.backToCourses}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 font-heading cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span>{t.vBtnReset}</span>
        </button>
      </div>
    </div>
  );
};
