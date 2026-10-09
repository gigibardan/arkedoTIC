import { db, isCloudConnected } from './firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { School } from '../types';

const LOCAL_SCHOOLS_KEY = 'arkedo_local_schools';
const TEACHER_SELECTED_SCHOOL_KEY = 'arkedo_teacher_selected_school_id';

export const DEFAULT_SCHOOL: School = {
  id: 'scoala_pilot_01',
  name: 'Liceul Tehnologic „Spiru Haret”',
  code: 'SPIRU-01',
  city: 'București',
  active: true,
  createdAt: 1711900000000,
  notes: 'Școală pilot pentru modulele TIC și Arcade'
};

const DEFAULT_SCHOOLS: School[] = [
  DEFAULT_SCHOOL,
  {
    id: 'scoala_pilot_02',
    name: 'Școala Gimnazială Nr. 19',
    code: 'GIMN-19',
    city: 'Timișoara',
    active: true,
    createdAt: 1712500000000,
    notes: 'Clasele V-VIII TIC'
  },
  {
    id: 'scoala_pilot_03',
    name: 'Colegiul Național „Emil Racoviță”',
    code: 'RACOV-03',
    city: 'Cluj-Napoca',
    active: true,
    createdAt: 1713000000000,
    notes: 'Laborator Informatică & Robotică'
  }
];

/**
 * Returns the list of active schools
 */
export async function getActiveSchools(): Promise<School[]> {
  if (db && isCloudConnected) {
    try {
      const q = query(collection(db, 'scoli'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const list: School[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      if (list.length > 0) {
        localStorage.setItem(LOCAL_SCHOOLS_KEY, JSON.stringify(list));
        return list.filter(s => s.active !== false);
      }
    } catch (e) {
      console.warn('[SchoolService] Cloud fetch failed, falling back to local:', e);
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_SCHOOLS_KEY);
    if (local) {
      const parsed: School[] = JSON.parse(local);
      if (parsed.length > 0) return parsed.filter(s => s.active !== false);
    }
  } catch {}

  localStorage.setItem(LOCAL_SCHOOLS_KEY, JSON.stringify(DEFAULT_SCHOOLS));
  return DEFAULT_SCHOOLS;
}

/**
 * Returns a school by ID
 */
export async function getSchoolById(schoolId?: string): Promise<School | undefined> {
  if (!schoolId) return DEFAULT_SCHOOL;
  const list = await getActiveSchools();
  const found = list.find(s => s.id === schoolId || s.code.toUpperCase() === schoolId.toUpperCase());
  return found || DEFAULT_SCHOOL;
}

/**
 * Get current teacher's selected school filter or ID
 */
export function getTeacherSelectedSchoolId(): string {
  try {
    return localStorage.getItem(TEACHER_SELECTED_SCHOOL_KEY) || 'all';
  } catch {
    return 'all';
  }
}

/**
 * Persist current teacher's selected school
 */
export function setTeacherSelectedSchoolId(schoolId: string): void {
  try {
    localStorage.setItem(TEACHER_SELECTED_SCHOOL_KEY, schoolId);
  } catch {}
}
