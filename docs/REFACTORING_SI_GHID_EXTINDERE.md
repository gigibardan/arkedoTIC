# ArkyEdu — Raport de Refactorizare Modulară & Ghid Practic de Extindere

Documentație completă realizată după modularizarea nucleului **ArkyEdu** (platformă educațională TIC & Informatică pentru clasele V–VIII + Arcade, Sandbox, Evaluare Rapidă și Arena 1v1).

> **Principiu de aur respectat la refactoring:** 100% retro-compatibilitate cu toate cheile `localStorage` (`arkedo_*`), cu structura colecțiilor Firestore (`elevi`, `rezultate_tic`, `scoli`, `setari_jocuri`, `recorduri_jocuri`, `cereri_deblocare`, `dueluri`) și cu toate API-urile publice exportate anterior.

---

## Partea 1: Ce s-a Refactorizat & De Ce

### 1.1 Tabel Comparativ (Înainte vs. După)

| Zonă / Modul | Înainte | După Refactorizare | Beneficiu Principal |
|---|---|---|---|
| **Registre Centrale (`src/data/`)** | Metadata duplicată în 6+ fișiere | `missionsRegistry.ts` (849 linii, 44 misiuni) + `arcadeRegistry.ts` (444 linii, 28 jocuri) + `victoryMissionData.ts` (966 linii, 44 diplome) | **Sursă unică de adevăr** (Single Source of Truth), 0 desincronizări |
| **Serviciu Elevi (`studentAuthService.ts`)** | Monolit de **2.869 linii** | Împărțit în **5 module specializate** + barrel compatibil (`studentAuthService.ts`, 1.001 linii) | Zero dependențe circulare, cod ușor de întreținut și testat |
| **Ecran Victorie (`VictoryScreen.tsx`)** | **1.825 linii** (34 flag-uri booleene + ternari imbricați) | **461 linii** (bazat pe `VICTORY_MISSION_DATA[courseId]`) | Adăugarea unei misiuni noi nu mai necesită editarea `VictoryScreen.tsx` |
| **Panou Profesor (`TeacherScoreModal.tsx`)** | **2.875 linii** (liste statice incomplete) | **959 linii** (generat dinamic din `ARCADE_REGISTRY` + `CARNET_MISSIONS`, filtre pe clase + toate cele 12 dueluri) | Toate cele 28 jocuri și 44 misiuni apar automat în panoul profesorului |
| **Carnet Digital (`carnetService.ts`)** | **1.245 linii** (825 linii date inline) | **402 linii** (importă și re-exportă din `missionsRegistry.ts` și `arcadeRegistry.ts`) | Elimină dependența circulară cu `studentAuthService.ts` |
| **Orchestrator App (`App.tsx`)** | ~1.500+ linii | **491 linii** + `hooks/useMissionProgress.ts` (351 linii) + `components/MissionStage.tsx` (271 linii) | Separare clară: rutare/layout vs. progres/timer vs. randare misiuni |
| **Catalog Cursuri (`CoursesCatalog.tsx`)** | 110+ linii de `if/else` pentru progres | Folosește `MISSION_META_BY_ID` din `missionsRegistry.ts` | Verificare unitară inclusiv pentru cheile legacy de Clasa a VIII-a |
| **Hub Arcade (`ArcadeHub.tsx`)** | 28 blocuri IIFE duplicate pentru scoruri | Helper unic `readHighScore(key, fallbackKey?)` | Cod curat, cu fallback păstrat pentru `hacker_defense` |

---

### 1.2 Împărțirea `studentAuthService.ts` în 5 Module de Domeniu

Pentru a preveni importurile circulare și a separa responsabilitățile fără a rupe niciun import existent în aplicație, `src/lib/studentAuthService.ts` a devenit un **fațadă/barrel compatibil 100%** peste 4 module dedicate:

