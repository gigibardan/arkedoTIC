import React, { useState } from 'react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';
import { Layers, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface HLevel4Props {
  onComplete: () => void;
}

type PeripheralType = 'input' | 'output' | 'inout';

interface DeviceItem {
  id: string;
  name: string;
  icon: string;
  type: PeripheralType;
  hint: string;
  bookDetail: string;
}

const DEVICES: DeviceItem[] = [
  {
    id: 'keyboard',
    name: 'Tastatură',
    icon: '⌨️',
    type: 'input',
    hint: 'Introduci litere, cifre și comenzi în calculator.',
    bookDetail: 'Principalul dispozitiv de intrare (pag. 16)',
  },
  {
    id: 'mouse',
    name: 'Mouse',
    icon: '🖱️',
    type: 'input',
    hint: 'Deplasează cursorul și trimite click-uri.',
    bookDetail: 'Dispozitiv de intrare pentru indicare și selecție (pag. 16)',
  },
  {
    id: 'scanner',
    name: 'Scaner',
    icon: '📠',
    type: 'input',
    hint: 'Citește texte/poze de pe hârtie și le introduce în PC.',
    bookDetail: 'Opusul imprimantei (pag. 16)',
  },
  {
    id: 'monitor',
    name: 'Monitor simplu',
    icon: '🖥️',
    type: 'output',
    hint: 'Afișează imaginile și rezultatele prelucrării datelor.',
    bookDetail: 'Cel mai cunoscut dispozitiv de ieșire (pag. 16)',
  },
  {
    id: 'printer',
    name: 'Imprimantă',
    icon: '🖨️',
    type: 'output',
    hint: 'Tipărește pe hârtie datele furnizate de calculator.',
    bookDetail: 'Dispozitiv de ieșire (pag. 16)',
  },
  {
    id: 'speakers',
    name: 'Boxe (Difuzoare)',
    icon: '🔊',
    type: 'output',
    hint: 'Redau muzica, vocile și coloana sonoră.',
    bookDetail: 'Dispozitiv de ieșire pentru sunet (pag. 16)',
  },
  {
    id: 'touchscreen',
    name: 'Ecran tactil (Touchscreen)',
    icon: '📱',
    type: 'inout',
    hint: 'Afișează imaginea (ieșire) și detectează atingerea degetului (intrare).',
    bookDetail: 'Dispozitiv de intrare-ieșire (pag. 16)',
  },
  {
    id: 'headset',
    name: 'Căști cu microfon',
    icon: '🎧',
    type: 'inout',
    hint: 'Microfonul introduce vocea, iar căștile redau sunetul.',
    bookDetail: 'Dispozitiv de intrare-ieșire cu dublu rol (pag. 16)',
  },
  {
    id: 'multifunctional',
    name: 'Multifuncțional (Imprimantă + Scaner)',
    icon: '🏢',
    type: 'inout',
    hint: 'Scanează documente (intrare) și tipărește pe hârtie (ieșire).',
    bookDetail: 'Dispozitiv combinat de intrare-ieșire (pag. 16)',
  },
];

export const HLevel4_PeripheralsSort: React.FC<HLevel4Props> = ({ onComplete }) => {
  // Device ID -> assigned category: 'input' | 'output' | 'inout'
  const [assignments, setAssignments] = useState<Record<string, PeripheralType>>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleAssign = (deviceId: string, type: PeripheralType) => {
    sounds.playClick();
    setAssignments(prev => ({
      ...prev,
      [deviceId]: type,
    }));
  };

  const totalAssigned = Object.keys(assignments).length;
  const allAssigned = totalAssigned === DEVICES.length;
  const allCorrect = DEVICES.every(d => assignments[d.id] === d.type);

  const handleValidate = () => {
    if (!allAssigned) {
      sounds.playWrong();
      setShowErrors(true);
      return;
    }

    if (allCorrect) {
      sounds.playCorrect();
      setCompleted(true);
      onComplete();
    } else {
      sounds.playWrong();
      setShowErrors(true);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-black uppercase tracking-wider font-mono">
              Nivelul 4 din 5 • Modulul Hardware
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Manual pag. 15–16</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            Trierea Perifericelor: Intrare, Ieșire, Intrare-Ieșire 🔌
          </h2>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            Recompensă: +20 puncte
          </span>
        </div>
      </div>

      {/* Teacher Pro Tip */}
      <TeacherTip
        title="Sfat de Profesionist: Cum recunoști direcția fluxului de date?"
        tip="• Pune-ți întrebarea simplă: informația merge de la OM spre CALCULATOR (Intrare: tastatură, scaner, microfon), sau iese din CALCULATOR spre OM (Ieșire: monitor, boxe, imprimantă)? Dacă un echipament le face pe amândouă în același corp (ecran tactil, multifuncțională, căști cu microfon), este de INTRARE-IEȘIRE!"
        bookPage="15–16"
        extraAdvice="Scanerul este opusul imprimantei: imprimanta dă viață pe hârtie fișierului din PC, iar scanerul digitalizează foaia de hârtie în PC!"
      />

      {/* Sorting Activity */}
      <div className="mb-7">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Clasifică fiecare dintre cele 9 dispozitive din manual:</span>
          </h3>
          <span className="text-xs font-mono text-purple-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700">
            {totalAssigned}/{DEVICES.length} clasificate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {DEVICES.map((dev) => {
            const currentChoice = assignments[dev.id];
            const isError = showErrors && currentChoice !== dev.type;
            const isCorrect = currentChoice === dev.type;

            return (
              <div
                key={dev.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                  isError
                    ? 'bg-rose-950/40 border-rose-500'
                    : isCorrect
                    ? 'bg-slate-900 border-emerald-500/60'
                    : 'bg-slate-900/70 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl">{dev.icon}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {dev.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dev.bookDetail}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {dev.hint}
                  </p>
                </div>

                {/* 3 classification buttons */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[10px] font-bold font-mono">
                  <button
                    onClick={() => handleAssign(dev.id, 'input')}
                    className={`py-1.5 px-1 rounded-lg transition border text-center cursor-pointer ${
                      currentChoice === 'input'
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    📥 Intrare
                  </button>

                  <button
                    onClick={() => handleAssign(dev.id, 'output')}
                    className={`py-1.5 px-1 rounded-lg transition border text-center cursor-pointer ${
                      currentChoice === 'output'
                        ? 'bg-amber-600 text-white border-amber-400 shadow'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    📤 Ieșire
                  </button>

                  <button
                    onClick={() => handleAssign(dev.id, 'inout')}
                    className={`py-1.5 px-1 rounded-lg transition border text-center cursor-pointer ${
                      currentChoice === 'inout'
                        ? 'bg-purple-600 text-white border-purple-400 shadow'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    🔄 In-Out
                  </button>
                </div>

                {isError && (
                  <p className="text-[10px] text-rose-400 font-bold">
                    Atenție: verifică explicația din manual pag. 16!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation / Next Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          {completed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Toate cele 9 periferice au fost triate impecabil! +20 puncte adăugate.
            </span>
          ) : (
            <span>Clasifică toate cele 9 echipamente în Intrare, Ieșire sau Intrare-Ieșire.</span>
          )}
        </div>

        <button
          onClick={handleValidate}
          disabled={completed}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
            completed
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 active:scale-95'
          }`}
        >
          <span>{completed ? 'Nivel Finalizat ✓' : 'Validează & Mergi la Nivelul 5 (+20 pct)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
