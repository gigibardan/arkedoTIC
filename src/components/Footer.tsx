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
  UserCheck,
  Award,
  ClipboardCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LegalTabType } from './LegalModal';
import { sounds } from '../utils/audio';
import { clearCachesAndReloadLatest } from '../utils/appUpdater';

interface FooterProps {
  onOpenLegal: (tab: LegalTabType) => void;
  onNavigateToCatalog?: () => void;
  onNavigateToArcade?: () => void;
  onNavigateToDuel?: () => void;
  onNavigateToCity?: () => void;
  onNavigateToTeacher?: () => void;
  onNavigateToSuperAdmin?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToGlossary?: () => void;
  onNavigateToSandbox?: () => void;
  onNavigateToCarnet?: () => void;
  onNavigateToEvaluare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onNavigateToCatalog,
  onNavigateToArcade,
  onNavigateToDuel,
  onNavigateToCity,
  onNavigateToTeacher,
  onNavigateToSuperAdmin,
  onNavigateToBlog,
  onNavigateToGlossary,
  onNavigateToSandbox,
  onNavigateToCarnet,
  onNavigateToEvaluare,
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
    { titleRo: 'Word & Tehnoredactare', titleEn: 'Word & Typography', url: '/cursuri/g7_word_a/', icon: '📝' },
    { titleRo: 'Tipografie & Machetare', titleEn: 'Page Layout & Typography', url: '/cursuri/g7_word_b/', icon: '📐' },
    { titleRo: 'Studio Audio WavePad', titleEn: 'WavePad Audio Studio', url: '/cursuri/g7_audio_a/', icon: '🎙️' },
    { titleRo: 'Montaj Video VideoPad', titleEn: 'VideoPad Video Editing', url: '/cursuri/g7_video_b/', icon: '🎬' },
    { titleRo: 'Cloud Docs & GIS Satelitar', titleEn: 'Cloud Docs & GIS Maps', url: '/cursuri/g7_gis_b/', icon: '🗺️' },
    { titleRo: 'Programare C++ & Roboți', titleEn: 'C++ Coding & Virtual Robots', url: '/cursuri/g7_cpp_a/', icon: '⚙️' },
  ];

  const coursesGrade8 = [
    { titleRo: 'Calcul Tabelar Excel & Funcții', titleEn: 'Excel Spreadsheets & Formulas', url: '/cursuri/g8_calc_c/', icon: '📊' },
    { titleRo: 'Web Design & Google Sites', titleEn: 'Web Design & Google Sites', url: '/cursuri/g8_web_a/', icon: '🌐' },
    { titleRo: 'Algoritmi C++ & Vectori', titleEn: 'C++ Algorithms & Arrays', url: '/cursuri/g8_algo_d/', icon: '💻' },
    { titleRo: 'Robotică Arduino Uno & Senzori', titleEn: 'Arduino Uno & Sensors', url: '/cursuri/g8_robot_a/', icon: '🤖' },
    { titleRo: 'Smart Home & IoT Integrator', titleEn: 'Smart Home & IoT Project', url: '/cursuri/g8_robot_b/', icon: '🏙️' },
    { titleRo: 'Educație Tehnologie Copii', titleEn: 'Tech Education Hub (RO/EN)', url: '/educatie-tehnologie-copii/', icon: '🚀' },
  ];

  return (
    <footer className="print:hidden border-t border-slate-800/80 bg-slate-950/95 text-slate-300 pt-12 pb-24 md:pb-10 px-4 sm:px-6 lg:px-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main Grid: balanced 1 -> 2 -> 3 -> 6 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8 pb-10 border-b border-slate-800/70">
          
          {/* Column 1: Brand, Misiune & Powered by */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl shrink-0" aria-hidden="true">🚀</span>
              <div>
                <div className="text-xl font-black text-white tracking-tight flex items-center gap-2 font-['Fredoka']">
                  <span>ArkyEdu</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  arkyedu.com · TIC V–VIII
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Educational & gamified Computer Science & Coding platform for middle-school students (grades 5–8). 100% free, no ads, no fees, fully aligned with national curriculum OMEN 3393/2017.'
                : 'Platformă educativă și interactivă de TIC & Coding dedicată elevilor și profesorilor de gimnaziu (clasele V - VIII). 100% gratuită, fără reclame, aliniată programei naționale OMEN 3393/2017.'}
            </p>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-mono font-bold text-teal-300">
                {t.poweredBy || 'Powered by Gigi'}
              </div>

              {/* Story link */}
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenLegal('about');
                }}
                className="text-xs text-slate-300 hover:text-teal-300 transition-colors flex items-center gap-1.5 text-left py-1 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{lang === 'en' ? 'Read our Story & Mission →' : 'Povestea & Misiunea ArkyEdu →'}</span>
              </button>
            </div>
          </div>

          {/* Column 2: Hub & Activități Interactive (In-App) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Platform & Activities' : 'Platformă & Activități'}</span>
            </h4>
            <ul className="space-y-1 text-xs">
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToCatalog) onNavigateToCatalog();
                  }}
                  className="hover:text-teal-300 text-slate-300 transition-colors flex items-center gap-2 text-left w-full group py-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{lang === 'en' ? 'Course Catalog & Lessons' : 'Catalog Module & Lecții'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToArcade) onNavigateToArcade();
                  }}
                  className="hover:text-amber-300 text-slate-300 transition-colors flex items-center gap-2 text-left w-full group py-1 cursor-pointer"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{lang === 'en' ? 'Arcade Hub (28 Games)' : 'Sala Arcade (28 Mini-jocuri)'}</span>
                  <span className="text-[10px] text-emerald-300 font-semibold ml-auto whitespace-nowrap">
                    Pac-Man
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToDuel) onNavigateToDuel();
                  }}
                  className="hover:text-cyan-300 text-slate-300 transition-colors flex items-center gap-2 text-left w-full group py-1 cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{lang === 'en' ? '1v1 Duel Arena (20+ Modes)' : 'Arena Duel 1v1 (20+ Moduri)'}</span>
                </button>
              </li>
              {onNavigateToCity && (
                <li>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onNavigateToCity();
                    }}
                    className="hover:text-emerald-300 text-slate-300 transition-colors flex items-center gap-2 text-left w-full group py-1 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{lang === 'en' ? 'Cyber City (Digital Town)' : 'Orașul Digital TIC'}</span>
                  </button>
                </li>
              )}
              <li>
                <a
                  href={lang === 'en' ? '/blog/en/' : '/blog/'}
                  onClick={(e) => {
                    if (onNavigateToBlog) {
                      e.preventDefault();
                      sounds.playClick();
                      onNavigateToBlog();
                    }
                  }}
                  className="hover:text-teal-300 text-slate-200 transition-colors flex items-center gap-2 text-left w-full group py-1 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{lang === 'en' ? 'ICT Blog & Study Guides' : 'Blog & Ghiduri TIC'}</span>
                </a>
              </li>
              <li>
                <a
                  href={lang === 'en' ? '/glosar/en/' : '/glosar/'}
                  onClick={(e) => {
                    if (onNavigateToGlossary) {
                      e.preventDefault();
                      sounds.playClick();
                      onNavigateToGlossary();
                    }
                  }}
                  className="hover:text-cyan-300 text-slate-200 transition-colors flex items-center gap-2 text-left w-full group py-1 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{lang === 'en' ? 'ICT & CS Glossary (A–Z)' : 'Glosar TIC & Coding (A–Z)'}</span>
                </a>
              </li>
              {onNavigateToCarnet && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onNavigateToCarnet();
                    }}
                    className="hover:text-amber-300 text-slate-200 transition-colors flex items-center gap-2 text-left w-full group py-1 font-semibold cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{lang === 'en' ? 'My Digital Portfolio (Grades & Diplomas)' : 'Carnetul meu Digital (Note & Diplome)'}</span>
                  </button>
                </li>
              )}
              {onNavigateToEvaluare && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onNavigateToEvaluare();
                    }}
                    className="hover:text-cyan-300 text-slate-200 transition-colors flex items-center gap-2 text-left w-full group py-1 font-semibold cursor-pointer"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{lang === 'en' ? 'Quick Eval Simulator (Grades 5–8)' : 'Test Rapid & Simulare Evaluare (V–VIII)'}</span>
                  </button>
                </li>
              )}
              <li>
                <a
                  href={lang === 'en' ? '/sandbox/en/' : '/sandbox/'}
                  onClick={(e) => {
                    if (onNavigateToSandbox) {
                      e.preventDefault();
                      sounds.playClick();
                      onNavigateToSandbox();
                    }
                  }}
                  className="hover:text-emerald-300 text-slate-200 transition-colors flex items-center gap-2 text-left w-full group py-1 font-semibold"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lang === 'en' ? 'Code Sandbox (C++ / Python / HTML)' : 'Sandbox Cod C++ / Python / HTML5'}</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateToTeacher) onNavigateToTeacher();
                  }}
                  className="hover:text-indigo-300 text-slate-200 transition-colors flex items-center gap-2 text-left w-full group py-1 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
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
                    className="hover:text-purple-300 text-slate-200 hover:text-white transition-colors flex items-center gap-2 text-left w-full group text-xs py-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
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

          {/* Column 5: Ghiduri Curriculare Clasa a VII-a & a VIII-a */}
          <div className="space-y-4">
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <span className="text-sm">🔬</span>
                {lang === 'en' ? 'Grade 7 & 8 Curriculum' : 'Programe Clasa VII & VIII'}
              </h4>
              <ul className="space-y-1.5 text-xs">
                {coursesGrade7.slice(0, 3).map((c) => (
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
                {coursesGrade8.map((c) => (
                  <li key={c.url}>
                    <a
                      href={c.url}
                      className="text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 py-0.5 group"
                      title={lang === 'en' ? c.titleEn : c.titleRo}
                    >
                      <span className="text-xs opacity-80 group-hover:scale-110 transition-transform">{c.icon}</span>
                      <span className="truncate">{lang === 'en' ? c.titleEn : c.titleRo}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
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
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenLegal('privacy');
                  }}
                  className="hover:text-emerald-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left py-0.5 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{lang === 'en' ? 'Privacy Policy & GDPR' : 'Confidențialitate & GDPR'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenLegal('cookies');
                  }}
                  className="hover:text-emerald-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left py-0.5 cursor-pointer"
                >
                  <Cookie className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{lang === 'en' ? 'Cookie Policy & Options' : 'Politica de Cookie-uri'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenLegal('terms');
                  }}
                  className="hover:text-emerald-300 text-slate-400 transition-colors flex items-center gap-1.5 text-left py-0.5 cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-cyan-400 shrink-0" />
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
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 min-w-[36px] min-h-[36px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                  title={lang === 'en' ? 'Copy email address' : 'Copiază adresa de email'}
                  aria-label={lang === 'en' ? 'Copy email address' : 'Copiază adresa de email'}
                >
                  {copiedEmail ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenLegal('contact');
                }}
                className="w-full py-2 min-h-[38px] px-3 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Send Form Message' : 'Deschide Formular Contact'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'en' ? 'Safe for schools & minors (No ads)' : 'Sigur pentru școli și elevi'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Curricular note & Technical / AI links */}
        <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-slate-300">
          <div className="text-center lg:text-left space-y-1">
            <p className="text-slate-200">
              © 2024 - 2026 <strong className="text-white">ArkyEdu</strong> (arkyedu.com). {lang === 'en' ? 'All rights reserved.' : 'Toate drepturile rezervate.'}
            </p>
            <p className="text-[11px] text-slate-400">
              {t.footerSchoolCurriculum || 'Conform Programei Naționale de TIC pentru clasele V - VIII (OMEN 3393/2017) și Cadrului DigComp.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-3 gap-y-2 text-xs">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('about');
              }}
              className="text-slate-300 hover:text-white transition-colors py-1.5 cursor-pointer whitespace-nowrap"
            >
              {lang === 'en' ? 'About Story' : 'Povestea ArkyEdu'}
            </button>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('privacy');
              }}
              className="text-slate-300 hover:text-white transition-colors py-1.5 cursor-pointer whitespace-nowrap"
            >
              GDPR
            </button>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('cookies');
              }}
              className="text-slate-300 hover:text-white transition-colors py-1.5 cursor-pointer whitespace-nowrap"
            >
              Cookie-uri
            </button>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('terms');
              }}
              className="text-slate-300 hover:text-white transition-colors py-1.5 cursor-pointer whitespace-nowrap"
            >
              Termeni
            </button>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLegal('contact');
              }}
              className="text-teal-300 hover:text-teal-200 transition-colors font-medium py-1.5 cursor-pointer whitespace-nowrap"
            >
              Contact
            </button>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-emerald-200 transition-colors font-mono text-[11px] py-1.5 whitespace-nowrap"
              title="Context structurat pentru LLM & Agenți AI (llmstxt.org)"
            >
              llms.txt
            </a>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <a
              href="/llms-full.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200 transition-colors font-mono text-[11px] py-1.5 whitespace-nowrap"
              title="Documentație completă pentru modele de limbaj"
            >
              llms-full.txt
            </a>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors text-xs py-1.5 whitespace-nowrap"
            >
              Sitemap
            </a>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors text-xs py-1.5 whitespace-nowrap"
            >
              Robots.txt
            </a>
            <button
              onClick={() => {
                sounds.playSuccess();
                void clearCachesAndReloadLatest();
              }}
              className="text-amber-300 hover:text-white font-mono text-xs bg-amber-500/15 hover:bg-amber-500/30 px-3 py-1.5 min-h-[38px] rounded-xl border border-amber-500/40 flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95 touch-manipulation whitespace-nowrap"
              title={lang === 'en' ? 'Clear cache and reload latest version' : 'Curăță memoria cache și reîncarcă cea mai nouă versiune'}
            >
              <span aria-hidden="true">🔄</span>
              <span className="font-bold">{lang === 'en' ? 'Update App' : 'Actualizează App'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
