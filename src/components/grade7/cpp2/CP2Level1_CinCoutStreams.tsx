import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, ArrowDown, Terminal, Monitor, Keyboard, Check, RefreshCw, HelpCircle, Lightbulb } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface StreamChallenge {
  id: string;
  taskTitle: string;
  taskDescription: string;
  streamType: 'in' | 'out';
  codePrefix: string;
  operatorOptions: string[];
  correctOperator: string;
  variableName: string;
  explanation: string;
  simulationPreview: string;
}

const STREAM_CHALLENGES: StreamChallenge[] = [
  {
    id: 'c1',
    taskTitle: 'Afișarea unui mesaj de întâmpinare',
    taskDescription: 'Vrem să transmitem textul "Salut, programatorule!" din memoria programului către ecranul consolei.',
    streamType: 'out',
    codePrefix: 'cout',
    operatorOptions: ['<<', '>>', '=', '=='],
    correctOperator: '<<',
    variableName: '"Salut, programatorule!" << endl;',
    explanation: 'cout reprezintă Console Output. Folosește operatorul de inserție << (săgețile indică direcția spre cout / ecran).',
    simulationPreview: 'Salut, programatorule!'
  },
  {
    id: 'c2',
    taskTitle: 'Citirea vârstei de la tastatură',
    taskDescription: 'Utilizatorul tastează un număr, iar noi vrem să-l extragem din fluxul tastaturii și să-l salvăm în variabila varsta.',
    streamType: 'in',
    codePrefix: 'cin',
    operatorOptions: ['<<', '>>', '=>', '<='],
    correctOperator: '>>',
    variableName: 'varsta;',
    explanation: 'cin reprezintă Console Input. Folosește operatorul de extracție >> (săgețile indică direcția spre variabilă, adică datele intră în memorie).',
    simulationPreview: 'Datele introduse -> salvate în RAM la adresa &varsta'
  },
  {
    id: 'c3',
    taskTitle: 'Citirea a două numere într-o singură linie',
    taskDescription: 'În C++ putem citi mai multe variabile consecutiv folosind fluxul în lanț.',
    streamType: 'in',
    codePrefix: 'cin',
    operatorOptions: ['>> a >> b;', '<< a << b;', '>> a, b;', '= a + b;'],
    correctOperator: '>> a >> b;',
    variableName: '',
    explanation: 'Lanțul de citire se scrie cin >> a >> b;. Operatorul >> se repetă pentru fiecare variabilă citită.',
    simulationPreview: 'Se citesc succesiv a, apoi b separate prin spațiu sau Enter'
  },
  {
    id: 'c4',
    taskTitle: 'Afișare combinată: etichetă și valoare calculată',
    taskDescription: 'Vrem să afișăm textul explicativ "Suma este: " urmat de variabila suma și trecere la linie nouă.',
    streamType: 'out',
    codePrefix: 'cout',
    operatorOptions: ['<< "Suma este: " << suma << endl;', '>> "Suma este: " >> suma;', '<< "Suma este: " + suma;', '<< suma >> endl;'],
    correctOperator: '<< "Suma este: " << suma << endl;',
    variableName: '',
    explanation: 'cout << "text" << variabila << endl; combină textele literale (între ghilimele) cu valorile variabilelor (fără ghilimele). endl trece cursorul pe rândul următor.',
    simulationPreview: 'Suma este: 42'
  }
];

