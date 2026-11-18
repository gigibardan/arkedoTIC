import {
  AllMissionId,
  ArcadeScores,
  DailyQuestState,
  DailyStreakInfo,
  LessonsProgress,
  StudentDiploma,
  StudentProfile
} from '../types';
import { computeGradeDetails } from '../utils/pedagogicalGrading';
import { StudentResult } from './resultsService';
import { saveStudentDiploma, getStudentDiplomas } from './studentAuthService';

export interface CarnetMissionMeta {
  id: AllMissionId;
  lessonsKey: keyof Omit<LessonsProgress, 'totalLessonScore'>;
  localPrefix: string;
  gradeNum: 5 | 6 | 7 | 8;
  gradeLabelRo: 'Clasa a V-a' | 'Clasa a VI-a' | 'Clasa a VII-a' | 'Clasa a VIII-a';
  gradeLabelEn: string;
  moduleCode: string;
  emoji: string;
  maxLevels: number;
  maxScore: number;
  titleRo: string;
  titleEn: string;
  unitRo: string;
  unitEn: string;
  diplomaTitleRo: string;
  diplomaTitleEn: string;
}

export const CARNET_MISSIONS: CarnetMissionMeta[] = [
  // ================= CLASA A V-A (10 MISIUNI) =================
  {
    id: 'hardware',
    lessonsKey: 'hardware',
    localPrefix: 'hw',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M1',
    emoji: '💻',
    maxLevels: 5,
    maxScore: 100,
    titleRo: 'Sisteme de calcul și comunicații',
    titleEn: 'Computing & Communication Systems',
    unitRo: 'U1 · Hardware & Ergonomie',
    unitEn: 'U1 · Hardware & Ergonomics',
    diplomaTitleRo: 'Diplomă Tehnician Hardware & TIC',
    diplomaTitleEn: 'Hardware & ICT Technician Certificate',
  },
  {
    id: 'files',
    lessonsKey: 'files',
    localPrefix: 'files',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M2',
    emoji: '🌳',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Arborele Secret de Fișiere & SO',
    titleEn: 'The Secret File Tree & OS',
    unitRo: 'U2 · Sistem de Operare',
    unitEn: 'U2 · Operating System',
    diplomaTitleRo: 'Diplomă Arhitect Fișiere & SO',
    diplomaTitleEn: 'File Architect & OS Certificate',
  },
  {
    id: 'internet1',
    lessonsKey: 'internet1',
    localPrefix: 'internet1',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M3A',
    emoji: '🌐',
    maxLevels: 6,
    maxScore: 100,
    titleRo: 'Explorator Internet, Rețele & Web',
    titleEn: 'Internet & World Wide Web Explorer',
    unitRo: 'U3 · Rețele & Browsere',
    unitEn: 'U3 · Networks & Browsers',
    diplomaTitleRo: 'Diplomă Explorator Web & Cyber',
    diplomaTitleEn: 'Web & Cyber Explorer Certificate',
  },
  {
    id: 'internet2',
    lessonsKey: 'internet2',
    localPrefix: 'internet2',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M3B',
    emoji: '🔍',
    maxLevels: 6,
    maxScore: 100,
    titleRo: 'Căutare Avansată & Identitate Digitală',
    titleEn: 'Advanced Search & Digital Identity',
    unitRo: 'U3 · Securitate & Netichetă',
    unitEn: 'U3 · Safety & Netiquette',
    diplomaTitleRo: 'Diplomă Cetățean Digital & Securitate',
    diplomaTitleEn: 'Digital Citizenship & Safety Certificate',
  },
  {
    id: 'text1',
    lessonsKey: 'text1',
    localPrefix: 'text1',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M4A',
    emoji: '📝',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Procesorul de Text & Tehnoredactare',
    titleEn: 'Word Processor & Text Formatting',
    unitRo: 'U4 · Editor de Text',
    unitEn: 'U4 · Word Processor',
    diplomaTitleRo: 'Diplomă Tehnician Text & Word',
    diplomaTitleEn: 'Word Processor Technician Certificate',
  },
  {
    id: 'text2',
    lessonsKey: 'text2',
    localPrefix: 'text2',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M4B',
    emoji: '📊',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Elemente Grafice, Tabele & Paginare',
    titleEn: 'Visual Elements, Tables & Layout',
    unitRo: 'U4 · Tabele & Pagină A4',
    unitEn: 'U4 · Tables & A4 Layout',
    diplomaTitleRo: 'Diplomă Designer Documente Text',
    diplomaTitleEn: 'Document Designer Diploma',
  },
  {
    id: 'algo1',
    lessonsKey: 'algo1',
    localPrefix: 'algo1',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M5A',
    emoji: '🧩',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Noțiunea de Algoritm & Pași Secvențiali',
    titleEn: 'Algorithm Concept & Sequential Logic',
    unitRo: 'U5 · Algoritmică',
    unitEn: 'U5 · Algorithms',
    diplomaTitleRo: 'Diplomă Junior Algoritmist',
    diplomaTitleEn: 'Junior Algorithmist Certificate',
  },
  {
    id: 'algo2',
    lessonsKey: 'algo2',
    localPrefix: 'algo2',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M5B',
    emoji: '🚦',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Structuri Decizionale & Scheme Logice',
    titleEn: 'Decisions, Data Types & Flowcharts',
    unitRo: 'U5 · Scheme Logice',
    unitEn: 'U5 · Flowcharts',
    diplomaTitleRo: 'Diplomă Maestru Scheme Logice',
    diplomaTitleEn: 'Algorithm & Flowcharts Diploma',
  },
  {
    id: 'scratch1',
    lessonsKey: 'scratch1',
    localPrefix: 'scratch1',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M6A',
    emoji: '🐱',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Mediul Scratch: Scenă, Mișcare & Variabile',
    titleEn: 'Scratch 3.0: Stage, Motion & Variables',
    unitRo: 'U6 · Programare Vizuală',
    unitEn: 'U6 · Visual Coding',
    diplomaTitleRo: 'Diplomă Programator Junior Scratch 3.0',
    diplomaTitleEn: 'Scratch 3.0 Junior Developer Certificate',
  },
  {
    id: 'scratch2',
    lessonsKey: 'scratch2',
    localPrefix: 'scratch2',
    gradeNum: 5,
    gradeLabelRo: 'Clasa a V-a',
    gradeLabelEn: '5th Grade',
    moduleCode: 'M6B',
    emoji: '🎮',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Decizii, Muzică, Jocuri & Evaluare V',
    titleEn: 'Decisions, Music & Final Exam',
    unitRo: 'U6 · Absolvire Clasa V',
    unitEn: 'U6 · Grade 5 Graduation',
    diplomaTitleRo: 'Marea Diplomă de Onoare Clasa a V-a',
    diplomaTitleEn: 'Grade 5 Grand Graduation Diploma',
  },

  // ================= CLASA A VI-A (8 MISIUNI) =================
  {
    id: 'g6_presentation1',
    lessonsKey: 'presentation1',
    localPrefix: 'g6p1',
    gradeNum: 6,
    gradeLabelRo: 'Clasa a VI-a',
    gradeLabelEn: '6th Grade',
    moduleCode: 'M1A',
    emoji: '📽️',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Prezentarea & Interfața PowerPoint',
    titleEn: 'Presentation & PowerPoint Interface',
    unitRo: 'U1 · Prezentări Electronice',
    unitEn: 'U1 · Presentations',
    diplomaTitleRo: 'Diplomă Operator Junior PowerPoint',
    diplomaTitleEn: 'Junior PowerPoint Specialist Certificate',
  },
  {
    id: 'g6_presentation2',
    lessonsKey: 'presentation2',
    localPrefix: 'g6p2',
    gradeNum: 6,
    gradeLabelRo: 'Clasa a VI-a',
    gradeLabelEn: '6th Grade',
    moduleCode: 'M1B',
    emoji: '🎨',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Design Diapozitive & Public Speaking',
    titleEn: 'Slide Design & Public Speaking',
    unitRo: 'U1 · Regula 40 Cuvinte',
    unitEn: 'U1 · Design & Delivery',
    diplomaTitleRo: 'Diplomă Prezentări & Public Speaking',
    diplomaTitleEn: 'Public Speaking & Presentation Diploma',
  },
  {
    id: 'g6_paint3d',
    lessonsKey: 'model3d1',
    localPrefix: 'g6p3',
    gradeNum: 6,
    gradeLabelRo: 'Clasa a VI-a',
    gradeLabelEn: '6th Grade',
    moduleCode: 'M2A',
    emoji: '🧊',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Modelare 3D în Paint 3D',
    titleEn: '3D Modeling in Paint 3D',
    unitRo: 'U2 · Grafică 3D',
    unitEn: 'U2 · 3D Graphics',
    diplomaTitleRo: 'Diplomă Creator & Modelator 3D Junior',
    diplomaTitleEn: 'Junior 3D Modeler Certificate',
  },
  {
    id: 'g6_anim3d',
    lessonsKey: 'model3d2',
    localPrefix: 'g6a1',
    gradeNum: 6,
    gradeLabelRo: 'Clasa a VI-a',
    gradeLabelEn: '6th Grade',
    moduleCode: 'M2B',
    emoji: '🎬',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Animație Toontastic & Realitate Virtuală VR',
    titleEn: 'Toontastic Animation & VR Worlds',
    unitRo: 'U2 · Animație & VR',
    unitEn: 'U2 · Animation & VR',
    diplomaTitleRo: 'Diplomă Animație Digitală 24 FPS & VR',
    diplomaTitleEn: 'Animation & VR Creator Diploma',
  },
  {
    id: 'g6_malware',
    lessonsKey: 'cyber6a',
    localPrefix: 'g6m1',
    gradeNum: 6,
    gradeLabelRo: 'Clasa a VI-a',
    gradeLabelEn: '6th Grade',
    moduleCode: 'M3A',
    emoji: '🛡️',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Amenințări Malware & Securitate',
    titleEn: 'Malware Threats & Cyber Security',
    unitRo: 'U3 · Securitate Cibernetică',
    unitEn: 'U3 · Cybersecurity',
    diplomaTitleRo: 'Diplomă Expert Securitate Cibernetică',
    diplomaTitleEn: 'Cybersecurity Specialist Diploma',
  },
  {
    id: 'g6_email',
    lessonsKey: 'cyber6b',
    localPrefix: 'g6e1',
    gradeNum: 6,
    gradeLabelRo: 'Clasa a VI-a',
    gradeLabelEn: '6th Grade',
    moduleCode: 'M3B',
    emoji: '✉️',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'E-mail, Netichetă & Cloud Sharing',
    titleEn: 'Email, Netiquette & Cloud Sharing',
    unitRo: 'U3 · Comunicare Online',
    unitEn: 'U3 · Online Communication',
    diplomaTitleRo: 'Diplomă Comunicare Electronică & Cloud',
    diplomaTitleEn: 'Netiquette & Email Certificate',
  },
  {
    id: 'g6_scratch1',
    lessonsKey: 'scratch6a',
    localPrefix: 'g6s1',
    gradeNum: 6,
    gradeLabelRo: 'Clasa a VI-a',
    gradeLabelEn: '6th Grade',
    moduleCode: 'M4A',
    emoji: '🔄',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Bucle Condiționate în Scratch',
    titleEn: 'Scratch Conditional Loops',
    unitRo: 'U4 · Structuri Repetitive',
    unitEn: 'U4 · Repetitive Loops',
    diplomaTitleRo: 'Diplomă Bucle Condiționate Scratch',
    diplomaTitleEn: 'Scratch Conditional Loops Diploma',
  },
  {
    id: 'g6_scratch2',
    lessonsKey: 'scratch6b',
    localPrefix: 'g6s2',
    gradeNum: 6,
    gradeLabelRo: 'Clasa a VI-a',
    gradeLabelEn: '6th Grade',
    moduleCode: 'M4B',
    emoji: '🏆',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Bucle cu Contor, Minecraft 3D & Evaluare VI',
    titleEn: 'Counter Loops, Minecraft 3D & Graduation',
    unitRo: 'U4 · Absolvire Clasa VI',
    unitEn: 'U4 · Grade 6 Graduation',
    diplomaTitleRo: 'Diplomă de Onoare TIC Clasa a VI-a',
    diplomaTitleEn: 'Grade 6 TIC Graduation Diploma',
  },

  // ================= CLASA A VII-A (12 MISIUNI) =================
  {
    id: 'g7_word_a',
    lessonsKey: 'g7_word_a',
    localPrefix: 'g7w1',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M1A',
    emoji: '📰',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Tehnoredactare Avansată & Tipografie',
    titleEn: 'Word Processing & Typography',
    unitRo: 'U1 · Editorul de Texte',
    unitEn: 'U1 · Word Processor',
    diplomaTitleRo: 'Diplomă Tehnoredactor & Editor Digital',
    diplomaTitleEn: 'Digital Typographer & Editor Diploma',
  },
  {
    id: 'g7_word_b',
    lessonsKey: 'g7_word_b',
    localPrefix: 'g7w2',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M1B',
    emoji: '📐',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Machetare Pagină A4, Antet & Tabele',
    titleEn: 'Page Layout, Headers & Tables',
    unitRo: 'U1 · Machetare Tipografică',
    unitEn: 'U1 · Page Layout',
    diplomaTitleRo: 'Diplomă Arhitect de Documente A4',
    diplomaTitleEn: 'Document Architect Diploma',
  },
  {
    id: 'g7_audio_a',
    lessonsKey: 'g7_audio_a',
    localPrefix: 'g7a1',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M2A',
    emoji: '🎙️',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Acustică Digitală & Studio WavePad',
    titleEn: 'Digital Acoustics & WavePad Studio',
    unitRo: 'U2 · Aplicații Audio',
    unitEn: 'U2 · Audio Editing',
    diplomaTitleRo: 'Diplomă Inginer de Sunet & WavePad',
    diplomaTitleEn: 'Digital Sound Engineer Diploma',
  },
  {
    id: 'g7_video_b',
    lessonsKey: 'g7_video_b',
    localPrefix: 'g7v2',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M2B',
    emoji: '🎥',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Montaj Video Multitrack & VideoPad',
    titleEn: 'Multitrack Video Editing & VideoPad',
    unitRo: 'U2 · Montaj Video',
    unitEn: 'U2 · Video Editing',
    diplomaTitleRo: 'Diplomă Regizor & Editor Video Digital',
    diplomaTitleEn: 'Video Director & Editor Diploma',
  },
  {
    id: 'g7_cloud_a',
    lessonsKey: 'g7_cloud_a',
    localPrefix: 'g7c1',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M3A',
    emoji: '☁️',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Aplicații Colaborative în Cloud',
    titleEn: 'Cloud Collaboration & Teams',
    unitRo: 'U3 · Lucru Colaborativ',
    unitEn: 'U3 · Cloud Teamwork',
    diplomaTitleRo: 'Diplomă Coordonator Proiecte în Cloud',
    diplomaTitleEn: 'Cloud Collaboration Master Diploma',
  },
  {
    id: 'g7_gis_b',
    lessonsKey: 'g7_gis_b',
    localPrefix: 'g7g1',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M3B',
    emoji: '🗺️',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'GIS & Cartografie Digitală',
    titleEn: 'GIS & Digital Cartography',
    unitRo: 'U3 · Hărți & Coordonate GPS',
    unitEn: 'U3 · Spatial GIS Maps',
    diplomaTitleRo: 'Diplomă Cartograf Digital & Specialist GIS',
    diplomaTitleEn: 'GIS Specialist & Cartographer Diploma',
  },
  {
    id: 'g7_cpp_a',
    lessonsKey: 'g7_cpp_a',
    localPrefix: 'g7cp1',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M4A',
    emoji: '⚙️',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Tranziția la C++: Code::Blocks & Tipuri Date',
    titleEn: 'Transition to C++ & Data Types',
    unitRo: 'U4 · Programare C++',
    unitEn: 'U4 · C++ Basics',
    diplomaTitleRo: 'Diplomă Programator C++ Junior',
    diplomaTitleEn: 'C++ Junior Programmer Diploma',
  },
  {
    id: 'g7_cpp_b',
    lessonsKey: 'g7_cpp_b',
    localPrefix: 'g7cp2',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M4B',
    emoji: '🧮',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Structura Liniară C++ & cin/cout',
    titleEn: 'Linear Structure, cin/cout & Swap',
    unitRo: 'U4 · Intrare / Ieșire C++',
    unitEn: 'U4 · C++ I/O & Expressions',
    diplomaTitleRo: 'Diplomă Structuri Liniare în C++',
    diplomaTitleEn: 'C++ Linear Algorithms Diploma',
  },
  {
    id: 'g7_decision_a',
    lessonsKey: 'g7_decision_a',
    localPrefix: 'g7dec',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M4C',
    emoji: '🔀',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Structura Alternativă C++ (if / else)',
    titleEn: 'C++ Decisions (if / else) & Logic',
    unitRo: 'U4 · Decizii în C++',
    unitEn: 'U4 · Conditional Logic',
    diplomaTitleRo: 'Diplomă Logică Condițională if/else C++',
    diplomaTitleEn: 'C++ Conditional Logic Diploma',
  },
  {
    id: 'g7_loop_b',
    lessonsKey: 'g7_loop_b',
    localPrefix: 'g7loop',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M4D',
    emoji: '🔁',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Bucla while & Cifrele unui Număr',
    titleEn: 'While Loop & Digit Extraction',
    unitRo: 'U4 · Bucle Repetitive',
    unitEn: 'U4 · Repetitive Loops',
    diplomaTitleRo: 'Diplomă Bucle while & Cifrele Numărului',
    diplomaTitleEn: 'While Loop & Digits Master Diploma',
  },
  {
    id: 'g7_stem_a',
    lessonsKey: 'g7_stem_a',
    localPrefix: 'g7stem',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M4E',
    emoji: '🧪',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Bucle for, do-while & Aplicații STEM',
    titleEn: 'For Loop, do-while & STEM in C++',
    unitRo: 'U4 · Aplicații STEM',
    unitEn: 'U4 · STEM Coding',
    diplomaTitleRo: 'Diplomă Programare STEM & Bucle for C++',
    diplomaTitleEn: 'STEM C++ Loops Diploma',
  },
  {
    id: 'g7_robot_b',
    lessonsKey: 'g7_robot_b',
    localPrefix: 'g7robot',
    gradeNum: 7,
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: '7th Grade',
    moduleCode: 'M4F',
    emoji: '🤖',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Robotică Educațională & Senzori Virtuali',
    titleEn: 'Educational Robotics & Sensors',
    unitRo: 'U4 · Absolvire Clasa VII',
    unitEn: 'U4 · Grade 7 Robotics',
    diplomaTitleRo: 'Diplomă Robotică Educațională Clasa VII',
    diplomaTitleEn: 'Educational Robotics Grade 7 Diploma',
  },

  // ================= CLASA A VIII-A (14 MISIUNI) =================
  {
    id: 'g8_calc_a',
    lessonsKey: 'g8_calc_a',
    localPrefix: 'g8_calc_a',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M1A',
    emoji: '📊',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Interfața Excel & Registru de Calcul',
    titleEn: 'Excel Interface & Workbook',
    unitRo: 'U1 · Calcul Tabelar',
    unitEn: 'U1 · Spreadsheets',
    diplomaTitleRo: 'Diplomă Specialist Foi de Calcul Excel',
    diplomaTitleEn: 'Certified Spreadsheet Specialist Diploma',
  },
  {
    id: 'g8_calc_b',
    lessonsKey: 'g8_calc_b',
    localPrefix: 'g8_calc_b',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M1B',
    emoji: '🧮',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Formule, Funcții & Adresare Absolută ($)',
    titleEn: 'Formulas, Functions & Absolute Refs',
    unitRo: 'U1 · Formule Excel',
    unitEn: 'U1 · Excel Formulas',
    diplomaTitleRo: 'Diplomă Maestru în Formule & Funcții',
    diplomaTitleEn: 'Master of Formulas & Modeling Diploma',
  },
  {
    id: 'g8_calc_c',
    lessonsKey: 'g8_calc_c',
    localPrefix: 'g8_calc_c',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M1C',
    emoji: '🚦',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Funcții Condiționale IF / COUNTIF & Filtre',
    titleEn: 'Conditional Logic IF / COUNTIF',
    unitRo: 'U1 · Analiză Date',
    unitEn: 'U1 · Data Logic',
    diplomaTitleRo: 'Diplomă Analist Date & Funcții IF',
    diplomaTitleEn: 'Data Analyst & IF Logic Diploma',
  },
  {
    id: 'g8_calc_d',
    lessonsKey: 'g8_calc_d',
    localPrefix: 'g8_calc_d',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M1D',
    emoji: '📈',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Diagrame 2D/3D & Vizualizare Date',
    titleEn: '2D/3D Charts & Data Visualization',
    unitRo: 'U1 · Diagrame Statistice',
    unitEn: 'U1 · Charts & Graphs',
    diplomaTitleRo: 'Diplomă Arhitect de Diagrame Excel',
    diplomaTitleEn: 'Chart Architect & Visualizer Diploma',
  },
  {
    id: 'g8_web_a',
    lessonsKey: 'g8_web_a',
    localPrefix: 'g8_web_a',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M2A',
    emoji: '🌐',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Structură Site & Google Sites',
    titleEn: 'Web Structure & Google Sites',
    unitRo: 'U2 · Pagini Web',
    unitEn: 'U2 · Web Design',
    diplomaTitleRo: 'Diplomă Web Designer Google Sites',
    diplomaTitleEn: 'Google Sites Web Designer Diploma',
  },
  {
    id: 'g8_web_b',
    lessonsKey: 'g8_web_b',
    localPrefix: 'g8_web_b',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M2B',
    emoji: '🧩',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Integrare Multimedia & Servicii Cloud',
    titleEn: 'Cloud Media & HTML5 Integration',
    unitRo: 'U2 · Media Web',
    unitEn: 'U2 · Multimedia Web',
    diplomaTitleRo: 'Diplomă Dezvoltator Multimedia Web',
    diplomaTitleEn: 'Multimedia Developer & Cloud Diploma',
  },
  {
    id: 'g8_web_c',
    lessonsKey: 'g8_web_c',
    localPrefix: 'g8_web_c',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M2C',
    emoji: '🚀',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Publicare Web, Domenii & Securitate GDPR',
    titleEn: 'Web Publishing, HTTPS & GDPR',
    unitRo: 'U2 · Publicare & Etică',
    unitEn: 'U2 · Publishing & Safety',
    diplomaTitleRo: 'Diplomă Administrator Web & Securitate',
    diplomaTitleEn: 'Web Administrator & Digital Safety Diploma',
  },
  {
    id: 'g8_algo_a',
    lessonsKey: 'g8_algo_a',
    localPrefix: 'g8_algo_a',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M3A',
    emoji: '🔢',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'C++ Prelucrarea Cifrelor & CNP',
    titleEn: 'C++ Digit Processing & Palindromes',
    unitRo: 'U3 · Algoritmi C++',
    unitEn: 'U3 · C++ Algorithms',
    diplomaTitleRo: 'Diplomă Programator C++ · Prelucrare Cifre',
    diplomaTitleEn: 'C++ Digit Processing Specialist Diploma',
  },
  {
    id: 'g8_algo_b',
    lessonsKey: 'g8_algo_b',
    localPrefix: 'g8_algo_b',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M3B',
    emoji: '🌀',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'C++ Șiruri Numerice & Fibonacci',
    titleEn: 'C++ Number Sequences & Fibonacci',
    unitRo: 'U3 · Șiruri & Recurențe',
    unitEn: 'U3 · Sequences',
    diplomaTitleRo: 'Diplomă Algoritmist C++ · Șiruri & Fibonacci',
    diplomaTitleEn: 'C++ Sequences & Fibonacci Diploma',
  },
  {
    id: 'g8_algo_c',
    lessonsKey: 'g8_algo_c',
    localPrefix: 'g8_algo_c',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M3C',
    emoji: '🏆',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'C++ Extremum Min/Max & Poziții',
    titleEn: 'C++ Extremum Min/Max & Search',
    unitRo: 'U3 · Analiză Extremum',
    unitEn: 'U3 · Min/Max & Positions',
    diplomaTitleRo: 'Diplomă C++ Extremum Min/Max & Poziții',
    diplomaTitleEn: 'C++ Extremum Min/Max Diploma',
  },
  {
    id: 'g8_algo_d',
    lessonsKey: 'g8_algo_d',
    localPrefix: 'g8_algo_d',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M3D',
    emoji: '📡',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'C++ Vectori, Filtrare & Sortare',
    titleEn: 'C++ Arrays, Sorting & Binary Search',
    unitRo: 'U3 · Tablouri Unidimensionale',
    unitEn: 'U3 · 1D Arrays & Sorting',
    diplomaTitleRo: 'Diplomă C++ Tablouri, Filtrare & Sortare',
    diplomaTitleEn: 'C++ Arrays & Sorting Diploma',
  },
  {
    id: 'g8_algo_e',
    lessonsKey: 'g8_algo_e',
    localPrefix: 'g8_algo_e',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M3E',
    emoji: '🎓',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'C++ Subprograme & Proiect Integrator',
    titleEn: 'C++ Subprograms & Capstone Project',
    unitRo: 'U3 · Modularizare C++',
    unitEn: 'U3 · Modular C++',
    diplomaTitleRo: 'Diplomă C++ Subprograme & Proiect Liceu',
    diplomaTitleEn: 'C++ Subprograms & Integrator Diploma',
  },
  {
    id: 'g8_robot_a',
    lessonsKey: 'g8_robot_a',
    localPrefix: 'g8_robot_a',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M4A',
    emoji: '🦾',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Robotică Arduino Uno & Senzori HC-SR04',
    titleEn: 'Arduino Robotics & HC-SR04 Sensors',
    unitRo: 'U4 · Robotică Embedded',
    unitEn: 'U4 · Robotics & Arduino',
    diplomaTitleRo: 'Diplomă Inginer Robotică & Arduino Uno',
    diplomaTitleEn: 'Robotics & Microcontrollers Engineer Diploma',
  },
  {
    id: 'g8_robot_b',
    lessonsKey: 'g8_robot_b',
    localPrefix: 'g8_robot_b',
    gradeNum: 8,
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: '8th Grade',
    moduleCode: 'M4B',
    emoji: '🏙️',
    maxLevels: 7,
    maxScore: 100,
    titleRo: 'Smart Home, IoT & Absolvire Gimnaziu',
    titleEn: 'Smart Home, IoT & Graduation',
    unitRo: 'U4 · Absolvire Gimnaziu',
    unitEn: 'U4 · Gymnasium Graduation',
    diplomaTitleRo: 'Marea Diplomă de Absolvire Gimnaziu • IoT',
    diplomaTitleEn: 'Grand Graduation Diploma • Smart City IoT',
  },
];

