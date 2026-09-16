import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ArkyMascotState } from '../assets/arkyImages';
import { useLanguage } from './LanguageContext';

export interface ArkyContextType {
  mascotState: ArkyMascotState;
  currentMessage: string;
  isBubbleVisible: boolean;
  isMascotVisible: boolean;
  isMinimized: boolean;
  setMascotState: (state: ArkyMascotState, customMessage?: string, durationMs?: number) => void;
  triggerSuccess: (customMessage?: string) => void;
  triggerError: (customMessage?: string) => void;
  triggerFinished: (customMessage?: string) => void;
  triggerIdle: (customMessage?: string) => void;
  sayRandomQuote: () => void;
  toggleMinimize: () => void;
  toggleBubble: () => void;
  setMascotVisible: (visible: boolean) => void;
  speakMessageTTS: (text?: string) => void;
}

export const ARKY_QUOTES_RO: Record<ArkyMascotState, string[]> = {
  idle: [
    "Salutare, exploratorule digital! Sunt Arky, asistentul tău robotizat. Pe ce buton apăsăm azi? 🚀",
    "Ai nevoie de o rază X prin foldere? Sunt aici cu tableta pregătită! 💡",
    "Știai că primul calculator ocupa o cameră întreagă? Noroc că eu încap chiar aici în colț! 🤖",
    "Circuitele mele detectează un viitor expert în TIC! Hai să continuăm misiunea! ⚡",
    "Aruncă o privire peste indicii dacă ai nevoie. Sunt gata să te ajut oricând! 🔍",
    "Bip-bop! CPU-ul meu rulează la 100% bucurie când te vede învățând! 🎮",
    "Un folder este ca un ghiozdan digital, iar fișierul este caietul tău. Simplu, nu? 📁",
    "Dacă apeși pe mine, îți spun un secret sau o glumă cu biți! Încearcă! ✨",
    "Ai o viteză de reacție excelentă azi! Hai să cucerim următorul nivel! 🕹️",
    "Un click mic pentru tine, un salt uriaș pentru diploma ta de Informatician! 🌟",
    "Pregătit pentru o nouă provocare? Tableta mea e gata de acțiune! 💻",
  ],
  success: [
    "Uau! Ai mutat acel fișier mai repede decât viteza luminii! 🚀",
    "Excelent! La cum mergi, în curând îmi vei reprograma tu pe mine! 💻",
    "Bravooo! Ai rezolvat provocarea ca un adevărat inginer software! 🌟",
    "Level UP! Circuitele mele dansează de bucurie! 💃🤖",
    "Boom! Răspuns corect de nota 10 cu steluțe aurii! ⭐",
    "Grozav! Ai scanat opțiunile mai precis decât un antivirus de top! 🛡️",
    "Ai deblocat puncte proaspete! Ești de neoprit azi! ⚡",
    "Scurtătura aia de taste a fost executată impecabil! Ninja digital! 🥷",
    "Ai pus fișierul la locul lui exact ca un maestru al ordinii! 📁✨",
    "Bip-bip-bingo! Punctaj maxim pe linie, continuă tot așa! 🎯",
  ],
  error: [
    "Hopa! Sigur nu a mâncat cățelul acel folder? Mai încearcă o dată, ești pe aproape! 🤖",
    "Bzzzt! Eroare de sistem... glumesc, doar ai apăsat greșit. Hai să reluăm! ⚡",
    "Nu-i nimic! Până și cel mai tare supercalculator își dă restart din când în când! 🔄",
    "Oopsie! Nicio grijă, marile descoperiri încep cu mici teste. Mai dă-i o șansă! 🧪",
    "Fii atent la extensie sau la calea folderului! Știu că poți să-l nimerești! 🎯",
    "O mică deviere de traseu! Trage adânc aer în piept, citește indiciul și vei reuși! 💡",
    "Nu te lăsa! Bug-urile sunt doar oportunități de a deveni mai deștept! 🐛💪",
    "Aproape! Îți dau un indiciu: uită-te cu atenție la textul evidențiat! 🧐",
    "Ups! Robotul Arky te susține: 3, 2, 1... reîncearcă și cucerește runda! 🚀",
  ],
  finished: [
    "Misiune îndeplinită! Ești oficial un Maestru al Fișierelor și Tehnologiei! 🏆🎓",
    "Uraaa! Toca de absolvent îți stă minunat! Ai demonstrat o logică de campion! 🌟",
    "Bip-bop-fanfară! Ai cucerit toate nivelele cu brio! Profesorul va fi super mândru! 📜🎉",
    "Felicitări maxime! De azi înainte, niciun folder rătăcit nu-ți mai poate scăpa! 👑",
    "Arky este oficial cel mai fericit robot din galaxie datorită ție! Notă maximă! 🚀🥳",
  ],
};

