import React, { useState } from 'react';
import {
  Glasses,
  Smartphone,
  Eye,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';

interface Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

type TechType = 'VR' | 'AR' | 'MR';

export const AnimVRLevel5_VRvsARvsMRComparison: React.FC<Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive Scenario Classification
  const scenarios = [
    {
      id: 'mars',
      titleRo: 'Expediție Virtuală pe Marte cu Cască Oculus/Cardboard',
      titleEn: 'Virtual Expedition on Mars with VR Headset',
      descRo: 'Elevul își pune ochelarii opaci pe ochi și se poate uita la 360° pe suprafața planetei roșii, camera reală fiind complet invizibilă.',
      descEn: 'The student wears opaque goggles and looks 360° around the red planet, the real classroom being completely invisible.',
      correct: 'VR' as TechType,
      emoji: '🪐'
    },
    {
      id: 'desk_dino',
      titleRo: 'Dinozaur 3D Proiectat pe Banca de la Școală prin Tabletă',
      titleEn: '3D Dinosaur Projected on Classroom Desk via Tablet',
      descRo: 'Camera tabletei filmează banca fizică din clasă, iar pe ecran apare un T-Rex 3D care merge peste caietul de matematică.',
      descEn: 'The tablet camera films the physical desk, and on the screen a 3D T-Rex appears walking on top of the notebook.',
      correct: 'AR' as TechType,
      emoji: '🦖'
    },
    {
      id: 'flight_sim',
      titleRo: 'Simulator de Zbor Imersiv 360° pentru Piloți',
      titleEn: '360° Immersive Flight Simulator for Pilots',
      descRo: 'Pilotul vede doar cabina virtuală de avion generată de computer, învățând manevre de urgență într-un mediu 100% digital.',
      descEn: 'The pilot sees only the computer-generated virtual cockpit, training emergency procedures in a 100% digital world.',
      correct: 'VR' as TechType,
      emoji: '✈️'
    },
    {
      id: 'ar_ruler',
      titleRo: 'Măsurarea Lungimii unei Camere cu Aplicația Riglă de pe Telefon',
      titleEn: 'Measuring Room Dimensions with Phone AR Ruler App',
      descRo: 'Camera telefonului detectează podeaua reală și suprapune o bandă metrică digitală care indică dimensiunea peretelui.',
      descEn: 'The camera detects the real floor and overlays a digital measuring tape showing the wall dimension.',
      correct: 'AR' as TechType,
      emoji: '📏'
    }
  ];

  const [classifications, setClassifications] = useState<Record<string, TechType | null>>({
    mars: null,
    desk_dino: null,
    flight_sim: null,
    ar_ruler: null
  });

  // Quiz questions
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);

  const handleClassify = (scenarioId: string, tech: TechType) => {
    sounds.playPop();
    setClassifications((prev) => ({
      ...prev,
      [scenarioId]: tech
    }));
  };

  const isScenarioCorrect = (scenarioId: string) => {
    const item = scenarios.find((s) => s.id === scenarioId);
    return item && classifications[scenarioId] === item.correct;
  };

  const allScenariosClassified = scenarios.every((s) => classifications[s.id] !== null);
  const allScenariosCorrect = scenarios.every((s) => isScenarioCorrect(s.id));

  const handleQ1 = (val: string) => {
    setQ1(val);
    if (val === 'immersion') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleQ2 = (val: string) => {
    setQ2(val);
    if (val === 'breaks') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const allCompleted = allScenariosCorrect && q1 === 'immersion' && q2 === 'breaks';

  const handleContinue = () => {
    if (!allCompleted) return;
    sounds.playLevelUp();
    onCompletePage(15);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/40 via-emerald-900/40 to-slate-900/60 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold tracking-wider uppercase">
                {isEn ? 'Unit 2B • Lesson 4 (Part I)' : 'Unitatea 2B • Lecția 4 (Partea I)'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                Manual pag. 40–42
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
              {isEn ? 'VR vs AR vs MR: Immersive Technologies' : 'Realitate Virtuală (VR) vs Augmentată (AR)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isEn
                ? 'Understand the crucial difference between 100% digital worlds (Virtual Reality) and digital overlays onto the real physical world (Augmented Reality).'
                : 'Înțelege diferența fundamentală dintre imersiunea completă într-o lume digitală (VR) și suprapunerea hologramelor 3D peste lumea fizică reală (AR).'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
              <Glasses className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VR Card */}
        <div className="bg-slate-900/90 border-2 border-teal-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center text-2xl font-bold">
                🥽
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">Imersiune 100%</span>
                <h3 className="text-xl font-bold text-white font-heading">
                  {isEn ? 'Virtual Reality (VR)' : 'Realitate Virtuală (VR)'}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {isEn
                ? 'The user is completely immersed in an artificial 3D computer world. Real physical surroundings are shut out through a VR headset with 360° tracking.'
                : 'Utilizatorul este transportat 100% într-o lume artificială 3D generată de calculator. Lumea reală este complet blocată de ochelari VR opaci (Google Cardboard, Meta Quest, HTC Vive).'}
            </p>

            <ul className="text-xs text-slate-300 space-y-2 mb-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-teal-400 font-bold">✓</span>
                <span><b>Câmp vizual 360°:</b> Când întorci capul, mediul virtual se rotește în timp real datorită giroscopului.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 font-bold">✓</span>
                <span><b>Aplicații școlare:</b> Vizite în muzee din alte țări, călătorii pe fundul oceanului sau în cosmos.</span>
              </li>
            </ul>
          </div>

          <div className="bg-teal-950/40 border border-teal-800/40 rounded-xl p-2.5 text-[11px] text-teal-300 font-mono">
            🔑 Dispozitive: Ochelari VR opaci, controllere de mână, senzori giroscopici
          </div>
        </div>

        {/* AR Card */}
        <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl font-bold">
                📱
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Suprapunere Lume Reală</span>
                <h3 className="text-xl font-bold text-white font-heading">
                  {isEn ? 'Augmented Reality (AR)' : 'Realitate Augmentată (AR)'}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {isEn
                ? 'Adds digital objects (3D models, labels, data) on top of the real physical world view captured by camera lenses or transparent glasses.'
                : 'Suprapune elemente digitale 3D (holograme, modele, măsurători, etichete) peste lumea fizică reală vizibilă prin camera telefonului, tabletei sau a ochelarilor transparenți.'}
            </p>

            <ul className="text-xs text-slate-300 space-y-2 mb-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Lumea reală rămâne vizibilă:</b> Sala de clasă și colegii sunt mereu în câmpul vizual al utilizatorului.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Aplicații școlare:</b> Modele 3D de anatomie pe catedră, traduceri de texte în direct pe panouri, riglă AR.</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-2.5 text-[11px] text-emerald-300 font-mono">
            🔑 Dispozitive: Telefoane inteligente, tablete, ochelari smart transparenți
          </div>
        </div>
      </div>

      {/* Interactive Classification Laboratory */}
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center text-xl">
            🧪
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? 'Laboratory: Classify Everyday Scenarios' : 'Laborator Interactiv: Clasifică Scenariile (VR sau AR)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Identify whether each real-world case is Virtual Reality (VR) or Augmented Reality (AR).'
                : 'Alege dacă fiecare situație practică reprezintă Realitate Virtuală (VR) sau Realitate Augmentată (AR).'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((item) => {
            const chosen = classifications[item.id];
            const isCorrect = chosen === item.correct;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  chosen === null
                    ? 'bg-slate-950/70 border-slate-800'
                    : isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                    : 'bg-rose-950/30 border-rose-500/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    {chosen && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {isCorrect ? 'Corect ✅' : 'Incorect ❌'}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{item.titleRo}</h4>
                  <p className="text-xs text-slate-400 mb-4">{item.descRo}</p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                  <span className="text-xs font-mono text-slate-400">Alege tipul:</span>
                  <button
                    onClick={() => handleClassify(item.id, 'VR')}
                    className={`flex-1 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                      chosen === 'VR'
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    🥽 VR (Virtual)
                  </button>
                  <button
                    onClick={() => handleClassify(item.id, 'AR')}
                    className={`flex-1 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                      chosen === 'AR'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    📱 AR (Augmentat)
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {allScenariosCorrect && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <b>Excelent!</b> Ai diferențiat impecabil cele două tehnologii: VR izolează complet privirea într-o lume artificială 3D, în timp ce AR menține contactul vizual cu mediul fizic din jur.
            </div>
          </div>
        )}
      </div>

      {/* Safety & Ergonomics In VR Box */}
      <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {isEn ? 'Ergonomics & Safety in VR (Textbook p. 42)' : 'Reguli de Siguranță & Ergonomie în VR (Manual pag. 42)'}
            </h4>
            <p className="text-xs text-slate-400">
              {isEn
                ? 'Avoid dizziness (simulator sickness) with 15-minute breaks and clearing physical space from hazards.'
                : 'Fă pauză la fiecare 15 minute pentru a preveni răul cibernetic (răul de mișcare) și eliberează spațiul din cameră pentru a nu te lovi.'}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-amber-400 bg-amber-950/50 px-3 py-1.5 rounded-xl border border-amber-700/50 whitespace-nowrap self-start sm:self-auto">
          ⚠️ Regula 15 min pauză
        </div>
      </div>

      {/* Evaluation Quiz */}
      <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
            ✍️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? 'Evaluation Questions' : 'Verificare de Cunoștințe (2 Întrebări)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Answer both questions correctly to earn your XP and proceed to Level 6.'
                : 'Răspunde corect la cele 2 întrebări din programa de TIC pentru a debloca Nivelul 6.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-mono">1</span>
                {isEn
                  ? 'What is the key difference between VR and AR?'
                  : 'Care este diferența cheie dintre Realitatea Virtuală (VR) și Realitatea Augmentată (AR)?'}
              </h3>
              <QuestionHint
                hintRo="VR te izolează complet într-o lume artificială, în timp ce AR păstrează vizibilă lumea reală și adaugă elemente peste ea."
                hintEn="VR isolates you completely in a digital world, while AR keeps the real world visible and overlays elements onto it."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'immersion', label: 'VR izolează complet utilizatorul într-o lume 3D, pe când AR suprapune obiecte peste mediul real' },
                { id: 'sound', label: 'VR funcționează doar fără sunet, în timp ce AR este doar un fișier audio MP3' },
                { id: 'cable', label: 'Nu există nicio diferență, sunt identice' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q1 === opt.id
                      ? opt.id === 'immersion'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q1 === opt.id && (opt.id === 'immersion' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {q1 && (
              <AnswerExplanation
                isCorrect={q1 === 'immersion'}
                explanationRo="Corect! VR (Virtual Reality) creează o imersiune totală blocând lumea exterioară, în timp ce AR (Augmented Reality) îmbogățește lumea reală cu elemente digitale."
                explanationEn="Correct! VR provides total immersion by shutting out the outside world, while AR enriches the physical world with digital elements."
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-mono">2</span>
                {isEn
                  ? 'Why must students take regular breaks (every 15–20 minutes) when using VR headsets?'
                  : 'De ce este recomandat ca elevii să facă pauze regulate (la fiecare 15–20 de minute) când utilizează ochelarii VR?'}
              </h3>
              <QuestionHint
                hintRo="Pentru a proteja vederea și a preveni răul de mișcare (simulator sickness / amețeală)."
                hintEn="To protect eyesight and prevent simulator sickness (dizziness)."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'breaks', label: 'Pentru odihna ochilor și prevenirea răului de mișcare cibernetic (simulator sickness)' },
                { id: 'battery', label: 'Pentru că ochelarii explodează dacă stau porniți mai mult de 5 minute' },
                { id: 'wifi', label: 'Pentru că Internetul se epuizează din cabluri' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q2 === opt.id
                      ? opt.id === 'breaks'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q2 === opt.id && (opt.id === 'breaks' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {q2 && (
              <AnswerExplanation
                isCorrect={q2 === 'breaks'}
                explanationRo="Exact! Pauzele frecvente de 15 minute sunt esențiale pentru acomodarea vederii și evitarea senzației de dezechilibru sau oboseală vizuală."
                explanationEn="Exactly! Frequent 15-minute breaks are essential for eye relaxation and avoiding motion sickness or visual fatigue."
              />
            )}
          </div>
        </div>

        {/* Level Complete Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            {allCompleted ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {isEn ? 'VR vs AR mastered! You earned 15 XP.' : 'Clasificarea tehnologiilor imersive este completă! Ai obținut 15 XP.'}
              </span>
            ) : (
              <span>{isEn ? 'Classify all 4 scenarios correctly and answer both questions.' : 'Clasifică corect toate cele 4 scenarii și răspunde la întrebări.'}</span>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!allCompleted}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm font-heading flex items-center justify-center gap-2 transition-all ${
              allCompleted
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/30 cursor-pointer scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isEn ? 'Advance to Level 6: CoSpaces Edu 360° Worlds' : 'Treci la Nivelul 6: Lumi Virtuale 360° în CoSpaces Edu'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
