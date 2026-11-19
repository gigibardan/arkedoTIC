import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flame,
  LogIn,
  Radio,
  Sparkles,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LiveQuizParticipant, LiveQuizSession } from '../../types';
import { getActiveStudent } from '../../lib/studentAuthService';
import {
  findLiveQuizByPin,
  joinLiveQuizSession,
  submitLiveQuizAnswer,
  subscribeLiveQuizParticipants,
  subscribeLiveQuizSession,
} from '../../lib/liveQuizService';
import { sounds } from '../../utils/audio';

interface StudentLiveQuizPlayerProps {
  studentName: string;
  initialPin?: string;
  onBack: () => void;
}

const AVATAR_CHOICES = ['🎓', '🤖', '🚀', '💻', '⚡', '🔬', '🌟', '🎮'];

const BTN_STYLES = [
  {
    letter: 'A',
    idle: 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/50 text-white',
    picked: 'bg-rose-500 text-slate-950 border-rose-300 ring-2 ring-rose-300',
  },
  {
    letter: 'B',
    idle: 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/50 text-white',
    picked: 'bg-sky-500 text-slate-950 border-sky-300 ring-2 ring-sky-300',
  },
  {
    letter: 'C',
    idle: 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/50 text-white',
    picked: 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-300',
  },
  {
    letter: 'D',
    idle: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/50 text-white',
    picked: 'bg-emerald-500 text-slate-950 border-emerald-300 ring-2 ring-emerald-300',
  },
];

