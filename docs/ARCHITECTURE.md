# ArkyEdu — Arhitectura Platformei & Registrul Misiunilor (v3)

Documentație tehnică realizată înaintea modularizării pentru a garanta păstrarea integrală a datelor elevilor, a cheilor `localStorage`, a sincronizării Cloud Firestore și a fluxului de notare pedagogică.

---

## 1. Prezentare Generală & Stack Tehnic

- **Frontend**: React 19 + TypeScript + Vite (`vite.config.ts`) + Tailwind CSS v4 (`@import "tailwindcss";`)
- **Bilingvism**: Română (`ro`, implicit) și Engleză (`en`) prin `LanguageContext` (`src/context/LanguageContext.tsx`)
- **Bază de date Cloud**: Firebase Firestore (`src/lib/firebase.ts`), cu fallback automat în `localStorage` când conexiunea Cloud lipsește.
- **PWA & Auto-Update**: `vite-plugin-pwa` + `src/utils/appUpdater.ts` cu protecție `setAppSessionBusy(...)` în timpul lecțiilor, duelurilor, sandbox-ului sau evaluărilor cronometrate.
- **Gamificare & Mascotă**: `ArkyContext` + `MascotaArky`, `HintContext`, `sounds` (`src/utils/audio.ts`), ByteCoins (`CyberShopModal`), Duel Arena, CyberCity, 28 mini-jocuri Arcade.

---

## 2. Harta Rutelor & View-urilor (`App.tsx`)

| View ID | URL Path / Hash | Componentă | `setAppSessionBusy` |
|---|---|---|---|
| `catalog` | `/` | `CoursesCatalog` | `false` |
| `lesson` | `/` (cu `activeMission`) | `MissionStage` (`ProgressBar` + nivel/modul + `VictoryScreen`) | `true` |
| `carnet` | `/carnet` / `#carnet` | `DigitalCarnetHub` | `false` |
| `evaluare` | `/evaluare` / `#evaluare` | `QuickEvalSimulator` | `true` |
| `sandbox` | `/sandbox` / `#sandbox` | `CodeSandboxHub` | `true` |
| `arcade` | `/arcade` / `#arcade` | `ArcadeHub` | `true` |
| `duel` | `/duel` / `#duel` | `DuelArena` | `true` |
| `city` | `/oras` / `/city` | `CyberCityView` | `false` |
| `teacher` | `/profesor` / `#profesor` | `TeacherPortal` | `false` |
| `superadmin` | `/superadmin` / `#superadmin` | `SuperAdminDashboard` | `false` |
| `blog` | `/blog/` / `#blog/...` | `BlogHub` | `false` |
| `glossary` | `/glosar/` / `#glosar/...` | `GlossaryHub` | `false` |

---

## 3. Contractul de Persistență (`localStorage` & Firestore)

### 3.1 Chei `localStorage` Obligatorii (Retro-Compatibilitate 100%)
Orice hook sau serviciu modular **TREBUIE** să păstreze exact aceste chei pentru a nu pierde progresul existent al elevilor:

- `arkedo_active_mission` — ID-ul misiunii curente neterminate (`AllMissionId`)
- `arkedo_completed_<missionId>` — `'true'` la finalizarea misiunii (ex: `arkedo_completed_hardware`, `arkedo_completed_g8_calc_a`)
- `arkedo_<localPrefix>_level` — Nivelul curent (`1 .. maxLevels + 1`)
- `arkedo_<localPrefix>_score` — Scorul curent (`0 .. 100`)
- `arkedo_<localPrefix>_elapsed` — Secundele acumulate în misiune
- `arkedo_student_name`, `arkedo_student_avatar`, `arkedo_student_class_grade`
- `arkedo_active_student_profile` — Profilul elevului conectat (`StudentProfile`)
- `arkedo_sandbox_progress` — Progresul și ciornele din `CodeSandboxHub` (`{ solvedIds, snippets }`)
- `arkedo_quick_eval_history` — Istoricul simulărilor de evaluare (`QuickEvalAttempt[]`)
- `arkedo_student_diplomas`, `arkedo_daily_streak`, `arkedo_daily_quests`
- `arkedo_results_cache`, `arkedo_sound_enabled`, `arkedo_lang`, `arkedo_theme`

