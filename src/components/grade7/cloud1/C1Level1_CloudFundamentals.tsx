import React, { useState, useEffect } from 'react';
import { Cloud, HardDrive, Wifi, WifiOff, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, RefreshCw, Server, Laptop, ShieldCheck } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface C1Level1Props {
  onPass: (score: number) => void;
}

export const C1Level1_CloudFundamentals: React.FC<C1Level1Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Simulator State: Cloud Sync & Offline Queue
  const [typedDocText, setTypedDocText] = useState<string>(
    lang === 'ro'
      ? 'Echipa Verde: Proiectul de mediu al clasei a VII-a...'
      : 'Green Team: Grade 7 Environmental Science Project...'
  );
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
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Google Docs și Slides nu stochează datele pe stick sau pe hard-diskul școlii, ci pe servere securizate din cloud, replicate în centre de date moderne.'
          : 'Incorrect! Google Docs and Slides store data in secure cloud data centers with geographic replication, not on school hard drives or USB sticks.'
      );
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
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! În Cloud nu este necesară comanda manuală Salvare (Ctrl+S). Fiecare tastare este salvată automat în câteva milisecunde!'
          : 'Incorrect! Manual Ctrl+S saves are unnecessary in the cloud. Every single keystroke is automatically persisted in milliseconds!'
      );
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
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Trimiterea prin link evită virusarea cu malware de pe stick-uri USB și împiedică crearea de fișiere duplicate conflictuale.'
          : 'Incorrect! Sharing via cloud links prevents USB malware transmission and eliminates conflicting, fragmented file versions.'
      );
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'ro'
                ? 'Nivelul 1 • Manual Art Klett pag. 48–51'
                : 'Level 1 • Art Klett Textbook pp. 48–51'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Arhitectura Cloud Computing vs Stocarea Locală'
                : 'Cloud Computing Architecture vs. Local Storage'}
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Învață diferența fundamentală dintre <strong>stocarea pe disc local</strong> (dependentă de un singur calculator și vulnerabilă la căderi de curent) și <strong>Cloud Computing</strong> (rețea de centre de date securizate cu salvare continuă automată și sincronizare multi-dispozitiv).
            </>
          ) : (
            <>
              Master the core differences between <strong>local storage</strong> (tied to a single hardware unit and vulnerable to power cuts) and <strong>Cloud Computing</strong> (a resilient global network of data centers with continuous real-time autosave and cross-device sync).
            </>
          )}
        </p>
      </div>

      {/* Simulator: Interactive Comparison & Autosave Engine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'ro'
                ? 'Simulatorul Motorului de Sincronizare în Cloud (Google Drive)'
                : 'Cloud Synchronization Engine Simulator (Google Drive)'}
            </h3>
          </div>

          {/* Network Switcher Toggle */}
          <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Conexiune Internet:' : 'Internet Link:'}
            </span>
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
                  <span>{lang === 'ro' ? 'ONLINE (Conectat)' : 'ONLINE (Connected)'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'ro' ? 'OFFLINE (Simulat)' : 'OFFLINE (Simulated)'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Document Typing & Cloud Heartbeat Bar */}
        <div className="flex flex-col gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                {lang === 'ro' ? 'Document:' : 'Document:'}
              </span>
              <span className="font-bold text-emerald-300">
                {lang === 'ro' ? '„Proiect_Ecologie_VII.gdoc”' : '“Ecology_Project_Grade7.gdoc”'}
              </span>
            </div>

            {/* Cloud Status indicator pill */}
            <div className="flex items-center gap-2">
              {syncStatus === 'saving' && (
                <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>
                    {lang === 'ro' ? 'Se salvează în Drive...' : 'Saving to Drive...'}
                  </span>
                </span>
              )}
              {syncStatus === 'saved' && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {lang === 'ro' ? 'Toate modificările sunt salvate în Drive' : 'All changes saved to Drive'}
                  </span>
                </span>
              )}
              {syncStatus === 'offline_queued' && (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    {lang === 'ro'
                      ? `Mod offline: ${offlinePendingQueue} editări în așteptare`
                      : `Offline mode: ${offlinePendingQueue} edits queued`}
                  </span>
                </span>
              )}
            </div>
          </div>

          <textarea
            value={typedDocText}
            onChange={(e) => handleTypeInDoc(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 font-sans focus:outline-none focus:border-emerald-500 min-h-[90px]"
            placeholder={
              lang === 'ro'
                ? 'Tastează aici pentru a testa cum funcționează autosave-ul continuu în Cloud...'
                : 'Type here to experience continuous real-time cloud autosaving...'
            }
          />
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              {lang === 'ro'
                ? 'Tastează liber în casetă pentru a observa starea de sincronizare automată.'
                : 'Type freely into the box to observe live synchronization states.'}
            </span>
            <span className="font-mono text-emerald-400">
              {lang === 'ro' ? 'Autosave: ACTIVAT' : 'Autosave: ENABLED'}
            </span>
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
              <span>{lang === 'ro' ? 'Arhitectură Cloud Computing' : 'Cloud Computing Architecture'}</span>
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
              <span>{lang === 'ro' ? 'Stocare Tradițională Locală (HDD/SSD)' : 'Traditional Local Storage (HDD/SSD)'}</span>
            </button>
          </div>

          {activeStorageTab === 'cloud' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'ro' ? 'Siguranță & Replicare' : 'Redundancy & Safety'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ro'
                    ? 'Datele sunt stocate în centre de date cu generatoare de rezervă și discuri redundante. Dacă un server se defectează, altul preia fișierul instantaneu.'
                    : 'Data is replicated across enterprise data centers with power backups. If a server rack fails, another server instantly serves your document.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Laptop className="w-4 h-4" />
                  <span>{lang === 'ro' ? 'Acces Ubicu (Oriunde)' : 'Ubiquitous Access'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ro'
                    ? 'Poți începe referatul pe calculatorul laboratorului de TIC, îl poți continua în autobuz pe smartphone și îl prezinți de pe laptopul de acasă fără stick USB.'
                    : 'Start editing on a school lab PC, review it on a phone on the commute, and present from a home laptop without any USB flash drives.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <RefreshCw className="w-4 h-4" />
                  <span>{lang === 'ro' ? 'Autosave Continuu' : 'Seamless Autosave'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ro'
                    ? 'Nu mai pierzi niciodată munca prin tasta uitată Ctrl+S. Orice întrerupere de curent găsește documentul salvat până la ultima literă tastată.'
                    : 'No more lost paragraphs from forgetting Ctrl+S. Sudden power interruptions leave your document preserved down to the final typed character.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lang === 'ro' ? 'Punct Unic de Eșec' : 'Single Point of Failure'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ro'
                    ? 'Dacă hard diskul calculatorului suferă o avarie mecanică sau este infectat cu ransomware, documentele nesalvate în altă parte sunt pierdute definitiv.'
                    : 'If the mechanical hard drive fails or is infected with ransomware, files without external backups are permanently destroyed.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lang === 'ro' ? 'Haosul Versiunilor pe Stick' : 'Version Chaos on USB'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ro'
                    ? 'Apar fișiere precum Referat_final.docx, Referat_final_v2_bun.docx, ducând la confuzie totală în echipă.'
                    : 'Messy naming cascades occur: Project_final.docx, Project_final_v2_real.docx, causing total team confusion.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lang === 'ro' ? 'Pierderi la Căderi de Curent' : 'Power Outage Losses'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ro'
                    ? 'Dacă nu ai apăsat Ctrl+S în ultimele 20 de minute și se oprește tensiunea electrică în laborator, paragrafele compuse se pierd din memoria RAM.'
                    : 'If Ctrl+S was not triggered during the last 20 minutes before a blackout, volatile RAM data vanishes forever.'}
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
            {lang === 'ro'
              ? 'Verificare Noțiuni: Cloud vs Local (3 Întrebări Interactive)'
              : 'Knowledge Check: Cloud vs. Local (3 Interactive Questions)'}
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 1 din 3' : 'Question 1 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'Unde sunt stocate fizic fișierele create și editate în Google Docs sau Google Slides?'
              : 'Where are documents created in Google Docs or Google Slides physically stored?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'În memoria cache a monitorului din laborator',
                textEn: 'In the computer monitor cache memory'
              },
              {
                id: 'B',
                textRo: 'Pe serverele securizate din centrele de date ale furnizorului de cloud',
                textEn: 'On secure data center servers operated by the cloud provider'
              },
              {
                id: 'C',
                textRo: 'Pe stick-ul USB al profesorului de informatică',
                textEn: 'On the computer teacher’s personal USB drive'
              }
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
              ? 'Ce se întâmplă dacă se oprește brusc curentul electric în timp ce lucrezi la un referat în Google Docs?'
              : 'What happens if power is abruptly lost while working on an essay in Google Docs?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Nicio literă nu se pierde, salvarea fiind automată și continuă la fiecare tastare',
                textEn: 'No text is lost, as autosaving continuously commits every character in real time'
              },
              {
                id: 'B',
                textRo: 'Se pierde tot documentul dacă nu am apăsat tasta F12 la fiecare 3 minute',
                textEn: 'The entire file is lost unless F12 was hit every 3 minutes'
              },
              {
                id: 'C',
                textRo: 'Documentul se șterge automat din motive de confidențialitate',
                textEn: 'The file is wiped clean automatically for security reasons'
              }
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
              ? 'Care este principalul avantaj al partajării unui link cloud față de trimiterea fișierului pe stick USB între colegi?'
              : 'What is the main advantage of sharing a cloud document link over passing files via USB stick?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Stick-ul USB este mai rapid deoarece nu folosește deloc electricitate',
                textEn: 'USB flash drives are faster because they draw zero electricity'
              },
              {
                id: 'B',
                textRo: 'Linkul cloud funcționează numai dacă elevii au calculatoare identice',
                textEn: 'Cloud links only work if all students have identical computers'
              },
              {
                id: 'C',
                textRo: 'Previne răspândirea virușilor de stick și evită versiunile multiple dezordonate ale aceluiași fișier',
                textEn: 'Prevents USB malware transmission and eliminates confusing, conflicting duplicate files'
              }
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
            {allAnsweredCorrectly ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'ro'
                  ? 'Toate întrebările au fost rezolvate corect!'
                  : 'All questions answered correctly!'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la cele 3 întrebări pentru a finaliza Nivelul 1.'
                  : 'Answer all 3 questions correctly to complete Level 1.'}
              </span>
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
            <span>
              {lang === 'ro' ? 'Finalizează Nivelul 1 (+100 XP)' : 'Complete Level 1 (+100 XP)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
