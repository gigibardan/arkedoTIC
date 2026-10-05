import React from 'react';
import { GameLevel } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProgressBarProps {
  currentLevel: GameLevel;
  courseId?: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2';
}

const HARDWARE_STAGE_PERCENTS = [20, 40, 60, 80, 95, 100];
const FILES_STAGE_PERCENTS = [14, 28, 42, 57, 71, 85, 95, 100];
const INTERNET1_STAGE_PERCENTS = [16, 33, 50, 66, 83, 95, 100];
const INTERNET2_STAGE_PERCENTS = [16, 33, 50, 66, 83, 95, 100];
const TEXT1_STAGE_PERCENTS = [14, 28, 42, 57, 71, 85, 95, 100];
const TEXT2_STAGE_PERCENTS = [14, 28, 42, 57, 71, 85, 95, 100];
const ALGO1_STAGE_PERCENTS = [14, 28, 42, 57, 71, 85, 95, 100];
const ALGO2_STAGE_PERCENTS = [14, 28, 42, 57, 71, 85, 95, 100];
const SCRATCH1_STAGE_PERCENTS = [14, 28, 42, 57, 71, 85, 95, 100];
const SCRATCH2_STAGE_PERCENTS = [14, 28, 42, 57, 71, 85, 95, 100];

const SCRATCH1_STAGES_RO = [
  { emoji: '🐱', name: 'Limbajul Vizual Scratch & MIT Media Lab (pag. 72-73)' },
  { emoji: '🖥️', name: 'Interfața Scratch 3.0 & Sistemul de Coordonate (pag. 72-75)' },
  { emoji: '🎨', name: 'Cele 9 Categorii de Blocuri Colorate (pag. 74-76)' },
  { emoji: '🤖', name: 'Proiectul „RoboTIC se prezintă” - Scripturi Liniare (pag. 76-80)' },
  { emoji: '📦', name: 'Variabile în Scratch: Creare, Atribuire & Monitoare (pag. 81-84)' },
  { emoji: '🧮', name: 'Proiectul „RoboOperații” - Operatori & Alăturare Text (pag. 84-88)' },
  { emoji: '✒️', name: 'Extensia Creion & Desen Geometrie Dinamică (pag. 88-90)' },
  { emoji: '🏆', name: 'Junior Scratch Master & Animator Certificat!' },
];

const SCRATCH1_STAGES_EN = [
  { emoji: '🐱', name: 'Scratch Visual Language & MIT Media Lab (pp. 72-73)' },
  { emoji: '🖥️', name: 'Scratch 3.0 Interface & Coordinate Stage (pp. 72-75)' },
  { emoji: '🎨', name: 'The 9 Color-Coded Block Categories (pp. 74-76)' },
  { emoji: '🤖', name: 'Project "RoboTIC Introduces Himself" - Linear Scripts (pp. 76-80)' },
  { emoji: '📦', name: 'Variables in Scratch: Creation & Watchers (pp. 81-84)' },
  { emoji: '🧮', name: 'Project "RoboOperations" - Math & Text Join (pp. 84-88)' },
  { emoji: '✒️', name: 'The Pen Extension & Dynamic Geometry (pp. 88-90)' },
  { emoji: '🏆', name: 'Certified Junior Scratch Master!' },
];

const SCRATCH1_MILESTONES_RO = [
  'P1: Scratch Intro',
  'P2: Scena & Coordonate',
  'P3: 9 Categorii',
  'P4: RoboTIC Liniar',
  'P5: Variabile',
  'P6: RoboOperații',
  'P7: Extensia Creion',
];

const SCRATCH1_MILESTONES_EN = [
  'P1: Scratch Intro',
  'P2: Stage & Coords',
  'P3: 9 Categories',
  'P4: RoboTIC Linear',
  'P5: Variables',
  'P6: RoboOperations',
  'P7: Pen Extension',
];

