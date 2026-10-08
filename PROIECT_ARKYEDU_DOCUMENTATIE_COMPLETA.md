# 🚀 ArkyEdu — Platformă Educațională Interactivă de Informatică & TIC (Clasa a V-a)
> **Documentație Completă de Arhitectură, Tehnologie, Conținut Didactic și Mod de Funcționare**  
> *Conformă cu programa școlară oficială și manualul „Informatică și TIC Clasa a V-a”, Editura Art Klett (Autori: Mihaela & Valeriu Giurgiulescu)*

---

## 1. 🌟 Prezentare Generală & Viziune

**ArkyEdu** este o platformă web modernă de e-learning și gamification dedicată elevilor de gimnaziu și profesorilor de Informatică și TIC. Platforma transformă învățarea noțiunilor abstracte de tehnologie, arhitectură hardware, sisteme de operare, rețele, tehnoredactare și programare vizuală într-o aventură captivantă prin:
- **66 de ecrane didactice interactive** structurate în 10 mari misiuni curriculare.
- **Laboratorul Arcade TIC** cu 18 mini-jocuri aplicate (simulatoare, machetare, logică, viteză de tastare, programare cu blocuri).
- **Arena Duel 1v1 în Direct**: bătălii multiplayer în timp real între colegi pe calculatoare diferite.
- **CyberCity 3D Builder**: un oraș virtual dezvoltat și alimentat prin punctele și monedele obținute la lecții.
- **Mascota Inteligentă Arky**: asistent robotizat interactiv cu sinteză vocală (TTS), reacții emoționale, sfaturi didactice și skin-uri deblocate în magazin.
- **Portal pentru Profesori (`/profesor`)**: catalog digital, generare coduri de clasă, monitorizare progres în timp real, acordare punctaje bonus și generare diplome de absolvire.

---

## 2. 💻 Stack Tehnologic (Tehnologii Utilizate)

| Strat / Categorie | Tehnologie / Bibliotecă | Rol & Justificare |
| :--- | :--- | :--- |
| **Framework UI** | **React 19** (SPA) | Componentizare modulară, randare reactivă, hooks avansate, viteză optimă |
| **Limbaj** | **TypeScript 5.7** | Tipizare statică strictă a modelelor de date, interfețelor didactice și stărilor |
| **Build Tool & Bundler** | **Vite 6** | Pornire ultra-rapidă, Hot Module Replacement (HMR), build de producție optimizat |
| **Styling & Design System** | **Tailwind CSS v4** | Stiluri utilitare moderne (`@import "tailwindcss";`), temă Cyber/Arcade Dark-Mode |
| **Iconografie Vectorială** | **Lucide React** | Peste 100 de pictograme clare pentru hardware, fișiere, muzică, rețele, decizii |
| **Efecte & Gamification** | **canvas-confetti** | Efecte de particule și artificii la absolvirea nivelelor și festivitatea diplomelor |
| **Sinteză Audio Retro** | **Web Audio API** (`src/utils/audio.ts`) | Sunete arcade sintetizate dinamic (click, coin, powerup, laser, greșeală, fanfară) fără dependențe externe greoaie |
| **Sintetizator MIDI Scratch** | **Web Audio API Synth** (`src/utils/scratchMusicSynth.ts`) | Sinteză în timp real a instrumentelor muzicale (Pian, Sintetizator, Flaut) și a notelor MIDI pe frecvențe fizice exacte |
| **Sinteză Vocală (TTS)** | **Web Speech API** (`SpeechSynthesis`) | Voce robotizată nativă în limba română/engleză pentru replicile și explicațiile lui Arky |
| **Bază de Date & Auth** | **Google Firebase Firestore** | Persistență în cloud, autentificare elevi/profesori, sincronizare instantanee camere duel |
| **Persistență Locală** | **LocalStorage API** (cu fallback) | Arhitectură Offline-First: elevul poate progresa chiar și fără conexiune la internet, datele sincronizându-se automat când reapare rețeaua |

---

## 3. 🗺️ Structura Conținutului Curricular (Clasa a V-a Art Klett)

Materia este structurată pe **6 mari Unități de învățare**, fiecare împărțită în două submodule sau misiuni de explorare (A și B), însumând **66 de ecrane interactive**:

