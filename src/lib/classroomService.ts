import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, isCloudConnected } from './firebase';
import {
  AssignmentTaskItem,
  ClassAssignment,
  ClassroomGroup,
  LessonMissionState,
  StudentProfile,
} from '../types';
import { CARNET_MISSIONS, MISSION_META_BY_ID } from '../data/missionsRegistry';
import { ARCADE_REGISTRY } from '../data/arcadeRegistry';
import { SANDBOX_CHALLENGES } from '../data/sandboxChallenges';
import { StudentResult } from './resultsService';
import { computeGradeDetails } from '../utils/pedagogicalGrading';
import {
  getActiveStudent,
  saveActiveStudentLocally,
  STUDENTS_COLLECTION,
  syncProfileToLocalStorage,
} from './studentCore';
import {
  getStoredQuickEvalHistory,
  getStoredSandboxProgress,
} from './studentGamificationService';

const CLASSROOMS_COLLECTION = 'clase_grupe';
const ASSIGNMENTS_COLLECTION = 'teme_assignments';

const LOCAL_CLASSROOMS_KEY = 'arkedo_classroom_groups';
const LOCAL_ASSIGNMENTS_KEY = 'arkedo_class_assignments';
export const LOCAL_STUDENT_CLASS_KEY = 'arkedo_student_classroom_meta';

export enum ClassroomOpType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
}

function logFirestoreDiagnostics(error: unknown, operationType: ClassroomOpType, path: string): void {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth?.currentUser?.uid ?? null,
      email: auth?.currentUser?.email ?? null,
    },
  };
  console.warn('[ClassroomService] Firestore diagnostic:', JSON.stringify(errInfo));
}

function readLocalList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocalList<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

export function normalizeClassCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export function generateClassCode(gradeNum: 5 | 6 | 7 | 8, name: string): string {
  const suffix = Math.floor(100 + Math.random() * 900);
  const letterMatch = name.toUpperCase().match(/\b([A-Z])\b/);
  const section = letterMatch ? letterMatch[1] : 'X';
  return `TIC-${gradeNum}${section}-${suffix}`;
}

export function formatGradeNumLabel(gradeNum: 5 | 6 | 7 | 8, isEn = false): string {
  if (isEn) return `Grade ${gradeNum}`;
  switch (gradeNum) {
    case 5:
      return 'Clasa a V-a';
    case 6:
      return 'Clasa a VI-a';
    case 7:
      return 'Clasa a VII-a';
    case 8:
      return 'Clasa a VIII-a';
  }
}

export interface LocalStudentClassMeta {
  classId: string;
  classCode: string;
  className: string;
  schoolId: string;
  gradeNum: 5 | 6 | 7 | 8;
}

export function getStoredStudentClassMeta(): LocalStudentClassMeta | null {
  const active = getActiveStudent();
  if (active?.classId && active.classCode && active.className) {
    return {
      classId: active.classId,
      classCode: active.classCode,
      className: active.className,
      schoolId: active.schoolId || 'scoala_pilot_01',
      gradeNum: (Number((active.classGrade || '').match(/[5-8]/)?.[0]) as 5 | 6 | 7 | 8) || 5,
    };
  }
  try {
    const raw = localStorage.getItem(LOCAL_STUDENT_CLASS_KEY);
    return raw ? (JSON.parse(raw) as LocalStudentClassMeta) : null;
  } catch {
    return null;
  }
}

export function setStoredStudentClassMeta(meta: LocalStudentClassMeta | null): void {
  try {
    if (!meta) {
      localStorage.removeItem(LOCAL_STUDENT_CLASS_KEY);
    } else {
      localStorage.setItem(LOCAL_STUDENT_CLASS_KEY, JSON.stringify(meta));
    }
  } catch {}
}

// ===================== CLASSROOMS CRUD =====================