const SCRATCH2_STAGES_RO = [
  { emoji: '🌿', name: 'Structura Alternativă: dacă ... atunci ... altfel (pag. 84-86)' },
  { emoji: '🎮', name: 'Proiectul „Labirintul Inteligent” - Detectare Culori (pag. 86-88)' },
  { emoji: '🔢', name: 'Jocul „Tabla Înmulțirii” - Întrebări & Aleator (pag. 88-90)' },
  { emoji: '🎹', name: 'Extensia Muzică - Portativ MIDI & Sintetizator (pag. 90-92)' },
  { emoji: '🎶', name: 'Gama Do Major & Cântecul „În pădurea cu alune” (pag. 91-92)' },
  { emoji: '🐠', name: 'Concurs de Jocuri - „Prinde Peștișorul” Multi-Sprite (pag. 92-93)' },
  { emoji: '🌍', name: 'Proiectul „Salvăm Planeta” & Marea Evaluare Clasa a V-a (pag. 93)' },
  { emoji: '🎓', name: 'Absolvent de Onoare Clasa a V-a • Informatică & TIC!' },
];

const SCRATCH2_STAGES_EN = [
  { emoji: '🌿', name: 'Decision Structures: if ... then ... else (pp. 84-86)' },
  { emoji: '🎮', name: 'Project "The Smart Maze" - Color Sensing (pp. 86-88)' },
  { emoji: '🔢', name: 'Game "Multiplication Quiz" - Ask & Random (pp. 88-90)' },
  { emoji: '🎹', name: 'Music Extension - MIDI Notes & Synth (pp. 90-92)' },
  { emoji: '🎶', name: 'C Major Scale & "În pădurea cu alune" (pp. 91-92)' },
  { emoji: '🐠', name: 'Contest Game - "Catch the Fish" Multi-Sprite (pp. 92-93)' },
  { emoji: '🌍', name: 'Project "Save the Planet" & Grade 5 Grand Exam (p. 93)' },
  { emoji: '🎓', name: 'Grade 5 Informatics & ICT Graduate of Honor!' },
];

const SCRATCH2_MILESTONES_RO = [
  'P1: Decizii Scratch',
  'P2: Joc Labirint',
  'P3: Tabla Înmulțirii',
  'P4: Extensia Muzică',
  'P5: Gama & Cântece',
  'P6: Prinde Peștele',
  'P7: Marea Evaluare',
];

const SCRATCH2_MILESTONES_EN = [
  'P1: Scratch Decisions',
  'P2: Maze Game',
  'P3: Math Quiz',
  'P4: Music Extension',
  'P5: Scale & Songs',
  'P6: Catch the Fish',
  'P7: Grand Exam',
];

const ALGO1_STAGES_RO = [
  { emoji: '🧩', name: 'Ce este un Algoritm? Pași & Date (pag. 54-55)' },
  { emoji: '📜', name: 'Cele 6 Proprietăți Fundamentale (pag. 56-57)' },
  { emoji: '⚠️', name: 'Capcana Ambiguităților & Formulări (pag. 58)' },
  { emoji: '➡️', name: 'Algoritmi Secvențiali Liniari (pag. 59)' },
  { emoji: '🥛', name: 'Regula celor 3 Pahare: Interschimbare aux (pag. 60)' },
  { emoji: '🔐', name: 'Criptare & Cifrul Substituției Numerice (pag. 60-61)' },
  { emoji: '📐', name: 'Algoritmi Matematici: Arie & Perimetru (pag. 61)' },
  { emoji: '🏆', name: 'Junior Algoritmist & Arhitect de Pași Certificat!' },
];

const ALGO1_STAGES_EN = [
  { emoji: '🧩', name: 'What is an Algorithm? Steps & Data (pp. 54-55)' },
  { emoji: '📜', name: 'The 6 Fundamental Properties (pp. 56-57)' },
  { emoji: '⚠️', name: 'The Ambiguity Trap & Precision (p. 58)' },
  { emoji: '➡️', name: 'Sequential Linear Algorithms (p. 59)' },
  { emoji: '🥛', name: 'The 3 Glasses Rule: Value Swap aux (p. 60)' },
  { emoji: '🔐', name: 'Encryption & Numeric Substitution (pp. 60-61)' },
  { emoji: '📐', name: 'Math Algorithms: Area & Perimeter (p. 61)' },
  { emoji: '🏆', name: 'Certified Junior Algorithmist!' },
];

