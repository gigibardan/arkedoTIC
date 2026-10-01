import {
  CyberCityData,
  CityBuilding,
  CityIncident,
  StudentProfile,
} from '../types';
import { BUILDING_CATALOG, calculateCityMetrics } from './cyberCityCatalog';
import {
  getActiveStudent,
  saveActiveStudentLocally,
  getByteCoins,
  addByteCoins,
} from './studentAuthService';
import { db, isCloudConnected } from './firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';

const LOCAL_CITY_KEY = 'arkedo_cyber_city_data';
const STUDENTS_COLLECTION = 'elevi';
const HIDE_DEMO_CITIES_KEY = 'arkedo_hide_demo_cities';

export const DEFAULT_STARTER_CITY: CyberCityData = {
  id: 'city_default',
  studentId: 'local_student',
  studentName: 'Campion TIC',
  cityName: 'Neo-Arkedo Metropolis',
  gridSize: 5, // 5x5 = 25 plots
  buildings: {
    // 3 starter buildings on the center grid
    6: {
      tileIndex: 6,
      typeId: 'solar_matrix',
      level: 1,
      builtAt: Date.now() - 3600000,
      lastUpgradedAt: Date.now() - 3600000,
    },
    7: {
      tileIndex: 7,
      typeId: 'datacenter',
      level: 1,
      builtAt: Date.now() - 7200000,
      lastUpgradedAt: Date.now() - 7200000,
    },
    12: {
      tileIndex: 12,
      typeId: 'robotics_academy',
      level: 1,
      builtAt: Date.now() - 10800000,
      lastUpgradedAt: Date.now() - 10800000,
    },
    17: {
      tileIndex: 17,
      typeId: '5g_tower',
      level: 1,
      builtAt: Date.now() - 5400000,
      lastUpgradedAt: Date.now() - 5400000,
    },
  },
  likesCount: 5,
  totalUpgradesDone: 0,
  resolvedIncidentsCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// GET CITY DATA
export function getCyberCityData(): CyberCityData {
  const current = getActiveStudent();
  if (current?.cyberCity) {
    return current.cyberCity;
  }

  try {
    const saved = localStorage.getItem(LOCAL_CITY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as CyberCityData;
      if (current) {
        parsed.studentId = current.id || current.username;
        parsed.studentName = current.username || 'Campion TIC';
      }
      return parsed;
    }
  } catch {
    // Fallback
  }

  const starter = { ...DEFAULT_STARTER_CITY };
  if (current) {
    starter.studentId = current.id || current.username;
    starter.studentName = current.username || 'Campion TIC';
    starter.cityName = `Metropola lui ${current.username}`;
  }
  return starter;
}

// SAVE CITY DATA (Sparsely to Firestore on major actions)
export async function saveCyberCityData(city: CyberCityData): Promise<void> {
  const updatedCity: CyberCityData = {
    ...city,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_CITY_KEY, JSON.stringify(updatedCity));
  } catch {
    // Ignore
  }

  const current = getActiveStudent();
  if (current) {
    const updatedProfile: StudentProfile = {
      ...current,
      cyberCity: updatedCity,
      lastActiveAt: new Date().toISOString(),
    };
    saveActiveStudentLocally(updatedProfile);

    if (isCloudConnected && db && current.id) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          cyberCity: updatedCity,
          lastActiveAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('⚠️ Eroare sincronizare CyberCity în Firestore:', err);
      }
    }
  }
}

// CONSTRUCT BUILDING
export async function constructBuilding(
  tileIndex: number,
  typeId: string
): Promise<{ success: boolean; error?: string; updatedCity?: CyberCityData; newCoins?: number }> {
  const def = BUILDING_CATALOG.find((d) => d.id === typeId);
  if (!def) {
    return { success: false, error: 'Tipul de clădire nu există în catalog.' };
  }

  const city = getCyberCityData();
  const maxTiles = city.gridSize * city.gridSize;
  if (tileIndex < 0 || tileIndex >= maxTiles) {
    return { success: false, error: 'Parcela selectată este în afara orașului.' };
  }

  if (city.buildings[tileIndex]) {
    return { success: false, error: 'Această parcelă este deja ocupată de o clădire.' };
  }

  const coins = getByteCoins();
  const cost = def.baseCost;
  if (coins < cost) {
    return {
      success: false,
      error: `Ai nevoie de ${cost} ByteCoins (deții doar ${coins} ByteCoins). Rezolvă lecții sau jocuri pentru a câștiga monede!`,
    };
  }

  // Deduct coins
  const remainingCoins = await addByteCoins(-cost, `Construcție ${def.nameRo}`);

  const newBuilding: CityBuilding = {
    tileIndex,
    typeId,
    level: 1,
    builtAt: Date.now(),
    lastUpgradedAt: Date.now(),
  };

  const updatedBuildings = {
    ...city.buildings,
    [tileIndex]: newBuilding,
  };

  const updatedCity: CyberCityData = {
    ...city,
    buildings: updatedBuildings,
    totalUpgradesDone: city.totalUpgradesDone + 1,
  };

  await saveCyberCityData(updatedCity);

  return {
    success: true,
    updatedCity,
    newCoins: remainingCoins,
  };
}

