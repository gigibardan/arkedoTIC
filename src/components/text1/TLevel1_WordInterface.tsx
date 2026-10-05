import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Sparkles, BookOpen, Layers, MousePointer, Info, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { PageNavigationFooter } from './PageNavigationFooter';
import { AnswerExplanation } from './AnswerExplanation';
import { QuestionHint } from './QuestionHint';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface TLevel1Props {
  onCompletePage: (score: number) => void;
}

interface InterfaceHotspot {
  id: string;
  nameRo: string;
  nameEn: string;
  descRo: string;
  descEn: string;
  x: string;
  y: string;
  color: string;
}

const HOTSPOTS: InterfaceHotspot[] = [
  {
    id: 'title_bar',
    nameRo: '1. Bara de Titlu',
    nameEn: '1. Title Bar',
    descRo: 'Afișează numele documentului curent (ex: Document1.docx) și butoanele de control (minimizare, restaurare, închidere X).',
    descEn: 'Displays current document title (e.g. Document1.docx) and window control buttons (minimize, maximize, close).',
    x: '50%',
    y: '5%',
    color: 'border-blue-400 text-blue-300 bg-blue-950/80',
  },
  {
    id: 'ribbon',
    nameRo: '2. Panglica (Ribbon) & Tab-uri',
    nameEn: '2. Ribbon Toolbar & Tabs',
    descRo: 'Găzduiește toate comenzile organizate pe file: File, Home (Pornire), Insert (Inserare), Layout (Aspect).',
    descEn: 'Houses all editing commands categorized into tabs: File, Home, Insert, Page Layout.',
    x: '38%',
    y: '18%',
    color: 'border-indigo-400 text-indigo-300 bg-indigo-950/80',
  },
  {
    id: 'ruler',
    nameRo: '3. Rigla Orizontală & Verticală',
    nameEn: '3. Ruler (Margins & Indents)',
    descRo: 'Măsurată în centimetri; permite setarea marginilor paginii și a indentării primului rând (alineat).',
    descEn: 'Calibrated in centimeters; lets you adjust page margins, tabs, and first-line indents.',
    x: '50%',
    y: '30%',
    color: 'border-amber-400 text-amber-300 bg-amber-950/80',
  },
  {
    id: 'workspace',
    nameRo: '4. Zona de Lucru (Pagina A4)',
    nameEn: '4. Document Workspace (A4 Page)',
    descRo: 'Foaia albă pe care se redactează textul. Cursorul vertical pâlpâie indicând poziția de scriere (Insertion Point).',
    descEn: 'The white page where content is typed. The blinking vertical bar marks the insertion point.',
    x: '50%',
    y: '58%',
    color: 'border-emerald-400 text-emerald-300 bg-emerald-950/80',
  },
  {
    id: 'status_bar',
    nameRo: '5. Bara de Stare',
    nameEn: '5. Status Bar',
    descRo: 'Situată la baza ferestrei; arată numărul paginii active (ex: Pagina 1 din 3), numărul de cuvinte și limba (Română).',
    descEn: 'Located at the bottom; displays current page number (e.g. Page 1 of 3), word count, and proofing language.',
    x: '25%',
    y: '93%',
    color: 'border-cyan-400 text-cyan-300 bg-cyan-950/80',
  },
  {
    id: 'zoom_slider',
    nameRo: '6. Glisorul Zoom & Vizualizare',
    nameEn: '6. Zoom Slider & Views',
    descRo: 'Permite mărirea sau micșorarea paginii pe ecran (de la 10% la 500%) și comutarea între modurile de afișare.',
    descEn: 'Enlarges or reduces the page view on screen (10% to 500%) and switches document view modes.',
    x: '85%',
    y: '93%',
    color: 'border-purple-400 text-purple-300 bg-purple-950/80',
  },
];