export const MISSION_META_BY_ID: Record<string, CarnetMissionMeta> = CARNET_MISSIONS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, CarnetMissionMeta>
);

export interface MissionProgressSnapshot {
  meta: CarnetMissionMeta;
  status: 'completed' | 'in_progress' | 'not_started';
  level: number;
  score: number;
  nota: number;
  calificativRo: string;
  calificativEn: string;
  elapsedSeconds: number;
}

export function getMissionProgressSnapshot(
  meta: CarnetMissionMeta,
  profile: StudentProfile | null
): MissionProgressSnapshot {
  const lpEntry = profile?.lessonsProgress?.[meta.lessonsKey];

  let localCompleted = false;
  let localLevel = 1;
  let localScore = 0;
  let localElapsed = 0;

  try {
    localCompleted = localStorage.getItem(`arkedo_completed_${meta.id}`) === 'true';
    const rawLevel = localStorage.getItem(`arkedo_${meta.localPrefix}_level`);
    const rawScore = localStorage.getItem(`arkedo_${meta.localPrefix}_score`);
    const rawElapsed = localStorage.getItem(`arkedo_${meta.localPrefix}_elapsed`);
    if (rawLevel) localLevel = Math.max(1, Number(rawLevel) || 1);
    if (rawScore) localScore = Math.max(0, Number(rawScore) || 0);
    if (rawElapsed) localElapsed = Math.max(0, Number(rawElapsed) || 0);
  } catch {}

  const cloudCompleted = Boolean(lpEntry?.completed);
  const cloudLevel = lpEntry?.level || 1;
  const cloudScore = lpEntry?.score || 0;
  const cloudElapsed = lpEntry?.elapsedSeconds || 0;

  const level = Math.max(localLevel, cloudLevel);
  const completed = localCompleted || cloudCompleted || level > meta.maxLevels;
  const rawScore = Math.max(localScore, cloudScore);
  const score = completed && rawScore === 0 ? 100 : Math.min(100, rawScore);
  const elapsedSeconds = Math.max(localElapsed, cloudElapsed);

  const status: MissionProgressSnapshot['status'] = completed
    ? 'completed'
    : level > 1 || score > 0
    ? 'in_progress'
    : 'not_started';

  const gradeInfo = computeGradeDetails(score, meta.maxScore);

  return {
    meta,
    status,
    level,
    score,
    nota: status === 'not_started' ? 0 : gradeInfo.grade,
    calificativRo: gradeInfo.calificativRo,
    calificativEn: gradeInfo.calificativEn,
    elapsedSeconds,
  };
}