// UPGRADE BUILDING
export async function upgradeBuilding(
  tileIndex: number
): Promise<{ success: boolean; error?: string; updatedCity?: CyberCityData; newCoins?: number; newLevel?: number }> {
  const city = getCyberCityData();
  const building = city.buildings[tileIndex];
  if (!building) {
    return { success: false, error: 'Nu există nicio clădire pe această parcelă.' };
  }

  const def = BUILDING_CATALOG.find((d) => d.id === building.typeId);
  if (!def) {
    return { success: false, error: 'Datele clădirii nu au fost găsite.' };
  }

  if (building.level >= 5) {
    return { success: false, error: 'Această clădire a atins deja Nivelul Maxim (Nivel 5 Quantum)!' };
  }

  const nextLevel = building.level + 1;
  const nextLvlData = def.levels.find((l) => l.level === nextLevel);
  const cost = nextLvlData ? nextLvlData.cost : def.baseCost * nextLevel;

  const coins = getByteCoins();
  if (coins < cost) {
    return {
      success: false,
      error: `Ai nevoie de ${cost} ByteCoins pentru Nivelul ${nextLevel} (deții doar ${coins} ByteCoins).`,
    };
  }

  // Deduct coins
  const remainingCoins = await addByteCoins(-cost, `Modernizare ${def.nameRo} la Nivelul ${nextLevel}`);

  const updatedBuilding: CityBuilding = {
    ...building,
    level: nextLevel,
    lastUpgradedAt: Date.now(),
  };

  const updatedCity: CyberCityData = {
    ...city,
    buildings: {
      ...city.buildings,
      [tileIndex]: updatedBuilding,
    },
    totalUpgradesDone: city.totalUpgradesDone + 1,
  };

  await saveCyberCityData(updatedCity);

  return {
    success: true,
    updatedCity,
    newCoins: remainingCoins,
    newLevel: nextLevel,
  };
}

// DEMOLISH / RELOCATE BUILDING
export async function demolishBuilding(
  tileIndex: number
): Promise<{ success: boolean; error?: string; updatedCity?: CyberCityData; refundedCoins?: number }> {
  const city = getCyberCityData();
  const building = city.buildings[tileIndex];
  if (!building) {
    return { success: false, error: 'Nu există nicio clădire de demolat pe această parcelă.' };
  }

  const def = BUILDING_CATALOG.find((d) => d.id === building.typeId);
  const refund = def ? Math.round(def.baseCost * 0.4 * building.level) : 30;

  await addByteCoins(refund, `Reciclare materiale demolare`);

  const nextBuildings = { ...city.buildings };
  delete nextBuildings[tileIndex];

  const updatedCity: CyberCityData = {
    ...city,
    buildings: nextBuildings,
  };

  await saveCyberCityData(updatedCity);

  return {
    success: true,
    updatedCity,
    refundedCoins: refund,
  };
}

// RENAME CITY
export async function renameCyberCity(
  newName: string
): Promise<{ success: boolean; error?: string; updatedCity?: CyberCityData }> {
  const clean = newName.trim();
  if (clean.length < 3) {
    return { success: false, error: 'Numele orașului trebuie să conțină minim 3 caractere.' };
  }

  const city = getCyberCityData();
  const updatedCity: CyberCityData = {
    ...city,
    cityName: clean,
  };

  await saveCyberCityData(updatedCity);
  return { success: true, updatedCity };
}

