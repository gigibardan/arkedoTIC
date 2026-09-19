import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import {
  Folder,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Archive,
  Terminal,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Play,
  Clock,
} from 'lucide-react';

interface FileOrganizerGameProps {
  onBack: () => void;
  studentName?: string;
}

type FileCategory = 'docs' | 'images' | 'audio' | 'video' | 'archives' | 'system';

interface FileItem {
  id: string;
  name: string;
  extension: string;
  category: FileCategory;
  descriptionRo: string;
  descriptionEn: string;
}

const FILE_ITEMS: FileItem[] = [
  { id: '1', name: 'Referat_Istorie', extension: '.docx', category: 'docs', descriptionRo: 'Document Microsoft Word', descriptionEn: 'Word Document' },
  { id: '2', name: 'Peisaj_Munte', extension: '.jpg', category: 'images', descriptionRo: 'Imagine comprimată JPEG', descriptionEn: 'JPEG Photo' },
  { id: '3', name: 'Melodie_Pian', extension: '.mp3', category: 'audio', descriptionRo: 'Fișier audio comprimat', descriptionEn: 'Audio Track' },
  { id: '4', name: 'Proiect_Robotica', extension: '.mp4', category: 'video', descriptionRo: 'Înregistrare video digitală', descriptionEn: 'Video File' },
  { id: '5', name: 'Poze_Excursie', extension: '.zip', category: 'archives', descriptionRo: 'Arhivă comprimată de fișiere', descriptionEn: 'ZIP Compressed Archive' },
  { id: '6', name: 'Tabel_Note', extension: '.xlsx', category: 'docs', descriptionRo: 'Foaie de calcul Excel', descriptionEn: 'Excel Spreadsheet' },
  { id: '7', name: 'Desen_Vectorial', extension: '.png', category: 'images', descriptionRo: 'Imagine transparentă PNG', descriptionEn: 'PNG Graphic' },
  { id: '8', name: 'Podcast_Lectie', extension: '.wav', category: 'audio', descriptionRo: 'Format audio fără pierderi', descriptionEn: 'WAV Audio' },
  { id: '9', name: 'Film_Documentar', extension: '.avi', category: 'video', descriptionRo: 'Format video clasic', descriptionEn: 'Video Clip' },
  { id: '10', name: 'Pachet_Fonturi', extension: '.rar', category: 'archives', descriptionRo: 'Arhivă WinRAR', descriptionEn: 'RAR Archive' },
  { id: '11', name: 'Prezentare_TIC', extension: '.pptx', category: 'docs', descriptionRo: 'Prezentare PowerPoint', descriptionEn: 'PowerPoint Slides' },
  { id: '12', name: 'Logo_Scoala', extension: '.svg', category: 'images', descriptionRo: 'Grafică vectorială scalabilă', descriptionEn: 'Vector Graphic' },
  { id: '13', name: 'Efect_Sunet', extension: '.ogg', category: 'audio', descriptionRo: 'Fișier sunet multimedia', descriptionEn: 'OGG Audio File' },
  { id: '14', name: 'Animatie_3D', extension: '.mov', category: 'video', descriptionRo: 'Clip video QuickTime', descriptionEn: 'QuickTime Movie' },
  { id: '15', name: 'Copie_Siguranta', extension: '.7z', category: 'archives', descriptionRo: 'Arhivă comprimată 7-Zip', descriptionEn: '7-Zip Archive' },
  { id: '16', name: 'Manual_Digital', extension: '.pdf', category: 'docs', descriptionRo: 'Format portabil de document', descriptionEn: 'Portable Document Format' },
  { id: '17', name: 'Schita_Banner', extension: '.webp', category: 'images', descriptionRo: 'Format modern de imagine web', descriptionEn: 'Modern Web Image' },
  { id: '18', name: 'Instalare_Joc', extension: '.exe', category: 'system', descriptionRo: 'Program Executabil Windows', descriptionEn: 'Executable Program' },
  { id: '19', name: 'Script_Automatizare', extension: '.bat', category: 'system', descriptionRo: 'Fișier de comenzi batch', descriptionEn: 'Batch Command Script' },
  { id: '20', name: 'Configurare', extension: '.ini', category: 'system', descriptionRo: 'Setări sistem de operare', descriptionEn: 'System Settings File' },
];

interface FolderCategory {
  id: FileCategory;
  nameRo: string;
  nameEn: string;
  color: string;
  borderHover: string;
  icon: React.ReactNode;
}

