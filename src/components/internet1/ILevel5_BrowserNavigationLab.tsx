import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Star,
  Home,
  CheckCircle2,
  Sparkles,
  Search,
  Lock,
  Globe,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  KeyRound,
  Info,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuestionHint } from './QuestionHint';
import { AnswerExplanation } from './AnswerExplanation';
import { PageNavigationFooter } from './PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';
import { sounds } from '../../utils/audio';

interface ILevel5Props {
  onCompletePage: (earnedScore: number) => void;
}

interface SimulatedPage {
  url: string;
  titleRo: string;
  titleEn: string;
  badge: string;
  contentRo: string;
  contentEn: string;
}

export const ILevel5_BrowserNavigationLab: React.FC<ILevel5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Simulated browser history
  const pages: SimulatedPage[] = [
    {
      url: 'https://www.cfr.ro',
      titleRo: 'CFR Călători - Mersul Trenurilor',
      titleEn: 'CFR Passenger Trains - Timetable',
      badge: '🚂 Pagina de Start (Manual p. 35)',
      contentRo: 'Bine ați venit pe site-ul oficial CFR SA! Calea ferată pentru un transport ecologic și sigur.',
      contentEn: 'Welcome to the official CFR website! Railways for eco-friendly and safe transport.',
    },
    {
      url: 'https://www.cfr.ro/mersul-trenurilor',
      titleRo: 'Mersul Trenurilor & Bilete Online',
      titleEn: 'Train Timetables & Online Tickets',
      badge: '🎫 Rezervări Tren',
      contentRo: 'Căutare rute: București Nord ➔ Brașov. Trenul IR 1630 pleacă la ora 09:30 de la linia 1.',
      contentEn: 'Route Search: Bucharest North ➔ Brasov. Train IR 1630 departs at 09:30 from platform 1.',
    },
    {
      url: 'https://www.mnar.arts.ro',
      titleRo: 'Muzeul Național de Artă al României',
      titleEn: 'National Museum of Art of Romania',
      badge: '🏛️ Muzeu Național',
      contentRo: 'Expoziția de Artă Veche Românească și Galeria de Artă Europeană.',
      contentEn: 'Exhibition of Early Romanian Art and European Art Gallery.',
    },
  ];

  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [showSslModal, setShowSslModal] = useState<boolean>(false);

  // Practical Quiz Tasks on Browser Controls (Manual p. 35-36)
  const [qBrowserProgram, setQBrowserProgram] = useState<string | null>(null);
  const [browserCooldown, setBrowserCooldown] = useState<number>(0);
  const [tfA, setTfA] = useState<string | null>(null);
  const [tfB, setTfB] = useState<string | null>(null);
  const [tfC, setTfC] = useState<string | null>(null);
  const [tfCooldown, setTfCooldown] = useState<number>(0);

  // Typosquatting & SSL Certificate Verification Lab
  const [typosquattingAnswers, setTyposquattingAnswers] = useState<Record<string, 'safe' | 'phishing'>>({});
  const [typoCooldown, setTypoCooldown] = useState<number>(0);

  const typoCases = [
    {
      id: 'cfr',
      url: 'https://www.cfr.ro/mersul-trenurilor',
      protocol: 'HTTPS (Port 443)',
      sslValid: true,
      issuer: 'DigiCert Global TLS RSA CA',
      domain: 'cfr.ro (Domeniu oficial național)',
      expected: 'safe',
      hintRo: 'Protocol securizat HTTPS, certificat valid emis pentru CFR SA și domeniu oficial .ro.',
      hintEn: 'Secure HTTPS protocol, valid certificate issued for CFR SA and official .ro domain.',
    },
    {
      id: 'banca_fake',
      url: 'http://banca-transllvania-online.ro',
      protocol: 'HTTP (Port 80 - Nesecurizat)',
      sslValid: false,
      issuer: 'LIPSĂ CERTIFICAT (Conexiune în clar)',
      domain: 'banca-transllvania-online.ro (Dublu "ll" în loc de "il")',
      expected: 'phishing',
      hintRo: 'Pericol! Protocol HTTP nesecurizat și adresă clonată (transllvania cu doi de "l") - Typosquatting tipic!',
      hintEn: 'Danger! Insecure HTTP protocol and misspelled domain (transllvania with double "l") - Classic typosquatting!',
    },
    {
      id: 'edu_fake',
      url: 'https://edu-ro.rezultate-evaluare.xyz',
      protocol: 'HTTPS (Certificat generic gratuit)',
      sslValid: false,
      issuer: 'Certificat Nerecunoscut de Minister',
      domain: 'rezultate-evaluare.xyz (Extensie ciudată .xyz, mascare edu-ro)',
      expected: 'phishing',
      hintRo: 'Atenție! Site-ul oficial este www.edu.ro. Extensia .xyz și mascarea "edu-ro" într-un subdomeniu ascuns indică phishing!',
      hintEn: 'Caution! The official site is www.edu.ro. The .xyz extension and masked "edu-ro" prefix indicate phishing!',
    },
    {
      id: 'mnar',
      url: 'https://www.mnar.arts.ro',
      protocol: 'HTTPS (Port 443)',
      sslValid: true,
      issuer: 'Let’s Encrypt Authority',
      domain: 'mnar.arts.ro (Muzeul Național de Artă al României)',
      expected: 'safe',
      hintRo: 'Autentic! Subdomeniu oficial acreditat al domeniului arts.ro cu certificat de securitate valid.',
      hintEn: 'Authentic! Official accredited arts.ro domain with valid SSL certificate.',
    },
  ];

  const handleClassifyUrl = (caseId: string, choice: 'safe' | 'phishing') => {
    if (typoCooldown > 0) return;
    const targetCase = typoCases.find((c) => c.id === caseId);
    if (!targetCase) return;

    if (targetCase.expected === choice) {
      sounds.playCorrect();
      setTyposquattingAnswers((prev) => ({ ...prev, [caseId]: choice }));
    } else {
      sounds.playWrong();
      setTyposquattingAnswers((prev) => ({ ...prev, [caseId]: choice }));
      start5sCooldown(setTypoCooldown);
    }
  };

  const isTyposquattingDone =
    typosquattingAnswers.cfr === 'safe' &&
    typosquattingAnswers.banca_fake === 'phishing' &&
    typosquattingAnswers.edu_fake === 'phishing' &&
    typosquattingAnswers.mnar === 'safe';

  const start5sCooldown = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(5);
    const timer = setInterval(() => {
      setter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const currentPage = pages[historyIndex];

  const handleGoBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      sounds.playClick();
    }
  };

  const handleGoForward = () => {
    if (historyIndex < pages.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      sounds.playClick();
    }
  };

  const handleReload = () => {
    setIsReloading(true);
    sounds.playClick();
    setTimeout(() => {
      setIsReloading(false);
      sounds.playCorrect();
    }, 500);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    sounds.playCorrect();
  };

  const isQBrowserCorrect = qBrowserProgram === 'browser';
  const isTfACorrect = tfA === 'A'; // Un site poate avea o singură pagină web (Adevărat, ex: one-page site)
  const isTfBCorrect = tfB === 'F'; // Nu se folosește Paint pentru realizarea paginilor web (Fals, se folosește HTML)
  const isTfCCorrect = tfC === 'A'; // Între pagini pot exista mai multe hiperlinkuri (Adevărat)

  const totalQuestions = 5;
  const correctCount =
    (isQBrowserCorrect ? 1 : 0) +
    (isTfACorrect ? 1 : 0) +
    (isTfBCorrect ? 1 : 0) +
    (isTfCCorrect ? 1 : 0) +
    (isTyposquattingDone ? 1 : 0);

  const pageScore = Math.round((correctCount / totalQuestions) * 15);

  const handleProceed = () => {
    if (correctCount >= 3) sounds.playVictory();
    else sounds.playClick();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    setQBrowserProgram(null);
    setTfA(null);
    setTfB(null);
    setTfC(null);
    setTyposquattingAnswers({});
    setShowSslModal(false);
    setHistoryIndex(0);
    setIsBookmarked(false);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-2">
          <Globe className="w-4 h-4" />
          <span>{lang === 'en' ? 'Module 3A • Page 5 / 6 (Textbook pp. 35–36)' : 'Modulul 3A • Pagina 5 / 6 (Manual pag. 35–36)'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white font-heading">
          {lang === 'en' ? '5. Web Browser Architecture & Navigation Controls' : '5. Arhitectura Browserului & Instrumentele de Navigare'}
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          {lang === 'en'
            ? 'Test real browser controls (Back, Forward, Refresh, Bookmark) and solve the textbook evaluation statements!'
            : 'Testează butoanele funcționale ale browserului (Înapoi, Înainte, Reîncărcare, Favorite) și rezolvă exercițiile cu Adevărat/Fals din manual!'}
        </p>
      </div>

      {/* Interactive Simulator: Web Browser Frame (Model manual pag. 35 www.cfr.ro) */}
      <div className="bg-slate-950 border-2 border-blue-500/40 rounded-3xl overflow-hidden shadow-2xl">
        {/* Browser Top Title Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-xs font-mono text-slate-400 ml-2 truncate max-w-xs">
              {lang === 'en' ? currentPage.titleEn : currentPage.titleRo}
            </span>
          </div>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-500/30">
            Chrome Simulator
          </span>
        </div>

        {/* Browser Controls Toolbar */}
        <div className="bg-slate-850 p-3 border-b border-slate-800 flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Back Button (1) */}
          <button
            type="button"
            onClick={handleGoBack}
            disabled={historyIndex === 0}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              historyIndex > 0
                ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            title="1. Butonul Înapoi (Back)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Forward Button (2) */}
          <button
            type="button"
            onClick={handleGoForward}
            disabled={historyIndex === pages.length - 1}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              historyIndex < pages.length - 1
                ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            title="2. Butonul Înainte (Forward)"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Refresh Button (3) */}
          <button
            type="button"
            onClick={handleReload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer"
            title="3. Butonul Reîncărcare (Reload / Refresh)"
          >
            <RotateCw className={`w-4 h-4 ${isReloading ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          {/* Address Bar (URL Bar) */}
          <div className="flex-1 min-w-[200px] bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center justify-between gap-2 relative">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              {/* Clickable Lock for SSL Inspector */}
              <button
                type="button"
                onClick={() => {
                  setShowSslModal(!showSslModal);
                  sounds.playClick();
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold transition cursor-pointer shrink-0"
                title={lang === 'en' ? 'Click to inspect SSL/TLS Security Certificate' : 'Click pentru a inspecta Certificatul de Securitate SSL/TLS'}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">HTTPS</span>
              </button>
              <span className="text-xs font-mono text-white truncate font-medium">
                {currentPage.url}
              </span>
            </div>
            {/* Bookmark Star (4) */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className="text-slate-400 hover:text-amber-400 transition cursor-pointer p-1 shrink-0"
              title="4. Adaugă la Pagini Favorite (Bookmark)"
            >
              <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Quick Nav links to simulate jumping */}
          <div className="hidden sm:flex items-center gap-1.5">
            {pages.map((p, idx) => (
              <button
                key={p.url}
                type="button"
                onClick={() => {
                  setHistoryIndex(idx);
                  sounds.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                  historyIndex === idx
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Page {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* SSL Certificate Inspector Card */}
        {showSslModal && (
          <div className="bg-slate-950/95 border-b-2 border-emerald-500/40 p-4 sm:p-5 flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-white font-mono">
                  {lang === 'en' ? 'Verified Security Certificate (SSL / TLS 1.3)' : 'Certificat de Securitate Verificat (SSL / TLS 1.3)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSslModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
              >
                ✕ {lang === 'en' ? 'Close' : 'Închide'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Autoritate Emitentă (CA)</span>
                <span className="text-emerald-400 font-bold">DigiCert Global Root G2</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Protocol Criptare</span>
                <span className="text-cyan-400 font-bold">TLS 1.3 • AES_256_GCM</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Domeniu Verificat</span>
                <span className="text-purple-400 font-bold">{currentPage.url.replace('https://', '')}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              💡 {lang === 'en'
                ? 'HTTPS encrypts all data sent between your browser and the web server, protecting passwords and personal info from eavesdropping.'
                : 'Protocolul HTTPS criptează toate datele transmise între browserul tău și serverul web, împiedicând interceptarea parolelor și a datelor personale de către atacatori pe rețelele Wi-Fi publice.'}
            </p>
          </div>
        )}

        {/* Browser Page Viewport Body */}
        <div className="p-6 bg-slate-900/90 min-h-[140px] flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-2">
            <span>{currentPage.badge}</span>
          </div>
          <h4 className="text-lg sm:text-xl font-black text-white font-heading mb-2">
            {lang === 'en' ? currentPage.titleEn : currentPage.titleRo}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en' ? currentPage.contentEn : currentPage.contentRo}
          </p>
        </div>
      </div>

      {/* Laborator Practic de Securitate: Depistarea Typosquatting & Certificate SSL */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 font-bold text-sm">
              🛡️
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                {lang === 'en'
                  ? 'Interactive Security Lab: SSL Certificates & Typosquatting Hunter'
                  : 'Laborator Interactiv: Inspector Certificate SSL & Depistare Typosquatting'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Examine 4 simulated links: check HTTPS padlock, spelling errors and clone domains!'
                  : 'Analizează 4 adrese simulate: verifică lacătul HTTPS, greșelile de scriere și domeniile clonate!'}
              </p>
            </div>
          </div>
          {isTyposquattingDone ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto font-mono">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Security Master! (+3 pts)' : 'Expert Securitate! (+3 pct)'}
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              {Object.keys(typosquattingAnswers).length} / 4 {lang === 'en' ? 'checked' : 'analizate'}
            </span>
          )}
        </div>

        {typoCooldown > 0 && (
          <PedagogicalReflectionBanner
            cooldown={typoCooldown}
            customMessageRo="Clasificare eronată! Atenție: site-urile periculoase folosesc HTTP în clar sau domenii clonate (ex: 'll' în loc de 'il', extensii dubioase .xyz). Reanalizează linkul."
            customMessageEn="Incorrect classification! Warning: fraudulent sites use unencrypted HTTP or misspelled domains (e.g., 'll' instead of 'il', weird .xyz extensions)."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {typoCases.map((tc) => {
            const userChoice = typosquattingAnswers[tc.id];
            const isAnswered = Boolean(userChoice);
            const isCorrect = userChoice === tc.expected;

            return (
              <div
                key={tc.id}
                className={`p-4 rounded-2xl border transition ${
                  isAnswered
                    ? isCorrect
                      ? 'bg-slate-950/80 border-emerald-500/60'
                      : 'bg-slate-950/80 border-rose-500/60'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    URL #{tc.id.toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      tc.sslValid
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {tc.protocol}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-white truncate mb-2.5 select-all">
                  {tc.url}
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 mb-3">
                  <div>
                    <strong className="text-slate-300">Certificat:</strong> {tc.issuer}
                  </div>
                  <div>
                    <strong className="text-slate-300">Domeniu detectat:</strong> {tc.domain}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={typoCooldown > 0}
                    onClick={() => handleClassifyUrl(tc.id, 'safe')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                      userChoice === 'safe'
                        ? tc.expected === 'safe'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Legitimate & Safe' : 'Legitim & Securizat'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={typoCooldown > 0}
                    onClick={() => handleClassifyUrl(tc.id, 'phishing')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                      userChoice === 'phishing'
                        ? tc.expected === 'phishing'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Phishing / Fake' : 'Phishing / Fals'}</span>
                  </button>
                </div>

                {isAnswered && (
                  <p
                    className={`text-[11px] mt-2 font-medium ${
                      isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isCorrect ? '✓ ' : '✗ '}
                    {lang === 'en' ? tc.hintEn : tc.hintRo}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Questions from Manual (p. 36) */}
      <div className="space-y-5">
        <h3 className="text-base sm:text-lg font-black text-white font-heading">
          ✍️ {lang === 'en' ? 'Textbook Exercises (Ex. 3 & Ex. 4, p. 36)' : 'Exerciții din Manual (Ex. 3 & Ex. 4, pag. 36)'}
        </h3>

        {/* Question 1: Ce program folosim pentru a naviga pe internet? */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-md space-y-3">
          <p className="text-sm font-bold text-white mb-1">
            <span className="text-teal-400 font-mono mr-1.5">1.</span>
            {lang === 'en' ? 'What program do we use to browse the internet?' : 'Ce program folosim pentru a naviga pe internet?'}
          </p>

          {browserCooldown > 0 && (
            <PedagogicalReflectionBanner
              cooldown={browserCooldown}
              customMessageRo="Răspuns greșit! Te rugăm să acorzi 5 secunde pentru a citi explicația din manual (pag. 34-36) înainte de a încerca din nou."
              customMessageEn="Incorrect answer! Please take 5 seconds to review the explanation before trying again."
              className="mb-2"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'image_editor', labelRo: 'a) Un program de editare de imagini (Paint)', labelEn: 'a) An image editing app (Paint)' },
              { id: 'text_file', labelRo: 'b) Un fișier text (.txt)', labelEn: 'b) A plain text file' },
              { id: 'browser', labelRo: 'c) Un program de navigare (Browser)', labelEn: 'c) A web browser' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={browserCooldown > 0}
                onClick={() => {
                  if (browserCooldown > 0) return;
                  setQBrowserProgram(opt.id);
                  if (opt.id === 'browser') {
                    sounds.playCorrect();
                  } else {
                    sounds.playWrong();
                    start5sCooldown(setBrowserCooldown);
                  }
                }}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  qBrowserProgram === opt.id
                    ? opt.id === 'browser'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.labelEn : opt.labelRo}
              </button>
            ))}
          </div>

          {qBrowserProgram && (
            <AnswerExplanation
              isCorrect={isQBrowserCorrect}
              explanationRo={
                isQBrowserCorrect
                  ? 'Corect! Browserul (Google Chrome, Firefox, Edge, Safari) este programul special creat pentru a interpreta documente web și a naviga pe internet.'
                  : qBrowserProgram === 'image_editor'
                  ? 'Paint este un editor de grafică pentru desenat și editat imagini, nu un program de navigat pe pagini web.'
                  : 'Un fișier text (.txt) conține doar text simplu needitat și nu poate deschide sau reda conexiuni de internet.'
              }
              explanationEn={
                isQBrowserCorrect
                  ? 'Correct! A web browser (Google Chrome, Firefox, Safari, Edge) is designed to interpret web documents and navigate the Internet.'
                  : qBrowserProgram === 'image_editor'
                  ? 'Paint is a graphics editing program for drawing images, not a client for fetching and rendering web pages.'
                  : 'A plain text (.txt) file only stores raw text and lacks the networking engine to browse websites.'
              }
            />
          )}

          <QuestionHint
            id="i5-browser-program"
            hintRo="Exemple de programe de navigare: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera (pag. 34)."
            hintEn="Examples of browsers include Google Chrome, Firefox, Safari, Edge."
          />
        </div>

        {/* Question 2: Adevărat sau Fals (Ex. 4, pag. 36) */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-md space-y-4">
          <p className="text-sm font-bold text-white">
            <span className="text-teal-400 font-mono mr-1.5">2.</span>
            {lang === 'en'
              ? 'Mark True (A) or False (F) for each statement (Manual p. 36, Ex. 4):'
              : 'Stabilește valoarea de adevăr (Adevărat – A sau Fals – F) pentru enunțurile din manual (pag. 36, Ex. 4):'}
          </p>

          {/* Statement a */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-slate-200">
                {lang === 'en' ? 'a) A website can consist of only one single web page.' : 'a) Un site web poate avea o singură pagină web.'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTfA('A');
                    sounds.playClick();
                  }}
                  className={`px-4 py-1.5 rounded-lg font-mono font-bold text-xs cursor-pointer border ${
                    tfA === 'A' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'en' ? 'True (A)' : 'Adevărat (A)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTfA('F');
                    sounds.playClick();
                  }}
                  className={`px-4 py-1.5 rounded-lg font-mono font-bold text-xs cursor-pointer border ${
                    tfA === 'F' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'en' ? 'False (F)' : 'Fals (F)'}
                </button>
                {tfA && (
                  <span className="ml-1">
                    {isTfACorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-rose-400 font-bold text-xs">✗</span>}
                  </span>
                )}
              </div>
            </div>
            {tfA && (
              <AnswerExplanation
                isCorrect={isTfACorrect}
                explanationRo={
                  isTfACorrect
                    ? 'Adevărat! Există site-uri (ex: pagini de prezentare sau landing pages) formate dintr-o singură pagină continuă.'
                    : 'De fapt enunțul este ADEVĂRAT: un site web poate fi compus din zeci de mii de pagini sau chiar dintr-o singură pagină unică.'
                }
                explanationEn={
                  isTfACorrect
                    ? 'True! Single-page websites host all content on a single continuous page.'
                    : 'In fact this statement is TRUE: a website can consist of thousands of linked pages or just a single page.'
                }
              />
            )}
          </div>

          {/* Statement b */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-slate-200">
                {lang === 'en' ? 'b) The Paint program can be used to build a web page.' : 'b) Pentru realizarea unei pagini web se poate folosi programul Paint.'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTfB('A');
                    sounds.playClick();
                  }}
                  className={`px-4 py-1.5 rounded-lg font-mono font-bold text-xs cursor-pointer border ${
                    tfB === 'A' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'en' ? 'True (A)' : 'Adevărat (A)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTfB('F');
                    sounds.playClick();
                  }}
                  className={`px-4 py-1.5 rounded-lg font-mono font-bold text-xs cursor-pointer border ${
                    tfB === 'F' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'en' ? 'False (F)' : 'Fals (F)'}
                </button>
                {tfB && (
                  <span className="ml-1">
                    {isTfBCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-rose-400 font-bold text-xs">✗</span>}
                  </span>
                )}
              </div>
            </div>
            {tfB && (
              <AnswerExplanation
                isCorrect={isTfBCorrect}
                explanationRo={
                  isTfBCorrect
                    ? 'Fals! Paint creează imagini de desenat, în timp ce paginile web se scriu folosind limbaje de marcare precum HTML.'
                    : 'De fapt enunțul este FALS: Paint este un instrument simplu de desen grafic, paginile web se realizează în HTML și editoare dedicate.'
                }
                explanationEn={
                  isTfBCorrect
                    ? 'False! Paint creates simple graphics images, while websites are structured using markup code such as HTML.'
                    : 'In fact this statement is FALSE: Paint is a simple graphics program, whereas web pages are authored in HTML.'
                }
              />
            )}
          </div>

          {/* Statement c */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-slate-200">
                {lang === 'en' ? 'c) Multiple hyperlinks can exist between web pages.' : 'c) Între paginile web pot exista mai multe hiperlinkuri.'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTfC('A');
                    sounds.playClick();
                  }}
                  className={`px-4 py-1.5 rounded-lg font-mono font-bold text-xs cursor-pointer border ${
                    tfC === 'A' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'en' ? 'True (A)' : 'Adevărat (A)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTfC('F');
                    sounds.playClick();
                  }}
                  className={`px-4 py-1.5 rounded-lg font-mono font-bold text-xs cursor-pointer border ${
                    tfC === 'F' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'en' ? 'False (F)' : 'Fals (F)'}
                </button>
                {tfC && (
                  <span className="ml-1">
                    {isTfCCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-rose-400 font-bold text-xs">✗</span>}
                  </span>
                )}
              </div>
            </div>
            {tfC && (
              <AnswerExplanation
                isCorrect={isTfCCorrect}
                explanationRo={
                  isTfCCorrect
                    ? 'Adevărat! Paginile web pot conține un număr oricât de mare de hiperlinkuri care trimit către alte pagini sau fișiere.'
                    : 'De fapt enunțul este ADEVĂRAT: hiperlinkurile sunt chiar baza legăturilor pe internet și pot fi oricât de multe pe o pagină.'
                }
                explanationEn={
                  isTfCCorrect
                    ? 'True! Web pages can contain countless hyperlinks directing users to external articles or documents.'
                    : 'In fact this statement is TRUE: hyperlinks are the foundation of web navigation and can exist in any quantity.'
                }
              />
            )}
          </div>

          <QuestionHint
            id="i5-true-false-hints"
            hintRo="Un site poate avea chiar și o singură pagină (landing page). Paint desenează imagini bitmap, nu scrie cod HTML pentru site-uri! Iar hiperlinkurile pot fi oricât de multe."
            hintEn="Web pages are written with HTML, not painted in Paint! Hyperlinks can connect countless pages together."
          />
        </div>
      </div>

      {/* Page Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={qBrowserProgram !== null || Boolean(tfA || tfB || tfC)}
        onProceed={handleProceed}
        onRetry={handleReset}
      />
    </div>
  );
};
