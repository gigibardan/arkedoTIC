import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Code, Blocks, Cpu, Lightbulb } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface MatchPair {
  id: string;
  scratchConceptRo: string;
  scratchConceptEn: string;
  scratchBlockColor: string;
  scratchSnippetRo: string;
  scratchSnippetEn: string;
  cppConceptRo: string;
  cppConceptEn: string;
  cppCode: string;
  explanationRo: string;
  explanationEn: string;
}

const MATCH_PAIRS: MatchPair[] = [
  {
    id: 'p1',
    scratchConceptRo: 'Startul programului',
    scratchConceptEn: 'Program execution entry point',
    scratchBlockColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    scratchSnippetRo: 'când se dă clic pe 🚩',
    scratchSnippetEn: 'when 🚩 clicked',
    cppConceptRo: 'Punctul de intrare C++',
    cppConceptEn: 'C++ entry function',
    cppCode: 'int main() { ... }',
    explanationRo: 'În C++, execuția oricărui program pornește automat din interiorul funcției speciale numită main().',
    explanationEn: 'In C++, execution of every program starts automatically inside the special function named main().'
  },
  {
    id: 'p2',
    scratchConceptRo: 'Afișare mesaj pe scenă',
    scratchConceptEn: 'Display message on stage',
    scratchBlockColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    scratchSnippetRo: 'spune [Salut!] pentru 2 sec',
    scratchSnippetEn: 'say [Hello!] for 2 secs',
    cppConceptRo: 'Fluxul de ieșire în consolă',
    cppConceptEn: 'Console output stream',
    cppCode: 'cout << "Salut!";',
    explanationRo: 'cout (console output) împreună cu operatorul << trimite text sau variabile către ecranul consolei.',
    explanationEn: 'cout (console output) with the insertion operator << emits text or variables to the terminal console.'
  },
  {
    id: 'p3',
    scratchConceptRo: 'Creare și setare variabilă',
    scratchConceptEn: 'Create & set variable',
    scratchBlockColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    scratchSnippetRo: 'setează [scor v] la (100)',
    scratchSnippetEn: 'set [score v] to (100)',
    cppConceptRo: 'Declarare tip & inițializare',
    cppConceptEn: 'Type declaration & initialization',
    cppCode: 'int scor = 100;',
    explanationRo: 'În C++ trebuie să precizezi întotdeauna tipul variabilei (int pentru numere întregi) înainte de a-i da o valoare.',
    explanationEn: 'In C++, variables are statically typed: declare the type (e.g. int for integers) prior to assignment.'
  },
  {
    id: 'p4',
    scratchConceptRo: 'Citire răspuns de la tastatură',
    scratchConceptEn: 'Read user keyboard input',
    scratchBlockColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    scratchSnippetRo: 'întreabă [Vârsta?] și așteaptă',
    scratchSnippetEn: 'ask [Age?] and wait',
    cppConceptRo: 'Fluxul de intrare de la utilizator',
    cppConceptEn: 'Console input stream',
    cppCode: 'cin >> varsta;',
    explanationRo: 'cin (console input) împreună cu operatorul >> preia datele tastate de utilizator și le pune în variabilă.',
    explanationEn: 'cin (console input) with extraction operator >> extracts input from the keyboard into a variable.'
  },
  {
    id: 'p5',
    scratchConceptRo: 'Repetă de un număr de ori',
    scratchConceptEn: 'Repeat a fixed number of times',
    scratchBlockColor: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
    scratchSnippetRo: 'repetă de (10) ori',
    scratchSnippetEn: 'repeat (10)',
    cppConceptRo: 'Buclă cu contor for',
    cppConceptEn: 'Count-controlled for loop',
    cppCode: 'for (int i = 0; i < 10; i++)',
    explanationRo: 'Bucla for controlează pașii printr-o variabilă contor i care crește la fiecare pas.',
    explanationEn: 'A for loop controls step iterations via an indexed counter variable incremented each pass.'
  }
];