### 📦 Unitatea 1: Arhitectura Sistemului de Calcul & Ergonomie (pag. 10–20)
*Misiunea 1: Hardware Hero (5 Ecrane)*
1. **Ergonomia și Sănătatea la Calculator**: Poziția corectă a spatelui, distanța față de monitor, pauzele pentru ochi, reguli de siguranță electrică.
2. **Istoria și Generațiile Calculatoarelor**: De la ENIAC și tranzistori până la microprocesoare și calculatoare cuantice.
3. **Laboratorul 3D de Asamblare a Unității Centrale**: Placa de bază, Procesorul (CPU), Memoria RAM, Placa video, Sursa de alimentare și Stocarea (SSD/HDD).
4. **Sortarea Perifericelor**: Clasificare interactivă în periferice de Intrare, Ieșire și Intrare/Ieșire (tastatură, mouse, monitor, boxe, touchscreen).
5. **Codificarea Binară & Unități de Măsură**: Bit (0 și 1), Byte/Octet, KB, MB, GB, TB, cu exerciții practice de conversie.

### 📁 Unitatea 2: Sistemul de Operare, Fișiere & Foldere (pag. 22–30)
*Misiunea 2: Secret Tree Explorer (7 Ecrane)*
1. **Interfața Sistemului de Operare**: Desktop, ferestre, bara de activități (Taskbar), meniul Start, pictograme.
2. **Memoria de Date & Discuri Logice**: Organizarea partițiilor (C:, D:), stick-uri USB și unități optice.
3. **Structura Ierarhică a Folderelor**: Arborele de directoare, folder părinte și subfoldere.
4. **Selectarea & Căutarea Fișierelor**: Selecție multiplă cu tastele `Ctrl` și `Shift`, căutare după extensie (`*.docx`, `*.png`).
5. **Redenumire & Proprietăți**: Schimbarea numelui, verificarea dimensiunii, datei creării și a tipului de fișier.
6. **Copiere, Mutare & Scurtături**: Tehnici Drag-and-Drop, scurtături de tastatură (`Ctrl+C`, `Ctrl+X`, `Ctrl+V`).
7. **Coșul de Reciclare (Recycle Bin)**: Ștergerea temporară, restaurarea fișierelor și golirea definitivă a coșului.

### 🌐 Unitatea 3A: Internet, Rețele & World Wide Web (pag. 32–36)
*Misiunea 3A: Web Explorer (6 Ecrane)*
1. **Ce este Internetul?**: Rețeaua globală de calculatoare interconectate și protocoalele de comunicare.
2. **Browsere vs. Motoare de Căutare**: Diferența fundamentală între aplicația browser (Chrome, Edge, Firefox) și serviciul de indexare (Google, Bing).
3. **Anatomia unei Adrese Web (URL)**: Protocol (`https://`), domeniu (`arkyedu.ro`), cale (`/cursuri`).
4. **Hiperlinkuri & Navigare Web**: Structura legăturilor web, ancore, butoane Înainte/Înapoi și Favorite (Bookmarks).
5. **Descărcarea Responsabilă a Fișierelor**: Salvarea imaginilor și documentelor, verificarea securității fișierelor descărcate.
6. **Drepturi de Autor & Plagiat**: Reguli de citare, licențe libere (Creative Commons) și respectarea muncii creatorilor online.

### 🛡️ Unitatea 3B: Comunicare Online & Securitate Cibernetică (pag. 38–48)
*Misiunea 3B: Cyber Shield (6 Ecrane)*
1. **Poșta Electronică (E-mail)**: Structura unei adrese de mail, Căsuța de primire (Inbox), Subiect, Destinatari (To, CC, BCC).
2. **Eticheta în Comunicarea Online (Netiquette)**: Tonul respectuos, evitarea scrierii exclusive cu majuscule (ceea ce semnifică țipat), politețe digitală.
3. **Parole Puternice & Autentificare**: Crearea de parole complexe (litere mari, mici, cifre, simboluri) și evitarea datelor personale evidente.
4. **Detecția Phishing-ului & Virușilor**: Identificarea mesajelor capcană, a linkurilor malițioase și a atașamentelor suspecte.
5. **Protecția Datelor Personale (GDPR)**: Ce informații NU se divulgă niciodată pe internet (adresă, parolă, CNP, număr de telefon).
6. **Cyberbullying & Prevenirea Hărțuirii**: Măsuri de siguranță, blocarea utilizatorilor toxici și raportarea situațiilor către un adult de încredere.