const ALGO1_MILESTONES_RO = [
  'P1: Noțiune',
  'P2: Proprietăți',
  'P3: Ambiguități',
  'P4: Secvențial',
  'P5: 3 Pahare',
  'P6: Criptare',
  'P7: Matematică',
];

const ALGO1_MILESTONES_EN = [
  'P1: Concept',
  'P2: Properties',
  'P3: Ambiguities',
  'P4: Sequential',
  'P5: 3 Glasses',
  'P6: Encryption',
  'P7: Math',
];

const ALGO2_STAGES_RO = [
  { emoji: '🚦', name: 'Structura Alternativă (Dacă... Atunci... Altfel) (pag. 62-63)' },
  { emoji: '📥', name: 'Date de Intrare, Manevră & Ieșire (pag. 64-65)' },
  { emoji: '🏷️', name: 'Tipuri de Date: Numeric, Text, Logic (pag. 66)' },
  { emoji: '➕', name: 'Operatori Aritmetici & Relaționali (pag. 67)' },
  { emoji: '🔀', name: 'Operatori Logici (ȘI, SAU, NU) & Tabele de Adevăr (pag. 68-69)' },
  { emoji: '📊', name: 'Blocurile Schemelor Logice (Flowchart) (pag. 70)' },
  { emoji: '📋', name: 'Traseul Datelor (Trace Table) & Evaluare Finală (pag. 71)' },
  { emoji: '🏆', name: 'Maestru în Scheme Logice & Algoritmi Decizionali!' },
];

const ALGO2_STAGES_EN = [
  { emoji: '🚦', name: 'Alternative Structure (If... Then... Else) (pp. 62-63)' },
  { emoji: '📥', name: 'Input, Processing & Output Data (pp. 64-65)' },
  { emoji: '🏷️', name: 'Data Types: Numeric, Text, Boolean (p. 66)' },
  { emoji: '➕', name: 'Arithmetic & Relational Operators (p. 67)' },
  { emoji: '🔀', name: 'Logic Operators (AND, OR, NOT) & Truth Tables (pp. 68-69)' },
  { emoji: '📊', name: 'Flowchart Logic Blocks Studio (p. 70)' },
  { emoji: '📋', name: 'Data Trace Table & Final Review (p. 71)' },
  { emoji: '🏆', name: 'Certified Logic Flowchart & Algorithm Master!' },
];

const ALGO2_MILESTONES_RO = [
  'P1: Decizie',
  'P2: Date & Const',
  'P3: Tipuri Date',
  'P4: Operatori',
  'P5: Conective',
  'P6: Scheme Logice',
  'P7: Traseu Date',
];

const ALGO2_MILESTONES_EN = [
  'P1: Decision',
  'P2: Data & Const',
  'P3: Data Types',
  'P4: Operators',
  'P5: Logic Ops',
  'P6: Flowcharts',
  'P7: Trace Table',
];

const TEXT2_STAGES_RO = [
  { emoji: '📊', name: 'Inserarea și Structurarea Tabelelor (pag. 68-70)' },
  { emoji: '📐', name: 'Formatarea Tabelelor, Îmbinare & Umbrire (pag. 71-72)' },
  { emoji: '🖼️', name: 'Inserarea & Redimensionarea Imaginilor (pag. 73-75)' },
  { emoji: '📰', name: 'Încadrarea Textului în Jurul Imaginilor (pag. 76-77)' },
  { emoji: '✨', name: 'Forme Geometrice, Casete de Text & Grupare (pag. 78-79)' },
  { emoji: '📄', name: 'Paginarea Documentului, Margini, Antet & Subsol (pag. 80)' },
  { emoji: '🎓', name: 'Laboratorul Practic: Revista Eco-Gimnaziul (pag. 68-80)' },
  { emoji: '🏆', name: 'Designer & Arhitect de Documente Certificat!' },
];

