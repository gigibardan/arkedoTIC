import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Volume2,
  Code,
  MapPin,
  Bot,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  Cpu,
  ArrowRight,
  Sliders,
  Radio,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';

interface Grade7InteractiveSimulatorsProps {
  initialTab?: 'word' | 'audio' | 'cpp' | 'gis' | 'robot';
  onClose?: () => void;
}

export const Grade7InteractiveSimulators: React.FC<Grade7InteractiveSimulatorsProps> = ({
  initialTab = 'cpp',
  onClose
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'word' | 'audio' | 'cpp' | 'gis' | 'robot'>(initialTab);

  return (
    <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-heading">
              Laboratoare Interactive & Simulatoare • Clasa a VII-a
            </h3>
            <p className="text-xs text-cyan-400 font-mono">
              Simulatoare profesionale în browser: Tipografie, Studio Audio WebAudio, Consola C++, GIS și RoboSim 2D
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('cpp');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cpp'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>C++ Runner</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('word');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'word'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tipografie Word</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('audio');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>WaveLab Audio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('gis');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gis'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Harta GIS</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('robot');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'robot'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>RoboSim 2D</span>
          </button>
        </div>
      </div>

      {/* Simulator Content Panels */}
      <div className="w-full">
        {activeTab === 'cpp' && <CppRunnerSimulator />}
        {activeTab === 'word' && <WordTypographySimulator />}
        {activeTab === 'audio' && <AudioWaveSimulator />}
        {activeTab === 'gis' && <GisMapSimulator />}
        {activeTab === 'robot' && <RoboCanvasSimulator />}
      </div>
    </div>
  );
};

// ==================== 1. C++ CODE RUNNER & AST STEPPER ====================
const CppRunnerSimulator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<'linear' | 'decision' | 'while_digits'>('while_digits');
  const [inputValue, setInputValue] = useState<string>('3482');
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [memoryVariables, setMemoryVariables] = useState<Record<string, number | string>>({ n: 3482, suma: 0, cifra: 0 });
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const presets = {
    linear: {
      title: 'Structura Liniară: Aria Dreptunghiului & Algoritmul celor 3 Pahare',
      code: `#include <iostream>
using namespace std;

int main() {
    int L = 15, l = 8, aria, aux;
    cout << "Calcul arie: L=" << L << " l=" << l << endl;
    aria = L * l;
    cout << "Aria este: " << aria << endl;
    
    // Regula celor 3 pahare
    aux = L;
    L = l;
    l = aux;
    cout << "Dupa schimbare: L=" << L << " l=" << l << endl;
    return 0;
}`
    },
    decision: {
      title: 'Structura Alternativă: Test Paritate & Nota Școlară',
      code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Introduceti numarul: ";
    cin >> n;
    if (n % 2 == 0) {
        cout << n << " este NUMAR PAR" << endl;
    } else {
        cout << n << " este NUMAR IMPAR" << endl;
    }
    return 0;
}`
    },
    while_digits: {
      title: 'Structura Repetitivă: Prelucrarea Cifrelor unui Număr (Suma Cifrelor)',
      code: `#include <iostream>
using namespace std;

int main() {
    int n, suma = 0, c;
    cout << "Introduceti n: ";
    cin >> n;
    while (n > 0) {
        c = n % 10;        // extragem ultima cifra
        suma = suma + c;   // adaugam cifra la suma
        n = n / 10;        // taiem ultima cifra
    }
    cout << "Suma cifrelor este: " << suma << endl;
    return 0;
}`
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    sounds.playClick();
    setOutputLogs([]);

    if (selectedPreset === 'linear') {
      const logs = [
        '>>> Compilare C++ cu gcc 14.2 (Code::Blocks Engine)...',
        '>>> Execuție structură liniară:',
        'Calcul arie: L=15 l=8',
        'Aria este: 120',
        'Paharul auxiliar aux a salvat 15.',
        'După interschimbare celor 3 pahare: L=8 l=15',
        '>>> Program finalizat cu codul de ieșire 0.'
      ];
      setOutputLogs(logs);
      setMemoryVariables({ L: 8, l: 15, aria: 120, aux: 15 });
      setIsRunning(false);
      sounds.playSuccess();
    } else if (selectedPreset === 'decision') {
      const val = parseInt(inputValue, 10) || 42;
      const isEven = val % 2 === 0;
      const logs = [
        `>>> cin >> n: ${val}`,
        `>>> Evaluare condiție: (${val} % 2 == 0) -> ${isEven ? 'TRUE' : 'FALSE'}`,
        isEven ? `${val} este NUMAR PAR` : `${val} este NUMAR IMPAR`,
        '>>> Program finalizat cu codul de ieșire 0.'
      ];
      setOutputLogs(logs);
      setMemoryVariables({ n: val, paritate: isEven ? 'PAR' : 'IMPAR' });
      setIsRunning(false);
      sounds.playSuccess();
    } else if (selectedPreset === 'while_digits') {
      let n = parseInt(inputValue, 10) || 3482;
      let s = 0;
      const logs = [`>>> cin >> n: ${n}`, '>>> Intrare în bucla while (n > 0):'];
      let step = 1;
      while (n > 0) {
        const c = n % 10;
        s += c;
        logs.push(`Pasul ${step}: c = ${n} % 10 = ${c} | suma = ${s} | n nou = ${Math.floor(n / 10)}`);
        n = Math.floor(n / 10);
        step++;
      }
      logs.push(`>>> Ieșire din buclă (n a devenit 0).`);
      logs.push(`Suma cifrelor este: ${s}`);
      logs.push('>>> Program finalizat cu codul de ieșire 0.');
      setOutputLogs(logs);
      setMemoryVariables({ n: 0, suma: s, pasi: step - 1 });
      setIsRunning(false);
      sounds.playSuccess();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Code Editor Column */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-violet-400" />
              Editor C++ (Code::Blocks AST Sandbox)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setSelectedPreset('while_digits')}
              className={`px-2 py-0.5 rounded-lg ${selectedPreset === 'while_digits' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400'}`}
            >
              while (cifre)
            </button>
            <button
              onClick={() => setSelectedPreset('decision')}
              className={`px-2 py-0.5 rounded-lg ${selectedPreset === 'decision' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400'}`}
            >
              if/else
            </button>
            <button
              onClick={() => setSelectedPreset('linear')}
              className={`px-2 py-0.5 rounded-lg ${selectedPreset === 'linear' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400'}`}
            >
              liniar (3 pahare)
            </button>
          </div>
        </div>

        {/* Code Block Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner leading-relaxed">
          <pre className="text-slate-300">
            {presets[selectedPreset].code}
          </pre>
        </div>

        {/* Input & Run Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Date cin &gt;&gt; :</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white text-center focus:outline-none focus:border-violet-500"
              placeholder="ex: 3482"
            />
          </div>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-600/30 active:scale-95 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Compilare & Executare (F9)</span>
          </button>
        </div>
      </div>

      {/* Output Console & Memory Boxes */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Memory Boxes (RAM Inspector) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Sertare de Memorie RAM (Variabile)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            {Object.entries(memoryVariables).map(([varName, val]) => (
              <div key={varName} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-bold">{varName}</span>
                <span className="text-sm font-black text-cyan-300 mt-0.5">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Console Output */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-64 shadow-inner">
          <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Consolă C++ (Terminal I/O)
          </div>

          <div className="font-mono text-xs text-slate-300 flex-1 overflow-y-auto space-y-1">
            {outputLogs.length === 0 ? (
              <div className="text-slate-500 italic text-center py-10">
                Apasă pe „Compilare & Executare (F9)” pentru a rula programul...
              </div>
            ) : (
              outputLogs.map((line, idx) => (
                <div key={idx} className={line.startsWith('>>>') ? 'text-cyan-400' : line.includes('PAR') || line.includes('Suma') ? 'text-amber-300 font-bold' : 'text-slate-200'}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 2. WORD & TYPOGRAPHY VALIDATOR ====================
const WordTypographySimulator: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    'Informatica si TIC este materia mea preferata . Invatam reguli de  tehnoredactare "moderne" si cum sa scriem corect .'
  );

  const calculateTypographyReport = (text: string) => {
    const issues: string[] = [];
    let score = 100;

    // Check 1: Missing diacritics
    const hasDiacritics = /[ăâîșțĂÂÎȘȚ]/.test(text);
    if (!hasDiacritics) {
      issues.push('Lipsesc diacriticele românești obligatorii (ă, â, î, ș, ț cu virgulă dedesubt).');
      score -= 25;
    }

    // Check 2: Space before punctuation (. , ; ! ?)
    const spaceBeforePunct = /\s+([.,;:!?])/.test(text);
    if (spaceBeforePunct) {
      issues.push('Semnele de punctuație (. , ; ! ?) trebuie lipite direct de cuvântul precedent, fără spațiu înainte!');
      score -= 25;
    }

    // Check 3: Double spaces
    const doubleSpaces = /\s{2,}/.test(text);
    if (doubleSpaces) {
      issues.push('S-au detectat spații duble între cuvinte. Folosește întotdeauna un singur spațiu!');
      score -= 20;
    }

    // Check 4: English quotes instead of Romanian
    const englishQuotes = /["']/.test(text);
    if (englishQuotes) {
      issues.push('Ghilimele neconforme: în limba română folosim ghilimelele „jos” și ”sus” (Alt+0132 / Alt+0148).');
      score -= 15;
    }

    return { score: Math.max(score, 10), issues };
  };

  const report = calculateTypographyReport(inputText);

  const handleFixAutomatically = () => {
    sounds.playSuccess();
    let fixed = inputText
      .replace(/\s+([.,;:!?])/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .replace(/"([^"]*)"/g, '„$1”')
      .replace(/\bInformatica si TIC\b/g, 'Informatica și TIC')
      .replace(/\bInvatam\b/g, 'Învățăm')
      .replace(/\bsi\b/g, 'și');
    setInputText(fixed);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Inspector Tipografic & Machetare Word
          </h4>
          <p className="text-xs text-slate-400">
            Analizează textul în timp real conform normelor oficiale de tehnoredactare din manual (pag. 18–27)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Scor Tipografic:</span>
            <span className={`font-black ${report.score >= 80 ? 'text-emerald-400' : report.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
              {report.score} / 100
            </span>
          </div>

          <button
            onClick={handleFixAutomatically}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Corectare Automată</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 flex flex-col gap-2">
          <label className="text-xs font-mono text-slate-300">
            Document de redactat (scrie sau lipește text):
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-sans text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner leading-relaxed resize-none"
          />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Diagnostic Didactic (Erori Detectate):
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5 shadow-md">
            {report.issues.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold py-4">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Felicitări! Textul respectă 100% toate regulile de aur ale tipografiei românești.</span>
              </div>
            ) : (
              report.issues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-300 leading-snug">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 3. AUDIO WAVELAB & TONE GENERATOR ====================
const AudioWaveSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(440); // 440 Hz = Standard Concert A
  const [waveformType, setWaveformType] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState<number>(0.2);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startTone = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveformType;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;
    setIsPlaying(true);
  };

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopTone();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    }
  }, [frequency]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            WaveLab Studio — Generator de Frecvențe Acustice & Formă de Undă
          </h4>
          <p className="text-xs text-slate-400">
            Experimentează fizica sunetului digital conform manualului (pag. 28–35): oscilații Hertz, amplitudine și tipuri de unde
          </p>
        </div>

        <button
          onClick={isPlaying ? stopTone : startTone}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
          }`}
        >
          {isPlaying ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>Oprește Sunetul</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Redă Unda Acustică</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Controls */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Frecvență (Hz):</span>
              <span className="text-amber-400 font-bold">{frequency} Hz ({frequency === 440 ? 'Nota LA 440 Hz' : frequency < 250 ? 'Bas / Grav' : 'Acut'})</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="10"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="text-xs font-mono text-slate-400 mb-2">Tipul Undei Sonore:</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {(['sine', 'square', 'triangle', 'sawtooth'] as OscillatorType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setWaveformType(type);
                    if (isPlaying) {
                      stopTone();
                      setTimeout(startTone, 50);
                    }
                  }}
                  className={`p-2 rounded-xl border text-center capitalize cursor-pointer transition ${
                    waveformType === type
                      ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'sine' ? 'Sinusoidală ∿' : type === 'square' ? 'Dreptunghiulară ⎍' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Waveform Graphic Display */}
        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Osciloscop Digital • Eșantionare 44.100 Hz</span>
            <span className="text-emerald-400 font-bold">Stereo Hi-Fi • -6 dB</span>
          </div>

          {/* SVG Wave Visualizer */}
          <div className="w-full h-32 flex items-center justify-center bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden relative">
            <svg viewBox="0 0 400 100" className="w-full h-full">
              <line x1="0" y1="50" x2="400" y2="50" stroke="#334155" strokeDasharray="4 4" />
              <path
                d={`M 0 50 ${Array.from({ length: 40 }).map((_, i) => {
                  const x = i * 10;
                  const factor = waveformType === 'square' ? (i % 8 < 4 ? -35 : 35) : Math.sin((i * frequency) / 100) * 35;
                  return `L ${x} ${50 + factor}`;
                }).join(' ')}`}
                fill="none"
                stroke={isPlaying ? '#f59e0b' : '#64748b'}
                strokeWidth="2.5"
                className={isPlaying ? 'animate-pulse' : ''}
              />
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-400 mt-3 text-center">
            Urechea umană percepe sunete între 20 Hz și 20.000 Hz. Standardul calității de studio este 44.1 kHz pe 16 biți.
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 4. GIS VECTOR MAP INSPECTOR ====================
const GisMapSimulator: React.FC = () => {
  const [layers, setLayers] = useState({
    relief: true,
    hydro: true,
    roads: true,
    cities: true
  });
  const [selectedPoint, setSelectedPoint] = useState<string>('Vf. Moldoveanu');

  const pointsData: Record<string, { lat: string; long: string; alt: string; info: string }> = {
    'Vf. Moldoveanu': { lat: '45°35′58″ N', long: '24°44′10″ E', alt: '2544 m', info: 'Cel mai înalt vârf muntos din România (Munții Făgăraș).' },
    'București': { lat: '44°26′07″ N', long: '26°06′10″ E', alt: '85 m', info: 'Capitala României, centru administrativ și nod GIS național.' },
    'Delta Dunării': { lat: '45°04′00″ N', long: '29°30′00″ E', alt: '2 m', info: 'Cea mai bine conservată deltă europeană, patrimoniu UNESCO.' }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-400" />
            GIS Layer Explorer — Harta Straturilor Tematice & Satelit
          </h4>
          <p className="text-xs text-slate-400">
            Analiză spațială interactivă pe straturi tematice conform manualului de TIC (pag. 57–63)
          </p>
        </div>

        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setLayers(prev => ({ ...prev, relief: !prev.relief }))}
            className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${layers.relief ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
          >
            ⛰️ Relief
          </button>
          <button
            onClick={() => setLayers(prev => ({ ...prev, hydro: !prev.hydro }))}
            className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${layers.hydro ? 'bg-blue-950/60 border-blue-500 text-blue-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
          >
            🌊 Râuri
          </button>
          <button
            onClick={() => setLayers(prev => ({ ...prev, roads: !prev.roads }))}
            className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${layers.roads ? 'bg-orange-950/60 border-orange-500 text-orange-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
          >
            🛣️ Drumuri
          </button>
          <button
            onClick={() => setLayers(prev => ({ ...prev, cities: !prev.cities }))}
            className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${layers.cities ? 'bg-teal-950/60 border-teal-500 text-teal-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
          >
            🏙️ Orașe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-72 shadow-inner">
          <div className="absolute top-3 left-3 text-[11px] font-mono text-slate-400 z-10">
            Harta Vectorială GIS România (EPSG:4326 WGS84)
          </div>

          {/* SVG Map Canvas */}
          <svg viewBox="0 0 500 300" className="w-full h-full">
            {/* Relief Layer */}
            {layers.relief && (
              <path
                d="M 120 120 Q 250 80 340 140 Q 300 220 220 210 Q 140 180 120 120 Z"
                fill="#451a03"
                opacity="0.35"
                stroke="#b45309"
                strokeWidth="1.5"
              />
            )}

            {/* Hydrography Layer (Dunărea) */}
            {layers.hydro && (
              <path
                d="M 110 270 Q 230 260 370 275 L 440 230 L 470 240"
                fill="none"
                stroke="#0284c7"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            )}

            {/* Roads Layer */}
            {layers.roads && (
              <path
                d="M 150 140 L 250 180 L 320 220 M 250 180 L 400 130"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            )}

            {/* Cities / Points Layer */}
            {layers.cities && (
              <>
                <g className="cursor-pointer" onClick={() => setSelectedPoint('Vf. Moldoveanu')}>
                  <circle cx="230" cy="150" r="6" fill="#f59e0b" />
                  <text x="240" y="153" fill="#fde68a" fontSize="10" fontFamily="monospace">Vf. Moldoveanu</text>
                </g>

                <g className="cursor-pointer" onClick={() => setSelectedPoint('București')}>
                  <circle cx="320" cy="220" r="7" fill="#14b8a6" />
                  <text x="330" y="223" fill="#ccfbf1" fontSize="11" fontFamily="monospace" fontWeight="bold">București</text>
                </g>

                <g className="cursor-pointer" onClick={() => setSelectedPoint('Delta Dunării')}>
                  <circle cx="450" cy="220" r="6" fill="#0284c7" />
                  <text x="410" y="240" fill="#bae6fd" fontSize="10" fontFamily="monospace">Delta Dunării</text>
                </g>
              </>
            )}
          </svg>
        </div>

        {/* Selected Landmark Inspector Card */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider mb-2">
              Interogare Atribute GIS (Click pe hartă):
            </div>
            <h5 className="text-lg font-black text-white font-heading">{selectedPoint}</h5>
            <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
              {pointsData[selectedPoint]?.info}
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Latitudine:</span>
                <span className="text-cyan-300 font-bold">{pointsData[selectedPoint]?.lat}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Longitudine:</span>
                <span className="text-cyan-300 font-bold">{pointsData[selectedPoint]?.long}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Altitudine:</span>
                <span className="text-amber-300 font-bold">{pointsData[selectedPoint]?.alt}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono mt-3">
            Sistemul GIS leagă geometria spațială de date descriptive tabelare.
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 5. ROBOSIM 2D SENSOR CANVAS ====================
const RoboCanvasSimulator: React.FC = () => {
  const [robotPos, setRobotPos] = useState<{ x: number; y: number; angle: number }>({ x: 60, y: 150, angle: 0 });
  const [sensorDistance, setSensorDistance] = useState<number>(28);
  const [isAutoNavigating, setIsAutoNavigating] = useState<boolean>(false);

  const moveForward = () => {
    setRobotPos(prev => {
      const rad = (prev.angle * Math.PI) / 180;
      const nextX = Math.min(Math.max(prev.x + Math.cos(rad) * 20, 30), 380);
      const nextY = Math.min(Math.max(prev.y + Math.sin(rad) * 20, 30), 220);
      const distToWall = Math.max(Math.round(400 - nextX) / 10, 5);
      setSensorDistance(distToWall);
      return { ...prev, x: nextX, y: nextY };
    });
    sounds.playClick();
  };

  const turnRight = () => {
    setRobotPos(prev => ({ ...prev, angle: (prev.angle + 60) % 360 }));
    sounds.playClick();
  };

  const runHexagonTrajectory = () => {
    sounds.playSuccess();
    let step = 0;
    const interval = setInterval(() => {
      if (step >= 6) {
        clearInterval(interval);
        return;
      }
      setRobotPos(prev => ({
        ...prev,
        angle: (prev.angle + 60) % 360,
        x: prev.x + Math.cos(((prev.angle + 60) * Math.PI) / 180) * 25,
        y: prev.y + Math.sin(((prev.angle + 60) * Math.PI) / 180) * 25
      }));
      step++;
    }, 400);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            RoboSim 2D — Simulator Robotic & Senzor Ultrasonic
          </h4>
          <p className="text-xs text-slate-400">
            Programarea roboților virtuali conform manualului (pag. 103–108): traiectorii hexagonale și evitare obstacole
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runHexagonTrajectory}
            className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Traiectorie Hexagon (pag. 104)</span>
          </button>
          <button
            onClick={() => {
              setRobotPos({ x: 60, y: 150, angle: 0 });
              setSensorDistance(28);
              sounds.playClick();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title="Reset Robot"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 2D Canvas Viewport */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 h-64 relative overflow-hidden shadow-inner flex items-center justify-center">
          <svg viewBox="0 0 420 250" className="w-full h-full">
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="420" height="250" fill="url(#grid)" />

            {/* Obstacle Walls */}
            <rect x="390" y="20" width="15" height="210" fill="#dc2626" rx="4" />
            <text x="395" y="130" fill="#ffffff" fontSize="9" transform="rotate(90, 395, 130)" fontFamily="monospace">PERETE</text>

            {/* Ultrasonic Beam */}
            <line
              x1={robotPos.x}
              y1={robotPos.y}
              x2={robotPos.x + Math.cos((robotPos.angle * Math.PI) / 180) * 80}
              y2={robotPos.y + Math.sin((robotPos.angle * Math.PI) / 180) * 80}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.8"
            />

            {/* Robot Body */}
            <g transform={`translate(${robotPos.x}, ${robotPos.y}) rotate(${robotPos.angle})`}>
              <circle cx="0" cy="0" r="16" fill="#047857" stroke="#34d399" strokeWidth="2.5" />
              {/* Wheels */}
              <rect x="-14" y="-19" width="28" height="5" fill="#0f172a" rx="2" />
              <rect x="-14" y="14" width="28" height="5" fill="#0f172a" rx="2" />
              {/* Eye Sensor */}
              <circle cx="10" cy="-4" r="3" fill="#67e8f9" />
              <circle cx="10" cy="4" r="3" fill="#67e8f9" />
            </g>
          </svg>
        </div>

        {/* Telemetry & Manual Controls */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Telemetrie Senzori Robot
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Senzor Distanță:</span>
              <span className={`font-bold ${sensorDistance <= 15 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {sensorDistance} cm
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Unghi Orientare:</span>
              <span className="text-cyan-300 font-bold">{robotPos.angle}°</span>
            </div>
          </div>

          {/* Manual Pilot Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={moveForward}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition shadow-md"
            >
              Înainte (20 px)
            </button>
            <button
              onClick={turnRight}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition"
            >
              Virează 60°
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