1. **`src/lib/studentCore.ts`** (256 linii)
   - Constante globale (`STUDENTS_COLLECTION`, `RECORDS_COLLECTION`, `GLOBAL_RECORDS_DOC`, cheile `LOCAL_*_KEY`).
   - Protecție Firestore quota (`isQuotaExhausted`, `markQuotaExhausted`) și cache local rezultate.
   - `ARCADE_GAME_KEYS` (toate cele 28 de chei derivate din `ALL_ARCADE_SCORE_KEYS`), `DEFAULT_ARCADE_SCORES`, `DEFAULT_LESSONS_PROGRESS`.
   - Calcul XP normalizat anti-cheat (`computeTotalArcade` din `arcadeRegistry.ts`, `computeLessonXP`, `computeTotalLessons`, `computeTotalXP`).
   - Gestionare sesiune locală (`getActiveStudent`, `saveActiveStudentLocally`, `logoutStudent`) și sincronizare bidirecțională `syncProfileToLocalStorage(...)` (inclusiv `graphics1`/`graphics2` și cheile legacy).

2. **`src/lib/studentEconomyService.ts`** (249 linii)
   - Economie virtuală **ByteCoins** (`getByteCoins`, `addByteCoins`, `awardTeacherCoins`).
   - Inventar & echipare **Cyber Shop** (`getStudentInventory`, `getEquippedItems`, `buyShopItem`, `equipShopItem`, `openMysteryChest`).

3. **`src/lib/studentGamificationService.ts`** (474 linii)
   - Clasa elevului (`getLocalClassGrade`, `updateStudentClassGrade`).
   - Serie zilnică & misiuni zilnice (`getStoredDailyStreak`, `getStoredDailyQuests`, `markDailyQuestFlag`, `recordDailyActivityAndStreak`, `claimDailyQuestReward`).
   - Sincronizare insigne (`syncStudentBadges`).
   - Progres **Code Sandbox** (`getStoredSandboxProgress`, `saveSandboxChallengeSolved`, `saveSandboxSnippet`).
   - Istoric **Evaluare Rapidă** (`getStoredQuickEvalHistory`, `saveQuickEvalAttempt`).

4. **`src/lib/studentTeacherAdminService.ts`** (433 linii)
   - Operațiuni profesor / administrator (`getAllStudents`, `getGameAllTimeRecords` pentru toate cele 28 jocuri + aliasuri legacy).
   - Editare și moderare elevi (`deleteStudentAccount`, `updateStudentFullProfileByTeacher`, `updateStudentScoresByTeacher`).
   - Resetări granulare sau globale (`resetStudentArcadeScores`, `resetStudentLessonProgress` — tipizat pe toate cele 44+ chei, `applyCheatingPenalty`, `awardTeacherBonusXP`, `recalculateStudentXP`).

5. **`src/lib/studentAuthService.ts`** (1.001 linii)
   - Autentificare și profil (`hashPassword`, `registerStudent`, `loginStudent`, `updateStudentUsername`, `updateStudentAvatar`, `resetStudentPassword`, `refreshActiveStudentFromCloud`).
   - Sincronizare live a scorurilor (`updateStudentArcadeScore` / `updateActiveArcadeScore`, `updateStudentLessonProgress` / `updateActiveLessonProgress`, `saveStudentDiploma`, `getStudentDiplomas`, `recordStudentDuelResult`).
   - **Re-exportă integral** toate funcțiile, tipurile și constantele din cele 4 module de mai sus — orice componentă existentă care importă din `../lib/studentAuthService` funcționează fără nicio modificare.

---

### 1.3 Bug-uri Reale Identificate și Corectate în Timpul Auditului

1. **5 jocuri Arcade lipseau din registrele profesorului / sincronizare**:
   - În `ARCADE_REGISTRY` și `ARCADE_GAME_KEYS` au fost incluse toate cele **28 de jocuri** (inclusiv `cyber_snake`, `circuit_master`, `cyber_invaders`, `cyber_pacman`, `cyber_arkanoid`, `cyber_frogger`, `cyber_sokoban`, `cyber_asteroids`, etc.).
   - `SuperAdminDashboard.tsx` afișează acum dinamic `Scoruri Mini-Jocuri Arcade ({ARCADE_GAME_KEYS.length})` în loc de textul static învechit „19”.
