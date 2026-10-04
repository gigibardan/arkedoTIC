# 📘 ARHITECTURA COMPLETĂ, STANDARDE PEDAGOGICE ȘI MODELUL DE PUNCTAJ
> **Platforma Educațională Interactivă TIC — ARKEDO (Misiunea TIC)**  
> *Ghid Tehnic & Pedagogic de Referință pentru Dezvoltare și Scalare*

---

## 📑 Cuprins
1. [Viziune Generală & Pilonii Sistemului](#1-viziune-generală--pilonii-sistemului)
2. [Economia Platformei & Modelul de Punctaje](#2-economia-platformei--modelul-de-punctaje)
   - 2.1. Punctajul Global de Experiență (Total XP)
   - 2.2. Moneda Virtuală Urbană (ByteCoins / Bani de Oraș)
   - 2.3. Scorul Metropolei Digitale (CyberCity Metrics)
   - 2.4. Scorul de Duel (Duel Points & ELO)
3. [Standardul Pedagogic Reutilizabil pentru Lecții](#3-standardul-pedagogic-reutilizabil-pentru-lecții)
   - 3.1. Problema „Spam-Click-ului” și Soluția Anti-Viteză
   - 3.2. Regula Bufferului de Reflecție (Cooldown 5 secunde)
   - 3.3. Algoritmul de Depreciere a Punctajului pe Încercări
   - 3.4. Structura Pedagogică a Întrebărilor & Explicațiilor
   - 3.5. Componentele Reutilizabile (`PedagogicalQuizCard`, `PedagogicalQuizGroup`, `usePedagogicalCooldown`)
4. [Catalogul Mini-Jocurilor Arcade (19 Jocuri)](#4-catalogul-mini-jocurilor-arcade-19-jocuri)
   - 4.1. Tabel Centralizator Jocuri, Chei & Unități de Măsură
   - 4.2. Mecanisme de Scor per Joc & Conversie XP
   - 4.3. Sistemul Eficient de Recorduri All-Time (Optimizat NoSQL)
5. [Structura Lecțiilor & Modulelor Didactice](#5-structura-lecțiilor--modulelor-didactice)
   - 5.1. Modul 1: Hardware & Arhitectura Calculatorului
   - 5.2. Modul 2: Organizarea Datelor & Sistemul de Operare
   - 5.3. Modul 3A & 3B: Rețele, Internet, Siguranță & Identitate Digitală
   - 5.4. Modul 4A & 4B: Editare de Text & Tehnoredactare Digitală
   - 5.5. Modul 5A & 5B: Grafică Digitală 2D & 3D
6. [Arhitectura Bazei de Date & Persistența Datelor](#6-arhitectura-bazei-de-date--persistența-datelor)
   - 6.1. Firestore (Cloud) vs LocalStorage (Client Cache & Offline)
   - 6.2. Schema Documentelor (`elevi`, `recorduri_jocuri`, `solicitari_jocuri`)
   - 6.3. Strategia de Caching & Optimizare Interogări (Fără Scanări Inutile)
   - 6.4. Securitate & Reguli Firestore (`firestore.rules`)
7. [Gânduri Complexe & Strategie pentru Sprintul Viitor](#7-gânduri-complexe--strategie-pentru-sprintul-viitor)

---

## 1. Viziune Generală & Pilonii Sistemului

Platforma **ARKEDO** combină programa școlară oficială de TIC (Gimnaziu) cu gamificarea avansată. Elevii învață noțiuni teoretice și practice prin **5 piloni interconectați**:

```
                 ┌────────────────────────────────────────────────────────┐
                 │                TOTAL XP (Experiență Globală)          │
                 └───────────┬────────────────────────────────┬───────────┘
                             │                                │
             ┌───────────────┴───────────────┐ ┌──────────────┴───────────────┐
             │   1. LECȚII & MISIUNI TIC     │ │     2. ARCADE MINIGAMES      │
             │  (Module Manual & Quiz-uri)   │ │  (19 Jocuri de Îndemânare)   │
             └───────────────┬───────────────┘ └──────────────┬───────────────┘
                             │                                │
                             ├────────────────────────────────┤
                             ▼                                ▼
                 ┌───────────────────────┐        ┌───────────────────────┐
                 │  3. CYBERCITY ECONOMY │        │    4. DUEL ARENA      │
                 │   (ByteCoins & Clădiri)│        │   (PvP 1v1 în Direct) │
                 └───────────────────────┘        └───────────────────────┘
```

1. **Lecțiile Didactice Interactive**: Conținut conform manualului școlar, simulatoare de procese (pachete TCP/IP, asamblare PC, structură fișiere) și quiz-uri cu feedback formativ.
2. **Mini-Jocurile Arcade**: Întăresc reflexele digitale (tastare rapidă, coordonare mouse, logică binară, securitate cibernetică).
3. **CyberCity (Metropola Cibernetică)**: Simulare de tip SimCity/Tycoon unde elevii își investesc resursele câștigate la învățat pentru a dezvolta o infrastructură digitală ecologică și sigură.
4. **Arena de Dueluri 1v1**: Competiție directă sincronizată în clasă (CyberSprint, BlockCoding, SpeedCrafting etc.).
5. **Portofoliul & Legitimația Elevului**: Profil digital cu avatar, titlu, insigne, statistici live și sincronizare în cloud.

---

## 2. Economia Platformei & Modelul de Punctaje

Platforma folosește un sistem economic cu **mai multe monede/valori**, fiecare având un rol specific pentru a evita inflația și a motiva învățarea:

### 2.1. Punctajul Global de Experiență (Total XP)
- **Definiție**: Scorul total cumulat al elevului pe platformă, afișat pe legitimație și în clasamentul școlar.
- **Formula de calcul**:
  $$\text{Total XP} = \text{XP din Lecții} + \text{XP din Mini-Jocuri} + \text{XP din Dueluri} + \text{Bonusuri Misiuni}$$
- **Surse de XP**:
  - Finalizare pagină/nivel de lecție: `100 - 300 XP` (în funcție de dificultate).
  - Răspuns corect la o întrebare din prima încercare: `100 XP` (valoare maximă).
  - High score la un mini-joc arcade: Se convertesc punctele de joc în XP conform tabelei de echivalență.
  - Câștigarea unui meci de duel: `+50 XP`.
  - Rezolvarea unui incident cibernetic în oraș: `+50 - 150 XP`.

---

### 2.2. Moneda Virtuală Urbană (ByteCoins / Bani de Oraș 🪙)
- **Definiție**: Moneda cheltuibilă a elevului, folosită pentru cumpărături în **CyberShop** și construcția/upgradarea clădirilor din **CyberCity**.
- **Cum se obțin ByteCoins (Strategie & Reguli)**:
  1. **Recompensă de Lecție (Studiu Activ)**: Fiecare modul finalizat acordă `+50 - 100 ByteCoins`.
  2. **Bonus de Perfecțiune (Fără greșeală)**: Un quiz rezolvat din prima fără eroare acordă un bonus de `+25 ByteCoins`.
  3. **Randament Pasiv din Clădiri Urbane**: Clădirile din CyberCity (Data Center, Fermă Solară, Turn 5G) generează venit orar/zilnic în funcție de nivelul lor.
  4. **Rezolvare Incidente Urbane**: Atenuarea unui atac phishing sau a unei căderi de rețea acordă `+30 - 80 ByteCoins`.
  5. **Victorii în Duel**: `+20 ByteCoins` per victorie.
- **Unde se cheltuiesc**:
  - Construcție clădiri noi: `100 - 500 ByteCoins`.
  - Upgrade clădire (Nivel 1 $\to$ Nivel 5): `150 - 1.200 ByteCoins`.
  - Skin-uri pentru mascota Arky, teme de interfață, rame de avatar.

---

### 2.3. Scorul Metropolei Digitale (CyberCity Metrics 🏙️)
- **Scorul Orașului (`cityScore`)**: Măsura dezvoltării urban-tehnologice a elevului, calculat din:
  $$\text{City Score} = \text{Putere Calcul (TFlops)} \times 2 + \text{Capacitate Stocare (PB)} + \text{Bandă Rețea (Tbps)} \times 1.5 + \text{EcoScore} + \text{Grad Securitate}$$
- **Rangurile Orașului**:
  - *Nod Izolat* (0 - 499 pts)
  - *Sat Digital* (500 - 1.499 pts)
  - *Hub Cibernetic* (1.500 - 3.499 pts)
  - *Metropolă Inteligentă* (3.500 - 7.999 pts)
  - *Capitală Cuantică* (8.000+ pts)

---

### 2.4. Scorul de Duel (Duel Points & ELO ⚔️)
- **Scor Duel**: Punctaj competitiv ce crește cu fiecare victorie (+25 pts) și scade moderat la înfrângere (-10 pts, minim 0).
- Permite elevilor să urce în Divizii: Bronz, Argint, Aur, Platină, Diamant, Maestru TIC.

---

## 3. Standardul Pedagogic Reutilizabil pentru Lecții

### 3.1. Problema „Spam-Click-ului” și Soluția Anti-Viteză
În modulele clasice, unii elevi tindeau să apese rapid succesiv pe toate opțiunile A, B, C, D până nimereau varianta corectă în 1-2 secunde, fără să citească întrebarea sau noțiunile teoretice.

Pentru a asigura o învățare autentică, platforma introduce **Standardul Pedagogic de Reflecție**:

---

### 3.2. Regula Bufferului de Reflecție (Cooldown 5 secunde) ⏳
- **Declanșare**: În momentul în care elevul alege o variantă **greșită**.
- **Comportament**:
  1. Se redă sunetul specific de eroare (`sounds.playWrong()`).
  2. Toate opțiunile de răspuns devin **blocate (disabled)** timp de **exact 5 secunde**.
  3. Apare **Bara Vizuală de Countdown & Avertisment**:
     - *„Timp de reflecție: Reîncercare în 5s... 4s... 3s... 2s... 1s...”*
     - *„⚠️ Te rugăm să acorzi 5 secunde pentru a citi explicația de mai jos înainte de a alege alt răspuns!”*
  4. Se afișează caseta pedagogică ce explică **DE CE** varianta aleasă este greșită.
  5. După expirarea celor 5 secunde, butoanele se deblochează și elevul poate alege din nou conștient.

---

### 3.3. Algoritmul de Depreciere a Punctajului pe Încercări ⭐
Pentru a recompensa atenția și studiul prealabil, punctajul acordat per întrebare scade proporțional cu numărul de încercări:

| Încercare | Procent XP Acordat | Exemplu (Max 100 XP) | Insignă / Feedback |
| :--- | :---: | :---: | :--- |
| **Prima încercare (1st try)** | **100%** | **100 XP** | ⭐ **FĂRĂ GREȘEALĂ (PERFECT)** |
| **A 2-a încercare (după 1 cooldown)** | **60%** | **60 XP** | 💡 **Răspuns Corectat** |
| **A 3-a încercare sau mai mult** | **30%** | **30 XP** | 📖 **Concept Însușit prin Ghidaj** |

---

### 3.4. Structura Pedagogică a Întrebărilor & Explicațiilor
Fiecare întrebare din catalog respectă formatul `QuizOption`:
```typescript
export interface QuizOption {
  id: string;
  labelRo: string;        // Textul opțiunii în Română
  labelEn: string;        // Textul opțiunii în Engleză
  isCorrect: boolean;     // Indicator adevăr
  explanationRo: string;  // Explicație detaliată dacă alege această variantă
  explanationEn: string;  // Explicație în Engleză
}
```

**Regulă de aur**: *Nicio variantă greșită nu este lăsată fără explicație!* Fiecare opțiune greșită trebuie să explice confuzia tipică (de exemplu: *„SSD-ul folosește cipuri flash semiconductoare, nu platane magnetice!”*).

---

### 3.5. Componentele Reutilizabile Implementate
Toate se regăsesc în `src/components/common/`:

1. **`PedagogicalQuizCard.tsx`**: Card individual de întrebare cu cooldown de 5s, indiciu (Hint), pagină din manual și explicații.
2. **`PedagogicalQuizGroup.tsx`**: Coordonator de test complet (gestionează 3-10 întrebări succesive, bară de progres `1/5`, calcul acuratețe, ecran final cu sumar și opțiune de reluare pentru 100%).
3. **`usePedagogicalCooldown.tsx`**: Hook React (`usePedagogicalCooldown`) + componentă `<PedagogicalReflectionBanner cooldown={cooldown} />` pentru integrare rapidă în orice simulator custom.
4. **`AnswerExplanation.tsx`**: Caseta standard de explicație formativă cu suport de countdown integrat.
5. **`QuestionHint.tsx`**: Buton expandabil cu indiciu legat de programa școlară.

---

## 4. Catalogul Mini-Jocurilor Arcade (19 Jocuri)

Platforma conține 19 jocuri educative optimizate pentru dezvoltarea abilităților digitale. Fiecare joc salvează cel mai bun scor personal și concurează pentru **Recordul All-Time al Școlii**.

### 4.1. Tabel Centralizator Jocuri, Chei & Unități de Măsură

| # | Cheie Salvare (`arcadeScores`) | Nume Joc în Platformă | Competență Didactică | Unitate Măsură | Prag XP Recomandat |
| :-: | :--- | :--- | :--- | :---: | :---: |
| 1 | `typing` | **Speed Typing Master** | Viteză și acuratețe tastatură | `WPM` (Cuvinte/min) | $1 \text{ WPM} = 10 \text{ XP}$ |
| 2 | `mouse` / `mouse_v2` | **Mouse Agility & Reflex** | Coordonare cursor, dublu click, drag | `pts` / `ținte` | $1 \text{ pct} = 5 \text{ XP}$ |
| 3 | `game2048` | **2048 Binary / Bytes** | Puterile lui 2 (2, 4, 8, 16... 2048) | `pts` | $\text{Scor} / 10 \text{ XP}$ |
| 4 | `pcbuilder` | **PC Builder Pro: Asamblare** | Componente hardware & compatibilitate | `pts` | $\text{Scor complet} = 500 \text{ XP}$ |
| 5 | `cyber_dino` | **Cyber Dino: Matrix Rush** | Reflexe & obstacole cibernetice | `pts` / `m` | $1 \text{ m} = 1 \text{ XP}$ |
| 6 | `detective` | **CyberSafe Detective** | Identificare linkuri malițioase & phishing| `pts` (Cazuri) | $1 \text{ caz} = 100 \text{ XP}$ |
| 7 | `files` | **File Organizer Master** | Ierarhii foldere, extensii `.docx, .jpg` | `pts` | $1 \text{ fișier} = 25 \text{ XP}$ |
| 8 | `binary_factory` | **Binary Factory: Binar $\to$ Zecimal** | Conversii rapide bază 2 $\to$ bază 10 | `pts` | $1 \text{ conversie} = 50 \text{ XP}$ |
| 9 | `maze` | **Algorithm Maze Navigator** | Algoritmi, bucle repetitive, pași | `pts` / `nivel` | $1 \text{ nivel} = 100 \text{ XP}$ |
| 10 | `firewall` | **Firewall Defender** | Porturi, filtrare pachete, securitate | `pts` | $1 \text{ val} = 150 \text{ XP}$ |
| 11 | `rgb_pixel` | **RGB Pixel Master** | Canale de culoare (Red, Green, Blue) | `pts` / `%` | Acuratețe $\times 5 \text{ XP}$ |
| 12 | `byte_slider` | **Byte Slider 2048: 8-Bit** | Multipli de date (B, KB, MB, GB, TB) | `pts` | $\text{Scor} / 10 \text{ XP}$ |
| 13 | `file_drop` | **File Drop Catcher** | Recunoaștere tipuri MIME & extensii | `pts` | $1 \text{ drop} = 20 \text{ XP}$ |
| 14 | `virus_sweeper` | **Virus Sweeper (Minesweeper TIC)**| Logică deducție matricială & antivirus | `pts` | Rezolvare $= 300 \text{ XP}$ |
| 15 | `redstone_lab` | **Redstone Logic Lab** | Porți logice AND, OR, NOT, XOR | `pts` / `circuite` | $1 \text{ circuit} = 150 \text{ XP}$ |
| 16 | `voxel_architect` | **Voxel 3D Architect** | Coordonate spațiale X, Y, Z & volume | `Blox` | $1 \text{ structură} = 200 \text{ XP}$ |
| 17 | `roblox_clicker` | **Roblox Dev Clicker** | Economie de cod & optimizare scripturi | `pts` | Multiplicator $\times 10 \text{ XP}$ |
| 18 | `page_craft` | **PageCraft Master: HTML/Word** | Structură document & tag-uri | `pts` | $1 \text{ pagină} = 150 \text{ XP}$ |
| 19 | `duel_arena` | **Arena Campionilor (PvP)** | Dueluri sincronizate în direct | `victorii` | $1 \text{ victorie} = 50 \text{ XP}$ |

---

### 4.3. Sistemul Eficient de Recorduri All-Time (Optimizat NoSQL)

#### Problema Inițială:
O căutare naivă (`getAllStudents()`) descarcă sute de profile din baza de date la fiecare încărcare a paginii Arcade, generând costuri uriașe de citire și latență pe conexiuni școlare slabe.

#### Soluția de Arhitectură Adoptată:
Am implementat colecția dedicată **`recorduri_jocuri`** în Firestore, unde fiecare joc are un singur document mic indexat direct după `gameId` (ex: `/recorduri_jocuri/typing`):

```json
{
  "gameId": "typing",
  "holderId": "elev_gigi_123",
  "holderName": "Gigi",
  "holderAvatar": "⚡",
  "score": 88,
  "unit": "WPM",
  "achievedAt": "2026-10-03T19:42:00Z"
}
```

- **La citire**: Se face o singură interogare `getDocs(collection(db, 'recorduri_jocuri'))` (doar 19 documente ușoare) sau se citește din cache-ul local.
- **La stabilirea unui nou record**: Dacă scorul obținut de un elev depășește recordul existent, se execută o singură scriere directă `setDoc(doc(db, 'recorduri_jocuri', gameId), newRecord)`.
- **Eficiență**: `O(1)` per joc, `0` scanări de tabele mari, consum minim de rețea.

---

## 5. Structura Lecțiilor & Modulelor Didactice

Fiecare modul conține niveluri progresive. În fiecare nivel există sarcini interactive și quiz-uri coordonate.

### 5.1. Modul 1: Hardware & Arhitectura Calculatorului (`hardware`)
- **Nivel 1**: Reguli de ergonomie & siguranță în laboratorul de informatică (100 XP).
- **Nivel 2**: Linia timpului & generațiile de calculatoare (ENIAC $\to$ Microprocesoare) (150 XP).
- **Nivel 3**: Asamblarea unității centrale (Placă de bază, CPU, RAM, GPU, Sursă, Cooler) (200 XP).
- **Nivel 4**: Sortarea perifericelor (Intrare, Ieșire, Intrare/Ieșire, Stocare) (150 XP).
- **Nivel 5**: Test de verificare a cunoștințelor, biți, octeți și calcule de capacitate (250 XP).
- **Total Modul**: **850 XP**.

### 5.2. Modul 2: Organizarea Datelor & Sistemul de Operare (`files`)
- **Nivel 1**: Structura arborescentă a fișierelor & foldere rădăcină (100 XP).
- **Nivel 2**: Selecție multiplă (`Ctrl + Click`, `Shift + Click`, `Ctrl + A`) & Căutare (150 XP).
- **Nivel 3**: Operații de mutare, copiere & comenzi rapide (`Ctrl+C`, `Ctrl+X`, `Ctrl+V`) (150 XP).
- **Nivel 4**: Redenumire, extensii de fișiere & proprietăți (Read-Only, Hidden) (150 XP).
- **Nivel 5**: Coșul de reciclare (Recycle Bin), restaurare & ștergere permanentă (`Shift+Delete`) (200 XP).
- **Total Modul**: **750 XP**.

### 5.3. Modul 3A & 3B: Rețele, Internet, Siguranță & Identitate Digitală (`internet1`, `internet2`)
- **3A.1**: Noțiuni de bază despre rețele & cum circulă pachetele TCP/IP (150 XP).
- **3A.2**: Servicii Internet (WWW, Email, FTP, Telnet, IRC) (150 XP).
- **3A.3**: Rebus & Cuvinte încrucișate TIC (100 XP).
- **3A.4**: Anatomia unei adrese web (Protocol `https://`, Subdomeniu, Domeniu, TLD, Cale) (150 XP).
- **3A.5**: Laborator de navigare în browser & motoare de căutare (150 XP).
- **3A.6**: Scutul împotriva amenințărilor online (Viruși, Phishing, Malware) (200 XP).
- **3B.1 - 3B.6**: Evaluarea critică a informațiilor, Netichetă, Drepturi de autor (Copyright) & Parole sigure (900 XP).
- **Total Modul 3A + 3B**: **1.800 XP**.

### 5.4. Modul 4A & 4B: Editare de Text & Tehnoredactare Digitală (`text1`, `text2`)
- **4A.1 - 4A.7**: Interfața editorului de text, reguli de tastare corectă a semnelor de punctuație, formatare fonturi, aliniere paragrafe, liste numerotate/marcate, Căutare & Înlocuire (`Ctrl+H`), redactare document complet (1.000 XP).
- **4B.1 - 4B.7**: Tabele (creare, formatare celule, îmbinare), imagini (redimensionare, încadrare în text `Wrap Text`), forme geometrice, casete text, antet & subsol (Header/Footer), numere de pagină (1.200 XP).
- **Total Modul 4A + 4B**: **2.200 XP**.

### 5.5. Modul 5A & 5B: Grafică Digitală 2D & 3D (`graphics1`, `graphics2`)
- **5A.1 - 5A.5**: Grafică vectorială vs raster (pixeli), rezoluție DPI, modele de culoare (RGB vs CMYK), decupare și straturi (Layers) (800 XP).
- **5B.1 - 5B.5**: Modelare 3D, axe de coordonate (X, Y, Z), translație, rotație, scalare, randare (1.000 XP).
- **Total Modul 5A + 5B**: **1.800 XP**.

---

## 6. Arhitectura Bazei de Date & Persistența Datelor

Sistemul este construit pe o arhitectură **Offline-First & Cloud-Synced**, asigurând funcționarea impecabilă atât când laboratorul are conexiune slabă la internet, cât și la sincronizarea pe mai multe dispozitive.

```
                  ┌─────────────────────────────────────────┐
                  │          INTERFAȚA APLICAȚIEI           │
                  │   (Lecții, Mini-Jocuri, Profil, Oraș)   │
                  └────────────────────┬────────────────────┘
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
            ┌──────────────────────────┐┌──────────────────────────┐
            │   LOCAL STORAGE CACHE    ││    FIRESTORE DATABASE    │
            │  (Salvare Imediată 0ms)  ││ (Sincronizare Asincronă) │
            │  - `arkedo_active_user`  ││ - Colecția `elevi`       │
            │  - `arkedo_highscores_*` ││ - Colecția `recorduri_*` │
            │  - `cybercity_progres_*` ││ - Colecția `solicitari_*`│
            └──────────────────────────┘└──────────────────────────┘
```

### 6.1. Schema Colecției `elevi` (Document: `/elevi/{studentId}`)
```json
{
  "id": "elev_gigi_abc123",
  "username": "Gigi",
  "usernameLower": "gigi",
  "passwordHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "avatar": "⚡",
  "totalXP": 2450,
  "byteCoins": 1250,
  "arcadeScores": {
    "typing": 88,
    "mouse": 420,
    "game2048": 2048,
    "pcbuilder": 500,
    "detective": 12,
    "files": 450,
    "binary_factory": 650,
    "maze": 8,
    "firewall": 1200,
    "rgb_pixel": 98,
    "totalArcade": 5866
  },
  "lessonsProgress": {
    "hardware": { "completed": true, "level": 5, "score": 850, "elapsedSeconds": 420 },
    "files": { "completed": true, "level": 5, "score": 750, "elapsedSeconds": 380 },
    "internet1": { "completed": true, "level": 6, "score": 900, "elapsedSeconds": 510 },
    "internet2": { "completed": false, "level": 3, "score": 450, "elapsedSeconds": 240 },
    "totalLessonScore": 2950
  },
  "duelStats": {
    "wins": 14,
    "losses": 3,
    "matchesPlayed": 17,
    "duelPoints": 350
  },
  "cyberCity": {
    "cityName": "Gigiopolis",
    "gridSize": 5,
    "buildings": {
      "0": { "tileIndex": 0, "typeId": "datacenter", "level": 2, "builtAt": 1728000000000 },
      "1": { "tileIndex": 1, "typeId": "solar_matrix", "level": 3, "builtAt": 1728000000000 }
    },
    "likesCount": 5,
    "resolvedIncidentsCount": 8
  },
  "equipped": {
    "arkySkin": "cyber",
    "theme": "matrix",
    "title": "Arhitect TIC",
    "avatarFrame": "neon"
  },
  "createdAt": "2026-10-01T08:00:00.000Z",
  "lastActiveAt": "2026-10-04T07:45:00.000Z"
}
```

---

### 6.2. Schema Colecției `recorduri_jocuri` (Document: `/recorduri_jocuri/{gameId}`)
```json
{
  "gameId": "typing",
  "holderId": "elev_gigi_abc123",
  "holderName": "Gigi",
  "holderAvatar": "⚡",
  "score": 88,
  "unit": "WPM",
  "achievedAt": "2026-10-03T19:42:00.000Z"
}
```

---

### 6.3. Schema Colecției `solicitari_jocuri` (Document: `/solicitari_jocuri/{requestId}`)
Permite elevilor să trimită o cerere profesorului pentru deblocarea unui joc din Arcade:
```json
{
  "id": "req_789xyz",
  "studentId": "elev_gigi_abc123",
  "studentName": "Gigi",
  "studentAvatar": "⚡",
  "gameId": "voxel_architect",
  "gameTitle": "Voxel 3D Architect",
  "status": "pending",
  "requestedAt": "2026-10-04T07:30:00.000Z"
}
```

---

### 6.4. Securitate & Reguli Firestore (`firestore.rules`)
Regulile implementate garantează integritatea datelor:
- Oricine poate citi clasamentul elevilor și recordurile all-time.
- Un elev poate scrie/actualiza doar propriul profil sau poate înregistra un nou record all-time dacă scorul său este strict mai mare decât cel existent.
- Profesorul (sau contul cu permisiuni de management) poate aproba sau respinge cereri de deblocare de jocuri.

---

## 7. Gânduri Complexe & Strategie pentru Sprintul Viitor

Pentru sprintul viitor, având acum toate standardele documentate și unificate, se vor aborda următoarele optimizări:

1. **Echilibrarea Economiei Circulare (ByteCoins Sink & Faucet)**:
   - Stabilirea unui raport optim între timpul de învățare (XP generat) și puterea de cumpărare în CyberCity.
   - Introducerea de evenimente sezoniere în CyberCity (ex: *Târgul de Inovație Digitală* unde se deblochează clădiri legendare cu cerințe de note la lecții).
2. **Extinderea Standardului Pedagogic pe Toate Nivelurile din Text 1/2 și Grafică**:
   - Înlocuirea tuturor verificărilor ad-hoc cu `PedagogicalQuizCard` și `PedagogicalQuizGroup`.
   - Asigurarea că fiecare întrebare are 1 indiciu (Hint) și explicații complete pentru toate cele 4 variante de răspuns.
3. **Sistem de Teme & Misiuni Săptămânale Trimise de Profesor**:
   - Posibilitatea ca profesorul să marcheze 2 lecții și 1 joc ca „Misiunea Săptămânii”, oferind un multiplicator `1.5x XP` elevilor care le finalizează în termen.
4. **Export Portofoliu & Adeverință Digitală**:
   - Generarea unui PDF/Card vizual de absolvire a modulului cu competențele TIC dobândite (conform programei Ministerului Educației).

---
*Document redactat și sincronizat cu baza de date ARKEDO TIC — Versiunea 1.0 (Octombrie 2026)*