export const ARKY_QUOTES_EN: Record<ArkyMascotState, string[]> = {
  idle: [
    "Hey there, digital explorer! I'm Arky, your friendly robot companion. Ready to code and play? 🚀",
    "Need an X-ray scan through your folders? My cyber-tablet is charged and ready! 💡",
    "Did you know the first computer took up an entire room? Good thing I fit right here in your corner! 🤖",
    "My sensors detect a future IT champion! Let's conquer the next mission! ⚡",
    "Beep-boop! My CPU is running at 100% happiness watching you learn! 🎮",
    "Folders are like digital backpacks, and files are your notebooks. Easy-peasy! 📁",
    "Tap on me anytime for a tech joke or a cool secret tip! Try it! ✨",
    "One small click for you, one giant leap for your IT diploma! 🌟",
    "Ready for the next quest? My glowing tablet is all synced up! 💻",
  ],
  success: [
    "Woah! You moved that file faster than the speed of light! 🚀",
    "Awesome! At this pace, you'll be reprogramming me in no time! 💻",
    "Level UP! My cyber-circuits are doing a victory dance! 💃🤖",
    "Boom! Spot-on answer with gold stars! ⭐",
    "Incredible! You sorted that out sharper than an enterprise antivirus! 🛡️",
    "Fresh points unlocked! You're completely unstoppable! ⚡",
    "That keyboard shortcut was ninja-level smooth! 🥷",
    "Target hit! Perfect score, keep the momentum rolling! 🎯",
  ],
  error: [
    "Whoops! Did a digital puppy eat that folder? Try once more, you're super close! 🤖",
    "Bzzzt! System glitch... just kidding, just a wrong click. Let's retry! ⚡",
    "No worries at all! Even top supercomputers need a reboot sometimes! 🔄",
    "Oopsie! Great discoveries come from trial and error. Give it another shot! 🧪",
    "Watch the file extension or path closely! I know you've got this! 🎯",
    "Bugs are just stepping stones to becoming a legendary programmer! 🐛💪",
    "Almost there! Look closely at the highlighted hint! 🧐",
    "3, 2, 1... re-focus and nail it this time! Arky believes in you! 🚀",
  ],
  finished: [
    "Mission Accomplished! You are officially a Master of Files and Tech! 🏆🎓",
    "Woohoo! The graduate cap suits you! You showed true champion logic! 🌟",
    "Beep-boop fanfare! You conquered every level! Your teacher will be so proud! 📜🎉",
    "Massive congrats! From now on, no lost file or shortcut can stand in your way! 👑",
    "Arky is officially the happiest robot in the galaxy thanks to you! Top score! 🚀🥳",
  ],
};

const ArkyContext = createContext<ArkyContextType | undefined>(undefined);

export const ArkyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useLanguage();
  const [mascotState, setInternalMascotState] = useState<ArkyMascotState>('idle');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isBubbleVisible, setIsBubbleVisible] = useState<boolean>(true);
  const [isMascotVisible, setIsMascotVisible] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomQuote = useCallback((state: ArkyMascotState): string => {
    const list = lang === 'en' ? ARKY_QUOTES_EN[state] : ARKY_QUOTES_RO[state];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex] || list[0];
  }, [lang]);

  // Initial welcome message
  useEffect(() => {
    if (!currentMessage) {
      setCurrentMessage(getRandomQuote('idle'));
    }
  }, [getRandomQuote, currentMessage]);

  // If language switches, update default message if idle
  useEffect(() => {
    if (mascotState === 'idle') {
      setCurrentMessage(getRandomQuote('idle'));
    }
  }, [lang, getRandomQuote, mascotState]);

  const setMascotState = useCallback((state: ArkyMascotState, customMessage?: string, durationMs: number = 5500) => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    setInternalMascotState(state);
    const msg = customMessage || getRandomQuote(state);
    setCurrentMessage(msg);
    setIsBubbleVisible(true);

    // If success or error, automatically return to idle after duration
    if (state === 'success' || state === 'error') {
      resetTimerRef.current = setTimeout(() => {
        setInternalMascotState('idle');
        setCurrentMessage(getRandomQuote('idle'));
      }, durationMs);
    }
  }, [getRandomQuote]);

  const triggerSuccess = useCallback((customMessage?: string) => {
    setMascotState('success', customMessage, 6000);
  }, [setMascotState]);

  const triggerError = useCallback((customMessage?: string) => {
    setMascotState('error', customMessage, 5500);
  }, [setMascotState]);

  const triggerFinished = useCallback((customMessage?: string) => {
    setMascotState('finished', customMessage, 0); // stays finished until reset
  }, [setMascotState]);

  const triggerIdle = useCallback((customMessage?: string) => {
    setMascotState('idle', customMessage);
  }, [setMascotState]);

  const sayRandomQuote = useCallback(() => {
    const msg = getRandomQuote(mascotState);
    setCurrentMessage(msg);
    setIsBubbleVisible(true);
  }, [getRandomQuote, mascotState]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const toggleBubble = useCallback(() => {
    setIsBubbleVisible(prev => !prev);
  }, []);

  const speakMessageTTS = useCallback((text?: string) => {
    const speechText = text || currentMessage;
    if (!speechText || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''));
      utterance.lang = lang === 'en' ? 'en-US' : 'ro-RO';
      utterance.pitch = 1.25; // cute robotic friendly pitch
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech synthesis unavailable
    }
  }, [currentMessage, lang]);

  return (
    <ArkyContext.Provider
      value={{
        mascotState,
        currentMessage,
        isBubbleVisible,
        isMascotVisible,
        isMinimized,
        setMascotState,
        triggerSuccess,
        triggerError,
        triggerFinished,
        triggerIdle,
        sayRandomQuote,
        toggleMinimize,
        toggleBubble,
        setMascotVisible: setIsMascotVisible,
        speakMessageTTS,
      }}
    >
      {children}
    </ArkyContext.Provider>
  );
};

export const useArky = (): ArkyContextType => {
  const context = useContext(ArkyContext);
  if (!context) {
    throw new Error('useArky must be used within an ArkyProvider');
  }
  return context;
};
