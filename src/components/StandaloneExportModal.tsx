import React, { useState } from 'react';
import { X, Copy, Download, Check, FileCode } from 'lucide-react';
import { generateStandaloneHtml } from '../utils/standaloneHtml';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const htmlCode = generateStandaloneHtml(lang);

  const handleCopy = () => {
    sounds.playCorrect();
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    sounds.playCorrect();
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `index_${lang}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                {t.modalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.modalSub}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Code Preview & Instructions */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-300 leading-relaxed">
            {t.modalTeacherNote}
          </div>

          <div className="relative">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-slate-300 h-64 overflow-y-auto leading-relaxed select-all">
              <pre>{htmlCode}</pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-850 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-mono">
            {t.modalSizeInfo}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.modalBtnCopied : t.modalBtnCopy}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <Download className="w-4 h-4" />
              <span>{t.modalBtnDownload}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
