import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db, isCloudConnected } from './firebase';
import {
  LiveQuizAnswerRecord,
  LiveQuizParticipant,
  LiveQuizPhase,
  LiveQuizQuestionItem,
  LiveQuizSession,
} from '../types';
import { QUICK_EVAL_BANK, QuickEvalQuestion } from '../data/quickEvalBank';
import { logStudentResult } from './resultsService';

const QUIZ_SESSIONS_COLLECTION = 'quiz_live_sessions';
const QUIZ_PARTICIPANTS_SUB = 'participants';
const LOCAL_SESSIONS_KEY = 'arkedo_live_quiz_sessions';
const LOCAL_PARTICIPANTS_PREFIX = 'arkedo_live_quiz_players_';
const QUIZ_BROADCAST_CHANNEL = 'arkyedu_live_quiz_sync';

function logLiveQuizDiagnostic(error: unknown, op: string, path: string): void {
  const payload = {
    error: error instanceof Error ? error.message : String(error),
    operationType: op,
    path,
    userId: auth?.currentUser?.uid ?? null,
  };
  console.warn('[LiveQuizService] Firestore diagnostic:', JSON.stringify(payload));
}

function broadcastQuizEvent(sessionId: string): void {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(QUIZ_BROADCAST_CHANNEL);
      ch.postMessage({ sessionId, ts: Date.now() });
      ch.close();
    }
  } catch {}
}

function readLocalSessions(): Record<string, LiveQuizSession> {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, LiveQuizSession>) : {};
  } catch {
    return {};
  }
}

function writeLocalSession(session: LiveQuizSession): void {
  try {
    const map = readLocalSessions();
    map[session.id] = session;
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(map));
    broadcastQuizEvent(session.id);
  } catch {}
}