export function getAllMissionSnapshots(profile: StudentProfile | null): MissionProgressSnapshot[] {
  return CARNET_MISSIONS.map((m) => getMissionProgressSnapshot(m, profile));
}

export async function backfillMissingDiplomas(
  profile: StudentProfile | null,
  results: StudentResult[],
  fallbackStudentName: string
): Promise<Record<string, StudentDiploma>> {
  const existingDiplomas = getStudentDiplomas();
  const snapshots = getAllMissionSnapshots(profile);
  const displayName = (profile?.username || fallbackStudentName || 'Elev ArkyEdu').trim();

  let updated = { ...existingDiplomas };

  for (const snap of snapshots) {
    if (snap.status !== 'completed') continue;
    if (updated[snap.meta.id]) continue;

    // Look for a matching official result to enrich timestamp & score
    const matchingResult = results.find((r) => {
      const titleLower = (r.courseTitle || '').toLowerCase();
      return (
        titleLower.includes(snap.meta.id.toLowerCase()) ||
        titleLower.includes(snap.meta.moduleCode.toLowerCase()) ||
        titleLower.includes(snap.meta.titleRo.toLowerCase().slice(0, 14)) ||
        titleLower.includes(snap.meta.titleEn.toLowerCase().slice(0, 14))
      );
    });

    const bestScore = Math.max(snap.score, matchingResult?.score || 0) || 100;
    const gradeDetails = computeGradeDetails(bestScore, snap.meta.maxScore);
    const diploma: StudentDiploma = {
      id: snap.meta.id,
      courseId: snap.meta.id,
      titleRo: snap.meta.diplomaTitleRo,
      titleEn: snap.meta.diplomaTitleEn,
      grade: snap.meta.gradeLabelRo,
      studentName: displayName,
      awardedAt: profile?.lastActiveAt || new Date().toISOString(),
      score: bestScore,
      maxScore: snap.meta.maxScore,
      calificativ: gradeDetails.calificativRo,
      timeSpentSeconds: Math.max(snap.elapsedSeconds, matchingResult?.elapsedSeconds || 0),
      officialRef: `ARKY-${snap.meta.gradeNum}-${snap.meta.moduleCode}-${bestScore}`
    };

    updated[snap.meta.id] = diploma;
    await saveStudentDiploma(diploma);
  }

  return updated;
}

