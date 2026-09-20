import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Flame,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Lock,
  Sparkles,
  Info,
  ExternalLink,
  HelpCircle,
  User,
  Lightbulb,
} from 'lucide-react';

interface CyberSafeDetectiveProps {
  onBack: () => void;
  studentName?: string;
}

type ScenarioCategory = 'email' | 'chat' | 'popup' | 'sms' | 'browser';

interface Scenario {
  id: number;
  category: ScenarioCategory;
  isThreat: boolean; // true = Phishing / Threat, false = Safe / Legitimate
  titleRo: string;
  titleEn: string;
  senderRo: string;
  senderEn: string;
  senderAddress: string;
  contentRo: string;
  contentEn: string;
  linkText?: string;
  linkTarget?: string;
  cluesRo: string[];
  cluesEn: string[];
  explanationRo: string;
  explanationEn: string;
  dangerBadgeRo?: string;
  dangerBadgeEn?: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    category: 'email',
    isThreat: true,
    titleRo: 'Avertisment de Securitate Cont Bancar',
    titleEn: 'Bank Account Security Warning',
    senderRo: 'Banca Ta Națională - Notificări',
    senderEn: 'National Bank - Alerts',
    senderAddress: 'suport-urgent@banca-securitate-cont99.xyz',
    contentRo: 'Contul dumneavoastră a fost temporar blocat din motive de securitate! Pentru deblocare imediată, apăsați pe linkul de mai jos și introduceți codul PIN și parola de internet banking în următoarele 24 de ore.',
    contentEn: 'Your account has been temporarily blocked for security reasons! To unlock immediately, click the link below and enter your PIN and password within 24 hours.',
    linkText: 'Deblochează Contul Acum',
    linkTarget: 'http://banca-login-cont-nou.xyz/deblocare',
    cluesRo: [
      'Adresa de e-mail se termină în ".xyz" în loc de domeniul oficial al băncii.',
      'Urgență falsă: "în următoarele 24 de ore".',
      'Băncile reale nu cer NICIODATĂ codul PIN sau parola prin linkuri.',
    ],
    cluesEn: [
      'Email ends in ".xyz" instead of the official bank domain.',
      'False urgency: "within 24 hours".',
      'Real banks NEVER ask for PIN or password via email links.',
    ],
    explanationRo: 'Tentativă clară de Phishing! Băncile reale nu cer niciodată parole sau coduri PIN pe e-mail, iar adresa web este falsă.',
    explanationEn: 'Classic Phishing attempt! Real banks never ask for passwords or PINs via email, and the domain is completely fraudulent.',
    dangerBadgeRo: 'Tentativă de Phishing Bancar',
    dangerBadgeEn: 'Banking Phishing Attempt',
  },
  {
    id: 2,
    category: 'chat',
    isThreat: true,
    titleRo: 'Mesaj Privat pe Discord / Roblox',
    titleEn: 'Private Message on Discord / Roblox',
    senderRo: 'Admin_Roblox_Official_99',
    senderEn: 'Admin_Roblox_Official_99',
    senderAddress: '@admin_super_official#4123',
    contentRo: 'Salut! Ai fost ales câștigător la tombola noastră secretă! Primești 50.000 de Robux gratis. Trimite-mi doar numele de utilizator și parola ta ca să-ți încarc banii în cont. Grăbește-te, oferta expiră în 10 minute!',
    contentEn: 'Hey! You won our secret community giveaway! You get 50,000 free Robux. Just reply with your username and password so I can load them into your account. Hurry, expires in 10 minutes!',
    cluesRo: [
      'Administratorii jocului nu cer NICIODATĂ parola niciunui jucător.',
      'Promisiune nerealistă: "50.000 Robux gratis".',
      'Presiune psihologică: "expiră în 10 minute".',
    ],
    cluesEn: [
      'Official game staff will NEVER ask for your password.',
      'Unrealistic promise: "50,000 free Robux".',
      'Pressure tactic: "expires in 10 minutes".',
    ],
    explanationRo: 'Inginerie socială & Furt de cont! Niciun moderator sau admin nu îți va cere vreodată parola. Dacă o trimiți, îți pierzi contul.',
    explanationEn: 'Social engineering & Credential theft! Real admins never need your password. Giving it away leads to stolen accounts.',
    dangerBadgeRo: 'Furt de Cont de Jocuri',
    dangerBadgeEn: 'Gaming Account Theft',
  },
  {
    id: 3,
    category: 'email',
    isThreat: false,
    titleRo: 'Notificare Temă Nouă - Google Classroom',
    titleEn: 'New Assignment - Google Classroom',
    senderRo: 'Prof. Popescu Maria (TIC)',
    senderEn: 'Prof. Popescu Maria (ICT)',
    senderAddress: 'maria.popescu@scoala-gimnaziala10.edu.ro',
    contentRo: 'Bună ziua! Am publicat tema pentru săptămâna viitoare: "Componentele Unității Centrale". Vă rog să parcurgeți fișa atașată din contul vostru școlar până vineri la ora 14:00.',
    contentEn: 'Hello! I have posted next week assignment: "Central Processing Unit Components". Please review the attached document from your student account by Friday 2:00 PM.',
    linkText: 'Deschide în Google Classroom',
    linkTarget: 'https://classroom.google.com/c/MzQ5Nz...',
    cluesRo: [
      'Expeditor verificat: adresa oficială a școlii cu terminația ".edu.ro".',
      'Link securizat cu certificat valid (https://classroom.google.com).',
      'Ton profesional, nu cere date confidențiale sau parole.',
    ],
    cluesEn: [
      'Verified sender: official school email ending in ".edu.ro".',
      'Secure link with valid SSL (https://classroom.google.com).',
      'Polite, professional tone without asking for passwords.',
    ],
    explanationRo: 'Mesaj 100% sigur și autentic! Expeditorul este adresa oficială a profesoarei pe domeniul școlii, iar linkul duce la platforma oficială Classroom.',
    explanationEn: '100% safe and authentic message! The sender uses the verified school domain, and the link points to Google Classroom.',
  },
  {
    id: 4,
    category: 'popup',
    isThreat: true,
    titleRo: 'Fereastră Pop-up pe un Site de Desene',
    titleEn: 'Pop-up on a Cartoon Streaming Site',
    senderRo: 'Alertă Sistem Internet',
    senderEn: 'Internet System Alert',
    senderAddress: 'pop-up-notif.win-apple-rewards.biz',
    contentRo: '🎉 FELICITĂRI VIZITATOR #1.000.000! Ai câștigat un iPhone 16 Pro Max! Apasă AICI, introdu numărul de telefon și codul primit prin SMS pentru a revendica premiul înainte ca runda să se încheie!',
    contentEn: '🎉 CONGRATULATIONS VISITOR #1,000,000! You won a brand new iPhone 16 Pro Max! Click HERE, enter your phone number and SMS verification code to claim your prize before time runs out!',
    linkText: 'REVENDICĂ TELEFONUL ACUM ➔',
    linkTarget: 'http://win-apple-free-gift.biz/claim',
    cluesRo: [
      'Nimeni nu oferă telefoane scumpe gratuit pe internet pe baza unei ferestre pop-up.',
      'Cere numărul de telefon și codul SMS (ceea ce activează abonamente cu suprataxă de zeci de euro).',
      'Domeniu suspect ".biz" plin de reclame agresive.',
    ],
    cluesEn: [
      'No one gives away expensive smartphones for free to random visitors.',
      'Asks for phone number and SMS code (which activates expensive paid subscriptions).',
      'Suspicious ".biz" domain with aggressive design.',
    ],
    explanationRo: 'Reclamă capcană (Scam Pop-up)! Introducerea numărului de telefon și a codului SMS te va abona la servicii de plată cu suprataxă pe factura părinților.',
    explanationEn: 'Scam Pop-up trap! Submitting your phone and SMS code signs you up for unauthorized premium subscription fees.',
    dangerBadgeRo: 'Înșelăciune & Pop-up Capcană',
    dangerBadgeEn: 'Pop-up Scam & Subscription Trap',
  },
  {
    id: 5,
    category: 'sms',
    isThreat: true,
    titleRo: 'Mesaj SMS: Colet Blocat',
    titleEn: 'SMS Alert: Package Delivery Blocked',
    senderRo: 'Posta-Info',
    senderEn: 'Courier-Alert',
    senderAddress: '+40 799 123 456',
    contentRo: 'Coletul dumneavoastră RO-98231 nu a putut fi livrat din cauza lipsei numărului de stradă. Vă rugăm să actualizați datele de livrare și să achitați taxa de 2.45 RON aici: posta-romana-taxe-colete.top/plata',
    contentEn: 'Your package RO-98231 could not be delivered due to missing street address. Please update your details and pay 2.45 EUR re-delivery fee here: parcel-post-express.top/pay',
    linkText: 'Actualizează Adresa & Plătește',
    linkTarget: 'https://posta-romana-taxe-colete.top/plata',
    cluesRo: [
      'Domeniul ".top" este fals (Poșta Română folosește doar "posta-romana.ro").',
      'Metoda clasică de "Smishing" (phishing prin SMS) pentru a fura datele cardului bancar sub pretextul unei sume modice.',
      'Număr de telefon mobil necunoscut în loc de cod oficial scurt de expeditor.',
    ],
    cluesEn: [
      'The ".top" domain is fake (official postal services use national domains).',
      'Classic "Smishing" technique to steal credit card info under the guise of a tiny payment.',
      'Unknown random cell number instead of an authorized sender ID.',
    ],
    explanationRo: 'Atac de tip Smishing (Phishing prin SMS)! Chiar dacă taxa pare infimă (2.45 RON), formularul este creat de infractori pentru a clona cardul bancar.',
    explanationEn: 'Smishing attack (SMS Phishing)! Even though the fee seems tiny, the form is designed to steal complete banking card credentials.',
    dangerBadgeRo: 'Smishing (Phishing prin SMS)',
    dangerBadgeEn: 'Smishing (SMS Phishing)',
  },
  {
    id: 6,
    category: 'browser',
    isThreat: false,
    titleRo: 'Actualizare Oficială de Securitate - Browser Web',
    titleEn: 'Official Security Update - Web Browser',
    senderRo: 'Google Chrome / Mozilla Firefox',
    senderEn: 'Google Chrome / Mozilla Firefox',
    senderAddress: 'chrome://settings/help',
    contentRo: 'O nouă versiune stabilă a browserului este disponibilă. Include remedieri de securitate importante împotriva vulnerabilităților web. Actualizarea se realizează automat în fundal la repornirea aplicației.',
    contentEn: 'A new stable version of the browser is available. It includes essential security patches against web vulnerabilities. Update will apply automatically upon relaunching.',
    cluesRo: [
      'Notificare integrată în setările browserului (chrome://), nu o pagină web externă.',
      'Nu cere descărcarea de fișiere executabile ciudate (.exe sau .bat).',
      'Nu solicită date personale sau bancare.',
    ],
    cluesEn: [
      'Native in-browser notification (chrome://), not an external third-party site.',
      'Does not ask to download suspicious executable files (.exe or .bat).',
      'Does not request personal or financial data.',
    ],
    explanationRo: 'Notificare 100% legitimă și esențială! Menținerea browserului actualizat la zi este una dintre cele mai bune practici de securitate cibernetică.',
    explanationEn: '100% legitimate and essential! Keeping software up-to-date protects your device against recently discovered vulnerabilities.',
  },
  {
    id: 7,
    category: 'popup',
    isThreat: true,
    titleRo: 'Site de Jocuri: Butoane Multiple de Download',
    titleEn: 'Game Mod Site: Multiple Download Buttons',
    senderRo: 'Moduri-Minecraft-Gratis-2024.cc',
    senderEn: 'Minecraft-Free-Mods-2024.cc',
    senderAddress: 'www.moduri-minecraft-gratis-2024.cc/download',
    contentRo: 'Apasă butonul verde de mai jos pentru a descărca noul joc! (Pagina conține 4 butoane uriașe verzi cu animații strălucitoare care descarcă fișierul "Setup_installer.exe")',
    contentEn: 'Click the flashing green button below to download the game! (The page contains 4 huge flashing green buttons downloading "Setup_installer.exe")',
    linkText: 'DESCARCĂ ACUM (RAPID & GRATIS)',
    linkTarget: 'http://ad-tracker-download.biz/Setup_installer.exe',
    cluesRo: [
      'Fișierul descărcat este un executabil ".exe" (potențial virus Trojan sau Adware) în loc de arhiva normală a modului (.zip sau .jar).',
      'Butoane false de "Download" care sunt de fapt reclame malițioase.',
      'Site neoficial plin de ferestre intruzive.',
    ],
    cluesEn: [
      'Downloaded file is a suspicious ".exe" (potential Trojan or Adware) instead of normal mod file (.jar or .zip).',
      'Fake "Download" buttons that are actually malicious advertisements.',
      'Unofficial third-party site loaded with intrusive pop-ups.',
    ],
    explanationRo: 'Malware deghizat (Adware / Trojan)! Când cauți moduri sau jocuri, descarcă doar de pe site-urile oficiale (ex: CurseForge) și evită fișierele suspecte cu terminația .exe.',
    explanationEn: 'Disguised Malware (Adware / Trojan)! Always download mods from recognized official portals and avoid strange .exe installers.',
    dangerBadgeRo: 'Malware deghizat în descărcare',
    dangerBadgeEn: 'Disguised Malware Installer',
  },
  {
    id: 8,
    category: 'chat',
    isThreat: false,
    titleRo: 'Mesaj pe WhatsApp de la Colegul de Bancă',
    titleEn: 'WhatsApp Message from Classmate',
    senderRo: 'Andrei (Coleg Clasa 5B)',
    senderEn: 'Andrei (5th Grade Classmate)',
    senderAddress: '+40 722 ... (Salvat în Agendă)',
    contentRo: 'Salut! Îmi poți trimite te rog poza cu exercițiile de la pagina 45 din manualul de TIC? Am uitat cartea în clasă. Mulțumesc!',
    contentEn: 'Hey! Could you please send me a photo of the exercises on page 45 of the ICT textbook? I forgot my book at school. Thanks!',
    cluesRo: [
      'Număr salvat în agenda telefonului ca persoană cunoscută din viața reală.',
      'Cere o informație obișnuită legată de școală (pagina din manual).',
      'Nu conține linkuri, executabile sau cereri de bani/parole.',
    ],
    cluesEn: [
      'Saved contact verified in phone contacts from real-life class.',
      'Asks for ordinary homework reference (textbook page).',
      'No suspicious links, no executable attachments, no password requests.',
    ],
    explanationRo: 'Conversație normală și sigură între colegi! Un contact cunoscut care solicită o clarificare pentru teme fără elemente suspecte.',
    explanationEn: 'Safe and authentic conversation between classmates! A verified contact asking about homework without any suspicious links.',
  },
];

