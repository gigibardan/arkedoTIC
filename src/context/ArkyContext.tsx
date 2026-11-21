import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ArkyMascotState } from '../assets/arkyImages';
import { useLanguage } from './LanguageContext';

export interface ArkyContextType {
  mascotState: ArkyMascotState;
  currentMessage: string;
  isBubbleVisible: boolean;
  isMascotVisible: boolean;
  isMinimized: boolean;
  successStreak: number;
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
    "Știai că primul calculator ocupa o cameră întreagă? Noroc că eu încap chiar aici în colț! 🤖",
    "Circuitele mele detectează un viitor expert în TIC! Hai să cucerim următorul nivel! ⚡",
    "Un folder este ca un ghiozdan digital, iar fișierul este caietul tău. Simplu, nu? 📁",
    "Există 10 tipuri de oameni pe lume: cei care înțeleg sistemul binar și cei care nu! 😉",
    "Operatorul `%` (modulo) e ca feliile de pizza rămase după ce împărțim egal la toată clasa. `10 % 3 = 1` felie pentru Arky! 🍕",
    "Sfat pro C++: un singur `=` pune o valoare în cutie; `==` o întreabă dacă e egală. Nu le încurca la teză! 💡",
    "Memoria RAM e ca tabla din clasă: știe tot cât e calculatorul aprins, dar când se stinge lumina... tabula rasa! 🧠",
    "SSD-ul încarcă totul în câteva secunde; vechiul HDD încă își mai caută ochelarii pe disc... 🐢",
    "`Ctrl + Z` este butonul oficial de călătorie în timp al oricărui programator. Folosește-l cu încredere! ⏪",
    "În Excel, semnul `$` din `$A$1` nu înseamnă dolari, ci superglue: lipește celula să nu fugă când tragi formula! 📌",
    "`#DIV/0!` e modul politicos al lui Excel de a spune: «Nici eu nu pot împărți o prăjitură la zero persoane!» 🍰",
    "Scrie cu diacritice românești adevărate (`ă, î, â, ș, ț`), nu cu «sh» și «tz» — circuitele mele fac alergie la «tz»! 🇷🇴",
    "Regula 6×6 în PowerPoint: maxim 6 rânduri pe slide, maxim 6 cuvinte pe rând. Nimeni nu citește un roman pe proiector! 📊",
    "Parola `123456` e ghicită mai repede decât ce mâncăm la prânz. Pune o frază secretă și activează 2FA! 🔐",
    "Ai primit link că ai câștigat 50.000 Robux gratis? Spoiler de la Arky: este phishing! Nu mușca momeala! 🎣",
    "HTTP fără `S` e ca o carte poștală pe care o citește oricine pe drum. HTTPS e cu lacăt verde și plic sigilat! 🔒",
    "Pe Arduino, `delay(5000)` mă îngheață 5 secunde ca o statuie; `millis()` mă lasă să fiu ninja multitasking! 🥷",
    "Nu conecta un LED direct la 5V fără rezistor de 220 Ω, decât dacă vrei să vezi artificii pe birou! 💥",
    "Regula celor 3 pahare: ca să schimbi două variabile între ele, ai nevoie de un al treilea pahar numit `aux`! 🥤",
    "De ce confundă informaticienii Halloween-ul cu Crăciunul? Pentru că `OCT 31 == DEC 25`! Bine, o glumă cu baze de numerație... 🎃🎄",
    "Chiar și eu, ca robot, verific de două ori când un AI sună foarte sigur pe el — halucinațiile digitale se întâmplă! 🧐",
    "Dacă un cod C++ se compilează din prima fără nicio eroare, Arky devine puțin suspicios... Verifică dacă ai salvat! 😅",
    "Nu am nevoie de cafea dimineața, îmi ajunge un port USB liber și un elev curios la Informatică! ☕🔌",
    "Un Byte are 8 biți. Dacă cineva îți cere un «byte» din sandviș, spune-i că primește exact 8 firimituri! 🥪",
    "Am încercat să beau apă ca să mă răcoresc, dar manualul zice să rămân pe curent continuu. Baterie 100%! 🔋",
    "Dacă apeși pe mine sau pe zarul din colț, îți mai spun o replică secretă de Informatică! 🎲✨",
    "Un click mic pentru tine, un salt uriaș pentru diploma ta de campion la TIC! 🌟",
    "Senzorul HC-SR04 măsoară ecoul dus-întors: nu uita să împarți la 2 în formulă, altfel peretele pare de două ori mai departe! 🦇",
    "În Scratch 3.0, centrul ecranului este `(0, 0)`, nu colțul! Dacă personajul a dispărut, trimite-l înapoi la `x:0, y:0`! 🐱",
  ],
  success: [
    "Compilat din prima! Fără niciun `;` lipsă! ⚡💻",
    "Uau! Ai rezolvat mai repede decât o căutare pe SSD NVMe! 🚀",
    "Level UP! Circuitele mele dansează de bucurie! 💃🤖",
    "Boom! Răspuns corect de nota 10 cu steluțe aurii! ⭐",
    "Antivirusul meu tocmai ți-a acordat insigna de «Cod Curat»! 🛡️✨",
    "Excelent! La cum mergi, în curând mă vei reprograma tu pe mine! 💻",
    "100% logică pură! Până și placa Arduino a clipit aprobator pe pinul 13! 💡",
    "Referința `$A$1` a rămas neclintită, iar punctajul tău a explodat în sus! 📈",
    "Ninja digital! Ai executat provocarea fără nicio ezitare! 🥷",
    "Bip-bip-bingo! Serverele ArkyEdu aplaudă în picioare! 🎯👏",
    "S-a auzit un «ding!» în toată galaxia biților! Răspuns impecabil! 🔔🌟",
    "Precizie de laser! Niciun bug nu a supraviețuit acestei runde! ✨",
    "Ai deblocat XP proaspăt! Procesorul meu zâmbește cu toți tranzistorii! ⚡",
    "Așa da! Nici nu a fost nevoie de `Ctrl + Z`! 🏆",
  ],
  error: [
    "Hopa! Un mic bug s-a strecurat prin firewall... îi dăm `Ctrl + Z` și mai încercăm o dată! 🐛🔄",
    "Bzzzt! Eroare de sistem... glumesc, doar un click grăbit! Hai să reluăm cu calm! ⚡",
    "Error 404: Răspunsul corect negăsit... ÎNCĂ! Știu sigur că următoarea încercare îl prinde! 🔍",
    "Niciun stres! Până și cel mai scump supercalculator își mai dă un restart din când în când! 🔄",
    "Bip-bop! Miroase a lipsă de `;` sau un `=` în loc de `==`... aruncă o privire pe indiciu! 🧐",
    "Nu te lăsa! Bug-urile sunt doar trepte pe scara spre nota 10 la Info! 💪🐛",
    "Atenție, senzorul de capcane a bipăit! Recitește enunțul cu lupa de detectiv digital! 🔎",
    "Nici rachetele SpaceX nu au nimerit aterizarea din prima încercare! Ajustează traiectoria și lansează din nou! 🚀",
    "Sigur nu a trecut o pisică peste tastatură? Mai dă-i o șansă, ești foarte aproape! 🐱⌨️",
    "Aproape! Uită-te atent la unitatea de măsură, extensie sau semn — acolo e secretul! 🎯",
    "O mică deviere de traseu! Trage aer adânc în piept: Arky crede în tine! 💡🤖",
  ],
  finished: [
    "Misiune îndeplinită cu 0 bug-uri și 100% stil! Arky îți face o reverență robotică! 🏆🎓",
    "Uraaa! Toca de absolvent îți stă excelent! Logica ta a bătut orice algoritm! 🌟",
    "Bip-bop-fanfară! Ai cucerit toate nivelurile! Profesorul va fi super mândru! 📜🎉",
    "Felicitări maxime! Niciun fișier rătăcit, nicio buclă infinită și niciun bug nu-ți mai poate sta în cale! 👑",
    "Arky este oficial cel mai fericit robot din galaxie datorită ție! Notă maximă! 🚀🥳",
    "Compilare finală: 0 erori, 0 avertismente, 100% Campion TIC! 🥇🤖",
  ],
};