// RESOLVE AN INCIDENT
export async function resolveCityIncident(
  incidentId: string
): Promise<{ success: boolean; error?: string; rewardCoins?: number; updatedCity?: CyberCityData }> {
  const city = getCyberCityData();
  const incident = city.activeIncidents?.find((inc) => inc.id === incidentId);

  if (!incident) {
    return { success: false, error: 'Incidentul a fost deja soluționat sau a expirat.' };
  }

  const reward = incident.rewardCoins || 50;
  await addByteCoins(reward, `Soluționare ${incident.titleRo}`);

  const remaining = (city.activeIncidents || []).filter((inc) => inc.id !== incidentId);
  const updatedCity: CyberCityData = {
    ...city,
    activeIncidents: remaining,
    resolvedIncidentsCount: (city.resolvedIncidentsCount || 0) + 1,
  };

  await saveCyberCityData(updatedCity);

  return {
    success: true,
    rewardCoins: reward,
    updatedCity,
  };
}

// SPAWN RANDOM INCIDENT (Every few minutes if city has buildings)
export function spawnRandomCityIncident(currentCity: CyberCityData): CyberCityData {
  const buildingKeys = Object.keys(currentCity.buildings).map(Number);
  if (buildingKeys.length === 0) return currentCity;

  if (currentCity.activeIncidents && currentCity.activeIncidents.length >= 2) {
    return currentCity;
  }

  const randomTile = buildingKeys[Math.floor(Math.random() * buildingKeys.length)];
  const incidentTypes: Array<{
    type: CityIncident['type'];
    titleRo: string;
    titleEn: string;
    descRo: string;
    descEn: string;
    coins: number;
    xp: number;
  }> = [
    {
      type: 'traffic_spike',
      titleRo: '⚡ Vârf de Trafic Festival eSports',
      titleEn: '⚡ eSports Gaming Traffic Surge',
      descRo: 'Mii de cetățeni transmit live! Redirecționează lățimea de bandă pentru a preveni căderea serverelor.',
      descEn: 'High-bandwidth streaming spike detected across your central cloud node.',
      coins: 60,
      xp: 40,
    },
    {
      type: 'phishing_threat',
      titleRo: '🚨 Tentativă de Phishing Blocată',
      titleEn: '🚨 Phishing Infiltration Blocked',
      descRo: 'Un bot rău intenționat a trimis email-uri capcană. Activează filtrul antispam pentru a proteja școala!',
      descEn: 'Suspicious email payloads quarantined by your firewall grid.',
      coins: 80,
      xp: 50,
    },
    {
      type: 'data_recovery',
      titleRo: '💾 Fragment de Cod Istoric Recuperat',
      titleEn: '💾 Historic Source Code Recovered',
      descRo: 'O arhivă veche de dischete a fost decriptată cu succes în laborator!',
      descEn: 'Restored lost binary sectors from a legacy disk array.',
      coins: 70,
      xp: 45,
    },
    {
      type: 'eco_audit',
      titleRo: '🌿 Audit de Eficiență Energetică',
      titleEn: '🌿 Green Energy Efficiency Audit',
      descRo: 'Panourile solare și reactoarele curate au redus amprenta de carbon a metropolei cu 30%!',
      descEn: 'Clean energy transition milestone achieved with zero carbon waste.',
      coins: 90,
      xp: 60,
    },
  ];

  const template = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
  const newIncident: CityIncident = {
    id: 'inc_' + Math.random().toString(36).substring(2, 9),
    type: template.type,
    titleRo: template.titleRo,
    titleEn: template.titleEn,
    descRo: template.descRo,
    descEn: template.descEn,
    tileIndex: randomTile,
    rewardCoins: template.coins,
    rewardXP: template.xp,
    expiresAt: Date.now() + 180000, // 3 minutes
  };

  const updatedCity: CyberCityData = {
    ...currentCity,
    activeIncidents: [...(currentCity.activeIncidents || []), newIncident],
  };

  saveCyberCityData(updatedCity);
  return updatedCity;
}

