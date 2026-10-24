import React, { useState, useEffect } from 'react';
import { Scissors, Crop, VolumeX, RotateCcw, CheckCircle2, AlertTriangle, Sparkles, HelpCircle, FileAudio, Play, Pause } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A1Level5Props {
  onPass: (score: number) => void;
}

interface AudioSegment {
  id: string;
  label: string;
  durationMs: number;
  type: 'speech' | 'dead_space' | 'stumble' | 'chair_creak';
  status: 'active' | 'silenced' | 'deleted';
}

export const A1Level5_AudioEditingTechniques: React.FC<A1Level5Props> = ({ onPass }) => {
  // Track segments
  const initialSegments: AudioSegment[] = [
    { id: 'seg1', label: 'Pauză moartă de pornire (1.5s)', durationMs: 1500, type: 'dead_space', status: 'active' },
    { id: 'seg2', label: 'Voce: „Bună ziua stimați ascultători”', durationMs: 2500, type: 'speech', status: 'active' },
    { id: 'seg3', label: 'Bâlbă: „ăăă... stai că reiau” (1.2s)', durationMs: 1200, type: 'stumble', status: 'active' },
    { id: 'seg4', label: 'Voce: „Astăzi vorbim despre acustică”', durationMs: 2800, type: 'speech', status: 'active' },
    { id: 'seg5', label: 'Pauză cu scârțâit de scaun (1.0s)', durationMs: 1000, type: 'chair_creak', status: 'active' },
    { id: 'seg6', label: 'Voce: „Rămâneți alături de noi!”', durationMs: 2000, type: 'speech', status: 'active' },
  ];

  const [segments, setSegments] = useState<AudioSegment[]>(initialSegments);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>('seg1');

  // Pedagogical questions state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);

  const [q1ErrorMsg, setQ1ErrorMsg] = useState<string>('');
  const [q2ErrorMsg, setQ2ErrorMsg] = useState<string>('');
  const [q3ErrorMsg, setQ3ErrorMsg] = useState<string>('');

  useEffect(() => {
    if (q1Cooldown > 0) {
      const t = setTimeout(() => setQ1Cooldown(q1Cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [q1Cooldown]);

  useEffect(() => {
    if (q2Cooldown > 0) {
      const t = setTimeout(() => setQ2Cooldown(q2Cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [q2Cooldown]);

  useEffect(() => {
    if (q3Cooldown > 0) {
      const t = setTimeout(() => setQ3Cooldown(q3Cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [q3Cooldown]);

  // Operations
  const handleCutSelected = () => {
    if (!selectedSegmentId) return;
    sounds.playClick();
    setSegments((prev) =>
      prev.map((seg) => (seg.id === selectedSegmentId ? { ...seg, status: 'deleted' } : seg))
    );
  };

  const handleSilenceSelected = () => {
    if (!selectedSegmentId) return;
    sounds.playClick();
    setSegments((prev) =>
      prev.map((seg) => (seg.id === selectedSegmentId ? { ...seg, status: 'silenced' } : seg))
    );
  };

  const handleTrimSelected = () => {
    if (!selectedSegmentId) return;
    sounds.playClick();
    setSegments((prev) =>
      prev.map((seg) => (seg.id === selectedSegmentId ? { ...seg, status: 'active' } : { ...seg, status: 'deleted' }))
    );
  };

  const handleResetTrack = () => {
    sounds.playClick();
    setSegments(initialSegments);
    setSelectedSegmentId('seg1');
  };

  // Check cleanup status:
  // seg1 (dead space) should be deleted
  // seg3 (stumble) should be deleted
  // seg5 (chair creak) should be silenced (or deleted)
  // seg2, seg4, seg6 should be active
  const isSeg1Clean = segments.find((s) => s.id === 'seg1')?.status === 'deleted';
  const isSeg3Clean = segments.find((s) => s.id === 'seg3')?.status === 'deleted';
  const isSeg5Clean = segments.find((s) => s.id === 'seg5')?.status === 'silenced' || segments.find((s) => s.id === 'seg5')?.status === 'deleted';
  const areVoicesPreserved =
    segments.find((s) => s.id === 'seg2')?.status === 'active' &&
    segments.find((s) => s.id === 'seg4')?.status === 'active' &&
    segments.find((s) => s.id === 'seg6')?.status === 'active';

  const isAudioCleaned = isSeg1Clean && isSeg3Clean && isSeg5Clean && areVoicesPreserved;

  // Calculate current active duration
  const activeDurationMs = segments.reduce((acc, s) => {
    if (s.status === 'deleted') return acc;
    return acc + s.durationMs;
  }, 0);

  const isAllAnswered = q1Answer === 'A' && q2Answer === 'C' && q3Answer === 'B' && isAudioCleaned;

  const handleSelectQ1 = (opt: string) => {
    if (q1Cooldown > 0) return;
    if (opt === 'A') {
      sounds.playCorrect();
      setQ1Answer('A');
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(null);
      setQ1Cooldown(5);
      setQ1ErrorMsg('Incorect! Comanda Trim (Decupare) păstrează doar fragmentul selectat și șterge instantaneu tot ce se află înainte și după selecție. Așteaptă 5 secunde.');
    }
  };

  const handleSelectQ2 = (opt: string) => {
    if (q2Cooldown > 0) return;
    if (opt === 'C') {
      sounds.playCorrect();
      setQ2Answer('C');
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(null);
      setQ2Cooldown(5);
      setQ2ErrorMsg('Incorect! Comanda Silence (Liniște) reduce volumul selecției la 0 dB (liniște absolută) FĂRĂ a modifica durata fișierului și fără a decala sincronizarea cu celelalte piste sau cu un videoclip. Așteaptă 5 secunde.');
    }
  };

  const handleSelectQ3 = (opt: string) => {
    if (q3Cooldown > 0) return;
    if (opt === 'B') {
      sounds.playCorrect();
      setQ3Answer('B');
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(null);
      setQ3Cooldown(5);
      setQ3ErrorMsg('Incorect! Pentru a elimina o bâlbă și a apropia cuvintele vorbitorului într-un flux natural, selectăm bâlba și aplicăm Cut sau Delete (reducând durata totală). Așteaptă 5 secunde.');
    }
  };

  const handleFinish = () => {
    sounds.playCorrect();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-white rounded-3xl border border-rose-500/30 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-600 flex items-center justify-center text-2xl shadow-lg">
            ✂️
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
              <span>Unitatea 2: Acustică Digitală • Manual Art Klett pag. 33–34</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">Nivelul 5/7</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              Tehnici de Editare Sonoră: Trim, Cut, Delete & Silence (Liniște)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-rose-400" />
            <span>Laborator Chirurgie Audio</span>
          </span>
        </div>
      </div>

      {/* 3 Core Commands Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <Crop className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-400 font-mono uppercase">1. Trim (Decupare)</div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Păstrează <strong>doar selecția</strong> și șterge automat tot ce este înainte și după. Excelent pentru a izola rapid un refren sau o replică.
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <Scissors className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-rose-400 font-mono uppercase">2. Cut / Delete (Tăiere)</div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Șterge selecția și <strong>unește capetele rămase</strong>, scurtând piesa. Folosit pentru a elimina bâlbele sau pauzele moarte.
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <VolumeX className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-cyan-400 font-mono uppercase">3. Silence (Liniște)</div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Aduce volumul selecției la <strong>0 dB</strong> (liniște completă), <strong>fără a scurta piesa</strong> și fără a decala sincronizarea cu imaginea video.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Podcast Cleaning Lab */}
      <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-rose-400" />
              <span>Misiune Practică: Curățarea Înregistrării unui Podcast Școlar</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Selectează fiecare segment defect și alege comanda corectă (Șterge pauza inițială, elimină bâlba și trece scârțâitul pe Liniște!).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">
              Durată: <span className="text-amber-300">{(activeDurationMs / 1000).toFixed(1)}s</span> (inițial 11.0s)
            </span>
            <button
              type="button"
              onClick={handleResetTrack}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-1 cursor-pointer"
              title="Resetează pista la starea brută"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Audio Track Visual Timeline */}
        <div className="p-3 rounded-2xl bg-[#070b12] border-2 border-slate-800 flex flex-col gap-2 select-none">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-b border-slate-850 pb-1">
            <span>Pista Principală Voce (Waveform)</span>
            <span>Faceți click pe un segment pentru a-l selecta</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
            {segments.map((seg) => {
              const isSelected = selectedSegmentId === seg.id;
              const isDeleted = seg.status === 'deleted';
              const isSilenced = seg.status === 'silenced';

              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => {
                    setSelectedSegmentId(seg.id);
                    sounds.playClick();
                  }}
                  className={`p-3 rounded-xl border text-left transition relative overflow-hidden cursor-pointer flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'ring-2 ring-rose-400 border-rose-500 scale-[1.02] shadow-lg'
                      : 'border-slate-800'
                  } ${
                    isDeleted
                      ? 'bg-slate-950/40 opacity-30 border-dashed line-through'
                      : isSilenced
                      ? 'bg-slate-900/80 border-cyan-500/40'
                      : seg.type === 'speech'
                      ? 'bg-sky-950/40 border-sky-500/40'
                      : 'bg-rose-950/40 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {seg.id}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 font-bold">
                      {(seg.durationMs / 1000).toFixed(1)}s
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white leading-tight">
                    {seg.label}
                  </div>

                  <div className="mt-2 text-[10px] font-mono">
                    {isDeleted ? (
                      <span className="text-rose-400 font-bold">🗑️ ȘTERS (Cut)</span>
                    ) : isSilenced ? (
                      <span className="text-cyan-400 font-bold">🔇 LINIȘTE (0 dB)</span>
                    ) : seg.type === 'speech' ? (
                      <span className="text-emerald-400 font-bold">🗣️ VOCE UTILĂ</span>
                    ) : (
                      <span className="text-amber-400 font-bold">⚠️ DEFECT SONOR</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Toolbar for Selected Segment */}
        {selectedSegmentId && (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Segment activ:</span>
              <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                {segments.find((s) => s.id === selectedSegmentId)?.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Cut / Delete Button */}
              <button
                type="button"
                onClick={handleCutSelected}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20 active:scale-95"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Șterge / Tăiere (Delete)</span>
              </button>

              {/* Silence Button */}
              <button
                type="button"
                onClick={handleSilenceSelected}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-600/20 active:scale-95"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Aplică Liniște (Silence)</span>
              </button>

              {/* Trim Button */}
              <button
                type="button"
                onClick={handleTrimSelected}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-600/20 active:scale-95"
                title="Păstrează doar acest segment și șterge restul"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Decupare (Trim)</span>
              </button>
            </div>
          </div>
        )}

        {/* Cleaning Progress Checklist */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-slate-400 font-bold">Stadiu Curățare:</span>
          <span className={`flex items-center gap-1 ${isSeg1Clean ? 'text-emerald-400' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Pauză pornire eliminată
          </span>
          <span className={`flex items-center gap-1 ${isSeg3Clean ? 'text-emerald-400' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Bâlbă ștearsă
          </span>
          <span className={`flex items-center gap-1 ${isSeg5Clean ? 'text-emerald-400' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Zgomot scaun neutralizat
          </span>
          <span className={`flex items-center gap-1 ${areVoicesPreserved ? 'text-emerald-400' : 'text-rose-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Toate cele 3 replici vocale păstrate intacte
          </span>
        </div>
      </div>

      {/* Pedagogical Quiz Section */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300 font-mono">
            Verificarea Competențelor Tehnice (3 Întrebări Pedagogice)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            1. Ce realizează operația Trim (Decupare) asupra unei piese audio în WavePad?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Păstrează doar fragmentul audio selectat și șterge instantaneu tot ce este înaintea și după selecție.' },
              { id: 'B', text: 'Inversează sunetul de la coadă la cap.' },
              { id: 'C', text: 'Mărește volumul cu 500% pentru toate difuzoarele.' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q1Cooldown > 0}
                onClick={() => handleSelectQ1(opt.id)}
                className={`p-3 rounded-xl text-xs text-left transition font-medium cursor-pointer border ${
                  q1Answer === opt.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } disabled:opacity-50`}
              >
                <div className="font-bold font-mono text-rose-400 mb-1">Opțiunea {opt.id}:</div>
                {opt.text}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q1ErrorMsg} (Deblocare în: {q1Cooldown}s)</span>
            </div>
          )}
          {q1Answer === 'A' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Corect! Trim păstrează exclusiv selecția și înlătură restul înregistrării.</span>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            2. De ce este comanda Silence (Liniște) preferată față de Delete atunci când curățăm o înregistrare sincronizată cu un clip video?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Pentru că Delete funcționează doar dacă avem conexiune la internet.' },
              { id: 'B', text: 'Pentru că Silence schimbă limba vorbitorului în engleză.' },
              { id: 'C', text: 'Pentru că Silence păstrează durata temporală intactă (nu decalează buzele personajului față de imagine), în timp ce Delete ar scurta piesa și ar strica sincronizarea.' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0}
                onClick={() => handleSelectQ2(opt.id)}
                className={`p-3 rounded-xl text-xs text-left transition font-medium cursor-pointer border ${
                  q2Answer === opt.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } disabled:opacity-50`}
              >
                <div className="font-bold font-mono text-cyan-400 mb-1">Opțiunea {opt.id}:</div>
                {opt.text}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q2ErrorMsg} (Deblocare în: {q2Cooldown}s)</span>
            </div>
          )}
          {q2Answer === 'C' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Excelent! Silence aduce semnalul la 0 fără decalaj temporal.</span>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            3. Cum eliminăm o bâlbă sau o tuse dintre două fraze vorbite într-un podcast audio independent?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Creștem volumul la maxim ca să acoperim tusea.' },
              { id: 'B', text: 'Selectăm precis bâlba cu mouse-ul și folosim comanda Cut sau tasta Delete, apropiind replicile naturale.' },
              { id: 'C', text: 'Înregistrăm totul încă o dată de la capăt.' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q3Cooldown > 0}
                onClick={() => handleSelectQ3(opt.id)}
                className={`p-3 rounded-xl text-xs text-left transition font-medium cursor-pointer border ${
                  q3Answer === opt.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } disabled:opacity-50`}
              >
                <div className="font-bold font-mono text-amber-400 mb-1">Opțiunea {opt.id}:</div>
                {opt.text}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q3ErrorMsg} (Deblocare în: {q3Cooldown}s)</span>
            </div>
          )}
          {q3Answer === 'B' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Corect! Selectarea și ștergerea (Cut/Delete) este tehnica clasică de montaj sonor.</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          {!isAudioCleaned ? (
            <span className="text-rose-400">Curăță defectele din podcast (șterge segmentele 1 și 3, aplică Silence pe 5).</span>
          ) : !isAllAnswered ? (
            <span className="text-amber-400">Răspunde la cele 3 întrebări pentru a finaliza Nivelul 5.</span>
          ) : (
            <span className="text-emerald-400 font-bold">Toate tehnicile de editare audio au fost stăpânite!</span>
          )}
        </div>

        <button
          type="button"
          disabled={!isAllAnswered}
          onClick={handleFinish}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>Treci la Nivelul 6: Studio Jingle Radio & Tehnica Paste Mix</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