export async function getClassrooms(schoolIdFilter?: string): Promise<ClassroomGroup[]> {
  let list: ClassroomGroup[] = [];

  if (db && isCloudConnected) {
    try {
      const q = query(collection(db, CLASSROOMS_COLLECTION), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<ClassroomGroup, 'id'>) });
      });
      writeLocalList(LOCAL_CLASSROOMS_KEY, list);
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.LIST, CLASSROOMS_COLLECTION);
      list = readLocalList<ClassroomGroup>(LOCAL_CLASSROOMS_KEY);
    }
  } else {
    list = readLocalList<ClassroomGroup>(LOCAL_CLASSROOMS_KEY);
  }

  if (schoolIdFilter && schoolIdFilter !== 'all') {
    return list.filter((c) => c.schoolId === schoolIdFilter);
  }
  return list;
}

export async function createClassroom(input: {
  name: string;
  gradeNum: 5 | 6 | 7 | 8;
  schoolId: string;
  teacherName: string;
  academicYear?: string;
  customCode?: string;
}): Promise<ClassroomGroup> {
  const cleanName = input.name.trim();
  const code = normalizeClassCode(input.customCode || '') || generateClassCode(input.gradeNum, cleanName);
  const now = Date.now();
  const id = `cls_${now}_${Math.random().toString(36).slice(2, 6)}`;

  const payload: ClassroomGroup = {
    id,
    code,
    name: cleanName,
    gradeNum: input.gradeNum,
    schoolId: input.schoolId || 'scoala_pilot_01',
    teacherName: input.teacherName.trim() || 'Profesor TIC',
    academicYear: input.academicYear?.trim() || '2026-2027',
    memberUsernames: [],
    memberIds: [],
    archived: false,
    createdAt: now,
    updatedAt: now,
  };

  const existing = readLocalList<ClassroomGroup>(LOCAL_CLASSROOMS_KEY);
  writeLocalList(LOCAL_CLASSROOMS_KEY, [payload, ...existing]);

  if (db && isCloudConnected) {
    try {
      await setDoc(doc(db, CLASSROOMS_COLLECTION, id), payload);
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.CREATE, `${CLASSROOMS_COLLECTION}/${id}`);
    }
  }

  return payload;
}

export async function updateClassroom(
  classId: string,
  updates: Partial<Pick<ClassroomGroup, 'name' | 'gradeNum' | 'teacherName' | 'academicYear' | 'archived'>>
): Promise<boolean> {
  const now = Date.now();
  const local = readLocalList<ClassroomGroup>(LOCAL_CLASSROOMS_KEY);
  const nextLocal = local.map((c) => (c.id === classId ? { ...c, ...updates, updatedAt: now } : c));
  writeLocalList(LOCAL_CLASSROOMS_KEY, nextLocal);

  if (db && isCloudConnected) {
    try {
      await updateDoc(doc(db, CLASSROOMS_COLLECTION, classId), {
        ...updates,
        updatedAt: now,
      });
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.UPDATE, `${CLASSROOMS_COLLECTION}/${classId}`);
      return false;
    }
  }
  return true;
}

export async function deleteClassroom(classId: string): Promise<boolean> {
  const local = readLocalList<ClassroomGroup>(LOCAL_CLASSROOMS_KEY);
  writeLocalList(
    LOCAL_CLASSROOMS_KEY,
    local.filter((c) => c.id !== classId)
  );

  if (db && isCloudConnected) {
    try {
      await deleteDoc(doc(db, CLASSROOMS_COLLECTION, classId));
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.DELETE, `${CLASSROOMS_COLLECTION}/${classId}`);
      return false;
    }
  }
  return true;
}

