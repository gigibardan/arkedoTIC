# ArkyEdu TIC & Arcade — Stack Tehnic & Arhitectură Oficială

Acest document reflectă cu exactitate stack-ul tehnologic, componentele de infrastructură și deciziile de arhitectură implementate în proiectul **ArkyEdu**.

---

## 1. Sinteză Generală & Principii de Arhitectură

* **Tip Aplicație:** Single Page Application (SPA) Gamificată & Progresivă (PWA).
* **Target:** Elevi de gimnaziu (clasele V-VIII), profesori de TIC și administratori școlari.
* **Filosofie de Cost:** **0 costuri de infrastructură și hosting** (compatibilitate 100% cu planurile gratuite Netlify Legacy Free și Firebase Spark Free Tier, fără apeluri Serverless/Edge compute plătite).
* **Fiabilitate în Școli:** Rulare garantată în laboratoarele de informatică cu conexiune instabilă la internet prin caching offline complet.

---

## 2. Frontend Core & Bundler

| Tehnologie | Versiune | Rol & Implementare |
| :--- | :--- | :--- |
| **React** | `^19.0.1` | Librăria de bază pentru componente, randare concurentă și performanță maximă. |
| **React DOM** | `^19.0.1` | Pachetul renderer React, optimizat cu deduplicare automată a instanțelor în bundler. |
| **TypeScript** | `~5.8.2` | Verificare strictă de tipuri pe întregul cod (`tsc --noEmit`), garantând 0 erori de runtime. |
| **Vite** | `^6.2.3` | Bundler modern de mare viteză cu `@vitejs/plugin-react` (timp de build complet: ~11 secunde). |
| **Arhitectură Rutare** | State + History API | Rutare modulară instantanee bazată pe stare cu sincronizare curată în URL (`/superadmin`, `/profesor`, `/arcade`, `/duel`, `/oras`) și deep-linking fără reîncărcare de pagină. |
| **Internaționalizare (i18n)** | Nativ React Context + Auto-Detector | Detectare inteligentă automată a limbii browserului (`navigator.languages`): Română (`ro`) pentru vizitatorii din RO/MD, Engleză (`en`) pentru restul lumii, cu persistență pe termen lung în `localStorage`, override manual prioritar și sincronizare cross-tab. |

---

## 3. Design, Stil & Animații (UI / UX)

| Tehnologie | Pachet | Utilizare |
| :--- | :--- | :--- |
| **Tailwind CSS v4** | `@tailwindcss/vite` `^4.1.14` | Styling modern prin `@import "tailwindcss";`, compilare lightning-fast, fără fișiere CSS separate sau configurări legacy. |
| **Iconografie** | `lucide-react` `^0.546.0` | Peste 40 de iconițe vectoriale clare, adaptate temelor dark/high-contrast. |
| **Animații** | `motion` `^12.23.24` | Tranziții fine între ecrane, efecte de glisare și micro-interacțiuni pentru elevi. |
| **Gamificare Vizuală** | `canvas-confetti` `^1.9.4` | Efecte de particule și confetti la completarea nivelurilor, testelor și duelurilor. |
| **Tipografie** | Google Fonts | *Plus Jakarta Sans* (interfețe tehnice, tabele, catalog) și *Fredoka* (stil ludic prietenos pentru elevi). |

---

## 4. Backend, Bază de Date & Securitate (Serverless Real-Time)

| Tehnologie | Pachet / Serviciu | Rol în Aplicație |
| :--- | :--- | :--- |
| **Firebase SDK Modular** | `firebase` `^12.19.0` (v12) | Integrare client modulară (`initializeApp`, `getFirestore`, `collection`, `doc`, `onSnapshot`). |
| **Cloud Firestore** | NoSQL Database | Bază de date distribuită pentru catalogul profesorilor (`schools`, `teachers`, `classes`, `students`, `submissions`, `grades`), dueluri live 1v1 și clădirile din Cyber City. |
| **Izolare Multi-Școală** | Partitioning | Filtrare și separare strictă pe baza ID-ului școlii (`schoolId`), prevenind amestecul datelor între instituții. |
| **Securitate Firestore** | `firestore.rules` | Reguli RBAC (Role-Based Access Control) aplicate direct la nivel de bază de date: permisiuni distincte pentru Superadmin, Profesori și Elevi. |