const TEXT2_STAGES_EN = [
  { emoji: '📊', name: 'Inserting & Structuring Tables (pp. 68-70)' },
  { emoji: '📐', name: 'Table Formatting, Merge & Shading (pp. 71-72)' },
  { emoji: '🖼️', name: 'Inserting & Sizing Images (pp. 73-75)' },
  { emoji: '📰', name: 'Text Wrapping Around Images (pp. 76-77)' },
  { emoji: '✨', name: 'Geometric Shapes, Text Boxes & Grouping (pp. 78-79)' },
  { emoji: '📄', name: 'Page Setup: Margins, Headers & Footers (p. 80)' },
  { emoji: '🎓', name: 'Practical Capstone: Eco-Magazine Master Studio' },
  { emoji: '🏆', name: 'Certified Document Designer & Page Architect!' },
];

const TEXT2_MILESTONES_RO = [
  'P1: Tabele',
  'P2: Formatare',
  'P3: Imagini',
  'P4: Wrap Text',
  'P5: Forme',
  'P6: Paginare',
  'P7: Revistă',
];

const TEXT2_MILESTONES_EN = [
  'P1: Tables',
  'P2: Styling',
  'P3: Pictures',
  'P4: Wrap Text',
  'P5: Shapes',
  'P6: Layout',
  'P7: Studio',
];

const TEXT1_STAGES_RO = [
  { emoji: '📝', name: 'Interfața Procesorului de Text & Rigla (pag. 50-52)' },
  { emoji: '⌨️', name: 'Regulile de Aur ale Tehnoredactării (pag. 53-55)' },
  { emoji: '🔤', name: 'Formatarea Caracterelor, Fonturilor & Indici (pag. 56-58)' },
  { emoji: '📐', name: 'Alinierea & Formatarea Paragrafelor (pag. 59-61)' },
  { emoji: '📋', name: 'Liste Marcate (Bullets) & Numerotate (pag. 62-64)' },
  { emoji: '🔍', name: 'Găsire, Înlocuire & Verificare Ortografică (pag. 65-67)' },
  { emoji: '🎓', name: 'Laboratorul Practic: Carta Elevului Digital (pag. 50-67)' },
  { emoji: '🏆', name: 'Tehnician & Editor de Documente Text Certificat!' },
];

const TEXT1_STAGES_EN = [
  { emoji: '📝', name: 'Word Processor Interface & The Ruler (pp. 50-52)' },
  { emoji: '⌨️', name: 'Golden Typing Rules & Special Keys (pp. 53-55)' },
  { emoji: '🔤', name: 'Character Formatting, Fonts & Scripts (pp. 56-58)' },
  { emoji: '📐', name: 'Paragraph Alignment & Indentations (pp. 59-61)' },
  { emoji: '📋', name: 'Bulleted & Numbered Lists (pp. 62-64)' },
  { emoji: '🔍', name: 'Find & Replace, Spellcheck & Export (pp. 65-67)' },
  { emoji: '🎓', name: 'Practical Master Lab: Digital Student Charter' },
  { emoji: '🏆', name: 'Certified Word Processor & Document Editor!' },
];

const TEXT1_MILESTONES_RO = [
  'P1: Interfață',
  'P2: Reguli',
  'P3: Fonturi',
  'P4: Aliniere',
  'P5: Liste',
  'P6: Căutare',
  'P7: Laborator',
];

const TEXT1_MILESTONES_EN = [
  'P1: Interface',
  'P2: Typing',
  'P3: Fonts',
  'P4: Alignment',
  'P5: Lists',
  'P6: Replace',
  'P7: Lab',
];

const INTERNET2_STAGES_RO = [
  { emoji: '🔍', name: 'Maestru Motoare de Căutare & Operatori (pag. 38-39)' },
  { emoji: '🕵️', name: 'Detectiv Surse Credibile & Fake News (pag. 40-41)' },
  { emoji: '✉️', name: 'Arhitect E-mail: Cc, Bcc, Semnătură & @ (pag. 42-43)' },
  { emoji: '🤝', name: 'Inspector Netichetă & Conduită Digitală (pag. 43-44)' },
  { emoji: '📚', name: 'Cercetător Onest: Drepturi de Autor & Citare (pag. 45-46)' },
  { emoji: '🔐', name: 'Gardian Identitate: Parole Blindate & 2FA (pag. 47-48)' },
  { emoji: '🏆', name: 'Expert Comunicare & Securitate Digitală!' },
];

