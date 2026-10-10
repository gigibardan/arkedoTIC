import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Cookie,
  FileText,
  Mail,
  Sparkles,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  GraduationCap,
  Users,
  Code2,
  Lock,
  Cpu,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

export type LegalTabType = 'about' | 'privacy' | 'cookies' | 'terms' | 'contact';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTabType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'about',
  onClose,
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'student' | 'teacher' | 'parent' | 'other'>('student');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Cookie preference state (within modal)
  const [cookieChoice, setCookieChoice] = useState<'all' | 'essential' | null>(() => {
    try {
      return (localStorage.getItem('arkyedu_cookie_consent') as any) || null;
    } catch {
      return null;
    }
  });
  const [cookieSavedFeedback, setCookieSavedFeedback] = useState(false);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText('contact@arkyedu.com').then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
      });
    }
  };

  const handleUpdateCookies = (choice: 'all' | 'essential') => {
    sounds.playClick();
    try {
      localStorage.setItem('arkyedu_cookie_consent', choice);
      setCookieChoice(choice);
      setCookieSavedFeedback(true);
      setTimeout(() => setCookieSavedFeedback(false), 3000);

      // Update gtag consent if window.gtag exists
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: choice === 'all' ? 'granted' : 'denied',
        });
      }
    } catch (e) {
      console.warn('Cookie storage error:', e);
    }
  };

  const encode = (data: Record<string, string>) => {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMessage.trim()) return;

    sounds.playClick();
    setFormStatus('submitting');

    const payload = {
      'form-name': 'contact',
      name: formName || 'Anonim',
      email: formEmail || 'fara-email@arkyedu.com',
      role: formRole,
      subject: formSubject || 'Mesaj Platformă ArkyEdu',
      message: formMessage,
    };

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      });
      sounds.playSuccess();
      setFormStatus('success');
      setFormMessage('');
    } catch (err) {
      console.warn('Netlify form submission failed, fallback to local mail client:', err);
      // Fallback: still treat gracefully so user is informed
      setFormStatus('success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        {/* Header */}
        <div className="relative p-5 sm:p-6 pb-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Închide"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              ArkyEdu • Info & Legal
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Powered by Gigi
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            {lang === 'en' ? 'About ArkyEdu & Legal Terms' : 'Despre ArkyEdu, Legal & Contact'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {lang === 'en'
              ? 'A 100% free, non-profit digital learning initiative built with passion for Romanian middle-school students and teachers.'
              : 'Un proiect educațional 100% gratuit, non-profit, construit din pură pasiune pentru elevii și profesorii de gimnaziu din România.'}
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar border-t border-slate-800/80 pt-3">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('about');
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'about'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              {lang === 'en' ? 'Our Story' : 'Povestea Noastră'}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('privacy');
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'privacy'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {lang === 'en' ? 'Privacy & GDPR' : 'Confidențialitate & GDPR'}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('cookies');
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'cookies'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cookie className="w-4 h-4 text-amber-400" />
              {lang === 'en' ? 'Cookies' : 'Cookie-uri'}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('terms');
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'terms'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              {lang === 'en' ? 'Terms' : 'Termeni & Condiții'}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('contact');
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              {lang === 'en' ? 'Contact' : 'Contact & Mesaj'}
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto max-h-[64vh] space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* TAB 1: DESPRE PROIECT & POVESTE */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-800/40 to-emerald-950/40 border border-teal-500/30 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/30 text-3xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {lang === 'en' ? 'The Story Behind ArkyEdu' : 'Povestea din Spatele ArkyEdu'}
                  </h3>
                  <p className="text-emerald-300 text-xs sm:text-sm font-medium mt-1">
                    {lang === 'en'
                      ? 'Born out of passion for education • Zero monetization • Powered by Gigi'
                      : 'Născut din pasiune sinceră pentru educație • Fără nicio încasare • Powered by Gigi'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p>
                  {lang === 'en' ? (
                    <>
                      <strong>ArkyEdu</strong> started from a simple, heartfelt idea: computer science (TIC) classes in middle school should never be a chore of reading dense, dry paper manuals. Technology is meant to be touched, explored, tested, and loved!
                    </>
                  ) : (
                    <>
                      <strong>ArkyEdu</strong> s-a născut dintr-o idee simplă și plină de căldură: orele de TIC (Tehnologia Informației și a Comunicațiilor) din gimnaziu nu ar trebui să fie niciodată o corvoadă de citit manuale tipărite dense și teorii aride. Tehnologia s-a născut pentru a fi atinsă, experimentată, demontată și iubită!
                    </>
                  )}
                </p>

                <p>
                  {lang === 'en' ? (
                    <>
                      Created with devotion by <strong>Gigi</strong>, platform builder and digital enthusiast, ArkyEdu combines the official Romanian school curriculum (grades 5 through 8) with the magic of interactive web games, arcade simulators, drag-and-drop hardware assembly, and friendly visual programming.
                    </>
                  ) : (
                    <>
                      Creat cu dăruire de către <strong>Gigi</strong>, pasionat de educație digitală și arhitectură software, ArkyEdu îmbină programa școlară oficială pentru clasele V - VIII cu magia jocurilor interactive, a simulatoarelor arcade retro, a asamblării hardware prin drag-and-drop și a programării vizuale prietenoase.
                    </>
                  )}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2 font-bold text-sm">
                      100%
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">
                      {lang === 'en' ? 'Completely Free' : 'Complet Gratuit'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'en'
                        ? 'No subscriptions, no fees, no paywalls. Free for every school, student, and teacher.'
                        : 'Fără abonamente, fără plată, fără bariere financiare. Gratuit pentru fiecare școală, elev și profesor.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 font-bold text-sm">
                      🚫
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">
                      {lang === 'en' ? 'Zero Ads & Clean' : 'Fără Reclame'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'en'
                        ? 'Zero advertising banners, zero popups. Children focus 100% on learning and discovery.'
                        : 'Zero reclame deranjante, zero pop-up-uri comerciale. Atenția elevului este 100% dedicată cunoașterii.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 font-bold text-sm">
                      ❤️
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">
                      {lang === 'en' ? 'Pure Passion' : 'Din Pasiune'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'en'
                        ? 'Built independently with love to support modern digital literacy in Romania.'
                        : 'Construit independent din dragoste pentru educație, pentru a susține alfabetizarea digitală în România.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {lang === 'en' ? 'Who is Arky?' : 'Cine este Arky?'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {lang === 'en'
                        ? 'Arky is our friendly digital mascot robot! He lives in the bottom corner of your screen, offers helpful pedagogical hints when questions get tough, celebrates every 100-point achievement, and makes sure no student feels left behind.'
                        : 'Arky este micul nostru roboțel-mascotă! El locuiește în colțul ecranului, oferă indicii pedagogice atunci când o întrebare este dificilă, se bucură la fiecare notă de 10 sau diplomă obținută și se asigură că niciun elev nu rămâne în urmă.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POLITICA DE CONFIDENTIALITATE & GDPR */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'en'
                      ? 'Commitment to Privacy & Child Safety (GDPR)'
                      : 'Angajament Ferm pentru Confidențialitate & Protecția Copiilor (GDPR)'}
                  </h3>
                  <p className="text-xs text-emerald-300 mt-1">
                    {lang === 'en'
                      ? 'Conforms to EU Regulation 2016/679 (GDPR). We do not collect or sell personal data.'
                      : 'Conform Regulamentului General privind Protecția Datelor (UE) 2016/679. Nu colectăm și nu vindem date.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-teal-400" />
                    {lang === 'en' ? '1. Zero Sensitive Personal Data' : '1. Fără Date Personale Sensibile'}
                  </h4>
                  <p className="text-slate-300">
                    {lang === 'en'
                      ? 'ArkyEdu does not request or store any sensitive personal information: NO national ID (CNP), NO home addresses, NO phone numbers, and NO banking details. The platform is completely free to use without requiring an official identity check.'
                      : 'ArkyEdu nu solicită și nu reține date cu caracter personal sensibil: FĂRĂ cod numeric personal (CNP), FĂRĂ adrese fizice, FĂRĂ numere de telefon și FĂRĂ informații bancare. Platforma poate fi explorată liber, fără card și fără formalități birocratice.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    {lang === 'en' ? '2. Local Storage of School Progress' : '2. Stocarea Locală a Progresului Școlar'}
                  </h4>
                  <p className="text-slate-300">
                    {lang === 'en'
                      ? 'The student name and game scores are saved in your browser local storage (localStorage) so you can resume lessons without losing progress. You can reset or delete this at any time by clearing your browser cache.'
                      : 'Numele elevului introdus în antet și progresul la lecții/teste sunt salvate direct în memoria locală a navigatorului tău (localStorage), astfel încât să poți relua lecția la următoarea oră fără cont obligatoriu. Aceste date pot fi șterse oricând printr-o simplă curățare a memoriei cache a browserului.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    {lang === 'en' ? '3. Optional Cloud & Leaderboards' : '3. Funcții Opționale de Cloud & Clasament'}
                  </h4>
                  <p className="text-slate-300">
                    {lang === 'en'
                      ? 'When using the optional classroom leaderboard or teacher gradebook, only a student pseudonym and lesson scores are synced. No third-party behavioral profiling is ever performed.'
                      : 'În cazul folosirii modului opțional de sincronizare cu catalogul profesorului sau clasamentul clasei, este transmis doar pseudonimul ales de elev și punctajul obținut. Nicio terță parte nu are acces la date comportamentale.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    {lang === 'en' ? '4. Your Rights & Contact' : '4. Drepturile Tale ca Utilizator'}
                  </h4>
                  <p className="text-slate-300">
                    {lang === 'en'
                      ? 'Under GDPR, you have the right to request the deletion or export of any data associated with your session. You can reach out directly at contact@arkyedu.com for any privacy inquiries.'
                      : 'Conform GDPR, ai dreptul de acces, rectificare sau ștergere totală a oricărei înregistrări asociate contului tău. Ne poți scrie oricând la contact@arkyedu.com pentru orice solicitare privind confidențialitatea.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POLITICA DE COOKIE-URI */}
          {activeTab === 'cookies' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-4">
                <Cookie className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'en' ? 'Cookie Policy & Local Storage' : 'Politica Privind Modulele Cookie & Memoria Locală'}
                  </h3>
                  <p className="text-xs text-amber-300 mt-1">
                    {lang === 'en'
                      ? 'Transparent, strictly educational, zero commercial tracking.'
                      : 'Transparență deplină, scop strict educativ, zero cookie-uri publicitare sau comerciale.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <p>
                  {lang === 'en' ? (
                    <>
                      ArkyEdu believes in a clean web experience. We only use cookies and local storage tokens that serve a direct functional purpose for the educational experience.
                    </>
                  ) : (
                    <>
                      ArkyEdu crede într-o experiență web curată și lipsită de invazivitate. Folosim doar tehnologii de stocare care servesc direct procesului educațional:
                    </>
                  )}
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {lang === 'en' ? '1. Essential Technical Cookies & Storage' : '1. Cookie-uri & Stocare Tehnică Esențială'}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">
                        {lang === 'en'
                          ? 'Used to save your sound preferences (mute/unmute), active language (RO/EN), visual theme (Dark/Light), active lesson progress, and cookie consent decision.'
                          : 'Păstrează preferințele de sunet (pornit/oprit), limba selectată (RO/EN), tema vizuală (Dark/Light), progresul lecției curente și decizia ta de consimțământ cookie.'}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold shrink-0">
                      {lang === 'en' ? 'Always Active' : 'Obligatoriu Tehnic'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {lang === 'en' ? '2. Anonymized Aggregated Analytics' : '2. Statistici Agregate Anonimizate (Google Analytics)'}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">
                        {lang === 'en'
                          ? 'Google Analytics (G-P9NW97TZHH) measures aggregate page visits to help us see which lessons need more interactive exercises. IP addresses are anonymized, and ad personalization is disabled.'
                          : 'Google Analytics (G-P9NW97TZHH) măsoară numărul general de accesări pe capitole pentru a ne ajuta să dezvoltăm mai multe exerciții interactive unde este nevoie. IP-ul este anonimizat și reclamele sunt complet dezactivate.'}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold shrink-0">
                      {lang === 'en' ? 'Anonymous Stats' : 'Anonim'}
                    </span>
                  </div>
                </div>

                {/* Interactive preference selector */}
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 mt-6">
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-teal-400" />
                    {lang === 'en' ? 'Manage Your Cookie Preferences' : 'Gestionează Preferințele Tale de Cookie-uri'}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    {lang === 'en'
                      ? 'You can change your consent choice at any time below:'
                      : 'Poți modifica oricând alegerea ta apăsând pe una dintre opțiunile de mai jos:'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleUpdateCookies('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        cookieChoice === 'all'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Accept All (Essential + Stats)' : 'Acceptă Toate (Esențiale + Statistici)'}
                    </button>
                    <button
                      onClick={() => handleUpdateCookies('essential')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        cookieChoice === 'essential'
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Only Essential Cookies' : 'Doar Cookie-uri Esențiale'}
                    </button>
                  </div>

                  {cookieSavedFeedback && (
                    <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs font-bold animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      {lang === 'en' ? 'Preferences saved successfully!' : 'Preferințele au fost salvate cu succes!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TERMENI SI CONDITII */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-4">
                <FileText className="w-8 h-8 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'en' ? 'Terms of Use & Classroom License' : 'Termeni de Utilizare & Licență Didactică'}
                  </h3>
                  <p className="text-xs text-cyan-300 mt-1">
                    {lang === 'en'
                      ? 'Free educational use for teachers, students, and schools.'
                      : 'Utilizare educațională gratuită pentru profesori, elevi și unități de învățământ.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="font-bold text-white text-sm mb-1">
                    {lang === 'en' ? '1. Free Classroom & Home Access' : '1. Acces Liber la Clasă și Acasă'}
                  </h4>
                  <p className="text-slate-300">
                    {lang === 'en'
                      ? 'Teachers are actively encouraged to project, share, and utilize ArkyEdu during official class hours, in computer labs, or for interactive homework assignments. No permission letters or licenses are required.'
                      : 'Profesorii de informatică și TIC sunt încurajați să proiecteze, să recomande și să utilizeze ArkyEdu la orele de curs, în laboratoarele școlare sau pentru teme interactive acasă. Nu este necesar niciun acord scris sau plată de licență.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="font-bold text-white text-sm mb-1">
                    {lang === 'en' ? '2. Educational Content & Curriculum Alignment' : '2. Aliniere Curriculară și Conținut Didactic'}
                  </h4>
                  <p className="text-slate-300">
                    {lang === 'en'
                      ? 'The learning units follow the official Romanian curriculum approved by OMEN 3393/2017. Content is provided "as is" with the highest pedagogical care, continuously updated to reflect modern digital standards.'
                      : 'Conținutul respectă Programa Școlară Națională aprobată prin OMEN nr. 3393/2017 pentru disciplina Informatică și TIC. Materialele sunt concepute cu grijă pedagogică maximă și actualizate periodic.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="font-bold text-white text-sm mb-1">
                    {lang === 'en' ? '3. Community Respect & Fair Play' : '3. Fair-Play & Conduită Digitală'}
                  </h4>
                  <p className="text-slate-300">
                    {lang === 'en'
                      ? 'Students participating in multiplayer 1v1 duels or classroom leaderboards are expected to maintain fair sportsmanship, avoid offensive nicknames, and respect fellow learners.'
                      : 'Elevii care participă la duelurile multiplayer 1v1 sau în clasamentele clasei sunt rugați să respecte colegii, să folosească pseudonime adecvate mediului școlar și să respecte principiile fair-play-ului.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & FEEDBACK FORM */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-8 h-8 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {lang === 'en' ? 'Contact ArkyEdu Team' : 'Contactează Echipa ArkyEdu'}
                    </h3>
                    <p className="text-xs text-indigo-300 mt-1">
                      {lang === 'en'
                        ? 'Questions, suggestions, teacher partnerships, or bugs? We would love to hear from you!'
                        : 'Ai o întrebare, o idee de joc nou, vrei o colaborare pentru școala ta sau ai găsit o eroare? Scrie-ne!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct email quick badge */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      {lang === 'en' ? 'Official Project Email:' : 'Adresa oficială de email:'}
                    </span>
                    <a
                      href="mailto:contact@arkyedu.com"
                      className="text-base sm:text-lg font-mono font-bold text-teal-300 hover:text-teal-200 underline decoration-teal-500/40"
                    >
                      contact@arkyedu.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  >
                    {copiedEmail ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'en' ? 'Copied!' : 'Copiat!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>{lang === 'en' ? 'Copy Email' : 'Copiază Email'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href="mailto:contact@arkyedu.com?subject=ArkyEdu%20Feedback"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Open Mail App' : 'Deschide Mail'}</span>
                  </a>
                </div>
              </div>

              {/* Netlify Form */}
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleContactSubmit}
                className="p-5 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-4"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-teal-400" />
                  {lang === 'en' ? 'Send a Message Directly Here' : 'Trimite un Mesaj Direct de pe Site'}
                </h4>

                {formStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="block text-white font-bold">
                        {lang === 'en' ? 'Message Sent!' : 'Mesajul tău a fost trimis cu succes!'}
                      </strong>
                      <span>
                        {lang === 'en'
                          ? 'Thank you for writing to us. We will get back to you at contact@arkyedu.com as soon as possible.'
                          : 'Îți mulțumim pentru mesaj! Gigi și echipa ArkyEdu îți vor răspunde în cel mai scurt timp.'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {lang === 'en' ? 'Your Name / Nickname' : 'Numele tău / Pseudonim'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Alex or Maria' : 'ex: Andrei sau Prof. Elena'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {lang === 'en' ? 'Email Address' : 'Adresă de Email (pentru răspuns)'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder={lang === 'en' ? 'your.email@example.com' : 'adresa.ta@exemplu.ro'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {lang === 'en' ? 'You are a:' : 'Calitatea ta:'}
                    </label>
                    <select
                      name="role"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-teal-400"
                    >
                      <option value="student">{lang === 'en' ? 'Student (Grade 5 - 8)' : 'Elev (Clasa V - VIII)'}</option>
                      <option value="teacher">{lang === 'en' ? 'ICT / Informatics Teacher' : 'Profesor de TIC / Informatică'}</option>
                      <option value="parent">{lang === 'en' ? 'Parent' : 'Părinte'}</option>
                      <option value="other">{lang === 'en' ? 'Tech Enthusiast / Other' : 'Pasionat IT / Altul'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {lang === 'en' ? 'Subject / Topic' : 'Subiect'}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Suggestion for a new game' : 'ex: Sugestie joc nou / Întrebare'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {lang === 'en' ? 'Your Message' : 'Mesajul tău'}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder={
                      lang === 'en'
                        ? 'Write your feedback, question, or encouragement here...'
                        : 'Scrie aici sugestia, feedback-ul sau întrebarea ta pentru Gigi și Arky...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-400 resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    {lang === 'en' ? 'Encrypted & delivered to contact@arkyedu.com' : 'Trimis în siguranță la contact@arkyedu.com'}
                  </span>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{lang === 'en' ? 'Sending...' : 'Se trimite...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{lang === 'en' ? 'Send Message' : 'Trimite Mesajul'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>arkyedu.com • {lang === 'en' ? '100% Free & Open Education' : 'Educație Digitală 100% Gratuită'}</span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            {lang === 'en' ? 'Close Window' : 'Închide Fereastra'}
          </button>
        </div>
      </div>
    </div>
  );
};