const FOLDERS: FolderCategory[] = [
  { id: 'docs', nameRo: 'Documente', nameEn: 'Documents', color: 'from-blue-600 to-indigo-600', borderHover: 'hover:border-blue-400', icon: <FileText className="w-5 h-5 text-blue-300" /> },
  { id: 'images', nameRo: 'Imagini', nameEn: 'Images', color: 'from-purple-600 to-pink-600', borderHover: 'hover:border-purple-400', icon: <ImageIcon className="w-5 h-5 text-purple-300" /> },
  { id: 'audio', nameRo: 'Audio & Muzică', nameEn: 'Audio', color: 'from-amber-600 to-orange-600', borderHover: 'hover:border-amber-400', icon: <Music className="w-5 h-5 text-amber-300" /> },
  { id: 'video', nameRo: 'Video & Clipuri', nameEn: 'Video', color: 'from-rose-600 to-red-600', borderHover: 'hover:border-rose-400', icon: <Video className="w-5 h-5 text-rose-300" /> },
  { id: 'archives', nameRo: 'Arhive (ZIP/RAR)', nameEn: 'Archives', color: 'from-emerald-600 to-teal-600', borderHover: 'hover:border-emerald-400', icon: <Archive className="w-5 h-5 text-emerald-300" /> },
  { id: 'system', nameRo: 'Programe & Sistem', nameEn: 'System / Exec', color: 'from-slate-600 to-slate-700', borderHover: 'hover:border-slate-400', icon: <Terminal className="w-5 h-5 text-slate-300" /> },
];