export const StudentLiveQuizPlayer: React.FC<StudentLiveQuizPlayerProps> = ({
  studentName,
  initialPin = '',
  onBack,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const activeAccount = useMemo(() => getActiveStudent(), []);

  const [pinInput, setPinInput] = useState<string>(initialPin);
  const [nameInput, setNameInput] = useState<string>(() => {
    return activeAccount?.username || studentName || '';
  });
  const [avatar, setAvatar] = useState<string>(() => {
    if (activeAccount?.avatar) return activeAccount.avatar;
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  });

  const [joining, setJoining] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string>('');

  const [session, setSession] = useState<LiveQuizSession | null>(null);
  const [participant, setParticipant] = useState<LiveQuizParticipant | null>(null);
  const [participants, setParticipants] = useState<LiveQuizParticipant[]>([]);
  const [submittingAnswer, setSubmittingAnswer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Sync session & participants once joined
  useEffect(() => {
    if (!session?.id) return;
    const unsubSession = subscribeLiveQuizSession(session.id, (updated) => {
      if (updated) setSession(updated);
    });
    const unsubPlayers = subscribeLiveQuizParticipants(session.id, (players) => {
      setParticipants(players);
      if (participant?.id) {
        const self = players.find((p) => p.id === participant.id);
        if (self) setParticipant(self);
      }
    });
    return () => {
      unsubSession();
      unsubPlayers();
    };
  }, [session?.id, participant?.id]);

  // Countdown tick
  useEffect(() => {
    if (!session || session.phase !== 'question') {
      setTimeLeft(0);
      return;
    }
    const computeRemaining = () => {
      const elapsedSec = Math.floor((Date.now() - (session.questionStartedAt || Date.now())) / 1000);
      return Math.max(0, session.secondsPerQuestion - elapsedSec);
    };
    setTimeLeft(computeRemaining());
    const timer = setInterval(() => {
      setTimeLeft(computeRemaining());
    }, 300);
    return () => clearInterval(timer);
  }, [session?.id, session?.phase, session?.questionStartedAt, session?.secondsPerQuestion]);

  const currentQuestion = session?.questions?.[session.currentQuestionIndex] || null;
  const qKey = session ? String(session.currentQuestionIndex) : '0';
  const currentAnswer = participant?.answers?.[qKey];

  const handleSelectOption = async (optIdx: number) => {
    if (!session || !participant || session.phase !== 'question') return;
    if (currentAnswer || submittingAnswer) return;
    setSubmittingAnswer(true);
    try {
      sounds.playClick();
      const updated = await submitLiveQuizAnswer(
        session,
        participant,
        session.currentQuestionIndex,
        optIdx
      );
      setParticipant(updated);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Keyboard shortcuts 1-4 during active question
  useEffect(() => {
    if (!session || session.phase !== 'question' || currentAnswer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        void handleSelectOption(Number(e.key) - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    if (cleanName.length < 2) {
      setJoinError(isEn ? 'Enter your name (min 2 characters).' : 'Introdu numele tău (minim 2 caractere).');
      sounds.playWrong();
      return;
    }

    setJoining(true);
    setJoinError('');
    try {
      const found = await findLiveQuizByPin(pinInput);
      if (!found.session) {
        setJoinError(found.error || (isEn ? 'Session not found.' : 'Sesiune negăsită.'));
        sounds.playWrong();
        return;
      }
      const player = await joinLiveQuizSession(found.session.id, {
        studentId: activeAccount?.id,
        name: cleanName,
        avatar,
      });
      setSession(found.session);
      setParticipant(player);
      sounds.playCorrect();
    } finally {
      setJoining(false);
    }
  };

  const currentRank = useMemo(() => {
    if (!participant) return 0;
    const idx = participants.findIndex((p) => p.id === participant.id);
    return idx >= 0 ? idx + 1 : 0;
  }, [participants, participant]);

  // ================= JOIN SCREEN =================
  if (!session || !participant) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-4">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{isEn ? 'Back' : 'Înapoi'}</span>
        </button>

        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Radio className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {isEn ? 'Join Live Class Quiz' : 'Intră la Quiz Live în Clasă'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Enter the 6-digit PIN shown on the classroom screen.'
                : 'Introdu codul PIN de 6 cifre afișat pe tabla interactivă sau pe ecranul profesorului.'}
            </p>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">
                Cod PIN (6 cifre)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, ''));
                  if (joinError) setJoinError('');
                }}
                placeholder="Ex: 482910"
                className="w-full min-h-[54px] bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-2xl px-4 py-3 text-center text-2xl font-mono font-black tracking-[0.25em] text-white placeholder-slate-600 focus:outline-none tabular-nums"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">
                {isEn ? 'Your Name (Shown in Gradebook)' : 'Numele tău (pentru Clasament & Catalog)'}
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (joinError) setJoinError('');
                }}
                placeholder={isEn ? 'First and Last Name' : 'Prenume și Nume'}
                className="w-full min-h-[44px] bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">
                Avatar
              </label>
              <div className="grid grid-cols-8 gap-1.5">
                {AVATAR_CHOICES.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setAvatar(av);
                    }}
                    className={`min-h-[42px] rounded-xl border text-lg flex items-center justify-center cursor-pointer transition ${
                      avatar === av
                        ? 'bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {joinError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 font-bold">
                {joinError}
              </div>
            )}

            <button
              type="submit"
              disabled={joining || pinInput.length < 4}
              className="w-full min-h-[50px] py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg disabled:opacity-40"
            >
              <LogIn className="w-4 h-4" />
              <span>{joining ? 'Se conectează...' : 'Intră în Sesiunea Live'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= CONNECTED PLAYER VIEW =================
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Player Header */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 tabular-nums">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{participant.avatar || '🎓'}</span>
          <div className="min-w-0">
            <div className="text-sm font-black text-white truncate">{participant.name}</div>
            <div className="text-[11px] font-mono text-slate-400">
              PIN {session.pin} · {session.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {participant.streak >= 2 && (
            <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-mono font-bold inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {participant.streak}
            </span>
          )}
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-black">
            {participant.score} pts
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setSession(null);
              setParticipant(null);
            }}
            className="px-3 py-1.5 min-h-[36px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
          >
            {isEn ? 'Leave' : 'Ieși'}
          </button>
        </div>
      </div>

      {/* LOBBY WAIT */}
      {session.phase === 'lobby' && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white font-heading">
            {isEn ? "You're in! Watch the screen" : 'Ești conectat! Pregătește-te'}
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {isEn
              ? 'Wait for the teacher to start the first question.'
              : 'Așteaptă ca profesorul să pornească prima întrebare pe tabla interactivă.'}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 tabular-nums">
            <Users className="w-4 h-4" />
            <span>{participants.length} colegi conectați în acest moment</span>
          </div>
        </div>
      )}

      {/* ACTIVE QUESTION */}
      {session.phase === 'question' && currentQuestion && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5 sm:p-7 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between gap-3 tabular-nums">
            <span className="text-xs font-mono text-slate-400 font-bold">
              Întrebarea {session.currentQuestionIndex + 1} / {session.questions.length}
            </span>
            <span
              className={`px-3 py-1 rounded-xl border font-mono text-sm font-black inline-flex items-center gap-1.5 ${
                timeLeft <= 5
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, Math.round((timeLeft / Math.max(1, session.secondsPerQuestion)) * 100))
                )}%`,
              }}
            />
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-white font-heading leading-snug">
            {isEn ? currentQuestion.promptEn : currentQuestion.promptRo}
          </h2>

          {currentAnswer ? (
            <div className="rounded-2xl bg-slate-900 border border-teal-500/40 p-6 text-center space-y-2">
              <div className="text-sm font-black text-teal-300">
                Răspuns trimis (Varianta {BTN_STYLES[currentAnswer.optionIndex]?.letter}) ✓
              </div>
              <p className="text-xs text-slate-400">
                Așteptăm ca profesorul să afișeze rezultatele și clasamentul...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(isEn ? currentQuestion.optionsEn : currentQuestion.optionsRo).map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={submittingAnswer || timeLeft === 0}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3.5 min-h-[68px] active:scale-[0.98] disabled:opacity-50 ${BTN_STYLES[idx].idle}`}
                >
                  <span className="w-9 h-9 rounded-xl bg-slate-950/75 border border-white/15 flex items-center justify-center font-mono font-black text-sm shrink-0">
                    {BTN_STYLES[idx].letter}
                  </span>
                  <span className="text-sm sm:text-base font-bold leading-snug">{opt}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REVEAL PHASE */}
      {(session.phase === 'reveal' || session.phase === 'leaderboard') && currentQuestion && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl text-center">
          {currentAnswer ? (
            currentAnswer.isCorrect ? (
              <div className="space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-black text-emerald-300 font-heading">
                  Răspuns Corect! +{currentAnswer.pointsEarned} pts
                </h3>
              </div>
            ) : (
              <div className="space-y-2">
                <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
                <h3 className="text-2xl font-black text-rose-300 font-heading">Răspuns Incorect</h3>
                <p className="text-xs text-slate-300">
                  Varianta corectă:{' '}
                  <strong className="text-emerald-300">
                    {BTN_STYLES[currentQuestion.correctIndex].letter}.{' '}
                    {(isEn ? currentQuestion.optionsEn : currentQuestion.optionsRo)[
                      currentQuestion.correctIndex
                    ]}
                  </strong>
                </p>
              </div>
            )
          ) : (
            <div className="space-y-2">
              <Clock className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-black text-amber-300 font-heading">Timpul a expirat</h3>
              <p className="text-xs text-slate-300">
                Răspuns corect:{' '}
                <strong className="text-emerald-300">
                  {(isEn ? currentQuestion.optionsEn : currentQuestion.optionsRo)[
                    currentQuestion.correctIndex
                  ]}
                </strong>
              </p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-left">
            <strong className="text-emerald-300 mr-1">Explicație:</strong>
            {isEn ? currentQuestion.explanationEn : currentQuestion.explanationRo}
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono tabular-nums">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-white font-bold">
              Locul tău curent: #{currentRank || '—'} din {participants.length}
            </span>
          </div>
        </div>
      )}

      {/* FINISHED PODIUM */}
      {session.phase === 'finished' && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 text-center shadow-2xl tabular-nums">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Quiz Live Finalizat!
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Ai obținut <strong className="text-emerald-300">{participant.score} puncte</strong> ({participant.correctCount}/
              {session.questions.length} răspunsuri corecte) · Locul{' '}
              <strong className="text-amber-300">#{currentRank || '—'}</strong>
            </p>
          </div>

          {participants.length > 0 && (
            <div className="space-y-2 max-w-md mx-auto text-left">
              {participants.slice(0, 5).map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between gap-2 p-3 rounded-xl border ${
                    p.id === participant.id
                      ? 'bg-emerald-500/15 border-emerald-400/50'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    #{idx + 1} {p.avatar} {p.name}
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-300 shrink-0">
                    {p.score} pts
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 min-h-[46px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm cursor-pointer"
          >
            {isEn ? 'Return to Courses' : 'Înapoi la Platformă'}
          </button>
        </div>
      )}
    </div>
  );
};
