import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Cookie,
  FileText,
  Mail,
  Sparkles,
  Copy,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Gamepad2,
  Swords,
  Globe,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LegalTabType } from './LegalModal';
import { sounds } from '../utils/audio';

interface FooterProps {
  onOpenLegal: (tab: LegalTabType) => void;
  onNavigateToCatalog?: () => void;
  onNavigateToArcade?: () => void;
  onNavigateToDuel?: () => void;
  onNavigateToTeacher?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onNavigateToCatalog,
  onNavigateToArcade,
  onNavigateToDuel,
  onNavigateToTeacher,
}) => {
  const { lang, t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText('contact@arkyedu.com').then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
      });
    }
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-300 pt-10 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-8 border-b border-slate-800/70">
          {/* Column 1: Brand & Misiune */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🚀</span>
              <div>
                <span className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 font-['Fredoka']">
                  ArkyEdu
                  <span className="text-teal-400 font-sans text-xs px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 font-bold">
                    TIC V-VIII
                  </span>
                </span>
                <p className="text-[11px] text-slate-400 -mt-0.5">
                  arkyedu.com • Laborator Digital
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Interactive Computer Science & Coding platform for middle-school students (grades 5–8). Built with passion for digital literacy—100% free, no ads, no commercial fees, and zero private data harvesting.'
                : 'Platformă educativă și interactivă de TIC & Coding dedicată elevilor și profesorilor de gimnaziu (clasele V - VIII). Construită din pasiune pură pentru educație—100% gratuită, fără reclame, fără încasări și fără stocare de date private.'}
            </p>

            {/* Powered by Gigi badge requested by user */}
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-teal-300 font-mono font-bold text-xs shadow-sm hover:border-teal-400 transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                {t.poweredBy || 'Powered by Gigi'}
              </span>
            </div>
          </div>

          {/* Column 2: Cursuri & Programa TIC */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              {lang === 'en' ? 'Curriculum & Modules' : 'Materie & Module TIC'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToCatalog) onNavigateToCatalog();
                  }}
                  className="hover:text-teal-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{lang === 'en' ? 'Hardware & Architecture' : 'Arhitectură Hardware & Sisteme'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToCatalog) onNavigateToCatalog();
                  }}
                  className="hover:text-teal-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{lang === 'en' ? 'File Management & OS' : 'Managementul Fișierelor & SO'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToCatalog) onNavigateToCatalog();
                  }}
                  className="hover:text-teal-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{lang === 'en' ? 'Internet & Cyber Safety' : 'Internet, Web & Siguranță'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToCatalog) onNavigateToCatalog();
                  }}
                  className="hover:text-teal-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{lang === 'en' ? 'Algorithms & Scratch Coding' : 'Algoritmi & Programare Scratch'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToCatalog) onNavigateToCatalog();
                  }}
                  className="hover:text-teal-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{lang === 'en' ? 'Grade 6: Slides & Paint 3D' : 'Clasa a VI-a: Prezentări & Paint 3D'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToArcade) onNavigateToArcade();
                  }}
                  className="hover:text-teal-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Gamepad2 className="w-3 h-3 text-amber-400" />
                  <span>{lang === 'en' ? 'Arcade Games Hub' : 'Sală Mini-Jocuri Arcade'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Confidențialitate */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'en' ? 'Legal & Privacy' : 'Legal & Confidențialitate'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenLegal('about');
                  }}
                  className="hover:text-emerald-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left group"
                >
                  <Heart className="w-3 h-3 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'en' ? 'Our Story & Mission' : 'Despre Proiect & Poveste'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenLegal('privacy');
                  }}
                  className="hover:text-emerald-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'en' ? 'Privacy Policy & GDPR' : 'Confidențialitate & GDPR'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenLegal('cookies');
                  }}
                  className="hover:text-emerald-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Cookie className="w-3 h-3 text-amber-400" />
                  <span>{lang === 'en' ? 'Cookie Policy' : 'Politica de Cookie-uri'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenLegal('terms');
                  }}
                  className="hover:text-emerald-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3 h-3 text-cyan-400" />
                  <span>{lang === 'en' ? 'Terms of Use' : 'Termeni și Condiții'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenLegal('cookies');
                  }}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold underline decoration-teal-500/40 text-left pt-1 block"
                >
                  {lang === 'en' ? 'Manage Cookie Preferences' : 'Setări & Opțiuni Cookie'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Asistență */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'en' ? 'Contact & Feedback' : 'Contact & Asistență'}
            </h4>

            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'We welcome questions and feedback from teachers, students, and parents:'
                : 'Așteptăm cu drag mesaje și sugestii de la profesori, elevi și părinți:'}
            </p>

            {/* Email card with copy */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <a
                  href="mailto:contact@arkyedu.com"
                  className="text-xs font-mono font-bold text-teal-300 hover:text-teal-200 truncate"
                  title="Trimite email la contact@arkyedu.com"
                >
                  contact@arkyedu.com
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                  title="Copiază adresa de email"
                >
                  {copiedEmail ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenLegal('contact');
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Send Form Message' : 'Deschide Formular Contact'}</span>
              </button>
            </div>

            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'en' ? 'Safe for schools & minors' : 'Sigur pentru școli și minori'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left space-y-0.5">
            <p>
              © 2024 - 2026 <strong>ArkyEdu</strong> (arkyedu.com). {lang === 'en' ? 'All rights reserved.' : 'Toate drepturile rezervate.'}
            </p>
            <p className="text-[11px] text-slate-400">
              {t.footerSchoolCurriculum || 'Conform Programei Naționale de TIC pentru clasele V - VIII (OMEN 3393/2017).'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('about');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              {lang === 'en' ? 'About Story' : 'Povestea ArkyEdu'}
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('privacy');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              GDPR & Confidențialitate
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('cookies');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Cookie-uri
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('terms');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Termeni
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('contact');
              }}
              className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
            >
              contact@arkyedu.com
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