---

## 5. Motor Audio & Jocuri (Zero Overhead de Bandă)

* **Web Audio API Nativ (`src/utils/audio.ts`):**
  * Sintetizator procedural integrat: generează sunete 8-bit retro (monede colectate, bleeps la clic, fanfară de victorie, sunete de eroare) folosind exclusiv oscilatoare de browser (`OscillatorNode`, `GainNode`).
  * **0 KB de fișiere audio externe**: nu descarcă fișiere MP3 sau WAV pe rețea, eliminând timpul de încărcare.
  * Protecție completă de stare audio: gestionare `AudioContext.state === 'suspended'` prin reluare la prima interacțiune a utilizatorului.
* **Canvas HTML5 & Mini-Games:**
  * 19 mini-jocuri arcade interactive calibrate exact pe programa școlară de TIC:
    * Arhitectura calculatorului & Asamblare Unitate Centrală
    * Clasificare periferice & Ergonomie
    * Organizare fișiere, directoare și extensii
    * Sisteme de operare & Navigare SO
    * Rețele, Internet & Securitate Web
    * Birotică & Formatare documente
    * Algoritmi & Programare vizuală Scratch

---

## 6. Mod PWA & Funcționare Offline în Laborator 📱

| Componentă | Configurare | Detalii |
| :--- | :--- | :--- |
| **Plugin Service Worker** | `vite-plugin-pwa` | Mod `autoUpdate` cu precaching automat generat prin Workbox. |
| **Limită Cache Mărită** | `maximumFileSizeToCacheInBytes: 8MB` | Salvează local întregul bundle JS/CSS, toate cele 14 lecții și 19 jocuri arcade. |
| **Web App Manifest W3C** | `dist/manifest.webmanifest` | Mod `display: 'standalone'`, culori de sistem `#0f172a`, start URL `/`. |
| **Pachet Iconițe Complete** | `/public` | SVG vectorial de înaltă definiție (`icon.svg`), PNG 192x192, PNG 512x512, Maskable 512x512 (cu margine de siguranță de 15% pentru Android), Apple Touch Icon 180x180 (pentru iOS Safari) și Favicon. |
| **Buton Instalare In-App** | `PWAInstallButton.tsx` | Permite instalarea directă din bara de navigare desktop sau din meniul mobil, cu ghid pas-cu-pas pentru Safari pe iPhone/iPad. Se auto-ascunde în mod standalone. |
| **Indicator Laborator Offline** | `OfflineIndicator.tsx` | Monitorizează starea rețelei prin `useOnlineStatus`. În caz de cădere a netului în laborator, anunță discret că activitatea continuă 100% din cache-ul local. |

---

## 7. SEO, Social Media & Indexare Profesională (Opțiunea A Implementată)

* **Generare Pagini Statice Pre-Rendered (`scripts/generate_seo_pages.js`):**
  * La fiecare build (`npm run build`), se generează pagini HTML statice pure în `/public/cursuri/[modul]/index.html` pentru toate modulele curriculare (Hardware, Sisteme de Operare & Fișiere, Internet & Securitate, Editoare de Text & Tehnoredactare, Algoritmi, Scratch 3.0, Prezentări PowerPoint & Google Slides, Grafică 3D Paint 3D).
  * Netlify servește aceste pagini fizice direct cu status HTTP 200 către boții de căutare (Googlebot, Bingbot), fără a depinde de rularea client-side a JavaScript-ului.
  * Fiecare pagină conține buton de lansare directă / deep-link în simulator (`/#curricula-[id]`), permițând accesul instant în aplicația interactivă.
