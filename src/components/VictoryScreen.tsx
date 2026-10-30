import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, RotateCcw, Star, Clock, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { useArky } from '../context/ArkyContext';
import { useHints } from '../context/HintContext';
import { MascotaArky } from './MascotaArky';
import { logStudentResult } from '../lib/resultsService';
import { saveStudentDiploma } from '../lib/studentAuthService';
import { computeGradeDetails } from '../utils/pedagogicalGrading';
import { AllMissionId } from '../types';

interface VictoryScreenProps {
  score: number;
  maxScore: number;
  studentName?: string;
  elapsedSeconds?: number;
  courseId?: AllMissionId | string;
  onReset: () => void;
  onBackToCatalog?: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  score,
  maxScore,
  studentName: initialStudentName = '',
  elapsedSeconds = 0,
  courseId = 'files',
  onReset,
  onBackToCatalog,
}) => {
  const { t, lang } = useLanguage();
  const arky = useArky();
  const { hintsCount } = useHints();
  const [studentName, setStudentName] = useState<string>(
    initialStudentName.trim() || t.vDiplomaDefaultName
  );
  const [isLoggedToFirebase, setIsLoggedToFirebase] = useState<boolean>(false);
  const hasLoggedRef = useRef<boolean>(false);

  const gradeDetails = computeGradeDetails(score, maxScore);

  const isHardware = courseId === 'hardware';
  const isInternet1 = courseId === 'internet1';
  const isInternet2 = courseId === 'internet2';
  const isText1 = courseId === 'text1';
  const isText2 = courseId === 'text2';
  const isAlgo1 = courseId === 'algo1';
  const isAlgo2 = courseId === 'algo2';
  const isScratch1 = courseId === 'scratch1';
  const isScratch2 = courseId === 'scratch2';
  const isG6P1 = courseId === 'g6_presentation1';
  const isG6P2 = courseId === 'g6_presentation2';
  const isG6P3 = courseId === 'g6_paint3d';
  const isG6M1 = courseId === 'g6_malware';
  const isG6A1 = courseId === 'g6_anim3d';
  const isG6E1 = courseId === 'g6_email';
  const isG6S1 = courseId === 'g6_scratch1';
  const isG7W1 = courseId === 'g7_word_a';
  const isG7W2 = courseId === 'g7_word_b';
  const isG7A1 = courseId === 'g7_audio_a';
  const isG7V2 = courseId === 'g7_video_b';
  const isG7C1 = courseId === 'g7_cloud_a';
  const isG7GIS = courseId === 'g7_gis_b';
  const isG8CalcA = courseId === 'g8_calc_a';
  const isG8CalcB = courseId === 'g8_calc_b';
  const isG8CalcC = courseId === 'g8_calc_c';
  const isG8CalcD = courseId === 'g8_calc_d';
  const isG8WebA = courseId === 'g8_web_a';
  const isG8WebB = courseId === 'g8_web_b';
  const isG8WebC = courseId === 'g8_web_c';
  const isG8AlgoA = courseId === 'g8_algo_a';
  const isG8AlgoB = courseId === 'g8_algo_b';
  const isG8AlgoC = courseId === 'g8_algo_c';
  const isG8AlgoD = courseId === 'g8_algo_d';
  const isG8AlgoE = courseId === 'g8_algo_e';

  const courseDbTitle = isHardware
    ? (lang === 'en' ? 'PC Architecture & Ergonomics Mission (Textbook pp. 10-20)' : 'Misiunea Sisteme de calcul și comunicații (Manual pag. 10-20)')
    : isInternet1
    ? (lang === 'en' ? 'Internet & Web Basics Mission 3A (Textbook pp. 32-36)' : 'Misiunea 3A Internet, Rețele & Web (Manual pag. 32-36)')
    : isInternet2
    ? (lang === 'en' ? 'Advanced Search & Digital Identity Mission 3B (Textbook pp. 38-48)' : 'Misiunea 3B Căutare Avansată, Comunicare & Identitate (Manual pag. 38-48)')
    : isText1
    ? (lang === 'en' ? 'Text Formatting & Word Basics Mission 4A (Textbook pp. 50-67)' : 'Misiunea 4A Inițierea și Formatarea Textului (Manual pag. 50-67)')
    : isText2
    ? (lang === 'en' ? 'Visual Elements & Tables Mission 4B (Textbook pp. 68-80)' : 'Misiunea 4B Elemente Grafice & Tabele (Manual pag. 68-80)')
    : isAlgo1
    ? (lang === 'en' ? 'Algorithm Concept & Sequential Logic Mission 5A (Textbook pp. 54-61)' : 'Misiunea 5A Noțiunea de Algoritm & Algoritmi Secvențiali (Manual pag. 54-61)')
    : isAlgo2
    ? (lang === 'en' ? 'Decisions, Data Types & Flowcharts Mission 5B (Textbook pp. 62-71)' : 'Misiunea 5B Structuri Decizionale, Date & Scheme Logice (Manual pag. 62-71)')
    : isScratch1
    ? (lang === 'en' ? 'Scratch 3.0 Environment & Variables Mission 6A (Textbook pp. 72-90)' : 'Misiunea 6A Mediul Scratch & Variabile (Manual pag. 72-90)')
    : isScratch2
    ? (lang === 'en' ? 'Scratch Decisions, Music & Games Mission 6B (Textbook pp. 84-93)' : 'Misiunea 6B Decizii, Muzică & Concurs Scratch (Manual pag. 84-93)')
    : isG6P1
    ? (lang === 'en' ? 'PowerPoint & Presentation Specialist (Grade 6 Textbook pp. 10-15)' : 'Operator Prezentări & PowerPoint (Clasa a VI-a Manual pag. 10-15)')
    : isG6P2
    ? (lang === 'en' ? 'Slide Creation & Public Speaking (Grade 6 Textbook pp. 16-25)' : 'Realizare Diapozitive & Public Speaking (Clasa a VI-a Manual pag. 16-25)')
    : isG6P3
    ? (lang === 'en' ? 'Paint 3D Modeling & 3D Creator (Grade 6 Textbook pp. 26-33)' : 'Modelare 3D în Paint 3D (Clasa a VI-a Manual pag. 26-33)')
    : isG6M1
    ? (lang === 'en' ? 'Malware Threats & Cyber Security (Grade 6 Textbook pp. 44-45)' : 'Amenințări Malware & Securitate Cibernetică (Clasa a VI-a Manual pag. 44-45)')
    : isG6A1
    ? (lang === 'en' ? 'Animation & VR World Creator (Grade 6 Textbook pp. 34-43)' : 'Animație Digitală & Realitate Virtuală (Clasa a VI-a Manual pag. 34-43)')
    : isG6E1
    ? (lang === 'en' ? 'Email, Netiquette & Cloud Sharing (Grade 6 Textbook pp. 46-55)' : 'Poștă Electronică, Netichetă & Cloud (Clasa a VI-a Manual pag. 46-55)')
    : isG6S1
    ? (lang === 'en' ? 'Scratch Loops & Conditional Algorithms (Grade 6 Textbook pp. 62-75)' : 'Bucle Condiționate & Algoritmi Scratch (Clasa a VI-a Manual pag. 62-75)')
    : isG7W1
    ? (lang === 'en' ? 'Word Processing & Romanian Typography (Grade 7 Textbook pp. 10-17)' : 'Tehnoredactare Avansată & Tipografie Românească (Clasa a VII-a Manual pag. 10-17)')
    : isG7W2
    ? (lang === 'en' ? 'Page Layout & Structured Documents (Grade 7 Textbook pp. 18-27)' : 'Machetare de Pagină & Documente Structurate (Clasa a VII-a Manual pag. 18-27)')
    : isG7A1
    ? (lang === 'en' ? 'Digital Acoustics & WavePad Audio Studio (Grade 7 Textbook pp. 28-35)' : 'Acustică Digitală & Studio WavePad (Clasa a VII-a Manual pag. 28-35)')
    : isG7V2
    ? (lang === 'en' ? 'Multitrack Video Editing & VideoPad Studio (Grade 7 Textbook pp. 36-47)' : 'Montaj Video Multitrack & Studio VideoPad (Clasa a VII-a Manual pag. 36-47)')
    : isG7C1
    ? (lang === 'en' ? 'Cloud Collaboration & Teamwork in Google Docs/Slides (Grade 7 Textbook pp. 48-56)' : 'Aplicații Colaborative în Cloud & Echipă (Clasa a VII-a Manual pag. 48-56)')
    : isG7GIS
    ? (lang === 'en' ? 'Geographic Information Systems (GIS) & Digital Cartography (Grade 7 Textbook pp. 57-63)' : 'Sisteme Informaționale Geografice (GIS) & Cartografie Digitală (Clasa a VII-a Manual pag. 57-63)')
    : isG8CalcA
    ? (lang === 'en' ? 'Excel Interface & Spreadsheets Mission 1A (Grade 8 Textbook pp. 12-20)' : 'Misiunea 1A Interfață Excel & Registre de Calcul (Clasa a VIII-a Manual pag. 12-20)')
    : isG8CalcB
    ? (lang === 'en' ? 'Excel Formulas & Absolute References Mission 1B (Grade 8 Textbook pp. 21-25)' : 'Misiunea 1B Formule, Funcții Standard & Adresare $ (Clasa a VIII-a Manual pag. 21-25)')
    : isG8CalcC
    ? (lang === 'en' ? 'Conditional Functions IF/COUNTIF Mission 1C (Grade 8 Textbook pp. 26-29)' : 'Misiunea 1C Funcții Logice IF/COUNTIF & Filtrare (Clasa a VIII-a Manual pag. 26-29)')
    : isG8CalcD
    ? (lang === 'en' ? 'Charts & Data Visualization Mission 1D (Grade 8 Textbook pp. 30-35)' : 'Misiunea 1D Diagrame & Reprezentare Grafică (Clasa a VIII-a Manual pag. 30-35)')
    : isG8WebA
    ? (lang === 'en' ? 'Web Structure & Navigation Mission 2A (Grade 8 Textbook pp. 36-43)' : 'Misiunea 2A Structură Site & Navigare Google Sites (Clasa a VIII-a Manual pag. 36-43)')
    : isG8WebB
    ? (lang === 'en' ? 'Cloud Media Integration Mission 2B (Grade 8 Textbook pp. 44-51)' : 'Misiunea 2B Integrare Media & Servicii Cloud Google (Clasa a VIII-a Manual pag. 44-51)')
    : isG8WebC
    ? (lang === 'en' ? 'Web Publishing & Digital Safety Mission 2C (Grade 8 Textbook pp. 52-57)' : 'Misiunea 2C Publicare, Domenii & Securitate Digitală (Clasa a VIII-a Manual pag. 52-57)')
    : isG8AlgoA
    ? (lang === 'en' ? 'C++ Digit Processing Mission 3A (Grade 8 Textbook pp. 58-69)' : 'Misiunea 3A C++ Prelucrarea Cifrelor unui Număr (Clasa a VIII-a Manual pag. 58-69)')
    : isG8AlgoB
    ? (lang === 'en' ? 'C++ Number Sequences & Fibonacci Mission 3B (Grade 8 Textbook pp. 70-77)' : 'Misiunea 3B C++ Șirul Fibonacci & Variabile Glisante (Clasa a VIII-a Manual pag. 70-77)')
    : isG8AlgoC
    ? (lang === 'en' ? 'C++ Extremum Min/Max & Positions Mission 3C (Grade 8 Textbook pp. 78-83)' : 'Misiunea 3C C++ Extremum Min/Max & Poziții (Clasa a VIII-a Manual pag. 78-83)')
    : isG8AlgoD
    ? (lang === 'en' ? 'Robotics & Autonomous Virtual Sensors Mission 3D (Grade 8 Textbook pp. 84-91)' : 'Misiunea 3D Robotică & Roboți Virtuali cu Senzori (Clasa a VIII-a Manual pag. 84-91)')
    : isG8AlgoE
    ? (lang === 'en' ? 'Grand Graduation Project: Preferred High School Mission 3E (Grade 8 Textbook pp. 92-96)' : 'Misiunea 3E Proiect Final „Liceul Preferat” & Absolvire Gimnaziu (Clasa a VIII-a Manual pag. 92-96)')
    : (lang === 'en' ? 'Secret Tree Mission (Textbook pp. 27-30)' : 'Misiunea Arborele Secret (Manual pag. 27-30)');


  const formatCompletionTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins === 0) return `${remainingSec} ${lang === 'en' ? 'sec' : 'sec'}`;
    return `${mins} ${lang === 'en' ? 'min' : 'min'} ${remainingSec} ${lang === 'en' ? 'sec' : 'sec'}`;
  };

  useEffect(() => {
    sounds.playVictory();
    arky.triggerFinished();

    // Ensure mission completed state is explicitly persisted to localStorage
    try {
      localStorage.setItem(`arkedo_completed_${courseId}`, 'true');
    } catch {}
    
    // Automatically log results to Firebase Firestore only once per active mission run
    const finalName = initialStudentName.trim() || studentName.trim() || (lang === 'en' ? 'Anonymous Student' : 'Elev Anonim');
    const sessionLogKey = `arkedo_victory_logged_${courseId}_${finalName}_${score}`;

    if (!hasLoggedRef.current && !sessionStorage.getItem(sessionLogKey)) {
      // Prevent spamming ghost submissions with 0 seconds from stale page reloads
      if (elapsedSeconds > 0 && finalName.toUpperCase() !== 'PRO') {
        hasLoggedRef.current = true;
        sessionStorage.setItem(sessionLogKey, 'true');

        logStudentResult(
          finalName,
          courseDbTitle,
          score,
          maxScore,
          elapsedSeconds
        ).then((docId) => {
          if (docId) {
            setIsLoggedToFirebase(true);
          }
        });
      } else {
        // 0s completion detected (stale reload or un-timed) - mark as handled without spamming DB
        hasLoggedRef.current = true;
        sessionStorage.setItem(sessionLogKey, 'true');
      }
    }

    // Launch festive confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 500);
      return () => clearTimeout(timeout);
    } catch {
      // Fallback
    }
  }, []);

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
      {/* Decorative Icon & Glow */}
      <div className="text-6xl sm:text-7xl mb-3 animate-float drop-shadow-xl inline-block">
        {isHardware ? '💻⚡' : isInternet1 ? '🌐🚀' : isInternet2 ? '🔍🔐' : isText1 ? '📝✨' : isText2 ? '📊🎨' : isAlgo1 ? '🧩⚡' : isAlgo2 ? '🚦📊' : isScratch1 ? '🐱🎨' : isScratch2 ? '🎮🎵' : isG6P1 ? '📽️✨' : isG6P2 ? '🎨🎤' : isG6P3 ? '🧊✨' : isG6M1 ? '🛡️⚡' : isG7W1 ? '📰🖋️' : isG7W2 ? '📐📑' : isG7A1 ? '🎙️📻' : isG7V2 ? '🎬📽️' : isG7C1 ? '👥☁️' : isG7GIS ? '🗺️🧭' : isG8CalcA ? '📊💻' : isG8CalcB ? '🧮✨' : isG8CalcC ? '🚦📈' : isG8CalcD ? '📊🥧' : isG8WebA ? '🌐📐' : isG8WebB ? '🧩☁️' : isG8WebC ? '🚀🛡️' : isG8AlgoA ? '🔢💻' : isG8AlgoB ? '🌀⚡' : isG8AlgoC ? '🏆🎯' : isG8AlgoD ? '🤖📡' : isG8AlgoE ? '🎓🌟' : '🌳✨'}
      </div>

      <div className="flex justify-center mb-2">
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm uppercase font-black tracking-widest border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
          <Award className="w-4 h-4 text-emerald-400" /> {t.vBadgeMission}
        </span>
      </div>

      <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 font-heading tracking-tight">
        {isHardware
          ? (lang === 'en' ? 'Congratulations, Hardware & ICT Technician!' : 'Felicitări, Tehnician Hardware & TIC!')
          : isInternet1
          ? (lang === 'en' ? 'Congratulations, Cyber & Web Explorer!' : 'Felicitări, Explorator Web & Cyber!')
          : isInternet2
          ? (lang === 'en' ? 'Congratulations, Digital Citizenship & Security Expert!' : 'Felicitări, Expert în Comunicare & Securitate Digitală!')
          : isText1
          ? (lang === 'en' ? 'Congratulations, Word Processor & Document Master!' : 'Felicitări, Maestru în Tehnoredactare & Documente Text!')
          : isText2
          ? (lang === 'en' ? 'Congratulations, Document Designer & Page Architect!' : 'Felicitări, Designer & Arhitect de Documente Text!')
          : isAlgo1
          ? (lang === 'en' ? 'Congratulations, Junior Algorithmist & Logic Pioneer!' : 'Felicitări, Junior Algoritmist & Pionier al Logicii!')
          : isAlgo2
          ? (lang === 'en' ? 'Congratulations, Logic Flowchart & Algorithm Master!' : 'Felicitări, Maestru în Scheme Logice & Algoritmi Decizionali!')
          : isScratch1
          ? (lang === 'en' ? 'Congratulations, Junior Scratch 3.0 Programmer!' : 'Felicitări, Programator Junior Scratch 3.0!')
          : isScratch2
          ? (lang === 'en' ? 'Congratulations, Master Game Developer & ICT Graduate!' : 'Felicitări, Maestru în Jocuri Scratch & Absolvent de Onoare!')
          : isG6P1
          ? (lang === 'en' ? 'Congratulations, Certified Junior PowerPoint Specialist!' : 'Felicitări, Operator Junior PowerPoint Certificat!')
          : isG6P2
          ? (lang === 'en' ? 'Congratulations, Master of Presentations & Public Speaking!' : 'Felicitări, Maestru al Prezentărilor & Public Speaking!')
          : isG6P3
          ? (lang === 'en' ? 'Congratulations, Certified Junior 3D Creator & Modeler!' : 'Felicitări, Creator & Modelator 3D Junior Certificat!')
          : isG6M1
          ? (lang === 'en' ? 'Congratulations, Certified Cyber Defender & Security Expert!' : 'Felicitări, Expert în Securitate Cibernetică & Protecție Digitală!')
          : isG7W1
          ? (lang === 'en' ? 'Congratulations, Certified Digital Typographer & Editor!' : 'Felicitări, Tehnoredactor & Editor Digital Certificat!')
          : isG7W2
          ? (lang === 'en' ? 'Congratulations, Document Architect & Page Layout Master!' : 'Felicitări, Arhitect de Documente & Machetare Tipografică!')
          : isG7A1
          ? (lang === 'en' ? 'Congratulations, Digital Sound Engineer & WavePad Producer!' : 'Felicitări, Inginer de Sunet & Specialist Acustică Digitală!')
          : isG7V2
          ? (lang === 'en' ? 'Congratulations, Certified Video Director & Editor!' : 'Felicitări, Regizor & Editor Video Digital Certificat!')
          : isG7C1
          ? (lang === 'en' ? 'Congratulations, Certified Cloud Collaboration Leader!' : 'Felicitări, Lider de Colaborare în Cloud & Echipă!')
          : isG7GIS
          ? (lang === 'en' ? 'Congratulations, Certified GIS Specialist & Digital Cartographer!' : 'Felicitări, Specialist GIS & Cartograf Digital Certificat!')
          : isG8CalcA
          ? (lang === 'en' ? 'Congratulations, Certified Excel & Spreadsheet Specialist!' : 'Felicitări, Specialist Certificat în Foi de Calcul Excel!')
          : isG8CalcB
          ? (lang === 'en' ? 'Congratulations, Master of Formulas & Mathematical Functions!' : 'Felicitări, Maestru în Formule & Funcții Matematice!')
          : isG8CalcC
          ? (lang === 'en' ? 'Congratulations, Data Analyst & Conditional Logic Master!' : 'Felicitări, Analist de Date & Maestru în Funcții Condiționale!')
          : isG8CalcD
          ? (lang === 'en' ? 'Congratulations, Chart Architect & Data Visualizer!' : 'Felicitări, Arhitect de Diagrame & Reprezentări Grafice!')
          : isG8WebA
          ? (lang === 'en' ? 'Congratulations, Certified Google Sites Web Designer!' : 'Felicitări, Web Designer Google Sites Certificat!')
          : isG8WebB
          ? (lang === 'en' ? 'Congratulations, Multimedia Developer & Cloud Integrator!' : 'Felicitări, Dezvoltator Multimedia & Integrator Cloud!')
          : isG8WebC
          ? (lang === 'en' ? 'Congratulations, Certified Web Administrator & Cyber Ethicist!' : 'Felicitări, Administrator Web & Specialist Securitate Digitală!')
          : isG8AlgoA
          ? (lang === 'en' ? 'Congratulations, C++ Programmer • Digit Processing Master!' : 'Felicitări, Programator C++ • Maestru în Prelucrarea Cifrelor!')
          : isG8AlgoB
          ? (lang === 'en' ? 'Congratulations, C++ Algorithmist • Sequences & Fibonacci Hero!' : 'Felicitări, Algoritmist C++ • Maestru în Șiruri & Fibonacci!')
          : isG8AlgoC
          ? (lang === 'en' ? 'Congratulations, C++ Search & Extremum Analytics Specialist!' : 'Felicitări, Specialist C++ în Căutare & Determinare Extremum!')
          : isG8AlgoD
          ? (lang === 'en' ? 'Congratulations, Certified Autonomous Robotics & Sensor Engineer!' : 'Felicitări, Inginer în Robotică Autonomă & Senzori Virtuali!')
          : isG8AlgoE
          ? (lang === 'en' ? 'Congratulations, Gymnasium Laureate & High School Candidate!' : 'Felicitări, Absolvent de Onoare al Gimnaziului • Informatică & TIC!')
          : t.vTitle}
      </h2>

      <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-3 mb-6 leading-relaxed">
        {isHardware
          ? (lang === 'en'
              ? 'You successfully passed the complete evaluation for Unit 1: you mastered lab safety, ergonomics, computer history, PC tower components, and digital bits calculation!'
              : 'Ai finalizat cu succes evaluarea completă a Unității 1: cunoști regulile de securitate, ergonomia, istoria calculatoarelor, piesele unității centrale și calculul biților!')
          : isInternet1
          ? (lang === 'en'
              ? 'You mastered the essentials of computer networks, Internet services (Email, WWW, FTP, Telnet, IRC), URL addresses, web browser navigation, and cybersecurity protection!'
              : 'Ai parcurs cu succes Modulul 3A: rețele de calculatoare, servicii internet (Email, WWW, FTP, Telnet, IRC), anatomia adreselor URL, utilizarea browserului și scutul de securitate cibernetică!')
          : isInternet2
          ? (lang === 'en'
              ? 'You mastered advanced search engines and boolean filters, source credibility and Fake News detection, professional email composition, netiquette, academic citation, and fortress passwords with 2FA!'
              : 'Ai parcurs cu brio Modulul 3B: motoare de căutare și operatori booleeni, evaluarea critică a surselor și detectarea Fake News, compunerea e-mailurilor (Cc, Bcc), netichetă, citarea surselor fără plagiat și parole de neclintit cu 2FA!')
          : isText1
          ? (lang === 'en'
              ? 'You mastered the word processor interface and ruler, golden typing rules, character formatting and scientific scripts, paragraph alignments and indents, lists, automated find and replace, and created the Digital Student Charter!'
              : 'Ai parcurs cu succes Modulul 4A: interfața procesorului de text și rigla, regulile de aur ale tehnoredactării, formatarea fonturilor și indici, alinierea paragrafelor și alineate, liste marcate și numerotate, găsire și înlocuire automată și Carta Elevului Digital!')
          : isText2
          ? (lang === 'en'
              ? 'You mastered table creation and formatting, cell merging, proportional image resizing, text wrapping styles (Square, Tight, Behind Text), geometric shapes and text boxes, and full A4 page setup with headers and automatic page numbers!'
              : 'Ai parcurs cu brio Modulul 4B: inserarea și formatarea tabelelor, îmbinarea celulelor, redimensionarea imaginilor fără distorsiune de proporții, încadrarea textului (Pătrat, Strâns, În spatele textului), forme geometrice și casete de text, alături de paginarea completă A4 cu antet, subsol și numerotare automată!')
          : isG7A1
          ? (lang === 'en'
              ? 'You successfully mastered sound physics (frequency in Hz, amplitude in dB), the Nyquist-Shannon sampling theorem (44.1 kHz, 16-bit, stereo), mathematical uncompressed WAV audio sizes vs MP3 compression, precision WavePad waveforms, Trim/Cut/Silence surgical editing, and produced a professional school radio jingle with Paste Mix!'
              : 'Ai finalizat cu succes evaluarea completă a Unității 2 (Aplicații audio): stăpânești fizica sunetului (frecvență în Hz, amplitudine în dB), teorema de eșantionare Nyquist-Shannon (44.1 kHz, 16 biți, stereo), calculul matematic al fișierelor WAV vs MP3, interfața WavePad, operațiile Trim/Cut/Silence și ai produs un jingle radio profesional prin tehnica Paste Mix!')
          : isG7V2
          ? (lang === 'en'
              ? 'You successfully mastered multitrack video editing: timeline track layering, surgical Split (L) & Ripple Delete, cinematic CrossFade transitions, Lower Third typography, background music ducking with Fade Out, Creative Commons licenses, and Full HD MP4 export!'
              : 'Ai finalizat cu succes evaluarea completă a Unității 2 (Montaj video): stăpânești ierarhia pistelor multitrack, tăierea chirurgicală Split (tasta L) & Ripple Delete, tranzițiile cinematice CrossFade, burtierele Lower Third, coloana sonoră CC-BY cu Ducking și Fade Out, alături de exportul MP4 Full HD!')
          : isAlgo1
          ? (lang === 'en'
              ? 'You mastered the definition and the 6 fundamental properties of algorithms, defeated the ambiguity trap, executed sequential linear algorithms, swapped variables with the 3-glasses rule (aux), encrypted messages via numeric substitution, and solved perimeter & area math algorithms!'
              : 'Ai finalizat cu succes Modulul 5A: stăpânești definiția și cele 6 proprietăți ale algoritmilor, eviți ambiguitățile, execuți algoritmi secvențiali, interschimbi variabile prin regula celor 3 pahare (aux), criptezi mesaje prin substituție numerică și calculezi aria și perimetrul!')
          : isAlgo2
          ? (lang === 'en'
              ? 'You mastered alternative decision structures (If... Then... Else), input/intermediate/output data, numeric/text/boolean types, arithmetic & relational operators, logic connectives (AND, OR, NOT) with truth tables, flowchart block diagrams, and trace tables!'
              : 'Ai finalizat cu brio Modulul 5B: stăpânești structura alternativă (Dacă... Atunci... Altfel), tipurile de date (numeric, text, logic), operatorii aritmetici și de comparație, conectivele logice (ȘI, SAU, NU) cu tabele de adevăr, schemele logice și tabelele de valori!')
          : isScratch1
          ? (lang === 'en'
              ? 'You mastered the Scratch 3.0 interface and coordinate stage (480x360), the 9 color-coded block categories, linear scripts with speech and sound, variables creation & watchers, arithmetic & text join blocks, and dynamic geometric drawings with the Pen extension!'
              : 'Ai finalizat cu succes Modulul 6A: stăpânești interfața Scratch 3.0 și coordonatele scenei (480x360), cele 9 categorii de blocuri colorate, scripturile liniare cu dialog și sunet, variabilele și monitoarele, operatorii matematici și alăturarea textelor, alături de desenele geometrice cu extensia Creion!')
          : isScratch2
          ? (lang === 'en'
              ? 'You mastered alternative decision blocks, maze games with color sensing, multiplication quizzes with user input and random numbers, digital instruments & MIDI music scales, multi-sprite contest games with timers, ecological stories, and passed the Grand Final Exam of 5th Grade!'
              : 'Ai finalizat cu brio Modulul 6B: stăpânești deciziile în Scratch, jocul labirint cu senzori de culoare, jocul tablei înmulțirii cu factori aleatorii și citire răspuns, extensia muzică și gama Do major, concursul de jocuri cu cronometru, povestea ecologică și Marea Evaluare Finală de Clasa a V-a!')
          : isG6P1
          ? (lang === 'en'
              ? 'You mastered PowerPoint launch modes, ribbon tabs, views, and commands from Textbook pp. 10-15!'
              : 'Ai parcurs cu succes Modulul 1A: cele 3 moduri de lansare PowerPoint, panglica de comenzi, filele specializate și modurile de vizualizare!')
          : isG6P2
          ? (lang === 'en'
              ? 'You mastered slide operations, multimedia, transitions, animations, the 40-word rule, and public speaking from Textbook pp. 16-25!'
              : 'Ai parcurs cu succes Modulul 1B: operațiile cu slide-uri, obiecte multimedia, tranzițiile, regula celor 40 de cuvinte și arta susținerii discursului!')
          : isG6P3
          ? (lang === 'en'
              ? 'You mastered 3D space (X, Y, Z), 4 control anchors, Make 3D, stickers, materials, video loops, and asset export from Textbook pp. 26-33!'
              : 'Ai finalizat cu succes Modulul 2A: spațiul tridimensional (X, Y, Z), cele 4 ancore de manipulare, Creare 3D, aplicarea stickerelor mulate, finisajele de materiale, animațiile automate și exportul 3D!')
          : isG6M1
          ? (lang === 'en'
              ? 'You mastered malware classification (Viruses, Worms, Trojans, Spyware, Ransomware), antivirus system scanning, quarantine isolation, firewall traffic rules, and bulletproof passwords with 2FA from Textbook pp. 44-45!'
              : 'Ai finalizat cu succes Modulul 3A: cunoști diferența dintre Viruși, Viermi, Troieni, Spyware și Ransomware, stăpânești scanarea antivirus și zona de carantină, filtrarea conexiunilor de rețea prin Firewall, parolele blindate și securizarea conturilor prin 2FA!')
          : isG7W1
          ? (lang === 'en'
              ? 'You mastered font anatomy, Romanian diacritic standards SR 13411, ruler paragraph metrics, hierarchical styles, batch Find & Replace, and editorial publication in PDF format from Grade 7 Textbook pp. 10-17!'
              : 'Ai finalizat cu succes Misiunea 1A (Clasa a VII-a): stăpânești familiile de fonturi, standardul românesc SR 13411 cu virgulă dedesubt, metrica paragrafelor pe riglă (1.25 cm), stilurile semantice Titlu 1 & 2, curățarea automată cu Ctrl+H și exportul PDF!')
          : isG7W2
          ? (lang === 'en'
              ? 'You mastered A4 page layout, gutter margins, Different First Page, Landscape section breaks, academic tables, and footnotes from Grade 7 Textbook pp. 18-27!'
              : 'Ai finalizat cu succes Misiunea 1B (Clasa a VII-a): stăpânești machetarea paginii A4, marginea de îndosariere (Gutter), antetul cu primă pagină diferită, ruperile de secțiune pentru tabele largi, alinierea la dreapta a numerelor și notele de subsol!')
          : isG7C1
          ? (lang === 'en'
              ? 'You successfully mastered Cloud Computing fundamentals, real-time autosave, the 3 permission levels (Viewer, Commenter, Editor), live multi-cursor synchronous editing, comments with @mentions, Suggesting mode, Version History disaster recovery, and team production in Google Slides!'
              : 'Ai finalizat cu succes evaluarea completă a Unității 3 (Aplicații colaborative în cloud): stăpânești arhitectura cloud și autosave-ul continuu, matricea celor 3 permisiuni (Viewer, Commenter, Editor), editarea sincronă cu cursori colorați, mențiunile cu @, modul de Sugestii, recuperarea prin Istoricul Versiunilor și realizarea prezentării în echipă în Google Slides!')
          : isG7GIS
          ? (lang === 'en'
              ? 'You successfully mastered Geographic Information Systems (GIS), thematic layer stacking, spatial vector primitives (Points, Lines, Polygons), attribute tables, GPS coordinates in Romania, 3D Google Earth exploration, emergency spatial routing, and cartographic privacy!'
              : 'Ai finalizat cu succes evaluarea completă a Unității 3B (GIS & Cartografie Digitală): stăpânești sistemele informaționale geografice, stiva straturilor tematice (Layers), formele geometrice vectoriale (Punct, Linie, Poligon), tabelele de atribute, coordonatele GPS ale României, explorarea 3D în Google Earth, analiza spațială pentru situații de urgență și protecția datelor de geolocație!')
          : isG8CalcA
          ? (lang === 'en'
              ? 'You successfully mastered spreadsheet essentials: workbook architecture, Ribbon commands, row/column boundaries (1M rows), cell addressing (B2), data types (numeric, text, currency), and sheet management!'
              : 'Ai finalizat cu succes Misiunea 1A: stăpânești registrul de calcul Excel (.xlsx), anatomia panglicii Ribbon, adresele de celule (B2), tipurile de date (numere, text, monedă), adăugarea și redenumirea foilor de lucru!')
          : isG8CalcB
          ? (lang === 'en'
              ? 'You successfully mastered Excel mathematical and statistical formulas: SUM, AVERAGE, MIN, MAX, COUNT, relative vs absolute addresses ($A$1), and error diagnostics (#DIV/0!, #NAME?, #REF!)!'
              : 'Ai finalizat cu succes Misiunea 1B: stăpânești formulele matematice, funcțiile SUM, AVERAGE, MIN, MAX, COUNT, diferența crucială dintre adresele relative și absolute ($A$1) și depanarea erorilor de calcul!')
          : isG8CalcC
          ? (lang === 'en'
              ? 'You successfully mastered conditional decision logic: IF function syntax, multiple criteria, conditional counting with COUNTIF, and column sorting and auto-filtering!'
              : 'Ai finalizat cu succes Misiunea 1C: stăpânești logica decizională cu funcția IF, ghilimelele pentru texte, numărarea condiționată COUNTIF, sortarea alfabetică/numerică și filtrele automate cu criterii multiple!')
          : isG8CalcD
          ? (lang === 'en'
              ? 'You successfully mastered chart design: column/bar histograms, line trend charts, 2D/3D pie proportions, data labels, series selection, and statistical data visualization!'
              : 'Ai finalizat cu succes Misiunea 1D: stăpânești diagramele în coloane/bare, liniile de evoluție în timp, diagramele circulare Pie 2D/3D, etichetele de date, legendele și reprezentarea vizuală a indicatorilor școlari!')
          : isG8WebA
          ? (lang === 'en'
              ? 'You successfully mastered Google Sites website creation: hierarchical page trees, 3-click navigation rule, custom headers, image carousels, and responsive design across desktop, tablet, and mobile!'
              : 'Ai finalizat cu succes Misiunea 2A: stăpânești crearea site-urilor în Google Sites, arborele ierarhic de pagini, regula celor 3 clicuri, tipurile de antet, caruselul de imagini și designul responsive pe desktop, tabletă și telefon!')
          : isG8WebB
          ? (lang === 'en'
              ? 'You successfully mastered cloud multimedia integration: embedding Google Forms, Slides presentations, Sheets tables, Google Maps, YouTube videos, and HTML/CSS iframe embeds with public access permissions!'
              : 'Ai finalizat cu succes Misiunea 2B: stăpânești integrarea conținutului multimedia din Google Drive (Formulare feedback, Prezentări Slides, Foi Sheets), hărți Google Maps, videoclipuri și cod HTML5/CSS3 prin iframe!')
          : isG8WebC
          ? (lang === 'en'
              ? 'You successfully mastered web publication workflows: domain management, viewing vs editing permission matrices, Creative Commons copyright compliance, and GDPR student privacy protection!'
              : 'Ai finalizat cu succes Misiunea 2C: stăpânești publicarea pe web a proiectului, matricea drepturilor de acces, configurarea adresei URL, respectarea drepturilor de autor și protecția strictă a datelor personale conform GDPR!')
          : isG8AlgoA
          ? (lang === 'en'
              ? 'You successfully mastered C++ integer digit processing: division / and modulo %, digit extraction, digit sum, even/odd counting, number inversion, palindrome validation, and 13-digit CNP parsing!'
              : 'Ai finalizat cu succes Misiunea 3A: stăpânești prelucrarea cifrelor unui număr în C++, operatorii / și %, descompunerea iterativă, suma cifrelor, oglinditul, testul de număr palindrom și decodificarea CNP-ului de 13 cifre!')
          : isG8AlgoB
          ? (lang === 'en'
              ? 'You successfully mastered number sequence generation: sliding variables without arrays, Fibonacci terms, arithmetic/geometric progressions, triangular numbers, and memory optimization!'
              : 'Ai finalizat cu succes Misiunea 3B: stăpânești generarea secvențelor de numere în C++, algoritmul variabilelor glisante (p, d, c), termenii șirului Fibonacci, progresiile aritmetice și numerele triunghiulare fără consum masiv de memorie!')
          : isG8AlgoC
          ? (lang === 'en'
              ? 'You successfully mastered search and extremum algorithms: minimum/maximum identification, safe initialization with first element, first/last occurrence position tracking, and statistical indicators!'
              : 'Ai finalizat cu succes Misiunea 3C: stăpânești determinarea valorilor extreme (minim și maxim) în C++, inițializarea corectă pentru numere negative, memorarea poziției de apariție și calculul mediilor condiționate!')
          : isG8AlgoD
          ? (lang === 'en'
              ? 'You successfully mastered educational robotics: Lego Mindstorms EV3 / NXT architectures, ultrasonic distance sensors, collision prevention thresholds, decision loops, and reactive state machines!'
              : 'Ai finalizat cu succes Misiunea 3D: stăpânești arhitectura roboților autonomi, senzorul ultrasonic de distanță, pragurile de siguranță la frânare, buclele de decizie în timp real și mașinile reactive de stări pentru evitarea coliziunilor!')
          : isG8AlgoE
          ? (lang === 'en'
              ? 'You successfully completed the Grand Graduation Project: Preferred High School! You integrated Excel admission grade calculators, Google Sites presentation web pages, and C++ admission prediction algorithms!'
              : 'Ai finalizat cu succes Misiunea 3E și Proiectul de Sinteză „Liceul Preferat”! Ai integrat foaia de calcul tabelar a mediilor de admitere 80/20, site-ul web de prezentare a profilului dorit și algoritmul C++ de predicție a șanselor de admitere!')
          : t.vDesc}
      </p>

      {/* Score & Statistics Summary Box */}
      <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-900/90 border border-amber-500/40 px-6 py-3.5 rounded-2xl mb-6 shadow-inner">
        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="flex text-amber-400 text-2xl gap-1">
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div className="text-left border-l border-slate-700 pl-4">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {t.vScoreLabel}
            </div>
            <div className="text-2xl font-black text-amber-300 font-heading">
              {score} / {maxScore} ({lang === 'en' ? gradeDetails.calificativEn : gradeDetails.calificativRo})
            </div>
          </div>
        </div>

        {/* Duration */}
        {elapsedSeconds > 0 && (
          <div className="text-left sm:border-l border-slate-700 sm:pl-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.vDurationLabel}</span>
            </div>
            <div className="text-lg font-black text-cyan-300 font-mono">
              {formatCompletionTime(elapsedSeconds)}
            </div>
          </div>
        )}

        {/* Hints Used Metric */}
        <div className="text-left sm:border-l border-slate-700 sm:pl-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'Hints Used' : 'Indicii folosite'}</span>
          </div>
          <div className="text-lg font-black font-mono">
            {hintsCount === 0 ? (
              <span className="text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 0 ({lang === 'en' ? 'Autonomous' : 'Autonom'})
              </span>
            ) : (
              <span className="text-amber-300">
                {hintsCount} {hintsCount === 1 ? (lang === 'en' ? 'hint' : 'indiciu') : (lang === 'en' ? 'hints' : 'indicii')}
              </span>
            )}
          </div>
        </div>
      </div>


      {/* Cloud Sync Status */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-sm">
          <CheckCircle2 className={`w-4 h-4 text-emerald-400 ${isLoggedToFirebase ? '' : 'animate-spin'}`} />
          <span>{isLoggedToFirebase ? t.vCloudSaved : t.vCloudSaving}</span>
        </div>
      </div>

      {/* Autoevaluation from manual page 30 */}
      <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-700 rounded-2xl p-5 mb-8 text-left">
        <div className="flex justify-between items-center mb-2.5 border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            {t.vAutoevalTitle}
          </span>
          <span className="text-xs text-emerald-400 font-bold font-mono">
            {t.vAutoevalTime}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mb-3">
          {t.vAutoevalQuestion}
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => sounds.playCorrect()}
            className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-500/80 text-emerald-200 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelExcited}</span>
          </button>
          <button
            onClick={() => sounds.playClick()}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelPleased}</span>
          </button>
          <button
            onClick={() => sounds.playClick()}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
          >
            <span>{t.vFeelSad}</span>
          </button>
        </div>
      </div>

      {/* Badges Earned Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-3xl mx-auto mb-8 text-left">
        {isHardware ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Lab Inspector' : 'Inspector TIC'}</div>
                <div className="text-[10px] text-emerald-400">{lang === 'en' ? 'Safety & Health' : 'Norme & Ergonomie'}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">⏳</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Chrononaut' : 'Crononaut'}</div>
                <div className="text-[10px] text-teal-400">{lang === 'en' ? '1642 - Pascaline' : '1642 - Pascalina'}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🖥️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'PC Assembler' : 'Asamblor PC'}</div>
                <div className="text-[10px] text-cyan-400">CPU, RAM, Mobo</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔌</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Flow Sorter' : 'Triere Flux'}</div>
                <div className="text-[10px] text-purple-400">{lang === 'en' ? 'Input / Output' : 'Intrare / Ieșire'}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Bits Master' : 'Maestru Biți'}</div>
                <div className="text-[10px] text-rose-400">1 TB = 1024 GB</div>
              </div>
            </div>
          </>
        ) : isInternet1 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Net Pioneer' : 'Pionier Rețele'}</div>
                <div className="text-[10px] text-teal-400">TCP/IP & ARPANET</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📡</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Services Pro' : 'Servicii Web'}</div>
                <div className="text-[10px] text-cyan-400">Email, WWW, FTP</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🧩</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Riddle Master' : 'Rebus Master'}</div>
                <div className="text-[10px] text-purple-400">TELNET Secret</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🧭</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Web Pilot' : 'Pilot Web'}</div>
                <div className="text-[10px] text-emerald-400">URL & Browser</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Cyber Shield' : 'Scut Cibernetic'}</div>
                <div className="text-[10px] text-rose-400">Parole & Antivirus</div>
              </div>
            </div>
          </>
        ) : isInternet2 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Search Master' : 'Maestru Căutare'}</div>
                <div className="text-[10px] text-teal-400">AND, OR, NOT, ""</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🕵️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Fact Checker' : 'Detectiv Fake News'}</div>
                <div className="text-[10px] text-cyan-400">CRAAP Test</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">✉️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Email Pro' : 'Expert E-mail'}</div>
                <div className="text-[10px] text-purple-400">Cc, Bcc & @</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Netiquette Lead' : 'Lider Netichetă'}</div>
                <div className="text-[10px] text-emerald-400">No Caps & Empathy</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? '2FA Shield' : 'Scut 2FA'}</div>
                <div className="text-[10px] text-rose-400">12+ Caractere</div>
              </div>
            </div>
          </>
        ) : isText1 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Ribbon & Ruler' : 'Interfață & Riglă'}</div>
                <div className="text-[10px] text-blue-400">Ribbon, File & Ruler</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">⌨️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Typing Hygiene' : 'Reguli de Aur'}</div>
                <div className="text-[10px] text-emerald-400">Spații & Semne</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔤</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Font Architect' : 'Stiluri & Fonturi'}</div>
                <div className="text-[10px] text-amber-400">Serif, Indici & Formule</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Alignment Pro' : 'Aliniere & Justify'}</div>
                <div className="text-[10px] text-cyan-400">Alineate & Liste</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Find & Replace' : 'Găsire & Înlocuire'}</div>
                <div className="text-[10px] text-purple-400">Ctrl+H & Carta Elevului</div>
              </div>
            </div>
          </>
        ) : isText2 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Table Architect' : 'Tabele & Structură'}</div>
                <div className="text-[10px] text-blue-400">Rânduri, Coloane & TAB</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Merge & Shading' : 'Îmbinare & Umbrire'}</div>
                <div className="text-[10px] text-indigo-400">Merge Cells & 9 Alinieri</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🖼️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Aspect Ratio Pro' : 'Proporții & Decupaj'}</div>
                <div className="text-[10px] text-emerald-400">Colțuri 1:1 & Crop</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📰</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Wrap Text Expert' : 'Încadrare Text'}</div>
                <div className="text-[10px] text-cyan-400">Pătrat, Strâns & Watermark</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">📄</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Page Master' : 'Paginare & Revista'}</div>
                <div className="text-[10px] text-teal-400">Antet, Subsol & A4</div>
              </div>
            </div>
          </>
        ) : isAlgo1 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🧩</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Step Architect' : 'Arhitect de Pași'}</div>
                <div className="text-[10px] text-amber-400">Definiție & Proprietăți</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Ambiguity Shield' : 'Filtru Ambiguități'}</div>
                <div className="text-[10px] text-orange-400">Claritate & Precizie</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🥛</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Swap Master' : 'Regula celor 3 Pahare'}</div>
                <div className="text-[10px] text-yellow-400">Interschimbare aux</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Cipher Hero' : 'Maestru Criptare'}</div>
                <div className="text-[10px] text-emerald-400">Substituție Numerică</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">📐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Math Coder' : 'Calcule Matematice'}</div>
                <div className="text-[10px] text-teal-400">Arie & Perimetru</div>
              </div>
            </div>
          </>
        ) : isAlgo2 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🚦</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Decision Pilot' : 'Pilot Decizional'}</div>
                <div className="text-[10px] text-purple-400">Dacă... Atunci... Altfel</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🏷️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Type Guru' : 'Tipuri de Date'}</div>
                <div className="text-[10px] text-indigo-400">Numeric, Text & Logic</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">➕</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Operators Ace' : 'As al Operatorilor'}</div>
                <div className="text-[10px] text-cyan-400">+, -, *, /, mod, div</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔀</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Logic Master' : 'Tabele de Adevăr'}</div>
                <div className="text-[10px] text-emerald-400">ȘI, SAU, NU</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Flowchart Pro' : 'Scheme & Traseu'}</div>
                <div className="text-[10px] text-rose-400">Flowchart & Trace Table</div>
              </div>
            </div>
          </>
        ) : isScratch1 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🐱</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Scratch Architect' : 'Mediul Scratch 3.0'}</div>
                <div className="text-[10px] text-amber-400">Interfață & Coordonate</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Palette Master' : '9 Categorii de Blocuri'}</div>
                <div className="text-[10px] text-purple-400">Puzzle & Comportamente</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Linear Script Pro' : 'RoboTIC se Prezintă'}</div>
                <div className="text-[10px] text-sky-400">Glisare, Dialog & Sunet</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Variable Expert' : 'Variabile & Monitoare'}</div>
                <div className="text-[10px] text-orange-400">Setează & Modifică cu</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">✒️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Magic Pen Artist' : 'Extensia Creion'}</div>
                <div className="text-[10px] text-teal-400">Desene Geometrice</div>
              </div>
            </div>
          </>
        ) : isScratch2 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Conditional Pro' : 'Decizii în Scratch'}</div>
                <div className="text-[10px] text-amber-400">Dacă... Atunci... Altfel</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Maze Navigator' : 'Labirint Inteligent'}</div>
                <div className="text-[10px] text-sky-400">Detectare Culori & Recul</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔢</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Math Game Maker' : 'Tabla Înmulțirii'}</div>
                <div className="text-[10px] text-emerald-400">Întreabă, Răspuns, Aleator</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎹</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Digital Musician' : 'Extensia Muzică MIDI'}</div>
                <div className="text-[10px] text-pink-400">Gama Do & Pădurea cu alune</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🎓</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Grade 5 Laureate' : 'Laureat Clasa a V-a'}</div>
                <div className="text-[10px] text-emerald-300">Curriculum TIC Integral</div>
              </div>
            </div>
          </>
        ) : isG6M1 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Antivirus Pro' : 'Scut Antivirus'}</div>
                <div className="text-[10px] text-emerald-400">{lang === 'en' ? 'Signatures & Scan' : 'Scanare & Baze'}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🧱</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Firewall Master' : 'Zid Firewall'}</div>
                <div className="text-[10px] text-teal-400">{lang === 'en' ? 'Packet Filtering' : 'Filtrare Porturi'}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎣</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Anti-Phishing' : 'Anti-Phishing'}</div>
                <div className="text-[10px] text-cyan-400">{lang === 'en' ? 'Trap Detector' : 'Capcane E-mail'}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? '2FA Fortress' : 'Fortăreață 2FA'}</div>
                <div className="text-[10px] text-purple-400">{lang === 'en' ? 'Bulletproof Auth' : 'Parole & OTP'}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Cyber Defender' : 'Cyber Defender'}</div>
                <div className="text-[10px] text-rose-400">{lang === 'en' ? 'Grade 6 Certified' : 'Clasa a VI-a'}</div>
              </div>
            </div>
          </>
        ) : isG7W1 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🖋️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Font Anatomy' : 'Anatomie Fonturi'}</div>
                <div className="text-[10px] text-blue-400">Serif, Sans & Mono</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🇷🇴</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'SR 13411 Rules' : 'Norme SR 13411'}</div>
                <div className="text-[10px] text-emerald-400">Virgule & Ghilimele „”</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Ruler & Indent' : 'Riglă & Paragraf'}</div>
                <div className="text-[10px] text-cyan-400">Alineat 1.25 cm & Justify</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📑</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Styles & TOC' : 'Stiluri & Cuprins'}</div>
                <div className="text-[10px] text-purple-400">Heading 1, 2 & Cuprins</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">📰</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Chief Editor' : 'Editor Certificat'}</div>
                <div className="text-[10px] text-amber-400">A4 Tipar & Export PDF</div>
              </div>
            </div>
          </>
        ) : isG7W2 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'A4 Margins' : 'Margini & Gutter'}</div>
                <div className="text-[10px] text-blue-400">210x297 mm & 1.5 cm</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📑</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Header & Footer' : 'Antet & Subsol'}</div>
                <div className="text-[10px] text-purple-400">Diff First & Odd/Even</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">✂️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Section Breaks' : 'Ruperi Secțiune'}</div>
                <div className="text-[10px] text-cyan-400">Landscape Hibrid</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Tables & Merge' : 'Tabele & Merge'}</div>
                <div className="text-[10px] text-emerald-400">Aliniere la Dreapta</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">📜</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Academic Notes' : 'Note de Subsol'}</div>
                <div className="text-[10px] text-amber-400">Alt+Ctrl+F Footnote</div>
              </div>
            </div>
          </>
        ) : isG7A1 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎙️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Acoustic Waves' : 'Frecvență & dB'}</div>
                <div className="text-[10px] text-amber-400">20–20.000 Hz & 0 dB</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Nyquist Theorem' : 'Eșantionare 44.1 kHz'}</div>
                <div className="text-[10px] text-cyan-400">16 biți & Stereo 2x</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">💾</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'WAV vs MP3' : 'Calcul WAV & MP3'}</div>
                <div className="text-[10px] text-emerald-400">PCM Liniar vs 128 kbps</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">✂️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Audio Surgery' : 'Chirurgie WavePad'}</div>
                <div className="text-[10px] text-rose-400">Trim vs Silence 0 dB</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">📻</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Paste Mix Studio' : 'Producător Jingle'}</div>
                <div className="text-[10px] text-purple-400">Fade In/Out & Normalizare</div>
              </div>
            </div>
          </>
        ) : isG7V2 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎞️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Multitrack Pro' : 'Piste Multitrack'}</div>
                <div className="text-[10px] text-rose-400">Video 1, 2 & Audio 1, 2</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">✂️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Split & Ripple' : 'Tăiere Split (L)'}</div>
                <div className="text-[10px] text-pink-400">Ripple Delete fără goluri</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'CrossFade 1.0s' : 'CrossFade 1.0s'}</div>
                <div className="text-[10px] text-amber-400">Dizolvare Cinematografică</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🏷️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Lower Third' : 'Burtieră & Titrări'}</div>
                <div className="text-[10px] text-cyan-400">Ctrl + B & Bandă Contrast</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🎬</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Video Director' : 'Regizor MP4 HD'}</div>
                <div className="text-[10px] text-emerald-400">Licențe Creative Commons</div>
              </div>
            </div>
          </>
        ) : isG7C1 ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">☁️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Cloud & Autosave' : 'Cloud & Autosave'}</div>
                <div className="text-[10px] text-emerald-400">Sync & No Loss</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Permission Matrix' : 'Matrice Permisiuni'}</div>
                <div className="text-[10px] text-teal-400">Viewer, Commenter & Editor</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Sync Cursors' : 'Cursori Sincroni'}</div>
                <div className="text-[10px] text-cyan-400">Prezență Live & Avatare</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? '@Mentions & Suggest' : 'Mențiuni @ & Sugestii'}</div>
                <div className="text-[10px] text-amber-400">Task-uri & Aprobare ✓</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">⏳</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Time Machine' : 'Mașina Timpului'}</div>
                <div className="text-[10px] text-emerald-300">Istoric Versiuni & Rollback</div>
              </div>
            </div>
          </>
        ) : isG7GIS ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🥞</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Layer Stacking' : 'Straturi Tematice'}</div>
                <div className="text-[10px] text-teal-400">Layers & Opacitate</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Spatial Vectors' : 'Vectori Spațiali'}</div>
                <div className="text-[10px] text-cyan-400">Punct, Linie, Poligon</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🛰️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'GPS Navigator' : 'Coordonate GPS'}</div>
                <div className="text-[10px] text-emerald-400">Latitudine & Longitudine</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Google Earth 3D' : 'Google Earth 3D'}</div>
                <div className="text-[10px] text-sky-400">Tilt, Busolă (R) & Riglă</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🚨</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Spatial Analysis' : 'Analiză Spațială'}</div>
                <div className="text-[10px] text-amber-300">Rute Urgență 112 & Smart City</div>
              </div>
            </div>
          </>
        ) : courseId?.startsWith('g8_calc') ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Excel Master' : 'Interfață & Registru'}</div>
                <div className="text-[10px] text-emerald-400">Workbook .xlsx & Foi</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🧮</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Formula Pro' : 'Formule & Adresare $'}</div>
                <div className="text-[10px] text-teal-400">SUM, AVERAGE & $A$1</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🚦</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Conditional Logic' : 'Funcții IF & COUNTIF'}</div>
                <div className="text-[10px] text-cyan-400">Logică & Burse</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Chart Architect' : 'Diagrame 2D/3D'}</div>
                <div className="text-[10px] text-purple-400">Coloane, Linii & Plăcintă</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'AutoFilter Pro' : 'Sortare & Filtrare'}</div>
                <div className="text-[10px] text-amber-300">Criterii & Top Elevi</div>
              </div>
            </div>
          </>
        ) : courseId?.startsWith('g8_web') ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Web Architect' : 'Structură Google Sites'}</div>
                <div className="text-[10px] text-sky-400">Arbore Pagini & Antet</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Responsive Pro' : 'Design Responsive'}</div>
                <div className="text-[10px] text-emerald-400">Desktop, Tablet & Mobil</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🧩</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Cloud Integrator' : 'Integrare Media'}</div>
                <div className="text-[10px] text-indigo-400">Forms, Slides & Maps</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">💻</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'HTML5 Embed' : 'Cod HTML & CSS'}</div>
                <div className="text-[10px] text-cyan-400">Iframe & Carusel Foto</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🚀</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Web Publisher' : 'Publicare & GDPR'}</div>
                <div className="text-[10px] text-rose-400">Domeniu & Siguranță</div>
              </div>
            </div>
          </>
        ) : isG8AlgoD ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Autonomous Robot' : 'Robot Autonom'}</div>
                <div className="text-[10px] text-emerald-400">Lego Mindstorms EV3</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📡</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Ultrasonic Eye' : 'Senzor Ultrasonic'}</div>
                <div className="text-[10px] text-cyan-400">Con Reflexie & cm</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🛑</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Emergency Brake' : 'Frânare Sigură'}</div>
                <div className="text-[10px] text-rose-400">Prag Inerție 15 cm</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Obstacle Avoidance' : 'Evitare Obstacol'}</div>
                <div className="text-[10px] text-teal-400">Viraje & Ocolire</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">⚙️</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'State Machine' : 'Mașină de Stări'}</div>
                <div className="text-[10px] text-amber-300">Decizii în Timp Real</div>
              </div>
            </div>
          </>
        ) : isG8AlgoE ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Gymnasium Laureate' : 'Absolvent de Onoare'}</div>
                <div className="text-[10px] text-amber-300">Final Clasa a VIII-a</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🏫</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Preferred High School' : 'Liceul Preferat'}</div>
                <div className="text-[10px] text-emerald-400">Proiect de Sinteză</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Admission Math' : 'Medie Admitere 80/20'}</div>
                <div className="text-[10px] text-teal-400">Excel & Diagrame</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">💻</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'C++ Predictor' : 'Predicție C++'}</div>
                <div className="text-[10px] text-indigo-400">Sondaj & Șanse Admitere</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">📜</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Grand Graduation' : 'Diploma de Merit'}</div>
                <div className="text-[10px] text-amber-400">Clasa V - VIII Încheiată</div>
              </div>
            </div>
          </>
        ) : courseId?.startsWith('g8_algo') ? (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔢</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Digit Processor' : 'Prelucrare Cifre'}</div>
                <div className="text-[10px] text-emerald-400">Operatorii / și %</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🌀</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Fibonacci Hero' : 'Șirul Fibonacci'}</div>
                <div className="text-[10px] text-cyan-400">Variabile Glisante (p,d,c)</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Extremum Finder' : 'Minim & Maxim'}</div>
                <div className="text-[10px] text-amber-300">Poziții Prim/Ultim</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'Palindrome Pro' : 'Oglindit & Palindrom'}</div>
                <div className="text-[10px] text-purple-400">Descompunere n &gt; 0</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🆔</span>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'en' ? 'CNP Parser' : 'Parser CNP 13 Cifre'}</div>
                <div className="text-[10px] text-teal-400">Sex & Data Nașterii</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">📁</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge1Title}</div>
                <div className="text-[10px] text-emerald-400">{t.vBadge1Sub}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge2Title}</div>
                <div className="text-[10px] text-teal-400">{t.vBadge2Sub}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">⚡️</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge3Title}</div>
                <div className="text-[10px] text-cyan-400">{t.vBadge3Sub}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge4Title}</div>
                <div className="text-[10px] text-purple-400">{t.vBadge4Sub}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-xs font-bold text-white">{t.vBadge5Title}</div>
                <div className="text-[10px] text-rose-400">{t.vBadge5Sub}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Arky Master Graduate Inline Greeting */}
      <div className="max-w-2xl mx-auto mb-8">
        <MascotaArky 
          state="finished" 
          position="inline" 
          customMessage={
            lang === 'en'
              ? 'Mission Accomplished! You are officially an ArkyEdu Master of Files & Tech! Print your diploma below! 🏆🎓'
              : 'Misiune îndeplinită cu succes! Ești oficial un Maestru ArkyEdu în Fișiere și Tehnologie! Printează diploma de mai jos! 🏆🎓'
          }
        />
      </div>

      {/* Printable ArkyEdu Diploma */}
      <div
        id="diploma-to-print"
        className="bg-gradient-to-tr from-amber-50 via-white to-amber-100 text-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border-4 border-amber-400 shadow-2xl text-center relative mb-8"
      >
        <div className="border-2 border-dashed border-amber-600/40 p-6 sm:p-8 rounded-2xl relative">
          {/* Header Diploma */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                {isHardware ? '💻' : isInternet1 ? '🌐' : isInternet2 ? '🔍' : isText1 ? '📝' : isText2 ? '📊' : isAlgo1 ? '🧩' : isAlgo2 ? '🚦' : isScratch1 ? '🐱' : isScratch2 ? '🎮' : isG6P1 ? '📽️' : isG6P2 ? '🎨' : isG6P3 ? '🧊' : isG6M1 ? '🛡️' : isG6A1 ? '🎬' : isG6E1 ? '📧' : isG6S1 ? '🐱' : isG7W1 ? '📰' : isG7W2 ? '📐' : isG7A1 ? '🎙️' : isG7V2 ? '🎬' : isG7C1 ? '👥' : isG7GIS ? '🗺️' : isG8CalcA ? '📊' : isG8CalcB ? '🧮' : isG8CalcC ? '🚦' : isG8CalcD ? '📈' : isG8WebA ? '🌐' : isG8WebB ? '🧩' : isG8WebC ? '🚀' : isG8AlgoA ? '🔢' : isG8AlgoB ? '🌀' : isG8AlgoC ? '🏆' : isG8AlgoD ? '🤖' : isG8AlgoE ? '🎓' : '🌳'}
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-widest">
                {t.schoolName}
              </span>
            </div>
            <div className="text-3xl">🏅</div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-wide text-slate-900 uppercase font-heading">
            {isHardware 
              ? t.hwDiplomaTitle 
              : isInternet1 
              ? t.internet1DiplomaTitle 
              : isInternet2 
              ? t.internet2DiplomaTitle 
              : isText1 
              ? t.text1DiplomaTitle 
              : isText2 
              ? t.text2DiplomaTitle 
              : isAlgo1
              ? (lang === 'en' ? 'Junior Algorithmist & Logic Pioneer Certificate' : 'Diplomă de Junior Algoritmist & Arhitect de Pași')
              : isAlgo2
              ? (lang === 'en' ? 'Algorithm Master & Logic Flowcharts Diploma' : 'Diplomă de Maestru în Scheme Logice & Algoritmi Decizionali')
              : isScratch1
              ? (lang === 'en' ? 'Scratch 3.0 Junior Developer Certificate' : 'Diplomă de Programator Junior Scratch 3.0 & Creator Vizual')
              : isScratch2
              ? (lang === 'en' ? 'Grade 5 Grand Diploma • Master Game Developer & ICT Laureate' : 'Marea Diplomă de Onoare Clasa a V-a • Dezvoltator de Jocuri & Maestru TIC')
              : isG6P1
              ? (lang === 'en' ? 'Junior PowerPoint Specialist Certificate' : 'Diplomă de Operator Junior PowerPoint & Prezentări')
              : isG6P2
              ? (lang === 'en' ? 'Public Speaking & Presentation Master Diploma' : 'Diplomă de Maestru în Prezentări & Public Speaking')
              : isG6P3
              ? (lang === 'en' ? 'Junior 3D Modeler & Creator Certificate' : 'Diplomă de Creator & Modelator 3D Junior')
              : isG6M1
              ? (lang === 'en' ? 'Cyber Security & Malware Defense Specialist Diploma' : 'Diplomă de Expert în Securitate Cibernetică & Protecție Digitală')
              : isG6A1
              ? (lang === 'en' ? 'Animation & VR World Creator Diploma' : 'Diplomă de Creator în Animație Digitală 24 FPS & Realitate Virtuală 360°')
              : isG6E1
              ? (lang === 'en' ? 'Netiquette, Email & Cloud Collaboration Certificate' : 'Diplomă de Specialist în Comunicare Electronică, Netichetă & Cloud')
              : isG6S1
              ? (lang === 'en' ? 'Scratch Loops & Conditional Algorithms Master Diploma' : 'Diplomă de Programator în Bucle Condiționate & Algoritmi Scratch')
              : isG7W1
              ? (lang === 'en' ? 'Digital Typographer & Chief Editor Diploma' : 'Diplomă de Tehnoredactor & Editor Șef Digital')
              : isG7W2
              ? (lang === 'en' ? 'Document Architect & Page Layout Master Diploma' : 'Diplomă de Arhitect de Documente & Machetare Tipografică')
              : isG7A1
              ? (lang === 'en' ? 'Digital Sound Engineer & Audio Producer Diploma' : 'Diplomă de Inginer de Sunet & Producător Audio Digital')
              : isG7V2
              ? (lang === 'en' ? 'Video Director & Multitrack Editor Diploma' : 'Diplomă de Regizor & Producător Video Digital')
              : isG7C1
              ? (lang === 'en' ? 'Cloud Collaboration & Team Project Master Diploma' : 'Diplomă de Coordonator & Specialist Proiecte în Cloud')
              : isG7GIS
              ? (lang === 'en' ? 'Digital Cartographer & GIS Spatial Analysis Master Diploma' : 'Diplomă de Cartograf Digital & Specialist Analiză Spațială GIS')
              : isG8CalcA
              ? (lang === 'en' ? 'Certified Spreadsheet & Excel Specialist Diploma' : 'Diplomă de Specialist în Foi de Calcul & Registre Excel')
              : isG8CalcB
              ? (lang === 'en' ? 'Master of Formulas & Mathematical Modeling Diploma' : 'Diplomă de Maestru în Formule & Modelare Matematică')
              : isG8CalcC
              ? (lang === 'en' ? 'Data Analyst & Conditional Logic Master Diploma' : 'Diplomă de Analist de Date & Funcții Condiționale IF')
              : isG8CalcD
              ? (lang === 'en' ? 'Chart Architect & Data Visualization Master Diploma' : 'Diplomă de Arhitect de Diagrame & Vizualizare Date')
              : isG8WebA
              ? (lang === 'en' ? 'Certified Google Sites Web Designer Diploma' : 'Diplomă de Web Designer & Arhitect Google Sites')
              : isG8WebB
              ? (lang === 'en' ? 'Multimedia Developer & Cloud Media Integrator Diploma' : 'Diplomă de Dezvoltator Multimedia & Integrator Cloud')
              : isG8WebC
              ? (lang === 'en' ? 'Web Administrator & Digital Safety Specialist Diploma' : 'Diplomă de Administrator Web & Securitate Digitală')
              : isG8AlgoA
              ? (lang === 'en' ? 'C++ Programmer • Digit Processing Specialist Diploma' : 'Diplomă de Programator C++ • Prelucrarea Cifrelor')
              : isG8AlgoB
              ? (lang === 'en' ? 'C++ Algorithmist • Sequences & Fibonacci Hero Diploma' : 'Diplomă de Algoritmist C++ • Șiruri & Fibonacci')
              : isG8AlgoC
              ? (lang === 'en' ? 'C++ Search & Extremum Analytics Master Diploma' : 'Diplomă de Specialist C++ în Căutare & Determinare Extremum')
              : isG8AlgoD
              ? (lang === 'en' ? 'Autonomous Robotics & Sensor Systems Engineer Diploma' : 'Diplomă de Inginer în Robotică Autonomă & Senzori')
              : isG8AlgoE
              ? (lang === 'en' ? 'Grand Graduation Diploma of Gymnasium • Computer Science & ICT Laureate' : 'Marea Diplomă de Onoare la Absolvirea Gimnaziului • Informatică & TIC')
              : t.vDiplomaTitle}
          </h3>
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mt-1">
            {t.vDiplomaDept}
          </p>

          <p className="text-xs text-slate-500 mt-4">{t.vDiplomaAwardTo}</p>

          {/* Student Name Input / Display */}
          <div className="my-3">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={t.vDiplomaDefaultName}
              className="w-full text-center text-xl sm:text-3xl font-black text-emerald-700 bg-amber-50/70 border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-700 py-1.5 px-3 rounded-lg"
              title={lang === 'en' ? 'Click to edit your name on the certificate' : 'Apasă pentru a edita numele tău pe diplomă'}
            />
          </div>

          {/* Official Grade & Score Badge */}
          <div className="my-3 inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-200/70 border-2 border-amber-600/40 shadow-sm">
            <span className="text-base">⭐</span>
            <span className="text-xs sm:text-sm font-black text-amber-950 font-mono">
              {score} / {maxScore} Puncte • {lang === 'en' ? gradeDetails.calificativEn : gradeDetails.calificativRo}
            </span>
            <span className="text-base">⭐</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto mt-2">
            {isHardware 
              ? t.hwDiplomaText 
              : isInternet1 
              ? t.internet1DiplomaText 
              : isInternet2 
              ? t.internet2DiplomaText 
              : isText1 
              ? t.text1DiplomaText 
              : isText2 
              ? t.text2DiplomaText 
              : isAlgo1
              ? (lang === 'en'
                  ? 'For outstanding excellence in mastering the fundamental properties of algorithms, linear sequence execution, variable swapping via auxiliary glass, and numeric message encryption.'
                  : 'Pentru excelență și măiestrie în asimilarea noțiunii de algoritm, proprietăților fundamentale, executarea algoritmilor secvențiali, interschimbarea variabilelor prin regula celor 3 pahare și criptarea mesajelor.')
              : isAlgo2
              ? (lang === 'en'
                  ? 'For remarkable mastery in implementing alternative decision structures (If-Then-Else), managing algorithm data types, solving logic expressions with truth tables, constructing flowcharts, and executing data trace tables.'
                  : 'Pentru performanțe deosebite în stăpânirea structurilor decizionale alternative (Dacă-Atunci-Altfel), tipurilor de date și constante, operatorilor logici cu tabele de adevăr, asamblării schemelor logice și verificării prin tabele de valori.')
              : isScratch1
              ? (lang === 'en'
                  ? 'For creative and technical excellence in building Scratch 3.0 linear scripts, controlling stage coordinates, managing game variables and watchers, mathematical calculations, and drawing geometric art with the Pen extension.'
                  : 'Pentru creativitate și performanțe remarcabile în asamblarea scripturilor liniare Scratch 3.0, pilotarea personajelor pe coordonatele scenei, gestionarea variabilelor de joc, efectuarea calculelor matematice și desenarea formelor geometrice cu extensia Creion.')
              : isScratch2
              ? (lang === 'en'
                  ? 'For supreme graduation mastery of the complete 5th Grade Computer Science & ICT Curriculum: alternative decision structures, sensory maze algorithms, arithmetic ask/answer quizzes, digital music composition, multi-sprite contest games, and ecological simulation.'
                  : 'Pentru absolvirea de elită a întregului Curriculum Oficial de Informatică și TIC Clasa a V-a: structuri decizionale alternative, jocuri tip labirint cu senzori, jocuri de calcul matematic, compunere muzicală digitală pe note MIDI, concursuri de jocuri cu cronometru și povestea ecologică.')
              : isG6P1
              ? (lang === 'en'
                  ? 'For outstanding achievements in PowerPoint presentation techniques, 3 launch modes, Ribbon command tabs, and visual presentation views (Textbook pp. 10-15).'
                  : 'Pentru performanțe deosebite în stăpânirea tehnicilor de prezentare PowerPoint, cele 3 moduri de lansare, panglica de comenzi și modurile de vizualizare (Manual pag. 10-15).')
              : isG6P2
              ? (lang === 'en'
                  ? 'For creative and rhetorical mastery of slide layout operations, multimedia objects, transitions, animations, the 40-word golden rule, and public speaking (Textbook pp. 16-25).'
                  : 'Pentru măiestrie creativă în operațiile cu diapozitive, obiecte multimedia, tranziții, animații, regula de aur a celor 40 de cuvinte și arta susținerii discursului (Manual pag. 16-25).')
              : isG6P3
              ? (lang === 'en'
                  ? 'For demonstrated excellence in 3D modeling, spatial manipulation (X, Y, Z axes), 4 control anchors, Make 3D, conforming stickers, material finishes, and 3D export (Textbook pp. 26-33).'
                  : 'Pentru excelență în modelarea tridimensională, manipularea în spațiul 3D (axele X, Y, Z), cele 4 ancore de control, Creare 3D, stickere mulate, finisaje de materiale și export 3D (Manual pag. 26-33).')
              : isG6M1
              ? (lang === 'en'
                  ? 'For exceptional competence in cybersecurity defense, classification of malware threats (Viruses, Worms, Trojans, Spyware, Ransomware), antivirus scanning, quarantine protocols, firewall rules, and bulletproof 2FA passwords (Textbook pp. 44-45).'
                  : 'Pentru competențe de elită în protecție cibernetică, clasificarea amenințărilor malware (Viruși, Viermi, Troieni, Spyware, Ransomware), scanare antivirus, carantină, reguli Firewall și parole de neclintit cu 2FA (Manual pag. 44-45).')
              : isG6A1
              ? (lang === 'en'
                  ? 'For remarkable mastery of classical and digital animation principles (24 FPS, retinal persistence), 3-act story arc structuring in Toontastic 3D, puppet synchronization, and immersive 360° VR world building.'
                  : 'Pentru asimilarea remarcabilă a principiilor animației clasice și digitale (24 FPS, persistența retiniană), structurarea scenariilor prin arcul narativ în 3 acte în Toontastic 3D, regia sonoră și explorarea mediilor imersive 360°.')
              : isG6E1
              ? (lang === 'en'
                  ? 'For exceptional competence in professional email communication (To/Cc/Bcc, attachments, subject lines), adherence to online netiquette rules, anti-cyberbullying defense, and collaborative cloud storage management.'
                  : 'Pentru competențe deosebite în redactarea mesajelor e-mail (Către/Cc/Bcc, atașamente, eticheta subiectului), respectarea regulilor de netichetă, prevenirea cyberbullying-ului și partajarea securizată a documentelor în Cloud.')
              : isG6S1
              ? (lang === 'en'
                  ? 'For outstanding achievements in conditional loops algorithms (While vs Repeat Until), Boolean logic operators (AND, OR, NOT), infinite loop debugging, and autonomous sensory programming in Scratch 3.0.'
                  : 'Pentru performanțe remarcabile în programarea buclelor condiționate (Cât timp vs Repetă până când), operatorilor logici compuși (Și, Sau, Nu), depanarea buclelor infinite și construirea algoritmilor inteligenți cu senzori în Scratch 3.0.')
              : isG7W1
              ? (lang === 'en'
                  ? 'For exceptional mastery of digital typography, Romanian diacritic standards SR 13411, paragraph geometry on the horizontal ruler, semantic styles architecture, batch Find & Replace, and editorial publication in PDF format.'
                  : 'Pentru excelență și măiestrie în tehnoredactarea computerizată, respectarea normelor tipografice românești SR 13411, geometria paragrafelor pe rigla orizontală, arhitectura stilurilor semantice, curățarea automată a textului și publicarea revistei școlare în format PDF.')
              : isG7W2
              ? (lang === 'en'
                  ? 'For demonstrated excellence in professional document layout, A4 gutter margins, Landscape section break isolation, advanced header and footer architecture with Different First Page, academic table formatting, and scholarly footnote citation.'
                  : 'Pentru performanțe deosebite în machetarea profesională a documentelor complexe, configurarea marginilor de îndosariere A4, izolarea secțiunilor în format Vedere/Landscape, arhitectura antetului și subsolului cu Different First Page, formatarea academică a tabelelor și citarea prin note de subsol.')
              : isG7A1
              ? (lang === 'en'
                  ? 'For remarkable mastery of digital sound physics, frequency in Hz, amplitude in dB, Nyquist-Shannon 44.1 kHz sampling, linear PCM uncompressed WAV math, surgical WavePad editing, and professional radio jingle production with Paste Mix.'
                  : 'Pentru excelență și măiestrie în asimilarea fizicii sunetului digital, a spectrului de frecvențe în Hz, amplitudinii în dB, teoremei de eșantionare Nyquist-Shannon 44.1 kHz, calculului fișierelor audio WAV/MP3, chirurgiei WavePad și producerii jingle-ului radio școlar prin Paste Mix.')
              : isG7V2
              ? (lang === 'en'
                  ? 'For exceptional mastery in multitrack video editing, timeline track hierarchy, surgical Split and Ripple Delete techniques, cinematic CrossFade transitions, Lower Third graphic design, Creative Commons music attribution, and Full HD MP4 film production.'
                  : 'Pentru excelență și măiestrie regizorală în montajul video multitrack, ierarhia pistelor paralele, tăierea chirurgicală Split și Ripple Delete, tranzițiile cinematice CrossFade, designul burtierelor Lower Third, respectarea drepturilor de autor Creative Commons și producția scurtmetrajului școlar MP4 Full HD.')
              : isG7C1
              ? (lang === 'en'
                  ? 'For exceptional mastery in cloud collaboration architectures, autosave mechanics, permission access governance (Viewer, Commenter, Editor), real-time synchronous multi-user editing, @mention task delegation, Suggesting mode review workflows, and Version History disaster recovery in Google Docs and Slides.'
                  : 'Pentru excelență și performanțe remarcabile în stăpânirea arhitecturii Cloud Computing, salvarea continuă automată, securitatea matricii de permisiuni (Viewer, Commenter, Editor), redactarea sincronă în echipă cu cursori colorați, delegarea sarcinilor prin mențiuni @, fluxul de lucru în modul Sugestii și recuperarea prin Istoricul Versiunilor în Google Docs și Slides.')
              : isG7GIS
              ? (lang === 'en'
                  ? 'For exceptional mastery of Geographic Information Systems (GIS), thematic layer stacking hierarchies, vector geometry primitives, precise WGS84 GPS coordinate navigation, 3D spatial terrain analysis in Google Earth, and emergency flood crisis routing with cartographic netiquette and privacy ethics.'
                  : 'Pentru excelență și performanțe remarcabile în stăpânirea Sistemelor Informaționale Geografice (GIS), ierarhia suprapunerii straturilor tematice, primitivele vectoriale (Punct, Polilinie, Poligon), navigarea prin coordonate GPS WGS84, analiza spațială 3D a reliefului în Google Earth și intervenția de urgență în caz de inundații cu respectarea netichetei cartografice și a confidențialității GDPR.')
              : isG8CalcA
              ? (lang === 'en'
                  ? 'For remarkable mastery in spreadsheet workbook structure (.xlsx), cell coordinates, data typing, worksheet manipulation, and financial currency formatting (Textbook pp. 12-20).'
                  : 'Pentru performanțe deosebite în stăpânirea structurii registrului de calcul (.xlsx), a coordonatelor de celule, a tipurilor de date, gestionării foilor de lucru și formatării financiare a tabelelor (Manual pag. 12-20).')
              : isG8CalcB
              ? (lang === 'en'
                  ? 'For demonstrated excellence in constructing complex formulas, standard mathematical functions (SUM, AVERAGE, MIN, MAX, COUNT), absolute dollar referencing ($A$1), and error diagnostics (Textbook pp. 21-25).'
                  : 'Pentru excelență în construirea formulelor matematice complexe, stăpânirea funcțiilor standard (SUM, AVERAGE, MIN, MAX, COUNT), blocarea referințelor absolute prin simbolul $ ($A$1) și depanarea erorilor de calcul (Manual pag. 21-25).')
              : isG8CalcC
              ? (lang === 'en'
                  ? 'For outstanding achievements in conditional decision logic with IF, multi-criteria evaluations, conditional counting with COUNTIF, and ascending/descending data filtering (Textbook pp. 26-29).'
                  : 'Pentru performanțe remarcabile în aplicarea logicii decizionale prin funcția IF, evaluări cu criterii multiple, numărarea condiționată prin COUNTIF și filtrarea/sortarea avansată a datelor școlare (Manual pag. 26-29).')
              : isG8CalcD
              ? (lang === 'en'
                  ? 'For exceptional creativity and analytical precision in designing 2D/3D column histograms, line trend series, circular pie proportion charts, and statistical dashboards (Textbook pp. 30-35).'
                  : 'Pentru creativitate și precizie analitică în proiectarea diagramelor de tip coloane/bare, liniilor de evoluție temporală, diagramelor circulare Pie 2D/3D și panourilor statistice de date (Manual pag. 30-35).')
              : isG8WebA
              ? (lang === 'en'
                  ? 'For outstanding architectural mastery in building Google Sites web projects, establishing 3-click intuitive navigation trees, custom header typography, and multi-device responsive previews (Textbook pp. 36-43).'
                  : 'Pentru măiestrie arhitecturală în proiectarea site-urilor web în Google Sites, stabilirea ierarhiei optime de navigare, personalizarea anteturilor și previzualizarea responsive pe orice dispozitiv (Manual pag. 36-43).')
              : isG8WebB
              ? (lang === 'en'
                  ? 'For exceptional competence in multimedia cloud integration: embedding Google Forms, collaborative Slides, Sheets databases, interactive Maps, YouTube media, and HTML5/CSS3 iframes (Textbook pp. 44-51).'
                  : 'Pentru competențe de elită în integrarea resurselor multimedia din cloud: formulare interactive de feedback, prezentări Slides, foi de calcul Sheets, hărți Google Maps și cod sursă HTML5/CSS3 (Manual pag. 44-51).')
              : isG8WebC
              ? (lang === 'en'
                  ? 'For demonstrated excellence in website publishing, domain routing, permission security matrices, Creative Commons intellectual property adherence, and GDPR student privacy defense (Textbook pp. 52-57).'
                  : 'Pentru excelență în publicarea pe web, gestionarea domeniilor, configurarea permisiunilor de acces, respectarea drepturilor de autor Creative Commons și protejarea strictă a datelor elevilor conform GDPR (Manual pag. 52-57).')
              : isG8AlgoA
              ? (lang === 'en'
                  ? 'For remarkable algorithmic mastery in C++ integer digit processing: division and modulo arithmetic (/ and %), digit extraction loops, digit summation, number reversal, and CNP decoding (Textbook pp. 58-69).'
                  : 'Pentru asimilarea excepțională a prelucrării cifrelor unui număr în C++: operatorii aritmetici / și %, buclele de descompunere, suma și numărarea cifrelor, testul de palindrom și decodificarea CNP-ului (Manual pag. 58-69).')
              : isG8AlgoB
              ? (lang === 'en'
                  ? 'For outstanding performance in generating number sequences, sliding variable algorithms without vectors, Fibonacci terms, arithmetic progressions, and triangular numbers in C++ (Textbook pp. 70-77).'
                  : 'Pentru performanțe deosebite în generarea secvențelor numerice în C++, tehnica variabilelor glisante fără tablouri unidimensionale, termenii șirului Fibonacci, progresiile matematice și numerele triunghiulare (Manual pag. 70-77).')
              : isG8AlgoC
              ? (lang === 'en'
                  ? 'For demonstrated excellence in searching and extremum determination algorithms, robust negative-number initialization, first/last occurrence position tracking, and statistical aggregations in C++ (Textbook pp. 78-83).'
                  : 'Pentru excelență în algoritmii de căutare și determinare a extremelor (minim/maxim), inițializarea corectă pentru mulțimi cu numere negative, memorarea poziției de apariție și statistici numerice în C++ (Manual pag. 78-83).')
              : isG8AlgoD
              ? (lang === 'en'
                  ? 'For exceptional mastery in educational robotics, ultrasonic echo sensing, distance threshold braking calculations, collision prevention maneuvers, and autonomous state machine programming (Textbook pp. 84-91).'
                  : 'Pentru măiestrie inginerească în robotica educațională, calibrarea senzorului ultrasonic de distanță, calculul inerției de frânare, manevrele de evitare a obstacolelor și programarea mașinilor de stări autonome (Manual pag. 84-91).')
              : isG8AlgoE
              ? (lang === 'en'
                  ? 'For supreme graduation excellence in completing the 8th Grade Capstone Project: Preferred High School! Successfully combining spreadsheet admission databases, Google Sites presentation architecture, and C++ predictive admission analytics across the entire gymnasium curriculum (Textbook pp. 92-96).'
                  : 'Pentru absolvirea de elită a întregului Ciclu Gimnazial (Clasele V-VIII) și finalizarea cu brio a Proiectului de Sinteză „Liceul Preferat”: integrarea calculului tabelar al mediilor de admitere 80/20, dezvoltarea site-ului web Google Sites și implementarea algoritmului C++ de predicție a sanselor de admitere (Manual pag. 92-96).')
              : t.vDiplomaText}
          </p>

          {/* Signatures & Date */}
          <div className="mt-8 pt-5 border-t border-amber-300 flex items-center justify-between text-xs text-slate-700">
            <div className="text-left">
              <div className="font-extrabold text-slate-900">{t.vDiplomaTeacher}</div>
              <div className="text-[11px] text-slate-600">{t.schoolName}</div>
            </div>
            <div className="text-right">
              <div className="font-extrabold text-slate-900">{t.vDiplomaDate}</div>
              <div className="text-[11px] text-slate-600">ArkyEdu TIC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handlePrint}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 font-heading cursor-pointer active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>{t.vBtnPrint}</span>
        </button>

        {onBackToCatalog && (
          <button
            onClick={onBackToCatalog}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 font-heading cursor-pointer active:scale-95 shadow-md shadow-emerald-600/30"
          >
            <span>{t.backToCourses}</span>
          </button>
        )}

        <button
          onClick={onReset}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 font-heading cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.vBtnReset}</span>
        </button>
      </div>
    </div>
  );
};

