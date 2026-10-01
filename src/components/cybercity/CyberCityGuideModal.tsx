import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  Globe,
  Leaf,
  Users,
  Trophy,
  AlertTriangle,
  Cpu,
  Coins,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CyberCityGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTab = 'quickstart' | 'resources' | 'buildings' | 'incidents' | 'mayortips';

export const CyberCityGuideModal: React.FC<CyberCityGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<GuideTab>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-cyan-500/30">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-heading tracking-tight">
                  {lang === 'en' ? 'Mayor\'s Digital Handbook & Guide' : 'Manualul Oficial al Primarului Cibernetic'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-400/40">
                  ARKEDO CITY v2.0
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {lang === 'en'
                  ? 'Everything you need to know about building, optimizing and defending your metropolis!'
                  : 'Ghidul complet pentru proiectarea, extinderea și apărarea metropolei tale tehnologice!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-1.5 p-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'quickstart'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Cum se Joacă</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>2. Resurse & Indicatori</span>
          </button>

          <button
            onClick={() => setActiveTab('buildings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'buildings'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>3. Ghidul Clădirilor</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'incidents'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>4. Evenimente & Incidente</span>
          </button>

          <button
            onClick={() => setActiveTab('mayortips')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'mayortips'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>5. Secretele Primarului de Nota 10</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-200">
          {/* ================= TAB 1: QUICKSTART ================= */}
          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40">
                <h3 className="text-base font-black text-cyan-300 flex items-center gap-2 mb-2">
                  <span>🌆 Bine ai venit în ARKEDO Cyber City!</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Ești <strong>Primarul și Arhitectul Șef</strong> al propriei tale metropole digitale! Scopul tău este să construiești un oraș tehnologic prosper, ecologic și ultra-securizat, populat de mii de cetățeni cibernetici și roboței inteligenți.
                </p>
              </div>

              {/* 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center font-mono">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-white">Câștigă ByteCoins 🪙</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rezolvă exerciții în lecțiile din manual, participă la duelurile 1v1 sau joacă în laboratorul arcade pentru a acumula monede.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-black flex items-center justify-center font-mono">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-white">Construiește & Extinde 🏗️</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Apasă pe o parcelă liberă din grilă (+), alege o clădire din magazin (Datacenter, 5G, Energie Solară, Academie) și plaseaz-o în oraș.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-black flex items-center justify-center font-mono">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-white">Modernizează la Nivelul 5 ⭐</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Apasă pe orice clădire construită pentru a o moderniza până la nivelul Quantum (Nivel 5), deblocând mega-putere de calcul și populație!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: RESOURCES & METRICS ================= */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Fiecare clădire din oraș contribuie la cei <strong>6 Indicatori Vitali</strong> ai metropolei:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xl shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cyan-300">Putere de Calcul (TeraFLOPS)</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Generată de Centrele de Date, AI Labs și Fabricile de Microcipuri. Determină viteza de procesare a întregului oraș.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 text-xl shrink-0">
                    💾
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-teal-300">Stocare Cloud (PetaBytes)</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Generată de Server Racks și Vaults. Asigură spațiul de stocare pentru documentele, imaginile și jocurile cetățenilor.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 text-xl shrink-0">
                    🌐
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-sky-300">Lățime de Bandă (Tbps)</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Generată de Turnurile 5G/6G și Nodurile de Fibră Optică. Elimină lag-ul și permite streaming holografic live.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xl shrink-0">
                    🌿
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300">Scor Ecologic (Eco-Points)</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Generat de Matricea Solară, Reactoarele de Fuziune Curată și Parcurile Verzi. Serverele consumă mult curent, deci ai nevoie de energie verde!
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 text-xl shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-300">Securitate Cibernetică (Rating %)</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Generată de Turnurile Firewall și Centrele Antivirus. Protejează metropola împotriva hackerilor și atacurilor malware.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-xl shrink-0">
                    👥
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-300">Populație Cibernetică</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Numărul de cetățeni digitali, programatori și roboței Arky atrași de calitatea vieții și facilitățile educaționale ale orașului.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: BUILDINGS GUIDE ================= */}
          {activeTab === 'buildings' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Există <strong>5 categorii majore de clădiri</strong> în catalog. Fiecare clădire poate fi ridicată prin 5 niveluri spectaculoase:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Calcul & Inteligență Artificială</h4>
                      <p className="text-xs text-slate-400">Data Centers, AI Labs, Fabrici de Microcipuri.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">⚡ Max TFlops</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-teal-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📡</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Telecomunicații & Rețea</h4>
                      <p className="text-xs text-slate-400">Turnuri 5G/6G, Noduri Centrale de Fibră Optică.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-teal-300 font-bold">🌐 Max Tbps</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">☀️</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Energie Verde & Sustenabilitate</h4>
                      <p className="text-xs text-slate-400">Matrici Solare Inteligente, Reactoare de Fuziune Curată.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 font-bold">🌿 100% Zero Poluare</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎓</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Educație, Cultură & Parcuri</h4>
                      <p className="text-xs text-slate-400">Academia de Robotică, Muzeul Retro, Parcuri Bioluminescente.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-300 font-bold">👥 Atragere Populație</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Securitate Cibernetică & Protecție</h4>
                      <p className="text-xs text-slate-400">Turnuri Firewall, Centre Antivirus Sandbox.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-rose-300 font-bold">🚨 100% Apărare Date</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: INCIDENTS ================= */}
          {activeTab === 'incidents' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Evenimente & Incidente Urbane Spontane (Silențioase)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pe măsură ce orașul tău crește, pe hartă vor apărea oportunități și provocări de scurtă durată (indicate printr-o insignă pulsantă pe parcelă). Apasă pe parcelă pentru a soluționa incidentul și a câștiga <strong>ByteCoins și XP bonus</strong>!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>⚡ Vârf de Trafic Festival eSports</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Redirecționează lățimea de bandă pentru a menține transmisiile live stabile.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>🚨 Tentativă de Phishing Blocată</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Activează filtrele antispam ale firewall-ului pentru a proteja școala.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>💾 Fragment de Cod Istoric Găsit</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Decriptează o arhivă veche de dischete salvată în Muzeul Retro.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>🌿 Audit Ecologic de Eficiență</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Optimizează consumul energetic al serverelor cu ajutorul panourilor solare.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: MAYOR TIPS ================= */}
          {activeTab === 'mayortips' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40">
                <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4" />
                  <span>Secretele unui Oraș de Top (Top Architect Strategy)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pentru a urca în rangurile primăriei până la <strong>Arhitect Suprem Galactic</strong>, aplică aceste sfaturi esențiale:
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Păstrează Echilibrul Resurselor:</strong> Nu construi doar centre de calcul masive fără să adaugi panouri solare și turnuri firewall, altfel scorul ecologic și securitatea vor scădea!
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Prioritizează Modernizările (Upgrades):</strong> O clădire de Nivel 3 sau Nivel 5 produce mult mai multă putere de calcul pe aceeași parcelă decât mai multe clădiri de Nivel 1.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Vizitează Metropolele Colegilor:</strong> Explorează orașele colegilor de clasă din secțiunea „Orașele Colegilor”, inspiră-te din design-ul lor și oferă-le steluțe de apreciere!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg transition active:scale-95 cursor-pointer"
          >
            {lang === 'en' ? 'Got it, let\'s build! 🚀' : 'Am înțeles, la treabă! 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};
