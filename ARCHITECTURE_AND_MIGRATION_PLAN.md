# Arhitectură Tehnică & Plan de Migrare Scalabil
## Platforma Educațională TIC & Arcade (Arkedo)

Acest document constituie planul de referință și foaia de parcurs pentru scalarea platformei, introducerea controlului multi-rol (Superadmin, Profesor, Elev), optimizarea extremă a costurilor pe **Netlify Legacy Free Plan** și migrarea incrementală către **Next.js (Static-First SSG + Client-Side Firebase)**.

---

## 1. Principii Fundamentale de Arhitectură

1. **Zero Cheltuieli Neplanificate (100% Free-Tier Netlify Compliant)**:
   - Suntem pe planul Netlify Legacy Free (fără sistem de credite).
   - Nu folosim Edge Functions pentru navigare sau randare pagini.
   - Paginile publice sunt generate static la build (SSG - Static Site Generation) și livrate instant din CDN-ul Netlify fără computație de server.
   - **Nu se folosește Middleware global în Next.js** (middleware-ul declanșează Edge Functions la fiecare request).

2. **Aplicație Interactivă Client-Side (Client Components)**:
   - Toate cele 19 jocuri interactive, cele 14 module de curs, duelurile 1v1 în timp real, magazinul, inventarul și panourile de administrare rulează ca și componente de client (`"use client"`).
   - Navigarea elevilor și profesorilor prin aplicație este instantanee (client routing), fără a apela rute SSR sau funcții serverless.

3. **Conexiune Directă Firebase Client-Side**:
   - Citirile și scrierile în Firestore se fac direct din client (SDK modular v12) protejate de **Firebase Security Rules** robuste.
   - Nu trimitem cererile de citire prin proxy-uri sau Serverless Functions, economisind astfel cele 125.000 invocări lunare de funcții Netlify.

4. **Securitate Autentică Superadmin (Fără chei hardcodate în frontend)**:
   - Rolul de Superadmin este protejat de Firebase Authentication (Identity Platform) și verificat la nivel de bază de date (`/superadmins/{uid}`) și în regulile `firestore.rules`.
   - Modificările de cod JavaScript în browser nu pot acorda privilegii de Superadmin.

---

## 2. Clasificarea Componentelor & Strategia Next.js

| Tip Componentă | Strategie Next.js | De ce? | Impact Netlify |
| :--- | :--- | :--- | :--- |
| **Landing Page / Homepage** | Static (SSG) | Indexare Google, viteză instantanee, SEO metadata | 0 Edge / 0 Serverless |
| **Prezentare Cursuri & Curriculum** | Static (SSG) | Căutare Google pentru programa școlară TIC | 0 Edge / 0 Serverless |
| **Ghiduri & Resurse Didactice** | Static (SSG) | Trafic organic din partea profesorilor din România | 0 Edge / 0 Serverless |
| **Sitemap.xml & Robots.txt** | Static la Build | Indexare SEO completă | 0 Edge / 0 Serverless |
| **Module Interactive TIC (14)** | Client Component | Stare locală, animații, audio, drag & drop | 0 Edge / 0 Serverless |
| **Jocuri Arcade (19)** | Client Component | Canvas, logică joc, reacții în milisecunde | 0 Edge / 0 Serverless |
| **Duel Multiplayer 1v1** | Client Component | Listenere Firestore `onSnapshot` în timp real | 0 Edge / 0 Serverless |
| **Dashboard Elev / Magazin / XP** | Client Component | Sincronizare profil elev, inventar local + cloud | 0 Edge / 0 Serverless |
| **Panou Profesor (Gradebook)** | Client Component | Filtre tabel, gestionare clasă, note | 0 Edge / 0 Serverless |
| **Consolă Superadmin** | Client Component + Firebase Auth | Control total: școli, profesori, elevi, scoruri | 0 Edge / 0 Serverless |

---

## 3. Faze de Implementare Incrementală

