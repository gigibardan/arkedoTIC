import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  KeyRound, 
  UserCheck, 
  Flame, 
  Trophy, 
  ShieldCheck, 
  Calculator, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  RefreshCw,
  Database,
  Lock,
  Gamepad2,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TeacherHelpGuide: React.FC = () => {
  const { lang } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const isEn = lang === 'en';

  const faqs = isEn
    ? [
        {
          q: 'How do students log in when they change computers between hours?',
          a: 'Students simply click "Sign In" (Autentificare) in the top Access Pass, enter their unique username and chosen password. All their saved records, XP, completed lessons, and high scores automatically restore on the new computer from the Firestore cloud.'
        },
        {
          q: 'What should I do if a student forgot their password?',
          a: 'As teacher/admin, go to the "Student Accounts" tab in this Teacher Portal. Find the student, click "Reset Password", type a new temporary password (e.g. 1234), and save. The student can immediately log in with it.'
        },
        {
          q: 'Can students or the teacher change an inappropriate or misspelled username?',
          a: 'Yes! In the "Student Accounts" tab, click "Edit Name" next to any student. The system ensures the new username is not already taken and updates it across the entire classroom database.'
        },
        {
          q: 'How is the Lesson XP calculated? Does it prevent speed-running or clicking through?',
          a: 'Yes! Lesson XP uses the Mastery XP Formula: Base Score + Time-Reflective Reading Bonus. If a student finishes in under 25 seconds (speed-clicking without reading), they receive 0 bonus XP. Taking 90–600 seconds with steady reading yields an extra +25 XP mastery bonus!'
        },
        {
          q: 'How is the total Arcade Game XP calculated?',
          a: 'The Arcade XP is the cumulative sum of personal bests across all 10 mini-games (Speed Typing, Mouse Agility, 2048 Binary, PC Builder, Cyber Detective, File Organizer, Binary Factory, Algorithm Maze, Firewall Defender, and RGB Pixel Master).'
        }
      ]
    : [
        {
          q: 'Cum se conectează elevii când își schimbă calculatorul de la o oră la alta?',
          a: 'Elevii apasă pe "Autentificare" în Legitimația de sus (Access Pass), introduc numele de utilizator și parola setată inițial. Toate realizările, punctele XP, lecțiile parcurse și recordurile la jocuri se transferă instant pe noul calculator direct din cloud Firestore.'
        },
        {
          q: 'Ce fac dacă un elev și-a uitat parola?',
          a: 'În calitate de profesor/administrator, intrați în tabul "Gestiune Conturi Elevi" din acest Portal. Căutați elevul în listă, apăsați pe "Resetează Parola", introduceți o parolă temporară simplă (ex. 1234) și salvați. Elevul se poate autentifica pe loc.'
        },
        {
          q: 'Cum pot schimba numele unui elev dacă a greșit la înregistrare?',
          a: 'În tabul "Gestiune Conturi Elevi", apăsați pe "Modifică Nume". Sistemul verifică unicitatea noului nume și îl actualizează în tot catalogul și în clasamentul public.'
        },
        {
          q: 'Cum se calculează punctajul la lecții și cum prevenim click-urile rapide fără citire?',
          a: 'Sistemul folosește Formula "Mastery XP": Punctaj de bază (până la 100 pct) + Bonus de citire și aprofundare (până la +25 pct). Dacă un elev termină o lecție în sub 25 de secunde (dând doar click-uri rapide), nu primește bonus. Pentru un parcurs normal și atent (90-600s), primește +25 XP bonus!'
        },
        {
          q: 'Cum se calculează clasamentul general și punctajul pe jocuri?',
          a: 'Punctajul Total Arcade este suma recordurilor personale la toate cele 10 jocuri arcade. Punctajul Total General (XP Total) combină punctajul din cele 10 jocuri cu punctajul obținut la lecțiile practice TIC.'
        }
      ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header card */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-2xl">
            📖
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold font-mono">
              <Sparkles className="w-3 h-3" />
              <span>{isEn ? 'Teacher & Colleague Guide' : 'Ghid de Utilizare pentru Cadre Didactice'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
              {isEn ? 'Platform Architecture, Student Accounts & Scoring Rules' : 'Arhitectura Sistemului, Gestiunea Elevilor & Calculul Notării'}
            </h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          {isEn
            ? 'This guide explains how student cloud profiles work across school lab computers, how to manage credentials, and the exact mathematical formulas behind classroom top rankings.'
            : 'Acest ghid explică modul de funcționare a conturilor în laboratorul de informatică, resetarea parolelor, sincronizarea cloud și formulele exacte de punctaj pentru elevi.'}
        </p>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3.5">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span>{isEn ? 'Lab Computer Mobility' : 'Mobilitate între Calculatoare'}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isEn
                ? 'Students change desks frequently. With Firebase Firestore, their profile, diplomas, lesson status, and arcade records are tied to their username, not the physical machine.'
                : 'Elevii își schimbă adesea calculatorul la ore. Prin baza de date Firebase, progresul, diplomele și recordurile la jocuri sunt legate de numele de utilizator, nu de calculatorul fizic.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-teal-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>{isEn ? 'SHA-256 Hashed Passwords' : 'Parole Criptate SHA-256'}</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3.5">
              <KeyRound className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span>{isEn ? 'Teacher Master Admin' : 'Control Total Profesor'}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isEn
                ? 'Lost password? Misspelled name? Teachers can reset credentials or edit student usernames instantly from the Teacher Portal without requiring emails or phone numbers.'
                : 'Elevul a uitat parola sau a scris greșit numele? Profesorul poate reseta parola pe loc sau schimba numele direct din portal, fără a fi nevoie de adrese de email sau telefoane.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isEn ? 'Instant Reset & Rename' : 'Resetare & Redenumire Imediată'}</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3.5">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span>{isEn ? 'Mastery XP Formula' : 'Formula XP & Anti-Speedrun'}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isEn
                ? 'Prevents speed-clicking. Students must spend thoughtful time reading practical guides to earn the +25 XP mastery bonus. Refreshes also preserve timer elapsed seconds.'
                : 'Descurajează click-urile haotice. Elevii trebuie să citească și să exerseze conștient pentru bonusul de +25 XP. Reîmprospătarea paginii reia cronometrul de unde a rămas.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-indigo-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{isEn ? 'Persistent Elapsed Timer' : 'Cronometru Păstrat la Refresh'}</span>
          </div>
        </div>
      </div>

      {/* Detailed Scoring System Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>{isEn ? 'Detailed Scoring & Ranking Mechanics' : 'Mecanisme Detaliate de Notare & Calcul Punctaj'}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
              <GraduationCap className="w-4 h-4" />
              <span>{isEn ? '1. Lessons & Missions (Misiuni Practice)' : '1. Lecții & Misiuni Practice TIC'}</span>
            </div>
            <p className="leading-relaxed">
              {isEn
                ? 'Each interactive lesson consists of interactive laboratory stages (5 to 8 levels). Score is awarded progressively upon completing tasks.'
                : 'Fiecare misiune conține provocări practice (5 până la 8 niveluri). Punctajul se acumulează pe măsură ce elevul rezolvă etapele practice.'}
            </p>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono space-y-1 text-[11px]">
              <div className="text-emerald-400 font-bold">Total Lesson XP = Base Score + Reading Bonus</div>
              <div className="text-slate-400">• &lt; 25 secunde: 0 bonus (suspect de click rapid)</div>
              <div className="text-slate-400">• 40 - 90 secunde: +10 puncte bonus</div>
              <div className="text-emerald-300">• 90 - 600 secunde: +25 puncte bonus de studiu aprofundat</div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
              <Gamepad2 className="w-4 h-4" />
              <span>{isEn ? '2. Arcade Games (10 Jocuri Arcade)' : '2. Jocuri Arcade Educative (10 Jocuri)'}</span>
            </div>
            <p className="leading-relaxed">
              {isEn
                ? 'Covers typing, mouse reflexes, binary math, cybersecurity, computer architecture, RGB color theory, algorithms, and firewalls.'
                : 'Include viteză la tastatură, reflexe mouse, matematică binară, siguranță pe net, asamblare calculator, pixeli RGB, algoritmi și securitate.'}
            </p>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono space-y-1 text-[11px]">
              <div className="text-indigo-400 font-bold">Total Arcade XP = Sum of 10 Personal Records</div>
              <div className="text-slate-400">• Viteză Tastare (WPM) + Mouse (Scor) + 2048 Binar</div>
              <div className="text-slate-400">• PC Builder + Cyber Detective + Organizator Fișiere</div>
              <div className="text-indigo-300">• Fabrica Binară + Labirint + Firewall + Pixeli RGB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>{isEn ? 'Frequently Asked Questions (Colleague Reference)' : 'Întrebări Frecvente & Soluționare Situații la Clasă'}</span>
        </h4>

        <div className="divide-y divide-slate-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-semibold text-sm text-slate-200 hover:text-teal-300 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
