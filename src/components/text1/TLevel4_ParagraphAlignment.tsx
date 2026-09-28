import React, { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Sparkles, BookOpen, CheckCircle2, FileCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { PageNavigationFooter } from './PageNavigationFooter';
import { AnswerExplanation } from './AnswerExplanation';
import { QuestionHint } from './QuestionHint';

interface TLevel4Props {
  onCompletePage: (score: number) => void;
}

type AlignmentType = 'left' | 'center' | 'right' | 'justify';

export const TLevel4_ParagraphAlignment: React.FC<TLevel4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Alignment state for document parts
  const [titleAlign, setTitleAlign] = useState<AlignmentType>('left');
  const [bodyAlign, setBodyAlign] = useState<AlignmentType>('left');
  const [hasFirstLineIndent, setHasFirstLineIndent] = useState<boolean>(false);
  const [signatureAlign, setSignatureAlign] = useState<AlignmentType>('left');

  // Quiz questions state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleTitleAlign = (align: AlignmentType) => {
    sounds.playClick();
    setTitleAlign(align);
    if (align === 'center') sounds.playCorrect();
  };

  const handleBodyAlign = (align: AlignmentType) => {
    sounds.playClick();
    setBodyAlign(align);
    if (align === 'justify') sounds.playCorrect();
  };

  const handleIndentToggle = () => {
    sounds.playClick();
    const next = !hasFirstLineIndent;
    setHasFirstLineIndent(next);
    if (next) sounds.playCorrect();
  };

  const handleSignatureAlign = (align: AlignmentType) => {
    sounds.playClick();
    setSignatureAlign(align);
    if (align === 'right') sounds.playCorrect();
  };

  const handleQ1 = (val: string) => {
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'justify') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleQ2 = (val: string) => {
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'center') sounds.playCorrect();
    else sounds.playWrong();
  };

  // Evaluation
  let docCriteriaMet = 0;
  if (titleAlign === 'center') docCriteriaMet += 1;
  if (bodyAlign === 'justify') docCriteriaMet += 1;
  if (hasFirstLineIndent) docCriteriaMet += 1;
  if (signatureAlign === 'right') docCriteriaMet += 1;

  const isQ1Correct = q1Answer === 'justify';
  const isQ2Correct = q2Answer === 'center';

  let correctTotal = 0;
  if (docCriteriaMet === 4) correctTotal += 1;
  if (isQ1Correct) correctTotal += 1;
  if (isQ2Correct) correctTotal += 1;

  const totalQuestions = 3;
  const earnedScore = Math.round((correctTotal / totalQuestions) * 15);
  const canProceed = docCriteriaMet >= 3;

  const handleReset = () => {
    sounds.playClick();
    setTitleAlign('left');
    setBodyAlign('left');
    setHasFirstLineIndent(false);
    setSignatureAlign('left');
    setQ1Answer(null);
    setQ2Answer(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Module 4 • Page 4 of 7' : 'Modulul 4 • Pagina 4 din 7'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'en' ? 'Paragraph Alignment & Indentations' : 'Alinierea și Formatarea Paragrafelor'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Master the 4 horizontal alignments (Left, Center, Right, Justify), first-line indent (alineat), and line spacing (Textbook pp. 59–61).'
                : 'Stăpânește cele 4 tipuri de aliniere (Stânga, Centrat, Dreapta, Justify), primul rând de alineat și spațierea dintre rânduri (Manual pag. 59–61).'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            📐
          </div>
        </div>
      </div>

      {/* Theory Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'en' ? 'Alignment Fundamentals (Textbook p. 59)' : 'Tipuri de Aliniere a Paragrafelor (Manual pag. 59)'}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {lang === 'en' ? 'The 4 Alignment Modes in Document Layout' : 'Cele 4 Tipuri de Aliniere Orizontală'}
        </h2>

        {/* 4 Alignments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 font-mono uppercase mb-1">
                <AlignLeft className="w-4 h-4" /> La Stânga (Ctrl+L)
              </div>
              <p className="text-xs text-slate-300">
                Marginea din stânga este perfect dreaptă; marginea din dreapta este neregulată (zimțată). Este modul standard.
              </p>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-500">Utilizare: texte obișnuite, scrisori, notițe.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono uppercase mb-1">
                <AlignCenter className="w-4 h-4" /> Centrat (Ctrl+E)
              </div>
              <p className="text-xs text-slate-300">
                Fiecare rând este așezat simetric pe mijlocul paginii, la distanță egală de marginile laterale.
              </p>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-500">Utilizare: titluri, poezii, coperți, diplome.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 font-mono uppercase mb-1">
                <AlignRight className="w-4 h-4" /> La Dreapta (Ctrl+R)
              </div>
              <p className="text-xs text-slate-300">
                Textul este aliniat la marginea din dreapta a paginii, lăsând partea stângă zimțată.
              </p>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-500">Utilizare: data, semnătura, expeditorul.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono uppercase mb-1">
                <AlignJustify className="w-4 h-4" /> Justify (Ctrl+J)
              </div>
              <p className="text-xs text-slate-300">
                Ajustează automat spațiile dintre cuvinte pentru a obține margini perfect drepte pe AMBELE părți.
              </p>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-500">Utilizare: manuale școlare, cărți, ziare.</div>
          </div>
        </div>
      </div>

      {/* Interactive Official School Request Document */}
      <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
              <FileCheck className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Interactive Lab • Official Request Layout' : 'Laborator Interactiv • Formatarea unei Cereri'}
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {lang === 'en' ? 'Format the Official School Club Application' : 'Formatează Cererea Oficială pentru Clubul de Robotică!'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">{lang === 'en' ? 'Layout Correctness:' : 'Formatare Corectă:'}</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {docCriteriaMet} / 4
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Use the alignment toolbars below each document block to format the title, body paragraph, first-line indent, and student signature according to official standards.'
            : 'Folosește butoanele de aliniere pentru a formata fiecare secțiune a cererii: Titlul centrat, textul cererii Justify cu alineat și semnătura la dreapta!'}
        </p>

        {/* Paper Container */}
        <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-2xl border-4 border-slate-300 font-sans text-xs sm:text-sm leading-relaxed space-y-6 select-none">
          {/* SECTION 1: TITLE */}
          <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                Secțiunea 1: Titlul Cererii (Cerință: Centrat)
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleTitleAlign('left')}
                  className={`p-1.5 rounded cursor-pointer ${titleAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTitleAlign('center')}
                  className={`p-1.5 rounded cursor-pointer ${titleAlign === 'center' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTitleAlign('right')}
                  className={`p-1.5 rounded cursor-pointer ${titleAlign === 'right' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              className={`font-black text-sm sm:text-base text-slate-900 ${
                titleAlign === 'center' ? 'text-center' : titleAlign === 'right' ? 'text-right' : 'text-left'
              }`}
            >
              DOMNULE DIRECTOR,
            </div>
          </div>

          {/* SECTION 2: BODY TEXT & INDENT */}
          <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                Secțiunea 2: Textul Cererii (Cerință: Justify + Alineat)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleIndentToggle}
                  className={`px-2 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                    hasFirstLineIndent
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>Alineat (1.25 cm)</span>
                  {hasFirstLineIndent && <CheckCircle2 className="w-3 h-3 text-white" />}
                </button>

                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleBodyAlign('left')}
                    className={`p-1.5 rounded cursor-pointer ${bodyAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBodyAlign('center')}
                    className={`p-1.5 rounded cursor-pointer ${bodyAlign === 'center' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBodyAlign('justify')}
                    className={`p-1.5 rounded cursor-pointer ${bodyAlign === 'justify' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    title="Align Justify"
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <p
              className={`text-slate-800 leading-relaxed text-justify ${
                hasFirstLineIndent ? 'indent-8' : 'indent-0'
              } ${
                bodyAlign === 'center'
                  ? 'text-center'
                  : bodyAlign === 'justify'
                  ? 'text-justify'
                  : 'text-left'
              }`}
            >
              Subsemnatul/a, elev/ă în clasa a V-a B la Școala Gimnazială „Mihai Eminescu”, vă rog respectuos să îmi aprobați înscrierea la Cercul de Robotică și Programare TIC din cadrul școlii. Menționez că am o pasiune deosebită pentru domeniul calculatoarelor, am finalizat cu succes modulele de securitate cibernetică și doresc să particip la olimpiadele școlare viitoare.
            </p>
          </div>

          {/* SECTION 3: DATE & SIGNATURE */}
          <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                Secțiunea 3: Data & Semnătura (Cerință: Semnătura la Dreapta)
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSignatureAlign('left')}
                  className={`p-1.5 rounded cursor-pointer ${signatureAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSignatureAlign('right')}
                  className={`p-1.5 rounded cursor-pointer ${signatureAlign === 'right' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between pt-2">
              <div className="text-slate-700">
                Data: <span className="font-semibold">28 Septembrie 2026</span>
              </div>
              <div className={signatureAlign === 'right' ? 'text-right' : 'text-left'}>
                <div className="text-slate-700">Semnătura elevului,</div>
                <div className="font-bold text-blue-900 font-serif italic text-base">Maria Popescu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Criteria Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            titleAlign === 'center' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>1. Titlul cererii aliniat Centrat (Center)</span>
            {titleAlign === 'center' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            bodyAlign === 'justify' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>2. Textul cererii aliniat Justify (ambele margini)</span>
            {bodyAlign === 'justify' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            hasFirstLineIndent ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>3. Primul rând indentat cu Alineat</span>
            {hasFirstLineIndent && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            signatureAlign === 'right' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>4. Semnătura aliniată la Dreapta (Right)</span>
            {signatureAlign === 'right' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
        </div>
      </div>

      {/* Two Textbook Assessment Questions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider font-mono">
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'en' ? 'Textbook Assessment (p. 60, Ex. 2 & 3)' : 'Verificare din Manual (pag. 60, Ex. 2 & 3)'}</span>
        </div>

        {/* Question 1: Justify */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '1. Why is Justify alignment (Ctrl+J) preferred for textbooks, novels, and newspaper columns?'
                : '1. De ce este preferată alinierea Justify (Ctrl+J) în manuale școlare, romane și ziare?'}
            </h4>
            <span className="text-xs font-mono text-emerald-400 font-semibold shrink-0">1 punct</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQ1('justify')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'justify'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'It creates clean, straight vertical edges on BOTH left and right margins' : 'Creează margini verticale perfect drepte atât la stânga, cât și la dreapta'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('size')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'size'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'It automatically doubles the font size of every letter' : 'Mărește automat dimensiunea literelor de două ori'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('delete')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'delete'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'It deletes punctuation marks automatically' : 'Șterge automat semnele de punctuație'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('color')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'color'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'It colors the text in green automatically' : 'Colorează textul în verde'}
            </button>
          </div>

          <QuestionHint
            hintRo="Gândește-te la aspectul ordonat al paginilor dintr-o carte: textul începe și se termină drept pe ambele părți."
            hintEn="Think of textbook pages: text aligns smoothly on both left and right edges."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! Justify adjusts inter-word spacing so both page margins look crisp and elegant.' : 'Corect! Alinierea Justify distribuie spațiile dintre cuvinte astfel încât ambele laturi ale textului să fie perfect drepte.')
                  : (lang === 'en' ? 'Incorrect. Justify ensures both left and right margins are aligned.' : 'Incorect. Alinierea Justify oferă margini drepte pe ambele laturi ale paginii.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 59 • Justify Alignment' : 'Manual pag. 59 • Alinierea Justify'}
            />
          )}
        </div>

        {/* Question 2: Center */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '2. What is the recommended alignment for page titles, chapter headings, and diplomas?'
                : '2. Ce tip de aliniere este recomandat pentru titluri de capitole, poezii și diplome de merit?'}
            </h4>
            <span className="text-xs font-mono text-emerald-400 font-semibold shrink-0">1 punct</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQ2('center')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'center'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'Align Center (Ctrl+E)' : 'Aliniere Centrată (Center - Ctrl+E)'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('right')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'right'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'Align Right (Ctrl+R)' : 'Aliniere la Dreapta (Ctrl+R)'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('margin')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'margin'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'Hidden Margin' : 'Margine invizibilă'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('strikethrough')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'strikethrough'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'Strikethrough' : 'Tăiat cu o linie'}
            </button>
          </div>

          <QuestionHint
            hintRo="Titlul este pus de regulă pe mijlocul foii (Centrat) pentru a atrage privirea cititorului."
            hintEn="Headings are positioned in the middle of the sheet (Center) for symmetry."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Perfect! Titles and certificate headers are traditionally Centered (Ctrl+E) for balanced visual appeal.' : 'Exact! Titlurile și antetele de diplomă se așază în mod tradițional Centrat (Ctrl+E) pentru eleganță și simetrie vizuală.')
                  : (lang === 'en' ? 'Incorrect. Center alignment is standard for titles.' : 'Incorect. Titlurile se aliniază Centrat.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 60 • Centering Headings' : 'Manual pag. 60 • Centrarea Titlurilor'}
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
