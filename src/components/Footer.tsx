import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Cookie,
  FileText,
  Mail,
  Copy,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Gamepad2,
  Swords,
  Globe,
  Lock,
  ChevronRight,
  Building2,
  Bot,
  FileCode,
  Sparkles,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LegalTabType } from './LegalModal';
import { sounds } from '../utils/audio';

interface FooterProps {
  onOpenLegal: (tab: LegalTabType) => void;
  onNavigateToCatalog?: () => void;
  onNavigateToArcade?: () => void;
  onNavigateToDuel?: () => void;
  onNavigateToCity?: () => void;
  onNavigateToTeacher?: () => void;
  onNavigateToSuperAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onNavigateToCatalog,
  onNavigateToArcade,
  onNavigateToDuel,
  onNavigateToCity,
  onNavigateToTeacher,
  onNavigateToSuperAdmin,
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

  const coursesGrade5 = [
    { titleRo: 'Hardware & Arhitectură', titleEn: 'Hardware & Architecture', url: '/cursuri/hardware/', icon: '🖥️' },
    { titleRo: 'Fișiere & Sisteme de Operare', titleEn: 'Files & Operating Systems', url: '/cursuri/fisiere-so/', icon: '📁' },
    { titleRo: 'Internet & Navigare Sigură', titleEn: 'Internet & Safe Browsing', url: '/cursuri/internet-siguranta/', icon: '🌐' },
    { titleRo: 'Editoare de Text & Tehnoredactare', titleEn: 'Text Editors & Typing', url: '/cursuri/editoare-text/', icon: '📝' },
    { titleRo: 'Gândire Algoritmică & Secvențe', titleEn: 'Algorithmic Thinking', url: '/cursuri/algoritmi/', icon: '🔀' },
    { titleRo: 'Inițiere Scratch (Clasa a V-a)', titleEn: 'Intro to Scratch (Grade 5)', url: '/cursuri/scratch/', icon: '🐱' },
  ];

  const coursesGrade6 = [
    { titleRo: 'Prezentări Multimedia & Slide-uri', titleEn: 'Presentations & Slides', url: '/cursuri/prezentari-slides/', icon: '📊' },
    { titleRo: 'Grafică Digitală & Paint 3D', titleEn: 'Digital Graphics & Paint 3D', url: '/cursuri/paint-3d/', icon: '🎨' },
    { titleRo: 'Malware & Securitate Cibernetică', titleEn: 'Malware & Cyber Safety', url: '/cursuri/malware-securitate/', icon: '🛡️' },
    { titleRo: 'Servicii E-mail & Netichetă', titleEn: 'Email Services & Netiquette', url: '/cursuri/email-neticheta/', icon: '✉️' },
    { titleRo: 'Scratch VI: Bucle Condiționate', titleEn: 'Scratch VI: Conditional Loops', url: '/cursuri/algoritmi-bucle-scratch-1/', icon: '🔄' },
    { titleRo: 'Design Diapozitive & Animații', titleEn: 'Slide Transitions & Animations', url: '/cursuri/prezentari-slides-2/', icon: '🎬' },
  ];

  const coursesGrade7 = [
    { titleRo: 'Word & Tehnoredactare', titleEn: 'Word & Typography', url: '/cursuri/word-tehnoredactare-interfata/', icon: '📝' },
    { titleRo: 'Tipografie & Machetare', titleEn: 'Page Layout & Typography', url: '/cursuri/machetare-pagina-tipografie/', icon: '📐' },
    { titleRo: 'Studio Audio WavePad', titleEn: 'WavePad Audio Studio', url: '/cursuri/wavepad-editare-audio-digitala/', icon: '🎙️' },
    { titleRo: 'Montaj Video VideoPad', titleEn: 'VideoPad Video Editing', url: '/cursuri/videopad-montaj-video-multitrack/', icon: '🎬' },
    { titleRo: 'Cloud Docs & GIS Satelitar', titleEn: 'Cloud Docs & GIS Maps', url: '/cursuri/sisteme-informationale-geografice-gis/', icon: '🗺️' },
    { titleRo: 'Programare C++ & Roboți', titleEn: 'C++ Coding & Virtual Robots', url: '/cursuri/programare-cpp-codeblocks-variabile/', icon: '⚙️' },
  ];

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95 text-slate-300 pt-12 pb-24 md:pb-10 px-4 sm:px-6 lg:px-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main Grid: 6 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-6 pb-10 border-b border-slate-800/70">
          
          {/* Column 1: Brand, Misiune & Powered by */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-bounce">🚀</span>
              <div>
                <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5 font-['Fredoka']">
                  ArkyEdu
                  <span className="text-teal-400 font-sans text-[11px] px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 font-bold">
                    TIC V-VIII
                  </span>
                </span>
                <p className="text-[11px] text-slate-400 -mt-0.5 font-mono">
                  arkyedu.com • Laborator Digital
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Educational & gamified Computer Science & Coding platform for middle-school students (grades 5–8). 100% free, no ads, no fees, fully aligned with national curriculum OMEN 3393/2017.'
                : 'Platformă educativă și interactivă de TIC & Coding dedicată elevilor și profesorilor de gimnaziu (clasele V - VIII). 100% gratuită, fără reclame, aliniată programei naționale OMEN 3393/2017.'}
            </p>