### 📝 Unitatea 4A: Tehnoredactare Text: Fonturi & Paragrafe (pag. 50–67)
*Misiunea 4A: Word Master I (7 Ecrane)*
1. **Interfața Microsoft Word / LibreOffice Writer**: Panglica de comenzi (Ribbon), Bara de titlu, Rigla și Bara de stare.
2. **Reguli de Aur la Tastare**: Spațiul întotdeauna după semnul de punctuație, folosirea tastei `Enter` doar la final de paragraf, diacritice românești (ă, î, ș, ț, â).
3. **Formatarea Fontului**: Familie de caractere, dimensiune (pt), stiluri (Bold, Italic, Underline), culori și evidențiere (Highlight).
4. **Alinierea Paragrafelor**: Stânga, Centrat, Dreapta și Justify (aliniat la ambele margini), spațierea rândurilor (Line Spacing).
5. **Indentare & Spațiere Paragraf**: Alineat prima linie (First Line Indent), spațiere înainte și după paragraf.
6. **Liste Marcate & Numerotate**: Bullets grafice, liste ordonate cu numere și ierarhii pe mai multe niveluri.
7. **Căutare & Înlocuire (Find & Replace)**: Verificarea ortografică automată și corectarea rapidă a cuvintelor repetate.

### 📊 Unitatea 4B: Elemente Grafice, Tabele & Paginare în Word (pag. 68–80)
*Misiunea 4B: Word Master II (7 Ecrane)*
1. **Inserarea Imaginilor**: Poziționare în text (In Line with Text, Square, Tight), redimensionare proporțională.
2. **Forme Geometrice (Shapes)**: Desenare dreptunghiuri, săgeți, stele, casete de text și gruparea lor.
3. **Crearea Tabelelor**: Linii, coloane, celule, navigarea cu tasta `Tab`.
4. **Editarea Tabelelor**: Îmbinare celule (Merge), divizare celule (Split), adăugare/ștergere rânduri și coloane.
5. **Formatarea & Stilurile de Tabel**: Borduri colorate, umbrire celule (Shading) și alinierea conținutului în celulă.
6. **Paginarea Documentului**: Orientare pagină (Portret vs. Peisaj), margini de pagină (Margins) și numerotarea paginilor (Page Number).
7. **Laboratorul Final de Machetare**: Crearea unei reviste școlare complete cu text pe 2 coloane, imagini încadrate și tabel recapitulativ.

### 🧩 Unitatea 5A: Noțiunea de Algoritm & Algoritmi Liniari (pag. 54–61)
*Misiunea 5A: Logic Steps (7 Ecrane)*
1. **Ce este un Algoritm?**: Definiție, originea numelui (Al-Khwarizmi), pași ordonați în viața reală (prepararea ceaiului, traversarea străzii).
2. **Proprietățile Fundamentale ale Algoritmilor**: Finitudine (se termină în timp util), Claritate/Determinism (fără ambiguități), Generalitate (rezolvă o clasă întreagă de probleme).
3. **Date de Intrare, Manevră și Ieșire**: Ce primim la start, ce prelucrăm și ce rezultat obținem.
4. **Executantul Algoritmului**: Cine realizează pașii (om, robot, calculator) și respectarea riguroasă a comenzilor.
5. **Algoritmi Liniari / Secvențiali**: Instrucțiuni executate una după alta, pas cu pas, fără ramificații.
6. **Reprezentarea prin Pași Textuali (Pseudocod)**: `Pas 1: Citește A`, `Pas 2: B = A * 2`, `Pas 3: Scrie B`.
7. **Laboratorul Interactiv de Ordonare**: Ordonarea prin tragere a pașilor pentru roboțelul TIC și validarea algoritmului.

