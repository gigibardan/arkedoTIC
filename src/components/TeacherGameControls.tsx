import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Bell,
  Trash2,
  Sparkles,
  Sliders,
  ShieldCheck,
  Gamepad2,
  Filter,
  Check,
  X,
  Keyboard,
  MousePointer,
  Binary,
  Cpu,
  Folder,
  Zap,
  Bot,
  ShieldAlert,
  Palette,
  Layers,
  FileDown,
  Biohazard,
  Footprints,
  Boxes,
  Flame,
  Swords,
  Clock,
  User,
  MessageSquare
} from 'lucide-react';
import {
  ALL_GAMES,
  GameDefinition,
  GameSettings,
  StudentUnlockRequest,
  subscribeGameSettings,
  subscribeUnlockRequests,
  toggleGameLock,
  setAllGamesOpen,
  updateCustomLockMessage,
  deleteUnlockRequest,
  clearAllUnlockRequests,
  isGameOpen,
  DEFAULT_GAME_SETTINGS,
} from '../lib/gameControlService';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export const TeacherGameControls: React.FC = () => {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [requests, setRequests] = useState<StudentUnlockRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customMsgInput, setCustomMsgInput] = useState<string>('');
  const [isSavingMsg, setIsSavingMsg] = useState<boolean>(false);
  const [msgSavedToast, setMsgSavedToast] = useState<boolean>(false);
  const [previewModalGame, setPreviewModalGame] = useState<GameDefinition | null>(null);

  // Ascultă setările și cererile elevilor în timp real
  useEffect(() => {
    const unsubSettings = subscribeGameSettings((newSettings) => {
      setSettings(newSettings);
      setCustomMsgInput(newSettings.customMessage);
    });

    const unsubRequests = subscribeUnlockRequests((newRequests) => {
      setRequests(newRequests);
    });

    return () => {
      unsubSettings();
      unsubRequests();
    };
  }, []);

  const handleToggle = async (gameId: string, currentOpen: boolean) => {
    sounds.playClick();
    await toggleGameLock(gameId, !currentOpen);
  };

  const handleSetAll = async (open: boolean) => {
    sounds.playClick();
    await setAllGamesOpen(open);
  };

  const handleSaveMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMsg(true);
    await updateCustomLockMessage(customMsgInput);
    setIsSavingMsg(false);
    setMsgSavedToast(true);
    sounds.playCorrect();
    setTimeout(() => setMsgSavedToast(false), 3000);
  };

  const handleApproveUnlock = async (req: StudentUnlockRequest) => {
    sounds.playCorrect();
    // Deblochează jocul
    await toggleGameLock(req.gameId, true);
    // Șterge cererea rezolvată
    if (req.id) {
      await deleteUnlockRequest(req.id);
    }
  };

  const handleDeleteRequest = async (id?: string) => {
    if (!id) return;
    sounds.playClick();
    await deleteUnlockRequest(id);
  };

  const handleClearAllRequests = async () => {
    if (window.confirm(lang === 'en' ? 'Clear all student requests?' : 'Sigur dorești să ștergi toate solicitările elevilor?')) {
      sounds.playClick();
      await clearAllUnlockRequests();
    }
  };

  // Statistici
  const openCount = ALL_GAMES.filter((g) => isGameOpen(settings, g.id)).length;
  const closedCount = ALL_GAMES.length - openCount;

  // Extrage categorii unice
  const categories = ['all', ...Array.from(new Set(ALL_GAMES.map((g) => g.category)))];

  // Filtrare jocuri
  const filteredGames = ALL_GAMES.filter((game) => {
    const matchesSearch =
      game.titleRo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.descRo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Funcție pentru a reda iconița jocului
  const renderGameIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'Keyboard':
        return <Keyboard {...props} />;
      case 'MousePointer':
        return <MousePointer {...props} />;
      case 'Binary':
        return <Binary {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Folder':
        return <Folder {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Bot':
        return <Bot {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'Palette':
        return <Palette {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'FileDown':
        return <FileDown {...props} />;
      case 'Biohazard':
        return <Biohazard {...props} />;
      case 'Footprints':
        return <Footprints {...props} />;
      case 'Boxes':
        return <Boxes {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Swords':
        return <Swords {...props} />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck {...props} />;
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return lang === 'en' ? 'Just now' : 'Chiar acum';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${lang === 'en' ? 'min ago' : 'min în urmă'}`;
    const hours = Math.floor(minutes / 60);
    return `${hours} ${lang === 'en' ? 'h ago' : 'ore în urmă'}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jocuri */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              {lang === 'en' ? 'Total Mini-Games' : 'Total Mini-Jocuri'}
            </span>
            <div className="text-2xl font-black text-white font-heading">
              {ALL_GAMES.length}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Arcade & 1v1 Duel
            </span>
          </div>
        </div>

        {/* Jocuri Deschise */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Unlock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              {lang === 'en' ? 'Unlocked & Active' : 'Deschise pentru Elevi'}
            </span>
            <div className="text-2xl font-black text-emerald-400 font-heading">
              {openCount} / {ALL_GAMES.length}
            </div>
            <span className="text-[10px] text-emerald-500/80 font-mono font-medium">
              {openCount === ALL_GAMES.length ? (lang === 'en' ? 'All accessible' : 'Toate accesibile') : `${closedCount} blocate`}
            </span>
          </div>
        </div>

        {/* Jocuri Închise */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              {lang === 'en' ? 'Locked by Teacher' : 'Închise de Profesor'}
            </span>
            <div className="text-2xl font-black text-rose-400 font-heading">
              {closedCount}
            </div>
            <span className="text-[10px] text-rose-400/80 font-mono font-medium">
              {closedCount === 0 ? (lang === 'en' ? 'None locked' : 'Niciun joc blocat') : (lang === 'en' ? 'Hidden from play' : 'Blocate în pauză')}
            </span>
          </div>
        </div>

        {/* Solicitări în Așteptare */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            requests.length > 0 
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse'
              : 'bg-slate-800 border border-slate-700 text-slate-400'
          }`}>
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              {lang === 'en' ? 'Student Requests' : 'Solicitări Elevi'}
            </span>
            <div className="text-2xl font-black text-amber-400 font-heading">
              {requests.length}
            </div>
            <span className="text-[10px] text-amber-300/80 font-mono font-medium">
              {requests.length > 0 ? (lang === 'en' ? 'Need attention' : 'Așteaptă aprobare') : (lang === 'en' ? 'No pending requests' : 'Fără cereri')}
            </span>
          </div>
        </div>
      </div>

      {/* Master Control & Global Switch Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'en' ? 'MASTER SWITCH' : 'COMUTATOR GENERAL'}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {lang === 'en' ? 'Default: All Open' : 'Implicit: Toate Deschise'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'en' ? 'Manage Student Mini-Games Availability' : 'Control Acces Jocuri și Solicitări Elevi'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {lang === 'en'
                ? 'Toggle games ON or OFF anytime during class. When closed, students see your custom message and can request unlocking.'
                : 'Poți închide sau deschide orice joc dintr-un clic. Când un joc este închis, elevii văd un mesaj clar și îți pot trimite o solicitare de deschidere în direct!'}
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSetAll(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>{lang === 'en' ? 'Unlock All Games' : 'Deschide Toate Jocurile'}</span>
            </button>

            <button
              onClick={() => handleSetAll(false)}
              className="px-4 py-2.5 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-rose-700/20 cursor-pointer active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>{lang === 'en' ? 'Lock All Games' : 'Închide Toate Jocurile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Unlock Requests Live Feed (if any requests exist) */}
      {requests.length > 0 && (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-base font-black text-white font-heading flex items-center gap-2">
                  <span>{lang === 'en' ? 'Student Unlock Requests in Real-Time' : 'Solicitări Deschidere Jocuri de la Elevi'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                    {requests.length}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'en'
                    ? 'Students who tapped "Request Unlock" appear here. Click "Unlock Game" to grant access.'
                    : 'Elevii care au apăsat "Solicită deschiderea" apar aici. Apasă "Deblochează Jocul" pentru a-l deschide pe loc.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClearAllRequests}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'en' ? 'Clear All' : 'Golește Toate'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-80 overflow-y-auto pr-1">
            {requests.map((req) => (
              <div
                key={req.id || `${req.studentName}-${req.gameId}-${req.timestamp}`}
                className="bg-slate-950/80 border border-amber-500/30 hover:border-amber-400/60 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{req.studentAvatar || '🎓'}</span>
                      <span className="text-sm font-bold text-white truncate">
                        {req.studentName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {formatRelativeTime(req.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300">
                    <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate font-semibold">{req.gameTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                  <button
                    onClick={() => handleApproveUnlock(req)}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Unlock Game' : 'Deblochează Jocul'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteRequest(req.id)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700 transition cursor-pointer"
                    title={lang === 'en' ? 'Dismiss' : 'Ignoră'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Message Editor for Students */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h4 className="text-base font-black text-white font-heading">
            {lang === 'en' ? 'Custom Locked Message for Students' : 'Mesajul Afișat Elevilor la Jocurile Închise'}
          </h4>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          {lang === 'en'
            ? 'This announcement will be displayed in the modal when a student attempts to launch a locked game.'
            : 'Acest text va apărea în fereastra pop-up a elevului dacă încearcă să acceseze un joc oprit de la oră.'}
        </p>

        <form onSubmit={handleSaveMessage} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={customMsgInput}
              onChange={(e) => setCustomMsgInput(e.target.value)}
              placeholder="Acest joc este închis de profesor. Solicită deschiderea lui în timpul orei!"
              className="w-full bg-slate-950 border border-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingMsg}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSavingMsg ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{lang === 'en' ? 'Save Message' : 'Salvează Mesajul'}</span>
          </button>
        </form>

        {msgSavedToast && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{lang === 'en' ? 'Message saved successfully!' : 'Mesajul a fost salvat și sincronizat cu elevii!'}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar for Games */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search minigames by title or concept...' : 'Caută jocuri după titlu, tastatură, binar, roblox...'}
            className="w-full bg-slate-900 border border-slate-700 pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* Categories selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? (lang === 'en' ? 'All (18)' : 'Toate (18)') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Games Switch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => {
          const isOpen = isGameOpen(settings, game.id);

          return (
            <div
              key={game.id}
              className={`bg-slate-900/90 border-2 rounded-3xl p-5 shadow-lg flex flex-col justify-between gap-4 transition-all duration-300 ${
                isOpen
                  ? 'border-emerald-500/30 hover:border-emerald-500/60'
                  : 'border-rose-500/40 bg-slate-950/90 opacity-95'
              }`}
            >
              <div>
                {/* Header row: Icon + Badges + Toggle Switch */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors shadow-inner ${
                        isOpen
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {renderGameIcon(game.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                        {game.category}
                      </span>
                      <h4 className="text-base font-black text-white font-heading leading-tight">
                        {game.titleRo}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {game.titleEn}
                      </span>
                    </div>
                  </div>

                  {/* Accessible iOS-Style Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggle(game.id, isOpen)}
                    aria-label={`Comutator ${game.titleRo}`}
                    className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      isOpen ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold ${
                        isOpen ? 'translate-x-6 text-emerald-600' : 'translate-x-0 text-slate-600'
                      }`}
                    >
                      {isOpen ? '✓' : '✕'}
                    </span>
                  </button>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                  {game.descRo}
                </p>
              </div>

              {/* Status and Action bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      isOpen ? 'text-emerald-300' : 'text-rose-400'
                    }`}
                  >
                    {isOpen
                      ? (lang === 'en' ? 'OPEN FOR STUDENTS' : 'DESCHIS PENTRU ELEVI')
                      : (lang === 'en' ? 'LOCKED BY TEACHER' : 'ÎNCHIS DE PROFESOR')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewModalGame(game)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 text-[11px] font-mono transition cursor-pointer"
                  title={lang === 'en' ? 'Preview what students see' : 'Previzualizează dialogul elevului'}
                >
                  {lang === 'en' ? 'Preview Lock' : 'Previzualizează'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal for Teacher */}
      {previewModalGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/40 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Previzualizare dialog elev</span>
              </span>

              <button
                onClick={() => setPreviewModalGame(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center my-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto mb-3 shadow-lg">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-white font-heading">
                {previewModalGame.titleRo}
              </h3>
              <p className="text-xs text-rose-300 font-mono mt-1 font-bold">
                ⚠️ Acest joc este închis de profesor
              </p>

              <div className="my-4 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 text-left leading-relaxed">
                <p className="font-semibold text-white mb-1">
                  Mesajul cadrului didactic:
                </p>
                <p className="italic text-slate-300">
                  "{settings.customMessage}"
                </p>
              </div>

              <button
                disabled
                className="w-full py-2.5 rounded-2xl bg-amber-600/60 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <Bell className="w-4 h-4" />
                <span>Solicită Deschiderea Jocului 🙋‍♂️</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setPreviewModalGame(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Închide Previzualizarea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
