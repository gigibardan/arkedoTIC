import React, { useState } from 'react';
import {
  FileText,
  Award,
  CheckCircle2,
  Sparkles,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Type,
  Palette,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { PageNavigationFooter } from './PageNavigationFooter';

interface TLevel7Props {
  onCompletePage: (score: number) => void;
}

export const TLevel7_DocumentMasterLab: React.FC<TLevel7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Document Editor State
  const [titleAlign, setTitleAlign] = useState<'left' | 'center' | 'right'>('left');
  const [isTitleBold, setIsTitleBold] = useState<boolean>(false);
  const [titleFontSize, setTitleFontSize] = useState<number>(14);
  const [isTitleBlue, setIsTitleBlue] = useState<boolean>(false);

  const [bodyAlign, setBodyAlign] = useState<'left' | 'center' | 'justify'>('left');
  const [hasFirstLineIndent, setHasFirstLineIndent] = useState<boolean>(false);

  const [listStyle, setListStyle] = useState<'none' | 'bullets' | 'numbers'>('none');
  const [areKeywordsHighlighted, setAreKeywordsHighlighted] = useState<boolean>(false);

  const [signatureAlign, setSignatureAlign] = useState<'left' | 'right'>('left');

  // Interactive controls
  const handleTitleAlignCenter = () => {
    sounds.playClick();
    setTitleAlign('center');
  };

  const handleTitleBoldToggle = () => {
    sounds.playClick();
    setIsTitleBold((prev) => !prev);
  };

  const handleTitleBlueToggle = () => {
    sounds.playClick();
    setIsTitleBlue((prev) => !prev);
  };

  const handleIncreaseTitleSize = () => {
    sounds.playClick();
    setTitleFontSize(18);
  };

  const handleBodyAlignJustify = () => {
    sounds.playClick();
    setBodyAlign('justify');
  };

  const handleIndentToggle = () => {
    sounds.playClick();
    setHasFirstLineIndent((prev) => !prev);
  };

  const handleToggleBullets = () => {
    sounds.playClick();
    setListStyle((prev) => (prev === 'bullets' ? 'none' : 'bullets'));
  };

  const handleToggleNumbers = () => {
    sounds.playClick();
    setListStyle((prev) => (prev === 'numbers' ? 'none' : 'numbers'));
  };

  const handleHighlightKeywords = () => {
    sounds.playClick();
    setAreKeywordsHighlighted((prev) => !prev);
  };

  const handleSignatureAlignRight = () => {
    sounds.playClick();
    setSignatureAlign('right');
  };

  // Evaluation criteria
  const isC1Met = titleAlign === 'center' && isTitleBold && titleFontSize >= 18 && isTitleBlue;
  const isC2Met = bodyAlign === 'justify' && hasFirstLineIndent;
  const isC3Met = listStyle === 'bullets' || listStyle === 'numbers';
  const isC4Met = areKeywordsHighlighted;
  const isC5Met = signatureAlign === 'right';

  let totalMet = 0;
  if (isC1Met) totalMet += 1;
  if (isC2Met) totalMet += 1;
  if (isC3Met) totalMet += 1;
  if (isC4Met) totalMet += 1;
  if (isC5Met) totalMet += 1;

  // Level 7 awards 10 points to conclude the mission with a full 100 points
  const earnedScore = Math.round((totalMet / 5) * 10);
  const canProceed = totalMet >= 4;

  const handleReset = () => {
    sounds.playClick();
    setTitleAlign('left');
    setIsTitleBold(false);
    setTitleFontSize(14);
    setIsTitleBlue(false);
    setBodyAlign('left');
    setHasFirstLineIndent(false);
    setListStyle('none');
    setAreKeywordsHighlighted(false);
    setSignatureAlign('left');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/70 via-indigo-950 to-purple-900/70 border border-blue-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'en' ? 'Module 4 • Final Practical Lab (Page 7 of 7)' : 'Modulul 4 • Laboratorul Practic Final (Pagina 7 din 7)'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading flex items-center gap-2">
              <span>{lang === 'en' ? 'Word Master Live Lab: The Digital Student Charter' : 'Laboratorul de Tehnoredactare: Carta Elevului Digital'}</span>
              <Trophy className="w-7 h-7 text-amber-400 shrink-0" />
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Apply everything you learned into a real document! Format titles, justify paragraphs, create bullet lists, highlight cyber rules, and align the author signature to claim your Diploma.'
                : 'Pune în practică tot ce ai învățat! Centrează titlul, justifică paragrafele, construiește lista cu reguli, evidențiază conceptele cheie și aliniază semnătura pentru a revendica Diploma de Nota 10!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-4xl shrink-0 shadow-inner">
            🎓
          </div>
        </div>
      </div>

      {/* Editor & Document Container */}
      <div className="bg-slate-900/90 border-2 border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Live Interactive Word Processor' : 'Simulator Live de Editare Documente'}
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {lang === 'en' ? 'Format the Charter using the Ribbon Tools below' : 'Apasă pe butoanele din bara de unelte pentru a formata documentul:'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">{lang === 'en' ? 'Criteria Fulfilled:' : 'Criterii Îndeplinite:'}</span>
            <span className="text-base font-bold font-mono text-amber-400">
              {totalMet} / 5 {totalMet === 5 && '🌟 NOTA 10!'}
            </span>
          </div>
        </div>

        {/* Realistic Word Ribbon Toolbar */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center gap-3">
          {/* Title tools */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Titlu:</span>
            <button
              type="button"
              onClick={handleTitleAlignCenter}
              className={`p-1.5 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                titleAlign === 'center' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Centrare Titlu"
            >
              <AlignCenter className="w-3.5 h-3.5" />
              <span>Centrat</span>
            </button>
            <button
              type="button"
              onClick={handleTitleBoldToggle}
              className={`px-2 py-1 rounded-lg text-xs font-black border transition cursor-pointer ${
                isTitleBold ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Bold Titlu"
            >
              B
            </button>
            <button
              type="button"
              onClick={handleIncreaseTitleSize}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                titleFontSize >= 18 ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Mărește Mărime (18pt)"
            >
              18pt
            </button>
            <button
              type="button"
              onClick={handleTitleBlueToggle}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                isTitleBlue ? 'bg-blue-500 text-slate-950 border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Culoare Albastră Titlu"
            >
              <Palette className="w-3 h-3" />
              <span>Albastru</span>
            </button>
          </div>

          {/* Paragraph tools */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Paragraf:</span>
            <button
              type="button"
              onClick={handleBodyAlignJustify}
              className={`p-1.5 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                bodyAlign === 'justify' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Justify (ambele margini)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Justify</span>
            </button>
            <button
              type="button"
              onClick={handleIndentToggle}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                hasFirstLineIndent ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Alineat 1.25 cm"
            >
              Alineat 1.25cm
            </button>
          </div>

          {/* List & Keyword tools */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Elemente:</span>
            <button
              type="button"
              onClick={handleToggleBullets}
              className={`p-1.5 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                listStyle === 'bullets' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Listă cu Buline"
            >
              <List className="w-3.5 h-3.5" />
              <span>• Buline</span>
            </button>
            <button
              type="button"
              onClick={handleToggleNumbers}
              className={`p-1.5 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                listStyle === 'numbers' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Listă Numerotată"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>1. Numerotată</span>
            </button>
            <button
              type="button"
              onClick={handleHighlightKeywords}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                areKeywordsHighlighted ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Evidențiază Cuvinte Cheie"
            >
              Evidențiază Cheie
            </button>
          </div>

          {/* Signature tools */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Semnătură:</span>
            <button
              type="button"
              onClick={handleSignatureAlignRight}
              className={`p-1.5 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                signatureAlign === 'right' ? 'bg-teal-600 text-white border-teal-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Aliniere la Dreapta"
            >
              <AlignRight className="w-3.5 h-3.5" />
              <span>La Dreapta</span>
            </button>
          </div>
        </div>

        {/* Virtual A4 Paper Document Preview */}
        <div className="bg-white text-slate-900 p-6 sm:p-12 rounded-2xl shadow-2xl border-4 border-slate-300 font-sans text-xs sm:text-sm leading-relaxed space-y-6 select-none">
          {/* 1. DOCUMENT TITLE */}
          <div
            className={`transition-all ${
              titleAlign === 'center' ? 'text-center' : titleAlign === 'right' ? 'text-right' : 'text-left'
            } ${isTitleBold ? 'font-black tracking-wide' : 'font-normal'} ${
              isTitleBlue ? 'text-blue-700' : 'text-slate-900'
            }`}
            style={{ fontSize: `${titleFontSize}px` }}
          >
            CARTA ELEVULUI DIGITAL • CLASA A V-A
          </div>

          {/* 2. BODY INTRODUCTORY PARAGRAPH */}
          <p
            className={`text-slate-800 transition-all ${
              hasFirstLineIndent ? 'indent-8' : 'indent-0'
            } ${
              bodyAlign === 'justify' ? 'text-justify' : bodyAlign === 'center' ? 'text-center' : 'text-left'
            }`}
          >
            În societatea modernă a informației, utilizarea responsabilă și etică a calculatorului este o deprindere fundamentală pentru fiecare elev. Procesarea textelor ne permite să ne exprimăm ideile cu claritate, să elaborăm referate academice impecabile și să colaborăm eficient în proiecte educaționale.
          </p>

          {/* 3. RULES LIST */}
          <div className="my-3 space-y-2 font-medium text-slate-800">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-1">
              Angajamentele Noastre Didactice:
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">
                  {listStyle === 'bullets' ? '•' : listStyle === 'numbers' ? '1.' : '-'}
                </span>
                <span>
                  Vom respecta normele de{' '}
                  <span className={areKeywordsHighlighted ? 'bg-amber-200 text-amber-950 font-bold px-1 rounded' : ''}>
                    securitate cibernetică
                  </span>{' '}
                  și ergonomie în laboratorul de calculatoare.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">
                  {listStyle === 'bullets' ? '•' : listStyle === 'numbers' ? '2.' : '-'}
                </span>
                <span>
                  Vom redacta documentele respectând{' '}
                  <span className={areKeywordsHighlighted ? 'bg-amber-200 text-amber-950 font-bold px-1 rounded' : ''}>
                    regulile de tehnoredactare
                  </span>{' '}
                  și punctuația limbii române.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">
                  {listStyle === 'bullets' ? '•' : listStyle === 'numbers' ? '3.' : '-'}
                </span>
                <span>
                  Vom promova conduita etică de{' '}
                  <span className={areKeywordsHighlighted ? 'bg-amber-200 text-amber-950 font-bold px-1 rounded' : ''}>
                    netichetă
                  </span>{' '}
                  și respectul reciproc în mediul online.
                </span>
              </div>
            </div>
          </div>

          {/* 4. DATE & SIGNATURE */}
          <div className={`pt-6 border-t border-slate-200 flex flex-col ${signatureAlign === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
            <div className="text-slate-500 text-xs">Școala Gimnazială • Anul Școlar 2026-2027</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">Comitetul de Redacție al Clasei a V-a</div>
            <div className="font-serif italic text-blue-900 font-bold mt-1 text-base">Redactor TIC Certificat</div>
          </div>
        </div>

        {/* Live Criteria Feedback Checklist */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">
            {lang === 'en' ? 'Grading Rubric (Grade 10):' : 'Barem de Notare (Nota 10):'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              isC1Met ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <span>1. Titlu centrat, bold, mărime 18pt, albastru</span>
              {isC1Met ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] font-mono text-slate-500">2 pct</span>}
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              isC2Met ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <span>2. Paragraf Justify cu alineat (1.25 cm)</span>
              {isC2Met ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] font-mono text-slate-500">2 pct</span>}
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              isC3Met ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <span>3. Listă structurată cu buline sau numere</span>
              {isC3Met ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] font-mono text-slate-500">2 pct</span>}
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              isC4Met ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <span>4. Cuvinte cheie evidențiate didactic</span>
              {isC4Met ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] font-mono text-slate-500">2 pct</span>}
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between sm:col-span-2 ${
              isC5Met ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <span>5. Semnătura redactorului aliniată la dreapta</span>
              {isC5Met ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] font-mono text-slate-500">2 pct</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={10}
        correctCount={totalMet}
        totalQuestions={5}
        canProceed={canProceed}
        onProceed={() => onCompletePage(earnedScore)}
        onRetry={handleReset}
        isLastPage={true}
      />
    </div>
  );
};
