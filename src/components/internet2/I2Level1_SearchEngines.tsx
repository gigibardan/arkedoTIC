import React, { useState } from 'react';
import {
  Search,
  Filter,
  Globe,
  Sparkles,
  CheckCircle2,
  FileText,
  HelpCircle,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { TeacherTip } from '../TeacherTip';
import { QuestionHint } from '../internet1/QuestionHint';
import { AnswerExplanation } from '../internet1/AnswerExplanation';
import { PageNavigationFooter } from '../internet1/PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface I2Level1_SearchEnginesProps {
  onCompletePage: (score: number) => void;
}

export const I2Level1_SearchEnginesProps_DefaultScore = 15;

export const I2Level1_SearchEngines: React.FC<I2Level1_SearchEnginesProps> = ({
  onCompletePage,
}) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Task 1: Search engine definition
  const [q1SearchEngine, setQ1SearchEngine] = useState<string>('');
  // Task 2: Advanced Search Operator Quiz
  const [q2ExactSearch, setQ2ExactSearch] = useState<string>('');
  // Task 3: Interactive Search Query Simulator
  const [q3SearchTask, setQ3SearchTask] = useState<{
    operator: string;
    keyword: string;
    filetype: string;
  }>({
    operator: '',
    keyword: '',
    filetype: '',
  });
  const [simulatedResults, setSimulatedResults] = useState<boolean>(false);

  const isQ1Correct = q1SearchEngine === 'database_crawler';
  const isQ2Correct = q2ExactSearch === 'quotes';
  const isQ3Correct =
    q3SearchTask.operator === 'site_edu' &&
    q3SearchTask.keyword === 'sistemul solar' &&
    q3SearchTask.filetype === 'pdf';

  const correctCount = (isQ1Correct ? 1 : 0) + (isQ2Correct ? 1 : 0) + (isQ3Correct ? 1 : 0);
  const totalQuestions = 3;
  const pageScore = correctCount === 3 ? 15 : correctCount === 2 ? 10 : correctCount === 1 ? 5 : 0;

  const handleSimulateSearch = () => {
    sounds.playClick();
    setSimulatedResults(true);
    if (isQ3Correct) {
      sounds.playCorrect();
      arky.triggerSuccess(
        lang === 'en'
          ? 'Brilliant query syntax! You filtered exclusively official PDF documents from educational domains! 🎯'
          : 'Sintaxă de căutare impecabilă! Ai filtrat exclusiv documente PDF oficiale de pe domenii educaționale! 🎯'
      );
    } else {
      sounds.playWrong();
    }
  };

  const handleProceed = () => {
    sounds.playVictory();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    sounds.playClick();
    setQ1SearchEngine('');
    setQ2ExactSearch('');
    setQ3SearchTask({ operator: '', keyword: '', filetype: '' });
    setSimulatedResults(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'en' ? 'Module 3B • Page 1 of 6' : 'Modulul 3B • Pagina 1 din 6'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Textbook pp. 37–38' : 'Manual pag. 37–38'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight mb-2">
            {lang === 'en'
              ? '1. Search Engines & Advanced Operators'
              : '1. Motoare de Căutare & Operatori Avansați'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'en'
              ? 'Learn how search engines (Google, Bing, DuckDuckGo) index the web, how keywords work, and how advanced operators like quotation marks "", the minus sign "-", and site filters help you find the exact needle in the digital haystack!'
              : 'Descoperă cum funcționează motoarele de căutare (Google, Bing, DuckDuckGo), ce sunt cuvintele cheie (keywords) și cum operatorii avansați (ghilimelele "", semnul minus "-", operatorul "site:" și "filetype:") te ajută să găsești acul în carul cu fân al Internetului!'}
          </p>
        </div>
      </div>

      {/* Teacher Tip Pill */}
      <TeacherTip
        title={
          lang === 'en'
            ? 'Teacher Tip: The Golden Syntax of Smart Searching (pp. 37–38)'
            : 'Sfatul Profesorului: Sintaxa de Aur pentru Căutări Inteligente (pag. 37–38)'
        }
        text={
          lang === 'en'
            ? '• Exact phrase matching: Put words inside quotation marks (e.g., "Mihai Eminescu") so the engine searches for the exact phrase in order, not separate words! • Excluding unwanted words: Use a minus sign with NO space after it (e.g., jaguar -masina if you want the wild feline animal, not the car brand)! • Filtering by file format: Add filetype:pdf to download ready-made presentations, articles, or books!'
            : '• Căutare exactă de expresie: Pune cuvintele între ghilimele (ex: "Mihai Eminescu") pentru ca motorul să caute expresia compactă exact în acea ordine, nu cuvintele împrăștiate! • Excluderea termenilor nedoriți: Folosește semnul minus lipit de cuvânt (ex: jaguar -masina dacă te interesează felina sălbatică, nu marca de mașini)! • Căutare după tip de fișier: Folosește filetype:pdf pentru a găsi direct referate, cărți sau documente oficiale!'
        }
        extra={
          lang === 'en'
            ? 'Did you know? DuckDuckGo is a privacy-focused search engine that never tracks your search history or builds advertising profiles!'
            : 'Știați că? DuckDuckGo este un motor de căutare orientat pe confidențialitate care nu îți stochează istoricul căutărilor și nu creează profile de publicitate!'
        }
      />

      {/* Interactive Theory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold mb-3 border border-blue-500/30">
            🔎
          </div>
          <h3 className="text-sm font-bold text-white font-heading mb-1.5">
            {lang === 'en' ? 'Keywords (Cuvinte Cheie)' : 'Cuvinte Cheie (Keywords)'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Do not type full conversational sentences. Use concise, essential nouns (e.g., "temperatura Bucuresti" instead of "cat de cald este astazi afara in orasul Bucuresti").'
              : 'Nu scrie fraze lungi de conversație. Folosește termeni esențiali și substantivi (ex: "temperatura Bucuresti" în loc de "as dori sa stiu cat de cald este azi in oras").'}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl font-bold mb-3 border border-purple-500/30">
            ""
          </div>
          <h3 className="text-sm font-bold text-white font-heading mb-1.5">
            {lang === 'en' ? 'Ghilimele "..." (Exact Match)' : 'Ghilimele "..." (Expresie Exactă)'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Forces the search engine to return only pages where those exact words appear side-by-side in that identical sequence (vital for poem lines or famous quotes).'
              : 'Obligă motorul să returneze doar paginile în care termenii apar exact alăturați și în ordinea specificată (esențial pentru versuri de poezii sau citate celebre).'}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mb-3 border border-emerald-500/30">
            site:
          </div>
          <h3 className="text-sm font-bold text-white font-heading mb-1.5">
            {lang === 'en' ? 'Operator site: & filetype:' : 'Operator site: & filetype:'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'site:edu.ro restricts search exclusively to Romanian schools and universities. filetype:pdf returns only downloadable PDF documents.'
              : 'site:edu.ro limitează căutarea exclusiv pe site-urile școlilor și universităților din România. filetype:pdf găsește doar documente descărcabile PDF.'}
          </p>
        </div>
      </div>

      {/* Task 1: Ce este un motor de căutare? */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs font-mono font-black">
              1
            </span>
            {lang === 'en'
              ? 'What is the role of a Search Engine on the World Wide Web?'
              : 'Care este rolul unui Motor de Căutare (Search Engine) pe World Wide Web?'}
          </h3>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          {lang === 'en'
            ? 'Select the most accurate technical definition according to textbook page 37:'
            : 'Alege definiția tehnică exactă conform manualului de TIC pag. 37:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ1SearchEngine('database_crawler');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1SearchEngine === 'database_crawler'
                ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Specialized Web Indexer' : 'A) Indexator & Bază de date Web'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'An automated software system that scans, indexes, and categorizes billions of web pages to quickly find information based on keywords.'
                : 'Un sistem software automatizat care parcurge, indexează și clasifică miliarde de pagini web pentru a găsi rapid informații pe baza cuvintelor cheie.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1SearchEngine('physical_browser');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1SearchEngine === 'physical_browser'
                ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Hardware Cable Router' : 'B) Router Hardware de Cablu'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'A physical plastic box connected with fiber optic cables that transmits electricity to the computer monitor.'
                : 'O cutie fizică din plastic cu cabluri de fibră optică ce transmite curent electric către ecranul monitorului.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1SearchEngine('text_editor');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1SearchEngine === 'text_editor'
                ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'C) Word Processor App' : 'C) Editor de Text Offline'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'An offline program installed on the local hard disk used solely for formatting font styles and printing paper pages.'
                : 'Un program instalat pe hard disk folosit exclusiv pentru formatarea fonturilor și tipărirea paginilor pe hârtie.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q1-search-engine-def"
          hintRo="Gândește-te la Google, Bing sau Yahoo: ele nu sunt cabluri și nici programe de desenat, ci servicii uriașe pe servere care țin o arhivă/index cu toate site-urile din lume!"
          hintEn="Think of Google or Bing: they are neither cables nor offline text editors; they are massive automated indexing systems on server clusters!"
        />

        {q1SearchEngine && (
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanationRo={
              isQ1Correct
                ? 'Excelent! Motoarele de căutare folosesc roboți software («spiders» / «crawlers») care analizează continuu paginile web și construiesc indexuri uriașe pentru căutare rapidă.'
                : q1SearchEngine === 'physical_browser'
                ? 'Routerul de cablu este un echipament hardware de rețea care rutează pachetele electrice/optice, nu un motor software de căutare a informațiilor pe internet.'
                : 'Editorul de text (ex: Notepad, Word) este o aplicație pentru redactat documente pe calculatorul tău, fără legătură cu indexarea paginilor web globale.'
            }
            explanationEn={
              isQ1Correct
                ? 'Spot on! Search engines use automated crawlers/spiders that catalog the web into massive queryable indexes.'
                : q1SearchEngine === 'physical_browser'
                ? 'A physical router is network hardware routing packet traffic, not a web indexing software service.'
                : 'A text editor formats local documents; it does not crawl or index global web pages.'
            }
          />
        )}
      </div>

      {/* Task 2: Operatorul de căutare exactă */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs font-mono font-black">
              2
            </span>
            {lang === 'en'
              ? 'Which operator finds the EXACT phrase "Mihai Eminescu Somnoroase Pasarele"?'
              : 'Ce operator garantează găsirea expresiei EXACTE "Mihai Eminescu Somnoroase Pasarele"?'}
          </h3>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ2ExactSearch('quotes');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
              q2ExactSearch === 'quotes'
                ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="font-bold text-slate-100 font-mono text-sm mb-1">
              "Mihai Eminescu Somnoroase Pasarele"
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Enclosed in double quotation marks' : 'Încadrare între ghilimele duble ("...")'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ2ExactSearch('plus_sign');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
              q2ExactSearch === 'plus_sign'
                ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="font-bold text-slate-100 font-mono text-sm mb-1">
              Mihai + Eminescu + Somnoroase
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Separated with plus mathematical signs' : 'Separare cu semne de adunare (+)'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ2ExactSearch('parentheses');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
              q2ExactSearch === 'parentheses'
                ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="font-bold text-slate-100 font-mono text-sm mb-1">
              (Mihai Eminescu Somnoroase Pasarele)
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Wrapped in round parentheses' : 'Încadrare între paranteze rotunde (...) '}
            </div>
          </button>
        </div>

        <QuestionHint
          id="q2-exact-quotes"
          hintRo="În manualul de informatică (pag. 37-38), ghilimelele sunt numite «operatorul de expresie exactă». Ele leagă cuvintele ca într-un lanț continuu!"
          hintEn="Textbook pp. 37–38 states that quotation marks bind words into an unbreakable exact sequence!"
        />

        {q2ExactSearch && (
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanationRo={
              isQ2Correct
                ? 'Foarte bine! Ghilimelele (" ") forțează motorul să caute cuvintele exact în această ordine și fără alte cuvinte intercalate între ele.'
                : q2ExactSearch === 'plus_sign'
                ? 'Semnul plus (+) era folosit în trecut ca operator logic AND, dar nu garantează că acele cuvinte apar lipite în ordinea exactă a versului.'
                : 'Parantezele rotunde sunt folosite pentru grupări logice complexe (AND/OR), nu pentru căutarea de expresie literară exactă.'
            }
            explanationEn={
              isQ2Correct
                ? 'Spot on! Quotation marks ensure the search engine matches the exact contiguous sequence of words.'
                : q2ExactSearch === 'plus_sign'
                ? 'The plus sign indicates keyword inclusion, but does not guarantee the exact contiguous phrase order.'
                : 'Parentheses group boolean operations, but do not force an exact literal string match.'
            }
          />
        )}
      </div>

      {/* Task 3: Simulator Practic de Căutare Avansată */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs font-mono font-black">
              3
            </span>
            {lang === 'en'
              ? 'Interactive Search Lab: Filter a School Presentation (.pdf) from Romanian Educational Domains'
              : 'Laborator Practic: Filtrează un referat școlar (.pdf) de pe domenii educaționale românești'}
          </h3>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {lang === 'en'
            ? 'Build the query to find articles about "sistemul solar" exclusively on Romanian educational institutions (.edu.ro) in PDF format:'
            : 'Configurează cei 3 parametri de căutare pentru a găsi referatul despre «sistemul solar» exclusiv pe domenii educaționale (.edu.ro) în format PDF:'}
        </p>

        {/* Builder Bar */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
          {/* Operator 1: Domain filter */}
          <div className="w-full sm:w-1/3">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              {lang === 'en' ? '1. Domain Filter (site:)' : '1. Filtru Domeniu (site:)'}
            </label>
            <select
              value={q3SearchTask.operator}
              onChange={(e) => {
                setQ3SearchTask((prev) => ({ ...prev, operator: e.target.value }));
                setSimulatedResults(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono"
            >
              <option value="">{lang === 'en' ? '-- Select Domain --' : '-- Alege Domeniul --'}</option>
              <option value="site_edu">site:edu.ro</option>
              <option value="site_com">site:com</option>
              <option value="site_tiktok">site:tiktok.com</option>
            </select>
          </div>

          {/* Keyword */}
          <div className="w-full sm:w-1/3">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              {lang === 'en' ? '2. Search Subject' : '2. Subiectul Căutării'}
            </label>
            <select
              value={q3SearchTask.keyword}
              onChange={(e) => {
                setQ3SearchTask((prev) => ({ ...prev, keyword: e.target.value }));
                setSimulatedResults(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono"
            >
              <option value="">{lang === 'en' ? '-- Select Topic --' : '-- Alege Subiectul --'}</option>
              <option value="sistemul solar">"sistemul solar"</option>
              <option value="muzica_trap">muzica trap</option>
              <option value="jocuri_online">jocuri online</option>
            </select>
          </div>

          {/* Filetype */}
          <div className="w-full sm:w-1/3">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              {lang === 'en' ? '3. File Format (filetype:)' : '3. Format Fișier (filetype:)'}
            </label>
            <select
              value={q3SearchTask.filetype}
              onChange={(e) => {
                setQ3SearchTask((prev) => ({ ...prev, filetype: e.target.value }));
                setSimulatedResults(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono"
            >
              <option value="">{lang === 'en' ? '-- Select Format --' : '-- Alege Formatul --'}</option>
              <option value="pdf">filetype:pdf (Document PDF)</option>
              <option value="exe">filetype:exe (Program Executabil)</option>
              <option value="mp3">filetype:mp3 (Fișier Audio)</option>
            </select>
          </div>
        </div>

        {/* Query Preview bar */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 truncate">
            <Search className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              {q3SearchTask.operator === 'site_edu' ? 'site:edu.ro' : q3SearchTask.operator || '...'}{' '}
              {q3SearchTask.keyword ? `"${q3SearchTask.keyword}"` : '...'}{' '}
              {q3SearchTask.filetype ? `filetype:${q3SearchTask.filetype}` : '...'}
            </span>
          </div>

          <button
            type="button"
            disabled={!q3SearchTask.operator || !q3SearchTask.keyword || !q3SearchTask.filetype}
            onClick={handleSimulateSearch}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              q3SearchTask.operator && q3SearchTask.keyword && q3SearchTask.filetype
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Run Query Simulator' : 'Execută Căutarea'}</span>
          </button>
        </div>

        {/* Simulated Results Display */}
        {simulatedResults && (
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3 animate-fadeIn">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'en' ? 'Simulated Engine Results:' : 'Rezultate Simulate Motor de Căutare:'}</span>
            </div>

            {isQ3Correct ? (
              <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-500/40">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-bold mb-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px]">PDF</span>
                  <span>https://astronomie.univ-edu.ro/cursuri/sistemul-solar.pdf</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Sistemul Solar: Structură, Planete și Corpuri Cerești [PDF]
                </h4>
                <p className="text-xs text-slate-300">
                  Ghid didactic oficial aprobat pentru orele de științe și astronomie din școlile românești...
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/40 text-xs text-amber-200">
                {q3SearchTask.operator !== 'site_edu' ? (
                  <p>⚠️ Domeniul ales nu este cel educațional oficial (site:edu.ro).</p>
                ) : q3SearchTask.keyword !== 'sistemul solar' ? (
                  <p>⚠️ Subiectul ales nu corespunde referatului despre Sistemul Solar.</p>
                ) : (
                  <p>⚠️ Formatul cerut este un document PDF descărcabil (filetype:pdf), nu un fișier executabil sau audio.</p>
                )}
              </div>
            )}
          </div>
        )}

        {simulatedResults && (
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanationRo={
              isQ3Correct
                ? 'Excelent! Ai combinat filtrul de domeniu universitar/școlar românesc (site:edu.ro) cu expresia exactă a temei și extensia de documente sigure PDF.'
                : 'Verifică cerința: referatul despre «sistemul solar» trebuie să fie pe domeniul educațional .edu.ro și în format .pdf.'
            }
            explanationEn={
              isQ3Correct
                ? 'Excellent! You combined the Romanian educational domain filter with the exact topic and safe PDF file format.'
                : 'Double-check requirements: the Solar System presentation must reside on .edu.ro in .pdf format.'
            }
          />
        )}
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={correctCount > 0}
        onProceed={handleProceed}
        onRetry={handleReset}
      />
    </div>
  );
};
