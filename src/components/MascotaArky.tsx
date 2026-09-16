import React, { useState, useEffect } from 'react';
import { ARKY_IMAGES, ArkyMascotState } from '../assets/arkyImages';
import { useArky } from '../context/ArkyContext';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';
import { 
  Sparkles, 
  Volume2, 
  Dices, 
  X, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  Bot
} from 'lucide-react';

export interface MascotaArkyProps {
  /** Optional direct state override if used standalone */
  state?: ArkyMascotState;
  /** Optional custom message override */
  customMessage?: string;
  /** Position style */
  position?: 'fixed-bottom-right' | 'inline';
  /** Extra CSS classes */
  className?: string;
}

export const MascotaArky: React.FC<MascotaArkyProps> = ({
  state: propState,
  customMessage: propMessage,
  position = 'fixed-bottom-right',
  className = '',
}) => {
  const { lang } = useLanguage();
  const arkyContext = useArky();

  // If props are passed directly, prefer them; otherwise use context
  const activeState: ArkyMascotState = propState || arkyContext.mascotState || 'idle';
  const displayMessage: string = propMessage || arkyContext.currentMessage;
  const isBubbleOpen = arkyContext.isBubbleVisible;
  const isMinimized = arkyContext.isMinimized;

  const [isBouncing, setIsBouncing] = useState<boolean>(false);
  const [pulseGlow, setPulseGlow] = useState<boolean>(false);

  // Trigger brief bounce & glow when state changes
  useEffect(() => {
    setIsBouncing(true);
    setPulseGlow(true);
    const t1 = setTimeout(() => setIsBouncing(false), 800);
    const t2 = setTimeout(() => setPulseGlow(false), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeState]);

  const handleRobotClick = () => {
    setIsBouncing(true);
    sounds.playClick();
    arkyContext.sayRandomQuote();
    setTimeout(() => setIsBouncing(false), 700);
  };

  const handleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    arkyContext.speakMessageTTS(displayMessage);
  };

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    arkyContext.sayRandomQuote();
  };

  // State theme configurations
  const stateThemes: Record<ArkyMascotState, {
    border: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    labelRo: string;
    labelEn: string;
    bubbleHeader: string;
  }> = {
    idle: {
      border: 'border-teal-500/40',
      glow: 'shadow-teal-500/20',
      badgeBg: 'bg-teal-500/20',
      badgeText: 'text-teal-300 border-teal-500/40',
      labelRo: 'Arky • Asistent TIC',
      labelEn: 'Arky • ICT Companion',
      bubbleHeader: 'ARKY ROBOT',
    },
    success: {
      border: 'border-emerald-500/70',
      glow: 'shadow-emerald-500/40',
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300 border-emerald-500/50',
      labelRo: 'Super! Level Up! ⭐',
      labelEn: 'Super! Level Up! ⭐',
      bubbleHeader: 'LEVEL UP! 🚀',
    },
    error: {
      border: 'border-amber-500/70',
      glow: 'shadow-amber-500/30',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300 border-amber-500/50',
      labelRo: 'Oops! Te ajut eu! 💡',
      labelEn: 'Oops! I got your back! 💡',
      bubbleHeader: 'HOPA! 🤖',
    },
    finished: {
      border: 'border-purple-500/70',
      glow: 'shadow-purple-500/40',
      badgeBg: 'bg-purple-500/25',
      badgeText: 'text-purple-300 border-purple-500/50',
      labelRo: 'Maestru Absolvent! 🏆',
      labelEn: 'Master Graduate! 🏆',
      bubbleHeader: 'MISIUNE ÎNDEPLINITĂ! 🎓',
    },
  };

  const currentTheme = stateThemes[activeState];
  const mascotImgSrc = ARKY_IMAGES[activeState] || ARKY_IMAGES.idle;

  if (position === 'inline') {
    return (
      <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-3xl bg-slate-900/90 border-2 ${currentTheme.border} ${currentTheme.glow} shadow-xl ${className}`}>
        <div 
          onClick={handleRobotClick}
          className="relative group cursor-pointer shrink-0"
          title={lang === 'en' ? 'Click Arky for a fun quote!' : 'Apasă pe Arky pentru o replică nouă!'}
        >
          <img
            src={mascotImgSrc}
            alt="Mascota Arky ARKEDO"
            referrerPolicy="no-referrer"
            className="w-24 h-32 sm:w-28 sm:h-36 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${currentTheme.badgeBg} ${currentTheme.badgeText}`}>
              {lang === 'en' ? currentTheme.labelEn : currentTheme.labelRo}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-100 leading-relaxed">
            "{displayMessage}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <aside 
      aria-label="Mascota Arky"
      className={`fixed bottom-4 right-3 sm:right-6 z-50 flex flex-col items-end pointer-events-none transition-all duration-300 ${className}`}
    >
      {/* Minimized Pill Toggle */}
      {isMinimized ? (
        <button
          onClick={arkyContext.toggleMinimize}
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/95 border-2 border-teal-500/50 shadow-2xl text-teal-300 hover:bg-slate-800 hover:text-white transition transform hover:scale-105 active:scale-95 cursor-pointer"
          title={lang === 'en' ? 'Expand Arky the Mascot' : 'Afișează Mascota Arky'}
        >
          <Bot className="w-5 h-5 text-teal-400 animate-pulse" />
          <span className="text-xs font-bold font-mono">Arky</span>
          <ChevronUp className="w-4 h-4 text-slate-400" />
        </button>
      ) : (
        <div className="flex flex-col items-end max-w-[320px] sm:max-w-[380px] w-full">
          {/* Animated Speech Bubble */}
          {isBubbleOpen && displayMessage && (
            <div 
              className={`pointer-events-auto relative mb-2 w-full p-4 rounded-3xl bg-slate-900/95 backdrop-blur-md border-2 ${currentTheme.border} ${currentTheme.glow} shadow-2xl transition-all duration-300 transform origin-bottom-right animate-scale-up`}
            >
              {/* Header Bar in Bubble */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-teal-300">
                    {currentTheme.bubbleHeader}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* TTS Voice Readout */}
                  <button
                    onClick={handleSpeech}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                    title={lang === 'en' ? 'Listen to Arky' : 'Ascultă mesajul lui Arky'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Random Quote Shuffle */}
                  <button
                    onClick={handleNextQuote}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition cursor-pointer"
                    title={lang === 'en' ? 'Get another quote' : 'Altă replică / glumă'}
                  >
                    <Dices className="w-3.5 h-3.5" />
                  </button>

                  {/* Close Bubble */}
                  <button
                    onClick={arkyContext.toggleBubble}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                    title={lang === 'en' ? 'Hide bubble' : 'Ascunde bula'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Message text */}
              <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed select-none">
                "{displayMessage}"
              </p>

              {/* Status Badge Tag */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className={`px-2 py-0.5 rounded-full border ${currentTheme.badgeBg} ${currentTheme.badgeText} font-bold`}>
                  {lang === 'en' ? currentTheme.labelEn : currentTheme.labelRo}
                </span>
                <span className="text-slate-500">ARKEDO Kids Coding</span>
              </div>

              {/* Bubble Pointer Arrow towards Mascot */}
              <div 
                className={`absolute -bottom-2 right-10 w-4 h-4 bg-slate-900 border-b-2 border-r-2 ${currentTheme.border} transform rotate-45`}
              />
            </div>
          )}

          {/* Robot Mascot Frame & Controls */}
          <div className="relative flex items-end justify-end gap-2">
            {/* Action buttons on side of robot */}
            <div className="pointer-events-auto flex flex-col gap-1.5 mb-2">
              {!isBubbleOpen && (
                <button
                  onClick={arkyContext.toggleBubble}
                  className="p-2 rounded-full bg-slate-900/90 border border-teal-500/40 text-teal-300 hover:bg-teal-500 hover:text-slate-950 shadow-lg transition transform hover:scale-110 active:scale-95 cursor-pointer"
                  title={lang === 'en' ? 'Show speech bubble' : 'Afișează dialog'}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={arkyContext.toggleMinimize}
                className="p-2 rounded-full bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 shadow-lg transition transform hover:scale-110 active:scale-95 cursor-pointer"
                title={lang === 'en' ? 'Minimize Arky' : 'Minimizează Arky'}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clickable 3D Mascot Character */}
            <div 
              onClick={handleRobotClick}
              className={`pointer-events-auto relative cursor-pointer select-none group transition-transform duration-300 ${
                isBouncing ? 'animate-bounce' : 'hover:scale-105'
              }`}
              title={lang === 'en' ? 'Hi! I am Arky! Click me!' : 'Salut! Sunt Arky! Apasă pe mine!'}
            >
              {/* Particle Sparkle on Success or Finished */}
              {(activeState === 'success' || activeState === 'finished') && (
                <div className="absolute -top-3 -left-3 pointer-events-none text-amber-300 animate-spin">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}

              {/* Question mark halo on Error */}
              {activeState === 'error' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none text-amber-400 font-black text-xl animate-bounce">
                  ❓
                </div>
              )}

              {/* Glowing aura under robot */}
              <div 
                className={`absolute inset-0 rounded-full blur-xl opacity-40 transition-all duration-500 ${
                  activeState === 'success' 
                    ? 'bg-emerald-500' 
                    : activeState === 'error' 
                    ? 'bg-amber-500' 
                    : activeState === 'finished' 
                    ? 'bg-purple-500' 
                    : 'bg-teal-500'
                } ${pulseGlow ? 'scale-125 opacity-70' : 'scale-90'}`}
              />

              {/* Mascot Image */}
              <img
                src={mascotImgSrc}
                alt={`Mascota Arky - Stare: ${activeState}`}
                referrerPolicy="no-referrer"
                className="relative z-10 w-28 h-36 sm:w-32 sm:h-44 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] filter transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
