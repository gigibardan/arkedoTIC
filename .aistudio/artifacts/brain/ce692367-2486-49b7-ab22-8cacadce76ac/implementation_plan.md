# Plan de Îmbunătățire Didactică: Clasa a V-a și Clasa a VI-a (Fără Regresii)

Acest plan stabilește direcțiile concrete de extindere și îmbunătățire calitativă pentru modulele existente de Informatică și TIC, păstrând 100% intacte funcționalitățile actuale (cooldown pedagogic de 5 secunde, barele de reflecție, calculul notei românești 1–10, sincronizarea Firebase și portalul profesorului).

---

## 🎯 Obiective Principale
1. **Clasa a V-a**: Extinderea **simulatoarelor interactive și laboratoarelor practice** în fiecare modul (asamblare componente PC, arbore de fișiere drag-and-drop, evaluare securitate URL în browser simulat, editare vizuală de text și depanare algoritmi).
2. **Clasa a VI-a**: Adăugarea de **proiecte aplicate și mini-portofolii de creație digitală** pe care elevii le pot personaliza, salva și descărca (avatar 3D .GLB, prezentare ghid turistic, storyboard de animație, script Scratch avansat, protocol de igienă cibernetică).
3. **Metodologie de lucru**: Implementare **modul cu modul, pas cu pas**, cu verificare și compilare TypeScript continuă la fiecare pas.

---

## 📐 Faza 1: Îmbunătățirea Modulelor Clasei a V-a (Simulatoare Practice Extinse)

### 1.1 Modulul Hardware & Arhitectura Calculatorului (`src/components/hardware/`)
- **Stare actuală**: Quizuri de teorie, asamblare pe sloturi de bază și clasificare periferice.
- **Îmbunătățire propusă**:
  - **Simulator extins de asamblare PC în laborator virtual**: cablare sursă de alimentare (ATX 24 pini), montare procesor cu pastă termoconductoare și slotare RAM în Dual-Channel;
  - **Diagnoză interactivă „Beep Codes”**: scenarii de depanare unde elevul identifică ce componentă lipsește după numărul de semnale sonore emise de BIOS;
  - Păstrarea strictă a cooldown-ului de 5s la orice conexiune eronată.

### 1.2 Modulul Sistemul de Operare & Fișiere (`src/components/files/`)
- **Stare actuală**: Niveluri de noțiuni teoretice și explorare directoare.
- **Îmbunătățire propusă**:
  - **Simulator de gestionare a fișierelor (File Explorer Sandbox)**: crearea unei structuri de foldere școlare reale (`/Școală/TIC/Proiecte`), redenumire în masă conform regulilor oficiale și recuperarea fișierelor șterse din Recycle Bin;
  - Simulator interactiv de calcul capacitate de stocare (conversii practice KB -> MB -> GB aplicate pe fișiere foto și audio).

### 1.3 Modulele Internet & Siguranță Online (`src/components/internet1/` & `internet2/`)
- **Stare actuală**: Quizuri, clasificări de adrese URL și rebus.
- **Îmbunătățire propusă**:
  - **Simulator de căutare avansată în motoare de căutare**: exerciții practice cu operatori booleeni (`"ghilimele"`, `site:.ro`, `filetype:pdf`, `AND`/`OR`);
  - **Inspector interactiv de certificate SSL/HTTPS**: elevul inspectează lacătul de securitate, domeniul real și detectează tentativele de URL Typosquatting.

### 1.4 Modulele Procesare Text Word (`src/components/text1/` & `text2/`)
- **Stare actuală**: Niveluri teoretice și butoane de formatare text.
- **Îmbunătățire propusă**:
  - **Mini-laborator de redactare a unei reviste școlare**: aranjarea textului în jurul imaginilor (Square, Tight, Behind Text), inserare antet/subsol cu număr de pagină automat și generarea unui cuprins vizual;
  - Simulator interactiv de corectare a greșelilor tipografice frecvente (spațieri înainte de punct/virgulă, diacritice românești).