2. **Misiunile de Robotică Clasa a VIII-a (`g8_robot_a`, `g8_robot_b`) lipseau din `TeacherScoreModal.tsx`**:
   - Deoarece `TeacherScoreModal` citește acum direct din `CARNET_MISSIONS`, toate cele **44 de misiuni** (inclusiv `g8_robot_a` și `g8_robot_b`) sunt disponibile cu filtrare pe clase (`Toate (44)`, `Cls. V`, `VI`, `VII`, `VIII`).
3. **Desincronizare chei `localStorage` la Clasa a VIII-a (`g8_calc_a` vs `g8ca`)**:
   - Unele componente vechi scriau `arkedo_g8ca_level`, iar cele noi `arkedo_g8_calc_a_level`.
   - S-a adăugat câmpul opțional `legacyLocalPrefix` în `CarnetMissionMeta` (`src/data/missionsRegistry.ts`), astfel încât `studentCore.ts`, `studentAuthService.ts` și `CoursesCatalog.tsx` citesc și sincronizează ambele formate transparent.
4. **Resetarea individuală a unui joc Arcade nu actualiza `totalArcade`**:
   - În `TeacherScoreModal.tsx` și `studentTeacherAdminService.ts`, resetarea scorului unui singur joc recalculează corect `totalArcade` și `totalXP`.
5. **Discrepanță chei ByteCoins (`arkedo_student_coins` vs `arkedo_byte_coins`)**:
   - Citirea are acum fallback între ambele chei, iar scrierea actualizează oglindit ambele chei pentru compatibilitate totală între componente vechi și noi.
6. **Date lipsă în `VictoryScreen` pentru anumite module de Clasa a VI-a și a VII-a**:
   - Toate cele 44 de misiuni au acum intrări complete bilingve (`ro` / `en`) în `src/data/victoryMissionData.ts`, inclusiv fallback-uri compatibile cu traducerile din `LanguageContext`.

---

## Partea 2: Harta Modulară a Platformei