### 3.2 Colecții Firestore
- **`elevi`**: Profil complet elev (`username`, `passwordHash`, `schoolId`, `classGrade`, `arcadeScores`, `lessonsProgress`, `byteCoins`, `inventory`, `equipped`, `diplomas`, `dailyStreak`, `dailyQuests`, `badges`, `sandboxProgress`, `quickEvalHistory`, `cyberCity`, `duelStats`, `totalXP`).
- **`rezultate_tic`**: Catalogul notelor trimise automat de `VictoryScreen` și `QuickEvalSimulator` (`studentName`, `courseTitle`, `score`, `maxScore`, `elapsedSeconds`, `schoolId`, `timestamp`).
- **`scoli`**: Instituțiile școlare active (`schoolService.ts`).
- **`setari_jocuri` / `cereri_deblocare`**: Comutatoarele Arcade & Duel controlate de profesor (`gameControlService.ts`).

---

## 4. Registrul Complet al celor 44 de Misiuni (`AllMissionId`)

Fiecare misiune este definită unitar în `CARNET_MISSIONS` (`src/data/missionsRegistry.ts`, re-exportat de `src/lib/carnetService.ts`), diplomele în `VICTORY_MISSION_DATA` (`src/data/victoryMissionData.ts`) și orchestrată de `useMissionProgress` (`src/hooks/useMissionProgress.ts`) + `MissionStage` (`src/components/MissionStage.tsx`).

### 4.1 Clasa a V-a (10 Misiuni)
| ID (`AllMissionId`) | `localPrefix` | `lessonsKey` | `maxLevels` | `victoryLevel` | Tip Componentă / Flux |
|---|---|---|---|---|---|
| `hardware` | `hw` | `hardware` | `5` | `6` | `HLevel1..HLevel5` (`onComplete`, scor `[20,40,60,80,100]`) |
| `files` | `files` | `files` | `7` | `8` | `FLevel1..Level5` (`onComplete`, scor `[10,25,40,55,70,85,100]`) |
| `internet1` | `internet1` | `internet1` | `6` | `7` | `Module3AFlow` (`onCompleteLevel`) |
| `internet2` | `internet2` | `internet2` | `6` | `7` | `Module3BFlow` (`onCompleteLevel`) |
| `text1` | `text1` | `text1` | `7` | `8` | `Module4AFlow` (`onCompleteLevel`) |
| `text2` | `text2` | `text2` | `7` | `8` | `Module4BFlow` (`onCompleteLevel`) |
| `algo1` | `algo1` | `algo1` | `7` | `8` | `Module5AFlow` (`onCompleteLevel`) |
| `algo2` | `algo2` | `algo2` | `7` | `8` | `Module5BFlow` (`onCompleteLevel`) |
| `scratch1` | `scratch1` | `scratch1` | `7` | `8` | `Module6AFlow` (`onCompleteLevel`) |
| `scratch2` | `scratch2` | `scratch2` | `7` | `8` | `Module6BFlow` (`onCompleteLevel`) |

### 4.2 Clasa a VI-a (8 Misiuni)
| ID (`AllMissionId`) | `localPrefix` | `lessonsKey` | `maxLevels` | `victoryLevel` | Componentă |
|---|---|---|---|---|---|
| `g6_presentation1` | `g6p1` | `presentation1` | `7` | `8` | `ModuleG6P1Flow` (`onCompleteLevel`) |
| `g6_presentation2` | `g6p2` | `presentation2` | `7` | `8` | `ModuleG6P2Flow` (`onCompletePage`) |
| `g6_paint3d` | `g6p3` | `model3d1` | `7` | `8` | `ModuleG6Paint3DFlow` (`onCompletePage`) |
| `g6_anim3d` | `g6a1` | `model3d2` | `7` | `8` | `ModuleG6AnimVRFlow` (`onCompletePage`) |
| `g6_malware` | `g6m1` | `cyber6a` | `7` | `8` | `ModuleG6M1Flow` (`onCompletePage`) |
| `g6_email` | `g6e1` | `cyber6b` | `7` | `8` | `ModuleG6EmailFlow` (`onCompletePage`) |
| `g6_scratch1` | `g6s1` | `scratch6a` | `7` | `8` | `ModuleG6ScratchAlgo1Flow` (`onCompletePage`) |
| `g6_scratch2` | `g6s2` | `scratch6b` | `7` | `8` | `ModuleG6ScratchAlgo2Flow` (`onCompletePage`) |