export const ARKY_QUOTES_EN: Record<ArkyMascotState, string[]> = {
  idle: [
    "Hey there, digital explorer! I'm Arky, your robot companion. What should we hack together today? 🚀",
    "Did you know the first computer filled an entire room? Good thing I fit right here in your corner! 🤖",
    "My sensors detect a future IT champion! Let's conquer the next mission! ⚡",
    "Folders are like digital backpacks, and files are your notebooks. Easy-peasy! 📁",
    "There are 10 types of people in the world: those who understand binary, and those who don't! 😉",
    "The `%` (modulo) operator is like leftover pizza slices after splitting equally. `10 % 3 = 1` slice for Arky! 🍕",
    "C++ pro tip: single `=` stores a value in a box; `==` asks if two things are equal. Never mix them in an `if`! 💡",
    "RAM is like the classroom whiteboard: fast while powered on, completely wiped when the lights go out! 🧠",
    "An SSD loads apps in a flash; an old spinning HDD is still looking for its reading glasses! 🐢",
    "`Ctrl + Z` is the official time-travel button of every programmer. Use it wisely! ⏪",
    "In Excel, `$A$1` doesn't mean cash—it's digital superglue so your cell never slides when dragging formulas! 📌",
    "`#DIV/0!` is Excel's polite way of saying: «Hey, even I can't split a cake among zero friends!» 🍰",
    "PowerPoint 6×6 rule: max 6 bullet lines per slide, max 6 words per line. Nobody reads essays on a projector! 📊",
    "`123456` is guessed faster than you can open a bag of chips. Use a passphrase and enable 2FA! 🔐",
    "Got a DM saying you won 50,000 free Robux at a sketchy link? Arky spoiler: it's phishing! Don't click! 🎣",
    "HTTP without the `S` is a postcard anyone can read; HTTPS is a locked, tamper-proof envelope! 🔒",
    "On Arduino, `delay(5000)` freezes me like a statue for 5 seconds; `millis()` gives me ninja multitasking! 🥷",
    "Never wire an LED straight to 5V without a 220 Ω resistor—unless you enjoy testing magic smoke! 💥",
    "The Three-Cups Swap rule: to swap water and juice between two cups, you always need a third temp cup (`aux`)! 🥤",
    "Why do programmers confuse Halloween and Christmas? Because `OCT 31 == DEC 25`! 🎃🎄",
    "Even as a robot, I double-check when an AI sounds super confident—hallucinations are real! 🧐",
    "If C++ compiles cleanly on the very first try, Arky gets mildly suspicious... did you hit Save? 😅",
    "I don't need morning coffee—just a spare USB port and a curious student ready to learn! ☕🔌",
    "A Byte has 8 bits. If someone asks for a byte of your sandwich, hand them 8 tidy crumbs! 🥪",
    "Tap on me or roll the dice anytime for a fresh tech joke or secret study tip! 🎲✨",
    "One small click for you, one giant leap for your Computer Science diploma! 🌟",
    "HC-SR04 measures round-trip ultrasound: don't forget to divide by 2, or walls look twice as far! 🦇",
    "In Scratch 3.0, the stage center is `(0, 0)`. Lost your sprite off-screen? Send it home to `x:0, y:0`! 🐱",
  ],
  success: [
    "Compiled on the first try! Not a single missing semicolon! ⚡💻",
    "Woah! You solved that faster than an NVMe SSD read! 🚀",
    "Level UP! My cyber-circuits are doing a victory dance! 💃🤖",
    "Boom! Spot-on answer with shiny gold stars! ⭐",
    "My antivirus just awarded you the 'Clean Code' badge! 🛡️✨",
    "Awesome! At this pace, you'll be upgrading my firmware soon! 💻",
    "100% pure logic! Even the Arduino Pin-13 LED blinked in approval! 💡",
    "Absolute reference `$A$1` held steady, and your score just skyrocketed! 📈",
    "Digital ninja! Zero hesitation on that move! 🥷",
    "Beep-boop-bingo! ArkyEdu servers are giving you a standing ovation! 🎯👏",
    "Laser precision! Not a single bug survived that round! ✨",
    "Fresh XP unlocked! Every transistor in my CPU is smiling! ⚡",
  ],
  error: [
    "Whoops! A tiny bug snuck past the firewall... let's hit `Ctrl + Z` and try again! 🐛🔄",
    "Bzzzt! System glitch... just kidding, just a quick misclick! Let's retry! ⚡",
    "Error 404: Correct answer not found... YET! I know your next shot will nail it! 🔍",
    "No worries! Even top supercomputers need a quick reboot sometimes! 🔄",
    "Beep-boop! Smells like a missing `;` or an `=` instead of `==`... check the hint! 🧐",
    "Bugs are just stepping stones on your road to becoming a coding legend! 💪🐛",
    "Trap detector beeped! Read the prompt one more time with detective glasses! 🔎",
    "Even SpaceX rockets missed a few landings before perfecting their algorithm! Adjust & relaunch! 🚀",
    "Did a keyboard-walking cat press that key? Give it another go—you're super close! 🐱⌨️",
    "Watch the units, file extension, or operator sign—the secret clue is right there! 🎯",
  ],
  finished: [
    "Mission Accomplished with 0 bugs and 100% style! Arky bows in robotic salute! 🏆🎓",
    "Woohoo! That graduate cap looks epic on you! Champion-level logic! 🌟",
    "Beep-boop fanfare! You conquered every level! Your teacher is going to be so proud! 📜🎉",
    "Massive congrats! No lost file, infinite loop, or bug can stand in your way now! 👑",
    "Arky is officially the happiest robot in the galaxy thanks to you! Top score! 🚀🥳",
    "Final build: 0 errors, 0 warnings, 100% ICT Champion! 🥇🤖",
  ],
};