```text
src/
├── App.tsx                        # Layout global, Navbar, ModalManager, rutare view-uri (491 linii)
├── types.ts                       # Tipuri globale: AllMissionId, ArcadeScores, LessonsProgress, StudentProfile
├── data/                          # ★ STRATUL DE CONFIGURAȚIE & CONȚINUT (fără dependențe circulare)
│   ├── missionsRegistry.ts        # Cele 44 misiuni (V–VIII), chei localStorage & lessonsKey, ALL_LESSON_PROGRESS_KEYS
│   ├── victoryMissionData.ts      # Textele, insignele și diplomele de victorie pentru toate cele 44 misiuni
│   ├── arcadeRegistry.ts          # Cele 28 mini-jocuri Arcade, xpCap, normalizare XP, chei highscore, praguri anti-cheat
│   ├── curriculaData.ts           # Programe școlare V–VI (+ importă grade7Curricula.ts & grade8Curricula.ts)
│   ├── sandboxChallenges.ts       # Provocări Code Sandbox (C++, Python, HTML/CSS) cu test cases & recompense
│   ├── quickEvalBank.ts           # Banca de întrebări Evaluare Rapidă (clasele V–VIII)
│   ├── blog/                      # Articole Blog Educațional (types.ts, batch1.ts, batch2.ts, batch3.ts, index.ts)
│   └── glossary/                  # Dicționar / Glosar TIC (types.ts, termsPart1..3.ts, index.ts)
├── hooks/
│   ├── useMissionProgress.ts      # State misiune activă, cronometru, salvare localStorage + Cloud sync
│   ├── useOnlineStatus.ts         # Detectare conexiune online/offline
│   └── usePWAInstall.ts           # Prompt instalare PWA
├── lib/                           # ★ STRATUL DE SERVICII & PERSISTENȚĂ (Cloud Firestore + localStorage)
│   ├── firebase.ts                # Inițializare Firebase & flag isCloudConnected
│   ├── studentCore.ts             # Sesiune activă, chei localStorage, calcul XP, syncProfileToLocalStorage
│   ├── studentEconomyService.ts   # ByteCoins, Cyber Shop, inventar, cufere misterioase
│   ├── studentGamificationService.ts # Streak zilnic, quest-uri, insigne, progres Sandbox & QuickEval
│   ├── studentTeacherAdminService.ts # Operațiuni Profesor / SuperAdmin (listare, editare, resetare, recorduri)
│   ├── studentAuthService.ts      # Login/Register, update scoruri/lecții/dueluri + barrel re-export
│   ├── carnetService.ts           # Snapshot Carnet Digital, backfill diplome, calcul 10 insigne & 3 quest-uri
│   ├── shopCatalog.ts             # Catalog obiecte Cyber Shop (skin-uri Arky, teme, rame, titluri)
│   ├── cyberCityCatalog.ts & cyberCityService.ts # Clădiri & sincronizare Cyber City
│   ├── gameControlService.ts      # Definiții ALL_GAMES (pentru lock/unlock profesor) & cereri deblocare
│   ├── duelService.ts             # Moduri și sincronizare real-time Arena 1v1
│   ├── resultsService.ts          # Catalog note trimise în colecția Firestore `rezultate_tic`
│   ├── schoolService.ts           # Gestiune școli (`scoli`)
│   └── superadminService.ts       # Funcții avansate SuperAdmin
└── components/
    ├── MissionStage.tsx           # Randare lazy a celor 44 de misiuni + ProgressBar + VictoryScreen
    ├── VictoryScreen.tsx          # Ecran final + autoevaluare + imprimare diplomă (`#diploma-to-print`)
    ├── CoursesCatalog.tsx         # Pagina principală cu selecția cursurilor V–VIII
    ├── DigitalCarnetHub.tsx       # Carnetul Digital (Medie, Note, Diplome, Insigne, Quest-uri, Statistici)
    ├── TeacherPortal.tsx & TeacherScoreModal.tsx # Portal Profesor & gestionare elevi
    ├── minigames/ArcadeHub.tsx    # Hub-ul celor 28 de jocuri Arcade
    ├── duel/DuelArena.tsx         # Arena Multiplayer 1v1
    ├── sandbox/CodeSandboxHub.tsx # Editor & runner interactiv C++ / Python / HTML
    └── evaluation/QuickEvalSimulator.tsx # Simulator Evaluare Rapidă cronometrat