            <div className="space-y-2 pt-1">
              {/* Powered by Gigi badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-teal-500/30 text-teal-300 font-mono font-bold text-xs shadow-sm hover:border-teal-400 transition-colors cursor-default">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  {t.poweredBy || 'Powered by Gigi'}
                </span>
              </div>

              {/* Story link */}
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenLegal('about');
                }}
                className="text-xs text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 text-left"
              >
                <Heart className="w-3 h-3 text-rose-400" />
                <span>{lang === 'en' ? 'Read our Story & Mission →' : 'Povestea & Misiunea ArkyEdu →'}</span>
              </button>
            </div>
          </div>

          {/* Column 2: Hub & Activități Interactive (In-App) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Platform & Activities' : 'Platformă & Activități'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToCatalog) onNavigateToCatalog();
                  }}
                  className="hover:text-teal-300 text-slate-300 transition-colors flex items-center gap-1.5 text-left w-full group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'en' ? 'Course Catalog & Lessons' : 'Catalog Module & Lecții'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToArcade) onNavigateToArcade();
                  }}
                  className="hover:text-amber-300 text-slate-300 transition-colors flex items-center gap-1.5 text-left w-full group"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'en' ? 'Arcade Hub (20 Games)' : 'Sala Arcade (20 Mini-jocuri)'}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30 font-bold ml-auto">
                    Snake 🐍
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToDuel) onNavigateToDuel();
                  }}
                  className="hover:text-cyan-300 text-slate-300 transition-colors flex items-center gap-1.5 text-left w-full group"
                >
                  <Swords className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'en' ? '1v1 Multiplayer Duel Arena' : 'Arena Duel 1v1 Multiplayer'}</span>
                </button>
              </li>
              {onNavigateToCity && (
                <li>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onNavigateToCity();
                    }}
                    className="hover:text-emerald-300 text-slate-300 transition-colors flex items-center gap-1.5 text-left w-full group"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>{lang === 'en' ? 'Cyber City (Digital Town)' : 'Orașul Digital TIC'}</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToTeacher) onNavigateToTeacher();
                  }}
                  className="hover:text-indigo-300 text-slate-300 transition-colors flex items-center gap-1.5 text-left w-full group"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'en' ? 'Teacher Portal & Gradebook' : 'Portal Profesor & Catalog'}</span>
                </button>
              </li>
              {onNavigateToSuperAdmin && (
                <li>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onNavigateToSuperAdmin();
                    }}
                    className="hover:text-purple-300 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 text-left w-full group text-[11px]"
                  >
                    <UserCheck className="w-3 h-3 text-purple-400" />
                    <span>{lang === 'en' ? 'School Admin Panel' : 'Administrare Școli & Clase'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Ghiduri Curriculare Clasa a V-a (SEO Statice) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span className="text-sm">📘</span>
              {lang === 'en' ? 'Grade 5 Curriculum' : 'Programa Clasa a V-a'}
            </h4>
            <ul className="space-y-1.5 text-xs">
              {coursesGrade5.map((c) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 py-0.5 group"
                    title={lang === 'en' ? c.titleEn : c.titleRo}
                  >
                    <span className="text-xs opacity-80 group-hover:scale-110 transition-transform">{c.icon}</span>
                    <span className="truncate">{lang === 'en' ? c.titleEn : c.titleRo}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Ghiduri Curriculare Clasa a VI-a (SEO Statice) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span className="text-sm">📗</span>
              {lang === 'en' ? 'Grade 6 Curriculum' : 'Programa Clasa a VI-a'}
            </h4>
            <ul className="space-y-1.5 text-xs">
              {coursesGrade6.map((c) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 py-0.5 group"
                    title={lang === 'en' ? c.titleEn : c.titleRo}
                  >
                    <span className="text-xs opacity-80 group-hover:scale-110 transition-transform">{c.icon}</span>
                    <span className="truncate">{lang === 'en' ? c.titleEn : c.titleRo}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Ghiduri Curriculare Clasa a VII-a (C++, Audio, GIS, Roboți) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span className="text-sm">🔬</span>
              {lang === 'en' ? 'Grade 7 Curriculum' : 'Programa Clasa a VII-a'}
            </h4>
            <ul className="space-y-1.5 text-xs">
              {coursesGrade7.map((c) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-0.5 group"
                    title={lang === 'en' ? c.titleEn : c.titleRo}
                  >
                    <span className="text-xs opacity-80 group-hover:scale-110 transition-transform">{c.icon}</span>
                    <span className="truncate">{lang === 'en' ? c.titleEn : c.titleRo}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: Legal, Siguranță & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'en' ? 'Legal & Contact' : 'Legal & Contact'}
            </h4>

            <ul className="space-y-2 text-xs">
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
                  <span>{lang === 'en' ? 'Cookie Policy & Options' : 'Politica de Cookie-uri'}</span>
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
            </ul>

            {/* Email Contact Card */}
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
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Send Form Message' : 'Deschide Formular Contact'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'en' ? 'Safe for schools & minors (No ads)' : 'Sigur pentru școli și elevi'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Curricular note & Technical / AI links */}
        <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left space-y-0.5">
            <p>
              © 2024 - 2026 <strong>ArkyEdu</strong> (arkyedu.com). {lang === 'en' ? 'All rights reserved.' : 'Toate drepturile rezervate.'}
            </p>
            <p className="text-[11px] text-slate-400">
              {t.footerSchoolCurriculum || 'Conform Programei Naționale de TIC pentru clasele V - VIII (OMEN 3393/2017) și Cadrului DigComp.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
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
              Contact
            </button>
            <span className="text-slate-700">•</span>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors font-mono text-[11px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
              title="Context structurat pentru LLM & Agenți AI (llmstxt.org)"
            >
              llms.txt (AI)
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="/llms-full.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors font-mono text-[11px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
              title="Documentație completă pentru modele de limbaj"
            >
              llms-full.txt
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors text-[11px]"
            >
              Sitemap
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors text-[11px]"
            >
              Robots.txt
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
