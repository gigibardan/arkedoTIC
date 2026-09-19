import React, { useState } from 'react';
import { FolderPlus, ArrowLeft, CheckCircle2, ChevronRight, HardDrive, Laptop, Sparkles } from 'lucide-react';
import { TeacherTip } from './TeacherTip';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { AnswerExplanation } from './common/AnswerExplanation';
import { QuestionHint } from './common/QuestionHint';

interface Level1Props {
  onComplete: () => void;
}

export const Level1_Structure: React.FC<Level1Props> = ({ onComplete }) => {
  const { t, lang } = useLanguage();

  // Simulator state
  const [currentPath, setCurrentPath] = useState<'desktop' | 'baza_secreta'>('desktop');
  const [hasRootFolder, setHasRootFolder] = useState<boolean>(false);
  const [hasJocuri, setHasJocuri] = useState<boolean>(false);
  const [hasTeme, setHasTeme] = useState<boolean>(false);
  const [shortcutWinEUsed, setShortcutWinEUsed] = useState<boolean>(false);

  // Checkbox steps
  const [chk1, setChk1] = useState<boolean>(false);
  const [chk2, setChk2] = useState<boolean>(false);
  const [chk3, setChk3] = useState<boolean>(false);

  const handleCreateRoot = () => {
    sounds.playCorrect();
    setHasRootFolder(true);
    setChk1(true);
  };

  const handleOpenRoot = () => {
    sounds.playClick();
    setCurrentPath('baza_secreta');
  };

  const handleBackToDesktop = () => {
    sounds.playClick();
    setCurrentPath('desktop');
  };

  const handleCreateJocuri = () => {
    sounds.playCorrect();
    setHasJocuri(true);
    setChk2(true);
  };

  const handleCreateTeme = () => {
    sounds.playCorrect();
    setHasTeme(true);
    setChk3(true);
  };

  const isLevelCompleted =
    ((hasRootFolder && hasJocuri && hasTeme) || (chk1 && chk2 && chk3)) && shortcutWinEUsed;

  const handleFinish = () => {
    sounds.playLevelUp();
    onComplete();
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Title & Mission Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-5">
        <div>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
            {t.l1Tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
            {t.l1Title}
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {t.l1Desc}
          </p>
        </div>
        <div className="hidden sm:flex text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-emerald-400">
          🏗️
        </div>
      </div>

      {/* Teacher Tip from Textbook (p. 27 & 28) */}
      <TeacherTip
        title={t.l1TipTitle}
        tip={t.l1TipText}
        bookPage="27"
        extraAdvice={t.l1TipExtra}
      />

      {/* Main Grid: Interactive OS Simulator & Tree Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Virtual File Explorer Simulator (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* OS Window Title Bar */}
          <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
              <span className="font-semibold text-slate-300 ml-2 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-slate-400" /> ARKEDO File Explorer
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">ARKEDO OS v5.0</span>
          </div>

          {/* Breadcrumb Path Bar */}
          <div className="bg-slate-950/70 px-4 py-2.5 text-xs flex items-center gap-2 text-slate-300 border-b border-slate-800 font-mono">
            <span className="text-slate-400">{lang === 'en' ? '📍 Path:' : '📍 Cale:'}</span>
            <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700/80 text-emerald-400">
              <HardDrive className="w-3 h-3 text-slate-400" />
              <span>{currentPath === 'desktop' ? t.l1PathDesktop : t.l1PathInside}</span>
            </div>
          </div>

          {/* Explorer Workspace Content */}
          <div className="p-6 min-h-[220px] flex-1 bg-slate-900/60 flex flex-wrap gap-5 items-start">
            {currentPath === 'desktop' ? (
              <>
                {hasRootFolder ? (
                  <div
                    onClick={handleOpenRoot}
                    className="flex flex-col items-center p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer border-2 border-emerald-500/50 hover:border-emerald-400 transition transform hover:scale-105 shadow-lg w-32 text-center group"
                    title={lang === 'en' ? 'Click to open folder' : 'Click pentru a deschide folderul'}
                  >
                    <div className="text-5xl group-hover:scale-110 transition drop-shadow">
                      📁
                    </div>
                    <span className="text-xs font-bold mt-2 text-emerald-300 truncate w-full">
                      {lang === 'en' ? 'Secret Base' : 'Baza Secreta'}
                    </span>
                    <span className="text-[10px] text-amber-300 font-medium mt-0.5">
                      {t.l1RootHint}
                    </span>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-10 text-center text-slate-500">
                    <FolderPlus className="w-12 h-12 stroke-[1.5] text-slate-600 mb-2" />
                    <p className="text-sm font-medium">{t.l1EmptyDesktop}</p>
                  </div>
                )}
              </>
            ) : (
              /* Inside "Baza Secreta" folder */
              <div className="w-full flex flex-wrap gap-4">
                {hasJocuri ? (
                  <div className="flex flex-col items-center p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 shadow-md w-32 text-center animate-fade">
                    <div className="text-5xl drop-shadow">🎮</div>
                    <span className="text-xs font-bold mt-2 text-cyan-300">{lang === 'en' ? 'Games' : 'Jocuri'}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{lang === 'en' ? 'Subfolder' : 'Subfolder'}</span>
                  </div>
                ) : null}

                {hasTeme ? (
                  <div className="flex flex-col items-center p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 shadow-md w-32 text-center animate-fade">
                    <div className="text-5xl drop-shadow">📚</div>
                    <span className="text-xs font-bold mt-2 text-amber-300">{lang === 'en' ? 'Homework' : 'Teme'}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{lang === 'en' ? 'Subfolder' : 'Subfolder'}</span>
                  </div>
                ) : null}

                {!hasJocuri && !hasTeme && (
                  <div className="w-full py-8 text-center text-slate-500 text-xs">
                    {t.l1InsideEmpty}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="bg-slate-800/80 px-4 py-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {currentPath === 'desktop' && !hasRootFolder && (
                <button
                  onClick={handleCreateRoot}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" /> {t.l1BtnRoot}
                </button>
              )}

              {currentPath === 'baza_secreta' && (
                <>
                  {!hasJocuri && (
                    <button
                      onClick={handleCreateJocuri}
                      className="bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4" /> {t.l1BtnJocuri}
                    </button>
                  )}
                  {!hasTeme && (
                    <button
                      onClick={handleCreateTeme}
                      className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4" /> {t.l1BtnTeme}
                    </button>
                  )}
                </>
              )}
            </div>

            {currentPath === 'baza_secreta' && (
              <button
                onClick={handleBackToDesktop}
                className="text-xs text-slate-300 hover:text-white px-3 py-1.5 bg-slate-700/80 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {t.l1BtnBack}
              </button>
            )}
          </div>
        </div>

        {/* Tree Visual Schema Preview (1 col) */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌳</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t.treeProgressTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'en' ? 'Directory Hierarchy Tree:' : 'Ierarhie directoare:'}
            </p>

            {/* Tree nodes */}
            <div className="font-mono text-xs space-y-2 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400">
                <Laptop className="w-4 h-4 text-slate-500" />
                <span>Desktop (Root)</span>
              </div>
              <div className="ml-4 pl-3 border-l-2 border-slate-700 space-y-2">
                <div className={`flex items-center gap-2 ${hasRootFolder ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  <span>└── 📁 {lang === 'en' ? 'Secret Base' : 'Baza Secreta'}</span>
                  {hasRootFolder && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <div className="ml-4 pl-3 border-l-2 border-slate-700 space-y-1.5">
                  <div className={`flex items-center gap-2 ${hasJocuri ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                    <span>├── 🎮 {lang === 'en' ? 'Games' : 'Jocuri'}</span>
                    {hasJocuri && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <div className={`flex items-center gap-2 ${hasTeme ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                    <span>└── 📚 {lang === 'en' ? 'Homework' : 'Teme'}</span>
                    {hasTeme && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>ARKEDO:</strong> {lang === 'en' ? 'A folder is a digital container for well-organized files!' : 'Un folder este un recipient digital pentru fișiere bine organizate!'}
            </span>
          </div>
        </div>
      </div>

      {/* Provocare scurtătură Win+E din manual (pag. 27) */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 sm:p-5 mb-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">{t.l1WinEQuizTitle}</div>
            <div className="text-sm font-bold text-white">{t.l1WinEQuizQuestion}</div>
            <div className="text-xs text-slate-400 mt-0.5">{t.l1WinEQuizSub}</div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => {
                sounds.playCorrect();
                setShortcutWinEUsed(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer ${
                shortcutWinEUsed
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-600'
              }`}
            >
              {shortcutWinEUsed ? t.l1WinEOptionCorrect : t.l1WinEOptionDefault}
            </button>

            <button
              onClick={() => sounds.playWrong()}
              className="px-3 py-2 rounded-xl text-xs font-mono bg-slate-800/60 hover:bg-slate-800 text-slate-400 border border-slate-700 cursor-pointer"
            >
              Alt + Tab
            </button>
          </div>
        </div>

        <QuestionHint
          id="q-l1-wine"
          hintRo="Tasta Windows (cu sigla Windows) combinată cu litera 'E' (de la Explorer) deschide File Explorer pe orice PC!"
          hintEn="Windows Key paired with letter 'E' (for Explorer) launches File Explorer instantly on Windows!"
        />

        {shortcutWinEUsed && (
          <AnswerExplanation
            isCorrect={true}
            explanationRo="Excelent! Win + E este comanda rapidă oficială din manual (pag. 27) care deschide fereastra File Explorer pentru navigarea prin foldere și unități de stocare."
            explanationEn="Spot on! Win + E is the official shortcut (p. 27) that instantly launches File Explorer to navigate folders and storage drives."
          />
        )}
      </div>

      {/* Checklist (Interactive: can be checked by simulator or by student on their real PC) */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <span>📋</span> {t.l1ChecklistTitle}
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          {t.l1ChecklistSub}
        </p>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition">
            <input
              type="checkbox"
              checked={chk1}
              onChange={(e) => {
                setChk1(e.target.checked);
                if (e.target.checked && !hasRootFolder) setHasRootFolder(true);
                sounds.playClick();
              }}
              className="mt-0.5 w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-200">
              {t.l1Chk1}
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition">
            <input
              type="checkbox"
              checked={chk2}
              onChange={(e) => {
                setChk2(e.target.checked);
                if (e.target.checked && !hasJocuri) setHasJocuri(true);
                sounds.playClick();
              }}
              className="mt-0.5 w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-200">
              {t.l1Chk2}
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition">
            <input
              type="checkbox"
              checked={chk3}
              onChange={(e) => {
                setChk3(e.target.checked);
                if (e.target.checked && !hasTeme) setHasTeme(true);
                sounds.playClick();
              }}
              className="mt-0.5 w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-200">
              {t.l1Chk3}
            </span>
          </label>
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400">
          {t.l1RewardText}
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`px-7 py-3 rounded-2xl font-bold font-heading text-sm transition transform flex items-center gap-2 shadow-lg ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 hover:scale-105 cursor-pointer shadow-emerald-500/25'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{t.l1FinishBtn}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