### 🔀 Unitatea 5B: Structuri Decizionale & Scheme Logice (pag. 62–71)
*Misiunea 5B: Logic Flow (7 Ecrane)*
1. **Blocurile Schemelor Logice**: Bloc de Start/Stop (oval), Bloc de Prelucrare/Calcul (dreptunghi), Bloc de Intrare/Ieșire (paralelogram).
2. **Blocul de Decizie (Condiție)**: Rombul de decizie cu două ramuri de ieșire: `DA` (Adevărat) și `NU` (Fals).
3. **Expresii Logice & Operatori Relaționali**: Egal (`=`), Diferit (`≠`), Mai mic (`<`), Mai mare (`>`), Mai mic sau egal (`≤`).
4. **Structura Alternativă (Dacă... Atunci... Altfel)**: Luarea deciziilor în funcție de o condiție îndeplinită sau nu.
5. **Exemple din Viața Reală**: „Dacă plouă afară, ia umbrela; Altfel ia șapca de soare”.
6. **Simulatorul Interactiv de Scheme Logice**: Conectarea vizuală a blocurilor și simularea execuției cu numere concrete.
7. **Laboratorul Decizional „Număr Par sau Impar”**: Algoritm complet reprezentat în schemă logică și validat cu date de test.

### 🐱 Unitatea 6A: Scratch 1: Primii Pași, Interfață & Grafică (pag. 72–83)
*Misiunea 6A: Scratch Intro (7 Ecrane)*
1. **Limbajul Vizual Bazat pe Blocuri**: Mitchel Resnick și MIT Media Lab; blocuri tip puzzle care elimină erorile de sintaxă; link direct integrat către Scratch Oficial.
2. **Interfața Scratch 3.0 & Sistemul de Coordonate**: Scena de 480x360 px, centrul `(x: 0, y: 0)`, limitele `X [-240, 240]` și `Y [-180, 180]`, Steag Verde (Start) și Buton Stop.
3. **Cele 9 Categorii de Blocuri Colorate**: Mișcare (albastru), Aspect (mov), Sunet (roz), Evenimente (galben), Control (portocaliu), Senzori (bleu), Operatori (verde), Variabile (portocaliu închis), Extensii.
4. **Primul Script Liniar RoboTIC**: Glisare la coordonate, replici cu bule de dialog (`spune ... pentru 2 secunde`) și redare de efecte audio.
5. **Variabile în Scratch**: Crearea variabilelor, `setează variabila la...`, `modifică variabila cu...`, afișarea valorii pe ecran.
6. **RoboOperații Matematice**: Blocuri de calcul ($+$, $-$, $*$, $/$, $\text{mod}$) și concatenarea de texte (`alătură "Salut " și nume`).
7. **Extensia Stilou (Pen Extension)**: Comenzi `pune stiloul jos`, `ridică stiloul`, `șterge tot`, desenarea dinamică a figurilor geometrice (pătrat, triunghi, stea, cerc).

### 🏆 Unitatea 6B: Scratch 2: Decizii, Muzică, Jocuri & Marea Evaluare Finală (pag. 84–93)
*Misiunea 6B: Scratch Advanced & Absolvire (7 Ecrane)*
1. **Structuri Decizionale în Scratch**: Blocul `dacă <condiție> atunci ... altfel ...` și operatorii booleeni ascuțiți.
2. **Jocul Inteligent „Labirint”**: Senzori optici de culoare (`atinge culoarea...`), revenire la poziția inițială și condiție de victorie.
3. **Jocul „Tabla Înmulțirii”**: Generare de factori aleatorii (`alege aleatoriu între 1 și 10`), citire răspuns utilizator (`întreabă și așteaptă`) și validare răspuns.
4. **Extensia Muzică & Sintetizator MIDI**: Alegerea instrumentului (Pian, Sintetizator, Flaut), note MIDI (Do=60, Re=62 etc.) și durate de bătăi.
5. **Gama Do Major & Interpretare Melodică**: Interpretarea secvențială a gamei Do Major și a cântecului popular *„În pădurea cu alune”*.
6. **Concurs de Jocuri „Prinde Peștișorul”**: Joc multi-personaj cu scafandru/pisică și peștișor animat, cronometru descrescător și numărător de scor.
7. **Proiectul Ecologic „Salvăm Planeta” & Marea Evaluare Finală**: Animație interactivă cu colectarea deșeurilor, test recapitulativ final al clasei a V-a și **Marea Diplomă de Onoare de Absolvire a Clasei a V-a** cu opțiune de imprimare.

---

## 4. 🕹️ Laboratorul Arcade TIC (18 Mini-Jocuri Educative)