const INTERNET2_STAGES_EN = [
  { emoji: '🔍', name: 'Search Engines & Boolean Operators Master (pp. 38-39)' },
  { emoji: '🕵️', name: 'Source Credibility & Fake News Detective (pp. 40-41)' },
  { emoji: '✉️', name: 'Email Architect: Cc, Bcc, Signature & @ (pp. 42-43)' },
  { emoji: '🤝', name: 'Netiquette Inspector & Digital Ethics (pp. 43-44)' },
  { emoji: '📚', name: 'Honest Researcher: Copyright & Citation (pp. 45-46)' },
  { emoji: '🔐', name: 'Identity Guardian: Fortress Passwords & 2FA (pp. 47-48)' },
  { emoji: '🏆', name: 'Certified Digital Citizenship & Security Expert!' },
];

const INTERNET2_MILESTONES_RO = [
  'P1: Căutare',
  'P2: Evaluare',
  'P3: E-mail',
  'P4: Netichetă',
  'P5: Drepturi',
  'P6: Parole',
];

const INTERNET2_MILESTONES_EN = [
  'P1: Search',
  'P2: Evaluation',
  'P3: Email',
  'P4: Netiquette',
  'P5: Copyright',
  'P6: Passwords',
];

const INTERNET1_STAGES_RO = [
  { emoji: '🌐', name: 'Explorator Rețele & Protocol TCP/IP (pag. 32-33)' },
  { emoji: '📡', name: 'Operator Servicii Internet: Email, WWW, FTP (pag. 32)' },
  { emoji: '🧩', name: 'Dezlegător Rebus Digital & Coloana Secretă (pag. 33)' },
  { emoji: '🧭', name: 'Navigator Web & Anatomie URL (pag. 34)' },
  { emoji: '💻', name: 'Pilot Browser Chrome & Butoane de Navigare (pag. 35-36)' },
  { emoji: '🛡️', name: 'Gardian Securitate Cibernetică & Scut Antivirus (pag. 35-36)' },
  { emoji: '🏆', name: 'Explorator Internet & Web Certificat!' },
];

const INTERNET1_STAGES_EN = [
  { emoji: '🌐', name: 'Network Explorer & TCP/IP Protocol (pp. 32-33)' },
  { emoji: '📡', name: 'Internet Services Operator: Email, WWW, FTP (p. 32)' },
  { emoji: '🧩', name: 'Digital Crossword Solver & Secret Column (p. 33)' },
  { emoji: '🧭', name: 'Web Navigator & URL Anatomy (p. 34)' },
  { emoji: '💻', name: 'Browser Pilot & Navigation Controls (pp. 35-36)' },
  { emoji: '🛡️', name: 'Cybersecurity Guardian & Antivirus Shield (pp. 35-36)' },
  { emoji: '🏆', name: 'Certified Internet & Web Explorer!' },
];

const INTERNET1_MILESTONES_RO = [
  'P1: Rețele',
  'P2: Servicii',
  'P3: Rebus',
  'P4: URL Web',
  'P5: Browser',
  'P6: Siguranță',
];

const INTERNET1_MILESTONES_EN = [
  'P1: Networks',
  'P2: Services',
  'P3: Crossword',
  'P4: Web URL',
  'P5: Browser',
  'P6: Safety',
];

const HARDWARE_STAGES_RO = [
  { emoji: '🛡️', name: 'Inspector Protecție & Ergonomie (pag. 10-12)' },
  { emoji: '⏳', name: 'Crononaut: Istoria Calculatoarelor (pag. 13-14)' },
  { emoji: '🖥️', name: 'Tehnician Asamblor Unitate Centrală (pag. 15-17)' },
  { emoji: '🔌', name: 'Expert Periferice: Intrare / Ieșire (pag. 15-16)' },
  { emoji: '💾', name: 'Maestru Biți: Stocare & Autoevaluare (pag. 18-20)' },
  { emoji: '🏆', name: 'Tehnician Hardware Certificat!' },
];

