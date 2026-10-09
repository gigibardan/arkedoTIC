import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { lang } = useLanguage();
  const [showGuide, setShowGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowGuide(true);
    }
  };

  const buttonLabel = lang === 'en' ? 'Install App' : 'Instalează App';
  const buttonTitle =
    lang === 'en'
      ? 'Install ArkyEdu as native application on Desktop/Mobile'
      : 'Instalează ArkyEdu ca aplicație nativă pe calculator sau telefon';

  return (
    <>
      {installSuccess ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'en' ? 'Installed!' : 'Instalat!'}</span>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          title={buttonTitle}
          className={`flex items-center gap-1.5 rounded-xl font-bold transition cursor-pointer shadow-sm active:scale-95 ${
            variant === 'compact'
              ? 'px-2.5 py-1.5 text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white border border-sky-400/40 shadow-sky-950/40'
              : 'px-4 py-2 text-sm bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:brightness-110 text-white border border-cyan-400/30'
          } ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-sky-200 animate-bounce" />
          <span>{buttonLabel}</span>
        </button>
      )}

      {/* Guide Modal for iOS Safari or manual browser install instructions */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              aria-label="Închide"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  {lang === 'en' ? 'Install ArkyEdu PWA' : 'Instalare Aplicație ArkyEdu'}
                </h3>
                <p className="text-xs text-sky-300 font-mono">
                  {lang === 'en' ? 'Standalone & Offline Mode' : 'Mod Nativ & Funcționare Offline'}
                </p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300">
                <p className="font-semibold text-white">
                  {lang === 'en'
                    ? 'To install on iPhone or iPad (Safari):'
                    : 'Pentru instalare pe iPhone sau iPad (Safari):'}
                </p>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    {lang === 'en' ? 'Tap the ' : 'Apasă butonul de '}
                    <strong className="text-white inline-flex items-center gap-1 mx-1">
                      <Share className="w-3.5 h-3.5 inline text-sky-400" /> Share (Partajare)
                    </strong>
                    {lang === 'en' ? 'in the bottom toolbar.' : 'din bara Safari.'}
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    {lang === 'en' ? 'Scroll down and select ' : 'Derulează în jos și alege '}
                    <strong className="text-emerald-400 inline-flex items-center gap-1 mx-1">
                      <PlusSquare className="w-3.5 h-3.5 inline" />{' '}
                      {lang === 'en' ? 'Add to Home Screen' : 'Adaugă pe ecranul principal'}
                    </strong>
                    .
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300">
                <p className="font-semibold text-white">
                  {lang === 'en'
                    ? 'Desktop & Android Installation:'
                    : 'Instalare pe PC / Desktop / Android:'}
                </p>
                <p className="text-slate-300">
                  {lang === 'en'
                    ? 'Click the install icon in your browser address bar (top-right in Chrome/Edge), or select "Install App" from browser settings menu.'
                    : 'Apasă pe pictograma de instalare din bara de adresă (sus în dreapta în Chrome/Edge) sau alege "Instalează aplicația" din meniul browserului.'}
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
                  💡 {lang === 'en'
                    ? 'After installation, the app launches in full-screen standalone window and works offline without internet.'
                    : 'După instalare, aplicația se deschide într-o fereastră nativă dedicată și funcționează complet offline în laborator.'}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold text-white transition cursor-pointer"
            >
              {lang === 'en' ? 'Got it' : 'Am înțeles'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