Amplasat în ecranul dedicat (`/arcade`), Laboratorul Arcade consolidează competențele digitale prin jocuri aplicate:

1. **📑 PageCraft Studio**: Atelier de machetare documente, aliniere titluri, tabele și pagini de revistă.
2. **🟥 Roblox Blox Clicker**: Clicker tematic pe concepte de securitate și viteză digitală.
3. **⛏️ Minecraft Redstone Simulator**: Logic gates (AND, OR, NOT) replicate prin circuite de redstone.
4. **💻 Voxel PC 3D Builder**: Construcția componentelor fizice ale unui PC într-un spațiu izometric 3D.
5. **🦖 Cyber Dino Runner**: Joc de alergare retro cu sărituri peste obstacole malware și colectare de biți.
6. **🧩 Tetris Drop Sortare Fișiere**: Căderea blocurilor de fișiere și sortarea rapidă în folderele corecte (`.docx`, `.jpg`, `.mp3`).
7. **⚡ Binary Bit Blaster**: Conversii rapide din binar în zecimal prin tragere la țintă.
8. **🔌 Hardware Assembly Puzzle**: Conectarea cablurilor corecte (HDMI, USB, RJ-45, Jack audio) la porturile potrivite.
9. **🎯 Phishing Detector Radar**: Scanarea e-mailurilor și separarea mesajelor reale de atacurile de inginerie socială.
10. **🔐 Password Matrix Cracker**: Simulator pentru testarea puterii parolelor împotriva atacurilor de tip brute-force.
11. **🤖 Algoritm Robo-Maze**: Navigarea unui rover pe o grilă de obstacole folosind doar comenzi secvențiale.
12. **🧱 Scratch Block Stacker**: Aranjarea blocurilor logice Scratch într-o ordine corectă înainte de expirarea timpului.
13. **⌨️ Speed Typing Terminal**: Test de viteză de tastare pe termeni IT și diacritice românești cu măsurare WPM.
14. **🎨 Color Pixel Painter**: Înțelegerea pixelilor și a culorilor RGB prin pictură matriceală pe grilă.
15. **🌐 Network Packet Router**: Trimiterea pachetelor de date de la IP sursă la IP destinație prin routere corecte.
16. **🃏 Memory Card Flip TIC**: Joc de memorie cu perechi de concepte (ex: Procesor ↔ CPU, Monitor ↔ Periferic Ieșire).
17. **🔢 Math Quiz Blitz**: Provocare matematică de calcul mintal rapid integrată cu blocuri de cod.
18. **🐟 Catch the Fish Contest**: Concursul cu cronometru realizat după proiectul Scratch din manual.

---

## 5. ⚔️ Arena Duel 1v1 în Direct (`/duel`)

Modulul de competiție multiplayer în direct permite elevilor din aceeași clasă sau școală să concureze simultan:
- **Cod de Cameră din 4 Litere**: Un elev creează o sală (ex: `ARKY`), iar colegul se alătură de pe alt dispozitiv introducând codul.
- **Sincronizare în Timp Real**: Realizată prin Firebase Firestore / WebSocket listener.
- **Probe de Duel**:
  - *Block Coding Duel*: Cursă contracronometru de aranjare a algoritmilor.
  - *Cyber Sprint*: Concurs de tastare rapidă simultană cu bare de progres live pentru ambii jucători.
  - *Quiz Blitz 1v1*: Bătălie de cunoștințe cu întrebări fulger din materia de clasă.

---

## 6. 🏙️ CyberCity 3D Builder (`/city`)

Simulator urban futurist interactiv unde punctele acumulate la lecții devin monede de construcție:
- Fiecare lecție finalizată oferă **Energie și Monede Cyber**.
- Elevul poate construi și îmbunătăți clădiri: *Școala Digitală, Turnul de Serverele, Fabrica de Procesoare, Centrala Solară, Parcul Ecologic*.
- Orașul are statistici de sustenabilitate, consum de megawați și nivel tehnologic.

---

## 7. 💾 Sistemul de Salvare, Persistență și Sincronizare

ArkyEdu folosește o arhitectură **hibridă tolerantă la deconectare (Offline-First + Cloud Sync)**:

