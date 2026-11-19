import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Flame,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Trash2,
  Trophy,
  UserX,
  Users,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ClassroomGroup,
  LiveQuizParticipant,
  LiveQuizQuestionItem,
  LiveQuizSession,
  School,
} from '../../types';
import { exportCsvFile, getClassrooms } from '../../lib/classroomService';
import {
  advanceLiveQuizPhase,
  buildLiveQuizQuestionDeck,
  createLiveQuizSession,
  kickLiveQuizParticipant,
  logLiveQuizGradesToCatalog,
  subscribeLiveQuizParticipants,
  subscribeLiveQuizSession,
} from '../../lib/liveQuizService';
import { sounds } from '../../utils/audio';

interface TeacherLiveQuizHostProps {
  schools: School[];
  initialClassId?: string | null;
  onGradesLogged?: () => void;
}

const OPTION_STYLES = [
  { label: 'A', bg: 'bg-rose-500/15 border-rose-500/40 text-rose-200', bar: 'bg-rose-500' },
  { label: 'B', bg: 'bg-sky-500/15 border-sky-500/40 text-sky-200', bar: 'bg-sky-500' },
  { label: 'C', bg: 'bg-amber-500/15 border-amber-500/40 text-amber-200', bar: 'bg-amber-500' },
  { label: 'D', bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200', bar: 'bg-emerald-500' },
];

export const TeacherLiveQuizHost: React.FC<TeacherLiveQuizHostProps> = ({
  schools,
  initialClassId = null,
  onGradesLogged,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [classrooms, setClassrooms] = useState<ClassroomGroup[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || '');
  const [quizTitle, setQuizTitle] = useState<string>('Quiz Live TIC în Clasă');
  const [gradeFilter, setGradeFilter] = useState<'all' | 5 | 6 | 7 | 8>('all');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [questionCount, setQuestionCount] = useState<number>(8);
  const [secondsPerQuestion, setSecondsPerQuestion] = useState<number>(25);

  // Optional custom questions
  const [customQuestions, setCustomQuestions] = useState<LiveQuizQuestionItem[]>([]);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [customOptions, setCustomOptions] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [customCorrect, setCustomCorrect] = useState<0 | 1 | 2 | 3>(0);

  // Active session state
  const [session, setSession] = useState<LiveQuizSession | null>(null);
  const [participants, setParticipants] = useState<LiveQuizParticipant[]>([]);
  const [creating, setCreating] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loggingGrades, setLoggingGrades] = useState<boolean>(false);
  const [gradesLoggedCount, setGradesLoggedCount] = useState<number | null>(null);

  useEffect(() => {
    getClassrooms().then(setClassrooms).catch(() => {});
  }, []);

  useEffect(() => {
    if (!session?.id) return;
    const unsubSession = subscribeLiveQuizSession(session.id, (updated) => {
      if (updated) setSession(updated);
    });
    const unsubPlayers = subscribeLiveQuizParticipants(session.id, (players) => {
      setParticipants(players);
    });
    return () => {
      unsubSession();
      unsubPlayers();
    };
  }, [session?.id]);

  // Countdown tick during question phase
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

  const handleAddCustomQuestion = () => {
    if (!customPrompt.trim() || customOptions.some((o) => !o.trim())) return;
    const item: LiveQuizQuestionItem = {
      id: `cq_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      promptRo: customPrompt.trim(),
      promptEn: customPrompt.trim(),
      optionsRo: [
        customOptions[0].trim(),
        customOptions[1].trim(),
        customOptions[2].trim(),
        customOptions[3].trim(),
      ],
      optionsEn: [
        customOptions[0].trim(),
        customOptions[1].trim(),
        customOptions[2].trim(),
        customOptions[3].trim(),
      ],
      correctIndex: customCorrect,
      explanationRo: `Răspuns corect definit de profesor: ${customOptions[customCorrect].trim()}.`,
      explanationEn: `Teacher-defined answer: ${customOptions[customCorrect].trim()}.`,
      topicRo: 'Întrebare Profesor',
      topicEn: 'Teacher Question',
      grade: gradeFilter === 'all' ? 7 : gradeFilter,
    };
    setCustomQuestions((prev) => [...prev, item]);
    setCustomPrompt('');
    setCustomOptions(['', '', '', '']);
    setCustomCorrect(0);
    setShowCustomForm(false);
    sounds.playCorrect();
  };

  const handleLaunchSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const selectedClass = classrooms.find((c) => c.id === selectedClassId);
      const deck = buildLiveQuizQuestionDeck({
        gradeFilter,
        difficulty,
        count: Math.max(questionCount, customQuestions.length),
        customQuestions,
      });

      const created = await createLiveQuizSession({
        title: quizTitle.trim() || 'Quiz Live TIC',
        classId: selectedClass?.id || '',
        className: selectedClass?.name || '',
        schoolId: selectedClass?.schoolId || schools[0]?.id || 'scoala_pilot_01',
        teacherName: selectedClass?.teacherName || 'Profesor TIC',
        secondsPerQuestion,
        questions: deck,
      });
      setSession(created);
      setParticipants([]);
      setGradesLoggedCount(null);
      sounds.playCorrect();
    } finally {
      setCreating(false);
    }
  };

  const currentQuestion = session?.questions?.[session.currentQuestionIndex] || null;
  const qKey = session ? String(session.currentQuestionIndex) : '0';

  const answeredCount = useMemo(() => {
    if (!session) return 0;
    return participants.filter((p) => Boolean(p.answers?.[qKey])).length;
  }, [participants, session, qKey]);

  const optionCounts = useMemo(() => {
    const counts = [0, 0, 0, 0];
    if (!session) return counts;
    for (const p of participants) {
      const rec = p.answers?.[qKey];
      if (rec && rec.optionIndex >= 0 && rec.optionIndex <= 3) {
        counts[rec.optionIndex]++;
      }
    }
    return counts;
  }, [participants, session, qKey]);

  const handleCopyPin = async (pin: string) => {
    try {
      await navigator.clipboard.writeText(pin);
      setCopiedPin(true);
      sounds.playClick();
      setTimeout(() => setCopiedPin(false), 1800);
    } catch {}
  };

  const handleStartQuiz = async () => {
    if (!session) return;
    sounds.playCorrect();
    const next = await advanceLiveQuizPhase(session, 'question', 0);
    setSession(next);
  };

  const handleShowReveal = async () => {
    if (!session) return;
    sounds.playClick();
    const next = await advanceLiveQuizPhase(session, 'reveal');
    setSession(next);
  };

  const handleNextStep = async () => {
    if (!session) return;
    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex >= session.questions.length) {
      sounds.playSuccess();
      const finished = await advanceLiveQuizPhase(session, 'finished');
      setSession(finished);
    } else {
      sounds.playClick();
      const nextQ = await advanceLiveQuizPhase(session, 'question', nextIndex);
      setSession(nextQ);
    }
  };

  const handleLogGrades = async () => {
    if (!session || participants.length === 0) return;
    setLoggingGrades(true);
    try {
      const count = await logLiveQuizGradesToCatalog(session, participants);
      setGradesLoggedCount(count);
      setSession((prev) => (prev ? { ...prev, gradesLogged: true } : prev));
      sounds.playCorrect();
      onGradesLogged?.();
    } finally {
      setLoggingGrades(false);
    }
  };

  const handleExportResults = () => {
    if (!session) return;
    const totalQ = Math.max(1, session.questions.length);
    const headers = ['Loc', 'Nume Elev', 'Puncte Live', 'Răspunsuri Corecte', 'Total Întrebări', 'Procent (%)', 'Serie Maximă'];
    const rows = participants.map((p, idx) => [
      idx + 1,
      p.name,
      p.score,
      p.correctCount,
      totalQ,
      Math.round((p.correctCount / totalQ) * 100),
      p.streak || 0,
    ]);
    exportCsvFile(`ArkyEdu_QuizLive_${session.pin}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    sounds.playClick();
  };

  // ================= SETUP SCREEN =================
  if (!session) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5 mb-1">
                <Radio className="w-4 h-4" />
                <span>{isEn ? 'Real-Time Classroom Arena' : 'Concurs Live în Clasă (Sincronizat)'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                {isEn ? 'Host a Live TIC Quiz with PIN' : 'Lansează Quiz Live pe Tablă / Proiector'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {isEn
                  ? 'Generate a 6-digit PIN, let students join from laptops or phones, track live answers, and log grades directly into the digital catalog.'
                  : 'Generează un cod PIN de 6 cifre. Elevii intră de pe telefon sau calculator fără instalare, răspund contra-cronometru, iar notele pot fi trecute în catalog cu 1 click.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleLaunchSession} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  {isEn ? 'Session Title' : 'Titlu Quiz Live'}
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Ex: Recapitulare Algoritmi Clasa a VII-a"
                  className="w-full min-h-[42px] bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  {isEn ? 'Target Classroom (optional)' : 'Asociere Clasă (opțional)'}
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full min-h-[42px] bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="">{isEn ? 'Open Session (Any Class)' : 'Sesiune Deschisă (Fără clasă fixă)'}</option>
                  {classrooms
                    .filter((c) => !c.archived)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  {isEn ? 'Curriculum Grade' : 'Nivel Programă'}
                </label>
                <select
                  value={gradeFilter}
                  onChange={(e) => {
                    const v = e.target.value;
                    setGradeFilter(v === 'all' ? 'all' : (Number(v) as 5 | 6 | 7 | 8));
                  }}
                  className="w-full min-h-[42px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                >
                  <option value="all">{isEn ? 'Mixed (Grades 5–8)' : 'Mixt (Clasele V–VIII)'}</option>
                  <option value={5}>{isEn ? 'Grade 5' : 'Clasa a V-a'}</option>
                  <option value={6}>{isEn ? 'Grade 6' : 'Clasa a VI-a'}</option>
                  <option value={7}>{isEn ? 'Grade 7' : 'Clasa a VII-a'}</option>
                  <option value={8}>{isEn ? 'Grade 8' : 'Clasa a VIII-a'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  {isEn ? 'Difficulty' : 'Dificultate'}
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'all' | 'easy' | 'medium' | 'hard')}
                  className="w-full min-h-[42px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                >
                  <option value="all">{isEn ? 'Balanced Mix' : 'Echilibrat (Mixt)'}</option>
                  <option value="easy">{isEn ? 'Foundation' : 'Bază (Ușor)'}</option>
                  <option value="medium">{isEn ? 'Standard' : 'Standard (Mediu)'}</option>
                  <option value="hard">{isEn ? 'Challenge' : 'Avansat (Performanță)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  {isEn ? 'Question Count' : 'Număr Întrebări'}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[5, 8, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setQuestionCount(cnt);
                      }}
                      className={`min-h-[42px] rounded-xl text-xs font-black font-mono border cursor-pointer transition tabular-nums ${
                        questionCount === cnt
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  {isEn ? 'Seconds / Question' : 'Secunde / Întrebare'}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[15, 20, 30, 45].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSecondsPerQuestion(sec);
                      }}
                      className={`min-h-[42px] rounded-xl text-xs font-black font-mono border cursor-pointer transition tabular-nums ${
                        secondsPerQuestion === sec
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Questions Builder */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-white">
                    {isEn
                      ? `Custom Teacher Questions (${customQuestions.length} added)`
                      : `Întrebări Personalizate Profesor (${customQuestions.length} adăugate)`}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isEn
                      ? 'Optional: prepend your own questions; remaining slots fill automatically from the curriculum bank.'
                      : 'Opțional: poți adăuga întrebările tale proprii; restul până la total se completează automat din banca oficială TIC.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setShowCustomForm((prev) => !prev);
                  }}
                  className="px-3 py-2 min-h-[38px] rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showCustomForm ? (isEn ? 'Hide Form' : 'Ascunde') : isEn ? 'Add Custom Question' : 'Adaugă Întrebare Proprie'}</span>
                </button>
              </div>

              {showCustomForm && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={isEn ? 'Question prompt...' : 'Enunțul întrebării (ex: Ce afișează cout << 17 % 5; ?)'}
                    className="w-full min-h-[40px] bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomCorrect(idx as 0 | 1 | 2 | 3)}
                          className={`min-w-[36px] min-h-[38px] rounded-lg text-xs font-black font-mono border cursor-pointer shrink-0 ${
                            customCorrect === idx
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                          title={isEn ? 'Mark as correct answer' : 'Marchează ca răspuns corect'}
                        >
                          {OPTION_STYLES[idx].label}
                        </button>
                        <input
                          type="text"
                          value={customOptions[idx]}
                          onChange={(e) => {
                            const next: [string, string, string, string] = [...customOptions] as [
                              string,
                              string,
                              string,
                              string,
                            ];
                            next[idx] = e.target.value;
                            setCustomOptions(next);
                          }}
                          placeholder={`Varianta ${OPTION_STYLES[idx].label}`}
                          className="flex-1 min-h-[38px] bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddCustomQuestion}
                      disabled={!customPrompt.trim() || customOptions.some((o) => !o.trim())}
                      className="px-4 py-2 min-h-[38px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer disabled:opacity-40"
                    >
                      {isEn ? 'Save Question to Deck' : 'Adaugă în Quiz'}
                    </button>
                  </div>
                </div>
              )}

              {customQuestions.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {customQuestions.map((cq, i) => (
                    <div
                      key={cq.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                    >
                      <span className="text-slate-200 truncate">
                        <strong className="text-emerald-300 font-mono mr-1.5">#{i + 1}</strong>
                        {cq.promptRo}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomQuestions((prev) => prev.filter((item) => item.id !== cq.id))
                        }
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer shrink-0"
                        aria-label="Șterge întrebare"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-3 min-h-[46px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition cursor-pointer inline-flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Radio className="w-4 h-4" />
                <span>
                  {creating
                    ? isEn
                      ? 'Generating PIN...'
                      : 'Se generează PIN...'
                    : isEn
                    ? 'Open Live Lobby & Generate PIN'
                    : 'Deschide Lobby Live & Generează PIN'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= ACTIVE HOST VIEW (LOBBY / QUESTION / REVEAL / FINISHED) =================
  return (
    <div className="space-y-6">
      {/* Persistent Top Control Bar */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-emerald-300 font-bold">
              {session.phase === 'lobby'
                ? 'LOBBY DESCHIS'
                : session.phase === 'question'
                ? `ÎNTREBAREA ${session.currentQuestionIndex + 1} / ${session.questions.length}`
                : session.phase === 'reveal'
                ? `REZULTAT ÎNTREBAREA ${session.currentQuestionIndex + 1}`
                : 'QUIZ FINALIZAT'}
            </span>
            {session.className && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-300 font-bold">{session.className}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{participants.length} elevi conectați</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-heading">{session.title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleCopyPin(session.pin)}
            className="px-4 py-2 min-h-[42px] rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-mono text-sm font-black inline-flex items-center gap-2 cursor-pointer tabular-nums"
          >
            <span>PIN: {session.pin}</span>
            {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setSession(null);
              setParticipants([]);
              setGradesLoggedCount(null);
            }}
            className="px-3.5 py-2 min-h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'New Session' : 'Sesiune Nouă'}</span>
          </button>
        </div>
      </div>

      {/* PHASE 1: LOBBY */}
      {session.phase === 'lobby' && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-teal-300 font-bold">
              {isEn ? 'Students join at Evaluare → Quiz Live PIN' : 'Elevii intră la secțiunea Quiz Live și introduc codul:'}
            </div>
            <div className="text-5xl sm:text-7xl font-black font-mono tracking-[0.2em] text-white tabular-nums py-2">
              {session.pin}
            </div>
            <div className="text-xs text-slate-400">
              {session.questions.length} {isEn ? 'questions' : 'întrebări'} · {session.secondsPerQuestion}s /{' '}
              {isEn ? 'question' : 'întrebare'}
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-200">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="tabular-nums">
                  {isEn ? `Waiting Room (${participants.length})` : `Elevi în sală (${participants.length})`}
                </span>
              </span>
              <span>{isEn ? 'Auto-sync live' : 'Sincronizare automată'}</span>
            </div>

            {participants.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-8 text-sm text-slate-400">
                {isEn
                  ? 'Waiting for the first students to connect with PIN...'
                  : 'Se așteaptă conectarea primilor elevi cu codul PIN afișat pe tablă...'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-left">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{p.avatar || '🎓'}</span>
                      <span className="text-xs font-bold text-white truncate">{p.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => kickLiveQuizParticipant(session.id, p.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                      title={isEn ? 'Remove student' : 'Elimină participant'}
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleStartQuiz}
              className="px-8 py-3.5 min-h-[50px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base transition cursor-pointer inline-flex items-center gap-2 shadow-xl"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{isEn ? 'Start Live Quiz Now' : 'Pornește Quiz-ul Acum'}</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: ACTIVE QUESTION */}
      {session.phase === 'question' && currentQuestion && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 tabular-nums">
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-xl border font-mono text-lg font-black inline-flex items-center gap-2 ${
                  timeLeft <= 5
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>{timeLeft}s</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {isEn ? currentQuestion.topicEn : currentQuestion.topicRo}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 font-bold">
                {isEn ? 'Answers:' : 'Răspunsuri primite:'}{' '}
                <strong className="text-white">
                  {answeredCount} / {participants.length}
                </strong>
              </div>
              <button
                type="button"
                onClick={handleShowReveal}
                className="px-4 py-2.5 min-h-[42px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{isEn ? 'Reveal Answer & Stats' : 'Afișează Răspuns & Statistici'}</span>
              </button>
            </div>
          </div>

          <h4 className="text-xl sm:text-3xl font-black text-white font-heading leading-snug">
            {isEn ? currentQuestion.promptEn : currentQuestion.promptRo}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {(isEn ? currentQuestion.optionsEn : currentQuestion.optionsRo).map((opt, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-3.5 ${OPTION_STYLES[idx].bg}`}
              >
                <span className="w-9 h-9 rounded-xl bg-slate-950/80 border border-white/15 flex items-center justify-center font-mono font-black text-sm shrink-0">
                  {OPTION_STYLES[idx].label}
                </span>
                <span className="text-sm sm:text-base font-bold text-white">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: REVEAL & DISTRIBUTION + TOP 5 */}
      {session.phase === 'reveal' && currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-3xl bg-slate-950 border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="text-xs font-mono uppercase text-emerald-400 font-bold">
              {isEn ? 'Answer Distribution' : 'Distribuția Răspunsurilor'}
            </div>
            <h4 className="text-lg sm:text-xl font-black text-white font-heading">
              {isEn ? currentQuestion.promptEn : currentQuestion.promptRo}
            </h4>

            <div className="space-y-3 tabular-nums">
              {(isEn ? currentQuestion.optionsEn : currentQuestion.optionsRo).map((opt, idx) => {
                const count = optionCounts[idx] || 0;
                const total = Math.max(1, answeredCount);
                const pct = Math.round((count / total) * 100);
                const isCorrect = idx === currentQuestion.correctIndex;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${
                      isCorrect
                        ? 'bg-emerald-500/15 border-emerald-400/60'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold mb-1.5">
                      <span className="flex items-center gap-2 text-white min-w-0">
                        <span className="font-mono text-slate-300 shrink-0">{OPTION_STYLES[idx].label}.</span>
                        <span className="truncate">{opt}</span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </span>
                      <span className="font-mono text-slate-200 shrink-0">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${OPTION_STYLES[idx].bar} transition-all duration-500`}
                        style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-300 mr-1.5">Explicație:</strong>
              {isEn ? currentQuestion.explanationEn : currentQuestion.explanationRo}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 min-h-[44px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition cursor-pointer inline-flex items-center gap-2"
              >
                <span>
                  {session.currentQuestionIndex + 1 >= session.questions.length
                    ? isEn
                      ? 'Show Final Podium'
                      : 'Vezi Podiumul Final'
                    : isEn
                    ? 'Next Question'
                    : 'Întrebarea Următoare'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-base font-black text-white font-heading flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Live Top 5 Leaderboard' : 'Clasament Live (Top 5)'}</span>
              </h5>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {participants.length} {isEn ? 'players' : 'elevi'}
              </span>
            </div>

            <div className="space-y-2 tabular-nums">
              {participants.slice(0, 5).map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 text-center font-mono text-xs font-black text-amber-300">
                      #{idx + 1}
                    </span>
                    <span className="text-lg shrink-0">{p.avatar || '🎓'}</span>
                    <span className="text-xs sm:text-sm font-bold text-white truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                    {p.streak >= 2 && (
                      <span className="text-orange-300 flex items-center gap-0.5">
                        <Flame className="w-3.5 h-3.5" />
                        {p.streak}
                      </span>
                    )}
                    <span className="font-black text-emerald-300">{p.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: FINISHED PODIUM & GRADE LOGGING */}
      {session.phase === 'finished' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                {isEn ? 'Final Live Quiz Podium' : 'Podium Final Quiz Live'}
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-white font-heading">
                {session.title}
              </h4>
            </div>

            {participants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto tabular-nums">
                {participants.slice(0, 3).map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border space-y-2 ${
                      idx === 0
                        ? 'bg-amber-500/15 border-amber-400/50'
                        : idx === 1
                        ? 'bg-slate-800/80 border-slate-600'
                        : 'bg-orange-950/30 border-orange-500/30'
                    }`}
                  >
                    <div className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                    <div className="text-3xl">{p.avatar || '🎓'}</div>
                    <div className="text-base font-black text-white truncate">{p.name}</div>
                    <div className="text-xl font-black font-mono text-emerald-300">{p.score} pts</div>
                    <div className="text-xs font-mono text-slate-400">
                      {p.correctCount} / {session.questions.length} corecte
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                {isEn ? 'No students recorded answers in this session.' : 'Niciun elev nu a înregistrat răspunsuri în această sesiune.'}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleLogGrades}
                disabled={loggingGrades || session.gradesLogged || participants.length === 0}
                className="px-5 py-3 min-h-[44px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
              >
                <Award className="w-4 h-4" />
                <span>
                  {session.gradesLogged
                    ? gradesLoggedCount !== null
                      ? `Note Salvate în Catalog (${gradesLoggedCount} elevi)`
                      : 'Note Salvate în Catalog ✓'
                    : loggingGrades
                    ? 'Se salvează notele...'
                    : 'Salvează Notele în Catalog'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleExportResults}
                disabled={participants.length === 0}
                className="px-5 py-3 min-h-[44px] rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer inline-flex items-center gap-2 disabled:opacity-40"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Export CSV Results' : 'Exportă Rezultate CSV'}</span>
              </button>
            </div>
          </div>

          {participants.length > 0 && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 text-sm font-bold text-white">
                {isEn ? 'Full Session Standings' : 'Clasament Complet Sesiune'}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm tabular-nums">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Loc</th>
                      <th className="py-3 px-4">Elev</th>
                      <th className="py-3 px-4">Corecte</th>
                      <th className="py-3 px-4">Procent</th>
                      <th className="py-3 px-4 text-right">Punctaj Live</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {participants.map((p, idx) => {
                      const pct = Math.round(
                        (p.correctCount / Math.max(1, session.questions.length)) * 100
                      );
                      return (
                        <tr key={p.id}>
                          <td className="py-3 px-4 font-mono font-bold text-amber-300">#{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-white">
                            <span className="mr-2">{p.avatar || '🎓'}</span>
                            {p.name}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {p.correctCount}/{session.questions.length}
                          </td>
                          <td className="py-3 px-4 font-mono text-cyan-300">{pct}%</td>
                          <td className="py-3 px-4 font-mono font-black text-emerald-300 text-right">
                            {p.score} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