export const FileOrganizerGame: React.FC<FileOrganizerGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [sortedCount, setSortedCount] = useState<number>(0);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_files') || '0');
    } catch {
      return 0;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomFile = useCallback((): FileItem => {
    const randomIndex = Math.floor(Math.random() * FILE_ITEMS.length);
    return FILE_ITEMS[randomIndex];
  }, []);

  const startGame = () => {
    sounds.playClick();
    setIsPlaying(true);
    setIsFinished(false);
    setTimeLeft(45);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setSortedCount(0);
    setFeedback(null);
    setCurrentFile(getRandomFile());
    arky.triggerIdle();
  };

  // Timer countdown
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setIsFinished(true);
      sounds.playVictory();
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem('arkedo_highscore_files', String(score));
        } catch {
          // ignore
        }
      }
      arky.triggerFinished(
        lang === 'en'
          ? `File Sorting Session ended! Organized: ${sortedCount} files! Score: ${score} pts! 📁✨`
          : `Sesiunea s-a încheiat! Ai organizat ${sortedCount} fișiere! Scor: ${score} puncte! 📁✨`
      );
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft, score, highScore, sortedCount, arky, lang]);

  const handleSelectFolder = (category: FileCategory) => {
    if (!isPlaying || !currentFile) return;

    const isCorrect = currentFile.category === category;

    if (isCorrect) {
      sounds.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const points = 100 + Math.min(newCombo * 15, 60);
      setScore((prev) => prev + points);
      setSortedCount((prev) => prev + 1);

      setFeedback({
        isCorrect: true,
        message: lang === 'en' ? `+${points} pts! Perfect Match!` : `+${points} pct! Clasificare corectă!`,
      });

      if (newCombo % 5 === 0) {
        arky.triggerSuccess(
          lang === 'en'
            ? `${newCombo}x Combo! Organization Master!`
            : `Combo de ${newCombo}x! Ești un maestru al organizării!`
        );
      }
    } else {
      sounds.playWrong();
      setCombo(0);
      const targetFolder = FOLDERS.find((f) => f.id === currentFile.category);
      const correctFolderName = lang === 'en' ? targetFolder?.nameEn : targetFolder?.nameRo;

      setFeedback({
        isCorrect: false,
        message: lang === 'en'
          ? `Wrong Folder! ${currentFile.extension} goes into "${correctFolderName}"`
          : `Folder Greșit! Extensia ${currentFile.extension} aparține de "${correctFolderName}"`,
      });
    }

    // Next random file after brief delay
    setTimeout(() => {
      setFeedback(null);
      setCurrentFile(getRandomFile());
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
        </button>

        <div className="flex items-center gap-2 text-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'File Organizer Express' : 'Sortatorul de Extensii & Fișiere'}
            </h1>
            <p className="text-[11px] text-blue-400 font-mono">
              {lang === 'en' ? 'Match File Extensions with Correct Directory Folders' : 'Clasifică Extensiile în Dosarele Corespunzătoare'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Record: {highScore} pts</span>
        </div>
      </div>

      {/* Main Container */}
      {!isPlaying && !isFinished ? (
        /* Welcome / Start Screen */
        <div className="bg-slate-900/95 border-2 border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/20">
            <FolderOpen className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 uppercase tracking-wider">
              {lang === 'en' ? 'Agility & Knowledge Challenge' : 'Antrenament de Reflexe & Extensii'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-2">
              {lang === 'en' ? 'Organize the Computer Laboratory Files!' : 'Organizează Fișierele din Laboratorul TIC!'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Incoming files with extensions (.docx, .jpg, .mp3, .zip, .exe) need sorting. Click or tap the matching folder as quickly as possible before the 45-second timer runs out!'
                : 'Fișiere cu diferite extensii (.docx, .jpg, .mp3, .mp4, .zip, .exe) sosesc în vrac. Apasă pe folderul corect cât mai repede pentru a construi combo-uri de puncte în 45 de secunde!'}
            </p>
          </div>

          {/* Extension Cheat Sheet / Guide */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl w-full text-left">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>.docx, .xlsx, .pptx, .pdf</strong> (Documente)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
              <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />
              <span><strong>.jpg, .png, .svg, .webp</strong> (Imagini)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
              <Music className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>.mp3, .wav, .ogg</strong> (Audio)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
              <Video className="w-4 h-4 text-rose-400 shrink-0" />
              <span><strong>.mp4, .avi, .mov</strong> (Video)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
              <Archive className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>.zip, .rar, .7z</strong> (Arhive)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
              <Terminal className="w-4 h-4 text-slate-400 shrink-0" />
              <span><strong>.exe, .bat, .ini</strong> (Sistem)</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base transition shadow-xl shadow-blue-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{lang === 'en' ? 'Start 45s Sorting Sprint!' : 'Începe Sesiunea de 45s!'}</span>
          </button>
        </div>
      ) : isPlaying && currentFile ? (
        /* Active Game Arena */
        <div className="bg-slate-900/95 border-2 border-blue-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-6 relative">
          {/* Top Game Bar: Timer & Live Stats */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            {/* Countdown Clock */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-blue-400'}`} />
              <span className={`text-base font-black font-mono ${timeLeft <= 10 ? 'text-rose-400 font-bold' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>

            {/* Streak & Score */}
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {combo} <span className="text-[10px] text-slate-400">combo</span>
                </span>
              </div>
              <div className="bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-blue-400" />
                <span className="text-base font-black text-white font-mono">{score} pts</span>
              </div>
            </div>
          </div>

          {/* Incoming File Card to be Sorted */}
          <div className="bg-slate-950 border-2 border-blue-500/40 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group">
            <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-blue-400 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              {lang === 'en' ? 'Incoming File' : 'Fișier de Clasificat'}
            </div>

            {/* File Icon & Name */}
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-mono text-xs font-black shadow-md">
                {currentFile.extension.slice(1).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-black text-white font-mono tracking-wide">
                  {currentFile.name}
                  <span className="text-blue-400 font-extrabold">{currentFile.extension}</span>
                </div>
                <div className="text-xs text-slate-400 font-body">
                  {lang === 'en' ? currentFile.descriptionEn : currentFile.descriptionRo}
                </div>
              </div>
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div
                className={`text-xs font-bold font-mono px-3 py-1 rounded-xl transition animate-fadeIn ${
                  feedback.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>

          {/* Target Folders Grid (6 Choices) */}
          <div>
            <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-2.5">
              {lang === 'en' ? 'Select Target Destination Folder:' : 'Alege Folderul Destinație Corect:'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FOLDERS.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleSelectFolder(folder.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 border-2 border-slate-800 ${folder.borderHover} hover:bg-slate-850 flex items-center gap-3 transition-all transform active:scale-95 cursor-pointer text-left group shadow-md`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${folder.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0`}>
                    {folder.icon}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      {lang === 'en' ? folder.nameEn : folder.nameRo}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {folder.id === 'docs' && '.docx .xlsx .pdf'}
                      {folder.id === 'images' && '.jpg .png .svg'}
                      {folder.id === 'audio' && '.mp3 .wav .ogg'}
                      {folder.id === 'video' && '.mp4 .avi .mov'}
                      {folder.id === 'archives' && '.zip .rar .7z'}
                      {folder.id === 'system' && '.exe .bat .ini'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-slate-900/95 border-2 border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/20 animate-bounce">
            📁
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 uppercase tracking-wider">
              {lang === 'en' ? 'Session Complete!' : 'Sesiune de Sortare Finalizată!'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-2">
              {studentName ? `${studentName}, ` : ''}
              {sortedCount >= 25
                ? (lang === 'en' ? 'Grand System Administrator! 💻⭐' : 'Administrator de Sistem Maestru! 💻⭐')
                : sortedCount >= 15
                ? (lang === 'en' ? 'Skilled File Organizer! 📂' : 'Organizator Eficient de Fișiere! 📂')
                : (lang === 'en' ? 'Novice Sorter! 🔰' : 'Sortator Începător! 🔰')}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl w-full">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Scor Total</span>
              <span className="text-3xl sm:text-4xl font-black text-blue-400 font-mono mt-1">
                {score}
              </span>
              <span className="text-[11px] text-slate-500">puncte</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Fișiere Sortate</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                {sortedCount}
              </span>
              <span className="text-[11px] text-slate-500">corecte</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Viteză Medie</span>
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mt-1">
                {Math.round((sortedCount / 45) * 60)}
              </span>
              <span className="text-[11px] text-slate-500">fișiere / min</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Max Combo</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1">
                {maxCombo}
              </span>
              <span className="text-[11px] text-slate-500">consecutive</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'en' ? 'Play Again' : 'Joacă din Nou'}</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm transition border border-slate-700 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
