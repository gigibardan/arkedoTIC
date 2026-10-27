import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Code, Blocks, Cpu, HelpCircle, Lightbulb } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface MatchPair {
  id: string;
  scratchConcept: string;
  scratchBlockColor: string;
  scratchSnippet: string;
  cppConcept: string;
  cppCode: string;
  explanation: string;
}

const MATCH_PAIRS: MatchPair[] = [
  {
    id: 'p1',
    scratchConcept: 'Startul programului',
    scratchBlockColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    scratchSnippet: 'când se dă clic pe 🚩',
    cppConcept: 'Punctul de intrare C++',
    cppCode: 'int main() { ... }',
    explanation: 'În C++, execuția oricărui program pornește automat din interiorul funcției speciale numită main().'
  },
  {
    id: 'p2',
    scratchConcept: 'Afișare mesaj pe scenă',
    scratchBlockColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    scratchSnippet: 'spune [Salut!] pentru 2 sec',
    cppConcept: 'Fluxul de ieșire în consolă',
    cppCode: 'cout << "Salut!";',
    explanation: 'cout (console output) împreună cu operatorul << trimite text sau variabile către ecranul consolei.'
  },
  {
    id: 'p3',
    scratchConcept: 'Creare și setare variabilă',
    scratchBlockColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    scratchSnippet: 'setează [scor v] la (100)',
    cppConcept: 'Declarare tip & inițializare',
    cppCode: 'int scor = 100;',
    explanation: 'În C++ trebuie să precizezi întotdeauna tipul variabilei (int pentru numere întregi) înainte de a-i da o valoare.'
  },
  {
    id: 'p4',
    scratchConcept: 'Citire răspuns de la tastatură',
    scratchBlockColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    scratchSnippet: 'întreabă [Vârsta?] și așteaptă',
    cppConcept: 'Fluxul de intrare de la utilizator',
    cppCode: 'cin >> varsta;',
    explanation: 'cin (console input) împreună cu operatorul >> preia datele tastate de utilizator și le pune în variabilă.'
  },
  {
    id: 'p5',
    scratchConcept: 'Repetă de un număr de ori',
    scratchBlockColor: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
    scratchSnippet: 'repetă de (10) ori',
    cppConcept: 'Buclă cu contor for',
    cppCode: 'for (int i = 0; i < 10; i++)',
    explanation: 'Bucla for controlează pașii printr-o variabilă contor i care crește la fiecare pas.'
  }
];

