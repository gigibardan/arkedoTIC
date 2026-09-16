import React from 'react';
import { AlertTriangle, ArrowRight, RotateCcw, X, Clock, Star } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MissionGuardModalProps {
  isOpen: boolean;
  activeMissionTitle: string;
  activeLevel: number;
  activeScore: number;
  elapsedSeconds: number;
  targetMissionTitle: string;
  onResumeActive: () => void;
  onAbandonAndStartNew: () => void;
  onCancel: () => void;
}

export const MissionGuardModal: React.FC<MissionGuardModalProps> = ({
  isOpen,
  activeMissionTitle,
  activeLevel,
  activeScore,
  elapsedSeconds,
  targetMissionTitle,
  onResumeActive,
  onAbandonAndStartNew,
  onCancel,
}) => {
  if (!isOpen) return null;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins} min ${remainingSec} sec`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={() => {
            sounds.playClick();
            onCancel();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl border border-amber-500/40">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 font-mono">
              Regulă Pedagogică Laborator TIC
            </span>
            <h3 className="text-xl font-black text-white font-heading">
              Ai deja o misiune în desfășurare!
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          Nu poți începe <strong>{targetMissionTitle}</strong> în timp ce lucrezi la o altă provocare. Profesorul recomandă să termini misiunea curentă pentru a nu pierde punctele și diploma de merit!
        </p>

        {/* Current Active Mission Status Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
            Misiune activă nesalvată:
          </div>
          <div className="text-sm font-black text-emerald-400 mb-2">
            {activeMissionTitle}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">Stadiu:</span>
              <strong className="text-white">Nivel {activeLevel}/5</strong>
            </div>
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">Punctaj:</span>
              <strong className="text-amber-400 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> {activeScore} pct
              </strong>
            </div>
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">Timp:</span>
              <strong className="text-cyan-400 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> {formatTime(elapsedSeconds)}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              sounds.playClick();
              onResumeActive();
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
          >
            <span>Continuă Misiunea În Desfășurare (Recomandat)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onAbandonAndStartNew();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Abandonează progresul și deschide noua misiune</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-400 transition cursor-pointer"
          >
            Rămâi în Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