### 4.3 Clasa a VII-a (12 Misiuni)
| ID (`AllMissionId`) | `localPrefix` | `lessonsKey` | `maxLevels` | `victoryLevel` | Componentă |
|---|---|---|---|---|---|
| `g7_word_a` | `g7w1` | `g7_word_a` | `7` | `8` | `ModuleG7Word1Flow` (`onCompletePage`) |
| `g7_word_b` | `g7w2` | `g7_word_b` | `7` | `8` | `ModuleG7Word2Flow` (`onCompletePage`) |
| `g7_audio_a` | `g7a1` | `g7_audio_a` | `7` | `8` | `ModuleG7Audio1Flow` (`onCompletePage`) |
| `g7_video_b` | `g7v2` | `g7_video_b` | `7` | `8` | `ModuleG7Video1Flow` (`onCompletePage`) |
| `g7_cloud_a` | `g7c1` | `g7_cloud_a` | `7` | `8` | `ModuleG7Cloud1Flow` (`onCompletePage`) |
| `g7_gis_b` | `g7g1` | `g7_gis_b` | `7` | `8` | `ModuleG7Gis1Flow` (`onCompletePage`) |
| `g7_cpp_a` | `g7cp1` | `g7_cpp_a` | `7` | `8` | `ModuleG7Cpp1Flow` (`onCompletePage`) |
| `g7_cpp_b` | `g7cp2` | `g7_cpp_b` | `7` | `8` | `ModuleG7Cpp2Flow` (`onCompletePage`) |
| `g7_decision_a` | `g7dec` | `g7_decision_a` | `7` | `8` | `ModuleG7DecisionFlow` (`onCompletePage`) |
| `g7_loop_b` | `g7loop` | `g7_loop_b` | `7` | `8` | `ModuleG7LoopFlow` (`onCompletePage`) |
| `g7_stem_a` | `g7stem` | `g7_stem_a` | `7` | `8` | `ModuleG7StemFlow` (`onCompletePage`) |
| `g7_robot_b` | `g7robot` | `g7_robot_b` | `7` | `8` | `ModuleG7RobotFlow` (`onCompletePage`) |

### 4.4 Clasa a VIII-a (14 Misiuni)
Toate au `localPrefix === id` (cu `legacyLocalPrefix` păstrat în `missionsRegistry.ts`), `lessonsKey === id`, `maxLevels: 7`, `victoryLevel: 8`, interfață `onCompletePage`:
- `g8_calc_a` → `ModuleG8Calc1Flow`
- `g8_calc_b` → `ModuleG8Calc2Flow`
- `g8_calc_c` → `ModuleG8Calc3Flow`
- `g8_calc_d` → `ModuleG8Calc4Flow`
- `g8_web_a` → `ModuleG8Web1Flow`
- `g8_web_b` → `ModuleG8Web2Flow`
- `g8_web_c` → `ModuleG8Web3Flow`
- `g8_algo_a` → `ModuleG8Algo1Flow`
- `g8_algo_b` → `ModuleG8Algo2Flow`
- `g8_algo_c` → `ModuleG8Algo3Flow`
- `g8_algo_d` → `ModuleG8Algo4Flow`
- `g8_algo_e` → `ModuleG8Algo5Flow`
- `g8_robot_a` → `ModuleG8Robot1Flow`
- `g8_robot_b` → `ModuleG8Robot2Flow`

---

## 5. Ghid Rapid: Cum Adaugi o Misiune Nouă

1. Adaugă ID-ul în `AllMissionId` și câmpul corespunzător în `LessonsProgress` (`src/types.ts`).
2. Adaugă intrarea completă în `CARNET_MISSIONS` (`src/data/missionsRegistry.ts`) și datele de diplomă în `VICTORY_MISSION_DATA` (`src/data/victoryMissionData.ts`).
3. Adaugă importul `lazy(...)` și maparea în `FLOW_PAGE_COMPONENTS` din `src/components/MissionStage.tsx`.
4. `useMissionProgress`, `studentCore`, `TeacherScoreModal`, `CoursesCatalog`, `DigitalCarnetHub` și `VictoryScreen` preiau automat noua misiune fără alte modificări!

👉 Pentru ghidul complet de extindere (Arcade, Code Sandbox, Evaluare Rapidă, Blog, Glosar, Cyber Shop, Duel 1v1) și raportul detaliat al refactorizării, vezi **`docs/REFACTORING_SI_GHID_EXTINDERE.md`**.

