import React, { useState } from 'react';
import {
  LayoutGrid,
  Columns,
  Image as ImageIcon,
  Type,
  MoveVertical,
  Copy,
  Trash2,
  Palette,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Eye,
  Sliders,
  MousePointerClick
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W2Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface ContentBlockTemplate {
  id: string;
  name: string;
  columns: number;
  description: string;
  recommendedFor: string;
  iconLayout: string; // SVG or visual representation
}

const TEMPLATES: ContentBlockTemplate[] = [
  {
    id: 'block_1col_large',
    name: '1 Imagine Mare + Text Lateral',
    columns: 2,
    description: 'O imagine reprezentativă pe 50% din lățime și casetă de text (titlu + paragraf) pe cealaltă jumătate.',
    recommendedFor: 'Prezentarea misiunii clubului școlar, articol de deschidere sau proiect de impact.',
    iconLayout: '[ Img ] [ Titlu + Text ]'
  },
  {
    id: 'block_2col',
    name: '2 Coloane Egale (Imagini + Texte)',
    columns: 2,
    description: 'Două casete paralele cu imagine deasupra și titlu/descriere dedesubt.',
    recommendedFor: 'Comparație între două activități, două evenimente sau două echipe de voluntari.',
    iconLayout: '[ Img1 | Img2 ]\n[ Txt1 | Txt2 ]'
  },
  {
    id: 'block_3col_card',
    name: '3 Carduri Paralele (3 Coloane)',
    columns: 3,
    description: 'Trei coloane perfect calibrate cu suport foto superior, titlu îngroșat și text explicativ.',
    recommendedFor: 'Prezentarea celor 3 departamente ale unui proiect: Tehnic, Redacție, Design.',
    iconLayout: '[ Img1 | Img2 | Img3 ]\n[ Txt1 | Txt2 | Txt3 ]'
  },
  {
    id: 'block_3col_photo',
    name: '3 Imagini Compacte (Mini-Galerie)',
    columns: 3,
    description: 'Trei imagini una lângă alta fără text obligatoriu dedesubt, pentru flux vizual dinamic.',
    recommendedFor: 'Galerie foto cu instantanee de la olimpiadă sau târgul de științe.',
    iconLayout: '[ Img1 | Img2 | Img3 ]'
  },
  {
    id: 'block_4col_team',
    name: '4 Coloane (Membri Echipă / Produse)',
    columns: 4,
    description: 'Patru coloane înguste cu portrete rotunde/pătrate și etichetă scurtă dedesubt.',
    recommendedFor: 'Echipa redacțională a revistei școlii sau 4 pași rapizi dintr-un ghid.',
    iconLayout: '[ 1 | 2 | 3 | 4 ]'
  }
];

export const W2Level3_LayoutsAndBlocksStudio: React.FC<W2Level3Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Studio simulator state
  const [selectedTemplate, setSelectedTemplate] = useState<string>('block_3col_card');
  const [sectionStyle, setSectionStyle] = useState<'regular' | 'accent1' | 'accent2'>('regular');
  const [activeBlocks, setActiveBlocks] = useState<Array<{ id: number; title: string; desc: string; imgName: string }>>([
    { id: 1, title: 'Departament Știință', desc: 'Experimente de robotică și cod.', imgName: 'robotica.jpg' },
    { id: 2, title: 'Redacție & Jurnalism', desc: 'Interviuri cu olimpici și profesori.', imgName: 'articol.jpg' },
    { id: 3, title: 'Design & Grafică', desc: 'Identitate vizuală și machetare.', imgName: 'design.jpg' }
  ]);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (qId: string, optId: string) => {
    if (submitted[qId] || isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = answers[qId] === correctId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmitted(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <LayoutGrid className="w-5 h-5 text-cyan-300" />
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2B</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 3: Blocuri de Conținut Predefinite & Gestionarea Secțiunilor
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 48: Construiește pagini armonioase folosind machetele de conținut (Content Blocks)
              cu 1, 2, 3 sau 4 coloane și controlează stilul, duplicarea și ordinea secțiunilor pe pânză.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-cyan-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">3 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Digest */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Machete de Conținut și Bara Laterală a Secțiunii (Manual pag. 48)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Columns className="w-4 h-4 text-indigo-600" />
              Blocuri de Conținut (Layouts)
            </div>
            <p className="text-slate-600">
              În loc să aliniezi manual casete de text și imagini, alegi din fila <strong>Inserare</strong> una dintre cele 6 machete gata configurate. Elementele sunt legate structural și se rearanjează automat pe mobil.
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-600" />
              Stilurile de Secțiune
            </div>
            <p className="text-slate-600">
              Fiecare secțiune orizontală are în stânga o bară cu unelte:
              <br />• <strong>Obișnuit (Regular)</strong>: fundal alb curat.
              <br />• <strong>Evidențiere 1 (Accent 1)</strong>: gri/pastel subtil.
              <br />• <strong>Evidențiere 2 (Accent 2)</strong>: culoare dominantă vibrantă.
              <br />• <strong>Imagine de fundal</strong>.
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <MoveVertical className="w-4 h-4 text-emerald-600" />
              Operațiuni pe Secțiune
            </div>
            <p className="text-slate-600">
              Folosind cele 10 puncte de tragere (drag-handle) din stânga, poți reordona secțiunile sus/jos pe pagină.
              Ai butoane rapide pentru <strong>Duplicare secțiune</strong> și <strong>Ștergere definitivă</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Studio Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Machetare & Personalizare Secțiune Google Sites
            </h3>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
            Laborator Practic
          </span>
        </div>

        {/* Template Selector */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-600" />
            1. Alege Macheta de Conținut din fila Inserare:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => {
                  setSelectedTemplate(tpl.id);
                  sounds.playClick();
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === tpl.id
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold text-indigo-900 mb-1">{tpl.name}</div>
                <div className="text-[11px] text-slate-500 font-mono bg-white p-1 rounded border border-slate-200">
                  {tpl.iconLayout}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section Style Selector */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            2. Stilul Fundalului Secțiunii (Bara de instrumente din stânga):
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setSectionStyle('regular');
                sounds.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                sectionStyle === 'regular'
                  ? 'bg-slate-100 border-slate-600 text-slate-900 ring-2 ring-slate-300'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ⚪ Obișnuit (Regular - Alb)
            </button>
            <button
              onClick={() => {
                setSectionStyle('accent1');
                sounds.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                sectionStyle === 'accent1'
                  ? 'bg-slate-200 border-indigo-500 text-indigo-950 ring-2 ring-indigo-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🩶 Evidențiere 1 (Accent 1 - Gri neutru)
            </button>
            <button
              onClick={() => {
                setSectionStyle('accent2');
                sounds.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                sectionStyle === 'accent2'
                  ? 'bg-indigo-600 border-indigo-700 text-white shadow ring-2 ring-indigo-300'
                  : 'bg-indigo-100 border-indigo-200 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              💙 Evidențiere 2 (Accent 2 - Indigo contrast)
            </button>
          </div>
        </div>

        {/* Live Canvas Preview with Section Tool Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Previzualizare Pânză Google Sites</span>
            <span>Trage sau modifică elementele din machetă</span>
          </div>

          <div className="relative border-2 border-dashed border-indigo-300 rounded-xl p-4 bg-slate-100">
            {/* Left section floating toolbar simulator */}
            <div className="absolute -left-3 top-4 bg-white rounded-lg shadow-lg border border-slate-300 p-1 flex flex-col gap-1 z-10">
              <button
                title="Stil secțiune"
                className="p-1.5 hover:bg-indigo-50 rounded text-slate-700 hover:text-indigo-600"
                onClick={() => {
                  setSectionStyle(prev => prev === 'regular' ? 'accent1' : prev === 'accent1' ? 'accent2' : 'regular');
                  sounds.playClick();
                }}
              >
                <Palette className="w-4 h-4" />
              </button>
              <button
                title="Duplică secțiunea"
                className="p-1.5 hover:bg-indigo-50 rounded text-slate-700 hover:text-indigo-600"
                onClick={() => {
                  sounds.playClick();
                }}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                title="Șterge secțiunea"
                className="p-1.5 hover:bg-rose-50 rounded text-slate-700 hover:text-rose-600"
                onClick={() => {
                  sounds.playClick();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div
                title="Mâner mutare secțiune"
                className="p-1.5 cursor-grab text-slate-400 hover:text-slate-600"
              >
                <MoveVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Inner Section Content */}
            <div
              className={`ml-6 p-6 rounded-xl transition-all duration-300 shadow-sm ${
                sectionStyle === 'regular'
                  ? 'bg-white text-slate-900 border border-slate-200'
                  : sectionStyle === 'accent1'
                  ? 'bg-slate-200/90 text-slate-900 border border-slate-300'
                  : 'bg-gradient-to-r from-indigo-700 to-blue-700 text-white shadow-md'
              }`}
            >
              {selectedTemplate === 'block_1col_large' && (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="bg-black/10 border-2 border-dashed border-indigo-400/50 rounded-xl h-48 flex flex-col items-center justify-center p-4 text-center">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-80" />
                    <span className="text-xs font-semibold">Clic pe pictograma (+) pentru a încărca imaginea</span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xl font-bold tracking-tight">Revista Școlară Digitală „InfoTeen”</div>
                    <p className={`text-sm ${sectionStyle === 'accent2' ? 'text-indigo-100' : 'text-slate-600'}`}>
                      Proiectul nostru interdisciplinar aduce laolaltă pasiunea pentru jurnalism, informatică și științe. În fiecare lună publicăm interviuri și tutoriale practice de programare.
                    </p>
                    <button className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow">
                      Află mai multe &rarr;
                    </button>
                  </div>
                </div>
              )}

              {selectedTemplate === 'block_2col' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2].map(num => (
                    <div key={num} className="space-y-2">
                      <div className="bg-black/10 border border-indigo-300/50 rounded-xl h-36 flex flex-col items-center justify-center text-center p-3">
                        <ImageIcon className="w-8 h-8 mb-1 opacity-70" />
                        <span className="text-xs">Foto Activitate {num}</span>
                      </div>
                      <h4 className="font-bold text-base">Atelier {num === 1 ? 'Programare C++' : 'Robotică Arduino'}</h4>
                      <p className={`text-xs ${sectionStyle === 'accent2' ? 'text-indigo-100' : 'text-slate-600'}`}>
                        {num === 1
                          ? 'Algoritmi de căutare, matrici bidimensionale și structuri de date rezolvate în echipă.'
                          : 'Senzori ultrasonici, motoare servo și plăcuțe de dezvoltare programate în laborator.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTemplate === 'block_3col_card' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {activeBlocks.map(block => (
                    <div
                      key={block.id}
                      className={`p-4 rounded-xl border transition ${
                        sectionStyle === 'accent2'
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="bg-black/10 rounded-lg h-28 flex flex-col items-center justify-center mb-3">
                        <ImageIcon className="w-7 h-7 mb-1 opacity-70" />
                        <span className="text-[11px] font-mono">{block.imgName}</span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{block.title}</h4>
                      <p className={`text-xs ${sectionStyle === 'accent2' ? 'text-indigo-100' : 'text-slate-600'}`}>
                        {block.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTemplate === 'block_3col_photo' && (
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map(item => (
                    <div key={item} className="bg-black/10 rounded-xl h-36 flex flex-col items-center justify-center p-2 text-center border border-indigo-300/40">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-70" />
                      <span className="text-xs font-semibold">Fotografie #{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedTemplate === 'block_4col_team' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  {[
                    { name: 'Ana Moraru', role: 'Redactor Șef' },
                    { name: 'David Ionescu', role: 'Lead Developer' },
                    { name: 'Elena Popa', role: 'Grafică & Media' },
                    { name: 'Mihai Radu', role: 'Documentare' }
                  ].map((member, idx) => (
                    <div key={idx} className="p-3 bg-black/10 rounded-xl border border-indigo-200/30">
                      <div className="w-12 h-12 mx-auto rounded-full bg-indigo-300/40 flex items-center justify-center mb-2">
                        <span className="font-bold text-xs">{member.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="font-bold text-xs">{member.name}</div>
                      <div className={`text-[11px] ${sectionStyle === 'accent2' ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {member.role}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification Challenges */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Aplicarea Machetării în Proiectul Școlar
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Vrei să prezinți pe pagina de pornire (Acasă) cei 4 membri ai comitetului elevilor, fiecare cu o poză de tip portret, nume și funcție. Care este macheta de conținut optimă oferită de Google Sites?
            </span>
            <QuestionHint
              hint="Manual pag. 48: Fila Inserare oferă machete cu 1, 2, 3 și 4 coloane. Pentru a evita derularea verticală inutilă și a păstra simetria vizuală pe un rând, macheta cu 4 coloane dedicată este cea mai eficientă."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Macheta cu 1 imagine mare și text pe dreapta, repetată de 4 ori una sub alta' },
              { id: 'opt_b', label: 'B. Macheta predefinită cu 4 coloane (Content Block cu 4 spații de imagine și casete de text asociate)' },
              { id: 'opt_c', label: 'C. O casetă de text simplă în care scrii toate numele separate prin virgulă' },
              { id: 'opt_d', label: 'D. Inserarea a 4 butoane fără nicio imagine sau descriere' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Macheta cu 4 coloane este special concepută pentru liste de membri, categorii sau produse, asigurând aliniere automată a imaginilor și adaptare responsivă la ecranele mai mici."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Cum poți crea un contrast vizual puternic între o secțiune informativă și restul paginii conform manualului de clasa a VIII-a (pag. 48)?
            </span>
            <QuestionHint
              hint="Manual pag. 48: Bara laterală stângă a secțiunii conține butonul pentru stilul secțiunii (Stil de fundal), permițând comutarea între Obișnuit, Evidențiere 1 și Evidențiere 2."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Folosind butonul de fundal al secțiunii și selectând stilul „Evidențiere 2” (Accent 2) sau o imagine de fundal' },
              { id: 'opt_b', label: 'B. Schimbând manual culoarea fiecărei litere din text cu vopsea galbenă' },
              { id: 'opt_c', label: 'C. Ștergând antetul site-ului și mărind fontul la 96px' },
              { id: 'opt_d', label: 'D. Doar prin ascunderea paginii din meniul principal de navigare' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_a')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Opțiunea „Evidențiere 2” aplică nuanța principală a temei grafice pe întregul fundal al secțiunii orizontale, ghidând privirea vizitatorului spre informațiile esențiale."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={3}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 4: Încorporare Multimedia & Google Workspace"
      />
    </div>
  );
};