export const CPLevel1_TransitionFromScratch: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
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
              <span>
                {lang === 'ro'
                  ? 'Unitatea 4 • Limbajul C++ (Manual Art Klett pag. 64–67)'
                  : 'Unit 4 • C++ Programming (Art Klett Textbook pp. 64–67)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro' ? 'Marele Salt: De la Scratch la C++' : 'The Big Leap: From Scratch to C++'}
            </h2>
          </div>
        </div>

        <button
          onClick={() => setShowTheory(!showTheory)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {showTheory
              ? (lang === 'ro' ? 'Ascunde Teoria' : 'Hide Theory')
              : (lang === 'ro' ? 'Vezi Teoria' : 'View Theory')}
          </span>
        </button>
      </div>

      {/* Theory Card */}
      {showTheory && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-950 to-slate-950 border border-violet-500/30 text-xs sm:text-sm text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-violet-300 font-bold font-heading text-sm">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>
              {lang === 'ro'
                ? 'De ce trecem de la blocuri vizuale la cod textual C++?'
                : 'Why transition from visual blocks to textual C++ source code?'}
            </span>
          </div>
          <p className="leading-relaxed text-slate-300">
            {lang === 'ro' ? (
              <>
                În clasele a V-a și a VI-a ai folosit <strong>Scratch</strong>, unde logica se construia ca un joc LEGO. 
                În clasa a VII-a facem pasul spre <strong>C++</strong>, unul dintre cele mai rapide, apreciate și puternice limbaje profesionale de pe planetă!
              </>
            ) : (
              <>
                In Grades 5 and 6 you created programs in <strong>Scratch</strong> snapping blocks together like LEGO. In Grade 7, we step into <strong>C++</strong>, one of the fastest, most revered, and high-performance industry languages in computing history!
              </>
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-violet-400 mb-1">
                {lang === 'ro' ? '🎮 Jocuri 3D & Motoare' : '🎮 3D Gaming & Engines'}
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'ro'
                  ? 'Unreal Engine și majoritatea jocurilor AAA (Cyberpunk, GTA) sunt scrise în C++ pentru performanță extremă.'
                  : 'Unreal Engine and leading AAA game titles rely on C++ for extreme framerates and memory control.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-sky-400 mb-1">
                {lang === 'ro' ? '🚀 Sisteme & Rachete' : '🚀 Systems & Aerospace'}
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'ro'
                  ? 'Windows, motoarele browserelor (Chromium) și rachetele spațiale NASA se bazează pe viteza limbajului C++.'
                  : 'Windows OS kernels, browser engines (Chromium), and NASA spacecraft avionics trust C++ speed.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-emerald-400 mb-1">
                {lang === 'ro' ? '🏆 Olimpiade Școlare' : '🏆 Olympiads & Competitions'}
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'ro'
                  ? 'Olimpiada Națională de Informatică (ONI) și concursurile de programare din România se desfășoară exclusiv în C++.'
                  : 'National Informatics Olympiads and international competitive programming rely almost exclusively on C++.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Matching Interactive Game */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {lang === 'ro'
                ? 'Asociază fiecare concept vizual din Scratch cu echivalentul său textual în C++:'
                : 'Match each Scratch visual block concept with its C++ textual syntax counterpart:'}
            </span>
          </p>
          <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/80 px-2.5 py-1 rounded-lg border border-violet-800">
            {lang === 'ro'
              ? `${Object.keys(matches).length} / ${MATCH_PAIRS.length} conectate`
              : `${Object.keys(matches).length} / ${MATCH_PAIRS.length} connected`}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column A: Scratch Blocks */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5 px-2">
              <Blocks className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Blocuri Scratch (Vizual)' : 'Scratch Blocks (Visual)'}</span>
            </div>

            {MATCH_PAIRS.map(pair => {
              const isMatched = !!matches[pair.id];
              const isSelected = selectedScratch === pair.id;
              const concept = lang === 'ro' ? pair.scratchConceptRo : pair.scratchConceptEn;
              const snippet = lang === 'ro' ? pair.scratchSnippetRo : pair.scratchSnippetEn;

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
                        {concept}
                      </div>
                      <div className={`mt-1 font-mono text-xs px-2.5 py-1 rounded-lg border inline-block ${pair.scratchBlockColor}`}>
                        {snippet}
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
              <span>{lang === 'ro' ? 'Sintaxă C++ (Cod Textual)' : 'C++ Syntax (Textual Code)'}</span>
            </div>

            {/* Render in a shuffled or fixed order for matching */}
            {[MATCH_PAIRS[2], MATCH_PAIRS[0], MATCH_PAIRS[4], MATCH_PAIRS[1], MATCH_PAIRS[3]].map(pair => {
              const isMatched = Object.values(matches).includes(pair.id);
              const isError = errorPair === pair.id;
              const cppConcept = lang === 'ro' ? pair.cppConceptRo : pair.cppConceptEn;
              const explanation = lang === 'ro' ? pair.explanationRo : pair.explanationEn;

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
                      {cppConcept}
                    </div>
                    <div className="mt-1 font-mono font-bold text-xs sm:text-sm text-violet-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 inline-block">
                      {pair.cppCode}
                    </div>
                    {isMatched && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        {explanation}
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
            <span>
              {lang === 'ro'
                ? 'Felicitări! Ai făcut cu brio tranziția mentală de la Scratch la C++.'
                : 'Congratulations! You successfully mastered the conceptual leap from Scratch to C++.'}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold font-heading text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <span>
              {lang === 'ro'
                ? 'Treci la Nivelul 2: Mediul Code::Blocks'
                : 'Advance to Level 2: Code::Blocks IDE'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
