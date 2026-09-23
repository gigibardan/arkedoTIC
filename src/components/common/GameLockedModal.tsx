import React, { useState } from 'react';
import { Lock, X, Bell, CheckCircle2, ArrowLeft, School, Sparkles } from 'lucide-react';
import { sendUnlockRequest } from '../../lib/gameControlService';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

interface GameLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
  studentName?: string;
  customMessage?: string;
}

export const GameLockedModal: React.FC<GameLockedModalProps> = ({
  isOpen,
  onClose,
  gameId,
  gameTitle,
  studentName,
  customMessage,
}) => {
  const { lang } = useLanguage();
  const [requested, setRequested] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  if (!isOpen) return null;

  const avatar = (() => {
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  })();

  const handleRequestUnlock = async () => {
    if (requested || isSending) return;
    setIsSending(true);
    sounds.playCorrect();
    try {
      await sendUnlockRequest(
        gameId,
        studentName || (lang === 'en' ? 'Cadet Student' : 'Elev'),
        avatar
      );
      setRequested(true);
    } catch {
      setRequested(true);
    } finally {
      setIsSending(false);
    }
  };

  const displayMessage =
    customMessage ||
    (lang === 'en'
      ? 'This game is currently locked by the teacher. Request unlock or ask during class!'
      : 'Acest joc este închis de profesor. Solicită deschiderea lui în timpul orei!');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/90 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden ring-4 ring-rose-500/10">
        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none -z-0"></div>

        {/* Top Badges & Close Button */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'GAME LOCKED BY TEACHER' : 'JOC ÎNCHIS DE PROFESOR'}</span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Închide fereastra"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Illustration & Announcement */}
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-rose-600/30 to-amber-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shadow-xl">
              <Lock className="w-9 h-9 sm:w-10 sm:h-10 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-slate-900 border border-amber-400/50 flex items-center justify-center text-sm shadow">
              {avatar}
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
            {gameTitle}
          </h3>

          <p className="text-xs sm:text-sm font-semibold text-rose-300 font-mono mt-1">
            {lang === 'en' ? 'Access is currently paused' : 'Accesul este oprit momentan de cadrul didactic'}
          </p>

          {/* Teacher Message Callout */}
          <div className="w-full my-4 p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 text-left shadow-inner">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-wider mb-1.5">
              <School className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'en' ? 'Message from Teacher' : 'Mesajul Profesorului de TIC'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              "{displayMessage}"
            </p>
          </div>

          {/* Student Action: Solicită deschiderea */}
          {requested ? (
            <div className="w-full p-4 rounded-2xl bg-emerald-950/70 border-2 border-emerald-500/50 text-center animate-fadeIn shadow-lg">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm font-heading mb-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'en' ? 'Request Sent to Teacher!' : 'Solicitarea a fost trimisă!'}</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                {lang === 'en'
                  ? 'Your teacher received your notification. Pay attention to the lesson and wait for the signal!'
                  : 'Profesorul a primit notificarea pe panou. Fii atent la lecție și așteaptă semnalul de deschidere! 🚀'}
              </p>
            </div>
          ) : (
            <button
              onClick={handleRequestUnlock}
              disabled={isSending}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Bell className="w-4 h-4 animate-bounce" />
              <span>
                {isSending
                  ? (lang === 'en' ? 'Sending request...' : 'Se trimite cererea...')
                  : (lang === 'en' ? 'Request Unlock from Teacher 🙋‍♂️' : 'Solicită Deschiderea Jocului 🙋‍♂️')}
              </span>
            </button>
          )}

          {/* Secondary return button */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="mt-3.5 w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Back to Mini-Games Catalog' : 'Înapoi la Mini-Jocuri'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