export interface ArcadeGameCatalogEntry {
  key: keyof Omit<ArcadeScores, 'totalArcade'>;
  nameRo: string;
  nameEn: string;
  emoji: string;
  category: 'retro' | 'logic' | 'cyber' | 'agility';
  unitLabel?: string;
}

export const ARCADE_CATALOG_ENTRIES: ArcadeGameCatalogEntry[] = [
  { key: 'typing', nameRo: 'Vitezomanul Tastaturii', nameEn: 'Keyboard Speedster', emoji: '⌨️', category: 'agility', unitLabel: 'WPM' },
  { key: 'mouse', nameRo: 'Maestrul Mouse-ului', nameEn: 'Mouse Agility Master', emoji: '🖱️', category: 'agility' },
  { key: 'mouse_v2', nameRo: 'Mouse Master 2.0 PRO', nameEn: 'Mouse Master 2.0 PRO', emoji: '🎯', category: 'agility' },
  { key: 'game2048', nameRo: '2048 Bitwise', nameEn: '2048 Bitwise', emoji: '🔢', category: 'logic' },
  { key: 'pcbuilder', nameRo: 'PC Builder Tycoon', nameEn: 'PC Builder Tycoon', emoji: '🖥️', category: 'cyber' },
  { key: 'detective', nameRo: 'Detectiv Cyber-Safe', nameEn: 'Cyber-Safe Detective', emoji: '🕵️', category: 'cyber' },
  { key: 'files', nameRo: 'Sortatorul de Fișiere', nameEn: 'File Organizer', emoji: '📂', category: 'agility' },
  { key: 'binary_factory', nameRo: 'Fabrica Binară', nameEn: 'Binary Factory', emoji: '⚡', category: 'logic' },
  { key: 'maze', nameRo: 'Labirintul Algoritmic', nameEn: 'Algorithm Maze', emoji: '🧭', category: 'logic' },
  { key: 'firewall', nameRo: 'Firewall Defender', nameEn: 'Firewall Defender', emoji: '🛡️', category: 'cyber' },
  { key: 'rgb_pixel', nameRo: 'RGB Pixel Master', nameEn: 'RGB Pixel Master', emoji: '🎨', category: 'agility' },
  { key: 'byte_slider', nameRo: 'Byte Slider Puzzle', nameEn: 'Byte Slider Puzzle', emoji: '🧩', category: 'logic' },
  { key: 'file_drop', nameRo: 'File-Drop Tetris', nameEn: 'File-Drop Tetris', emoji: '📥', category: 'agility' },
  { key: 'virus_sweeper', nameRo: 'Virus Sweeper', nameEn: 'Virus Sweeper', emoji: '💣', category: 'cyber' },
  { key: 'cyber_dino', nameRo: 'Cyber Dino Matrix', nameEn: 'Cyber Dino Matrix', emoji: '🦖', category: 'retro' },
  { key: 'redstone_lab', nameRo: 'Redstone Logic Lab', nameEn: 'Redstone Logic Lab', emoji: '🔴', category: 'logic' },
  { key: 'voxel_architect', nameRo: 'Minecraft Voxel Architect', nameEn: 'Minecraft Voxel Architect', emoji: '⛏️', category: 'cyber' },
  { key: 'roblox_clicker', nameRo: 'Roblox Clicker Arena', nameEn: 'Roblox Clicker Arena', emoji: '🎮', category: 'agility' },
  { key: 'page_craft', nameRo: 'PageCraft Editor', nameEn: 'PageCraft Editor', emoji: '📰', category: 'agility' },
  { key: 'hacker_defense', nameRo: 'Hacker vs Defender', nameEn: 'Hacker vs Defender', emoji: '⚔️', category: 'cyber' },
  { key: 'cyber_snake', nameRo: 'Cyber Snake Algoritmic', nameEn: 'Cyber Snake', emoji: '🐍', category: 'logic' },
  { key: 'circuit_master', nameRo: 'Circuit Master 80s', nameEn: 'Circuit Master 80s', emoji: '🔌', category: 'cyber' },
  { key: 'cyber_invaders', nameRo: 'Cyber Space Invaders', nameEn: 'Cyber Space Invaders', emoji: '👾', category: 'retro' },
  { key: 'cyber_pacman', nameRo: 'Cyber Pac-Man Bit', nameEn: 'Cyber Pac-Man Bit', emoji: '🟡', category: 'retro' },
  { key: 'cyber_arkanoid', nameRo: 'Cyber Arkanoid', nameEn: 'Cyber Arkanoid', emoji: '🧱', category: 'retro' },
  { key: 'cyber_frogger', nameRo: 'Cyber Frogger Network', nameEn: 'Cyber Frogger Network', emoji: '🐸', category: 'retro' },
  { key: 'cyber_sokoban', nameRo: 'Cyber Sokoban Server', nameEn: 'Cyber Sokoban Server', emoji: '📦', category: 'retro' },
  { key: 'cyber_asteroids', nameRo: 'Cyber Asteroids 1979', nameEn: 'Cyber Asteroids 1979', emoji: '🚀', category: 'retro' },
];

