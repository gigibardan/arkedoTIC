import React, { useState } from 'react';
import { MousePointerClick, Search, CheckCircle2, ChevronRight, FileText, Image, Music } from 'lucide-react';
import { TeacherTip } from './TeacherTip';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { AnswerExplanation } from './common/AnswerExplanation';
import { QuestionHint } from './common/QuestionHint';

interface Level2Props {
  onComplete: () => void;
}

interface DemoFile {
  id: string;
  name: string;
  size: string;
  type: 'doc' | 'img' | 'music';
}

const FILES_RO: DemoFile[] = [
  { id: '1', name: 'referat_plante.docx', size: '24 KB', type: 'doc' },
  { id: '2', name: 'desen_arbore_secret.jpg', size: '1.2 MB', type: 'img' },
  { id: '3', name: 'proiect_istorie.docx', size: '45 KB', type: 'doc' },
  { id: '4', name: 'muzica_joc.mp3', size: '3.4 MB', type: 'music' },
  { id: '5', name: 'schema_clasa5.jpg', size: '890 KB', type: 'img' },
];

const FILES_EN: DemoFile[] = [
  { id: '1', name: 'plants_essay.docx', size: '24 KB', type: 'doc' },
  { id: '2', name: 'secret_tree_drawing.jpg', size: '1.2 MB', type: 'img' },
  { id: '3', name: 'history_project.docx', size: '45 KB', type: 'doc' },
  { id: '4', name: 'game_music.mp3', size: '3.4 MB', type: 'music' },
  { id: '5', name: 'class5_diagram.jpg', size: '890 KB', type: 'img' },
];