export async function addStudentToClassroom(
  classroom: ClassroomGroup,
  student: StudentProfile
): Promise<ClassroomGroup> {
  const now = Date.now();
  const memberIds = Array.from(new Set([...(classroom.memberIds || []), student.id]));
  const memberUsernames = Array.from(new Set([...(classroom.memberUsernames || []), student.username]));

  const updatedClass: ClassroomGroup = {
    ...classroom,
    memberIds,
    memberUsernames,
    updatedAt: now,
  };

  const local = readLocalList<ClassroomGroup>(LOCAL_CLASSROOMS_KEY);
  const updatedLocal = local.some((c) => c.id === classroom.id)
    ? local.map((c) => (c.id === classroom.id ? updatedClass : c))
    : [updatedClass, ...local];
  writeLocalList(LOCAL_CLASSROOMS_KEY, updatedLocal);

  const gradeLabel = formatGradeNumLabel(classroom.gradeNum);

  if (db && isCloudConnected) {
    try {
      await updateDoc(doc(db, CLASSROOMS_COLLECTION, classroom.id), {
        memberIds,
        memberUsernames,
        updatedAt: now,
      });
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.UPDATE, `${CLASSROOMS_COLLECTION}/${classroom.id}`);
    }
    if (student.id) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, student.id), {
          classId: classroom.id,
          classCode: classroom.code,
          className: classroom.name,
          classGrade: gradeLabel,
          schoolId: classroom.schoolId,
        });
      } catch (error) {
        logFirestoreDiagnostics(error, ClassroomOpType.UPDATE, `${STUDENTS_COLLECTION}/${student.id}`);
      }
    }
  }

  const active = getActiveStudent();
  if (active && active.id === student.id) {
    const nextActive: StudentProfile = {
      ...active,
      classId: classroom.id,
      classCode: classroom.code,
      className: classroom.name,
      classGrade: gradeLabel,
      schoolId: classroom.schoolId,
    };
    saveActiveStudentLocally(nextActive);
    syncProfileToLocalStorage(nextActive);
  }

  return updatedClass;
}

export async function removeStudentFromClassroom(
  classroom: ClassroomGroup,
  studentId: string,
  username?: string
): Promise<ClassroomGroup> {
  const now = Date.now();
  const memberIds = (classroom.memberIds || []).filter((id) => id !== studentId);
  const memberUsernames = (classroom.memberUsernames || []).filter(
    (u) => !username || u.toLowerCase() !== username.toLowerCase()
  );

  const updatedClass: ClassroomGroup = {
    ...classroom,
    memberIds,
    memberUsernames,
    updatedAt: now,
  };

  const local = readLocalList<ClassroomGroup>(LOCAL_CLASSROOMS_KEY);
  writeLocalList(
    LOCAL_CLASSROOMS_KEY,
    local.map((c) => (c.id === classroom.id ? updatedClass : c))
  );

  if (db && isCloudConnected) {
    try {
      await updateDoc(doc(db, CLASSROOMS_COLLECTION, classroom.id), {
        memberIds,
        memberUsernames,
        updatedAt: now,
      });
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.UPDATE, `${CLASSROOMS_COLLECTION}/${classroom.id}`);
    }
    if (studentId) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, studentId), {
          classId: '',
          classCode: '',
          className: '',
        });
      } catch (error) {
        logFirestoreDiagnostics(error, ClassroomOpType.UPDATE, `${STUDENTS_COLLECTION}/${studentId}`);
      }
    }
  }

  const active = getActiveStudent();
  if (active && active.id === studentId) {
    const nextActive = { ...active, classId: '', classCode: '', className: '' };
    saveActiveStudentLocally(nextActive);
    setStoredStudentClassMeta(null);
  }

  return updatedClass;
}

export async function joinClassroomByCode(
  rawCode: string,
  student?: StudentProfile | null
): Promise<{ success: boolean; classroom?: ClassroomGroup; error?: string }> {
  const normalized = normalizeClassCode(rawCode);
  if (normalized.length < 3) {
    return { success: false, error: 'Introdu un cod de clasă valid (ex: TIC-7B-482).' };
  }

  const classrooms = await getClassrooms();
  const found = classrooms.find((c) => normalizeClassCode(c.code) === normalized && !c.archived);

  if (!found) {
    return {
      success: false,
      error: `Nu am găsit nicio clasă activă cu codul „${normalized}”. Verifică codul primit de la profesor.`,
    };
  }

  const meta: LocalStudentClassMeta = {
    classId: found.id,
    classCode: found.code,
    className: found.name,
    schoolId: found.schoolId,
    gradeNum: found.gradeNum,
  };
  setStoredStudentClassMeta(meta);

  const targetStudent = student ?? getActiveStudent();
  if (targetStudent) {
    const updated = await addStudentToClassroom(found, targetStudent);
    return { success: true, classroom: updated };
  }

  return { success: true, classroom: found };
}

