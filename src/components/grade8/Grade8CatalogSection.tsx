import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Globe,
  Code2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Star,
  Award,
  CheckCircle2,
  GraduationCap,
  Layers,
  Database,
  BarChart3,
  Bot,
  Binary
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { GRADE_8_CURRICULA_MODULES } from '../../data/grade8Curricula';

interface Grade8CatalogSectionProps {
  onOpenCurriculaModal: (slugOrId: string) => void;
  onLaunchInteractiveLab?: (missionId: string) => void;
  completedMissions?: Record<string, boolean>;
}

export const GRADE_8_EN_MAP: Record<string, {
  title: string;
  shortTitle: string;
  unit: string;
  metaDescription: string;
  skills: string[];
}> = {
  g8_calc_a: {
    title: 'Spreadsheet Applications & MS Excel Workbook Interface',
    shortTitle: 'Excel Interface & Workbook',
    unit: 'Unit 1: Spreadsheets (p. 12–20)',
    metaDescription: 'Complete 8th Grade ICT curriculum: Electronic spreadsheets, Excel workbooks, Ribbon anatomy, cell addressing (A1, relative & absolute), and fundamental data types.',
    skills: ['1.1: Cell grid navigation', '1.2: Row & column sizing', '3.1: Data type formatting']
  },
  g8_calc_b: {
    title: 'Formulas & Mathematical / Statistical Functions (SUM, AVERAGE, MIN, MAX, IF)',
    shortTitle: 'Formulas & Functions',
    unit: 'Unit 1: Spreadsheets (p. 21–28)',
    metaDescription: 'Automated calculations: Equal sign (=) formula syntax, operator precedence, AutoSum, conditional IF tests, and absolute references ($A$1).',
    skills: ['1.2: Mathematical formulas', '1.3: Statistical functions', '3.1: Logical IF conditions']
  },
  g8_calc_c: {
    title: 'Data Visualization & 2D / 3D Charts (Column, Bar, Pie, Line)',
    shortTitle: 'Charts & Data Visualization',
    unit: 'Unit 1: Spreadsheets (p. 29–35)',
    metaDescription: 'Visual storytelling with data: Column, line and pie charts, axis configuration, data series selection, legend placement, and trend interpretation.',
    skills: ['1.3: Chart type selection', '2.1: Data series mapping', '3.2: Chart layout & styling']
  },
  g8_calc_d: {
    title: 'Tabular Databases, Multi-key Sorting, AutoFilters & Data Validation',
    shortTitle: 'Databases, Sorting & Filtering',
    unit: 'Unit 1: Spreadsheets (p. 32–35)',
    metaDescription: 'Manage structured lists: Excel as a flat database, ascending/descending sorting, multi-criteria AutoFilters, search filtering, and dropdown data validation rules.',
    skills: ['1.4: Multi-column sorting', '2.2: Contextual autofilters', '3.3: Data validation dropdowns']
  },
  g8_web_a: {
    title: 'Web Architecture, Semantic HTML5 Tags & Hyperlink Networks',
    shortTitle: 'Web Architecture & HTML5',
    unit: 'Unit 2: Web Pages (p. 36–45)',
    metaDescription: 'Understand how the web works: Client-server HTTP requests, semantic HTML5 structure (<header>, <nav>, <main>, <section>, <article>, <footer>), hyperlinks, and embedded media.',
    skills: ['1.1: Semantic HTML5 tags', '1.2: Hyperlink anchors', '3.1: Accessible structure']
  },
  g8_web_b: {
    title: 'Visual Web Design with Google Sites WYSIWYG & Interactive Widgets',
    shortTitle: 'Google Sites WYSIWYG Design',
    unit: 'Unit 2: Web Pages (p. 46–52)',
    metaDescription: 'Build modern websites without coding: Google Sites drag-and-drop layout, responsive multi-device design, image carousels, YouTube embeds, and interactive Google Maps.',
    skills: ['1.2: Drag-and-drop layouts', '2.1: Multimedia widgets', '3.2: Responsive preview']
  },
  g8_web_c: {
    title: 'Web Publishing, Custom Domains, HTTPS SSL Security & SEO Optimization',
    shortTitle: 'Publishing, HTTPS & SEO',
    unit: 'Unit 2: Web Pages (p. 53–58)',
    metaDescription: 'Launch your website into the world: DNS domains (.ro, .com), web hosting, HTTPS encryption certificates, privacy policies, and search engine optimization (SEO).',
    skills: ['1.3: Custom domain routing', '2.2: HTTPS SSL security', '3.3: SEO meta tags']
  },
  g8_algo_a: {
    title: 'C++ Review: Data Types, Arithmetic Operators & Complex Expressions',
    shortTitle: 'C++ Review & Expressions',
    unit: 'Unit 3: C++ Algorithms (p. 59–66)',
    metaDescription: 'Solidify algorithmic fundamentals: Code::Blocks setup, int/float/char/bool memory representation, arithmetic operators (+, -, *, /, %), and integer vs float division.',
    skills: ['1.1: Variable typing', '1.2: Arithmetic operations', '3.1: Precedence rules']
  },
  g8_algo_b: {
    title: 'Alternative Decision Structures: if / else, switch & Digit Extraction Logic',
    shortTitle: 'Decisions: if/else & switch',
    unit: 'Unit 3: C++ Algorithms (p. 67–74)',
    metaDescription: 'Multi-branch decision logic: Simple and nested if/else statements, compound boolean expressions (&&, ||, !), switch-case selection, and number digit inspection.',
    skills: ['1.2: Nested conditional branches', '2.1: Switch-case evaluation', '3.1: Digit testing']
  },
  g8_algo_c: {
    title: 'Repetitive Structures: while, do-while, for Loops & Numeric Sequences',
    shortTitle: 'Loops: while, do-while, for',
    unit: 'Unit 3: C++ Algorithms (p. 75–80)',
    metaDescription: 'Master algorithmic repetition: Pre-test while loops, post-test do-while loops, counted for loops, step modification, break/continue statements, and sequence generation.',
    skills: ['1.3: Loop condition checks', '2.2: Counter loop iteration', '3.2: Infinite loop prevention']
  },
  g8_algo_d: {
    title: 'Fundamental Classical Algorithms: Primality, GCD, Divisors & Fibonacci',
    shortTitle: 'Fundamental Algorithms',
    unit: 'Unit 3: C++ Algorithms (p. 81–85)',
    metaDescription: 'Elite competitive programming foundations: Primality checking (square root efficiency), Euclidean GCD algorithm, divisor counting, and the Fibonacci recurrence sequence.',
    skills: ['1.4: Prime number tests', '2.3: Euclidean GCD', '3.3: Fibonacci recurrence']
  },
  g8_algo_e: {
    title: 'Modular Subprograms, User-Defined Functions & C++ Integrator Project',
    shortTitle: 'Functions & Integrator Project',
    unit: 'Unit 3: C++ Algorithms (p. 86–88)',
    metaDescription: 'Modular software engineering: Function definitions, parameter passing (by value), return types (void vs typed), code reusability, and culminating middle-school graduation project.',
    skills: ['1.5: Function signatures', '2.4: Parameter passing', '3.4: Modular architecture']
  },
  g8_robot_a: {
    title: 'Educational Robotics, Arduino Uno Microcontrollers & Sensor Interfaces',
    shortTitle: 'Arduino Robotics & Sensors',
    unit: 'Unit 4: Robotics & IoT (p. 89–98)',
    metaDescription: 'Physical computing and microcontrollers: Arduino Uno pinout (digital IO, analog in, PWM), breadboard circuits, ultrasonic distance sensors (HC-SR04), and pulseIn() timing.',
    skills: ['1.1: Microcontroller pinouts', '2.1: Circuit breadboarding', '3.1: Sensor data processing']
  },
  g8_robot_b: {
    title: 'Smart Systems, Smart Home Automation & IoT Integrator Project',
    shortTitle: 'Smart Home & IoT Integrator',
    unit: 'Unit 4: Robotics & IoT (p. 99–108)',
    metaDescription: 'Design intelligent environments: Smart streetlights (LDR + PIR), MQ-2 gas detection alarms, SG90 servo automated barriers, I2C LCD displays, and non-blocking millis() multitasking.',
    skills: ['1.2: Sensor-actuator loops', '2.2: Smart home automation', '3.2: Non-blocking IoT code']
  }
};

