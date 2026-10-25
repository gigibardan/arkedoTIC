import React, { useState, useEffect } from 'react';
import { Users, Edit3, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, Eye, MessageSquare, Flame, Check } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface C1Level3Props {
  onPass: (score: number) => void;
}

export const C1Level3_SynchronousEditing: React.FC<C1Level3Props> = ({ onPass }) => {
  // Simulator State: Live Multi-User Co-editing
  const [userText, setUserText] = useState<string>('Parcul Național Retezat adăpostește peste 1190 specii de plante superioare...');
  const [mariaTextIndex, setMariaTextIndex] = useState<number>(0);
  const [andreiTextIndex, setAndreiTextIndex] = useState<number>(0);

  const mariaFullSentence = 'Munții Retezat reprezintă cel mai vechi parc național din România, fondat în anul 1935 la inițiativa savantului Emil Racoviță.';
  const andreiFullSentence = 'Fauna include capre negre, urși bruni, lupi, râși și 82 de lacuri glaciare spectaculoase, printre care Lacul Bucura.';

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

  // Simulated live typing stream for Maria and Andrei
  useEffect(() => {
    const streamInterval = setInterval(() => {
      setMariaTextIndex((prev) => (prev < mariaFullSentence.length ? prev + 1 : prev));
      setAndreiTextIndex((prev) => (prev < andreiFullSentence.length ? prev + 1 : prev));
    }, 70);

    return () => clearInterval(streamInterval);
  }, [mariaFullSentence.length, andreiFullSentence.length]);

  // Cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ2Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ3Cooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckQ1 = (choice: string) => {
    if (q1Cooldown > 0) return;
    setQ1Answer(choice);
    if (choice === 'A') {
      sounds.playCorrect();
      setQ1ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ1Cooldown(5);
      setQ1ErrorMsg('Incorect! Cursorul colorat arată prezența în direct a colegului și punctul exact unde acesta tastează sau selectează text în document.');
    }
  };

  const handleCheckQ2 = (choice: string) => {
    if (q2Cooldown > 0) return;
    setQ2Answer(choice);
    if (choice === 'B') {
      sounds.playCorrect();
      setQ2ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ2Cooldown(5);
      setQ2ErrorMsg('Incorect! Pentru un flux eficient de lucru, membrii echipei își împart secțiunile sau capitolele, evitând editarea aceluiași rând în același timp.');
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
      setQ3ErrorMsg('Incorect! Serverele cloud combină în timp real fluxurile de date ale utilizatorilor fără a fi nevoie de reîncărcarea paginii.');
    }
  };

  const hasTypedEnough = userText.length >= 80;
  const allAnsweredCorrectly = q1Answer === 'A' && q2Answer === 'B' && q3Answer === 'C';

  const handleFinishLevel = () => {
    if (!allAnsweredCorrectly || !hasTypedEnough) return;
    setIsPassed(true);
    sounds.playLevelComplete();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Nivelul 3 • Manual Art Klett pag. 48–51</span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Colaborare Sincronă în Timp Real & Cursori Multi-Utilizator
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Descoperă magia redactării sincronizate: cum funcționează <strong>cursorii colorați</strong> pe ecran, cum se evită suprapunerea accidentală de conținut și cum se împart sarcinile într-o echipă școlară.
        </p>
      </div>

      {/* Simulator: Live Multi-Cursor Collaborative Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        {/* Top App Bar & Active Presence Avatars */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300 font-bold">
              📄
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                „Referat Geografie: Parcul Național Retezat”
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Modul Editare • 3 Utilizatori Activi Concomitent</span>
            </div>
          </div>

          {/* Active Co-editor Avatars */}
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">În direct:</span>
            <div className="flex items-center -space-x-2">
              <div
                title="Tu (Secțiunea 3: Biodiversitate)"
                className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-900 shadow ring-1 ring-emerald-400"
              >
                Tu
              </div>
              <div
                title="Maria (Secțiunea 1: Istoric & Emil Racoviță)"
                className="w-7 h-7 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center border-2 border-slate-900 shadow ring-1 ring-pink-400"
              >
                M
              </div>
              <div
                title="Andrei (Secțiunea 2: Floră, Faună & Lacuri Glaciare)"
                className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center border-2 border-slate-900 shadow ring-1 ring-amber-400"
              >
                A
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>
        </div>

        {/* The Live Document Layout */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-6 text-sm">
          {/* Section 1: Maria's Section */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-pink-950/15 border border-pink-500/30">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-pink-400">1. Istoric & Fondare (Redactat de Maria Popescu)</span>
              <span className="text-[11px] text-pink-300/80 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-500/40 animate-pulse">
                Maria scrie acum...
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
              {mariaFullSentence.slice(0, mariaTextIndex)}
              {mariaTextIndex < mariaFullSentence.length && (
                <span className="inline-block relative">
                  <span className="inline-block w-0.5 h-4 bg-pink-400 animate-pulse align-middle ml-0.5" />
                  <span className="absolute -top-5 left-0 bg-pink-500 text-white text-[9px] font-bold px-1 rounded shadow pointer-events-none whitespace-nowrap">
                    Maria
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Section 2: Andrei's Section */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-amber-950/15 border border-amber-500/30">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-400">2. Faună & Relief Glaciar (Redactat de Andrei Ionescu)</span>
              <span className="text-[11px] text-amber-300/80 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                Andrei scrie acum...
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
              {andreiFullSentence.slice(0, andreiTextIndex)}
              {andreiTextIndex < andreiFullSentence.length && (
                <span className="inline-block relative">
                  <span className="inline-block w-0.5 h-4 bg-amber-400 animate-pulse align-middle ml-0.5" />
                  <span className="absolute -top-5 left-0 bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded shadow pointer-events-none whitespace-nowrap">
                    Andrei
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Section 3: Student's Section */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-emerald-950/20 border-2 border-emerald-500/50">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-emerald-400">3. Floră & Conservare (Secțiunea Ta de Lucru)</span>
              <span className="text-emerald-400 font-bold">
                {userText.length >= 80 ? '✓ Secțiune completă' : `Minim 80 caractere (${userText.length}/80)`}
              </span>
            </div>
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl p-3 text-xs sm:text-sm text-slate-100 font-sans focus:outline-none focus:border-emerald-400 min-h-[90px]"
              placeholder="Scrie concluziile tale despre flora și protecția Parcului Național Retezat..."
            />
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Fiecare coleg redactează în secțiunea lui fără să suprascrie munca celorlalți.</span>
              <span className="font-mono text-emerald-300">Cursorul tău: VERDE EMERALD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Section with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Verificare Noțiuni: Colaborare Sincronă (3 Întrebări Interactive)
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Întrebarea 1 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Ce semnifică prezența unui cursor colorat cu etichetă de nume în interiorul documentului?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Poziția exactă unde un coleg citește, selectează sau scrie în timp real' },
              { id: 'B', text: 'O eroare de afișare cauzată de placa grafică a monitorului' },
              { id: 'C', text: 'Semnul că documentul este blocat și nu mai poate fi editat de nimeni' }
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
            Cum este recomandat să lucreze o echipă de 3 elevi pentru a menține o productivitate maximă fără haos?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Toți cei 3 elevi trebuie să scrie în același paragraf pe rândul 1' },
              { id: 'B', text: 'Își împart dinainte capitolele sau secțiunile documentului, redactând în paralel' },
              { id: 'C', text: 'Un singur elev tastează, iar ceilalți doi doar dau Like pe document' }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q2Cooldown > 0}
                onClick={() => handleCheckQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'B'
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
            Dacă doi colegi scriu simultan în capitole diferite ale aceluiași document Google Docs, ce face platforma?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Șterge automat textul colegului care a început cu 2 secunde mai târziu' },
              { id: 'B', text: 'Închide documentul și trimite o avertizare de coliziune' },
              { id: 'C', text: 'Sincronizează ambele editări pe server fără conflicte, actualizând ecranele tuturor instantaneu' }
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
            {hasTypedEnough && allAnsweredCorrectly ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Secțiunea a fost redactată și testul a fost promovat!
              </span>
            ) : (
              <span>Redactează minim 80 de caractere în secțiunea 3 și răspunde corect la întrebări.</span>
            )}
          </div>

          <button
            onClick={handleFinishLevel}
            disabled={!hasTypedEnough || !allAnsweredCorrectly || isPassed}
            className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              hasTypedEnough && allAnsweredCorrectly && !isPassed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Finalizează Nivelul 3 (+100 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