// ===================== ASSIGNMENTS CRUD & AUTO-EVALUATION =====================

export async function getAssignments(filters?: {
  schoolId?: string;
  classId?: string;
}): Promise<ClassAssignment[]> {
  let list: ClassAssignment[] = [];

  if (db && isCloudConnected) {
    try {
      const q = query(collection(db, ASSIGNMENTS_COLLECTION), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<ClassAssignment, 'id'>) });
      });
      writeLocalList(LOCAL_ASSIGNMENTS_KEY, list);
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.LIST, ASSIGNMENTS_COLLECTION);
      list = readLocalList<ClassAssignment>(LOCAL_ASSIGNMENTS_KEY);
    }
  } else {
    list = readLocalList<ClassAssignment>(LOCAL_ASSIGNMENTS_KEY);
  }

  return list.filter((a) => {
    if (filters?.schoolId && filters.schoolId !== 'all' && a.schoolId !== filters.schoolId) {
      return false;
    }
    if (filters?.classId && filters.classId !== 'all' && a.classId !== filters.classId && a.classId !== 'ALL') {
      return false;
    }
    return true;
  });
}

export async function getAssignmentsForStudent(
  profile: StudentProfile | null
): Promise<ClassAssignment[]> {
  const meta = getStoredStudentClassMeta();
  const classId = profile?.classId || meta?.classId || '';
  const schoolId = profile?.schoolId || meta?.schoolId || '';

  const all = await getAssignments();
  return all.filter((a) => {
    if (classId && a.classId === classId) return true;
    if (a.classId === 'ALL' && (!schoolId || a.schoolId === schoolId)) return true;
    return false;
  });
}

export async function createAssignment(input: {
  title: string;
  description?: string;
  classId: string;
  className: string;
  schoolId: string;
  teacherName: string;
  dueDate: string;
  tasks: AssignmentTaskItem[];
}): Promise<ClassAssignment> {
  const now = Date.now();
  const id = `tema_${now}_${Math.random().toString(36).slice(2, 6)}`;
  const payload: ClassAssignment = {
    id,
    title: input.title.trim(),
    description: (input.description || '').trim(),
    classId: input.classId,
    className: input.className,
    schoolId: input.schoolId || 'scoala_pilot_01',
    teacherName: input.teacherName.trim() || 'Profesor TIC',
    dueDate: input.dueDate,
    status: 'active',
    tasks: input.tasks,
    createdAt: now,
    updatedAt: now,
  };

  const local = readLocalList<ClassAssignment>(LOCAL_ASSIGNMENTS_KEY);
  writeLocalList(LOCAL_ASSIGNMENTS_KEY, [payload, ...local]);

  if (db && isCloudConnected) {
    try {
      await setDoc(doc(db, ASSIGNMENTS_COLLECTION, id), payload);
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.CREATE, `${ASSIGNMENTS_COLLECTION}/${id}`);
    }
  }

  return payload;
}

export async function updateAssignmentStatus(
  assignmentId: string,
  status: 'active' | 'closed'
): Promise<boolean> {
  const now = Date.now();
  const local = readLocalList<ClassAssignment>(LOCAL_ASSIGNMENTS_KEY);
  writeLocalList(
    LOCAL_ASSIGNMENTS_KEY,
    local.map((a) => (a.id === assignmentId ? { ...a, status, updatedAt: now } : a))
  );

  if (db && isCloudConnected) {
    try {
      await updateDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId), {
        status,
        updatedAt: now,
      });
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.UPDATE, `${ASSIGNMENTS_COLLECTION}/${assignmentId}`);
      return false;
    }
  }
  return true;
}