### Etapa 1: Superadmin Console & Securitate RBAC (Completat)
- [x] Analiză arhitecturală și audit de securitate.
- [x] Implementare autentificare Firebase Auth pentru Superadmin (`signInSuperAdmin`, `signOutSuperAdmin`, suport sesiune securizată).
- [x] Definire entități & colecții Firestore în `firebase-blueprint.json`: `/superadmins/{uid}`, `/profesori/{uid}`, `/scoli/{schoolId}`.
- [x] Actualizare `firestore.rules` cu reguli bazate pe roluri reale (`isSuperAdmin()`, `isTeacher()`, permisiuni granulare de scriere/citire).
- [x] Creare serviciu backend Superadmin complet (`src/lib/superadminService.ts`).
- [x] Creare panou Superadmin complet (`src/components/superadmin/SuperAdminDashboard.tsx`):
  - [x] Gestiune Școli (creare, cod acces, statistici, filtrare).
  - [x] Gestiune Profesori (asociere școală, activare/blocare, listă).
  - [x] Gestiune Elevi (căutare globală, filtrare pe școală, suspendare/reactivare, ștergere cont).
  - [x] Control Total Scoruri (editare oricare din jocurile arcade & modulele de curs, bonus XP, ByteCoins, recalculare XP).
  - [x] Catalog & Submisii (căutare submisii, editare note/procente, curățare teste fantomă 0s).
  - [x] Monitorizare Dueluri active (listare camere 1v1, închidere forțată).
  - [x] Setări globale de platformă (multiplicator XP, mod mentenanță).
- [x] Integrare UI & Navigare: buton Superadmin în Header și TeacherPortal, rută `/superadmin`.
- [x] Rezolvare conflict module React (`dedupe: ['react', 'react-dom']` în `vite.config.ts`) eliminând eroarea de hook invalid.

### Etapa 2: Arhitectură Multi-Școală & Izolare Date (Completat)
- [x] Adăugare serviciu dedicat de școli `src/lib/schoolService.ts` cu cache local și sincronizare Firestore (`/scoli`).
- [x] Asociere automată a elevilor cu o școală la înregistrare:
  - Selector de școală în formularul de creare cont (`AuthModal.tsx`).
  - Stocare `schoolId` direct în profilul elevului (`StudentProfile`) și fallback inteligent pe școala pilot pentru conturi legacy.
- [x] Etichetare automată a rezultatelor și testelor (`resultsService.ts`):
  - Fiecare submisie salvată în Firestore (`rezultate_tic`) și în cache conține `schoolId` și `schoolName`.
  - Rezolvare automată din profilul activ în `VictoryScreen.tsx`.
- [x] Izolare și filtrare date pentru Profesori (`TeacherPortal.tsx` & `TeacherStudentManagement.tsx`):
  - Filtru de școală în Catalogul de note (Gradebook) cu calcul automat al mediilor pe școală.
  - Filtru de școală în Registrul Elevilor cu badge dedicat pentru fiecare elev.
  - Vizualizare badge școală în fereastra de inspecție și editare scoruri (`TeacherScoreModal.tsx`).
- [x] Competiție și clasamente multi-școală (`LeaderboardSection.tsx`):
  - Comutator „Toate Școlile (Clasament Național)” vs „Școala Mea” în topul live al campionilor.
- [x] Acces și control cross-school pentru Superadmin (`SuperAdminDashboard.tsx`):
  - Comutator global de școală în bara superioară cu filtrare instantanee pe întreg panoul.
  - Coloană dedicată „Școală / Transfer” în tabelul de elevi: Superadminul poate transfera orice elev între școli dintr-un simplu meniu derulant.
  - Filtrare multi-școală pe submisii și catalog.

### Etapa 3: Structura Static-First & SEO (Completat)
- [x] Configurare completă metadata OpenGraph și Twitter Cards în `index.html`.
- [x] Schema.org JSON-LD Structured Data integrat (`WebApplication`, `EducationalApplication`, `Course` TIC Gimnaziu V-VIII).
- [x] Generare `public/robots.txt` cu reguli optime de indexare Google/Bing și protecție pentru panoul `/superadmin`.
- [x] Generare `public/sitemap.xml` cu maparea tuturor secțiunilor principale (`/`, `/arcade`, `/duel`, `/oras`, `/profesor`).
- [x] Suport complet pentru navigare și deep-linking cu URL-uri curate fără hash (rute client SPA recunoscute instant).

