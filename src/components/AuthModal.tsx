import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  X,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { registerStudent, loginStudent, StudentProfile } from '../lib/studentAuthService';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: StudentProfile) => void;
  initialMode?: 'login' | 'register';
}

const AVATARS = ['🎓', '🤖', '🚀', '⭐', '⚡', '🐱', '🦊', '👾', '💻', '🎮'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🎓');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await registerStudent(username, password, selectedAvatar);
        if (!res.success || !res.profile) {
          setErrorMessage(res.error || (lang === 'en' ? 'Registration failed' : 'Înregistrarea a eșuat'));
          sounds.playWrong();
        } else {
          setSuccessMessage(lang === 'en' ? 'Welcome to Arkedo TIC!' : 'Cont creat cu succes! Bun venit la TIC!');
          sounds.playCorrect();
          setTimeout(() => {
            onAuthSuccess(res.profile!);
            onClose();
          }, 600);
        }
      } else {
        const res = await loginStudent(username, password);
        if (!res.success || !res.profile) {
          setErrorMessage(res.error || (lang === 'en' ? 'Login failed' : 'Autentificarea a eșuat'));
          sounds.playWrong();
        } else {
          setSuccessMessage(lang === 'en' ? 'Welcome back!' : 'Bine ai revenit! Progresul s-a sincronizat.');
          sounds.playCorrect();
          setTimeout(() => {
            onAuthSuccess(res.profile!);
            onClose();
          }, 600);
        }
      }
    } catch {
      setErrorMessage(lang === 'en' ? 'An unexpected error occurred.' : 'A apărut o eroare neașteptată.');
      sounds.playWrong();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'en' ? 'Student Cloud Account' : 'Cont Elev Cloud • Laborator TIC'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
            {mode === 'login'
              ? (lang === 'en' ? 'Sign In to Your Station' : 'Conectează-te la Calculator')
              : (lang === 'en' ? 'Create New Student Pass' : 'Înregistrează Cont Nou')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'en'
              ? 'Keep your 10 arcade game high scores & lesson progress across any PC in the lab!'
              : 'Punctajele la cele 10 jocuri și progresul la lecții te urmează pe orice PC din clasă!'}
          </p>
        </div>

        {/* Tab switcher: Login / Register */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              sounds.playClick();
            }}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Sign In' : 'Am deja cont'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
              sounds.playClick();
            }}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Register' : 'Cont Nou'}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar selector only on register */}
          {mode === 'register' && (
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                {lang === 'en' ? 'Choose your Explorer Avatar:' : 'Alege avatarul tău:'}
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition cursor-pointer shrink-0 ${
                      selectedAvatar === av
                        ? 'bg-teal-500 text-white ring-2 ring-teal-300 scale-110 shadow'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {lang === 'en' ? 'Username / Display Name:' : 'Nume de utilizator / Prenume:'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. Andrei_Popa or Maria 5B' : 'ex: Andrei Popa sau Maria 5B'}
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                {lang === 'en' ? 'Password:' : 'Parolă simplă:'}
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {lang === 'en' ? 'min. 3 characters' : 'minim 3 caractere'}
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'en' ? '••••••••' : '••••••••'}
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
          </div>

          {/* Alert notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Teacher reset tip */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {lang === 'en'
                ? 'Forgot password? The teacher can reset it instantly from the Admin Portal!'
                : 'Ai uitat parola? Profesorul o poate reseta pe loc din Catalogul Digital!'}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 transition cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{lang === 'en' ? 'Log In to My Station' : 'Conectează-mă'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{lang === 'en' ? 'Create Account & Start' : 'Creează Contul și Începe'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