### A. Salvarea Locală (LocalStorage)
* **Chei utilizate**:
  - `arkedo_student_name`: Numele elevului activ.
  - `arkedo_active_mission`: Misiunea curentă selectată.
  - `arkedo_active_student_profile`: Obiect complet cu XP, nivel, monede, articole deblocate.
  - `arkedo_[modul]_level`, `arkedo_[modul]_score`, `arkedo_[modul]_elapsed`: Progresul punctual pe fiecare modul (hardware, files, internet1, internet2, text1, text2, algo1, algo2, scratch1, scratch2).
  - `arkedo_sound_enabled`: Starea sunetului.

### B. Salvarea în Cloud (Firebase Firestore)
Modulul `src/lib/studentAuthService.ts` coordonează sincronizarea cu baza de date Firebase:
- **Colecția `students`**:
  - `id`: Identificator unic elev.
  - `name`: Nume și prenume.
  - `classCode`: Codul clasei (asociat profesorului).
  - `xp`: Punctele totale de experiență acumulate.
  - `coins`: Monedele disponibile pentru skin-uri și CyberCity.
  - `lessonsProgress`: Obiect structurat cu statusul fiecărui modul (`completed`, `level`, `score`, `elapsedSeconds`).
  - `equipped`: Accesoriile și costumele curente ale lui Arky.
  - `updatedAt`: Marcaj temporal pentru rezolvarea conflictelor.
- **Colecția `classes`**:
  - Gestionată din Portalul Profesorului pentru gruparea elevilor pe clase (ex: *Clasa a V-a A*).
- **Colecția `duel_rooms`**:
  - Starea camerelor 1v1, jucătorii conectați, scorul în direct și runda activă.

---

## 8. 👨‍🏫 Portalul Profesorului (`/profesor`)

Ecran dedicat cadrelor didactice pentru gestionarea orelor de curs:
- **Tablou de bord al clasei**: Vizualizarea procentului de parcurgere a materiei pentru fiecare elev.
- **Generare cod de clasă**: Elevii introduc codul primit la logare pentru a fi înrolați automat în catalogul profesorului.
- **Acordare Puncte & Monede Bonus**: Recompensare didactică directă pentru activitatea la clasă.
- **Export Catalog**: Salvarea notelor și timpilor de lucru în format `.csv` sau `.json`.
- **Generare & Imprimare Diplome**: Tipărirea diplomelor personalizate cu antet oficial și ștampilă digitală ArkyEdu.

---

## 9. 🤖 Mascota Inteligentă Arky (`src/components/MascotaArky.tsx`)

Arky este ghidul permanent al elevului, oferind feedback pedagogic imediat:
- **4 Stări Emoționale**:
  1. `idle`: Relaxat, oferă glume IT, sfaturi și citate motivaționale.
  2. `success`: Festiv, declanșează confeti și sunete vesele la rezolvarea corectă.
  3. `error`: Încurajator, activează bannerul de reflecție didactică (fără penalizare punitivă).
  4. `finished`: Toca de absolvent, declanșează fanfara și diploma la absolvirea misiunii.
- **Garderobă Tematică (Skin-uri)**: Cyber (ochelari holografici), Scholar (tocă), Astronaut (cască spațială), Gamer (căști neon), Eco (coroniță verde), Wizard (pălărie de vrăjitor).
- **Text-to-Speech (TTS)**: Buton dedicat pe bula de dialog pentru citirea cu voce tare a mesajelor.
- **Design Curat**: Dialog cu indicator direcțional nativ, fără bare de derulare inestetice.

---

## 10. 📂 Structura Completă a Fișierelor Proiectului