export const CPLevel1_TransitionFromScratch: React.FC<Props> = ({ onPass }) => {
  const [selectedScratch, setSelectedScratch] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // scratchId -> cppId
  const [errorPair, setErrorPair] = useState<string | null>(null);
  const [showTheory, setShowTheory] = useState<boolean>(true);

  const handleSelectScratch = (id: string) => {
    sounds.playClick();
    setSelectedScratch(id);
    setErrorPair(null);
  };

  const handleSelectCpp = (cppId: string) => {
    if (!selectedScratch) return;

    if (selectedScratch === cppId) {
      // Correct Match!
      sounds.playCorrect();
      setMatches(prev => ({ ...prev, [selectedScratch]: cppId }));
      setSelectedScratch(null);
      setErrorPair(null);
    } else {
      // Wrong Match
      sounds.playWrong();
      setErrorPair(cppId);
      setTimeout(() => setErrorPair(null), 1200);
    }
  };

  const allMatched = Object.keys(matches).length === MATCH_PAIRS.length;

  const handleFinish = () => {
    sounds.playVictory();
    onPass(100);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg text-2xl font-black">
            1
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Unitatea 4 • Limbajul C++ (Manual Art Klett pag. 64–67)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Marele Salt: De la Scratch la C++
            </h2>
          </div>
        </div>

        <button
          onClick={() => setShowTheory(!showTheory)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{showTheory ? 'Ascunde Teoria' : 'Vezi Teoria'}</span>
        </button>
      </div>

      {/* Theory Card */}
      {showTheory && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-950 to-slate-950 border border-violet-500/30 text-xs sm:text-sm text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-violet-300 font-bold font-heading text-sm">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>De ce trecem de la blocuri vizuale la cod textual C++?</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            În clasele a V-a și a VI-a ai folosit <strong>Scratch</strong>, unde logica se construia ca un joc LEGO. 
            În clasa a VII-a facem pasul spre <strong>C++</strong>, unul dintre cele mai rapide, apreciate și puternice limbaje profesionale de pe planetă!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-violet-400 mb-1">🎮 Jocuri 3D & Motoare</div>
              <p className="text-xs text-slate-400">Unreal Engine și majoritatea jocurilor AAA (Cyberpunk, GTA) sunt scrise în C++ pentru performanță extremă.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-sky-400 mb-1">🚀 Sisteme & Rachete</div>
              <p className="text-xs text-slate-400">Windows, motoarele browserelor (Chromium) și rachetele spațiale NASA se bazează pe viteza limbajului C++.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-emerald-400 mb-1">🏆 Olimpiade Școlare</div>
              <p className="text-xs text-slate-400">Olimpiada Națională de Informatică (ONI) și concursurile de programare din România se desfășoară exclusiv în C++.</p>
            </div>
          </div>
        </div>
      )}

      {/* Matching Interactive Game */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Asociază fiecare concept vizual din Scratch cu echivalentul său textual în C++:</span>
          </p>
          <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/80 px-2.5 py-1 rounded-lg border border-violet-800">
            {Object.keys(matches).length} / {MATCH_PAIRS.length} conectate
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column A: Scratch Blocks */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5 px-2">
              <Blocks className="w-3.5 h-3.5" />
              <span>Blocuri Scratch (Vizual)</span>
            </div>

            {MATCH_PAIRS.map(pair => {
              const isMatched = !!matches[pair.id];
              const isSelected = selectedScratch === pair.id;

              return (
                <button
                  key={pair.id}
                  disabled={isMatched}
                  onClick={() => handleSelectScratch(pair.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                    isMatched
                      ? 'bg-slate-950/60 border-emerald-500/40 opacity-70 cursor-default'
                      : isSelected
                      ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 w-5">
                      {pair.id.replace('p', '#')}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-slate-400">
                        {pair.scratchConcept}
                      </div>
                      <div className={`mt-1 font-mono text-xs px-2.5 py-1 rounded-lg border inline-block ${pair.scratchBlockColor}`}>
                        {pair.scratchSnippet}
                      </div>
                    </div>
                  </div>

                  {isMatched ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'bg-amber-400 border-amber-400 animate-ping' : 'border-slate-600'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Column B: C++ Code */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold flex items-center gap-1.5 px-2">
              <Code className="w-3.5 h-3.5" />
              <span>Sintaxă C++ (Cod Textual)</span>
            </div>

            {/* Render in a shuffled or fixed order for matching */}
            {[MATCH_PAIRS[2], MATCH_PAIRS[0], MATCH_PAIRS[4], MATCH_PAIRS[1], MATCH_PAIRS[3]].map(pair => {
              const isMatched = Object.values(matches).includes(pair.id);
              const isError = errorPair === pair.id;

              return (
                <button
                  key={pair.id}
                  disabled={isMatched || !selectedScratch}
                  onClick={() => handleSelectCpp(pair.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between gap-3 ${
                    isMatched
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                      : isError
                      ? 'bg-rose-950/40 border-rose-500 animate-shake'
                      : selectedScratch
                      ? 'bg-slate-950 border-violet-500/40 hover:border-violet-400 hover:bg-violet-950/20 cursor-pointer'
                      : 'bg-slate-950 border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="text-xs font-medium text-slate-400">
                      {pair.cppConcept}
                    </div>
                    <div className="mt-1 font-mono font-bold text-xs sm:text-sm text-violet-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 inline-block">
                      {pair.cppCode}
                    </div>
                    {isMatched && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        {pair.explanation}
                      </p>
                    )}
                  </div>

                  {isMatched && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion & Next Button */}
      {allMatched && (
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Felicitări! Ai făcut cu brio tranziția mentală de la Scratch la C++.</span>
          </div>

          <button
            onClick={handleFinish}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold font-heading text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <span>Treci la Nivelul 2: Mediul Code::Blocks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