const HARDWARE_STAGES_EN = [
  { emoji: '🛡️', name: 'Safety & Ergonomics Inspector (pp. 10-12)' },
  { emoji: '⏳', name: 'Chrononaut: History of Computing (pp. 13-14)' },
  { emoji: '🖥️', name: 'PC Tower Assembly Technician (pp. 15-17)' },
  { emoji: '🔌', name: 'Peripherals Expert: Input / Output (pp. 15-16)' },
  { emoji: '💾', name: 'Bits Master: Storage & Self-Eval (pp. 18-20)' },
  { emoji: '🏆', name: 'Certified Hardware Technician!' },
];

const HARDWARE_MILESTONES_RO = [
  'N1: Norme',
  'N2: Istorie',
  'N3: Unitate',
  'N4: Periferice',
  'N5: Biți',
];

const HARDWARE_MILESTONES_EN = [
  'L1: Safety',
  'L2: History',
  'L3: PC Tower',
  'L4: Peripherals',
  'L5: Bits',
];

const FILES_STAGES_RO = [
  { emoji: '🖥️', name: 'Inspector SO & Desktop (pag. 22-24)' },
  { emoji: '📑', name: 'Arhitect Date, Extensii & Calea C:\\ (pag. 25-26)' },
  { emoji: '📁', name: 'Constructor Arbore de Foldere (pag. 27-28)' },
  { emoji: '🎯', name: 'Expert Selecție & Căutare (*.docx) (pag. 28)' },
  { emoji: '⚡', name: 'Maestru Mutare & Comenzi Rapide (pag. 29)' },
  { emoji: '🔍', name: 'Tehnician Copiere & Redenumire F2 (pag. 29)' },
  { emoji: '🗑️', name: 'Gardian Recycle Bin & Restaurare (pag. 30)' },
  { emoji: '🏆', name: 'Arhitect Fișiere & SO Certificat!' },
];

const FILES_STAGES_EN = [
  { emoji: '🖥️', name: 'OS & Desktop Inspector (pp. 22-24)' },
  { emoji: '📑', name: 'Data Architect, Extensions & Path C:\\ (pp. 25-26)' },
  { emoji: '📁', name: 'Folder Tree Constructor (pp. 27-28)' },
  { emoji: '🎯', name: 'Multi-Selection & Search Expert (p. 28)' },
  { emoji: '⚡', name: 'Move & Shortcuts Master (p. 29)' },
  { emoji: '🔍', name: 'Copy & F2 Rename Technician (p. 29)' },
  { emoji: '🗑️', name: 'Recycle Bin & Restore Guardian (p. 30)' },
  { emoji: '🏆', name: 'Certified File & OS Architect!' },
];

const FILES_MILESTONES_RO = [
  'N1: Interfață SO',
  'N2: Extensii & Cale',
  'N3: Structură',
  'N4: Căutare',
  'N5: Mutare',
  'N6: Copie & F2',
  'N7: Coș Reciclare',
];