```text
/
├── index.html                           # Entry-point HTML cu titlu, metadate și fonturi Google
├── package.json                         # Dependențe (React 19, Lucide, Tailwind, Confetti, Firebase)
├── tsconfig.json                        # Configurație compilator TypeScript
├── vite.config.ts                       # Configurație bundler Vite
├── metadata.json                        # Metadate AI Studio Applet
├── firestore.rules                      # Reguli de securitate Firebase Firestore
├── firebase-blueprint.json              # Schema structurilor Firestore
├── firebase-applet-config.json          # Configurație conexiune Firebase Project
├── PLAN_CURRICULAR_CLASA_5_ART_KLETT.md # Sinteza detaliată a manualului oficial
├── STANDARDE_SISTEM_SI_PUNCTAJE.md     # Bareme de notare și standarde pedagogice
├── PROIECT_ARKYEDU_DOCUMENTATIE_COMPLETA.md # Prezenta documentație exhaustivă
│
├── public/                              # Resurse statice, favicon, sunete audio
│
└── src/
    ├── main.tsx                         # Inițializarea aplicației React în DOM
    ├── App.tsx                          # Rutare principală, flux de navigare și manager global
    ├── types.ts                         # Tipuri TypeScript globale (elev, progres, magazin, jocuri)
    ├── index.css                        # Import Tailwind CSS și stiluri globale
    │
    ├── assets/
    │   └── arkyImages.ts                # SVG-uri și ilustrații vectoriale optimizate pentru Arky
    │
    ├── context/
    │   ├── ArkyContext.tsx              # Gestionarea stării mascotei, replici, TTS, minimizare
    │   ├── LanguageContext.tsx          # Sistem i18n bilingv (Română / Engleză)
    │   ├── HintContext.tsx              # Monitorizarea utilizării indiciilor didactice
    │   └── ThemeContext.tsx             # Gestionarea skin-urilor deblocate și a temei vizuale
    │
    ├── lib/
    │   ├── firebase.ts                  # Inițializare SDK Firebase Firestore & Auth
    │   └── studentAuthService.ts        # Motor de sincronizare LocalStorage ↔ Firestore
    │
    ├── utils/
    │   ├── audio.ts                     # Sintezator Web Audio API pentru efecte sonore retro
    │   └── scratchMusicSynth.ts         # Sintezator polifonic Web Audio MIDI pentru Scratch
    │
    └── components/
        ├── Header.tsx                   # Bară superioară: scor, cronometru, elev, sunet, navigare
        ├── ProgressBar.tsx              # Bară de evoluție cu 7 etape și marcaje de progres
        ├── CoursesCatalog.tsx           # Catalogul principal al celor 10 misiuni curriculare
        ├── VictoryScreen.tsx            # Ecran festiv de victorie cu diplomă printabilă
        ├── MascotaArky.tsx              # Componenta vizuală animată a mascotei Arky
        ├── TeacherPortal.tsx            # Portalul profesorilor (/profesor)
        ├── DuelArena.tsx                # Arena de dueluri multiplayer 1v1 în direct (/duel)
        │
        ├── common/
        │   └── usePedagogicalCooldown.ts # Temporizator pedagogic de 5s pentru reflecție la eroare
        │
        ├── hardware/                    # Unitatea 1: Hardware & Ergonomie (5 ecrane)
        │   ├── HLevel1_ErgonomyRules.tsx
        │   ├── HLevel2_HistoryTimeline.tsx
        │   ├── HLevel3_CentralUnitAssembly.tsx
        │   ├── HLevel4_PeripheralsSort.tsx
        │   └── HLevel5_BitsQuiz.tsx
        │
        ├── files/                       # Unitatea 2: Fișiere & Foldere (7 ecrane)
        │   ├── FLevel1_OSInterface.tsx
        │   ├── FLevel2_DataMemory.tsx
        │   ├── Level1_Structure.tsx
        │   ├── Level2_SelectionSearch.tsx
        │   ├── Level3_MoveShortcuts.tsx
        │   ├── Level4_CopyRenameProps.tsx
        │   └── Level5_RecycleBin.tsx
        │
        ├── internet1/                   # Unitatea 3A: Internet, Browsere & Web (6 ecrane)
        │   └── Module3AFlow.tsx
        │
        ├── internet2/                   # Unitatea 3B: E-mail & Securitate Cibernetică (6 ecrane)
        │   └── Module3BFlow.tsx
        │
        ├── text1/                       # Unitatea 4A: Word - Fonturi & Paragrafe (7 ecrane)
        │   ├── Module4AFlow.tsx
        │   ├── PageNavigationFooter.tsx # Footer universal de navigare între pagini
        │   ├── QuestionHint.tsx         # Componentă modulară de indicii didactice
        │   ├── AnswerExplanation.tsx    # Explicație detaliată a răspunsului corect/greșit
        │   ├── TLevel1_WordInterface.tsx
        │   ├── TLevel2_TypingRules.tsx
        │   ├── TLevel3_FontFormatting.tsx
        │   ├── TLevel4_ParagraphAlignment.tsx
        │   ├── TLevel5_ListsAndHierarchy.tsx
        │   ├── TLevel6_FindReplaceAndSpellcheck.tsx
        │   └── TLevel7_DocumentMasterLab.tsx
        │
        ├── text2/                       # Unitatea 4B: Word - Tabele, Forme & Paginare (7 ecrane)
        │   └── Module4BFlow.tsx
        │
        ├── algo1/                       # Unitatea 5A: Algoritmi & Pași Liniari (7 ecrane)
        │   ├── Module5AFlow.tsx
        │   └── ALevel1_WhatIsAlgorithm.tsx
        │
        ├── algo2/                       # Unitatea 5B: Structuri Decizionale & Scheme Logice (7 ecrane)
        │   └── Module5BFlow.tsx
        │
        ├── scratch1/                    # Unitatea 6A: Scratch 1 - Interfață, Blocuri & Pen (7 ecrane)
        │   ├── Module6AFlow.tsx
        │   ├── SLevel1_VisualLanguageIntro.tsx
        │   ├── SLevel2_InterfaceAndStage.tsx
        │   ├── SLevel3_BlockCategories.tsx
        │   ├── SLevel4_LinearScriptRoboTIC.tsx
        │   ├── SLevel5_VariablesInScratch.tsx
        │   ├── SLevel6_RoboOperationsMath.tsx
        │   └── SLevel7_PenExtensionDraw.tsx
        │
        ├── scratch2/                    # Unitatea 6B: Scratch 2 - Decizii, Muzică, Jocuri & Absolvire (7 ecrane)
        │   ├── Module6BFlow.tsx
        │   ├── S2Level1_DecisionBlocks.tsx
        │   ├── S2Level2_MazeGame.tsx
        │   ├── S2Level3_MultiplicationQuizGame.tsx
        │   ├── S2Level4_MusicExtension.tsx
        │   ├── S2Level5_DoMajorSongs.tsx
        │   ├── S2Level6_CatchFishContestGame.tsx
        │   └── S2Level7_SavePlanetFinalExam.tsx
        │
        ├── grade6/                      # Module Curriculare Clasa a VI-a (Art Klett)
        │   ├── presentation1/           # Unitatea 1A: Prezentarea & Interfața PowerPoint (7 ecrane)
        │   │   ├── ModuleG6P1Flow.tsx
        │   │   └── PLevel1_PresentationBasics.tsx ... PLevel7_CommandExplorerAndExam.tsx
        │   ├── presentation2/           # Unitatea 1B: Slide Creation, Design & Public Speaking (7 ecrane)
        │   │   ├── ModuleG6P2Flow.tsx
        │   │   └── P2Level1_SlideOperations.tsx ... P2Level7_TouristicProjectAndDiploma.tsx
        │   └── paint3d/                 # Unitatea 2A: Modelare 3D în Paint 3D (7 ecrane)
        │       ├── ModuleG6Paint3DFlow.tsx
        │       ├── Paint3DLevel1_WhatIs3D.tsx
        │       ├── Paint3DLevel2_InterfaceAnatomy.tsx
        │       ├── Paint3DLevel3_FourAxesManipulation.tsx
        │       ├── Paint3DLevel4_Make3DAndShapes.tsx
        │       ├── Paint3DLevel5_StickersAndMaterials.tsx
        │       ├── Paint3DLevel6_ExportAndAnimations.tsx
        │       └── Paint3DLevel7_AvatarLabAndDiploma.tsx
        │
        ├── minigames/                   # Laboratorul Arcade TIC (/arcade - 18 mini-jocuri)
        │   └── ArcadeHub.tsx
        │
        └── cybercity/                   # Simulatorul Urban CyberCity (/city)
            └── CyberCityView.tsx
```

---

## 11. 🚀 Comenzi de Rulare & Dezvoltare

```bash
# Instalare dependente
npm install

# Pornire server de dezvoltare (portul 3000)
npm run dev

# Verificare sintaxa si tipuri TypeScript
npm run lint

# Build complet pentru productie
npm run build
```

---
*© 2026 ArkyEdu. Proiect conceput cu dragoste pentru educație digitală și excelență didactică.*
