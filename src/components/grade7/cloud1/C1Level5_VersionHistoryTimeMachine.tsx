import React, { useState, useEffect } from 'react';
import { History, Clock, RotateCcw, Tag, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, User, ShieldAlert, Check } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface C1Level5Props {
  onPass: (score: number) => void;
}

interface VersionItem {
  id: string;
  timestamp: string;
  author: string;
  color: string;
  title: string;
  description: string;
  wordCount: number;
  previewSnippet: string;
  isCorrupted?: boolean;
}

export const C1Level5_VersionHistoryTimeMachine: React.FC<C1Level5Props> = ({ onPass }) => {
  // Versions history list
  const versions: VersionItem[] = [
    {
      id: 'v3',
      timestamp: 'Azi, 14:15 (Curent)',
      author: 'Anonim / Utilizator Necunoscut',
      color: 'text-rose-400',
      title: 'Modificare neautorizată',
      description: 'Capitolele 2 și 3 au fost șterse complet; a rămas doar un text parazit!',
      wordCount: 12,
      previewSnippet: 'HAHAHA v-am sters referatul... (Capitole lipsa!)',
      isCorrupted: true
    },
    {
      id: 'v2',
      timestamp: 'Azi, 10:30',
      author: 'Tu, Maria & Andrei',
      color: 'text-emerald-400',
      title: 'Versiune completă de echipă',
      description: 'Toate cele 3 capitole redactate impecabil cu bibliografie și imagini.',
      wordCount: 650,
      previewSnippet: 'Parcul Național Retezat: Istoric, Floră, Faună și Măsuri de Conservare...',
      isCorrupted: false
    },
    {
      id: 'v1',
      timestamp: 'Ieri, 16:00',
      author: 'Maria Popescu',
      color: 'text-blue-400',
      title: 'Ciornă inițială',
      description: 'Structura inițială a documentului și titlurile mari.',
      wordCount: 120,
      previewSnippet: 'Proiect Ecologie: Introducere și obiective de cercetare...',
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
      setQ1ErrorMsg('Incorect! Istoricul versiunilor înregistrează data, ora, autorul fiecărei modificări și evidențiază colorat adăugirile și ștergerile.');
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
      setQ2ErrorMsg('Incorect! Nu este nevoie să rescrii nimic: deschizi istoricul versiunilor și apeși pe „Restaurați această versiune”.');
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
      setQ3ErrorMsg('Incorect! Denumirea unei versiuni (ex: „Varianta Trimisă la Concurs”) permite regăsirea instantanee a etapelor cheie fără a căuta prin zeci de salvări automate mărunte.');
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Nivelul 5 • Manual Art Klett pag. 50–51, 56</span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Istoricul Versiunilor & Mașina Timpului în Cloud
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Descoperă cum funcționează <strong>Mașina Timpului (Version History)</strong>: cum inspectezi cine a modificat textul, cum recuperezi instantaneu capitole șterse din greșeală și cum denumești versiunile cheie ale proiectului tău.
        </p>
      </div>

      {/* Simulator: Interactive Version History Time Machine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Simulator Panou: „Vedeți Istoricul Versiunilor” (Ctrl + Alt + Shift + H)
            </h3>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Stare curentă: {activeRestoredVersion === 'v2' ? (
              <span className="text-emerald-400 font-bold">Document Restaurat cu Succes! ✓</span>
            ) : (
              <span className="text-rose-400 font-bold">ALERTA: Document Compromis / Șters! ⚠️</span>
            )}
          </div>
        </div>

        {/* The Split Interface: Version List (Sidebar) & Live Preview (Center) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Version List Sidebar */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Jurnal Versiuni Salvate:
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
                  <span className="text-xs font-bold text-white">{ver.timestamp}</span>
                  {ver.isCorrupted ? (
                    <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40">
                      Compromis
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {ver.wordCount} cuvinte
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`font-semibold ${ver.color}`}>{ver.author}</span>
                </div>

                <span className="text-[11px] text-slate-400 leading-snug">{ver.title}</span>
              </button>
            ))}
          </div>

          {/* Diff & Document Preview Window */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Previzualizare: {currentPreview.timestamp}</span>
                    <span className={`text-xs ${currentPreview.color}`}>({currentPreview.author})</span>
                  </h4>
                  <span className="text-xs text-slate-400">{currentPreview.description}</span>
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
                  <span>Restaurați această versiune</span>
                </button>
              </div>

              {/* Document Text Box */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 min-h-[160px] font-sans text-xs sm:text-sm leading-relaxed">
                {currentPreview.id === 'v3' && (
                  <div className="text-rose-400 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs bg-rose-950/60 p-2 rounded border border-rose-500/40">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Conținut compromis de un utilizator neautorizat la 14:15!</span>
                    </div>
                    <p className="line-through text-slate-500">
                      [Capitolele 1, 2, 3 și bibliografia au fost eliminate din document]
                    </p>
                    <p className="font-mono text-rose-300">„HAHAHA v-am sters tot referatul...”</p>
                  </div>
                )}

                {currentPreview.id === 'v2' && (
                  <div className="text-slate-200 flex flex-col gap-3">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs bg-emerald-950/60 p-2 rounded border border-emerald-500/40 text-emerald-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Versiune completă salvată înainte de incident (Azi, 10:30)</span>
                    </div>
                    <p className="font-bold text-white text-sm">Parcul Național Retezat — Studiu Interdisciplinar</p>
                    <p>
                      <strong>1. Cadrul Natural:</strong> Cel mai vechi parc național din România, cu 82 de lacuri glaciare și vârfuri alpine de peste 2500m.
                    </p>
                    <p>
                      <strong>2. Biodiversitate:</strong> Adăpostește lupi, capre negre, râși și peste 1190 specii de plante vasculare superioare.
                    </p>
                    <p className="text-xs text-slate-400">
                      [Formatare Justified, diacritice conforme, referințe bibliografice validate]
                    </p>
                  </div>
                )}

                {currentPreview.id === 'v1' && (
                  <div className="text-slate-300 flex flex-col gap-2">
                    <span className="text-xs font-mono text-blue-400">Ciornă inițială (Ieri, 16:00)</span>
                    <p className="font-bold text-white">Proiect Ecologie: Parcul Național Retezat</p>
                    <p>Obiectiv: Cercetarea rezervațiilor biosferei din România...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Name This Version Sub-Panel */}
            {activeRestoredVersion === 'v2' && (
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span>Denumește această versiune restaurată:</span>
                </div>

                {!isVersionNamed ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={customVersionName}
                      onChange={(e) => setCustomVersionName(e.target.value)}
                      placeholder="Ex: Varianta Oficială Concurs..."
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      onClick={handleNameVersion}
                      disabled={!customVersionName.trim()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Salvează Nume
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/40">
                    Etichetă salvată: „{customVersionName}” ✓
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
            Verificare Noțiuni: Istoricul Versiunilor (3 Întrebări Interactive)
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Întrebarea 1 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Ce informații precise salvează Google Docs în panoul „Istoricul versiunilor”?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Data, ora exactă a fiecărei salvări, numele autorului și modificările colorate pe text' },
              { id: 'B', text: 'Doar numărul de litere fără a ști cine a scris' },
              { id: 'C', text: 'O copie audio a tastaturii elevului' }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q1Cooldown}s până la următoarea încercare. {q1ErrorMsg}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Întrebarea 2 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Cum poți recupera rapid un capitol întreg șters din greșeală de un coleg cu 30 de minute în urmă?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Trebuie să reinstalezi sistemul de operare Windows' },
              { id: 'B', text: 'Apeși tasta Backspace de 500 de ori' },
              { id: 'C', text: 'Deschizi Istoricul versiunilor, selectezi versiunea de acum 35 de minute și apeși pe „Restaurați această versiune”' }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q2Cooldown}s până la următoarea încercare. {q2ErrorMsg}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Întrebarea 3 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            De ce este util să denumești anumite versiuni din istoric (ex: „Varianta Oficială Trimisă la Concurs”)?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Deoarece altfel documentul nu se va putea salva pe internet' },
              { id: 'B', text: 'Permite regăsirea instantanee a etapelor cheie ale proiectului fără a căuta prin zeci de salvări automate mici' },
              { id: 'C', text: 'Pentru a ascunde numele colegilor din echipă' }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q3Cooldown}s până la următoarea încercare. {q3ErrorMsg}
            </div>
          )}
        </div>

        {/* Pass Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {isRestorationSuccessful && allAnsweredCorrectly ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Documentul a fost salvat prin Mașina Timpului și testul este rezolvat!
              </span>
            ) : (
              <span>Restaurează versiunea sănătoasă de la 10:30 și răspunde la întrebări.</span>
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
            <span>Finalizează Nivelul 5 (+100 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
