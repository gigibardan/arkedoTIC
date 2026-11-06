import React, { useState, useEffect } from 'react';
import { History, Clock, RotateCcw, Tag, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, User, ShieldAlert, Check } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface C1Level5Props {
  onPass: (score: number) => void;
}

interface VersionItem {
  id: string;
  timestampRo: string;
  timestampEn: string;
  authorRo: string;
  authorEn: string;
  color: string;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  wordCount: number;
  previewSnippetRo: string;
  previewSnippetEn: string;
  isCorrupted?: boolean;
}

export const C1Level5_VersionHistoryTimeMachine: React.FC<C1Level5Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Versions history list
  const versions: VersionItem[] = [
    {
      id: 'v3',
      timestampRo: 'Azi, 14:15 (Curent)',
      timestampEn: 'Today, 14:15 (Current)',
      authorRo: 'Anonim / Utilizator Necunoscut',
      authorEn: 'Anonymous / Unknown Visitor',
      color: 'text-rose-400',
      titleRo: 'Modificare neautorizată',
      titleEn: 'Unauthorized Modification',
      descriptionRo: 'Capitolele 2 și 3 au fost șterse complet; a rămas doar un text parazit!',
      descriptionEn: 'Chapters 2 & 3 completely erased; only junk defacement remains!',
      wordCount: 12,
      previewSnippetRo: 'HAHAHA v-am sters referatul... (Capitole lipsa!)',
      previewSnippetEn: 'HAHAHA erased your report... (Chapters missing!)',
      isCorrupted: true
    },
    {
      id: 'v2',
      timestampRo: 'Azi, 10:30',
      timestampEn: 'Today, 10:30',
      authorRo: 'Tu, Maria & Andrei',
      authorEn: 'You, Maria & Andrew',
      color: 'text-emerald-400',
      titleRo: 'Versiune completă de echipă',
      titleEn: 'Comprehensive Team Master Version',
      descriptionRo: 'Toate cele 3 capitole redactate impecabil cu bibliografie și imagini.',
      descriptionEn: 'All 3 chapters drafted with full bibliography and citations.',
      wordCount: 650,
      previewSnippetRo: 'Parcul Național Retezat: Istoric, Floră, Faună și Măsuri de Conservare...',
      previewSnippetEn: 'Retezat National Park: History, Flora, Fauna and Habitat Protection...',
      isCorrupted: false
    },
    {
      id: 'v1',
      timestampRo: 'Ieri, 16:00',
      timestampEn: 'Yesterday, 16:00',
      authorRo: 'Maria Popescu',
      authorEn: 'Maria Miller',
      color: 'text-blue-400',
      titleRo: 'Ciornă inițială',
      titleEn: 'Initial Outline Draft',
      descriptionRo: 'Structura inițială a documentului și titlurile mari.',
      descriptionEn: 'Early document scaffolding with headline markers.',
      wordCount: 120,
      previewSnippetRo: 'Proiect Ecologie: Introducere și obiective de cercetare...',
      previewSnippetEn: 'Ecology Project: Introduction and research scope...',
      isCorrupted: false
    }
  ];

  const [selectedVersionId, setSelectedVersionId] = useState<string>('v3');
  const [activeRestoredVersion, setActiveRestoredVersion] = useState<string>('v3');
  const [isVersionNamed, setIsVersionNamed] = useState<boolean>(false);
  const [customVersionName, setCustomVersionName] = useState<string>('');

  // Quiz questions state with 5s cooldown
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q1ErrorMsg, setQ1ErrorMsg] = useState<string>('');

  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q2ErrorMsg, setQ2ErrorMsg] = useState<string>('');

  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);
  const [q3ErrorMsg, setQ3ErrorMsg] = useState<string>('');

  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ2Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ3Cooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectVersion = (vId: string) => {
    sounds.playClick();
    setSelectedVersionId(vId);
  };

  const handleRestoreVersion = () => {
    if (selectedVersionId === 'v2') {
      setActiveRestoredVersion('v2');
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleNameVersion = () => {
    if (!customVersionName.trim()) return;
    setIsVersionNamed(true);
    sounds.playCorrect();
  };

  const handleCheckQ1 = (choice: string) => {
    if (q1Cooldown > 0) return;
    setQ1Answer(choice);
    if (choice === 'A') {
      sounds.playCorrect();
      setQ1ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Istoricul versiunilor înregistrează data, ora, autorul fiecărei modificări și evidențiază colorat adăugirile și ștergerile.'
          : 'Incorrect! Version history logs timestamp, author, and color-coded diffs of all insertions and deletions.'
      );
    }
  };

  const handleCheckQ2 = (choice: string) => {
    if (q2Cooldown > 0) return;
    setQ2Answer(choice);
    if (choice === 'C') {
      sounds.playCorrect();
      setQ2ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Nu este nevoie să rescrii nimic: deschizi istoricul versiunilor și apeși pe „Restaurați această versiune”.'
          : 'Incorrect! No need to retype from scratch: simply open version history, pick the healthy snapshot, and click "Restore this version".'
      );
    }
  };

  const handleCheckQ3 = (choice: string) => {
    if (q3Cooldown > 0) return;
    setQ3Answer(choice);
    if (choice === 'B') {
      sounds.playCorrect();
      setQ3ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Denumirea unei versiuni (ex: „Varianta Trimisă la Concurs”) permite regăsirea instantanee a etapelor cheie fără a căuta prin zeci de salvări automate mărunte.'
          : 'Incorrect! Naming milestones (e.g. "Competition Master Final") enables instant retrieval without combing through dozens of granular auto-saves.'
      );
    }
  };

  const isRestorationSuccessful = activeRestoredVersion === 'v2';
  const allAnsweredCorrectly = q1Answer === 'A' && q2Answer === 'C' && q3Answer === 'B';

  const handleFinishLevel = () => {
    if (!allAnsweredCorrectly || !isRestorationSuccessful) return;
    setIsPassed(true);
    sounds.playLevelComplete();
    onPass(100);
  };

  const currentPreview = versions.find((v) => v.id === selectedVersionId)!;

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'ro'
                ? 'Nivelul 5 • Manual Art Klett pag. 50–51, 56'
                : 'Level 5 • Art Klett Textbook pp. 50–51, 56'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Istoricul Versiunilor & Mașina Timpului în Cloud'
                : 'Version History & The Cloud Time Machine'}
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Descoperă cum funcționează <strong>Mașina Timpului (Version History)</strong>: cum inspectezi cine a modificat textul, cum recuperezi instantaneu capitole șterse din greșeală și cum denumești versiunile cheie ale proiectului tău.
            </>
          ) : (
            <>
              Discover the power of the <strong>Cloud Time Machine (Version History)</strong>: inspect granular author edits, roll back accidental erasures instantly, and assign custom milestone tags to team deliverables.
            </>
          )}
        </p>
      </div>

      {/* Simulator: Interactive Version History Time Machine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'ro'
                ? 'Simulator Panou: „Vedeți Istoricul Versiunilor” (Ctrl + Alt + Shift + H)'
                : 'Panel Simulator: "See Version History" (Ctrl + Alt + Shift + H)'}
            </h3>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            {lang === 'ro' ? 'Stare curentă: ' : 'Current State: '}
            {activeRestoredVersion === 'v2' ? (
              <span className="text-emerald-400 font-bold">
                {lang === 'ro' ? 'Document Restaurat cu Succes! ✓' : 'Document Restored Successfully! ✓'}
              </span>
            ) : (
              <span className="text-rose-400 font-bold">
                {lang === 'ro' ? 'ALERTA: Document Compromis / Șters! ⚠️' : 'ALERT: Document Defaced / Compromised! ⚠️'}
              </span>
            )}
          </div>
        </div>

        {/* The Split Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Version List Sidebar */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              {lang === 'ro' ? 'Jurnal Versiuni Salvate:' : 'Saved Version Snapshots:'}
            </span>

            {versions.map((ver) => (
              <button
                key={ver.id}
                onClick={() => handleSelectVersion(ver.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                  selectedVersionId === ver.id
                    ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {lang === 'ro' ? ver.timestampRo : ver.timestampEn}
                  </span>
                  {ver.isCorrupted ? (
                    <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40">
                      {lang === 'ro' ? 'Compromis' : 'Defaced'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {ver.wordCount} {lang === 'ro' ? 'cuvinte' : 'words'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`font-semibold ${ver.color}`}>
                    {lang === 'ro' ? ver.authorRo : ver.authorEn}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 leading-snug">
                  {lang === 'ro' ? ver.titleRo : ver.titleEn}
                </span>
              </button>
            ))}
          </div>

          {/* Diff & Document Preview Window */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>
                      {lang === 'ro' ? 'Previzualizare: ' : 'Preview: '}
                      {lang === 'ro' ? currentPreview.timestampRo : currentPreview.timestampEn}
                    </span>
                    <span className={`text-xs ${currentPreview.color}`}>
                      ({lang === 'ro' ? currentPreview.authorRo : currentPreview.authorEn})
                    </span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    {lang === 'ro' ? currentPreview.descriptionRo : currentPreview.descriptionEn}
                  </span>
                </div>

                {/* Restore Button */}
                <button
                  onClick={handleRestoreVersion}
                  disabled={selectedVersionId !== 'v2' || activeRestoredVersion === 'v2'}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedVersionId === 'v2' && activeRestoredVersion !== 'v2'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'ro' ? 'Restaurați această versiune' : 'Restore this version'}
                  </span>
                </button>
              </div>

              {/* Document Text Box */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 min-h-[160px] font-sans text-xs sm:text-sm leading-relaxed">
                {currentPreview.id === 'v3' && (
                  <div className="text-rose-400 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs bg-rose-950/60 p-2 rounded border border-rose-500/40">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>
                        {lang === 'ro'
                          ? 'Conținut compromis de un utilizator neautorizat la 14:15!'
                          : 'Content defaced by an unauthorized visitor at 14:15!'}
                      </span>
                    </div>
                    <p className="line-through text-slate-500">
                      {lang === 'ro'
                        ? '[Capitolele 1, 2, 3 și bibliografia au fost eliminate din document]'
                        : '[Chapters 1, 2, 3 and bibliography were excised from the file]'}
                    </p>
                    <p className="font-mono text-rose-300">
                      {lang === 'ro'
                        ? '„HAHAHA v-am sters tot referatul...”'
                        : '“HAHAHA erased your report...”'}
                    </p>
                  </div>
                )}

                {currentPreview.id === 'v2' && (
                  <div className="text-slate-200 flex flex-col gap-3">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs bg-emerald-950/60 p-2 rounded border border-emerald-500/40 text-emerald-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>
                        {lang === 'ro'
                          ? 'Versiune completă salvată înainte de incident (Azi, 10:30)'
                          : 'Pristine master version prior to incident (Today, 10:30)'}
                      </span>
                    </div>
                    <p className="font-bold text-white text-sm">
                      {lang === 'ro'
                        ? 'Parcul Național Retezat — Studiu Interdisciplinar'
                        : 'Retezat National Park — Interdisciplinary Study'}
                    </p>
                    <p>
                      <strong>{lang === 'ro' ? '1. Cadrul Natural:' : '1. Physical Geography:'}</strong>{' '}
                      {lang === 'ro'
                        ? 'Cel mai vechi parc național din România, cu 82 de lacuri glaciare și vârfuri alpine de peste 2500m.'
                        : 'Oldest national park in Romania, protecting 82 glacial lakes and alpine peaks above 2,500m.'}
                    </p>
                    <p>
                      <strong>{lang === 'ro' ? '2. Biodiversitate:' : '2. Biodiversity:'}</strong>{' '}
                      {lang === 'ro'
                        ? 'Adăpostește lupi, capre negre, râși și peste 1190 specii de plante vasculare superioare.'
                        : 'Home to wolves, chamois, lynx, and over 1,190 vascular plant species.'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {lang === 'ro'
                        ? '[Formatare Justified, diacritice conforme, referințe bibliografice validate]'
                        : '[Justified formatting, standardized typography, validated citations]'}
                    </p>
                  </div>
                )}

                {currentPreview.id === 'v1' && (
                  <div className="text-slate-300 flex flex-col gap-2">
                    <span className="text-xs font-mono text-blue-400">
                      {lang === 'ro' ? 'Ciornă inițială (Ieri, 16:00)' : 'Initial outline (Yesterday, 16:00)'}
                    </span>
                    <p className="font-bold text-white">
                      {lang === 'ro'
                        ? 'Proiect Ecologie: Parcul Național Retezat'
                        : 'Ecology Project: Retezat National Park'}
                    </p>
                    <p>
                      {lang === 'ro'
                        ? 'Obiectiv: Cercetarea rezervațiilor biosferei din România...'
                        : 'Objective: Surveying Romanian biosphere reserves...'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Name This Version Sub-Panel */}
            {activeRestoredVersion === 'v2' && (
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span>
                    {lang === 'ro'
                      ? 'Denumește această versiune restaurată:'
                      : 'Assign milestone name to restored version:'}
                  </span>
                </div>

                {!isVersionNamed ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={customVersionName}
                      onChange={(e) => setCustomVersionName(e.target.value)}
                      placeholder={
                        lang === 'ro'
                          ? 'Ex: Varianta Oficială Concurs...'
                          : 'e.g. Official Competition Master...'
                      }
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      onClick={handleNameVersion}
                      disabled={!customVersionName.trim()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      {lang === 'ro' ? 'Salvează Nume' : 'Save Name'}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/40">
                    {lang === 'ro' ? 'Etichetă salvată: ' : 'Milestone saved: '}„{customVersionName}” ✓
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Section with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            {lang === 'ro'
              ? 'Verificare Noțiuni: Istoricul Versiunilor (3 Întrebări Interactive)'
              : 'Knowledge Check: Version History (3 Interactive Questions)'}
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 1 din 3' : 'Question 1 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'Ce informații precise salvează Google Docs în panoul „Istoricul versiunilor”?'
              : 'What precise metadata does Google Docs log in the "Version History" panel?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Data, ora exactă a fiecărei salvări, numele autorului și modificările colorate pe text',
                textEn: 'Exact timestamp of each save, author identity, and color-coded text diffs'
              },
              {
                id: 'B',
                textRo: 'Doar numărul de litere fără a ști cine a scris',
                textEn: 'Only the total character count without author attribution'
              },
              {
                id: 'C',
                textRo: 'O copie audio a tastaturii elevului',
                textEn: 'An audio recording of student keystrokes'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q1Cooldown > 0}
                onClick={() => handleCheckQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'A'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q1Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q1Cooldown}s până la următoarea încercare. ${q1ErrorMsg}`
                : `Cooldown active: ${q1Cooldown}s until next attempt. ${q1ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 2 din 3' : 'Question 2 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'Cum poți recupera rapid un capitol întreg șters din greșeală de un coleg cu 30 de minute în urmă?'
              : 'How can you instantly recover an entire section accidentally deleted by a peer 30 minutes ago?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Trebuie să reinstalezi sistemul de operare Windows',
                textEn: 'You must reinstall the Windows operating system'
              },
              {
                id: 'B',
                textRo: 'Apeși tasta Backspace de 500 de ori',
                textEn: 'Press the Backspace key 500 times'
              },
              {
                id: 'C',
                textRo: 'Deschizi Istoricul versiunilor, selectezi versiunea de acum 35 de minute și apeși pe „Restaurați această versiune”',
                textEn: 'Open Version History, select the snapshot from 35 minutes ago, and click "Restore this version"'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q2Cooldown > 0}
                onClick={() => handleCheckQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'C'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q2Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q2Cooldown}s până la următoarea încercare. ${q2ErrorMsg}`
                : `Cooldown active: ${q2Cooldown}s until next attempt. ${q2ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 3 din 3' : 'Question 3 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'De ce este util să denumești anumite versiuni din istoric (ex: „Varianta Oficială Trimisă la Concurs”)?'
              : 'Why is it recommended to assign names to specific milestones (e.g. "Official Competition Submission")?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Deoarece altfel documentul nu se va putea salva pe internet',
                textEn: 'Because otherwise the document cannot be stored on the internet'
              },
              {
                id: 'B',
                textRo: 'Permite regăsirea instantanee a etapelor cheie ale proiectului fără a căuta prin zeci de salvări automate mici',
                textEn: 'Enables instant retrieval of key project milestones without searching through dozens of minor auto-saves'
              },
              {
                id: 'C',
                textRo: 'Pentru a ascunde numele colegilor din echipă',
                textEn: 'To conceal the identities of team members'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q3Cooldown > 0}
                onClick={() => handleCheckQ3(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'B'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q3Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q3Cooldown}s până la următoarea încercare. ${q3ErrorMsg}`
                : `Cooldown active: ${q3Cooldown}s until next attempt. ${q3ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Pass Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {isRestorationSuccessful && allAnsweredCorrectly ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'ro'
                  ? 'Documentul a fost salvat prin Mașina Timpului și testul este rezolvat!'
                  : 'Document recovered via Time Machine and knowledge check passed!'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Restaurează versiunea sănătoasă de la 10:30 și răspunde la întrebări.'
                  : 'Restore the healthy 10:30 milestone and complete the quiz questions.'}
              </span>
            )}
          </div>

          <button
            onClick={handleFinishLevel}
            disabled={!isRestorationSuccessful || !allAnsweredCorrectly || isPassed}
            className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              isRestorationSuccessful && allAnsweredCorrectly && !isPassed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'ro' ? 'Finalizează Nivelul 5 (+100 XP)' : 'Complete Level 5 (+100 XP)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