const FILES_MILESTONES_EN = [
  'L1: OS Interface',
  'L2: Extensions & Path',
  'L3: Structure',
  'L4: Search',
  'L5: Move',
  'L6: Copy & F2',
  'L7: Recycle Bin',
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel, courseId = 'files' }) => {
  const { t, lang } = useLanguage();

  const isHardware = courseId === 'hardware';
  const isInternet1 = courseId === 'internet1';
  const isInternet2 = courseId === 'internet2';
  const isText1 = courseId === 'text1';
  const isText2 = courseId === 'text2';
  const isAlgo1 = courseId === 'algo1';
  const isAlgo2 = courseId === 'algo2';
  const isScratch1 = courseId === 'scratch1';
  const isScratch2 = courseId === 'scratch2';

  let stages = lang === 'en' ? FILES_STAGES_EN : FILES_STAGES_RO;
  let milestones = lang === 'en' ? FILES_MILESTONES_EN : FILES_MILESTONES_RO;
  let percents = FILES_STAGE_PERCENTS;
  let maxLevels = 7;

  if (isHardware) {
    stages = lang === 'en' ? HARDWARE_STAGES_EN : HARDWARE_STAGES_RO;
    milestones = lang === 'en' ? HARDWARE_MILESTONES_EN : HARDWARE_MILESTONES_RO;
    percents = HARDWARE_STAGE_PERCENTS;
    maxLevels = 5;
  } else if (isInternet1) {
    stages = lang === 'en' ? INTERNET1_STAGES_EN : INTERNET1_STAGES_RO;
    milestones = lang === 'en' ? INTERNET1_MILESTONES_EN : INTERNET1_MILESTONES_RO;
    percents = INTERNET1_STAGE_PERCENTS;
    maxLevels = 6;
  } else if (isInternet2) {
    stages = lang === 'en' ? INTERNET2_STAGES_EN : INTERNET2_STAGES_RO;
    milestones = lang === 'en' ? INTERNET2_MILESTONES_EN : INTERNET2_MILESTONES_RO;
    percents = INTERNET2_STAGE_PERCENTS;
    maxLevels = 6;
  } else if (isText1) {
    stages = lang === 'en' ? TEXT1_STAGES_EN : TEXT1_STAGES_RO;
    milestones = lang === 'en' ? TEXT1_MILESTONES_EN : TEXT1_MILESTONES_RO;
    percents = TEXT1_STAGE_PERCENTS;
    maxLevels = 7;
  } else if (isText2) {
    stages = lang === 'en' ? TEXT2_STAGES_EN : TEXT2_STAGES_RO;
    milestones = lang === 'en' ? TEXT2_MILESTONES_EN : TEXT2_MILESTONES_RO;
    percents = TEXT2_STAGE_PERCENTS;
    maxLevels = 7;
  } else if (isAlgo1) {
    stages = lang === 'en' ? ALGO1_STAGES_EN : ALGO1_STAGES_RO;
    milestones = lang === 'en' ? ALGO1_MILESTONES_EN : ALGO1_MILESTONES_RO;
    percents = ALGO1_STAGE_PERCENTS;
    maxLevels = 7;
  } else if (isAlgo2) {
    stages = lang === 'en' ? ALGO2_STAGES_EN : ALGO2_STAGES_RO;
    milestones = lang === 'en' ? ALGO2_MILESTONES_EN : ALGO2_MILESTONES_RO;
    percents = ALGO2_STAGE_PERCENTS;
    maxLevels = 7;
  } else if (isScratch1) {
    stages = lang === 'en' ? SCRATCH1_STAGES_EN : SCRATCH1_STAGES_RO;
    milestones = lang === 'en' ? SCRATCH1_MILESTONES_EN : SCRATCH1_MILESTONES_RO;
    percents = SCRATCH1_STAGE_PERCENTS;
    maxLevels = 7;
  } else if (isScratch2) {
    stages = lang === 'en' ? SCRATCH2_STAGES_EN : SCRATCH2_STAGES_RO;
    milestones = lang === 'en' ? SCRATCH2_MILESTONES_EN : SCRATCH2_MILESTONES_RO;
    percents = SCRATCH2_STAGE_PERCENTS;
    maxLevels = 7;
  }

  const stageIndex = Math.min(Math.max(currentLevel - 1, 0), stages.length - 1);
  const currentStage = stages[stageIndex];
  const currentPercent = percents[stageIndex] || (isHardware ? 20 : (isInternet1 || isInternet2) ? 16 : 14);

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl animate-float p-1 bg-slate-900/60 rounded-xl border border-slate-700/60">
            {currentStage.emoji}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              {isHardware
                ? (lang === 'en' ? 'ICT Hardware Technician Progress' : 'Evoluție Tehnician Hardware TIC')
                : isInternet1
                ? (lang === 'en' ? 'Internet & Web Explorer Progress' : 'Evoluție Explorator Internet & Web TIC')
                : isInternet2
                ? (lang === 'en' ? 'Digital Citizenship & Security Progress' : 'Evoluție Comunicare & Securitate Digitală')
                : isText1
                ? (lang === 'en' ? 'Word Processor & Typography Progress' : 'Evoluție Editor de Documente & Tehnoredactare')
                : isText2
                ? (lang === 'en' ? 'Visual Elements, Tables & Layout Progress' : 'Evoluție Tabele, Imagini & Paginare')
                : isAlgo1
                ? (lang === 'en' ? 'Algorithm Fundamentals & Sequential Logic Progress' : 'Evoluție Noțiuni de Algoritm & Algoritmi Secvențiali')
                : isAlgo2
                ? (lang === 'en' ? 'Decisions, Flowcharts & Logic Progress' : 'Evoluție Structuri Decizionale & Scheme Logice')
                : isScratch1
                ? (lang === 'en' ? 'Scratch Environment & Visual Coding Progress' : 'Evoluție Mediul Scratch & Programare Vizuală')
                : isScratch2
                ? (lang === 'en' ? 'Scratch Decisions, Music & Games Progress' : 'Evoluție Decizii, Muzică & Concurs de Jocuri Scratch')
                : (lang === 'en' ? 'File & OS Architect Progress' : 'Evoluție Arhitect Fișiere & Sistem de Operare')}
            </div>
            <div className={`text-base sm:text-lg font-black font-heading ${
              isHardware ? 'text-cyan-400' 
              : isInternet1 ? 'text-teal-400' 
              : isInternet2 ? 'text-indigo-400' 
              : isText1 ? 'text-blue-400' 
              : isText2 ? 'text-emerald-400' 
              : isAlgo1 ? 'text-amber-400'
              : isAlgo2 ? 'text-purple-400'
              : isScratch1 ? 'text-orange-400'
              : isScratch2 ? 'text-pink-400'
              : 'text-emerald-400'
            }`}>
              {currentStage.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">{t.levelLabel}</span>
            <span className="ml-1 text-sm font-extrabold text-white font-mono">
              {currentLevel <= maxLevels ? `${currentLevel} / ${maxLevels}` : t.victoryLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full bg-slate-900/90 rounded-full h-4 p-0.5 overflow-hidden border border-slate-700 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
            isHardware
              ? 'bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500'
              : isInternet1
              ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400'
              : isInternet2
              ? 'bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400'
              : isAlgo1
              ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300'
              : isAlgo2
              ? 'bg-gradient-to-r from-purple-500 via-indigo-400 to-teal-300'
              : isScratch1
              ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-teal-300'
              : isScratch2
              ? 'bg-gradient-to-r from-pink-500 via-purple-400 to-emerald-300'
              : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
          }`}
          style={{ width: `${currentPercent}%` }}
        />
      </div>

      {/* Level Milestones below */}
      <div className={`grid gap-1 sm:gap-1.5 mt-3 pt-2 text-center text-[10px] sm:text-xs font-semibold text-slate-400 ${
        isHardware ? 'grid-cols-5' : (isInternet1 || isInternet2) ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-4 sm:grid-cols-7'
      }`}>
        {milestones.map((m, idx) => {
          const lvl = idx + 1;
          const isActive = currentLevel >= lvl;
          return (
            <span
              key={m}
              className={`${
                isActive
                  ? isHardware
                    ? 'text-teal-300 font-bold'
                    : isInternet1
                    ? 'text-cyan-300 font-bold'
                    : isInternet2
                    ? 'text-indigo-300 font-bold'
                    : isAlgo1
                    ? 'text-amber-300 font-bold'
                    : isAlgo2
                    ? 'text-purple-300 font-bold'
                    : isScratch1
                    ? 'text-orange-300 font-bold'
                    : isScratch2
                    ? 'text-pink-300 font-bold'
                    : 'text-emerald-400 font-bold'
                  : 'text-slate-500'
              }`}
            >
              {m}
            </span>
          );
        })}
      </div>
    </div>
  );
};
