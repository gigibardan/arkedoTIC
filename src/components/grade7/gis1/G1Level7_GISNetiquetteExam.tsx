import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, Sparkles, Lock, BookOpen, Compass } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface G1Level7Props {
  onPass: (score: number) => void;
  studentName?: string;
}

export const G1Level7_GISNetiquetteExam: React.FC<G1Level7Props> = ({ onPass, studentName }) => {
  const { lang } = useLanguage();

  // 5 Exam Questions State with 5s Cooldown
  const [q1, setQ1] = useState<string | null>(null);
  const [q1Cd, setQ1Cd] = useState<number>(0);
  const [q1Msg, setQ1Msg] = useState<string>('');

  const [q2, setQ2] = useState<string | null>(null);
  const [q2Cd, setQ2Cd] = useState<number>(0);
  const [q2Msg, setQ2Msg] = useState<string>('');

  const [q3, setQ3] = useState<string | null>(null);
  const [q3Cd, setQ3Cd] = useState<number>(0);
  const [q3Msg, setQ3Msg] = useState<string>('');

  const [q4, setQ4] = useState<string | null>(null);
  const [q4Cd, setQ4Cd] = useState<number>(0);
  const [q4Msg, setQ4Msg] = useState<string>('');

  const [q5, setQ5] = useState<string | null>(null);
  const [q5Cd, setQ5Cd] = useState<number>(0);
  const [q5Msg, setQ5Msg] = useState<string>('');

  // Countdown timer for error cooldown
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cd((c) => (c > 0 ? c - 1 : 0));
      setQ2Cd((c) => (c > 0 ? c - 1 : 0));
      setQ3Cd((c) => (c > 0 ? c - 1 : 0));
      setQ4Cd((c) => (c > 0 ? c - 1 : 0));
      setQ5Cd((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers for the 5 final exam questions
  const handleQ1 = (val: string) => {
    if (q1Cd > 0) return;
    if (val === 'gis_complete_sys') {
      sounds.playCorrect();
      setQ1(val);
      setQ1Msg('');
    } else {
      sounds.playWrong();
      setQ1(val);
      setQ1Cd(5);
      setQ1Msg(
        lang === 'ro'
          ? 'Incorect! Un GIS este un sistem complet de captare, stocare pe straturi, interogare tabelară și analiză a datelor spațiale, spre deosebire de o hartă statică de hârtie.'
          : 'Incorrect! A GIS is a comprehensive computer system for capturing, layered storage, relational attribute querying, and spatial analysis, unlike a static paper map.'
      );
    }
  };

  const handleQ2 = (val: string) => {
    if (q2Cd > 0) return;
    if (val === 'relief_base') {
      sounds.playCorrect();
      setQ2(val);
      setQ2Msg('');
    } else {
      sounds.playWrong();
      setQ2(val);
      setQ2Cd(5);
      setQ2Msg(
        lang === 'ro'
          ? 'Incorect! În stiva de straturi (Layers), stratul opac de relief/topografie trebuie plasat la baza stivei (jos), altfel va acoperi și va ascunde straturile de drumuri, ape și orașe!'
          : 'Incorrect! In a layer stack, the opaque elevation/relief layer must sit at the bottom; placing it on top obscures all underlying roads, rivers, and cities!'
      );
    }
  };

  const handleQ3 = (val: string) => {
    if (q3Cd > 0) return;
    if (val === 'vector_primitives') {
      sounds.playCorrect();
      setQ3(val);
      setQ3Msg('');
    } else {
      sounds.playWrong();
      setQ3(val);
      setQ3Cd(5);
      setQ3Msg(
        lang === 'ro'
          ? 'Incorect! Cele 3 forme vectoriale sunt: Punct (X, Y unic, ex. vârf munte), Linie (lungime continuă, ex. râu) și Poligon (arie închisă cu suprafață și perimetru, ex. parc național).'
          : 'Incorrect! The 3 vector primitives are: Point (unique coordinate pair, e.g. mountain peak), Line/Polyline (continuous length, e.g. river), and Polygon (enclosed boundary with area and perimeter, e.g. national park).'
      );
    }
  };

  const handleQ4 = (val: string) => {
    if (q4Cd > 0) return;
    if (val === 'coords_romania') {
      sounds.playCorrect();
      setQ4(val);
      setQ4Msg('');
    } else {
      sounds.playWrong();
      setQ4(val);
      setQ4Cd(5);
      setQ4Msg(
        lang === 'ro'
          ? 'Incorect! România se situează în emisfera nordică (latitudine nordică 43°–48° N față de Ecuator) și în emisfera estică (longitudine estică 20°–29° E față de Meridianul Greenwich).'
          : 'Incorrect! Romania is situated in the Northern hemisphere (latitude 43°–48° N from Equator) and the Eastern hemisphere (longitude 20°–29° E from Greenwich Prime Meridian).'
      );
    }
  };

  const handleQ5 = (val: string) => {
    if (q5Cd > 0) return;
    if (val === 'gdpr_privacy') {
      sounds.playCorrect();
      setQ5(val);
      setQ5Msg('');
    } else {
      sounds.playWrong();
      setQ5(val);
      setQ5Cd(5);
      setQ5Msg(
        lang === 'ro'
          ? 'Incorect! Protecția datelor cu caracter personal (GDPR) interzice publicarea locației exacte a locuinței sau a traseului zilnic al minorilor pe hărți web publice, din motive esențiale de securitate.'
          : 'Incorrect! Privacy and personal data regulations (GDPR) strictly prohibit publishing precise residential GPS coordinates or daily walking routes of minors on public maps for personal safety.'
      );
    }
  };

  const allQuestionsPassed = q1 === 'gis_complete_sys' && q2 === 'relief_base' && q3 === 'vector_primitives' && q4 === 'coords_romania' && q5 === 'gdpr_privacy';

  const handleFinalSubmit = () => {
    if (allQuestionsPassed) {
      sounds.playVictory();
      onPass(100);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-emerald-950/80 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg text-2xl">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold uppercase">
                  {lang === 'ro' ? 'Nivelul 7 • Unitatea 3B (Manual pag. 57–63)' : 'Level 7 • Unit 3B (Textbook pp. 57–63)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {lang === 'ro' ? 'Netichetă & Examen de Certificare' : 'Netiquette & Certification Exam'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {lang === 'ro'
                  ? 'Netica Cartografică & Marea Certificare GIS Clasa a VII-a'
                  : 'Cartographic Ethics & Grade 7 GIS Certification Exam'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ro' ? '100 Puncte (Nota 10)' : '100 Points (Grade 10)'}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          {lang === 'ro' ? (
            <>
              Felicitări pentru parcurgerea celor 6 etape practice! Înainte de a susține <strong className="text-teal-300">Examenul Final de Certificare</strong>, parcurge cu atenție <strong className="text-amber-300">cele 4 Reguli de Aur ale Geolocației Responsabile</strong>.
            </>
          ) : (
            <>
              Congratulations on completing all 6 practical stages! Before taking the <strong className="text-teal-300">Final Certification Exam</strong>, carefully review the <strong className="text-amber-300">4 Golden Rules of Responsible Geolocation</strong>.
            </>
          )}
        </p>
      </div>

      {/* 4 Golden Rules of Cartographic Netiquette & Privacy */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            {lang === 'ro' ? 'Codul Deontologic al Cartografului Digital' : 'Code of Ethics for Digital Cartographers'}
          </span>
          <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
            {lang === 'ro'
              ? 'Cele 4 Reguli de Aur ale Securității & Confidențialității în GIS (GDPR)'
              : '4 Golden Rules of Security & Privacy in GIS (GDPR)'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>{lang === 'ro' ? '1. Protecția Adresei Private & a Locuinței' : '1. Private Residence & Home Protection'}</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              {lang === 'ro'
                ? 'Nu distribui niciodată public pe hărți web deschise (OpenStreetMap, Google My Maps) coordonatele GPS exacte ale domiciliului tău sau traseul pe care mergi singur la școală. Informațiile georeferențiate sunt date personale sensibile!'
                : 'Never publish exact residential GPS coordinates or daily walking commute routes on open collaborative web maps. Georeferenced footprints constitute sensitive personal identifiable data!'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ro' ? '2. Acuratețe în Proiecte Collaborative' : '2. Accuracy in Collaborative Projects'}</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              {lang === 'ro'
                ? 'Când contribui la hărți deschise comunitare, adaugă doar date reale verificate pe teren. Introducerea de puncte fictive sau glume cartografice reprezintă vandalism digital și poate induce în eroare serviciile de urgență.'
                : 'When contributing to open community maps, contribute only verified ground truth. Adding fictitious waypoints or pranks is digital vandalism and may misdirect emergency responders.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'ro' ? '3. Respectarea Licențelor & Drepturilor de Autor' : '3. Licensing & Copyright Compliance'}</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              {lang === 'ro'
                ? 'Imaginile satelitare de înaltă rezoluție și straturile digitale sunt protejate prin drepturi de autor. Menționează întotdeauna sursa datelor cartografice (ex: Agenția Spațială Europeană ESA, ANCPI, OpenStreetMap).'
                : 'Satellite orthophotos and commercial layers are protected by intellectual property. Always cite geospatial data sources (e.g., ESA Sentinel, NASA Landsat, OpenStreetMap).'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Compass className="w-4 h-4" />
              <span>{lang === 'ro' ? '4. Siguranță Personală pe Teren' : '4. Personal Safety in Fieldwork'}</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              {lang === 'ro'
                ? 'Când participi la activități școlare în natură cu telefonul pe post de busolă sau receptor GPS, nu privi continuu în ecran în timp ce mergi pe teren accidentat, pe marginea prăpastiei sau în apropierea carosabilului.'
                : 'During outdoor orienteering with phones as digital compasses or GPS receivers, stay aware of real surroundings—never look down at screens near cliffs, trails, or traffic.'}
            </p>
          </div>
        </div>
      </div>

      {/* The 5 Final Exam Questions */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            {lang === 'ro' ? 'Examenul de Stat TIC • Clasa a VII-a (Unitatea 3B)' : 'Grade 7 ICT Exam • Unit 3B (Curriculum Certification)'}
          </span>
          <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
            {lang === 'ro'
              ? 'Răspunde corect la toate cele 5 întrebări pentru a primi Diploma Oficială'
              : 'Answer all 5 questions correctly to receive your Official Certificate'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>1. Prin ce se deosebește fundamental un <strong className="text-teal-300">Sistem Informațional Geografic (GIS)</strong> de o hartă tipărită pe hârtie?</>
              ) : (
                <>1. What fundamentally differentiates a <strong className="text-teal-300">Geographic Information System (GIS)</strong> from a printed paper map?</>
              )}
            </div>
            {q1 === 'gis_complete_sys' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQ1('q1_w1')}
              disabled={q1Cd > 0 || q1 === 'gis_complete_sys'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1 === 'q1_w1' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. Harta pe hârtie este digitală, iar GIS-ul este tipărit la imprimantă' : 'A. Paper maps are digital whereas GIS is printed with ink'}
            </button>
            <button
              onClick={() => handleQ1('gis_complete_sys')}
              disabled={q1Cd > 0 || q1 === 'gis_complete_sys'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1 === 'gis_complete_sys' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. GIS-ul combină reprezentarea vizuală pe straturi independente cu baze de date relaționale (tabele de atribute) permițând interogări și analize spațiale interactive'
                : 'B. GIS integrates thematic layered visuals with relational attribute database tables, enabling dynamic querying and spatial analysis'}
            </button>
            <button
              onClick={() => handleQ1('q1_w2')}
              disabled={q1Cd > 0 || q1 === 'gis_complete_sys'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1 === 'q1_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. Nu există nicio diferență; sunt denumiri sinonime pentru același lucru' : 'C. There is no difference; both terms mean the exact same object'}
            </button>
            <button
              onClick={() => handleQ1('q1_w3')}
              disabled={q1Cd > 0 || q1 === 'gis_complete_sys'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1 === 'q1_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Harta de hârtie se actualizează automat prin satelit în fiecare secundă' : 'D. Paper maps update in real time via satellite telemetry every second'}
            </button>
          </div>

          {q1Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q1Msg}</span>
              {q1Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">{lang === 'ro' ? `Așteaptă ${q1Cd}s...` : `Wait ${q1Cd}s...`}</span>}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>2. În ce poziție trebuie plasat stratul opac de <strong className="text-cyan-300">Relief / Topografie</strong> în stiva de straturi GIS?</>
              ) : (
                <>2. Where must the opaque <strong className="text-cyan-300">Relief / Elevation Base Layer</strong> be positioned in a GIS layer stack?</>
              )}
            </div>
            {q2 === 'relief_base' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQ2('q2_w1')}
              disabled={q2Cd > 0 || q2 === 'relief_base'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2 === 'q2_w1' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. În vârful stivei, deasupra tuturor celorlalte elemente' : 'A. At the top of the stack, over all other elements'}
            </button>
            <button
              onClick={() => handleQ2('relief_base')}
              disabled={q2Cd > 0 || q2 === 'relief_base'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2 === 'relief_base' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. La baza stivei (jos), ca strat de fundal, pentru a nu acoperi drumurile, râurile și așezările urbane'
                : 'B. At the bottom of the stack as a background layer, avoiding covering roads, rivers, and settlements'}
            </button>
            <button
              onClick={() => handleQ2('q2_w2')}
              disabled={q2Cd > 0 || q2 === 'relief_base'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2 === 'q2_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. În afara programului GIS, salvat ca fișier text .txt' : 'C. Outside the GIS program, stored as a .txt file'}
            </button>
            <button
              onClick={() => handleQ2('q2_w3')}
              disabled={q2Cd > 0 || q2 === 'relief_base'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2 === 'q2_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Ordinea nu are nicio importanță vizuală' : 'D. Stacking order has zero visual significance'}
            </button>
          </div>

          {q2Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q2Msg}</span>
              {q2Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">{lang === 'ro' ? `Așteaptă ${q2Cd}s...` : `Wait ${q2Cd}s...`}</span>}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>3. Care este asocierea corectă a formelor geometrice vectoriale: <strong className="text-amber-300">Vârful Moldoveanu</strong>, <strong className="text-cyan-300">Râul Olt</strong> și <strong className="text-emerald-300">Parcul Național Retezat</strong>?</>
              ) : (
                <>3. What is the correct vector geometric primitive mapping for: <strong className="text-amber-300">Moldoveanu Peak</strong>, <strong className="text-cyan-300">Olt River</strong>, and <strong className="text-emerald-300">Retezat National Park</strong>?</>
              )}
            </div>
            {q3 === 'vector_primitives' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQ3('vector_primitives')}
              disabled={q3Cd > 0 || q3 === 'vector_primitives'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3 === 'vector_primitives' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Moldoveanu = Punct (Point); Olt = Linie (Polyline); Retezat = Poligon (Polygon)'
                : 'A. Moldoveanu = Point; Olt = Line (Polyline); Retezat = Polygon (Area)'}
            </button>
            <button
              onClick={() => handleQ3('q3_w1')}
              disabled={q3Cd > 0 || q3 === 'vector_primitives'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3 === 'q3_w1' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'B. Toate trei sunt poligoane tridimensionale' : 'B. All three are 3D volumetric solids'}
            </button>
            <button
              onClick={() => handleQ3('q3_w2')}
              disabled={q3Cd > 0 || q3 === 'vector_primitives'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3 === 'q3_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. Moldoveanu = Linie; Olt = Poligon; Retezat = Punct' : 'C. Moldoveanu = Polyline; Olt = Polygon; Retezat = Point'}
            </button>
            <button
              onClick={() => handleQ3('q3_w3')}
              disabled={q3Cd > 0 || q3 === 'vector_primitives'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3 === 'q3_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. În GIS nu se pot desena parcuri naționale sau râuri' : 'D. In GIS you cannot map rivers or national parks'}
            </button>
          </div>

          {q3Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q3Msg}</span>
              {q3Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">{lang === 'ro' ? `Așteaptă ${q3Cd}s...` : `Wait ${q3Cd}s...`}</span>}
            </div>
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>4. În ce emisfere și între ce coordonate aproximative se situează teritoriul <strong className="text-teal-300">României</strong>?</>
              ) : (
                <>4. In which hemispheres and approximate coordinates is the territory of <strong className="text-teal-300">Romania</strong> located?</>
              )}
            </div>
            {q4 === 'coords_romania' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQ4('q4_w1')}
              disabled={q4Cd > 0 || q4 === 'coords_romania'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q4 === 'q4_w1' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. Emisfera Sudică și Emisfera Vestică (la sud de Ecuator)' : 'A. Southern and Western Hemispheres (south of the Equator)'}
            </button>
            <button
              onClick={() => handleQ4('coords_romania')}
              disabled={q4Cd > 0 || q4 === 'coords_romania'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q4 === 'coords_romania' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Emisfera Nordică (latitudine ~43°–48° N) și Emisfera Estică (longitudine ~20°–29° E)'
                : 'B. Northern Hemisphere (latitude ~43°–48° N) and Eastern Hemisphere (longitude ~20°–29° E)'}
            </button>
            <button
              onClick={() => handleQ4('q4_w2')}
              disabled={q4Cd > 0 || q4 === 'coords_romania'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q4 === 'q4_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. Exact pe Ecuator și pe Meridianul Zero simultan' : 'C. Concurrently at 0° Equator and 0° Prime Meridian'}
            </button>
            <button
              onClick={() => handleQ4('q4_w3')}
              disabled={q4Cd > 0 || q4 === 'coords_romania'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q4 === 'q4_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. În emisfera polară de vest, la -80° latitudine' : 'D. In the western polar hemisphere at -80° latitude'}
            </button>
          </div>

          {q4Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q4Msg}</span>
              {q4Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">{lang === 'ro' ? `Așteaptă ${q4Cd}s...` : `Wait ${q4Cd}s...`}</span>}
            </div>
          )}
        </div>

        {/* Q5 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>5. De ce impun normele de securitate digitală și confidențialitate (GDPR) ca elevii să <strong className="text-rose-400">NU publice</strong> coordonatele geografice ale casei pe hărți web deschise?</>
              ) : (
                <>5. Why do digital privacy and data protection rules (GDPR) dictate that students must <strong className="text-rose-400">NOT publish</strong> home coordinates on open web maps?</>
              )}
            </div>
            {q5 === 'gdpr_privacy' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQ5('q5_w1')}
              disabled={q5Cd > 0 || q5 === 'gdpr_privacy'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q5 === 'q5_w1' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. Pentru că serverele de hărți se strică dacă au prea multe adrese' : 'A. Because map servers crash if they store too many street addresses'}
            </button>
            <button
              onClick={() => handleQ5('q5_w2')}
              disabled={q5Cd > 0 || q5 === 'gdpr_privacy'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q5 === 'q5_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'B. Pentru că sateliții GPS consumă mai mult combustibil când localizează minori' : 'B. Because GPS satellites burn more propellant when tracking minors'}
            </button>
            <button
              onClick={() => handleQ5('gdpr_privacy')}
              disabled={q5Cd > 0 || q5 === 'gdpr_privacy'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q5 === 'gdpr_privacy' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. Coordonatele geospațiale sunt date personale sensibile; dezvăluirea lor publică expune copiii la riscuri de securitate și urmărire nedorită'
                : 'C. Geospatial coordinates are sensitive personal data; public disclosure creates severe privacy risks and unwanted tracking'}
            </button>
            <button
              onClick={() => handleQ5('q5_w3')}
              disabled={q5Cd > 0 || q5 === 'gdpr_privacy'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q5 === 'q5_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Este obligatoriu să publicăm adresa pe internet conform programei școlare' : 'D. It is mandatory to publish your home address online under syllabus rules'}
            </button>
          </div>

          {q5Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q5Msg}</span>
              {q5Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">{lang === 'ro' ? `Așteaptă ${q5Cd}s...` : `Wait ${q5Cd}s...`}</span>}
            </div>
          )}
        </div>

        {/* Submit Final Exam Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400">
            {allQuestionsPassed ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'ro'
                  ? `Toate cele 5 cerințe au fost promovate cu succes (100%)! ${studentName ? `Felicitări, ${studentName}!` : ''}`
                  : `All 5 exam requirements passed with 100%! ${studentName ? `Congratulations, ${studentName}!` : ''}`}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la toate cele 5 întrebări pentru a finaliza misiunea.'
                  : 'Answer all 5 questions correctly to complete the mission.'}
              </span>
            )}
          </div>

          <button
            onClick={handleFinalSubmit}
            disabled={!allQuestionsPassed}
            className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
              allQuestionsPassed
                ? 'bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black shadow-teal-500/30 active:scale-95 animate-pulse'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>
              {lang === 'ro'
                ? 'Finalizează Misiunea 3B & Emite Diploma Oficială'
                : 'Complete Unit 3B & Issue Official Certificate'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