export async function deleteAssignment(assignmentId: string): Promise<boolean> {
  const local = readLocalList<ClassAssignment>(LOCAL_ASSIGNMENTS_KEY);
  writeLocalList(
    LOCAL_ASSIGNMENTS_KEY,
    local.filter((a) => a.id !== assignmentId)
  );

  if (db && isCloudConnected) {
    try {
      await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId));
    } catch (error) {
      logFirestoreDiagnostics(error, ClassroomOpType.DELETE, `${ASSIGNMENTS_COLLECTION}/${assignmentId}`);
      return false;
    }
  }
  return true;
}

export interface EvaluatedTaskStatus {
  task: AssignmentTaskItem;
  completed: boolean;
  inProgress: boolean;
  currentValueLabel: string;
}

export interface EvaluatedAssignmentStatus {
  assignment: ClassAssignment;
  completedCount: number;
  totalCount: number;
  percentage: number;
  isAllCompleted: boolean;
  isOverdue: boolean;
  isDueSoon: boolean;
  taskStatuses: EvaluatedTaskStatus[];
}

export function evaluateAssignmentTaskForStudent(
  task: AssignmentTaskItem,
  profile: StudentProfile | null,
  readLocalFallback = false
): EvaluatedTaskStatus {
  if (task.type === 'mission' && task.missionId) {
    const meta = MISSION_META_BY_ID[task.missionId];
    const lp = profile?.lessonsProgress as unknown as
      | Record<string, LessonMissionState | undefined>
      | undefined;
    const cloudEntry = meta ? lp?.[meta.lessonsKey] : undefined;

    let level = cloudEntry?.level || 1;
    let score = cloudEntry?.score || 0;
    let completedFlag = Boolean(cloudEntry?.completed);

    if (readLocalFallback && meta) {
      try {
        const lsCompleted = localStorage.getItem(`arkedo_completed_${meta.id}`) === 'true';
        const lsLevel = Number(localStorage.getItem(`arkedo_${meta.localPrefix}_level`) || '1');
        const lsScore = Number(localStorage.getItem(`arkedo_${meta.localPrefix}_score`) || '0');
        const legacyLevel = meta.legacyLocalPrefix
          ? Number(localStorage.getItem(`arkedo_${meta.legacyLocalPrefix}_level`) || '1')
          : 1;
        const legacyScore = meta.legacyLocalPrefix
          ? Number(localStorage.getItem(`arkedo_${meta.legacyLocalPrefix}_score`) || '0')
          : 0;
        level = Math.max(level, lsLevel, legacyLevel);
        score = Math.max(score, lsScore, legacyScore);
        completedFlag = completedFlag || lsCompleted || level > meta.maxLevels;
      } catch {}
    }

    const minScore = task.minScore ?? 70;
    const finalScore = completedFlag && score === 0 ? 100 : score;
    const completed = completedFlag && finalScore >= minScore;
    const inProgress = !completed && (level > 1 || finalScore > 0);

    return {
      task,
      completed,
      inProgress,
      currentValueLabel: completed
        ? `${finalScore}/100`
        : inProgress
        ? `Niv. ${Math.min(level, meta?.maxLevels ?? 7)}/${meta?.maxLevels ?? 7}`
        : 'Neînceput',
    };
  }

  if (task.type === 'sandbox' && task.challengeId) {
    const solvedIds = profile?.sandboxProgress?.solvedIds
      ? profile.sandboxProgress.solvedIds
      : readLocalFallback
      ? getStoredSandboxProgress().solvedIds
      : [];
    const completed = solvedIds.includes(task.challengeId);
    const hasSnippet = Boolean(
      profile?.sandboxProgress?.snippets?.[task.challengeId] ||
        (readLocalFallback && getStoredSandboxProgress().snippets?.[task.challengeId])
    );

    return {
      task,
      completed,
      inProgress: !completed && hasSnippet,
      currentValueLabel: completed ? 'Rezolvat ✓' : hasSnippet ? 'În lucru' : 'Neînceput',
    };
  }

  if (task.type === 'eval') {
    const history = profile?.quickEvalHistory
      ? profile.quickEvalHistory
      : readLocalFallback
      ? getStoredQuickEvalHistory()
      : [];
    const matching = history.filter((h) => {
      if (!task.evalGrade || task.evalGrade === 'all') return true;
      return h.gradeFilter === task.evalGrade || h.gradeFilter === 'all';
    });
    const bestNota = matching.reduce((max, item) => Math.max(max, item.nota || 0), 0);
    const targetNota = task.minNota ?? 7;
    const completed = bestNota >= targetNota;

    return {
      task,
      completed,
      inProgress: !completed && matching.length > 0,
      currentValueLabel:
        matching.length > 0 ? `Nota ${bestNota.toFixed(1)} (țintă ${targetNota})` : 'Nefăcut',
    };
  }

  if (task.type === 'arcade' && task.gameKey) {
    const arcScores = (profile?.arcadeScores || {}) as unknown as Record<string, number | undefined>;
    let best = Number(arcScores[task.gameKey] || 0);
    if (readLocalFallback) {
      const reg = ARCADE_REGISTRY.find((g) => g.scoreKey === task.gameKey);
      if (reg) {
        try {
          best = Math.max(best, Number(localStorage.getItem(reg.localStorageKey) || '0') || 0);
        } catch {}
      }
    }
    const target = task.minArcadeScore ?? 100;
    const completed = best >= target;
    return {
      task,
      completed,
      inProgress: !completed && best > 0,
      currentValueLabel: best > 0 ? `${best} / ${target}` : 'Neînceput',
    };
  }

  return {
    task,
    completed: false,
    inProgress: false,
    currentValueLabel: '—',
  };
}

