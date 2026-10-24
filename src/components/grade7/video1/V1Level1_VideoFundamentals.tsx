import React, { useState } from 'react';
import { Film, Play, Square, Info, HelpCircle, CheckCircle2, AlertTriangle, Sparkles, Monitor, Layers, Eye } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface V1Level1Props {
  onPass: (score: number) => void;
}

export const V1Level1_VideoFundamentals: React.FC<V1Level1Props> = ({ onPass }) => {
  // Simulator State: Resolution, Aspect Ratio, Frame Rate
  const [selectedResolution, setSelectedResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [selectedAspect, setSelectedAspect] = useState<'16:9' | '4:3' | '9:16'>('16:9');
  const [selectedFps, setSelectedFps] = useState<number>(30);
  const [isSimulatingMotion, setIsSimulatingMotion] = useState<boolean>(true);
  const [ballPosition, setBallPosition] = useState<number>(0);

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

  // Cooldown timers
  React.useEffect(() => {
    if (q1Cooldown > 0) {
      const timer = setTimeout(() => setQ1Cooldown(q1Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q1Cooldown]);

  React.useEffect(() => {
    if (q2Cooldown > 0) {
      const timer = setTimeout(() => setQ2Cooldown(q2Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q2Cooldown]);

  React.useEffect(() => {
    if (q3Cooldown > 0) {
      const timer = setTimeout(() => setQ3Cooldown(q3Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q3Cooldown]);

  // FPS Animation ticker
  React.useEffect(() => {
    if (!isSimulatingMotion) return;
    const intervalTime = 1000 / selectedFps;
    const interval = setInterval(() => {
      setBallPosition((prev) => (prev + 3) % 100);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [selectedFps, isSimulatingMotion]);

  // Resolution specs calculation
  const getResSpecs = () => {
    if (selectedResolution === '720p') {
      return { w: 1280, h: 720, label: 'Standard HD (720p)', pixels: '921.600 pixeli (~0.9 MP)', desc: 'Potrivit pentru streaming rapid pe conexiuni slabe' };
    }
    if (selectedResolution === '1080p') {
      return { w: 1920, h: 1080, label: 'Full HD (1080p)', pixels: '2.073.600 pixeli (~2.1 MP)', desc: 'Standardul de aur pentru școală, YouTube și monitoare PC' };
    }
    return { w: 3840, h: 2160, label: 'Ultra HD 4K (2160p)', pixels: '8.294.400 pixeli (~8.3 MP)', desc: 'Claritate excepțională, necesită calculatoare performante' };
  };

  const resSpecs = getResSpecs();

  const isAllAnswered = q1Answer === 'B' && q2Answer === 'C' && q3Answer === 'A';

  const handleSelectQ1 = (opt: string) => {
    if (q1Cooldown > 0) return;
    if (opt === 'B') {
      sounds.playCorrect();
      setQ1Answer('B');
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(null);
      setQ1Cooldown(5);
      setQ1ErrorMsg('Incorect! Fișierul de proiect (.vpj) conține doar instrucțiuni și căi către clipurile brute de pe disc. Fișierul final exportat (.mp4) este video-ul renderizat de sine stătător. Așteaptă 5 secunde.');
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
      setQ2ErrorMsg('Incorect! Rezoluția Full HD 1080p are dimensiunile standard 1920 x 1080 pixeli și raportul de aspect 16:9 Widescreen. Așteaptă 5 secunde.');
    }
  };

  const handleSelectQ3 = (opt: string) => {
    if (q3Cooldown > 0) return;
    if (opt === 'A') {
      sounds.playCorrect();
      setQ3Answer('A');
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(null);
      setQ3Cooldown(5);
      setQ3ErrorMsg('Incorect! FPS înseamnă Frames Per Second (Cadre pe Secundă). La 24-30 FPS ochiul percepe mișcarea ca fiind naturală și fluidă, datorită persistenței retiniene. Așteaptă 5 secunde.');
    }
  };

  const handleComplete = () => {
    sounds.playVictory();
    onPass(100);
  };

  return (
    <div className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-7 text-white">
      {/* Header Level 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-rose-400" />
              Nivelul 1 • Clasa a VII-a (Manual pag. 36–38)
            </span>
            <span className="text-xs font-mono text-slate-400">Unitatea 2: Montaj Video</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading mt-2 text-white">
            Anatomia Video-ului Digital: Proiect (.vpj) vs MP4, Rezoluții & FPS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Un fișier de montaj video nu stochează clipurile în interiorul său, ci creează o hartă de instrucțiuni. Explorează diferența crucială dintre fișierul de proiect și fișierul exportat, calculează pixelii rezoluțiilor HD/Full HD/4K și testează percepția fluidității cadrelor (FPS).
          </p>
        </div>

        <div className="text-right sm:shrink-0">
          <div className="text-xs text-slate-400 font-mono">Punctaj Nivel</div>
          <div className="text-2xl font-black text-rose-400 font-mono">100 Puncte</div>
        </div>
      </div>

      {/* Simulator: Interactive Resolution, Aspect Ratio & Frame Rate Workbench */}
      <div className="bg-slate-950/80 border border-rose-500/30 rounded-2xl p-4 sm:p-6 shadow-inner space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <Monitor className="w-4 h-4 text-rose-400" />
            <span>Laboratorul Interactiv: Monitorul VideoPad & Calibrare Ecran</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {resSpecs.w} × {resSpecs.h} px • {selectedFps} FPS • Raport {selectedAspect}
          </span>
        </div>

        {/* Control Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Resolution Switcher */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              1. Rezoluție Render (Linii Orizontale)
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(['720p', '1080p', '4k'] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => {
                    setSelectedResolution(res);
                    sounds.playClick();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                    selectedResolution === res
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {res.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Aspect Ratio */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              2. Raport de Aspect (Lățime : Înălțime)
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(['16:9', '4:3', '9:16'] as const).map((asp) => (
                <button
                  key={asp}
                  onClick={() => {
                    setSelectedAspect(asp);
                    sounds.playClick();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                    selectedAspect === asp
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {asp}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Frame Rate FPS */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                3. Rata de Cadre (FPS)
              </span>
              <span className="text-xs font-bold text-cyan-400 font-mono">{selectedFps} FPS</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[12, 24, 30, 60].map((fpsVal) => (
                <button
                  key={fpsVal}
                  onClick={() => {
                    setSelectedFps(fpsVal);
                    sounds.playClick();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                    selectedFps === fpsVal
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {fpsVal} fps
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Virtual Monitor Canvas Preview */}
        <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          {/* Screen Container with dynamic Aspect Ratio */}
          <div
            className={`border-2 border-rose-500/60 rounded-xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between p-3 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 ${
              selectedAspect === '16:9'
                ? 'w-full max-w-[460px] aspect-video'
                : selectedAspect === '4:3'
                ? 'w-full max-w-[340px] aspect-[4/3]'
                : 'w-full max-w-[200px] aspect-[9/16]'
            }`}
          >
            {/* Monitor Header info overlay */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 z-10 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur">
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                REC [00:04:18]
              </span>
              <span>{resSpecs.w}x{resSpecs.h}</span>
              <span className="text-cyan-400 font-bold">{selectedFps} FPS</span>
            </div>

            {/* Motion fluid simulation line */}
            <div className="my-auto relative w-full h-8 flex items-center">
              <div className="w-full h-1 bg-slate-800 rounded-full"></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-300 shadow-lg shadow-rose-500/50 flex items-center justify-center text-[10px] font-black text-slate-950 transition-none"
                style={{ left: `calc(${ballPosition}% - 14px)` }}
              >
                🎬
              </div>
            </div>

            {/* Safe Area Guides & Aspect Label */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 z-10 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur">
              <span>Raport: {selectedAspect === '16:9' ? 'Widescreen 16:9' : selectedAspect === '4:3' ? 'Format Standard 4:3' : 'Vertical Shorts/TikTok'}</span>
              <span className="text-amber-400 font-bold">{selectedFps < 20 ? 'Tremurat (Low FPS)' : selectedFps <= 30 ? 'Mișcare Normală' : 'Ultra Fluid'}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {resSpecs.label}: {resSpecs.pixels}. {resSpecs.desc}
            </span>
          </div>
        </div>
      </div>

      {/* Theory & Pedagogical Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
          <div className="font-bold text-rose-400 flex items-center gap-1.5 text-sm">
            <Film className="w-4 h-4" />
            <span>Proiect Video (.vpj) vs Fișier Exportat (.mp4)</span>
          </div>
          <p className="text-slate-300">
            În <strong>VideoPad</strong>, salvarea proiectului prin <em>Fișier &gt; Salvare proiect</em> generează un fișier cu extensia <strong>.vpj</strong> (VideoPad Project).
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li><strong>Fișierul .vpj:</strong> ocupă doar câțiva kiloocteți (KB). Conține doar cronologia, poziția tăieturilor și legături către fișierele video de pe hard disk. Nu conține imaginile video efective!</li>
            <li><strong>Atenție la capcana Media Offline:</strong> dacă ștergi sau muți clipurile brute de pe disc, proiectul .vpj se va deschide cu erori de fișiere lipsă.</li>
            <li><strong>Fișierul .mp4 (Export):</strong> este produsul finit obținut prin renderizare (comprimat H.264/AAC), care poate fi redat oriunde, fără VideoPad.</li>
          </ul>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
          <div className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
            <Monitor className="w-4 h-4" />
            <span>Rezoluție, Raport de Aspect & Cadre pe Secundă (FPS)</span>
          </div>
          <p className="text-slate-300">
            Ochiul uman are proprietatea numită <strong>persistență retiniană</strong>: reține o imagine o fracțiune de secundă. Dacă afișăm peste 24 de imagini statice (cadre) pe secundă, creierul le unifică într-o mișcare continuă.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li><strong>24 FPS:</strong> standardul istoric al filmului cinematografic.</li>
            <li><strong>30 FPS (29.97):</strong> standardul televiziunii și al transmisiunilor online curente.</li>
            <li><strong>60 FPS:</strong> utilizat pentru jocuri video, sport și clipuri ce urmează a fi redate cu încetinitorul (Slow-Motion).</li>
            <li><strong>Raport 16:9:</strong> raportul standard pentru calculatoare și YouTube (lățime 16 unități la 9 unități înălțime).</li>
          </ul>
        </div>
      </div>

      {/* Pedagogical Verification Quiz (3 Questions with 5-second cooldown) */}
      <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-5">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
          <HelpCircle className="w-4 h-4 text-rose-400" />
          <span>Verificare Cunoștințe Fundamentale (OMEN 3393/2017)</span>
        </div>

        {/* Question 1 */}
        <div className="space-y-2 border-b border-slate-800/80 pb-4">
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            1. Un coleg salvează proiectul video ca <code className="text-rose-400 font-mono">referat.vpj</code> pe un stick USB și îl deschide la școală, dar stick-ul nu conținea și fișierele filmate cu telefonul. Ce se va întâmpla?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Clipul se deschide normal, deoarece fișierul .vpj include automat toate videoclipurile.' },
              { id: 'B', text: 'VideoPad va afișa eroare de fișiere lipsă (Media Offline), deoarece .vpj reține doar adresele/căile locale.' },
              { id: 'C', text: 'Fișierul .vpj se convertește automat în MP4 și deschide filmul pe YouTube.' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectQ1(opt.id)}
                disabled={q1Cooldown > 0 || q1Answer === 'B'}
                className={`p-3 rounded-xl text-xs text-left transition cursor-pointer border ${
                  q1Answer === opt.id
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold font-mono mr-1.5 text-rose-400">[{opt.id}]</span>
                {opt.text}
              </button>
            ))}
          </div>
          {q1Cooldown > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{q1ErrorMsg} (Deblocare în {q1Cooldown}s)</span>
            </div>
          )}
          {q1Answer === 'B' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Corect! Fișierul de proiect (.vpj) salvează instrucțiunile de montaj, nu fișierele media mari în sine.</span>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-2 border-b border-slate-800/80 pb-4">
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            2. Care este rezoluția standard pentru un videoclip Full HD cu raportul de aspect panoramic 16:9?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: '640 × 480 pixeli (format clasic VGA)' },
              { id: 'B', text: '1280 × 720 pixeli (format HD simplu)' },
              { id: 'C', text: '1920 × 1080 pixeli (standardul Full HD 1080p)' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectQ2(opt.id)}
                disabled={q2Cooldown > 0 || q2Answer === 'C'}
                className={`p-3 rounded-xl text-xs text-left transition cursor-pointer border ${
                  q2Answer === opt.id
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold font-mono mr-1.5 text-rose-400">[{opt.id}]</span>
                {opt.text}
              </button>
            ))}
          </div>
          {q2Cooldown > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{q2ErrorMsg} (Deblocare în {q2Cooldown}s)</span>
            </div>
          )}
          {q2Answer === 'C' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Corect! 1080p Full HD reprezintă exact 1920 pixeli pe orizontală și 1080 pe verticală (~2.07 milioane de pixeli).</span>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            3. Ce indică valoarea FPS a unui fișier video și de ce este esențială pentru percepția umană?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Frames Per Second: numărul de imagini statice afișate pe secundă pentru a crea iluzia de mișcare continuă.' },
              { id: 'B', text: 'File Processing Speed: viteza cu care procesorul deschide fișierul de pe hard disk.' },
              { id: 'C', text: 'Format Picture Scale: procentul de mărire al zoom-ului optic al camerei.' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectQ3(opt.id)}
                disabled={q3Cooldown > 0 || q3Answer === 'A'}
                className={`p-3 rounded-xl text-xs text-left transition cursor-pointer border ${
                  q3Answer === opt.id
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold font-mono mr-1.5 text-rose-400">[{opt.id}]</span>
                {opt.text}
              </button>
            ))}
          </div>
          {q3Cooldown > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{q3ErrorMsg} (Deblocare în {q3Cooldown}s)</span>
            </div>
          )}
          {q3Answer === 'A' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Corect! La peste 24 FPS ochiul uman percepe cadrele ca o mișcare naturală datorită persistenței retiniene.</span>
            </div>
          )}
        </div>
      </div>

      {/* Completion Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleComplete}
          disabled={!isAllAnswered}
          className={`px-6 py-3 rounded-2xl font-bold font-heading text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
            isAllAnswered
              ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-600/30'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Finalizează Nivelul 1 & Mergi la Cronologia Multitrack</span>
        </button>
      </div>
    </div>
  );
};
