import React from 'react';
import { CyberCityView } from './CyberCityView';
import { X } from 'lucide-react';

interface CyberCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentAvatar?: string;
}

export const CyberCityModal: React.FC<CyberCityModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentAvatar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-y-auto p-4 sm:p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 shadow-lg cursor-pointer transition active:scale-95"
          title="Închide orașul"
        >
          <X className="w-5 h-5" />
        </button>

        <CyberCityView
          studentName={studentName}
          studentAvatar={studentAvatar}
          onBackToCatalog={onClose}
        />
      </div>
    </div>
  );
};