export const Grade8CatalogSection: React.FC<Grade8CatalogSectionProps> = ({
  onOpenCurriculaModal,
  onLaunchInteractiveLab,
  completedMissions = {},
}) => {
  const { lang } = useLanguage();
  const [activeTabUnit, setActiveTabUnit] = useState<'all' | 'u1' | 'u2' | 'u3' | 'u4'>('all');

  const getUnitTag = (missionId: string = '') => {
    if (missionId.startsWith('g8_calc')) return 'u1';
    if (missionId.startsWith('g8_web')) return 'u2';
    if (missionId.startsWith('g8_algo')) return 'u3';
    return 'u4';
  };

  const filteredModules = activeTabUnit === 'all'
    ? GRADE_8_CURRICULA_MODULES
    : GRADE_8_CURRICULA_MODULES.filter(m => getUnitTag(m.missionId || m.id) === activeTabUnit);

  return (
    <div id="sectiune-misiuni-clasa-8" className="scroll-mt-6 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0 mt-0.5 sm:mt-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide text-balance">
              {lang === 'en' ? 'Practical ICT, C++ & Robotics Missions • 8th Grade (Art Klett)' : 'Misiuni Practice TIC, C++ & Robotică • Clasa a VIII-a (Manual Art Klett)'}
            </h2>
            <div className="text-xs text-emerald-400 font-mono font-medium mt-0.5">
              {lang === 'en' ? 'Official National Curriculum OMEN 3393/2017 & OM 5420/2024 • 14 Culminating Missions' : 'Programa Națională Oficială OMEN 3393/2017 & OM 5420/2024 • 14 Misiuni Finale Gimnaziu'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-xs font-mono font-semibold text-emerald-300 bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-500/35 whitespace-nowrap">
            {lang === 'en' ? 'Gymnasium Graduation Level' : 'Nivel Absolvire Gimnaziu'}
          </span>
        </div>
      </div>

      {/* 4 Major Units Roadmap Matrix Banner */}
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lang === 'en' ? '8th Grade Curriculum Roadmap (Manual Art Klett 2025, 108 pages)' : 'Harta Curriculară Clasa a VIII-a (Manual Oficial Art Klett 2025, 108 pagini)'}</span>
          </div>

          {/* Unit Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 p-1.5 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none max-w-full">
            <button
              type="button"
              onClick={() => {
                setActiveTabUnit('all');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 min-h-[34px] rounded-lg text-[11px] font-bold font-mono whitespace-nowrap shrink-0 transition cursor-pointer ${
                activeTabUnit === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {lang === 'en' ? 'All (14)' : 'Toate (14)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTabUnit('u1');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 min-h-[34px] rounded-lg text-[11px] font-bold font-mono whitespace-nowrap shrink-0 transition cursor-pointer ${
                activeTabUnit === 'u1'
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              U1: Excel (4)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTabUnit('u2');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 min-h-[34px] rounded-lg text-[11px] font-bold font-mono whitespace-nowrap shrink-0 transition cursor-pointer ${
                activeTabUnit === 'u2'
                  ? 'bg-sky-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              U2: Web (3)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTabUnit('u3');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 min-h-[34px] rounded-lg text-[11px] font-bold font-mono whitespace-nowrap shrink-0 transition cursor-pointer ${
                activeTabUnit === 'u3'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              U3: C++ (5)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTabUnit('u4');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 min-h-[34px] rounded-lg text-[11px] font-bold font-mono whitespace-nowrap shrink-0 transition cursor-pointer ${
                activeTabUnit === 'u4'
                  ? 'bg-amber-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {lang === 'en' ? 'U4: Robotics & IoT (2)' : 'U4: Robotică & IoT (2)'}
            </button>
          </div>
        </div>

        {/* Units Description Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/35 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">
                  {lang === 'en' ? 'Unit 1: Spreadsheets' : 'Unitatea 1: Calcul Tabelar'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Excel/Calc, relative/absolute cell references ($A$1), SUM, AVERAGE, IF, 2D/3D charts, sort & autofilter (p. 12–35)'
                  : 'Excel/Calc, adrese celule relative/absolute ($A$1), formule SUM, AVERAGE, IF, diagrame 2D/3D, sortare & autofiltrare (pag. 12–35)'}
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 tabular-nums">
              {lang === 'en' ? '4 MISSIONS (1A–1D)' : '4 MISIUNI (1A–1D)'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/35 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="font-bold text-white">
                  {lang === 'en' ? 'Unit 2: Web Pages' : 'Unitatea 2: Pagini Web'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Semantic HTML5, Google Sites WYSIWYG, image carousel, maps, responsive layout, HTTPS security & SEO (p. 36–58)'
                  : 'HTML5 semantic, Google Sites WYSIWYG, carusel imagini, hărți, layout responsive, securitate HTTPS & SEO (pag. 36–58)'}
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-400 tabular-nums">
              {lang === 'en' ? '3 MISSIONS (2A–2C)' : '3 MISIUNI (2A–2C)'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/35 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Code2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <span className="font-bold text-white">
                  {lang === 'en' ? 'Unit 3: C++ Algorithms' : 'Unitatea 3: Algoritmi C++'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Operators, if/switch decisions, while/for loops, digits, divisors, arrays & modular subprograms (p. 59–88)'
                  : 'Operatori, decizii if/switch, bucle while/for, cifre, divizori, vectori & subprograme modulare (pag. 59–88)'}
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 tabular-nums">
              {lang === 'en' ? '5 MISSIONS (3A–3E)' : '5 MISIUNI (3A–3E)'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/35 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="font-bold text-white">
                  {lang === 'en' ? 'Unit 4: Robotics & IoT' : 'Unitatea 4: Robotică & IoT'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Arduino Uno, HC-SR04, SG90 servos, Smart Streetlight LDR+PIR, MQ-2 gas alert, I2C LCD & multitasking millis() (p. 89–108)'
                  : 'Arduino Uno, HC-SR04, servomotoare SG90, Smart Streetlight LDR+PIR, alertă gaz MQ-2, LCD I2C & multitasking millis() (pag. 89–108)'}
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 tabular-nums">
              {lang === 'en' ? '2 MISSIONS (4A–4B)' : '2 MISIUNI (4A–4B)'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 14 Interactive Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredModules.map((module) => {
          const effectiveMissionId = module.missionId || module.id;
          const isDone = Boolean(completedMissions[effectiveMissionId] || completedMissions[module.id]);
          const enInfo = GRADE_8_EN_MAP[effectiveMissionId] || GRADE_8_EN_MAP[module.id];

          const displayUnit = (lang === 'en' && enInfo?.unit) ? enInfo.unit : module.unit;
          const displayTitle = (lang === 'en' && enInfo?.title) ? enInfo.title : module.title;
          const displayShortTitle = (lang === 'en' && enInfo?.shortTitle) ? enInfo.shortTitle : module.shortTitle;
          const displayMeta = (lang === 'en' && enInfo?.metaDescription) ? enInfo.metaDescription : module.metaDescription;

          return (
            <div
              key={module.id}
              className={`bg-slate-900/90 border-2 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden ${
                isDone
                  ? 'border-emerald-500/75 shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-emerald-500/60 hover:shadow-emerald-500/10'
              }`}
            >
              <div>
                {/* Top Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                    {module.icon}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {module.id.toUpperCase().replace('G8_', 'G8 • ')}
                    </span>
                    {isDone && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1 tabular-nums">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'en' ? 'Completed • 10' : 'Finalizat • Nota 10'}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 font-mono">
                  {displayUnit}
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white font-heading mb-1 group-hover:text-emerald-300 transition-colors text-balance">
                  {displayTitle}
                </h3>
                <div className="text-xs font-semibold text-slate-300 mb-2.5">
                  {displayShortTitle}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3.5">
                  {displayMeta}
                </p>

                {/* Key Skills Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {lang === 'en' && enInfo?.skills ? (
                    enInfo.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 font-mono"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    module.competencies.slice(0, 3).map((comp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 font-mono"
                      >
                        {comp.code}: {comp.description.slice(0, 48)}…
                      </span>
                    ))
                  )}
                </div>

                {/* Crisp Unboxed Metadata Row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-[11px] font-mono text-slate-400 tabular-nums">
                  <span className="inline-flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 20–25 min
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" /> {lang === 'en' ? '100 pts' : '100 pct'}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1 text-teal-300">
                    {isDone ? (
                      <>
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{lang === 'en' ? 'Diploma Earned' : 'Diplomă Obținută'}</span>
                      </>
                    ) : (
                      <span>{lang === 'en' ? '5 Pedagogical Levels' : '5 Niveluri Pedagogice'}</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenCurriculaModal(module.id)}
                  className="px-3.5 py-2.5 min-h-[42px] rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
                  title={lang === 'en' ? 'View curriculum, textbook theory and questions' : 'Vezi programa școlară, teoria și fișa didactică'}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lang === 'en' ? 'Syllabus & Theory' : 'Programă & Teorie'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onLaunchInteractiveLab?.(effectiveMissionId);
                  }}
                  className={`flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg whitespace-nowrap ${
                    isDone
                      ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 font-black'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{lang === 'en' ? 'Replay Mission' : 'Reia Misiunea'}</span>
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission' : 'Începe Misiunea'}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