### Etapa 4: Reutilizarea Codului & Izolare Browser / SSR (Completat)
- [x] Păstrarea a 100% din componentele UI existente (Tailwind CSS, Lucide Icons, sunete, animații).
- [x] Izolarea librăriilor browser (`window`, `localStorage`, `sessionStorage`, `AudioContext`) cu verificări izomorfe (`typeof window !== 'undefined'`).
- [x] Sistemul audio retro din `src/utils/audio.ts` rulează în siguranță cu gestionare de stare suspend/resume la interacțiunea utilizatorului.
- [x] Eliminare conflicte module React prin configurare `dedupe` în `vite.config.ts`, asigurând 0 erori de React Hook.

### Etapa 5: Lansare & Configurare Netlify (Completat)
- [x] Configurare completă `netlify.toml`:
  - SPA Fallback routing: `/*` -> `/index.html` (HTTP 200).
  - Caching agresiv imutabil pentru build artifacts: `/assets/*` cu `max-age=31536000, immutable`.
  - Politici de securitate la nivel de antet: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
  - Caching dedicat pentru fișierele de căutare `sitemap.xml` și `robots.txt`.
- [x] Conformitate 100% cu Netlify Legacy Free Plan (0 Edge Functions, 0 serverless computations, resurse statice livrate instant din CDN).

### Etapa 6: Mod PWA (Progressive Web App) & Funcționare Offline în Laborator (Completat)
- [x] Integrare `vite-plugin-pwa` cu Service Worker autoupdate (`registerType: 'autoUpdate'`).
- [x] Caching offline complet (Workbox precaching pentru toate bundle-urile JS, CSS, HTML, SVG, ICO, JSON, fonturi Google/Gstatic).
- [x] Manifest PWA conform standardelor W3C:
  - `id: '/'`, `start_url: '/'`, `scope: '/'`, `display: 'standalone'`.
  - `name: 'ArkyEdu: Platformă Interactivă TIC & Coding'`, `short_name: 'ArkyEdu'` (≤ 12 caractere).
  - `theme_color: '#0f172a'`, `background_color: '#0f172a'`.
- [x] Set complet de iconițe PWA generate:
  - `public/icon.svg` (Brand SVG de înaltă rezoluție).
  - `public/pwa-192x192.png` (Rezoluție standard Chromium/Android).
  - `public/pwa-512x512.png` (Rezoluție înaltă ecran de pornire).
  - `public/pwa-maskable-512x512.png` (Safe-zone 80% cu margini de siguranță pentru Android squircles).
  - `public/apple-touch-icon.png` (180x180 PNG conform iOS Safari).
  - `public/favicon.ico`.
- [x] Buton dedicat de instalare PWA în interfață (`PWAInstallButton`):
  - Integrat în bara de navigare desktop și în meniul mobil.
  - Ascundere automată când aplicația rulează deja ca PWA instalată (`standalone`).
  - Ghid interactiv dedicat pentru dispozitive iOS Safari (Share -> Add to Home Screen).
- [x] Indicator și notificare offline în timp real (`OfflineIndicator`):
  - Monitorizare rețea prin hook-ul `useOnlineStatus`.
  - Notificare subtilă când laboratorul pierde conexiunea la net, garantând utilizatorilor că lecțiile și jocurile rulează fără întrerupere din cache.
  - Toast automat de reconectare și sincronizare când internetul revine.

---

## 4. Modelul de Securitate Firestore (RBAC)

```
// Ierarhie permisiuni
Superadmin -> Acces complet de citire și scriere peste toate colecțiile
Profesor    -> Acces de citire/scriere pe clasa/școala asociată
Elev        -> Acces de citire/scriere exclusiv pe propriul profil și pe submisii noi
Anonim      -> Doar citire pe date publice (dacă este cazul)
```

Niciun rol nu se bazează pe variabile simple de frontend sau parole introduse în `localStorage`. Orice acțiune administrativă critică este validată direct prin tokenul Firebase Auth.