export function evaluateAssignmentForStudent(
  assignment: ClassAssignment,
  profile: StudentProfile | null,
  readLocalFallback = false
): EvaluatedAssignmentStatus {
  const taskStatuses = (assignment.tasks || []).map((t) =>
    evaluateAssignmentTaskForStudent(t, profile, readLocalFallback)
  );
  const completedCount = taskStatuses.filter((t) => t.completed).length;
  const totalCount = Math.max(1, taskStatuses.length);
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isAllCompleted = completedCount === taskStatuses.length && taskStatuses.length > 0;

  const nowMs = Date.now();
  const dueMs = new Date(assignment.dueDate).getTime();
  const hasValidDue = !Number.isNaN(dueMs);
  const isOverdue = hasValidDue && dueMs < nowMs && !isAllCompleted;
  const isDueSoon =
    hasValidDue && dueMs >= nowMs && dueMs - nowMs <= 48 * 3600 * 1000 && !isAllCompleted;

  return {
    assignment,
    completedCount,
    totalCount,
    percentage,
    isAllCompleted,
    isOverdue,
    isDueSoon,
    taskStatuses,
  };
}

// ===================== ROSTER ANALYTICS & CSV EXPORT =====================

export interface StudentRosterMetrics {
  student: StudentProfile;
  completedMissions: number;
  totalMissions: number;
  averageGrade: number; // 1..10
  quickEvalAvg: number;
  quickEvalCount: number;
  sandboxSolvedCount: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  assignmentsPct: number;
  streakCurrent: number;
  streakBest: number;
  resultsCount: number;
  totalXP: number;
}