export const CyberSafeDetective: React.FC<CyberSafeDetectiveProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [showClues, setShowClues] = useState<boolean>(false);
  const [answeredState, setAnsweredState] = useState<{
    chosen: 'threat' | 'safe';
    isCorrect: boolean;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_cyber') || '0');
    } catch {
      return 0;
    }
  });

  const scenario = SCENARIOS[currentIndex];

  const handleInspectClues = () => {
    sounds.playClick();
    setShowClues((prev) => !prev);
  };

  const handleAnswer = (choice: 'threat' | 'safe') => {
    if (answeredState !== null || isCompleted) return;

    const isThreatActual = scenario.isThreat;
    const isCorrect = (choice === 'threat' && isThreatActual) || (choice === 'safe' && !isThreatActual);

    if (isCorrect) {
      sounds.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Points calculation: 100 base + combo bonus (max 50)
      const points = 100 + Math.min(newCombo * 10, 50);
      setScore((prev) => prev + points);
      setCorrectAnswers((prev) => prev + 1);

      arky.triggerSuccess(
        isThreatActual
          ? (lang === 'en' ? 'Brilliant detective eye! You detected the fraud!' : 'Ochi de detectiv! Ai depistat capcana cibernetică! 🛡️⚡')
          : (lang === 'en' ? 'Spot on! This is verified and legitimate!' : 'Corect! Ai verificat autenticitatea mesajului! ✅')
      );
    } else {
      sounds.playWrong();
      setCombo(0);
      arky.triggerIdle();
    }

    setAnsweredState({
      chosen: choice,
      isCorrect,
    });
  };

  const handleNextScenario = () => {
    sounds.playClick();
    if (currentIndex + 1 < SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowClues(false);
      setAnsweredState(null);
    } else {
      // Finished all scenarios
      setIsCompleted(true);
      sounds.playVictory();
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem('arkedo_highscore_cyber', String(score));
        } catch {
          // Ignore
        }
      }

      arky.triggerFinished(
        lang === 'en'
          ? `Investigation complete! Detective Score: ${score} points! 🛡️🔍`
          : `Ancheta s-a încheiat! Scor de Detectiv: ${score} puncte! Ești pregătit să navighezi în siguranță! 🛡️🔍`
      );
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectAnswers(0);
    setShowClues(false);
    setAnsweredState(null);
    setIsCompleted(false);
    arky.triggerIdle();
  };

  const getRankBadge = (pts: number) => {
    if (pts >= 850) {
      return {
        title: lang === 'en' ? 'Master Cyber-Shield' : 'Maestru al Securității Cibernetice',
        icon: '🛡️⭐',
        color: 'from-emerald-500 to-teal-400',
      };
    }
    if (pts >= 600) {
      return {
        title: lang === 'en' ? 'Junior Cyber Detective' : 'Detectiv Cibernetic Junior',
        icon: '🔍🎖️',
        color: 'from-cyan-500 to-blue-500',
      };
    }
    return {
      title: lang === 'en' ? 'Cadet in Training' : 'Cadet în Formare',
      icon: '🔰',
      color: 'from-amber-500 to-orange-500',
    };
  };

  const currentRank = getRankBadge(score);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 select-none">
      {/* Top Header / Navigation */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-xl">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="order-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Arcade' : 'Înapoi'}</span>
        </button>

        <div className="order-3 sm:order-2 w-full sm:w-auto flex items-center gap-2 text-left sm:text-center justify-start sm:justify-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'Cyber-Safe Detective' : 'Detectivul Cyber-Safe'}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-rose-400 font-mono">
              {lang === 'en' ? 'Identify Phishing, Scams & Safe Digital Messages' : 'Depistează Phishingul, Capcanele & Mesajele Sigure'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="order-2 sm:order-3 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold shrink-0">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{highScore} pts</span>
        </div>
      </div>

      {/* Main Game Arena */}
      {!isCompleted ? (
        <div className="bg-slate-900/95 border-2 border-rose-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col gap-6">
          {/* Progress & Live Score Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            {/* Case Counter */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300">
                {lang === 'en' ? 'Case' : 'Cazul'} {currentIndex + 1} / {SCENARIOS.length}
              </span>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                <span>{currentRank.icon}</span>
                <span>{currentRank.title}</span>
              </div>
            </div>

            {/* Score & Streak */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {combo} <span className="text-[10px] text-slate-400">combo</span>
                </span>
              </div>
              <div className="bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-rose-400" />
                <span className="text-sm sm:text-base font-black text-white font-mono">{score} pts</span>
              </div>
            </div>
          </div>

          {/* Scenario Device Screen Simulator */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 sm:p-6 shadow-inner relative flex flex-col gap-4">
            {/* Device Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                {scenario.category === 'email' && <Mail className="w-4 h-4 text-cyan-400" />}
                {scenario.category === 'chat' && <MessageSquare className="w-4 h-4 text-purple-400" />}
                {scenario.category === 'sms' && <Smartphone className="w-4 h-4 text-emerald-400" />}
                {scenario.category === 'popup' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {scenario.category === 'browser' && <Globe className="w-4 h-4 text-blue-400" />}
                <span className="uppercase font-bold tracking-wider text-slate-300">
                  {scenario.category.toUpperCase()} • {lang === 'en' ? scenario.titleEn : scenario.titleRo}
                </span>
              </div>

              {/* Clue Inspector Button */}
              <button
                onClick={handleInspectClues}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  showClues
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>{showClues ? (lang === 'en' ? 'Hide Clues' : 'Ascunde Indiciile') : (lang === 'en' ? 'Inspect Clues 🔍' : 'Inspectează Indiciile 🔍')}</span>
              </button>
            </div>

            {/* Sender Details Box */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-500 font-mono block sm:inline mr-2">De la / From:</span>
                <span className="font-bold text-white">
                  {lang === 'en' ? scenario.senderEn : scenario.senderRo}
                </span>
              </div>
              <div className="font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800/80 max-w-full truncate text-[11px]">
                {scenario.senderAddress}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-200 text-sm sm:text-base leading-relaxed">
              <p className="font-body">
                {lang === 'en' ? scenario.contentEn : scenario.contentRo}
              </p>

              {/* Simulated Link or Attachment */}
              {scenario.linkText && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{scenario.linkText}</span>
                  </div>
                  {scenario.linkTarget && (
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-xs">
                      URL: {scenario.linkTarget}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Detective Clues Box (Appears when toggled) */}
            {showClues && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 animate-fadeIn flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'en' ? 'Detective Evidence & Anomalies:' : 'Indicii și Semne de Avertizare:'}</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  {(lang === 'en' ? scenario.cluesEn : scenario.cluesRo).map((clue, idx) => (
                    <li key={idx}>{clue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Verdict Buttons OR Resolution Feedback */}
          {answeredState === null ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Threat Button */}
              <button
                onClick={() => handleAnswer('threat')}
                className="w-full sm:flex-1 py-4 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm sm:text-base shadow-xl shadow-rose-600/20 border border-rose-400/40 flex items-center justify-center gap-2.5 transition transform active:scale-95 cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-rose-200" />
                <span>{lang === 'en' ? 'THREAT / PHISHING! 🚨' : 'PERICOL / PHISHING! 🚨'}</span>
              </button>

              {/* Safe Button */}
              <button
                onClick={() => handleAnswer('safe')}
                className="w-full sm:flex-1 py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/20 border border-emerald-400/40 flex items-center justify-center gap-2.5 transition transform active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
                <span>{lang === 'en' ? 'SAFE & LEGITIMATE ✅' : 'SIGUR & AUTENTIC ✅'}</span>
              </button>
            </div>
          ) : (
            /* Detailed Resolution Card */
            <div
              className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col gap-3 animate-fadeIn ${
                answeredState.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {answeredState.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <span className="font-black text-base sm:text-lg">
                    {answeredState.isCorrect
                      ? (lang === 'en' ? 'Verdict Correct! +100 Pts' : 'Verdict Corect! +100 Puncte')
                      : (lang === 'en' ? 'Incorrect Verdict!' : 'Verdict Greșit!')}
                  </span>
                </div>

                {scenario.isThreat && scenario.dangerBadgeRo && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
                    {lang === 'en' ? scenario.dangerBadgeEn : scenario.dangerBadgeRo}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-body">
                {lang === 'en' ? scenario.explanationEn : scenario.explanationRo}
              </p>

              <div className="pt-2 flex justify-stretch sm:justify-end">
                <button
                  onClick={handleNextScenario}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>
                    {currentIndex + 1 < SCENARIOS.length
                      ? (lang === 'en' ? 'Next Case ➔' : 'Următorul Caz ➔')
                      : (lang === 'en' ? 'View Final Results 🏆' : 'Vezi Raportul Final 🏆')}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Final Results & Rank Card */
        <div className="bg-slate-900/95 border-2 border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-4xl shadow-xl shadow-rose-500/20 ring-4 ring-rose-500/20 animate-bounce">
            🛡️
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 uppercase tracking-wider">
              {lang === 'en' ? 'Investigation Complete!' : 'Ancheta de Securitate Încheiată!'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-2">
              {studentName ? `${studentName}, ` : ''}
              {score >= 800
                ? (lang === 'en' ? 'Master Cyber-Shield Certified! 🛡️⭐' : 'Certificat ca Maestru Cyber-Shield! 🛡️⭐')
                : score >= 500
                ? (lang === 'en' ? 'Skillful Cyber Detective! 🔍' : 'Detectiv Cibernetic Vigilent! 🔍')
                : (lang === 'en' ? 'Cadet - Keep Investigating! 🔰' : 'Cadet - Continuă Antrenamentul! 🔰')}
            </h2>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl w-full">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Scor Final</span>
              <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono mt-1">
                {score}
              </span>
              <span className="text-[11px] text-slate-500">puncte</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Cazuri Rezolvate</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                {correctAnswers} / {SCENARIOS.length}
              </span>
              <span className="text-[11px] text-slate-500">corecte</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Acuratețe</span>
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mt-1">
                {Math.round((correctAnswers / SCENARIOS.length) * 100)}%
              </span>
              <span className="text-[11px] text-slate-500">precizie analiză</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Max Combo</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1">
                {maxCombo}
              </span>
              <span className="text-[11px] text-slate-500">consecutive</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'en' ? 'Investigate Again' : 'Investighează din Nou'}</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm transition border border-slate-700 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