export const Level2_SelectionSearch: React.FC<Level2Props> = ({ onComplete }) => {
  const { t, lang } = useLanguage();
  const initialFiles = lang === 'en' ? FILES_EN : FILES_RO;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchSuccess, setSearchSuccess] = useState<boolean>(false);
  const [shortcutAnswer, setShortcutAnswer] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    sounds.playClick();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    sounds.playCorrect();
    setSelectedIds(initialFiles.map((f) => f.id));
  };

  const handleClearSelection = () => {
    sounds.playClick();
    setSelectedIds([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    if (query.includes('arbore') || query.includes('tree') || query.includes('desen') || query.includes('draw') || query.includes('secret')) {
      sounds.playCorrect();
      setSearchSuccess(true);
    } else {
      sounds.playWrong();
    }
  };

  const isLevelCompleted =
    selectedIds.length === initialFiles.length &&
    searchSuccess &&
    shortcutAnswer === 'ctrl_a';

  const handleFinish = () => {
    sounds.playLevelUp();
    onComplete();
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Title & Mission Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-5">
        <div>
          <span className="px-3 py-1 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-xs uppercase tracking-wider border border-teal-500/30">
            {t.l2Tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
            {t.l2Title}
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {t.l2Desc}
          </p>
        </div>
        <div className="hidden sm:flex text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-teal-400">
          🎯
        </div>
      </div>

      {/* Teacher Tip from Textbook (p. 29) */}
      <TeacherTip
        title={t.l2TipTitle}
        tip={t.l2TipText}
        bookPage="29"
        extraAdvice={t.l2TipExtra}
      />

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Virtual File Explorer with Search & Multi-select (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* OS Header with Search Bar */}
          <div className="bg-slate-800 p-3 sm:p-4 border-b border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span>{t.l2BtnSelectAll}</span>
              </button>
              {selectedIds.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-300 text-xs transition cursor-pointer"
                >
                  {t.l2BtnCancelSelection} ({selectedIds.length})
                </button>
              )}
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.l2SearchPlaceholder}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition font-heading cursor-pointer"
              >
                {t.l2BtnSearch}
              </button>
            </form>
          </div>

          {/* Files List View */}
          <div className="p-4 bg-slate-950/70 divide-y divide-slate-800/80 space-y-2">
            <div className="text-[11px] text-slate-400 font-mono flex justify-between px-3 pb-1">
              <span>{t.l2FileListHeaderName}</span>
              <span>{t.l2FileListHeaderSize}</span>
            </div>

            {initialFiles.map((file) => {
              const isSelected = selectedIds.includes(file.id);
              const isSearchedMatch =
                searchSuccess && (file.name.toLowerCase().includes('arbore') || file.name.toLowerCase().includes('desen'));

              return (
                <div
                  key={file.id}
                  onClick={() => toggleSelect(file.id)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition select-none ${
                    isSelected
                      ? 'bg-teal-950/60 border-2 border-teal-400/90 text-teal-100 shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 text-slate-200'
                  } ${isSearchedMatch ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-teal-500 text-slate-950'
                          : 'border border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>

                    <div className="flex items-center gap-2.5">
                      {file.type === 'doc' && (
                        <FileText className="w-4 h-4 text-blue-400" />
                      )}
                      {file.type === 'img' && (
                        <Image className="w-4 h-4 text-emerald-400" />
                      )}
                      {file.type === 'music' && (
                        <Music className="w-4 h-4 text-purple-400" />
                      )}
                      <div>
                        <div className="font-mono text-xs sm:text-sm font-semibold">
                          {file.name}
                        </div>
                        {isSearchedMatch && (
                          <span className="text-[10px] text-amber-300 font-bold">
                            {t.l2SearchMatchBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    {file.size}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-900 px-4 py-2.5 border-t border-slate-800 text-xs flex justify-between items-center text-slate-400">
            <span>
              {t.l2SelectedCounter}:{' '}
              <strong className="text-teal-300">{selectedIds.length}</strong> /{' '}
              {initialFiles.length}
            </span>
            <span className="text-[11px]">
              {selectedIds.length === initialFiles.length
                ? t.l2AllSelectedMessage
                : t.l2SelectHint}
            </span>
          </div>
        </div>

        {/* Task Cards & Validation Column (1 col) */}
        <div className="space-y-4">
          {/* Mission Objectives Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" />
              {t.l2ObjectivesTitle}
            </h3>

            <div className="space-y-3 text-xs">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  selectedIds.length === initialFiles.length
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    selectedIds.length === initialFiles.length
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                />
                <span>{t.l2Obj1}</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  searchSuccess
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    searchSuccess ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <span>{t.l2Obj2}</span>
              </div>
            </div>
          </div>

          {/* Quick Quiz from manual p. 29 */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              {t.l2QuizTitle}
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              {t.l2QuizQuestion}
            </p>

            <div className="mb-3">
              <QuestionHint
                id="q-l2-ctrl-a"
                hintRo="Pentru a selecta totul ('All' în engleză) combinăm tasta Ctrl cu prima literă a cuvântului All (Ctrl + A)."
                hintEn="To select everything ('All'), combine Ctrl with the first letter of All (Ctrl + A)."
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  sounds.playCorrect();
                  setShortcutAnswer('ctrl_a');
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-mono text-left transition flex items-center justify-between cursor-pointer ${
                  shortcutAnswer === 'ctrl_a'
                    ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                }`}
              >
                <span>A) Ctrl + A (Select All)</span>
                {shortcutAnswer === 'ctrl_a' && <span>✓</span>}
              </button>

              <button
                onClick={() => {
                  sounds.playWrong();
                  setShortcutAnswer('ctrl_c');
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-mono text-left transition cursor-pointer ${
                  shortcutAnswer === 'ctrl_c'
                    ? 'bg-rose-950/70 border border-rose-500 text-rose-300'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                }`}
              >
                <span>B) Ctrl + C (Copy)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playWrong();
                  setShortcutAnswer('alt_f4');
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-mono text-left transition cursor-pointer ${
                  shortcutAnswer === 'alt_f4'
                    ? 'bg-rose-950/70 border border-rose-500 text-rose-300'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                }`}
              >
                <span>C) Alt + F4 (Close)</span>
              </button>
            </div>

            {shortcutAnswer && (
              <div className="mt-3">
                <AnswerExplanation
                  isCorrect={shortcutAnswer === 'ctrl_a'}
                  explanationRo={
                    shortcutAnswer === 'ctrl_a'
                      ? 'Corect! Ctrl + A selectează instantaneu toate fișierele dintr-un folder (Manual pag. 29).'
                      : 'Incorect. Ctrl+C copiază selecția, Alt+F4 închide aplicația, iar comanda de selectare completă este Ctrl+A.'
                  }
                  explanationEn={
                    shortcutAnswer === 'ctrl_a'
                      ? 'Correct! Ctrl + A instantly selects all files inside the current directory (p. 29).'
                      : 'Incorrect. Ctrl+C is copy, Alt+F4 closes the window, and Select All is Ctrl+A.'
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400">
          {t.l2RewardText}
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`px-7 py-3 rounded-2xl font-bold font-heading text-sm transition transform flex items-center gap-2 shadow-lg ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 hover:scale-105 cursor-pointer shadow-teal-500/25'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{t.l2FinishBtn}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