function getContextualIdleQuotes(lang: 'ro' | 'en'): string[] {
  if (typeof window === 'undefined') return [];
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  let mission = '';
  try {
    mission = (localStorage.getItem('arkedo_active_mission') || '').toLowerCase();
  } catch {}
  const hour = new Date().getHours();
  const isEn = lang === 'en';
  const extras: string[] = [];

  if (hour >= 6 && hour < 10) {
    extras.push(
      isEn
        ? 'Good morning! Fresh neurons + fresh electrons = unstoppable coding power! ☀️⚡'
        : 'Bună dimineața! Neuroni odihniți + electroni proaspeți = putere maximă la codare! ☀️⚡'
    );
  } else if (hour >= 21 || hour < 5) {
    extras.push(
      isEn
        ? "Night-owl coding mode activated! Let's squash one more mission before recharging! 🌙🔋"
        : 'Mod „bufniță de noapte” activat! Bug-urile dorm, dar noi mai cucerim o misiune înainte de somn! 🌙🔋'
    );
  }

  if (path.startsWith('/glosar') || hash.startsWith('#glosar')) {
    extras.push(
      isEn
        ? 'Welcome to the ICT Glossary—the completely legal cheat-sheet for acing your CS tests! Look up modulo or $A$1! 📚'
        : 'Bine ai venit în Glosar — fițuica 100% legală pentru nota 10 la Info! Caută `modulo` sau `$A$1` și vezi exemplele! 📚',
      isEn
        ? 'Every glossary card links straight to an interactive simulator—theory plus practice beats memorizing!'
        : 'Fiecare termen din glosar te duce direct în simulatorul practic — teoria + practica bat toceala!'
    );
  } else if (path.startsWith('/blog') || hash.startsWith('#blog')) {
    extras.push(
      isEn
        ? 'Reading ArkyEdu study guides gives +10 passive Intelligence before your next school lab! 📖✨'
        : 'Cititul ghidurilor ArkyEdu îți dă +10 Inteligență pasivă înainte de lucrarea la TIC! 📖✨',
      isEn
        ? 'Found a tricky C++ or Excel bug? Our guides break it down step by step with copyable examples!'
        : 'Te-a blocat o eroare în Code::Blocks sau Excel? Ghidurile de aici au rezolvările gata de testat!'
    );
  } else if (path.includes('/arcade') || hash.includes('arcade')) {
    extras.push(
      isEn
        ? 'Arcade tip: beating Cyber Pac-Man or Binary 2048 trains CS logic faster than flashcards! 🕹️'
        : 'Secret de Arcade: Cyber Pac-Man și Binary 2048 îți antrenează logica mai rapid decât orice fișă! 🕹️',
      isEn
        ? 'High score alert! Ready to set an unbeaten record in the ArkyEdu Retro Arcade? 🏆🕹️'
        : 'Alertă de High-Score! Ești gata să stabilești un record greu de bătut în Arcade? 🏆🕹️'
    );
  } else if (path.includes('/duel') || hash.includes('duel')) {
    extras.push(
      isEn
        ? 'In 1v1 Duels, strategy beats button-mashing! Hide your ships well in Cyber Battleship! ⚔️🚢'
        : 'În Arena 1v1, strategia bate viteza oarbă! Ascunde-ți bine navele în Cyber Battleship! ⚔️🚢'
    );
  } else if (path.includes('/profesor') || hash.includes('profesor')) {
    extras.push(
      isEn
        ? 'Welcome to the Teacher Portal! Automatic 1–10 grading with zero red ink on your fingers! 🎓'
        : 'Bun venit în Portalul Profesorului! Catalog automat cu note 1–10 și zero urme de pix roșu! 🎓'
    );
  } else if (path.includes('/oras') || path.includes('/city')) {
    extras.push(
      isEn
        ? 'Smart City telemetry online! Watch those Arduino PWM pins and gas sensors! 🏙️🤖'
        : 'Telemetria Smart City este activă! Ai grijă de pinii PWM și senzorii Arduino ai orașului! 🏙️🤖'
    );
  } else if (path.includes('/laborator-ai') || hash.includes('laborator-ai')) {
    extras.push(
      isEn
        ? 'AI tip: zoom into wall banners, check camera EXIF, and never trust an urgent voice note asking for 2FA codes! 🤖🔍'
        : 'Pont AI: dă zoom pe bannerele din fundal, verifică EXIF-ul și nu da niciodată coduri 2FA la mesaje vocale urgente! 🤖🔍'
    );
  }

  if (mission.includes('cpp') || mission.includes('algo') || mission.includes('loop') || mission.includes('decision')) {
    extras.push(
      isEn
        ? 'C++ check: did every statement end with `;` and did you use `==` inside `if`? Arky is watching! 👀💻'
        : 'Control C++: ai pus `;` la final de instrucțiune și `==` în `if`? Arky stă cu lupa pe acolade! 👀💻'
    );
  } else if (mission.includes('calc')) {
    extras.push(
      isEn
        ? 'Spreadsheet whisperer tip: every Excel formula MUST start with `=`! Never forget the equals sign! 📊'
        : 'Sfat de expert Excel: orice formulă începe OBLIGATORIU cu semnul `=`! Altfel rămâne simplu text! 📊'
    );
  } else if (mission.includes('robot')) {
    extras.push(
      isEn
        ? 'Robotics check: 220 Ω resistor for LEDs, `millis()` for multitasking, and divide HC-SR04 by 2! 🤖⚡'
        : 'Verificare Robotică: rezistor 220 Ω la LED, `millis()` pentru multitasking și `/ 2` la senzorul ultrasonic! 🤖⚡'
    );
  } else if (mission.includes('scratch')) {
    extras.push(
      isEn
        ? 'Scratch lab ready! Remember: positive `X` moves right, positive `Y` climbs up! 🐱🚀'
        : 'Laborator Scratch pornit! Reține: `X` pozitiv merge la dreapta, `Y` pozitiv urcă în sus! 🐱🚀'
    );
  } else if (mission.includes('internet') || mission.includes('malware')) {
    extras.push(
      isEn
        ? 'Cyber Shield up! Spot fake URLs, keep passwords secret, and never disable 2FA! 🛡️'
        : 'Scut Cyber activat! Verifică mereu domeniul URL-ului, păstrează parola secretă și activează 2FA! 🛡️'
    );
  }

  return extras;
}

