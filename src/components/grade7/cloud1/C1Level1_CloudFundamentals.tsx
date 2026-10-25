import React, { useState, useEffect } from 'react';
import { Cloud, HardDrive, Wifi, WifiOff, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, RefreshCw, Server, Laptop, ShieldCheck } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface C1Level1Props {
  onPass: (score: number) => void;
}

export const C1Level1_CloudFundamentals: React.FC<C1Level1Props> = ({ onPass }) => {
  // Simulator State: Cloud Sync & Offline Queue
  const [typedDocText, setTypedDocText] = useState<string>('Echipa Verde: Proiectul de mediu al clasei a VII-a...');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'offline_queued'>('saved');
  const [offlinePendingQueue, setOfflinePendingQueue] = useState<number>(0);
  const [activeStorageTab, setActiveStorageTab] = useState<'cloud' | 'local'>('cloud');

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

  // Cooldown timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ2Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ3Cooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTypeInDoc = (newText: string) => {
    setTypedDocText(newText);
    if (!isOnline) {
      setSyncStatus('offline_queued');
      setOfflinePendingQueue((prev) => prev + 1);
    } else {
      setSyncStatus('saving');
      setTimeout(() => {
        setSyncStatus('saved');
      }, 650);
    }
  };

  const handleToggleOnline = () => {
    sounds.playClick();
    const nextState = !isOnline;
    setIsOnline(nextState);

    if (nextState) {
      // Reconnected -> flush offline queue
      if (offlinePendingQueue > 0) {
        setSyncStatus('saving');
        setTimeout(() => {
          setSyncStatus('saved');
          setOfflinePendingQueue(0);
          sounds.playCorrect();
        }, 800);
      } else {
        setSyncStatus('saved');
      }
    } else {
      setSyncStatus('offline_queued');
    }
  };

  const handleCheckQ1 = (choice: string) => {
    if (q1Cooldown > 0) return;
    setQ1Answer(choice);
    if (choice === 'B') {
      sounds.playCorrect();
      setQ1ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ1Cooldown(5);
      setQ1ErrorMsg('Incorect! Google Docs și Slides nu stochează datele pe stick sau pe hard-diskul școlii, ci pe servere securizate din cloud, replicate în centre de date moderne.');
    }
  };

  const handleCheckQ2 = (choice: string) => {
    if (q2Cooldown > 0) return;
    setQ2Answer(choice);
    if (choice === 'A') {
      sounds.playCorrect();
      setQ2ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ2Cooldown(5);
      setQ2ErrorMsg('Incorect! În Cloud nu este necesară comanda manuală Salvare (Ctrl+S). Fiecare tastare este salvată automat în câteva milisecunde!');
    }
  };

  const handleCheckQ3 = (choice: string) => {
    if (q3Cooldown > 0) return;
    setQ3Answer(choice);
    if (choice === 'C') {
      sounds.playCorrect();
      setQ3ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ3Cooldown(5);
      setQ3ErrorMsg('Incorect! Trimiterea prin link evită virusarea cu malware de pe stick-uri USB și împiedică crearea de fișiere duplicate conflictuale.');
    }
  };

  const allAnsweredCorrectly = q1Answer === 'B' && q2Answer === 'A' && q3Answer === 'C';

  const handleFinishLevel = () => {
    if (!allAnsweredCorrectly) return;
    setIsPassed(true);
    sounds.playLevelComplete();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Nivelul 1 • Manual Art Klett pag. 48–51</span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Arhitectura Cloud Computing vs Stocarea Locală
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Învață diferența fundamentală dintre <strong>stocarea pe disc local</strong> (dependentă de un singur calculator și vulnerabilă la căderi de curent) și <strong>Cloud Computing</strong> (rețea de centre de date securizate cu salvare continuă automată și sincronizare multi-dispozitiv).
        </p>
      </div>

      {/* Simulator: Interactive Comparison & Autosave Engine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Simulatorul Motorului de Sincronizare în Cloud (Google Drive)
            </h3>
          </div>

          {/* Network Switcher Toggle */}
          <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Conexiune Internet:</span>
            <button
              onClick={handleToggleOnline}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
                isOnline
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-rose-600/30 text-rose-300 border border-rose-500/50'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ONLINE (Conectat)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>OFFLINE (Simulat)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Document Typing & Cloud Heartbeat Bar */}
        <div className="flex flex-col gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Document:</span>
              <span className="font-bold text-emerald-300">„Proiect_Ecologie_VII.gdoc”</span>
            </div>

            {/* Cloud Status indicator pill */}
            <div className="flex items-center gap-2">
              {syncStatus === 'saving' && (
                <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Se salvează în Drive...</span>
                </span>
              )}
              {syncStatus === 'saved' && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Toate modificările sunt salvate în Drive</span>
                </span>
              )}
              {syncStatus === 'offline_queued' && (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mod offline: {offlinePendingQueue} editări în așteptare</span>
                </span>
              )}
            </div>
          </div>

          <textarea
            value={typedDocText}
            onChange={(e) => handleTypeInDoc(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 font-sans focus:outline-none focus:border-emerald-500 min-h-[90px]"
            placeholder="Tastează aici pentru a testa cum funcționează autosave-ul continuu în Cloud..."
          />
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Tastează liber în casetă pentru a observa starea de sincronizare automată.</span>
            <span className="font-mono text-emerald-400">Autosave: ACTIVAT</span>
          </div>
        </div>

        {/* Interactive Comparison Tabs: Cloud vs Local */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => {
                setActiveStorageTab('cloud');
                sounds.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeStorageTab === 'cloud'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Arhitectură Cloud Computing</span>
            </button>
            <button
              onClick={() => {
                setActiveStorageTab('local');
                sounds.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeStorageTab === 'local'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Stocare Tradițională Locală (HDD/SSD)</span>
            </button>
          </div>

          {activeStorageTab === 'cloud' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Siguranță & Replicare</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Datele sunt stocate în centre de date cu generatoare de rezervă și discuri redundante. Dacă un server se defectează, altul preia fișierul instantaneu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Laptop className="w-4 h-4" />
                  <span>Acces Ubicu (Oriunde)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Poți începe referatul pe calculatorul laboratorului de TIC, îl poți continua în autobuz pe smartphone și îl prezinți de pe laptopul de acasă fără stick USB.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <RefreshCw className="w-4 h-4" />
                  <span>Autosave Continuu</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Nu mai pierzi niciodată munca prin tasta uitată Ctrl+S. Orice întrerupere de curent găsește documentul salvat până la ultima literă tastată.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Punct Unic de Eșec</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dacă hard diskul calculatorului suferă o avarie mecanică sau este infectat cu ransomware, documentele nesalvate în altă parte sunt pierdute definitiv.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Haosul Versiunilor pe Stick</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apar fișiere precum <code>Referat_final.docx</code>, <code>Referat_final_v2_bun.docx</code>, <code>Referat_final_sigur_acum.docx</code>, ducând la confuzie totală în echipă.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pierderi la Căderi de Curent</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dacă nu ai apăsat Ctrl+S în ultimele 20 de minute și se oprește tensiunea electrică în laborator, paragrafele compuse se pierd din memoria RAM.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Section with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Verificare Noțiuni: Cloud vs Local (3 Întrebări Interactive)
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Întrebarea 1 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Unde sunt stocate fizic fișierele create și editate în Google Docs sau Google Slides?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'În memoria cache a monitorului din laborator' },
              { id: 'B', text: 'Pe serverele securizate din centrele de date ale furnizorului de cloud' },
              { id: 'C', text: 'Pe stick-ul USB al profesorului de informatică' }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q1Cooldown > 0}
                onClick={() => handleCheckQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'B'
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
            Ce se întâmplă dacă se oprește brusc curentul electric în timp ce lucrezi la un referat în Google Docs?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Nicio literă nu se pierde, salvarea fiind automată și continuă la fiecare tastare' },
              { id: 'B', text: 'Se pierde tot documentul dacă nu am apăsat tasta F12 la fiecare 3 minute' },
              { id: 'C', text: 'Documentul se șterge automat din motive de confidențialitate' }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q2Cooldown > 0}
                onClick={() => handleCheckQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'A'
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
            Care este principalul avantaj al partajării unui link cloud față de trimiterea fișierului pe stick USB între colegi?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Stick-ul USB este mai rapid deoarece nu folosește deloc electricitate' },
              { id: 'B', text: 'Linkul cloud funcționează numai dacă elevii au calculatoare identice' },
              { id: 'C', text: 'Previne răspândirea virușilor de stick și evită versiunile multiple dezordonate ale aceluiași fișier' }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q3Cooldown > 0}
                onClick={() => handleCheckQ3(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'C'
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
            {allAnsweredCorrectly ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Toate întrebările au fost rezolvate corect!
              </span>
            ) : (
              <span>Răspunde corect la cele 3 întrebări pentru a finaliza Nivelul 1.</span>
            )}
          </div>

          <button
            onClick={handleFinishLevel}
            disabled={!allAnsweredCorrectly || isPassed}
            className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              allAnsweredCorrectly && !isPassed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Finalizează Nivelul 1 (+100 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