### 1.5 Modulele Algoritmi & Scratch 1 (`src/components/algo1/`, `algo2/`, `scratch1/`, `scratch2/`)
- **Stare actuală**: Simulatoare de blocuri, pahare și tabele de valori.
- **Îmbunătățire propusă**:
  - **Simulator de pas cu pas (Step-by-Step Execution Visualizer)**: evidențierea liniei de cod active la fiecare secundă pentru structuri decizionale și repetitive;
  - **Laborator Scratch Mini-Game Maker**: blocuri de detectare coliziune (`atinge marginea?`, `atinge culoarea?`) și contorizare scor în timp real.

---

## 🎨 Faza 2: Îmbunătățirea Modulelor Clasei a VI-a (Proiecte Aplicate & Mini-Portofolii)

### 2.1 Modulul Paint 3D (`src/components/grade6/paint3d/`)
- **Îmbunătățire propusă**:
  - **Generator de Avatar 3D Exportabil**: elevul își asamblează avatarul personalizat și poate descărca fișierul de configurare sau un rezumat grafic certificat;
  - Canvas 3D interactiv îmbunătățit cu lumină direcțională și comutare între modurile de randare.

### 2.2 Modulele Prezentări PowerPoint (`src/components/grade6/presentation1/` & `presentation2/`)
- **Îmbunătățire propusă**:
  - **Atelierul Ghidului Turistic Digital**: asamblarea completă a unei prezentări turistice de 4 diapozitive conform regulilor de aur (regula 6x6, contrast, tranziții cursive);
  - **Export Mini-Portofoliu**: generarea unui rezumat vizual al prezentării realizate, inclus în diploma finală a elevului.

### 2.3 Modulul Animație & Realitate Virtuală (`src/components/grade6/animation_vr/`)
- **Îmbunătățire propusă**:
  - **Storyboard Studio Interactiv**: scenariul narativ în 3 acte (Setup, Conflict, Resolution) cu export de fișă regizorală;
  - Simulator interactiv CoSpaces 360° cu rotire dinamică a camerei și adăugare de puncte de interes (hotspots) interactive.

### 2.4 Modulul Scratch Algoritmic Clasa a VI-a (`src/components/grade6/scratch_algo1/` & `scratch_algo2/`)
- **Îmbunătățire propusă**:
  - **Lab Coloana Infinită & Fractal**: posibilitatea de a modifica numărul de module romboidale și unghiul de rotație, cu vizualizarea în timp real a traseului stiloului (Pen Extension);
  - Editor vizual de bucle imbricate (bucle în bucle) cu detectare automată a blocajelor infinite.

### 2.5 Modulul Email & Securitate Cibernetică (`src/components/grade6/email/` & `malware/`)
- **Îmbunătățire propusă**:
  - **Simulator de Phishing Inbox**: elevul primește 5 emailuri simulate și trebuie să marcheze corect amenințările (fișier executabil periculos, expeditor mascat, urgență falsă);
  - **Certificat de Apărător Cibernetic**: portofoliu de reguli de securitate completat și asumat de elev.

---

## 🔒 Reguli de Integritate Tehnologică (Ce rămâne strict neschimbat)
1. **Sistemul Cooldown 5s**: Nicio modificare nu va elimina sau reduce durata buffer-ului de reflecție de 5 secunde la răspunsurile greșite;
2. **Formula de Notare**: `computeGradeDetails` va continua să determine nota 1–10 și calificativul oficial;
3. **Persistența**: Toate datele noi vor fi sincronizate transparent cu `studentAuthService`, `resultsService` și Firebase Firestore, cu stocare locală de rezervă;
4. **Teacher Portal**: Profesorul va vedea automat noile proiecte și scoruri în catalogul unificat.

---

## 🧪 Plan de Verificare și Testare
- **Testare Unitară și de Tipuri**: Rulare `npm run lint` (`tsc --noEmit`) după fiecare fișier modificat;
- **Verificare Compilare**: Rulare `compile_applet` pentru a valida bundling-ul Vite;
- **Validare Comportamentală**: Verificarea manuală a fiecărui simulator în browser (acțiuni drag-and-drop, tranziții de nivel, cooldown la greșeală, printare diplomă).
