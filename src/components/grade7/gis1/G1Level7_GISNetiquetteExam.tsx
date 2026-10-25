import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, MapPin, Globe, Lock, EyeOff, BookOpen, Compass } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface G1Level7Props {
  onPass: (score: number) => void;
  studentName?: string;
}

export const G1Level7_GISNetiquetteExam: React.FC<G1Level7Props> = ({ onPass, studentName }) => {
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

  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);

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
      setQ1Msg('Incorect! Un GIS este un sistem complet de captare, stocare pe straturi, interogare tabelară și analiză a datelor spațiale, spre deosebire de o hartă statică de hârtie.');
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
      setQ2Msg('Incorect! În stiva de straturi (Layers), stratul opac de relief/topografie trebuie plasat la baza stivei (jos), altfel va acoperi și va ascunde straturile de drumuri, ape și orașe!');
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
      setQ3Msg('Incorect! Cele 3 forme vectoriale sunt: Punct (X, Y unic, ex. vârf munte), Linie (lungime continuă, ex. râu) și Poligon (arie închisă cu suprafață și perimetru, ex. parc național).');
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
      setQ4Msg('Incorect! România se situează în emisfera nordică (latitudine nordică 43°–48° N față de Ecuator) și în emisfera estică (longitudine estică 20°–29° E față de Meridianul Greenwich).');
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
      setQ5Msg('Incorect! Protecția datelor cu caracter personal (GDPR) interzice publicarea locației exacte a locuinței sau a traseului zilnic al minorilor pe hărți web publice, din motive esențiale de securitate.');
    }
  };

  const allQuestionsPassed = q1 === 'gis_complete_sys' && q2 === 'relief_base' && q3 === 'vector_primitives' && q4 === 'coords_romania' && q5 === 'gdpr_privacy';

  const handleFinalSubmit = () => {
    if (allQuestionsPassed) {
      sounds.playVictory();
      setIsExamCompleted(true);
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
                  Nivelul 7 • Unitatea 3B (Manual pag. 57–63)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  Netichetă & Examen de Certificare
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                Netica Cartografică & Marea Certificare GIS Clasa a VII-a
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Award className="w-4 h-4 text-amber-400" />
            <span>100 Puncte (Nota 10)</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          Felicitări pentru parcurgerea celor 6 etape practice! Înainte de a susține <strong className="text-teal-300">Examenul Final de Certificare</strong>, parcurge cu atenție <strong className="text-amber-300">cele 4 Reguli de Aur ale Geolocației Responsabile</strong>.
        </p>
      </div>

      {/* 4 Golden Rules of Cartographic Netiquette & Privacy */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Codul Deontologic al Cartografului Digital
          </span>
          <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
            Cele 4 Reguli de Aur ale Securității & Confidențialității în GIS (GDPR)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>1. Protecția Adresei Private & a Locuinței</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Nu distribui niciodată public pe hărți web deschise (OpenStreetMap, Google My Maps) coordonatele GPS exacte ale domiciliului tău sau traseul pe care mergi singur la școală. Informațiile georeferențiate sunt date personale sensibile!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>2. Acuratețe în Proiecte Collaborative</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Când contribui la hărți deschise comunitare, adaugă doar date reale verificate pe teren. Introducerea de puncte fictive sau glume cartografice reprezintă vandalism digital și poate induce în eroare serviciile de urgență.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <BookOpen className="w-4 h-4" />
              <span>3. Respectarea Licențelor & Drepturilor de Autor</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Imaginile satelitare de înaltă rezoluție și straturile digitale sunt protejate prin drepturi de autor. Menționează întotdeauna sursa datelor cartografice (ex: Agenția Spațială Europeană ESA, ANCPI, OpenStreetMap).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Compass className="w-4 h-4" />
              <span>4. Siguranță Personală pe Teren</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Când participi la activități școlare în natură cu telefonul pe post de busolă sau receptor GPS, nu privi continuu în ecran în timp ce mergi pe teren accidentat, pe marginea prăpastiei sau în apropierea carosabilului.
            </p>
          </div>
        </div>
      </div>

      {/* The 5 Final Exam Questions */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Examenul de Stat TIC • Clasa a VII-a (Unitatea 3B)
          </span>
          <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
            Răspunde corect la toate cele 5 întrebări pentru a primi Diploma Oficială
          </h2>
        </div>

        {/* Q1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              1. Prin ce se deosebește fundamental un <strong className="text-teal-300">Sistem Informațional Geografic (GIS)</strong> de o hartă tipărită pe hârtie?
            </div>
            {q1 === 'gis_complete_sys' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Harta pe hârtie este digitală, iar GIS-ul este tipărit la imprimantă
            </button>
            <button
              onClick={() => handleQ1('gis_complete_sys')}
              disabled={q1Cd > 0 || q1 === 'gis_complete_sys'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1 === 'gis_complete_sys' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              B. GIS-ul combină reprezentarea vizuală pe straturi independente cu baze de date relaționale (tabele de atribute) permițând interogări și analize spațiale interactive
            </button>
            <button
              onClick={() => handleQ1('q1_w2')}
              disabled={q1Cd > 0 || q1 === 'gis_complete_sys'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1 === 'q1_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              C. Nu există nicio diferență; sunt denumiri sinonime pentru același lucru
            </button>
            <button
              onClick={() => handleQ1('q1_w3')}
              disabled={q1Cd > 0 || q1 === 'gis_complete_sys'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1 === 'q1_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              D. Harta de hârtie se actualizează automat prin satelit în fiecare secundă
            </button>
          </div>

          {q1Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q1Msg}</span>
              {q1Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">Așteaptă {q1Cd}s...</span>}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              2. În ce poziție trebuie plasat stratul opac de <strong className="text-cyan-300">Relief / Topografie</strong> în stiva de straturi GIS?
            </div>
            {q2 === 'relief_base' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. În vârful stivei, deasupra tuturor celorlalte elemente
            </button>
            <button
              onClick={() => handleQ2('relief_base')}
              disabled={q2Cd > 0 || q2 === 'relief_base'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2 === 'relief_base' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              B. La baza stivei (jos), ca strat de fundal, pentru a nu acoperi drumurile, râurile și așezările urbane
            </button>
            <button
              onClick={() => handleQ2('q2_w2')}
              disabled={q2Cd > 0 || q2 === 'relief_base'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2 === 'q2_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              C. În afara programului GIS, salvat ca fișier text .txt
            </button>
            <button
              onClick={() => handleQ2('q2_w3')}
              disabled={q2Cd > 0 || q2 === 'relief_base'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2 === 'q2_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              D. Ordinea nu are nicio importanță vizuală
            </button>
          </div>

          {q2Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q2Msg}</span>
              {q2Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">Așteaptă {q2Cd}s...</span>}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              3. Care este asocierea corectă a formelor geometrice vectoriale: <strong className="text-amber-300">Vârful Moldoveanu</strong>, <strong className="text-cyan-300">Râul Olt</strong> și <strong className="text-emerald-300">Parcul Național Retezat</strong>?
            </div>
            {q3 === 'vector_primitives' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Moldoveanu = Punct (Point); Olt = Linie (Polyline); Retezat = Poligon (Polygon)
            </button>
            <button
              onClick={() => handleQ3('q3_w1')}
              disabled={q3Cd > 0 || q3 === 'vector_primitives'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3 === 'q3_w1' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              B. Toate trei sunt poligoane tridimensionale
            </button>
            <button
              onClick={() => handleQ3('q3_w2')}
              disabled={q3Cd > 0 || q3 === 'vector_primitives'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3 === 'q3_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              C. Moldoveanu = Linie; Olt = Poligon; Retezat = Punct
            </button>
            <button
              onClick={() => handleQ3('q3_w3')}
              disabled={q3Cd > 0 || q3 === 'vector_primitives'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3 === 'q3_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              D. În GIS nu se pot desena parcuri naționale sau râuri
            </button>
          </div>

          {q3Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q3Msg}</span>
              {q3Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">Așteaptă {q3Cd}s...</span>}
            </div>
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              4. În ce emisfere și între ce coordonate aproximative se situează teritoriul <strong className="text-teal-300">României</strong>?
            </div>
            {q4 === 'coords_romania' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Emisfera Sudică și Emisfera Vestică (la sud de Ecuator)
            </button>
            <button
              onClick={() => handleQ4('coords_romania')}
              disabled={q4Cd > 0 || q4 === 'coords_romania'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q4 === 'coords_romania' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              B. Emisfera Nordică (latitudine ~43°–48° N) și Emisfera Estică (longitudine ~20°–29° E)
            </button>
            <button
              onClick={() => handleQ4('q4_w2')}
              disabled={q4Cd > 0 || q4 === 'coords_romania'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q4 === 'q4_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              C. Exact pe Ecuator și pe Meridianul Zero simultan
            </button>
            <button
              onClick={() => handleQ4('q4_w3')}
              disabled={q4Cd > 0 || q4 === 'coords_romania'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q4 === 'q4_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              D. În emisfera polară de vest, la -80° latitudine
            </button>
          </div>

          {q4Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q4Msg}</span>
              {q4Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">Așteaptă {q4Cd}s...</span>}
            </div>
          )}
        </div>

        {/* Q5 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              5. De ce impun normele de securitate digitală și confidențialitate (GDPR) ca elevii să <strong className="text-rose-400">NU publice</strong> coordonatele geografice ale casei pe hărți web deschise?
            </div>
            {q5 === 'gdpr_privacy' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Pentru că serverele de hărți se strică dacă au prea multe adrese
            </button>
            <button
              onClick={() => handleQ5('q5_w2')}
              disabled={q5Cd > 0 || q5 === 'gdpr_privacy'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q5 === 'q5_w2' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              B. Pentru că sateliții GPS consumă mai mult combustibil când localizează minori
            </button>
            <button
              onClick={() => handleQ5('gdpr_privacy')}
              disabled={q5Cd > 0 || q5 === 'gdpr_privacy'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q5 === 'gdpr_privacy' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              C. Coordonatele geospațiale sunt date personale sensibile; dezvăluirea lor publică expune copiii la riscuri de securitate și urmărire nedorită
            </button>
            <button
              onClick={() => handleQ5('q5_w3')}
              disabled={q5Cd > 0 || q5 === 'gdpr_privacy'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q5 === 'q5_w3' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              } disabled:cursor-not-allowed`}
            >
              D. Este obligatoriu să publicăm adresa pe internet conform programei școlare
            </button>
          </div>

          {q5Msg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q5Msg}</span>
              {q5Cd > 0 && <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">Așteaptă {q5Cd}s...</span>}
            </div>
          )}
        </div>

        {/* Submit Final Exam Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400">
            {allQuestionsPassed ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Toate cele 5 cerințe au fost promovate cu succes (100%)!
              </span>
            ) : (
              <span>Răspunde corect la toate cele 5 întrebări pentru a finaliza misiunea.</span>
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
            <span>Finalizează Misiunea 3B & Emite Diploma Oficială</span>
          </button>
        </div>
      </div>
    </div>
  );
};
