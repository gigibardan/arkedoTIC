import React, { useState } from 'react';
import {
  Table2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Maximize,
  Minimize2,
  Grid,
  Check,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level4_ProfessionalTables: React.FC<W2Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Table Designer Interactive State
  const [isHeaderMerged, setIsHeaderMerged] = useState<boolean>(false);
  const [hasProfessionalAlignment, setHasProfessionalAlignment] = useState<boolean>(false);
  const [hasHeaderShading, setHasHeaderShading] = useState<boolean>(false);
  const [hasBordersStyled, setHasBordersStyled] = useState<boolean>(false);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const sampleData = [
    {
      nr: '1',
      nume: 'Popescu Andrei',
      disciplinaRo: 'Informatică',
      disciplinaEn: 'Computer Science',
      punctaj: '98.50',
      bursaRo: '500 lei',
      bursaEn: '$500',
    },
    {
      nr: '2',
      nume: 'Ionescu Elena',
      disciplinaRo: 'Matematică',
      disciplinaEn: 'Mathematics',
      punctaj: '95.00',
      bursaRo: '450 lei',
      bursaEn: '$450',
    },
    {
      nr: '3',
      nume: 'Radu Mihai',
      disciplinaRo: 'Fizică',
      disciplinaEn: 'Physics',
      punctaj: '91.25',
      bursaRo: '400 lei',
      bursaEn: '$400',
    },
    {
      nr: '4',
      nume: 'Stan Maria',
      disciplinaRo: 'Chimie',
      disciplinaEn: 'Chemistry',
      punctaj: '88.75',
      bursaRo: '350 lei',
      bursaEn: '$350',
    },
  ];

  // Professional score indicator
  const criteriaMetCount = [
    isHeaderMerged,
    hasProfessionalAlignment,
    hasHeaderShading,
    hasBordersStyled,
  ].filter(Boolean).length;

  const handleSelectAnswer = (qKey: 'q1' | 'q2' | 'q3', answer: string, correct: string) => {
    if (isLocked(qKey)) return;

    if (qKey === 'q1') setQ1Answer(answer);
    if (qKey === 'q2') setQ2Answer(answer);
    if (qKey === 'q3') setQ3Answer(answer);

    if (answer === correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qKey);
    }
  };

  const isQ1Correct = q1Answer === 'b';
  const isQ2Correct = q2Answer === 'c';
  const isQ3Correct = q3Answer === 'a';
  const allCorrect = isQ1Correct && isQ2Correct && isQ3Correct;

  const calculateScore = () => {
    let score = 70;
    if (isQ1Correct) score += 10;
    if (isQ2Correct) score += 10;
    if (isQ3Correct) score += 10;
    return score;
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/40 via-emerald-900/40 to-blue-900/40 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>{lang === 'ro' ? 'Misiunea 1B • Nivelul 4 din 7' : 'Mission 1B • Level 4 of 7'}</span>
              <span>•</span>
              <span>{lang === 'ro' ? 'Manual pag. 24-25' : 'Textbook pp. 24-25'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Tabele Profesionale, Îmbinare Celule & Aliniere Date'
                : 'Professional Tables, Merge Cells & Data Alignment'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              {lang === 'ro'
                ? 'Învață regulile de aur ale tabelelor academice: de ce numerele se aliniază întotdeauna la Dreapta, cum unim celulele de titlu cu Merge Cells și cum stilizăm bordurile și umbrirea antetului pentru lizibilitate maximă.'
                : 'Learn the golden rules of academic tables: why numeric data must always align to the Right, how to join title cells with Merge Cells, and how to style borders and header shading for maximum legibility.'}
            </p>
          </div>
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-400 self-start sm:self-auto">
            <Table2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Theory Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Grid className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Rânduri, Coloane & Celule' : 'Rows, Columns & Cells'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Rândurile (orizontale) și coloanele (verticale) se intersectează formând celule. Fiecare celulă este un recipient independent ce poate conține text, numere sau chiar imagini.'
              : 'Horizontal rows and vertical columns intersect to form cells. Each cell is an independent container capable of holding text, numbers, or graphics.'}
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
            <AlignRight className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Alinierea Numerelor la Dreapta' : 'Right-Aligning Numeric Data'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Regulă matematică de aur: valorile numerice se aliniază obligatoriu la dreapta! Aceasta permite ca unitățile, zecile și virgulele zecimale să cadă exact unele sub altele.'
              : 'Golden math rule: numeric quantities must be right-aligned! This ensures ones, tens, hundreds, and decimal points fall into neat vertical alignment.'}
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
            <Maximize className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Îmbinare Celule (Merge Cells)' : 'Merge Cells Command'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Comandă care combină două sau mai multe celule adiacente într-o singură celulă mare. Se folosește pentru titlul general de deasupra coloanelor sau categorii comune.'
              : 'A command that combines two or more adjacent cells into one large cell. Used for overarching banner headers across columns or grouping data categories.'}
          </p>
        </div>
      </div>

      {/* Interactive Table Designer Studio */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-teal-400 font-mono font-bold uppercase tracking-wider">
              {lang === 'ro' ? 'Laborator Practic' : 'Hands-on Lab'}
            </span>
            <h2 className="text-xl font-black text-white">
              {lang === 'ro'
                ? 'Atelier Interactiv: Optimizează Tabelul după Standardul Tipografic'
                : 'Interactive Lab: Optimize the Table to Typographical Standards'}
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'ro' ? 'Scor Conformitate:' : 'Compliance Score:'}
            </span>
            <span className={`text-xs font-bold font-mono ${
              criteriaMetCount === 4 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {lang === 'ro'
                ? `${criteriaMetCount} / 4 Standarde Aplicate`
                : `${criteriaMetCount} / 4 Standards Applied`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Action Toolbar */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-300">
              {lang === 'ro'
                ? 'Instrumente Ribbon Tabel (Design & Layout):'
                : 'Table Tools Ribbon (Design & Layout):'}
            </span>

            {/* Action 1: Merge Header */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsHeaderMerged(!isHeaderMerged);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                isHeaderMerged
                  ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">
                  {lang === 'ro' ? '1. Îmbină Celule Titlu (Merge Cells)' : '1. Merge Header Title Cells'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {lang === 'ro'
                    ? 'Unește cele 5 căsuțe din rândul 1 într-o singură celulă centrată.'
                    : 'Joins the 5 cells in row 1 into a single centered title cell.'}
                </span>
              </div>
              {isHeaderMerged ? <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> : <Maximize className="w-5 h-5 text-slate-500 shrink-0" />}
            </button>

            {/* Action 2: Professional Alignment */}
            <button
              onClick={() => {
                sounds.playClick();
                setHasProfessionalAlignment(!hasProfessionalAlignment);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                hasProfessionalAlignment
                  ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">
                  {lang === 'ro' ? '2. Aliniere Inteligentă a Datelor' : '2. Smart Data Alignment'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {lang === 'ro'
                    ? 'Textul la stânga, numerele la dreapta, capetele centrate.'
                    : 'Text to the left, numbers to the right, headers centered.'}
                </span>
              </div>
              {hasProfessionalAlignment ? <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> : <AlignRight className="w-5 h-5 text-slate-500 shrink-0" />}
            </button>

            {/* Action 3: Header Shading */}
            <button
              onClick={() => {
                sounds.playClick();
                setHasHeaderShading(!hasHeaderShading);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                hasHeaderShading
                  ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">
                  {lang === 'ro' ? '3. Umbrirea Capului de Tabel (Shading)' : '3. Header Row Shading'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {lang === 'ro'
                    ? 'Aplică fundal contrastant pentru rândurile de antet.'
                    : 'Applies a clean contrasting background to header rows.'}
                </span>
              </div>
              {hasHeaderShading ? <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> : <Sparkles className="w-5 h-5 text-slate-500 shrink-0" />}
            </button>

            {/* Action 4: Border Styling */}
            <button
              onClick={() => {
                sounds.playClick();
                setHasBordersStyled(!hasBordersStyled);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                hasBordersStyled
                  ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">
                  {lang === 'ro' ? '4. Borduri Fine & Deschise (Clean Borders)' : '4. Clean Open Border Styling'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {lang === 'ro'
                    ? 'Înlocuiește grila greoaie cu linii fine orizontale aerisite.'
                    : 'Replaces heavy gridlines with airy horizontal rules.'}
                </span>
              </div>
              {hasBordersStyled ? <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> : <Grid className="w-5 h-5 text-slate-500 shrink-0" />}
            </button>
          </div>

          {/* Live Table Preview */}
          <div className="lg:col-span-8 flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 min-h-[380px]">
            <span className="text-xs font-mono text-slate-400 mb-4 self-start">
              {lang === 'ro'
                ? 'Previzualizare Document Word • Modulul de Evaluare Școlară:'
                : 'Word Document Preview • Academic Scholarship Table:'}
            </span>

            <div className="w-full bg-white rounded-xl shadow-xl p-6 text-slate-800 overflow-x-auto">
              <table
                className={`w-full text-xs transition-all duration-300 ${
                  hasBordersStyled
                    ? 'border-t-2 border-b-2 border-slate-900 border-collapse'
                    : 'border-collapse border-2 border-slate-400'
                }`}
              >
                {/* TITLE ROW */}
                <thead>
                  {isHeaderMerged ? (
                    <tr>
                      <th
                        colSpan={5}
                        className={`p-2.5 font-bold text-center text-sm ${
                          hasHeaderShading ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
                        } ${hasBordersStyled ? 'border-b border-slate-400' : 'border border-slate-400'}`}
                      >
                        {lang === 'ro'
                          ? 'SITUAȚIA BURSELOR DE PERFORMANȚĂ • SEMESTRUL I'
                          : 'ACADEMIC EXCELLENCE SCHOLARSHIPS • SEMESTER I'}
                      </th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Col 1</th>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Col 2</th>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Col 3</th>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Col 4</th>
                      <th className="p-1 border border-slate-400 bg-rose-50 text-[10px] text-rose-700">Col 5</th>
                    </tr>
                  )}

                  {/* SUB-HEADER ROW */}
                  <tr className={`${
                    hasHeaderShading ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-slate-100 text-slate-700 font-semibold'
                  } ${hasBordersStyled ? 'border-b-2 border-slate-900' : ''}`}>
                    <th className={`p-2 ${hasProfessionalAlignment ? 'text-center' : 'text-left'} ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      {lang === 'ro' ? 'Nr.' : 'No.'}
                    </th>
                    <th className={`p-2 ${hasProfessionalAlignment ? 'text-left' : 'text-center'} ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      {lang === 'ro' ? 'Nume Elev' : 'Student Name'}
                    </th>
                    <th className={`p-2 text-left ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      {lang === 'ro' ? 'Disciplina' : 'Subject'}
                    </th>
                    <th className={`p-2 ${hasProfessionalAlignment ? 'text-right' : 'text-left'} ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      {lang === 'ro' ? 'Punctaj' : 'Score'}
                    </th>
                    <th className={`p-2 ${hasProfessionalAlignment ? 'text-right' : 'text-left'} ${!hasBordersStyled ? 'border border-slate-400' : 'p-2'}`}>
                      {lang === 'ro' ? 'Cuantum Bursă' : 'Scholarship Grant'}
                    </th>
                  </tr>
                </thead>

                {/* DATA BODY */}
                <tbody className="divide-y divide-slate-200">
                  {sampleData.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 1 && hasHeaderShading ? 'bg-slate-50' : 'bg-white'}
                    >
                      <td className={`p-2 ${hasProfessionalAlignment ? 'text-center font-mono text-slate-500' : 'text-left'} ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {row.nr}.
                      </td>
                      <td className={`p-2 font-medium text-slate-900 ${hasProfessionalAlignment ? 'text-left' : 'text-center'} ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {row.nume}
                      </td>
                      <td className={`p-2 text-slate-600 ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {lang === 'ro' ? row.disciplinaRo : row.disciplinaEn}
                      </td>
                      <td className={`p-2 font-mono font-bold ${
                        hasProfessionalAlignment ? 'text-right text-emerald-700' : 'text-left'
                      } ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {row.punctaj}
                      </td>
                      <td className={`p-2 font-mono ${
                        hasProfessionalAlignment ? 'text-right font-bold text-slate-800' : 'text-left'
                      } ${!hasBordersStyled ? 'border border-slate-400' : ''}`}>
                        {lang === 'ro' ? row.bursaRo : row.bursaEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {criteriaMetCount === 4 && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  {lang === 'ro'
                    ? 'Formatare impecabilă! Tabelul respectă toate standardele de publicație academică și lizibilitate.'
                    : 'Flawless styling! The table satisfies all academic typography and readability standards.'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Quiz */}
      <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-teal-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-xl font-black text-white font-heading">
            {lang === 'ro'
              ? 'Verificarea Cunoștințelor • Reguli Tipografice de Tabele'
              : 'Knowledge Check • Table Typography Rules'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: reamintește-ți termenii de bază ai structurii tabelare!'
                : 'Reflection time: recall the basic components of table structure!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '1. Cum se numesc elementele orizontale, respectiv verticale ale unui tabel și căsuțele rezultate la intersecția lor?'
              : '1. What are the horizontal and vertical elements of a table called, and what do we call the cells at their intersection?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Paragrafe, Linii și Spații',
                labelEn: 'Paragraphs, Lines, and Spaces',
              },
              {
                id: 'b',
                labelRo: 'Rânduri (linii), Coloane și Celule',
                labelEn: 'Rows, Columns, and Cells',
              },
              {
                id: 'c',
                labelRo: 'Cadre, Diapozitive și Butoane',
                labelEn: 'Frames, Slides, and Buttons',
              },
              {
                id: 'd',
                labelRo: 'Foldere, Fișiere și Căi',
                labelEn: 'Folders, Files, and Paths',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q1') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q1Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Orizontal = rând, Vertical = coloană, căsuța individuală = celulă.'
                : 'Horizontal = row, Vertical = column, individual container = cell.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation={
              lang === 'ro'
                ? 'Corect! Structura de bază a oricărui tabel este compusă din rânduri (orizontale), coloane (verticale) și celule (la intersecția lor).'
                : 'Correct! The foundational structure of any table comprises horizontal rows, vertical columns, and intersecting cells.'
            }
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: gândește-te cum aduni două numere pe o foaie de matematică!'
                : 'Reflection time: think about how you align numbers when adding them by hand on paper!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '2. De ce este o regulă obligatorie ca valorile numerice (note, sume de bani, măsurători) să fie aliniate la Dreapta într-o coloană?'
              : '2. Why is it mandatory for numeric quantities (grades, money, measurements) to be aligned to the Right in a column?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Pentru că tastatura scrie doar de la stânga spre dreapta',
                labelEn: 'Because keyboards only write left-to-right',
              },
              {
                id: 'b',
                labelRo: 'Pentru a ascunde virgula zecimală de cititor',
                labelEn: 'To conceal the decimal separator from readers',
              },
              {
                id: 'c',
                labelRo: 'Pentru ca unitățile, zecile și virgulele zecimale să fie aliniate vertical una sub alta',
                labelEn: 'So that ones, tens, hundreds, and decimal points line up vertically',
              },
              {
                id: 'd',
                labelRo: 'Pentru a permite imprimantei să consume mai puțin tuș negru',
                labelEn: 'To enable printers to consume less toner ink',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q2') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q2Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Dacă aliniezi numerele la stânga, 1000 și 10 vor părea decalate; alinierea la dreapta păstrează coloana unităților curată.'
                : 'Left-aligning numbers creates misaligned magnitudes; right-alignment keeps place values aligned.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation={
              lang === 'ro'
                ? 'Exact! Alinierea la dreapta a numerelor este standardul internațional contabil și științific, permițând compararea instantanee a ordinelor de mărime (unități sub unități, zeci sub zeci).'
                : 'Exactly! Right-aligning numbers is the global accounting and scientific standard, allowing instant visual comparisons of place values.'
            }
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: amintește-ți comanda dedicată pentru combinarea mai multor celule!'
                : 'Reflection time: remember the dedicated command for joining multiple cells!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '3. Ce comandă din fila Machetare Tabel (Table Layout) se folosește pentru a uni celulele din primul rând într-o singură celulă mare de titlu?'
              : '3. What command in Table Layout is used to join the cells of the first row into a single wide title cell?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Îmbinare celule (Merge Cells)',
                labelEn: 'Merge Cells',
              },
              {
                id: 'b',
                labelRo: 'Divizare celule (Split Cells)',
                labelEn: 'Split Cells',
              },
              {
                id: 'c',
                labelRo: 'Distribuire rânduri în mod egal',
                labelEn: 'Distribute Rows Evenly',
              },
              {
                id: 'd',
                labelRo: 'Conversie tabel în text',
                labelEn: 'Convert Table to Text',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q3')}
                onClick={() => handleSelectAnswer('q3', opt.id, 'a')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'a'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q3') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q3Answer === opt.id && (opt.id === 'a' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? '„Merge” înseamnă a contopi / a îmbina mai multe elemente într-unul singur.'
                : '“Merge” means to blend or combine multiple elements into a single entity.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation={
              lang === 'ro'
                ? 'Corect! Comanda Îmbinare celule (Merge Cells) unește celulele selectate, permițând titlurilor să ocupe armonios întreaga lățime a tabelului.'
                : 'Correct! The Merge Cells command blends selected cells together, allowing titles to span the table width harmoniously.'
            }
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={allCorrect}
        onNext={() => {
          sounds.playFanfare();
          onCompletePage(calculateScore());
        }}
        promptText={
          allCorrect
            ? (lang === 'ro' ? 'Ai stăpânit tabelele profesionale! Treci la Note de Subsol & Note de Final!' : 'You mastered professional tables! Proceed to Footnotes & Endnotes!')
            : (lang === 'ro' ? 'Răspunde corect la cele 3 întrebări de verificare pentru a debloca nivelul următor!' : 'Answer all 3 verification questions correctly to unlock the next level!')
        }
      />
    </div>
  );
};