// THE 4 DEMO CITIES (Pre-configured architecture models)
export const FOUR_DEMO_CITIES: CyberCityData[] = [
  {
    id: 'city_demo_alex',
    studentId: 'demo_alex',
    studentName: 'Alexandru P. [DEMO]',
    cityName: 'Quantum Silicon Valley [DEMO]',
    gridSize: 5,
    isDemo: true,
    demoLabelRo: 'Model Demonstrativ (Temporar)',
    demoLabelEn: 'Demo Model (Temporary)',
    buildings: {
      2: { tileIndex: 2, typeId: 'fusion_reactor', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      7: { tileIndex: 7, typeId: 'ai_lab', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      8: { tileIndex: 8, typeId: 'datacenter', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      12: { tileIndex: 12, typeId: '5g_tower', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      13: { tileIndex: 13, typeId: 'robotics_academy', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      18: { tileIndex: 18, typeId: 'cyber_park', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      22: { tileIndex: 22, typeId: 'firewall_tower', level: 2, builtAt: 0, lastUpgradedAt: 0 },
    },
    likesCount: 24,
    totalUpgradesDone: 18,
    resolvedIncidentsCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city_demo_maria',
    studentId: 'demo_maria',
    studentName: 'Maria C. [DEMO]',
    cityName: 'Cyber-Bio Oasis 2099 [DEMO]',
    gridSize: 5,
    isDemo: true,
    demoLabelRo: 'Model Demonstrativ (Temporar)',
    demoLabelEn: 'Demo Model (Temporary)',
    buildings: {
      6: { tileIndex: 6, typeId: 'solar_matrix', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      7: { tileIndex: 7, typeId: 'cyber_park', level: 5, builtAt: 0, lastUpgradedAt: 0 },
      11: { tileIndex: 11, typeId: 'retro_museum', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      12: { tileIndex: 12, typeId: 'datacenter', level: 2, builtAt: 0, lastUpgradedAt: 0 },
      17: { tileIndex: 17, typeId: 'fiber_hub', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      18: { tileIndex: 18, typeId: 'antivirus_lab', level: 3, builtAt: 0, lastUpgradedAt: 0 },
    },
    likesCount: 31,
    totalUpgradesDone: 20,
    resolvedIncidentsCount: 15,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city_demo_matei',
    studentId: 'demo_matei',
    studentName: 'Matei V. [DEMO]',
    cityName: 'Robo-Citadel Alpha [DEMO]',
    gridSize: 5,
    isDemo: true,
    demoLabelRo: 'Model Demonstrativ (Temporar)',
    demoLabelEn: 'Demo Model (Temporary)',
    buildings: {
      0: { tileIndex: 0, typeId: 'firewall_tower', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      4: { tileIndex: 4, typeId: 'antivirus_lab', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      6: { tileIndex: 6, typeId: 'datacenter', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      8: { tileIndex: 8, typeId: 'chip_foundry', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      12: { tileIndex: 12, typeId: 'ai_lab', level: 3, builtAt: 0, lastUpgradedAt: 0 },
      16: { tileIndex: 16, typeId: 'fusion_reactor', level: 2, builtAt: 0, lastUpgradedAt: 0 },
      24: { tileIndex: 24, typeId: '5g_tower', level: 3, builtAt: 0, lastUpgradedAt: 0 },
    },
    likesCount: 19,
    totalUpgradesDone: 23,
    resolvedIncidentsCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city_demo_daria',
    studentId: 'demo_daria',
    studentName: 'Daria T. [DEMO]',
    cityName: 'Eco-HyperNet Neo-Tokyo [DEMO]',
    gridSize: 5,
    isDemo: true,
    demoLabelRo: 'Model Demonstrativ (Temporar)',
    demoLabelEn: 'Demo Model (Temporary)',
    buildings: {
      1: { tileIndex: 1, typeId: 'solar_matrix', level: 5, builtAt: 0, lastUpgradedAt: 0 },
      3: { tileIndex: 3, typeId: 'fiber_hub', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      7: { tileIndex: 7, typeId: 'robotics_academy', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      11: { tileIndex: 11, typeId: 'datacenter', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      13: { tileIndex: 13, typeId: 'chip_foundry', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      17: { tileIndex: 17, typeId: 'cyber_park', level: 4, builtAt: 0, lastUpgradedAt: 0 },
      23: { tileIndex: 23, typeId: 'fusion_reactor', level: 3, builtAt: 0, lastUpgradedAt: 0 },
    },
    likesCount: 27,
    totalUpgradesDone: 21,
    resolvedIncidentsCount: 14,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to check if demo cities should be hidden
export function areDemoCitiesHidden(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(HIDE_DEMO_CITIES_KEY) === 'true';
}

// Helper to toggle demo cities visibility
export function setHideDemoCities(hide: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HIDE_DEMO_CITIES_KEY, hide ? 'true' : 'false');
}

// LOAD ALL CLASSMATE CITIES FOR SHOWCASE
export async function loadClassmateCities(): Promise<CyberCityData[]> {
  const currentCity = getCyberCityData();
  const hideDemos = areDemoCitiesHidden();
  const cloudCities: CyberCityData[] = [];

  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION), limit(50));
      const snap = await getDocs(q);

      snap.forEach((d) => {
        const data = d.data();
        if (data.cyberCity && data.cyberCity.cityName) {
          cloudCities.push({
            ...data.cyberCity,
            studentName: data.username || data.cyberCity.studentName || 'Elev TIC',
            isDemo: false,
          });
        }
      });
    } catch (err) {
      console.warn('Eroare încărcare orașe din cloud:', err);
    }
  }

  // Filter out current student to avoid duplication
  const otherRealCities = cloudCities.filter((c) => c.studentId !== currentCity.studentId);

  // If demo cities are hidden and we have other real cities, show only real
  if (hideDemos) {
    return [currentCity, ...otherRealCities];
  }

  // Otherwise, present real cities + the 4 demo models clearly flagged as DEMO
  return [currentCity, ...otherRealCities, ...FOUR_DEMO_CITIES];
}

export interface TeacherCitySummary {
  city: CyberCityData;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  isDemo: boolean;
  metrics: ReturnType<typeof calculateCityMetrics>;
  buildingsCount: number;
}

// GET ALL CITIES FOR TEACHER MANAGEMENT
export async function getAllCitiesForTeacher(): Promise<{
  summaries: TeacherCitySummary[];
  totalRealCities: number;
  totalDemoCities: number;
  demosHidden: boolean;
}> {
  const hideDemos = areDemoCitiesHidden();
  const summaries: TeacherCitySummary[] = [];
  const currentStudent = getActiveStudent();

  // 1. Fetch from Firestore
  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION));
      const snap = await getDocs(q);

      snap.forEach((d) => {
        const data = d.data();
        const cityData: CyberCityData = data.cyberCity || {
          ...DEFAULT_STARTER_CITY,
          studentId: d.id,
          studentName: data.username || 'Elev TIC',
          cityName: `Metropola lui ${data.username || 'Elev'}`,
        };

        const metrics = calculateCityMetrics(cityData.buildings);
        summaries.push({
          city: cityData,
          studentId: d.id,
          studentName: data.username || 'Elev TIC',
          studentAvatar: data.avatar || '⚡',
          isDemo: false,
          metrics,
          buildingsCount: Object.keys(cityData.buildings || {}).length,
        });
      });
    } catch (err) {
      console.warn('Eroare citire orase profesori Firestore:', err);
    }
  }

  // If local student not yet in list, add local
  if (currentStudent && !summaries.some((s) => s.studentId === currentStudent.id)) {
    const localCity = getCyberCityData();
    summaries.push({
      city: localCity,
      studentId: currentStudent.id || 'local_student',
      studentName: currentStudent.username || 'Campion TIC',
      studentAvatar: currentStudent.avatar || '⚡',
      isDemo: false,
      metrics: calculateCityMetrics(localCity.buildings),
      buildingsCount: Object.keys(localCity.buildings || {}).length,
    });
  }

  // 2. Always append the 4 Demo Cities for the teacher (with isDemo: true)
  FOUR_DEMO_CITIES.forEach((demo) => {
    summaries.push({
      city: demo,
      studentId: demo.studentId,
      studentName: demo.studentName,
      studentAvatar: '🏙️',
      isDemo: true,
      metrics: calculateCityMetrics(demo.buildings),
      buildingsCount: Object.keys(demo.buildings || {}).length,
    });
  });

  const totalReal = summaries.filter((s) => !s.isDemo).length;
  const totalDemo = FOUR_DEMO_CITIES.length;

  return {
    summaries,
    totalRealCities: totalReal,
    totalDemoCities: totalDemo,
    demosHidden: hideDemos,
  };
}

// TEACHER GRANT BYTECOINS TO STUDENT CITY
export async function grantTeacherCityGrant(
  studentId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  if (amount <= 0) return { success: false, error: 'Suma trebuie să fie pozitivă.' };

  const current = getActiveStudent();
  if (current && (current.id === studentId || current.username === studentId)) {
    await addByteCoins(amount, `Subvenție Profesor: ${reason}`);
    return { success: true };
  }

  if (isCloudConnected && db && studentId) {
    try {
      const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        const data = studentSnap.data();
        const currentCoins = Number(data.byteCoins || 0);
        await updateDoc(studentRef, {
          byteCoins: currentCoins + amount,
          lastActiveAt: new Date().toISOString(),
        });
        return { success: true };
      }
    } catch (err) {
      console.warn('Eroare grant ByteCoins profesor:', err);
      return { success: false, error: 'Eroare la salvarea în baza de date.' };
    }
  }

  // Local fallback
  await addByteCoins(amount, `Subvenție Profesor: ${reason}`);
  return { success: true };
}