function readLocalParticipants(sessionId: string): LiveQuizParticipant[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_PARTICIPANTS_PREFIX}${sessionId}`);
    if (!raw) return [];
    const map = JSON.parse(raw) as Record<string, LiveQuizParticipant>;
    return Object.values(map);
  } catch {
    return [];
  }
}

function writeLocalParticipant(sessionId: string, participant: LiveQuizParticipant): void {
  try {
    const raw = localStorage.getItem(`${LOCAL_PARTICIPANTS_PREFIX}${sessionId}`);
    const map: Record<string, LiveQuizParticipant> = raw ? JSON.parse(raw) : {};
    map[participant.id] = participant;
    localStorage.setItem(`${LOCAL_PARTICIPANTS_PREFIX}${sessionId}`, JSON.stringify(map));
    broadcastQuizEvent(sessionId);
  } catch {}
}

function deleteLocalParticipant(sessionId: string, playerId: string): void {
  try {
    const raw = localStorage.getItem(`${LOCAL_PARTICIPANTS_PREFIX}${sessionId}`);
    if (!raw) return;
    const map: Record<string, LiveQuizParticipant> = JSON.parse(raw);
    delete map[playerId];
    localStorage.setItem(`${LOCAL_PARTICIPANTS_PREFIX}${sessionId}`, JSON.stringify(map));
    broadcastQuizEvent(sessionId);
  } catch {}
}

export function generateQuizPin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function toLiveQuestion(q: QuickEvalQuestion): LiveQuizQuestionItem {
  return {
    id: q.id,
    promptRo: q.promptRo,
    promptEn: q.promptEn,
    optionsRo: q.optionsRo,
    optionsEn: q.optionsEn,
    correctIndex: q.correctIndex,
    explanationRo: q.explanationRo,
    explanationEn: q.explanationEn,
    topicRo: q.topicRo,
    topicEn: q.topicEn,
    grade: q.grade,
  };
}

export function buildLiveQuizQuestionDeck(options: {
  gradeFilter: 'all' | 5 | 6 | 7 | 8;
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  count: number;
  customQuestions?: LiveQuizQuestionItem[];
}): LiveQuizQuestionItem[] {
  const custom = options.customQuestions || [];
  const filtered = QUICK_EVAL_BANK.filter((q) => {
    if (options.gradeFilter !== 'all' && q.grade !== options.gradeFilter) return false;
    if (options.difficulty !== 'all' && q.difficulty !== options.difficulty) return false;
    return true;
  });

  const pool = filtered.length > 0 ? filtered : QUICK_EVAL_BANK;
  const shuffled = [...pool].sort(() => Math.random() - 0.5).map(toLiveQuestion);
  const neededBank = Math.max(0, options.count - custom.length);
  return [...custom, ...shuffled.slice(0, neededBank)];
}

export async function createLiveQuizSession(input: {
  title: string;
  classId?: string;
  className?: string;
  schoolId: string;
  teacherName: string;
  secondsPerQuestion: number;
  questions: LiveQuizQuestionItem[];
}): Promise<LiveQuizSession> {
  const now = Date.now();
  const id = `quiz_${now}_${Math.random().toString(36).slice(2, 6)}`;
  const pin = generateQuizPin();

  const session: LiveQuizSession = {
    id,
    pin,
    title: input.title.trim() || 'Quiz Live TIC',
    classId: input.classId || '',
    className: input.className || '',
    schoolId: input.schoolId || 'scoala_pilot_01',
    teacherName: input.teacherName.trim() || 'Profesor TIC',
    phase: 'lobby',
    currentQuestionIndex: 0,
    questionStartedAt: 0,
    secondsPerQuestion: Math.max(10, Math.min(90, input.secondsPerQuestion || 25)),
    questions: input.questions.slice(0, 30),
    gradesLogged: false,
    createdAt: now,
    updatedAt: now,
  };

  writeLocalSession(session);

  if (db && isCloudConnected) {
    try {
      await setDoc(doc(db, QUIZ_SESSIONS_COLLECTION, id), session);
    } catch (error) {
      logLiveQuizDiagnostic(error, 'create', `${QUIZ_SESSIONS_COLLECTION}/${id}`);
    }
  }

  return session;
}

export async function findLiveQuizByPin(
  rawPin: string
): Promise<{ session?: LiveQuizSession; error?: string }> {
  const cleanPin = rawPin.replace(/\D/g, '').trim();
  if (cleanPin.length < 4) {
    return { error: 'Introdu codul PIN din 6 cifre afișat pe tablă.' };
  }

  if (db && isCloudConnected) {
    try {
      const q = query(collection(db, QUIZ_SESSIONS_COLLECTION), where('pin', '==', cleanPin));
      const snap = await getDocs(q);
      const sessions: LiveQuizSession[] = [];
      snap.forEach((d) => {
        sessions.push({ id: d.id, ...(d.data() as Omit<LiveQuizSession, 'id'>) });
      });
      sessions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      const active = sessions.find((s) => s.phase !== 'finished') || sessions[0];
      if (active) {
        writeLocalSession(active);
        return { session: active };
      }
    } catch (error) {
      logLiveQuizDiagnostic(error, 'list', QUIZ_SESSIONS_COLLECTION);
    }
  }

  const localMap = readLocalSessions();
  const localMatch = Object.values(localMap)
    .filter((s) => s.pin === cleanPin)
    .sort((a, b) => b.createdAt - a.createdAt)[0];

  if (localMatch) {
    return { session: localMatch };
  }

  return {
    error: `Nu am găsit nicio sesiune Quiz Live activă pentru PIN-ul ${cleanPin}.`,
  };
}

export function subscribeLiveQuizSession(
  sessionId: string,
  onSession: (session: LiveQuizSession | null) => void
): Unsubscribe {
  let cloudUnsub: Unsubscribe | null = null;

  if (db && isCloudConnected) {
    const ref = doc(db, QUIZ_SESSIONS_COLLECTION, sessionId);
    cloudUnsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          onSession(null);
          return;
        }
        const data = { id: snap.id, ...(snap.data() as Omit<LiveQuizSession, 'id'>) };
        writeLocalSession(data);
        onSession(data);
      },
      (error) => {
        logLiveQuizDiagnostic(error, 'get', `${QUIZ_SESSIONS_COLLECTION}/${sessionId}`);
        const local = readLocalSessions()[sessionId] || null;
        onSession(local);
      }
    );
  } else {
    onSession(readLocalSessions()[sessionId] || null);
  }

  const handleStorage = () => {
    const local = readLocalSessions()[sessionId] || null;
    if (local) onSession(local);
  };

  let ch: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      ch = new BroadcastChannel(QUIZ_BROADCAST_CHANNEL);
      ch.onmessage = (ev) => {
        if (ev.data?.sessionId === sessionId) {
          handleStorage();
        }
      };
    }
  } catch {}
  window.addEventListener('storage', handleStorage);

  return () => {
    if (cloudUnsub) cloudUnsub();
    if (ch) ch.close();
    window.removeEventListener('storage', handleStorage);
  };
}

export function subscribeLiveQuizParticipants(
  sessionId: string,
  onParticipants: (players: LiveQuizParticipant[]) => void
): Unsubscribe {
  let cloudUnsub: Unsubscribe | null = null;

  const sortPlayers = (list: LiveQuizParticipant[]) =>
    [...list].sort((a, b) => b.score - a.score || b.correctCount - a.correctCount || a.joinedAt - b.joinedAt);

  if (db && isCloudConnected) {
    const q = query(
      collection(db, QUIZ_SESSIONS_COLLECTION, sessionId, QUIZ_PARTICIPANTS_SUB),
      orderBy('joinedAt', 'asc')
    );
    cloudUnsub = onSnapshot(
      q,
      (snap) => {
        const players: LiveQuizParticipant[] = [];
        snap.forEach((d) => {
          players.push({ id: d.id, ...(d.data() as Omit<LiveQuizParticipant, 'id'>) });
        });
        onParticipants(sortPlayers(players));
      },
      (error) => {
        logLiveQuizDiagnostic(
          error,
          'list',
          `${QUIZ_SESSIONS_COLLECTION}/${sessionId}/${QUIZ_PARTICIPANTS_SUB}`
        );
        onParticipants(sortPlayers(readLocalParticipants(sessionId)));
      }
    );
  } else {
    onParticipants(sortPlayers(readLocalParticipants(sessionId)));
  }

  const handleLocal = () => {
    onParticipants(sortPlayers(readLocalParticipants(sessionId)));
  };

  let ch: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      ch = new BroadcastChannel(QUIZ_BROADCAST_CHANNEL);
      ch.onmessage = (ev) => {
        if (ev.data?.sessionId === sessionId && (!db || !isCloudConnected)) {
          handleLocal();
        }
      };
    }
  } catch {}
  window.addEventListener('storage', handleLocal);

  return () => {
    if (cloudUnsub) cloudUnsub();
    if (ch) ch.close();
    window.removeEventListener('storage', handleLocal);
  };
}

function makeDeterministicPlayerId(name: string, studentId?: string): string {
  if (studentId && /^[a-zA-Z0-9_-]+$/.test(studentId)) {
    return `st_${studentId}`;
  }
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return `pl_${slug || 'elev'}_${Math.random().toString(36).slice(2, 6)}`;
}

export async function joinLiveQuizSession(
  sessionId: string,
  input: { studentId?: string; name: string; avatar: string }
): Promise<LiveQuizParticipant> {
  const cleanName = input.name.trim().slice(0, 60) || 'Elev';
  const playerId = makeDeterministicPlayerId(cleanName, input.studentId);
  const now = Date.now();

  let existing: LiveQuizParticipant | null = null;
  if (db && isCloudConnected) {
    try {
      const snap = await getDoc(
        doc(db, QUIZ_SESSIONS_COLLECTION, sessionId, QUIZ_PARTICIPANTS_SUB, playerId)
      );
      if (snap.exists()) {
        existing = { id: snap.id, ...(snap.data() as Omit<LiveQuizParticipant, 'id'>) };
      }
    } catch {}
  } else {
    existing = readLocalParticipants(sessionId).find((p) => p.id === playerId) || null;
  }

  if (existing) {
    const refreshed: LiveQuizParticipant = {
      ...existing,
      name: cleanName,
      avatar: input.avatar || existing.avatar,
      lastSeenAt: now,
    };
    writeLocalParticipant(sessionId, refreshed);
    if (db && isCloudConnected) {
      try {
        await updateDoc(
          doc(db, QUIZ_SESSIONS_COLLECTION, sessionId, QUIZ_PARTICIPANTS_SUB, playerId),
          { name: cleanName, avatar: refreshed.avatar, lastSeenAt: now }
        );
      } catch (error) {
        logLiveQuizDiagnostic(error, 'update', `${QUIZ_SESSIONS_COLLECTION}/${sessionId}/${QUIZ_PARTICIPANTS_SUB}/${playerId}`);
      }
    }
    return refreshed;
  }

  const participant: LiveQuizParticipant = {
    id: playerId,
    studentId: input.studentId || '',
    name: cleanName,
    avatar: input.avatar || '🎓',
    score: 0,
    correctCount: 0,
    streak: 0,
    answers: {},
    joinedAt: now,
    lastSeenAt: now,
  };

  writeLocalParticipant(sessionId, participant);
  if (db && isCloudConnected) {
    try {
      await setDoc(
        doc(db, QUIZ_SESSIONS_COLLECTION, sessionId, QUIZ_PARTICIPANTS_SUB, playerId),
        participant
      );
    } catch (error) {
      logLiveQuizDiagnostic(error, 'create', `${QUIZ_SESSIONS_COLLECTION}/${sessionId}/${QUIZ_PARTICIPANTS_SUB}/${playerId}`);
    }
  }

  return participant;
}

export async function submitLiveQuizAnswer(
  session: LiveQuizSession,
  participant: LiveQuizParticipant,
  questionIndex: number,
  optionIndex: number
): Promise<LiveQuizParticipant> {
  const qKey = String(questionIndex);
  if (participant.answers && participant.answers[qKey]) {
    return participant; // Idempotent guard against double submit
  }

  const question = session.questions[questionIndex];
  if (!question) return participant;

  const now = Date.now();
  const isCorrect = optionIndex === question.correctIndex;
  const elapsedMs = Math.max(0, now - (session.questionStartedAt || now));
  const maxMs = Math.max(5000, session.secondsPerQuestion * 1000);
  const speedRatio = Math.max(0, 1 - elapsedMs / maxMs);

  const nextStreak = isCorrect ? (participant.streak || 0) + 1 : 0;
  const streakBonus = isCorrect ? Math.min(200, (nextStreak - 1) * 50) : 0;
  const pointsEarned = isCorrect ? Math.round(600 + speedRatio * 400 + streakBonus) : 0;

  const record: LiveQuizAnswerRecord = {
    optionIndex,
    isCorrect,
    pointsEarned,
    answeredAt: now,
  };

  const nextAnswers = {
    ...(participant.answers || {}),
    [qKey]: record,
  };

  const updated: LiveQuizParticipant = {
    ...participant,
    score: (participant.score || 0) + pointsEarned,
    correctCount: (participant.correctCount || 0) + (isCorrect ? 1 : 0),
    streak: nextStreak,
    answers: nextAnswers,
    lastSeenAt: now,
  };

  writeLocalParticipant(session.id, updated);

  if (db && isCloudConnected) {
    try {
      await updateDoc(
        doc(db, QUIZ_SESSIONS_COLLECTION, session.id, QUIZ_PARTICIPANTS_SUB, participant.id),
        {
          score: updated.score,
          correctCount: updated.correctCount,
          streak: updated.streak,
          answers: updated.answers,
          lastSeenAt: now,
        }
      );
    } catch (error) {
      logLiveQuizDiagnostic(
        error,
        'update',
        `${QUIZ_SESSIONS_COLLECTION}/${session.id}/${QUIZ_PARTICIPANTS_SUB}/${participant.id}`
      );
    }
  }

  return updated;
}

export async function advanceLiveQuizPhase(
  session: LiveQuizSession,
  nextPhase: LiveQuizPhase,
  nextQuestionIndex?: number
): Promise<LiveQuizSession> {
  const now = Date.now();
  const qIdx =
    typeof nextQuestionIndex === 'number' ? nextQuestionIndex : session.currentQuestionIndex;
  const questionStartedAt = nextPhase === 'question' ? now : session.questionStartedAt;

  const updated: LiveQuizSession = {
    ...session,
    phase: nextPhase,
    currentQuestionIndex: qIdx,
    questionStartedAt,
    updatedAt: now,
  };

  writeLocalSession(updated);

  if (db && isCloudConnected) {
    try {
      await updateDoc(doc(db, QUIZ_SESSIONS_COLLECTION, session.id), {
        phase: nextPhase,
        currentQuestionIndex: qIdx,
        questionStartedAt,
        updatedAt: now,
      });
    } catch (error) {
      logLiveQuizDiagnostic(error, 'update', `${QUIZ_SESSIONS_COLLECTION}/${session.id}`);
    }
  }

  return updated;
}

export async function kickLiveQuizParticipant(sessionId: string, playerId: string): Promise<void> {
  deleteLocalParticipant(sessionId, playerId);
  if (db && isCloudConnected) {
    try {
      await deleteDoc(doc(db, QUIZ_SESSIONS_COLLECTION, sessionId, QUIZ_PARTICIPANTS_SUB, playerId));
    } catch (error) {
      logLiveQuizDiagnostic(
        error,
        'delete',
        `${QUIZ_SESSIONS_COLLECTION}/${sessionId}/${QUIZ_PARTICIPANTS_SUB}/${playerId}`
      );
    }
  }
}

export async function logLiveQuizGradesToCatalog(
  session: LiveQuizSession,
  participants: LiveQuizParticipant[]
): Promise<number> {
  if (session.gradesLogged || participants.length === 0) return 0;

  const totalQ = Math.max(1, session.questions.length);
  const courseTitle = `Quiz Live: ${session.title}${session.className ? ` (${session.className})` : ''}`;

  let loggedCount = 0;
  for (const p of participants) {
    const pct = Math.min(100, Math.round((p.correctCount / totalQ) * 100));
    const approxDuration = Math.max(20, Object.keys(p.answers || {}).length * 12);
    await logStudentResult(
      p.name,
      courseTitle,
      pct,
      100,
      approxDuration,
      session.schoolId
    );
    loggedCount++;
  }

  const updated = { ...session, gradesLogged: true, updatedAt: Date.now() };
  writeLocalSession(updated);
  if (db && isCloudConnected) {
    try {
      await updateDoc(doc(db, QUIZ_SESSIONS_COLLECTION, session.id), {
        gradesLogged: true,
        updatedAt: Date.now(),
      });
    } catch (error) {
      logLiveQuizDiagnostic(error, 'update', `${QUIZ_SESSIONS_COLLECTION}/${session.id}`);
    }
  }

  return loggedCount;
}