export function computeClassRosterAnalytics(
  classroom: ClassroomGroup | null,
  allStudents: StudentProfile[],
  allResults: StudentResult[],
  assignments: ClassAssignment[]
): {
  roster: StudentRosterMetrics[];
  classAvgGrade: number;
  activeTodayCount: number;
  avgAssignmentsPct: number;
  totalClassXP: number;
} {
  const members = classroom
    ? allStudents.filter(
        (s) =>
          s.classId === classroom.id ||
          (classroom.memberIds || []).includes(s.id) ||
          (classroom.memberUsernames || []).some(
            (u) => u.toLowerCase() === (s.username || '').toLowerCase()
          )
      )
    : allStudents;

  const classAssignments = classroom
    ? assignments.filter((a) => a.classId === classroom.id || a.classId === 'ALL')
    : assignments;

  const todayIso = new Date().toISOString().slice(0, 10);

  const roster: StudentRosterMetrics[] = members.map((student) => {
    const lp = (student.lessonsProgress || {}) as unknown as Record<
      string,
      LessonMissionState | undefined
    >;

    const completedEntries = CARNET_MISSIONS.map((m) => lp[m.lessonsKey]).filter(
      (entry) => Boolean(entry?.completed)
    ) as LessonMissionState[];

    const completedMissions = completedEntries.length;
    const studentResults = allResults.filter(
      (r) => (r.studentName || '').trim().toLowerCase() === (student.username || '').trim().toLowerCase()
    );

    let avgGrade = 0;
    if (completedEntries.length > 0) {
      const sumNotas = completedEntries.reduce((acc, entry) => {
        const score = entry.score > 0 ? entry.score : 100;
        return acc + computeGradeDetails(score, 100).grade;
      }, 0);
      avgGrade = Math.round((sumNotas / completedEntries.length) * 100) / 100;
    } else if (studentResults.length > 0) {
      const sumNotas = studentResults.reduce(
        (acc, r) => acc + computeGradeDetails(r.score, r.maxScore || 100).grade,
        0
      );
      avgGrade = Math.round((sumNotas / studentResults.length) * 100) / 100;
    }

    const qHistory = student.quickEvalHistory || [];
    const quickEvalAvg =
      qHistory.length > 0
        ? Math.round((qHistory.reduce((a, b) => a + (b.nota || 0), 0) / qHistory.length) * 100) /
          100
        : 0;

    const evaluatedAssgns = classAssignments.map((a) =>
      evaluateAssignmentForStudent(a, student, false)
    );
    const assignmentsCompleted = evaluatedAssgns.filter((e) => e.isAllCompleted).length;
    const assignmentsTotal = classAssignments.length;
    const assignmentsPct =
      assignmentsTotal > 0 ? Math.round((assignmentsCompleted / assignmentsTotal) * 100) : 100;

    return {
      student,
      completedMissions,
      totalMissions: CARNET_MISSIONS.length,
      averageGrade: avgGrade,
      quickEvalAvg,
      quickEvalCount: qHistory.length,
      sandboxSolvedCount: student.sandboxProgress?.solvedIds?.length || 0,
      assignmentsCompleted,
      assignmentsTotal,
      assignmentsPct,
      streakCurrent: student.dailyStreak?.current || 0,
      streakBest: student.dailyStreak?.best || 0,
      resultsCount: studentResults.length,
      totalXP: student.totalXP || 0,
    };
  });

  roster.sort((a, b) => a.student.username.localeCompare(b.student.username, 'ro'));

  const gradedStudents = roster.filter((r) => r.averageGrade > 0);
  const classAvgGrade =
    gradedStudents.length > 0
      ? Math.round(
          (gradedStudents.reduce((acc, r) => acc + r.averageGrade, 0) / gradedStudents.length) * 100
        ) / 100
      : 0;

  const activeTodayCount = roster.filter(
    (r) => r.student.dailyStreak?.lastActiveDate === todayIso
  ).length;

  const avgAssignmentsPct =
    roster.length > 0
      ? Math.round(roster.reduce((acc, r) => acc + r.assignmentsPct, 0) / roster.length)
      : 0;

  const totalClassXP = roster.reduce((acc, r) => acc + r.totalXP, 0);

  return {
    roster,
    classAvgGrade,
    activeTodayCount,
    avgAssignmentsPct,
    totalClassXP,
  };
}

export function exportCsvFile(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number>>
): void {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (/[",;\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + lines], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getSandboxChallengeLabel(challengeId: string, isEn = false): string {
  const found = SANDBOX_CHALLENGES.find((c) => c.id === challengeId);
  if (!found) return challengeId;
  return isEn ? found.titleEn : found.titleRo;
}