export interface CarnetBadgeDef {
  id: string;
  emoji: string;
  titleRo: string;
  titleEn: string;
  descRo: string;
  descEn: string;
  unlocked: boolean;
  current: number;
  target: number;
  accent: 'emerald' | 'amber' | 'cyan' | 'purple' | 'rose' | 'teal';
}

export function getSandboxSolvedCount(): number {
  try {
    const raw = localStorage.getItem('arkedo_sandbox_solved_ids');
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export function computeCarnetBadges(params: {
  snapshots: MissionProgressSnapshot[];
  arcadeScores: Partial<ArcadeScores>;
  duelWins: number;
  cityScore: number;
  sandboxSolvedCount: number;
  streakBest: number;
  diplomasCount: number;
  averageNota: number;
}): CarnetBadgeDef[] {
  const completedAll = params.snapshots.filter((s) => s.status === 'completed');
  const g5Done = completedAll.filter((s) => s.meta.gradeNum === 5).length;
  const g6Done = completedAll.filter((s) => s.meta.gradeNum === 6).length;
  const g7Done = completedAll.filter((s) => s.meta.gradeNum === 7).length;
  const g8Done = completedAll.filter((s) => s.meta.gradeNum === 8).length;

  const arcadeGamesPlayed = ARCADE_CATALOG_ENTRIES.filter(
    (g) => Number(params.arcadeScores?.[g.key] || 0) > 0
  ).length;

  return [
    {
      id: 'first_mission',
      emoji: '🚀',
      titleRo: 'Primul Pas în TIC',
      titleEn: 'First Step in ICT',
      descRo: 'Finalizează prima ta misiune oficială',
      descEn: 'Complete your first official mission',
      unlocked: completedAll.length >= 1,
      current: Math.min(1, completedAll.length),
      target: 1,
      accent: 'emerald',
    },
    {
      id: 'grade5_master',
      emoji: '🏫',
      titleRo: 'Campion Clasa a V-a',
      titleEn: '5th Grade Champion',
      descRo: 'Finalizează toate cele 10 misiuni de Clasa a V-a',
      descEn: 'Complete all 10 Grade 5 missions',
      unlocked: g5Done >= 10,
      current: g5Done,
      target: 10,
      accent: 'teal',
    },
    {
      id: 'grade6_master',
      emoji: '📽️',
      titleRo: 'Explorator Clasa a VI-a',
      titleEn: '6th Grade Explorer',
      descRo: 'Finalizează toate cele 8 misiuni de Clasa a VI-a',
      descEn: 'Complete all 8 Grade 6 missions',
      unlocked: g6Done >= 8,
      current: g6Done,
      target: 8,
      accent: 'cyan',
    },
    {
      id: 'grade7_master',
      emoji: '⚙️',
      titleRo: 'Programator Clasa a VII-a',
      titleEn: '7th Grade Coder',
      descRo: 'Finalizează toate cele 12 misiuni de Clasa a VII-a',
      descEn: 'Complete all 12 Grade 7 missions',
      unlocked: g7Done >= 12,
      current: g7Done,
      target: 12,
      accent: 'purple',
    },
    {
      id: 'grade8_master',
      emoji: '🎓',
      titleRo: 'Absolvent de Onoare VIII',
      titleEn: '8th Grade Honors',
      descRo: 'Finalizează toate cele 14 misiuni de Clasa a VIII-a',
      descEn: 'Complete all 14 Grade 8 missions',
      unlocked: g8Done >= 14,
      current: g8Done,
      target: 14,
      accent: 'amber',
    },
    {
      id: 'honor_roll',
      emoji: '⭐',
      titleRo: 'Elev de Nota 9+',
      titleEn: 'Honor Roll 9+',
      descRo: 'Obține media generală ≥ 9.00 (min. 2 misiuni)',
      descEn: 'Achieve ≥ 9.00 GPA (min. 2 missions)',
      unlocked: completedAll.length >= 2 && params.averageNota >= 9,
      current: completedAll.length >= 2 ? Math.min(10, Math.round(params.averageNota)) : 0,
      target: 9,
      accent: 'amber',
    },
    {
      id: 'diploma_collector',
      emoji: '🏅',
      titleRo: 'Colecționar de Diplome',
      titleEn: 'Diploma Collector',
      descRo: 'Strânge cel puțin 5 diplome oficiale ArkyEdu',
      descEn: 'Collect at least 5 official ArkyEdu diplomas',
      unlocked: params.diplomasCount >= 5,
      current: Math.min(5, params.diplomasCount),
      target: 5,
      accent: 'emerald',
    },
    {
      id: 'arcade_explorer',
      emoji: '🕹️',
      titleRo: 'Maestru Arcade',
      titleEn: 'Arcade Master',
      descRo: 'Înregistrează scoruri în cel puțin 6 jocuri Arcade',
      descEn: 'Record scores in at least 6 Arcade games',
      unlocked: arcadeGamesPlayed >= 6,
      current: Math.min(6, arcadeGamesPlayed),
      target: 6,
      accent: 'purple',
    },
    {
      id: 'duel_gladiator',
      emoji: '⚔️',
      titleRo: 'Gladiator Arena 1v1',
      titleEn: '1v1 Arena Gladiator',
      descRo: 'Câștigă cel puțin 3 dueluri multiplayer 1v1',
      descEn: 'Win at least 3 multiplayer 1v1 duels',
      unlocked: params.duelWins >= 3,
      current: Math.min(3, params.duelWins),
      target: 3,
      accent: 'rose',
    },
    {
      id: 'city_mayor',
      emoji: '🏙️',
      titleRo: 'Primar Smart City',
      titleEn: 'Smart City Mayor',
      descRo: 'Dezvoltă Orașul tău Cyber la peste 500 puncte',
      descEn: 'Grow your Cyber City past 500 points',
      unlocked: params.cityScore >= 500,
      current: Math.min(500, params.cityScore),
      target: 500,
      accent: 'cyan',
    },
    {
      id: 'sandbox_coder',
      emoji: '💻',
      titleRo: 'Creator Code Sandbox',
      titleEn: 'Code Sandbox Creator',
      descRo: 'Rezolvă cel puțin 3 provocări C++/Python/HTML',
      descEn: 'Solve at least 3 C++/Python/HTML challenges',
      unlocked: params.sandboxSolvedCount >= 3,
      current: Math.min(3, params.sandboxSolvedCount),
      target: 3,
      accent: 'teal',
    },
    {
      id: 'streak_hero',
      emoji: '🔥',
      titleRo: 'Constanță Exemplară',
      titleEn: 'Consistency Hero',
      descRo: 'Menține o serie activă de 5 zile consecutive',
      descEn: 'Reach a 5-day consecutive activity streak',
      unlocked: params.streakBest >= 5,
      current: Math.min(5, params.streakBest),
      target: 5,
      accent: 'amber',
    },
  ];
}

export interface DailyQuestDisplayItem {
  id: string;
  emoji: string;
  titleRo: string;
  titleEn: string;
  descRo: string;
  descEn: string;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
}

export function buildDailyQuestsDisplay(
  streak: DailyStreakInfo,
  quests: DailyQuestState
): DailyQuestDisplayItem[] {
  const checkedInToday = streak.lastActiveDate === quests.date || Boolean(quests.visitedCarnetToday);
  return [
    {
      id: 'daily_checkin',
      emoji: '📅',
      titleRo: 'Prezență Zilnică în Carnet',
      titleEn: 'Daily Portfolio Check-in',
      descRo: 'Verifică-ți progresul și menține seria activă',
      descEn: 'Review your progress and keep your streak alive',
      rewardCoins: 25,
      completed: checkedInToday,
      claimed: quests.claimedIds.includes('daily_checkin'),
    },
    {
      id: 'daily_arcade',
      emoji: '🕹️',
      titleRo: 'Antrenament Rapid Arcade',
      titleEn: 'Quick Arcade Warm-up',
      descRo: 'Înregistrează un scor nou în sala Arcade',
      descEn: 'Record a score in the Arcade Hub today',
      rewardCoins: 35,
      completed: Boolean(quests.playedArcadeToday),
      claimed: quests.claimedIds.includes('daily_arcade'),
    },
    {
      id: 'daily_mission',
      emoji: '🎓',
      titleRo: 'Misiune TIC Finalizată',
      titleEn: 'Complete an ICT Mission',
      descRo: 'Finalizează o lecție sau evaluare din catalog',
      descEn: 'Finish a curriculum mission or test today',
      rewardCoins: 60,
      completed: Boolean(quests.completedLessonToday),
      claimed: quests.claimedIds.includes('daily_mission'),
    },
  ];
}