export const TLevel1_WordInterface: React.FC<TLevel1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Interactive match state
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [matchedZones, setMatchedZones] = useState<{ [zoneId: string]: string }>({});
  const [matchCooldown, setMatchCooldown] = useState<number>(0);

  // Textbook quiz questions state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);

  useEffect(() => {
    if (matchCooldown <= 0) return;
    const t = setInterval(() => setMatchCooldown((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [matchCooldown]);

  useEffect(() => {
    if (q1Cooldown <= 0) return;
    const t = setInterval(() => setQ1Cooldown((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [q1Cooldown]);

  useEffect(() => {
    if (q2Cooldown <= 0) return;
    const t = setInterval(() => setQ2Cooldown((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [q2Cooldown]);

  const handleMatch = (zoneId: string, labelId: string) => {
    if (matchCooldown > 0) return;
    sounds.playClick();
    if (zoneId === labelId) {
      sounds.playCorrect();
      setMatchedZones((prev) => ({ ...prev, [zoneId]: labelId }));
      arky.triggerSuccess(
        lang === 'en'
          ? 'Spot on! You correctly identified this interface element!'
          : 'Exact! Ai identificat corect acest element vital al interfeței!'
      );
    } else {
      sounds.playWrong();
      setMatchCooldown(5);
      arky.triggerError(
        lang === 'en'
          ? 'Not quite there. Take 5 seconds to review the textbook window diagram!'
          : 'Nu este acolo. Acordă 5 secunde pentru a privi diagrama ferestrei din manual!'
      );
    }
  };

  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'status') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'ribbon') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  // Evaluation
  const matchedCount = Object.keys(matchedZones).length;
  const isQ1Correct = q1Answer === 'status';
  const isQ2Correct = q2Answer === 'ribbon';

  let correctTotal = 0;
  if (matchedCount === HOTSPOTS.length) correctTotal += 1;
  if (isQ1Correct) correctTotal += 1;
  if (isQ2Correct) correctTotal += 1;

  const totalQuestions = 3;
  // Page 1 is worth 15 points towards the mission total of 100
  const earnedScore = Math.round((correctTotal / totalQuestions) * 15);

  const canProceed = matchedCount >= 4;

  const handleReset = () => {
    sounds.playClick();
    setMatchedZones({});
    setSelectedZone(null);
    setQ1Answer(null);
    setQ2Answer(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Module 4 • Page 1 of 7' : 'Modulul 4 • Pagina 1 din 7'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'en' ? 'Word Processor Interface & The Ruler' : 'Interfața Procesorului de Text & Rigla'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Discover Microsoft Word & Google Docs anatomy (Textbook pp. 50–52): Ribbon tabs, title bar, workspace, ruler calibration, and status indicators.'
                : 'Descoperă anatomia unui procesor de text (Manual pag. 50–52): Panglica Ribbon, bara de titlu, rigla, foaia de lucru și indicatorii de stare.'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            📝
          </div>
        </div>
      </div>

      {/* Theory Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'en' ? 'Essential Theory (Textbook p. 50)' : 'Teorie Esențială (Manual pag. 50)'}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {lang === 'en' ? 'What is a Word Processor?' : 'Ce este un Procesor de Text?'}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'A word processor (such as Microsoft Word, Google Docs, or LibreOffice Writer) is a specialized application used to type, format, illustrate, organize, and print text documents. Unlike a simple notepad (which only holds plain text), a word processor can change fonts, colors, align paragraphs, create tables, and embed images.'
            : 'Un procesor de text (cum ar fi Microsoft Word, Google Docs sau LibreOffice Writer) este o aplicație specializată folosită pentru crearea, redactarea, formatarea, ilustrarea și tipărirea documentelor. Spre deosebire de un simplu carnet de notițe (Notepad, care știe doar text simplu), procesorul de text permite modificarea fonturilor, culorilor, alinierea paragrafelor, inserarea de imagini și tabele.'}
        </p>

        {/* 3 Key Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase font-mono mb-1">01. Ribbon / Panglica</div>
              <h3 className="font-bold text-slate-200 text-sm mb-1">
                {lang === 'en' ? 'Tab-Based Command Bar' : 'Bara de Comenzi pe Tab-uri'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Replaces old drop-down menus with intuitive tabs: Home (fonts, paragraphs), Insert (tables, pictures), and Layout (margins, orientation).'
                  : 'Înlocuiește vechile meniuri cu tab-uri vizuale: Pornire (fonturi, paragrafe), Inserare (imagini, tabele) și Aspect (margini, orientare).'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase font-mono mb-1">02. Rigla / The Ruler</div>
              <h3 className="font-bold text-slate-200 text-sm mb-1">
                {lang === 'en' ? 'Centimeter Calibration' : 'Măsurători în Centimetri'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'The horizontal and vertical rulers show page boundaries. Gray zones represent unprintable margins; the white zone is the typing area.'
                  : 'Rigla orizontală și verticală arată marginile paginii. Zonele gri sunt marginile netipăribile, iar zona albă este spațiul util de scriere.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase font-mono mb-1">03. Cursorul Text</div>
              <h3 className="font-bold text-slate-200 text-sm mb-1">
                {lang === 'en' ? 'Insertion Point' : 'Punctul de Inserare'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'The blinking vertical bar (|) shows exactly where the next character typed on the keyboard will appear on the page.'
                  : 'Bara verticală care clipește intermitent (|) indică locul exact unde va apărea următorul caracter tastat de la tastatură.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Activity: Word Window Simulator Explorer */}
      <div className="bg-slate-900/90 border-2 border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
              <Layers className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Interactive Lab • Component Matching' : 'Laborator Interactiv • Identificarea Zonelor'}
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {lang === 'en' ? 'Step 1: Match the 6 Window Components' : 'Pasul 1: Explorează și etichetează cele 6 zone ale ferestrei'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">{lang === 'en' ? 'Identified:' : 'Identificate:'}</span>
            <span className="text-sm font-bold font-mono text-blue-400">
              {matchedCount} / {HOTSPOTS.length}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Click a labeled tag below, then click its corresponding number circle on the word processor simulator preview!'
            : 'Apasă pe o etichetă din lista de mai jos, apoi dă click pe cercul numerotat corespunzător de pe macheta procesorului de text!'}
        </p>

        {/* Word Processor Mockup Window */}
        <div className="relative w-full aspect-[16/10] bg-slate-950 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl select-none">
          {/* Simulated Window Title Bar */}
          <div className="h-8 bg-blue-900/90 border-b border-blue-700 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">W</div>
              <span className="text-xs font-semibold text-slate-200">Referat_TIC_Clasa_V.docx - Word</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-600 inline-block" />
              <span className="w-3 h-3 rounded-full bg-slate-600 inline-block" />
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
            </div>
          </div>

          {/* Simulated Ribbon Toolbar */}
          <div className="h-16 bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex flex-col justify-between">
            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 border-b border-slate-800 pb-1">
              <span className="text-blue-400 border-b-2 border-blue-400 font-bold">Fișier</span>
              <span className="text-slate-200">Pornire (Home)</span>
              <span>Inserare (Insert)</span>
              <span>Aspect pagină (Layout)</span>
              <span>Referințe</span>
              <span>Vizualizare</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Calibri (12pt)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-black">B</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 italic">I</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 underline">U</span>
              <span className="text-slate-600">|</span>
              <span className="px-2 py-0.5 rounded bg-slate-800">Aliniere ≡</span>
              <span className="px-2 py-0.5 rounded bg-slate-800">Liste • 1.</span>
            </div>
          </div>

          {/* Simulated Ruler */}
          <div className="h-5 bg-slate-800 border-b border-slate-700 px-10 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>| 0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10</span>
            <span>12</span>
            <span>14</span>
            <span>16 cm |</span>
          </div>

          {/* Simulated Page A4 Workspace */}
          <div className="absolute top-28 bottom-7 left-10 right-10 flex justify-center overflow-hidden">
            <div className="w-full max-w-lg h-full bg-white text-slate-900 p-6 rounded-t-lg shadow-2xl flex flex-col">
              <div className="text-center font-bold text-sm mb-3 text-slate-900">
                PROIECT TIC: CELE 4 GENERATII DE CALCULATOARE
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed indent-4 mb-2">
                Calculatoarele au evoluat spectaculos de la mașinile gigantice cu tuburi electronice din secolul trecut până la smartphone-urile ultrarapide de astăzi.
                <span className="inline-block w-0.5 h-3 bg-blue-600 animate-pulse ml-0.5 translate-y-0.5" />
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed indent-4">
                Folosind procesorul de text, putem formata titluri elegante, crea tabele comparative și adăuga imagini sugestive.
              </p>
            </div>
          </div>

          {/* Simulated Status Bar & Zoom Slider */}
          <div className="absolute bottom-0 left-0 right-0 h-7 bg-blue-950 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-300 font-mono">
            <div className="flex items-center gap-3">
              <span>Pagina 1 din 1</span>
              <span>• 42 cuvinte</span>
              <span>• Română (România)</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Aspect pagină [🗎]</span>
              <span>Zoom: 100% [- ▬ +]</span>
            </div>
          </div>

          {/* Interactive Clickable Pins (Hotspots) */}
          {HOTSPOTS.map((spot) => {
            const isMatched = Boolean(matchedZones[spot.id]);
            const isTargeted = selectedZone === spot.id;

            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => {
                  if (selectedZone) {
                    handleMatch(spot.id, selectedZone);
                  } else {
                    sounds.playClick();
                    setSelectedZone(spot.id);
                  }
                }}
                style={{ left: spot.x, top: spot.y }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 px-2.5 py-1 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-xl cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 scale-105'
                    : isTargeted
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 animate-bounce'
                    : 'bg-slate-900/90 text-white border-2 border-white/60 hover:scale-110 hover:border-cyan-400'
                }`}
              >
                {isMatched ? <CheckCircle2 className="w-3.5 h-3.5" /> : <MousePointer className="w-3.5 h-3.5" />}
                <span>{spot.id === 'title_bar' ? '1' : spot.id === 'ribbon' ? '2' : spot.id === 'ruler' ? '3' : spot.id === 'workspace' ? '4' : spot.id === 'status_bar' ? '5' : '6'}</span>
                {isMatched && <span className="hidden sm:inline text-[10px]">{lang === 'en' ? spot.nameEn.split('.')[1] : spot.nameRo.split('.')[1]}</span>}
              </button>
            );
          })}
        </div>

        {/* Labels Selection Deck */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase font-mono">
            {lang === 'en' ? 'Select an interface element tag to identify:' : 'Alege o etichetă pentru a o plasa pe simulator:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {HOTSPOTS.map((item) => {
              const isMatched = Boolean(matchedZones[item.id]);
              const isSelected = selectedZone === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isMatched}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedZone(item.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 opacity-60 cursor-default'
                      : isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-[1.02]'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">
                      {lang === 'en' ? item.nameEn : item.nameRo}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {lang === 'en' ? item.descEn : item.descRo}
                    </div>
                  </div>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Textbook Assessment Questions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider font-mono">
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'en' ? 'Textbook Questions (p. 52, Ex. 1 & 2)' : 'Întrebări din Manual (pag. 52, Ex. 1 & 2)'}</span>
        </div>

        {/* Question 1 */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '1. Where can a student check the total word count and current page in Microsoft Word?'
                : '1. Unde poate verifica un elev numărul total de cuvinte și pagina curentă în Microsoft Word?'}
            </h4>
            <span className="text-xs font-mono text-blue-400 font-semibold shrink-0">1 punct</span>
          </div>

          {q1Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza bara de stare din manual pag. 51."
                customMessageEn="Incorrect! Please take 5 seconds to review the Status Bar on page 51."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('title')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'title'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'On the Title Bar at the top' : 'Pe Bara de Titlu de sus'}
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('status')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'status'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'On the Status Bar at the bottom' : 'Pe Bara de Stare din partea de jos'}
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('ruler')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'ruler'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'On the Horizontal Ruler markings' : 'Pe marcajele Riglei Orizontale'}
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('zoom')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'zoom'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'Inside the Zoom Slider popup' : 'În fereastra de Zoom'}
            </button>
          </div>

          <QuestionHint
            hintRo="Privește spre baza ferestrei: acolo se afișează numărul de pagini, contorul de cuvinte și limba dicționarului."
            hintEn="Look at the bottom edge of the window: that bar shows page count, word count, and proofing language."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Correct! The Status Bar at the bottom of the window displays page statistics and word count in real time.' : 'Corect! Bara de stare (Status Bar) din partea de jos a ferestrei afișează în timp real numărul de cuvinte și pagina curentă.')
                  : (lang === 'en' ? 'Incorrect. The Title bar shows file name, while the Status bar at the bottom tracks words.' : 'Incorect. Bara de titlu arată numele fișierului, pe când Bara de Stare din subsol numără cuvintele.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 51 • Status Bar' : 'Manual pag. 51 • Bara de Stare'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '2. What is the modern toolbar component called that organizes Word commands into tabs (Home, Insert, Layout)?'
                : '2. Cum se numește componenta modernă care organizează comenzile Word pe tab-uri (Pornire, Inserare, Aspect)?'}
            </h4>
            <span className="text-xs font-mono text-blue-400 font-semibold shrink-0">1 punct</span>
          </div>

          {q2Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza panglica Ribbon din manual pag. 50-51."
                customMessageEn="Incorrect! Please take 5 seconds to review the Ribbon on page 50-51."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('ribbon')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'ribbon'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'The Ribbon (Panglica de comenzi)' : 'Panglica Ribbon'}
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('scroll')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'scroll'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'The Vertical Scroll Bar' : 'Bara de Derulare (Scrollbar)'}
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('desktop')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'desktop'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'The Windows Desktop' : 'Spațiul de lucru Desktop'}
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('tray')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'tray'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'System Notification Tray' : 'Zona de Notificări'}
            </button>
          </div>

          <QuestionHint
            hintRo="Se numește în limba engleză Ribbon și grupează instrumentele pe categorii clare (Pornire, Inserare, Aspect)."
            hintEn="Called the Ribbon, it groups formatting and editing tools into logical tabs."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Spot on! The Ribbon (Panglica) contains all the buttons and commands organized into thematic tabs.' : 'Excelent! Panglica (Ribbon) conține toate butoanele și comenzile grupate pe tab-uri tematice.')
                  : (lang === 'en' ? 'Incorrect. The Ribbon is the official name of the tabbed toolbar in modern office suites.' : 'Incorect. Panglica (Ribbon) este numele barei de instrumente pe file din procesoarele de text moderne.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 50 • Ribbon Architecture' : 'Manual pag. 50 • Panglica de comenzi'}
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctTotal}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => onCompletePage(earnedScore)}
        onRetry={handleReset}
      />
    </div>
  );
};