export const CP2Level1_CinCoutStreams: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const currentChallenge = STREAM_CHALLENGES[currentIdx];
  const isFinished = currentIdx >= STREAM_CHALLENGES.length;

  const handleSelectOption = (op: string) => {
    sounds.playClick();
    const isCorrect = op === currentChallenge.correctOperator;
    setSelectedAnswers(prev => ({ ...prev, [currentChallenge.id]: op }));

    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 25);
      setFeedback({
        isCorrect: true,
        text: `Excelent! ${currentChallenge.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Nu chiar. Amintește-ți: fluxul de ieșire cout folosește << (trimite spre ecran), iar fluxul de intrare cin folosește >> (introduce în variabilă).`
      });
    }
  };

  const handleNextChallenge = () => {
    sounds.playClick();
    setFeedback(null);
    if (currentIdx + 1 < STREAM_CHALLENGES.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setCurrentIdx(STREAM_CHALLENGES.length);
    }
  };

  const handleCompleteLevel = () => {
    sounds.playLevelUp();
    onPass(Math.max(score, 75));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nivelul 1 • Clasa a VII-a • Manual Art Klett pag. 74</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Fluxul de Date: <span className="text-indigo-400 font-mono">cin &gt;&gt;</span> și <span className="text-violet-400 font-mono">cout &lt;&lt;</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              În C++, comunicarea cu utilizatorul se face prin <strong>fluxuri (streams)</strong>. Învățăm operatorii de inserție și extracție, direcția datelor și formatarea cu <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded font-mono">endl</code>.
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-indigo-500/20">
            <span className="text-xs text-slate-400 font-mono">Punctaj Nivel</span>
            <span className="text-2xl font-black text-indigo-400 font-mono">{score} <span className="text-xs text-slate-500">/ 100 XP</span></span>
          </div>
        </div>
      </div>

      {/* Visual Analogy Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CIN Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-sky-500/30 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                  <Keyboard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">cin &gt;&gt; Fluxul de Intrare</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">Operator Extracție</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>cin</strong> (console input) extrage date din fluxul tastaturii și le injectează în memoria unei variabile. Săgețile indică direcția:
            </p>
            <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-sky-500/20 font-mono text-sm text-center flex items-center justify-center gap-2">
              <span className="text-slate-400">Tastatură</span>
              <span className="text-sky-400 font-black animate-pulse">&gt;&gt;</span>
              <span className="text-amber-300 font-bold">cin &gt;&gt; variabilă;</span>
              <span className="text-sky-400 font-black">&gt;&gt;</span>
              <span className="text-emerald-400">RAM</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 bg-sky-950/40 p-2.5 rounded-lg border border-sky-900/50">
            💡 <em>Truc mnemotehnic:</em> Săgețile <strong className="text-sky-300">&gt;&gt;</strong> arată spre dreapta, unde se află variabila care primește valoarea!
          </div>
        </div>

        {/* COUT Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-violet-500/30 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">cout &lt;&lt; Fluxul de Ieșire</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-400 border border-violet-800">Operator Inserție</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>cout</strong> (console output) inserează texte sau valori din memorie către ecranul negru al consolei. Săgețile împing datele spre ecran:
            </p>
            <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-violet-500/20 font-mono text-sm text-center flex items-center justify-center gap-2">
              <span className="text-emerald-400">RAM / Valoare</span>
              <span className="text-violet-400 font-black">&lt;&lt;</span>
              <span className="text-amber-300 font-bold">cout &lt;&lt; "Text";</span>
              <span className="text-violet-400 font-black animate-pulse">&lt;&lt;</span>
              <span className="text-slate-300">Ecran</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 bg-violet-950/40 p-2.5 rounded-lg border border-violet-900/50">
            💡 <em>Ghilimele vs Variabile:</em> <code className="text-violet-300">"x"</code> afișează litera x, în timp ce <code className="text-emerald-300">x</code> afișează numărul stocat în variabilă!
          </div>
        </div>
      </div>

      {/* Main Interactive Challenge Arena */}
      {!isFinished ? (
        <div className="bg-slate-900/95 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm font-mono">
                {currentIdx + 1}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{currentChallenge.taskTitle}</h2>
                <p className="text-xs text-slate-400">Provocarea {currentIdx + 1} din {STREAM_CHALLENGES.length}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTip(!showTip)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showTip ? 'Ascunde indiciu' : 'Indiciu'}</span>
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {currentChallenge.taskDescription}
          </p>

          {showTip && (
            <div className="bg-indigo-950/50 border border-indigo-500/30 p-3 rounded-xl text-xs text-indigo-300 animate-fadeIn">
              💡 {currentChallenge.explanation}
            </div>
          )}

          {/* Interactive Code Preview Box */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 font-mono shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 border-b border-slate-900 pb-2">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-indigo-400" /> main.cpp</span>
              <span className="text-emerald-400 text-[11px]">Compilator C++ Activ</span>
            </div>

            <div className="text-sm sm:text-base text-slate-300 flex flex-wrap items-center gap-2">
              <span className="text-indigo-400 font-bold">{currentChallenge.codePrefix}</span>
              <span className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500 text-indigo-300 font-bold animate-pulse">
                {selectedAnswers[currentChallenge.id] || '? ? ?'}
              </span>
              {currentChallenge.variableName && (
                <span className="text-emerald-300">{currentChallenge.variableName}</span>
              )}
            </div>

            {/* Simulated Terminal Output */}
            {selectedAnswers[currentChallenge.id] && (
              <div className="mt-4 pt-4 border-t border-slate-900 flex flex-col gap-1 text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-slate-400" /> Rezultat consolă virtuală:
                </span>
                <span className="text-emerald-400 font-mono bg-black/60 px-3 py-2 rounded-lg border border-emerald-500/20">
                  {feedback?.isCorrect ? currentChallenge.simulationPreview : '> Eroare de sintaxă la flux! Direcția operatorului este greșită.'}
                </span>
              </div>
            )}
          </div>

          {/* Options Buttons */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">Alege operatorul sau secvența corectă:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentChallenge.operatorOptions.map((op, idx) => {
                const isSelected = selectedAnswers[currentChallenge.id] === op;
                const isCorrect = op === currentChallenge.correctOperator;
                let btnStyle = 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 border-slate-700';

                if (isSelected) {
                  btnStyle = isCorrect
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/30';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(op)}
                    disabled={!!feedback?.isCorrect}
                    className={`p-3.5 rounded-xl border text-left font-mono text-sm sm:text-base font-bold transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{op}</span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950 font-sans">
                        {isCorrect ? 'Corect ✓' : 'Greșit ✗'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Action */}
          {feedback && (
            <div className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
              feedback.isCorrect ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-200' : 'bg-rose-950/50 border-rose-500/30 text-rose-200'
            }`}>
              <div className="mt-0.5">
                {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <HelpCircle className="w-5 h-5 text-rose-400" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{feedback.text}</p>
                {feedback.isCorrect && (
                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-lg shadow-emerald-900/30"
                  >
                    <span>{currentIdx + 1 < STREAM_CHALLENGES.length ? 'Următoarea Provocare' : 'Vezi Rezultatul Nivelului'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen for Level 1 */
        <div className="bg-slate-900/95 rounded-3xl border border-emerald-500/30 p-8 text-center flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">Stăpânești Fluxurile C++!</h2>
          <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
            Ai înțeles perfect diferența esențială dintre <code className="text-sky-300 font-mono">cin &gt;&gt;</code> (extracție de la utilizator) și <code className="text-violet-300 font-mono">cout &lt;&lt;</code> (inserție spre ecran).
          </p>
          <div className="bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800 text-emerald-400 font-mono font-bold text-lg">
            +{score} Puncte de Experiență Acumulate
          </div>

          <button
            type="button"
            onClick={handleCompleteLevel}
            className="mt-4 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition cursor-pointer"
          >
            <span>Treci la Nivelul 2: Structura Liniară</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
