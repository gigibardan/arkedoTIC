import React, { useState, useEffect } from 'react';
import { Search, Replace, CheckCircle2, Sparkles, BookOpen, FileCheck2, Download, AlertCircle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { PageNavigationFooter } from './PageNavigationFooter';
import { AnswerExplanation } from './AnswerExplanation';
import { QuestionHint } from './QuestionHint';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface TLevel6Props {
  onCompletePage: (score: number) => void;
}

export const TLevel6_FindReplaceAndSpellcheck: React.FC<TLevel6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Find & Replace State
  const [findInput, setFindInput] = useState<string>('ENIAK');
  const [replaceInput, setReplaceInput] = useState<string>('ENIAC');
  const [isReplacedAll, setIsReplacedAll] = useState<boolean>(false);
  const [replaceCount, setReplaceCount] = useState<number>(0);

  // File export choice
  const [selectedFormat, setSelectedFormat] = useState<'docx' | 'pdf' | 'txt' | null>(null);

  // Quiz questions
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);

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

  const handleExecuteReplaceAll = () => {
    sounds.playClick();
    if (findInput.trim().toUpperCase() === 'ENIAK' && replaceInput.trim().toUpperCase() === 'ENIAC') {
      sounds.playVictory();
      setIsReplacedAll(true);
      setReplaceCount(4);
      arky.triggerSuccess(
        lang === 'en'
          ? 'Magnificent! 4 instances replaced instantly across the whole document!'
          : 'Magnific! Toate cele 4 ocurențe greșite au fost înlocuite instantaneu!'
      );
    } else {
      sounds.playWrong();
      arky.triggerError(
        lang === 'en'
          ? 'Check your words: Find "ENIAK" and replace with "ENIAC"!'
          : 'Verifică termenii: Caută „ENIAK” și înlocuiește cu „ENIAC”!'
      );
    }
  };

  const handleSelectFormat = (fmt: 'docx' | 'pdf' | 'txt') => {
    sounds.playClick();
    setSelectedFormat(fmt);
    if (fmt === 'pdf') {
      sounds.playCorrect();
    }
  };

  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'red_line') {
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
    if (val === 'ctrl_h') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  // Evaluation
  let criteriaMet = 0;
  if (isReplacedAll) criteriaMet += 1;
  if (selectedFormat === 'pdf') criteriaMet += 1;

  const isQ1Correct = q1Answer === 'red_line';
  const isQ2Correct = q2Answer === 'ctrl_h';

  let correctTotal = 0;
  if (criteriaMet === 2) correctTotal += 1;
  if (isQ1Correct) correctTotal += 1;
  if (isQ2Correct) correctTotal += 1;

  const totalQuestions = 3;
  const earnedScore = Math.round((correctTotal / totalQuestions) * 15);
  const canProceed = isReplacedAll;

  const handleReset = () => {
    sounds.playClick();
    setIsReplacedAll(false);
    setReplaceCount(0);
    setFindInput('ENIAK');
    setReplaceInput('ENIAC');
    setSelectedFormat(null);
    setQ1Answer(null);
    setQ2Answer(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-slate-900 to-blue-950/60 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Module 4 • Page 6 of 7' : 'Modulul 4 • Pagina 6 din 7'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'en' ? 'Find & Replace, Spell Check, and Export' : 'Găsire, Înlocuire, Verificare Ortografică & Salvare'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Automate edits with Ctrl+F and Ctrl+H (Textbook pp. 65–67), decode spellcheck squiggly lines, and export to proper file formats (.docx vs .pdf).'
                : 'Automatizează editarea cu Ctrl+F și Ctrl+H (Manual pag. 65–67), descifrează liniile de verificare ortografică și alege formatul potrivit (.docx vs .pdf).'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            🔍
          </div>
        </div>
      </div>

      {/* Theory Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'en' ? 'Smart Editing Tools (Textbook p. 65)' : 'Instrumente Inteligente de Editare (Manual pag. 65)'}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {lang === 'en' ? 'Spellcheck and Search Automation' : 'Corectarea Greșelilor și Căutarea Globală'}
        </h2>

        {/* 3 Core Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/30">
            <div className="text-xs font-bold text-rose-400 font-mono uppercase mb-1">
              Linia Roșie Ondulată ~~~
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Semnalează o <strong>eroare de ortografie</strong> (cuvânt scris greșit sau cuvânt lipsă din dicționar). Dă click dreapta pentru a vedea sugestiile de corectare sau pentru a adăuga cuvântul în dicționar.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-blue-500/30">
            <div className="text-xs font-bold text-blue-400 font-mono uppercase mb-1">
              Linia Albastră Ondulată ~~~
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Semnalează o <strong>eroare gramaticală sau de punctuație</strong> (cum ar fi un spațiu înainte de virgulă, două spații consecutive sau lipsa majusculei la început de propoziție).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30">
            <div className="text-xs font-bold text-cyan-400 font-mono uppercase mb-1">
              Înlocuire Globală (Ctrl+H)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Economisește timp uriaș! Dacă ai greșit un nume sau o dată de 50 de ori într-un document lung, comanda <strong>Înlocuire Totală (Replace All)</strong> le corectează pe toate într-o secundă.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Activity: Find & Replace Simulator */}
      <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
              <Replace className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Interactive Lab • Replace All Simulator' : 'Laborator Interactiv • Simulator Find & Replace'}
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {lang === 'en' ? 'Replace the Misspelled Computer Name "ENIAK" with "ENIAC"' : 'Înlocuiește automat toate greșelile „ENIAK” cu „ENIAC”!'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">{lang === 'en' ? 'Replaced Items:' : 'Elemente înlocuite:'}</span>
            <span className="text-sm font-bold font-mono text-cyan-400">
              {replaceCount} / 4
            </span>
          </div>
        </div>

        {/* Find & Replace Dialog Box Mockup */}
        <div className="bg-slate-950 border-2 border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-300">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Găsire și Înlocuire (Find and Replace - Ctrl+H)</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">Microsoft Word Tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">De căutat (Find what):</label>
              <input
                type="text"
                value={findInput}
                onChange={(e) => setFindInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Înlocuire cu (Replace with):</label>
              <input
                type="text"
                value={replaceInput}
                onChange={(e) => setReplaceInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleExecuteReplaceAll}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95"
            >
              <Replace className="w-4 h-4" />
              <span>Înlocuiește Tot (Replace All)</span>
            </button>
          </div>
        </div>

        {/* Paper Text Preview */}
        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border-4 border-slate-200 font-sans text-xs sm:text-sm leading-relaxed space-y-3 select-none">
          <div className="text-center font-bold text-base text-cyan-950 border-b pb-2">
            CAPITOLUL ISTORIC: NAȘTEREA CALCULATOARELOR ELECTRONICE
          </div>

          <p className="indent-6 text-slate-800">
            În istoria informaticii, calculatorul{' '}
            <span
              className={`font-black px-1.5 py-0.5 rounded transition-all ${
                isReplacedAll
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300 underline decoration-wavy decoration-rose-500'
              }`}
            >
              {isReplacedAll ? 'ENIAC' : 'ENIAK'}
            </span>{' '}
            este considerat un punct de cotitură esențial. Proiectul{' '}
            <span
              className={`font-black px-1.5 py-0.5 rounded transition-all ${
                isReplacedAll
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300 underline decoration-wavy decoration-rose-500'
              }`}
            >
              {isReplacedAll ? 'ENIAC' : 'ENIAK'}
            </span>{' '}
            a fost finanțat de armata Statelor Unite în timpul celui de-al Doilea Război Mondial.
          </p>

          <p className="indent-6 text-slate-800">
            Arhitectura mașinii{' '}
            <span
              className={`font-black px-1.5 py-0.5 rounded transition-all ${
                isReplacedAll
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300 underline decoration-wavy decoration-rose-500'
              }`}
            >
              {isReplacedAll ? 'ENIAC' : 'ENIAK'}
            </span>{' '}
            utiliza peste 17.000 de tuburi electronice cu vid. Succesul uriaș al lui{' '}
            <span
              className={`font-black px-1.5 py-0.5 rounded transition-all ${
                isReplacedAll
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300 underline decoration-wavy decoration-rose-500'
              }`}
            >
              {isReplacedAll ? 'ENIAC' : 'ENIAK'}
            </span>{' '}
            a deschis calea cercetării moderne către computerele personale pe care le folosim astăzi.
          </p>
        </div>

        {/* Task 2: File Format Selection */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 font-mono uppercase">
            {lang === 'en'
              ? 'Task 2: Choose the ideal format for submitting to teacher (prints identically on all devices):'
              : 'Pasul 2: Alege formatul ideal de trimitere către profesor (se imprimă identic pe orice dispozitiv fără distorsiuni):'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSelectFormat('docx')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                selectedFormat === 'docx'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-white text-xs">.DOCX (Word Document)</div>
              <div className="text-[11px] text-slate-400 mt-1">Excelent pentru editare ulterioară, dar layout-ul se poate schimba pe versiuni vechi de Word.</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectFormat('pdf')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                selectedFormat === 'pdf'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>.PDF (Portable Document)</span>
                {selectedFormat === 'pdf' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">✓ Ideal pentru tipărire și transmitere oficială! Păstrează fonturile și aranjarea exactă pe orice ecran.</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectFormat('txt')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                selectedFormat === 'txt'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-white text-xs">.TXT (Plain Text)</div>
              <div className="text-[11px] text-slate-400 mt-1">Text pur, pierde complet culorile, fonturile, imaginile și tabelele.</div>
            </button>
          </div>
        </div>
      </div>

      {/* Two Textbook Assessment Questions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider font-mono">
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'en' ? 'Textbook Assessment (p. 67, Ex. 1 & 4)' : 'Verificare din Manual (pag. 67, Ex. 1 & 4)'}</span>
        </div>

        {/* Question 1: Spell Check Red Line */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '1. What does a red wavy underline beneath a word indicate in Microsoft Word or Google Docs?'
                : '1. Ce indică linia roșie ondulată care apare sub un cuvânt în timp ce tastezi într-un procesor de text?'}
            </h4>
            <span className="text-xs font-mono text-cyan-400 font-semibold shrink-0">1 punct</span>
          </div>

          {q1Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza rolul corectorului ortografic din manual pag. 66."
                customMessageEn="Incorrect! Please take 5 seconds to review the Spell Checker on textbook page 66."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('red_line')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'red_line'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'A spelling mistake or word unrecognized by the dictionary' : 'O greșeală de ortografie sau un cuvânt necunoscut de dicționar'}
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('important')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'important'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'That the word is the most important word in the document' : 'Că acel cuvânt este cel mai important din document'}
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('virus')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'virus'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'That the file contains a dangerous computer virus' : 'Că documentul este infectat cu un virus informatic'}
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('print')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'print'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'That the printer ran out of red ink' : 'Că imprimanta nu mai are cerneală roșie'}
            </button>
          </div>

          <QuestionHint
            hintRo="Linia roșie ondulată este trasată de corectorul ortografic (Spell Checker) când o literă este greșită sau lipsesc diacriticele."
            hintEn="The red wavy underline is generated by the spellchecker for spelling errors."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! The red wavy line signals spelling errors or terms missing from the active dictionary.' : 'Corect! Linia roșie ondulată semnalează greșeli ortografice sau cuvinte care nu figurează în dicționarul activ.')
                  : (lang === 'en' ? 'Incorrect. Red wavy lines indicate spelling errors.' : 'Incorect. Linia roșie ondulată semnalează o greșeală de ortografie.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 66 • Spell Checker' : 'Manual pag. 66 • Corectorul Ortografic'}
            />
          )}
        </div>

        {/* Question 2: Shortcut for Replace */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '2. Which keyboard shortcut brings up the Replace dialog box in Word?'
                : '2. Ce combinație rapidă de taste deschide fereastra de Înlocuire (Replace)?'}
            </h4>
            <span className="text-xs font-mono text-cyan-400 font-semibold shrink-0">1 punct</span>
          </div>

          {q2Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza scurtătura Înlocuire (Replace) din manual pag. 65."
                customMessageEn="Incorrect! Please take 5 seconds to review the Replace Shortcut on textbook page 65."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('ctrl_h')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'ctrl_h'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) Ctrl + H (Replace / Înlocuire)
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('ctrl_f')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'ctrl_f'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) Ctrl + F (Doar Găsire / Find)
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('ctrl_p')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'ctrl_p'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) Ctrl + P (Print / Tipărire)
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('ctrl_z')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'ctrl_z'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) Ctrl + Z (Undo / Anulare)
            </button>
          </div>

          <QuestionHint
            hintRo="Ctrl+F este pentru Find (Găsire), iar Ctrl+H deschide direct tab-ul de Replace (Înlocuire)."
            hintEn="Ctrl+F is Find; Ctrl+H opens Replace directly."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Perfect! Ctrl+H is the classic shortcut for Replace, whereas Ctrl+F is for simple Find.' : 'Corect! Ctrl+H deschide caseta de dialog Înlocuire (Replace). Scurtătura Ctrl+F deschide panoul de Găsire simplă.')
                  : (lang === 'en' ? 'Incorrect. Ctrl+H opens the Replace dialog.' : 'Incorect. Combinația Ctrl + H deschide fereastra de Înlocuire.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 65 • Replace Shortcut' : 'Manual pag. 65 • Scurtătura Înlocuire'}
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
