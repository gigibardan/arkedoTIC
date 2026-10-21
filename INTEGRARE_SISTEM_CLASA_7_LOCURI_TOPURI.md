# 🏙️ Harta Integrării Totale — Clasa a VII-a: Locuri, Topuri & Economie

> **Documentație Tehnică & Didactică ArkyEdu**  
> **Subiect:** Integrarea completă a materiei de Clasa a VII-a (Editura Art Klett / OMEN 3393/2017 & OM 5420/2024) în toate subsistemele platformei: Cyber City (Locurile), Leaderboard (Topurile), Arcade & Dueluri, Magazin & Personalizare, Portalul Profesorilor și SEO.

---

## 🏛️ 1. Harta „Locurilor” — Metropola Digitală (Cyber City)

În ArkyEdu, **Cyber City** este orașul digital construit de fiecare elev prin acumularea de ByteCoins și finalizarea lecțiilor curriculare. Progresul în Clasa a VII-a deblochează **un nou nivel de dezvoltare urbană**, introducând 6 clădiri exclusive de clasa a 7-a:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              NOILE CLĂDIRI CYBER CITY PENTRU CLASA A VII-A                             │
├──────────────────────┬──────────────────────┬────────────────────────┬─────────────────────────────────┤
│ ID Clădire           │ Denumire Clădire     │ Misiune de Deblocare   │ Rol & Beneficii Urbane          │
├──────────────────────┼──────────────────────┼────────────────────────┼─────────────────────────────────┤
│ `press_center`       │ Casa Presei Digitale │ Modulul 1 (Word &      │ +40 Securitate Tipografică      │
│                      │                      │ Tipografie Avansată)   │ +80 Populație, +15 PB Cloud     │
├──────────────────────┼──────────────────────┼────────────────────────┼─────────────────────────────────┤
│ `wave_sound_studio`  │ Studioul Acustic     │ Modulul 2A (Acustică & │ +30 Frecvență Audio Curată      │
│                      │                      │ WavePad Audio)         │ +120 Populație, +25 TFlops      │
├──────────────────────┼──────────────────────┼────────────────────────┼─────────────────────────────────┤
│ `videopad_cinema`    │ Cinematograful Video │ Modulul 2B (VideoPad & │ +50 Lățime de Bandă (Tbps)      │
│                      │                      │ Montaj Video Timeline) │ +200 Populație, +35 PB Media    │
├──────────────────────┼──────────────────────┼────────────────────────┼─────────────────────────────────┤
│ `gis_observatory`    │ Observatorul GIS     │ Modulul 3B (Cartografie│ +45 EcoScore, +30 GPS Satelit   │
│                      │                      │ & Sisteme GIS)         │ +150 Populație Ecologică        │
├──────────────────────┼──────────────────────┼────────────────────────┼─────────────────────────────────┤
│ `cpp_academy`        │ Academia C++ &       │ Modulele 4 & 5 (C++    │ +120 TFlops Putere de Calcul    │
│                      │ Algoritmi Textuali   │ Variabile, I/O, Bucle) │ +50 Securitate Cibernetică      │
├──────────────────────┼──────────────────────┼────────────────────────┼─────────────────────────────────┤
│ `robotics_hangar`    │ Hangarul Roboților   │ Modulul 6B (Roboți     │ +150 Automatizare Robotică      │
│                      │ Autonomi & Senzori   │ Virtuali & Senzori)    │ +60 EcoScore, +250 Populație    │
└──────────────────────┴──────────────────────┴────────────────────────┴─────────────────────────────────┘
```

### Mecanismul de Deblocare & Economie Urbană:
1. **Deblocarea Parcelelor Speciale**: Elevii care încep Clasa a VII-a deblochează parcelele exterioare din gridul Cyber City (teren extins 5x5).
2. **Recompense în ByteCoins**: Fiecare misiune de a 7-a finalizată aduce între 40 și 100 ByteCoins.
3. **Upgrade de Nivel Clădire (Nivel 1 -> Nivel 3)**: Fiecare clădire are 3 niveluri de evoluție (ex: *Mini Studio Acustic* -> *Radio Școlar* -> *Complex Național de Producție Audio*).
4. **Metrice Urbane Noi**:
   - *Putere de Compilare C++ (TFlops)*
   - *Densitate Satelitară GIS (% acoperire GPS)*
   - *Rată de Eșantionare Audio (kHz fără distorsiuni)*

---

## 🏆 2. Harta „Topurilor” — Clasamente & Leaderboards

Platforma include un sistem complet de clasamente (`LeaderboardSection.tsx`) care este extins pentru Clasa a VII-a:

### A. Clasamentul General (Total XP)
- Scorul total este recalculat prin funcția `computeLessonXP(student.lessonsProgress)`, adăugând punctajele celor 12 misiuni de clasa a VII-a.
- Punctaj maxim suplimentar accesibil: **+1940 XP**.

### B. Filtrarea pe Nivel de Clasă
În antetul clasamentului, adăugăm butonul dedicat:
```
[ 🌐 Toate ]  [ 🎒 Clasa a V-a ]  [ 🚀 Clasa a VI-a ]  [ 🔬 Clasa a VII-a ]
```
Când este selectată **Clasa a VII-a**:
- Sunt afișați elevii sortați descrescător după scorul specific obținut la C++, Tipografie, Montaj Video, GIS și Robotică.
- Se acordă titlul onorific de „Lider al Algoritmilor” primilor 3 clasați.

### C. Topul Școlilor & Topul Județelor
- Fiecare punct de XP câștigat în misiunile de a VII-a contribuie direct la punctajul general al școlii înscrise în platformă.
- Școlile cu elevi activi la C++ primesc insigna specială de aur „Liceu / Gimnaziu de Excelență STEM”.

### D. Topul Arhitecților Cyber City
- Clasament distinct al elevilor ordonați după dezvoltarea metropolei (populație totală, TFlops de calcul, EcoScore).
- Clădirile de clasa a 7-a oferă un salt masiv în acest clasament datorită bonusurilor de automatizare robotică și cloud.

---

## 🎮 3. Arky Arcade & Arena Duelurilor 1v1 (PVP Didactic)

Pentru a consolida conceptele teoretice prin joc competitiv și reflexe rapide, adăugăm 4 moduri adaptate:

### 1. `cpp_blitz` — C++ Syntax Blitz (Duel 1v1 & Solo Arcade)
- **Format**: Duel de 60 de secunde în timp real între doi colegi.
- **Mecanică**: Pe ecran apar secvențe rapide de cod C++. Jucătorii trebuie să apese instant pe eroarea ascunsă (ex: `;` lipsă la finalul liniei, atribuire `=` în loc de comparație `==` în `if`, variabilă nedeclarată, `cout >>` scris greșit cu operator inversat).
- **Punctaj**: +100 puncte per identificare corectă, multiplicator combo pentru viteză.

### 2. `waveform_master` — Waveform Master (Arcade Acustic)
- **Format**: Mini-joc ritmic audio bazat pe WebAudio API.
- **Mecanică**: Elevul reglează frecvența (Hz) și aplică filtre de reducere a zgomotului pentru a alinia două unde sonore desincronizate.
- **Punctaj**: Se punctează acuratețea sincronizării și viteza de eliminare a zgomotului de fond.

### 3. `robot_maze` — Robot Maze Runner (Duel 1v1)
- **Format**: Concurs de algoritmi și strategie pe scenă 2D.
- **Mecanică**: Fiecare jucător își echipează robotul virtual cu senzori (distanță, urmărire de linie) și trimite un set de instrucțiuni de deplasare. Câștigă robotul care străbate labirintul primul fără să lovească obstacolele dinamice!

### 4. `typo_detective` — Typo Detective (Arcade Tipografie & TIC)
- **Format**: Vânătoare de greșeli contra cronometru.
- **Mecanică**: Text dactilografiat cu diacritice lipsă, spații înainte de virgulă, ghilimele englezești sau apăsări abuzive de Enter. Jucătorul dă click pe erori pentru a le corecta și a salva manuscrisul!

---

## 🛍️ 4. Magazinul Arky (Shop) & Inventar Personalizat

Noi obiecte cosmetice și de recunoaștere academică deblocate exclusiv prin finalizarea misiunilor de clasa a VII-a:

| Obiect | Tip | Cost (ByteCoins) | Condiție de Deblocare |
|---|---|---|---|
| **Arky C++ Hacker** | Skin Avatar | 350 | Absolvirea Modulului 4 & 5 (C++) |
| **Arky Sound Master** | Skin Avatar | 300 | Absolvirea Modulului 2 (Audio-Video) |
| **Arky Cyber Roboteer**| Skin Avatar | 450 | Absolvirea Modulului 6 (Robotică) |
| **Arky GIS Explorer** | Skin Avatar | 280 | Absolvirea Modulului 3 (GIS) |
| **Rama „Syntax Glow”**| Avatar Frame | 200 | Minim 1500 XP acumulat |
| **Rama „Hexagon Sensor”**| Avatar Frame| 250 | Misiunea 6B completată cu scor 100% |
| **Titlul „Maestru C++”**| Titlu Profil| Gratuit | Obținut la finalizarea tuturor testelor C++ |
| **Titlul „Sound Designer”**| Titlu Profil| Gratuit | Obținut la finalizarea misiunii WavePad |

---

## 👨‍🏫 5. Portalul Profesorilor & Panoul SuperAdmin

1. **Fișe de Lucru Descărcabile (PDF)**:
   - Fişa 1: *Reguli tipografice și tehnoredactare Word*.
   - Fişa 2: *Unde sonore, frecvențe și efecte audio*.
   - Fişa 3: *Probleme C++ cu structură liniară și operatori aritmetici*.
   - Fişa 4: *Probleme C++ cu decizii `if-else` și bucle `while`/`for`*.
   - Fişa 5: *Navigarea roboților virtuali și senzori de distanță*.
2. **Monitorizare Progres & Note**:
   - Profesorii pot filtra clasa după „Clasa a VII-a A” sau „Clasa a VII-a B”.
   - Matricea de competențe OMEN 3393/2017: progres automat per elev (1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1, 3.2, 3.3).
3. **Mesagerie & Asistență Didactică**:
   - Integrare directă a mesajelor de contact din formular pentru profesori și inspectori școlari.

---

## 🌐 6. Integrare SEO & Ghiduri Curriculare Publice

Cele 12 ghiduri curriculare de Clasa a VII-a sunt expuse în mod public pentru profesori, părinți și elevi pe web:
- Include meta-taguri OpenGraph, schema.org `Course` și `EducationalOccupationalCredential`.
- Integrate în Footer-ul universal ArkyEdu cu linkuri directe.
- Înregistrate în fișierele de instruire LLM (`/llms.txt`, `/llms-full.txt`) pentru asistenții de învățare AI.

---

## ✅ Concluzie & Coeziune

Prin această structurare, Clasa a VII-a este complet integrată în:
- **Lecțiile & Simulațiile Practice** (12 misiuni active).
- **Locurile din Cyber City** (6 clădiri noi de nivel 7).
- **Topurile & Clasamentele Școlare** (Total XP, clasament pe clase, top școli).
- **Jocurile Arcade & Duelurile PvP** (4 moduri noi).
- **Economia & Magazinul Arky** (ByteCoins, skin-uri, titluri).
- **Managementul Educațional** (Portal profesori, fișe PDF, rapoarte de competențe).