```

### Fluxul de Persistență (Local-First + Cloud Sync)
1. Orice progres de lecție se scrie **imediat** în `localStorage` prin `useMissionProgress.ts` (`arkedo_<localPrefix>_level`, `_score`, `_elapsed`, `arkedo_completed_<id>`).
2. Dacă există un elev autentificat (`getActiveStudent()`), `updateActiveLessonProgress(...)` / `updateActiveArcadeScore(...)` actualizează profilul în memorie + `localStorage` (`arkedo_active_student_profile`) și trimite asincron către Firestore (`elevi/{id}`), cu gardian de eroare `isQuotaExhausted()`.
3. La logare (`loginStudent`) sau reîmprospătare (`refreshActiveStudentFromCloud`), `syncProfileToLocalStorage(...)` oglindește datele din Cloud în `localStorage`, fără să piardă cheile legacy.

---

## Partea 3: Ghid Practic de Extindere („Cum adaugi lucruri noi rapid și sigur”)

Mai jos sunt pașii exacți pentru fiecare tip de conținut nou pe care vrei să îl adaugi în ArkyEdu.

---

### 1. Cum adaugi o Lecție / Misiune Nouă (ex: Clasa a VIII-a sau a IX-a)

Datorită refactorizării, **nu mai trebuie să modifici** `VictoryScreen.tsx`, `TeacherScoreModal.tsx`, `CoursesCatalog.tsx` (logica de completare), `carnetService.ts` sau `studentCore.ts`!

#### Pasul 1: Tipurile (`src/types.ts`)
1. Adaugă noul ID în uniunea `AllMissionId` (ex. `'g8_ai_a'`).
2. Adaugă câmpul corespunzător în interfața `LessonsProgress` (dacă `lessonsKey` e diferit de `id`, folosește numele `lessonsKey`; recomandat să fie identic cu `id`).

#### Pasul 2: Registrul Misiunilor (`src/data/missionsRegistry.ts`)
Adaugă un obiect nou în array-ul `CARNET_MISSIONS`:
```ts
{
  id: 'g8_ai_a',
  lessonsKey: 'g8_ai_a',
  localPrefix: 'g8_ai_a',
  gradeNum: 8, // 5 | 6 | 7 | 8 (sau extinde tipul la 9 dacă adaugi clasa IX)
  gradeLabelRo: 'Clasa a VIII-a',
  gradeLabelEn: '8th Grade',
  moduleCode: 'M8-AI1',
  emoji: '🧠',
  maxLevels: 7,      // Câte niveluri/pagini interactive are lecția
  maxScore: 100,
  titleRo: 'Introducere în Inteligența Artificială',
  titleEn: 'Introduction to Artificial Intelligence',
  unitRo: 'U6 · AI & Etică Digitală',
  unitEn: 'U6 · AI & Digital Ethics',
  diplomaTitleRo: 'Diplomă Explorer AI & Etică',
  diplomaTitleEn: 'AI & Ethics Explorer Certificate',
},
```
> **Ce se actualizează automat din acest pas:** Carnetul Digital, Panoul Profesorului (`TeacherScoreModal`), calculele `totalLessons` / `totalXP`, `syncProfileToLocalStorage`, resetarea lecției din admin și detectarea finalizării în `CoursesCatalog`!

#### Pasul 3: Ecranul de Victorie (`src/data/victoryMissionData.ts`)
Adaugă intrarea pentru `g8_ai_a` în obiectul `VICTORY_MISSION_DATA`:
```ts
g8_ai_a: {
  courseTitleRo: 'Clasa VIII: Introducere în AI',
  courseTitleEn: 'Grade 8: Intro to AI',
  subtitleRo: 'Ai stăpânit conceptele de bază ale rețelelor neuronale și prompt engineering!',
  subtitleEn: 'You mastered core neural networks and prompt engineering concepts!',
  diplomaTitleRo: 'DIPLOMĂ EXPLORER AI',
  diplomaTitleEn: 'AI EXPLORER DIPLOMA',
  diplomaTextRo: 'Pentru finalizarea cu succes a modulului de Inteligență Artificială',
  diplomaTextEn: 'For successfully completing the Artificial Intelligence module',
  badgeEmojis: ['🧠', '🤖', '✨', '📊', '🛡️'],
  badgesRo: ['Prompt Master', 'Date Curate', 'Etică AI', 'Logica Algoritmilor', 'Gândire Critică'],
  badgesEn: ['Prompt Master', 'Clean Data', 'AI Ethics', 'Algorithmic Logic', 'Critical Thinking'],
},
```

#### Pasul 4: Componenta Lecției & Înregistrarea în `src/components/MissionStage.tsx`
1. Creează componenta lecției respectând interfața `FlowPageComponentProps`:
   `{ currentLevel, onCompletePage, studentName, onRestartMission, onReturnToCatalog }`.
2. În `src/components/MissionStage.tsx`:
   - Adaugă import `lazy(...)` în zona de top;
   - Adaugă cheia în obiectul `FLOW_PAGE_COMPONENTS`:
     ```ts
     g8_ai_a: ModuleG8Ai1Flow,
     ```

#### Pasul 5: Afișarea Cardului în Catalog & Programa Școlară
- Adaugă cardul misiunii în secțiunea clasei respective (`src/components/catalog/gradeMissionsData.ts` pentru V–VI, `src/components/grade7/Grade7CatalogSection.tsx` pentru VII, `src/components/grade8/Grade8CatalogSection.tsx` pentru VIII).
- Opțional, adaugă lecția în programa interactivă (`src/data/curriculaData.ts`, `grade7Curricula.ts` sau `grade8Curricula.ts`).

---

### 2. Cum adaugi un Nou Mini-Joc Arcade

#### Pasul 1: Tipuri (`src/types.ts`)
Adaugă câmpul numeric opțional în interfața `ArcadeScores` (ex: `cyber_tetris?: number;`).

#### Pasul 2: Registrul Arcade (`src/data/arcadeRegistry.ts`)
Adaugă definiția completă în `ARCADE_REGISTRY`:
```ts
{
  scoreKey: 'cyber_tetris',
  controlId: 'cyber_tetris',
  localStorageKey: 'arkedo_highscore_cyber_tetris',
  icon: '🧩',
  nameRo: 'Cyber Tetris Stack',
  nameEn: 'Cyber Tetris Stack',
  teacherNameRo: 'Cyber Tetris: Arhitectura Memoriei',
  teacherNameEn: 'Cyber Tetris: Memory Blocks',
  badgeRo: 'NOU 🔥',
  badgeEn: 'NEW 🔥',
  category: 'retro', // 'retro' | 'logic' | 'cyber' | 'agility'
  xpCap: 2500,       // Maximul de XP care contribuie la totalArcade
},
```
> **Ce se actualizează automat din acest pas:** `ARCADE_GAME_KEYS`, `DEFAULT_ARCADE_SCORES`, `computeTotalArcade` (normalizare XP), sincronizarea `localStorage` ↔ Cloud, `getGameAllTimeRecords` (recorduri globale), catalogul din Carnet Digital și matricea din `TeacherScoreModal` + `SuperAdminDashboard`!

#### Pasul 3: Control Profesor (`src/lib/gameControlService.ts`)
Adaugă obiectul jocului în `ALL_GAMES` cu același `id` ca `controlId` (pentru ca profesorul să îl poată bloca/debloca din Portalul Profesorului).

#### Pasul 4: Componenta Jocului & Integrarea în `src/components/minigames/ArcadeHub.tsx`
1. Creează componenta în `src/components/minigames/` (ex: `CyberTetrisGame.tsx`). La final de joc:
   - Salvează highscore-ul în `localStorage` sub cheia exactă (`arkedo_highscore_cyber_tetris`);
   - Apelează `updateActiveArcadeScore('cyber_tetris', finalScore)` + `addByteCoins(...)` (opțional).
2. În `ArcadeHub.tsx`:
   - Adaugă `'cyber_tetris'` în tipul `ActiveGame`;
   - Citește highscore-ul cu `const cyberTetrisHighScore = readHighScore('arkedo_highscore_cyber_tetris');`;
   - Adaugă cardul în grid și ramura de randare când `activeGame === 'cyber_tetris'`.

---

### 3. Cum adaugi o Provocare în Code Sandbox (`src/data/sandboxChallenges.ts`)

Nu este nevoie să modifici UI-ul `CodeSandboxHub.tsx`! Adaugă doar un obiect nou în array-ul `SANDBOX_CHALLENGES`:
- **`language`**: `'cpp'` | `'python'` | `'html'`
- **Pentru C++ / Python**: completează `tests: SandboxTestCase[]` cu `stdin` și `expectedOutput` exacte.
- **Pentru HTML/CSS**: completează `starterCss` și `htmlChecks: HtmlCheckRule[]` cu funcția `check(doc, rawHtml, rawCss)`.
- **`rewardCoins`**: numărul de ByteCoins acordați automat la prima rezolvare (sincronizat automat cu profilul elevului și insigna `sandbox_coder`).

---

### 4. Cum adaugi Întrebări Noi în Evaluare Rapidă (`src/data/quickEvalBank.ts`)

Simulatorul `QuickEvalSimulator.tsx` extrage dinamic întrebările după `grade` și `difficulty`. Adaugă pur și simplu obiecte noi de tip `QuickEvalQuestion` în `QUICK_EVAL_BANK`:
- `id` unic (ex. `'qe_g8_25'`), `grade: 5 | 6 | 7 | 8`, `difficulty: 'easy' | 'medium' | 'hard'`.
- `optionsRo` & `optionsEn`: tuplu de exact 4 variante, iar `correctIndex: 0 | 1 | 2 | 3`.
- `explanationRo` & `explanationEn`: explicația afișată elevului după răspuns.

---

### 5. Cum adaugi Articole pe Blog & Termeni în Glosar

- **Blog (`src/data/blog/`)**:
  - Alege unul din fișierele `batch1.ts`, `batch2.ts`, `batch3.ts` (sau creează `batch4.ts` și combină-l în `src/data/blog/index.ts`).
  - Respectă interfața `BlogArticle` din `src/data/blog/types.ts` (conține `id`, `category`, variante bilingve `ro` și `en` cu `slug` SEO, `tldr`, `sections`, `checklist`, `faqs`, `internalLinks`).
  - `BlogHub.tsx` și `sitemap` / ruta `/blog/<slug>` îl indexează automat.

- **Glosar TIC (`src/data/glossary/`)**:
  - Adaugă termenul în `termsPart1.ts`, `termsPart2.ts` sau `termsPart3.ts` (re-exportate de `index.ts`).
  - Respectă `GlossaryTerm` (`src/data/glossary/types.ts`): `relatedModuleId`, `relatedMissionId`, `vsComparison`, `commonMistake` și conținut bilingv `ro` / `en`.

---

### 6. Cum adaugi Obiecte în Cyber Shop, Insigne & Moduri Duel 1v1

1. **Cyber Shop (`src/lib/shopCatalog.ts`)**:
   - Adaugă un `ShopItem` în `SHOP_ITEMS` cu `category`: `'arky_skin' | 'theme' | 'avatar_frame' | 'title' | 'mystery_box'`.
   - Dacă adaugi un skin sau o temă nouă, aplică efectul vizual corespunzător pentru `previewAsset` în `MascotaArky.tsx` / wrapper-ul temei din `App.tsx`.
2. **Insigne & Quest-uri Zilnice (`src/lib/carnetService.ts`)**:
   - Insignele se definesc declarativ în `computeStudentBadges(...)` (array de `StudentBadge`).
   - Quest-urile zilnice se definesc în `buildDailyQuestsDisplay(...)` (cu recompense în ByteCoins acordate prin `claimDailyQuestReward`).
3. **Arena Duel 1v1**:
   - Adaugă ID-ul modului în `DuelGameMode` (`src/lib/duelService.ts`) și în componenta `DuelArena.tsx`.
   - Dacă vrei să îi urmărești victoriile individual în Carnet & Panoul Profesorului, adaugă cheia în `StudentDuelStats` (`src/types.ts`) și în lista `DUEL_ARENA_FIELDS` din `src/components/TeacherScoreModal.tsx`.

---

## Partea 4: Checklist Rapid Înainte de Deploy / Commit

După orice adăugare de lecție, joc sau funcționalitate nouă:
1. Rulează verificarea strictă TypeScript: `npx tsc --noEmit` (trebuie 0 erori).
2. Rulează build-ul de producție: `npm run build` (trebuie să genereze bundle-ul și manifestul PWA fără erori).
3. Verifică în browser (Desktop + Mobil):
   - Nu există erori în consolă la deschiderea modulului nou;
   - Cheile `localStorage` se salvează corect și se reflectă în **Carnetul Digital** și în **Portalul Profesorului**;
   - Toate butoanele noi au `type="button"` (dacă nu fac submit de formular).