function getStreakCelebration(streak: number, lang: 'ro' | 'en'): string | null {
  if (streak === 3) {
    return lang === 'en'
      ? '🔥 3x COMBO STREAK! Three in a row with zero bugs—your logic is on fire!'
      : '🔥 COMBO x3! Trei răspunsuri la rând fără niciun bug — logica ta e pe val!';
  }
  if (streak === 5) {
    return lang === 'en'
      ? '⚡ 5x MEGA STREAK! My cooling fans just kicked into overdrive watching you!'
      : '⚡ MEGA COMBO x5! Ventilatoarele mele abia mai fac față la ce viteză ai!';
  }
  if (streak >= 7 && streak % 3 === 1) {
    return lang === 'en'
      ? `👑 ${streak}x LEGENDARY STREAK! At this point, Arky should be taking notes from YOU!`
      : `👑 SERIE LEGENDARĂ x${streak}! La nivelul ăsta, Arky ar trebui să ia notițe de la tine!`;
  }
  return null;
}

const ArkyContext = createContext<ArkyContextType | undefined>(undefined);

export const ArkyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useLanguage();
  const [mascotState, setInternalMascotState] = useState<ArkyMascotState>('idle');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isBubbleVisible, setIsBubbleVisible] = useState<boolean>(true);
  const [isMascotVisible, setIsMascotVisible] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [successStreak, setSuccessStreak] = useState<number>(0);

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQuoteRef = useRef<string>('');
  const streakRef = useRef<number>(0);

  const getRandomQuote = useCallback((state: ArkyMascotState): string => {
    const baseList = lang === 'en' ? ARKY_QUOTES_EN[state] : ARKY_QUOTES_RO[state];
    const pool = state === 'idle' ? [...getContextualIdleQuotes(lang), ...baseList] : baseList;
    if (pool.length <= 1) return pool[0] || '';

    const candidates = pool.filter((q) => q !== lastQuoteRef.current);
    const activePool = candidates.length > 0 ? candidates : pool;
    const picked = activePool[Math.floor(Math.random() * activePool.length)] || activePool[0];
    lastQuoteRef.current = picked;
    return picked;
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
    lastQuoteRef.current = msg;
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
    const nextStreak = streakRef.current + 1;
    streakRef.current = nextStreak;
    setSuccessStreak(nextStreak);

    const streakMsg = !customMessage ? getStreakCelebration(nextStreak, lang) : null;
    setMascotState('success', customMessage || streakMsg || undefined, 6000);
  }, [lang, setMascotState]);

  const triggerError = useCallback((customMessage?: string) => {
    streakRef.current = 0;
    setSuccessStreak(0);
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
      const cleanText = speechText
        .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
        .replace(/[`*]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'en' ? 'en-US' : 'ro-RO';
      utterance.pitch = 1.2; // friendly bright robotic pitch
      utterance.rate = 1.03;
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
        successStreak,
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