* **Schema.org JSON-LD Structurat Complet (@graph):**
  * Entități `WebApplication` & `EducationalApplication` în rădăcină (`index.html`).
  * Entități specifice `Course` (cu `educationalLevel: Clasa a V-a / a VI-a`, `isAccessibleForFree: true`, volum de lucru `PT2H`).
  * Entități `LearningResource` cu `educationalAlignment` pe programa oficială națională a Ministerului Educației (OMEN 3393/2017).
  * Entități `FAQPage` cu întrebări și răspunsuri frecvente pentru afișarea în Google Rich Results / Rich Snippets.
  * Entități `BreadcrumbList` pentru ierarhie vizuală clară în rezultatele Google (Acasă > Cursuri TIC > Modul).
* **OpenGraph & Twitter Cards:** Metadate vizuale complete (titlu, descriere, link canonic `https://arkyedu.com/cursuri/.../`, limbă `ro_RO`, temă `#0f172a`).
* **Harta Site-ului & Directiva Robots:** `public/sitemap.xml` și `public/robots.txt` actualizate cu toate URL-urile de cursuri și priorități de indexare (0.9 - 1.0).

---

## 8. Infrastructură de Hosting & Deploy (Netlify Ready)

* **Compatibilitate:** Netlify Legacy Free Plan (cost $0 lunar).
* **Build Command:** `npm run build` (produce directorul `/dist`).
* **Publish Directory:** `dist`.
* **SPA Routing Fallback:** Fișierele `_redirects` și `netlify.toml` conțin regula `/*  /index.html  200` pentru prevenirea erorilor 404 la refresh.
* **Securitate la Nivel de Antete HTTP:**
  * `X-Frame-Options: DENY`
  * `X-Content-Type-Options: nosniff`
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`
* **Politici de Caching CDN:** Caching imutabil pe termen lung pentru `/assets/*` (`max-age=31536000, immutable`).

---

## 9. Comenzi Uzuale & Scripturi NPM

```bash
# Pornire server de dezvoltare local
npm run dev

# Verificare statică a tipurilor TypeScript (fără generare fișiere)
npm run lint

# Compilare completă de producție cu PWA & Service Worker
npm run build

# Previzualizare build local de producție
npm run preview
```

---

## 10. Variabile de Mediu (`.env`)

```ini
# Configurația Firebase Client SDK (cu prefix VITE_)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_DATABASE_ID=...
```

---

## 11. Cadrul Legal, Confidențialitate (GDPR), Cookie-uri & Formular Netlify

* **Misiune Non-Profit & Educație Gratuită:**
  * ArkyEdu este oferit 100% gratuit elevilor și profesorilor din România.
  * Zero monetizare, zero reclame comerciale, zero vânzare sau transfer de date către terți.
* **Protecția Minorilor & GDPR (Regulamentul UE 2016/679):**
  * Nu se colectează CNP, date de card, adrese fizice sau numere de telefon.
  * Progresul la teste și numele de elev sunt reținute local în browser (`localStorage`), garantând controlul utilizatorului și posibilitatea de resetare instantanee.
* **Politica de Cookie-uri & Modul de Consimțământ (`CookieBanner.tsx`):**
  * Doar cookie-uri strict tehnice necesare funcționării (sesiune, temă vizuală, selecție limbă, progres) și Google Analytics anonimizat (`G-P9NW97TZHH`) pentru îmbunătățirea capitolelor.
  * Banner prietenos de acceptare / personalizare cu sincronizare automată `gtag('consent', 'update')`.
* **Formular de Contact (`contact@arkyedu.com`) & Integrare Netlify Forms:**
  * Componenta `LegalModal.tsx` integrează formular cu atributele `data-netlify="true"`, `method="POST"`, `name="contact"` și protecție honeypot antispam.
  * Pre-înregistrare statică în `index.html` pentru ca boții Netlify să detecteze automat schema formularului la fiecare deploy.
  * Notificările sunt direcționate automat către adresa oficială: `contact@arkyedu.com`.

