import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Lightbulb,
  Check,
  ChevronRight,
  Grid,
  HelpCircle,
  Eye
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

type PatternType = 'santa' | 'tree' | 'checker' | 'triangle';

export const StemLevel4_NestedLoopsArt: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  const [selectedPattern, setSelectedPattern] = useState<PatternType>('santa');
  const [linesCount, setLinesCount] = useState<number>(5);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isDoneGenerating, setIsDoneGenerating] = useState<boolean>(false);

  // Challenges
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  // Generate ASCII rows
  const generateRow = (type: PatternType, row: number, total: number): { spaces: string; symbols: string } => {
    if (type === 'santa' || type === 'tree') {
      const spaceLen = total - row;
      const symbolLen = 2 * row - 1;
      const char = type === 'santa' ? '&' : '*';
      return {
        spaces: ' '.repeat(Math.max(0, spaceLen)),
        symbols: char.repeat(Math.max(0, symbolLen))
      };
    }
    if (type === 'triangle') {
      return {
        spaces: '',
        symbols: '#'.repeat(row)
      };
    }
    // Checkerboard
    let rowChars = '';
    for (let c = 1; c <= total; c++) {
      rowChars += (row + c) % 2 === 0 ? '⬛' : '⬜';
    }
    return {
      spaces: '',
      symbols: rowChars
    };
  };

  const handleStepNext = () => {
    sounds.playClick();
    if (activeStep < linesCount) {
      setActiveStep(prev => prev + 1);
      if (activeStep + 1 === linesCount) {
        setIsDoneGenerating(true);
        sounds.playCorrect();
      }
    }
  };

  const handleResetPattern = (type?: PatternType, n?: number) => {
    sounds.playClick();
    if (type) setSelectedPattern(type);
    if (n) setLinesCount(n);
    setActiveStep(0);
    setIsDoneGenerating(false);
  };

  const CHALLENGES = [
    {
      questionRo: 'Într-un algoritm cu două bucle for imbricate (ex: for i; for j), ce rol are de regulă bucla exterioară (i)?',
      questionEn: 'In an algorithm with two nested for loops (e.g., for i; for j), what role does the outer loop (i) typically play?',
      code: 'for (int i = 1; i <= n; i++) { // bucla exterioara\n    for (int j = 1; j <= m; j++) { // bucla interioara\n        cout << "*";\n    }\n    cout << endl;\n}',
      optionsRo: [
        { label: 'Controlează numărul de linii (rânduri orizontale) afișate', correct: true },
        { label: 'Controlează viteza de calcul a procesorului', correct: false },
        { label: 'Afișează doar cifrele impare', correct: false },
        { label: 'Șterge ecranul consolei', correct: false }
      ],
      optionsEn: [
        { label: 'Controls the number of printed lines (horizontal rows)', correct: true },
        { label: 'Controls processor computing speed', correct: false },
        { label: 'Prints only odd digits', correct: false },
        { label: 'Clears the console screen', correct: false }
      ],
      explanationRo: 'În mod tradițional, i parcurge liniile de sus în jos (1 la n), iar bucla interioară j desenează caracterele de pe linia curentă, urmată de cout << endl pentru a trece la rândul nou!',
      explanationEn: 'Conventionally, i iterates lines top to bottom (1 to n), while inner loop j draws characters across the current line, followed by cout << endl to advance!'
    },
    {
      questionRo: 'La desenarea unei piramide centrate (pag. 94), de ce numărul de caractere de pe linia i este 2 * i - 1?',
      questionEn: 'When drawing a centered pyramid (p. 94), why is the symbol count on line i equal to 2 * i - 1?',
      code: '// Linia 1: 2*1 - 1 = 1 caracter  (     &     )\n// Linia 2: 2*2 - 1 = 3 caractere (    &&&    )\n// Linia 3: 2*3 - 1 = 5 caractere (   &&&&&   )',
      optionsRo: [
        { label: 'Pentru că orice număr de forma 2*i - 1 este impar, permițând simetria perfectă în jurul axei centrale', correct: true },
        { label: 'Este o eroare din manualul de informatică', correct: false },
        { label: 'Pentru că ecranul suportă doar numere impare', correct: false },
        { label: 'Pentru a economisi memoria RAM', correct: false }
      ],
      optionsEn: [
        { label: 'Because 2*i - 1 is always odd, ensuring exact bilateral symmetry around the central axis', correct: true },
        { label: 'It is a mistake in the textbook', correct: false },
        { label: 'Because terminals only support odd quantities', correct: false },
        { label: 'To conserve RAM memory', correct: false }
      ],
      explanationRo: 'O piramidă are mereu un vârf de 1 caracter, urmat de numere impare (1, 3, 5, 7...) pentru a se extinde uniform la stânga și la dreapta!',
      explanationEn: 'A pyramid always starts with a 1-character peak, followed by odd numbers (1, 3, 5, 7...) to expand evenly on both sides!'
    },
    {
      questionRo: 'Câte caractere „*” se vor afișa în total dacă rulăm: for (int i = 1; i <= 3; i++) for (int j = 1; j <= 4; j++) cout << "*"; ?',
      questionEn: 'How many "*" symbols are displayed overall by: for (int i = 1; i <= 3; i++) for (int j = 1; j <= 4; j++) cout << "*"; ?',
      code: 'for (int i = 1; i <= 3; i++)\n    for (int j = 1; j <= 4; j++)\n        cout << "*";',
      optionsRo: [
        { label: '12 caractere (3 linii × 4 coloane = 12)', correct: true },
        { label: '7 caractere (3 + 4)', correct: false },
        { label: '4 caractere', correct: false },
        { label: '3 caractere', correct: false }
      ],
      optionsEn: [
        { label: '12 characters (3 lines × 4 columns = 12)', correct: true },
        { label: '7 characters (3 + 4)', correct: false },
        { label: '4 characters', correct: false },
        { label: '3 characters', correct: false }
      ],
      explanationRo: 'Pentru fiecare dintre cele 3 valori ale lui i, bucla j rulează de 4 ori: 3 × 4 = 12 execuții în total!',
      explanationEn: 'For each of the 3 iterations of i, the j loop executes 4 times: 3 × 4 = 12 executions total!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const opts = lang === 'ro' ? CHALLENGES[qIdx].optionsRo : CHALLENGES[qIdx].optionsEn;
    const isCorrect = opts[optIdx].correct;
    const explanation = lang === 'ro' ? CHALLENGES[qIdx].explanationRo : CHALLENGES[qIdx].explanationEn;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback((lang === 'ro' ? 'Corect! ' : 'Correct! ') + explanation);
    } else {
      sounds.playWrong();
      setChallengeFeedback((lang === 'ro' ? 'Incorect. ' : 'Incorrect. ') + explanation);
    }
  };

  const handleNextChallenge = () => {
    sounds.playClick();
    setChallengeFeedback(null);
    if (challengeStep < CHALLENGES.length - 1) {
      setChallengeStep(prev => prev + 1);
    } else {
      setCompletedChallenge(true);
      sounds.playSuccess();
    }
  };

  const handleFinishLevel = () => {
    sounds.playSuccess();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-slate-900 p-6 rounded-3xl border border-purple-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/30 mb-2">
              <Grid className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === 'ro' ? 'Nivelul 4 din 7 • Modulul 4E' : 'Level 4 of 7 • Module 4E'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro' ? (
                <>Bucle Îmbricate &amp; Modele Grafice ASCII (Manual pag. 94–95)</>
              ) : (
                <>Nested Loops &amp; ASCII Graphic Patterns (Textbook p. 94–95)</>
              )}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro'
                ? 'Descoperă magia buclelor în două dimensiuni: bucla exterioară generează liniile, iar bucla interioară desenează coloanele, spațiile și caracterele grafice.'
                : 'Discover two-dimensional loops: the outer loop drives row lines while the inner loop crafts columns, spaces, and graphic glyphs.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>+15 XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Educational Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-purple-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          <span>
            {lang === 'ro'
              ? 'Formula Matematică a Piramidei: Spații (n - i) & Simboluri (2 * i - 1)'
              : 'Mathematical Formula for Pyramids: Spaces (n - i) & Symbols (2 * i - 1)'}
          </span>
        </div>

        {/* Theoretical Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 font-mono text-xs">
            <div className="text-purple-300 font-bold mb-2 uppercase">
              {lang === 'ro' ? 'Cod C++: Căciula lui Moș Crăciun (pag. 94)' : 'C++ Code: Santa Hat Pattern (p. 94)'}
            </div>
            <div className="text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold">for</span> (int i = 1; i &lt;= n; i++) &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">{lang === 'ro' ? '// 1. Afișare spații pentru centrare:' : '// 1. Print centering spaces:'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-bold">for</span> (int s = 1; s &lt;= n - i; s++) cout &lt;&lt; <span className="text-amber-300">" "</span>;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">{lang === 'ro' ? '// 2. Afișare caractere &:' : '// 2. Print & symbols:'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-bold">for</span> (int c = 1; c &lt;= 2 * i - 1; c++) cout &lt;&lt; <span className="text-cyan-300">"&amp;"</span>;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">{lang === 'ro' ? '// 3. Trecere la rând nou:' : '// 3. Newline feed:'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;cout &lt;&lt; endl;<br />
              &#125;
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-sm block mb-2">
                {lang === 'ro' ? 'Cum funcționează formula pas-cu-pas?' : 'How the formula works step-by-step'}
              </span>
              <p className="leading-relaxed mb-3">
                {lang === 'ro' ? 'Pentru n = 5 linii:' : 'For n = 5 lines:'}
              </p>
              <ul className="space-y-1.5 font-mono text-[11px] text-slate-300">
                <li className="p-1 rounded bg-slate-900/80">
                  {lang === 'ro' ? 'Linia 1: 5 - 1 = ' : 'Line 1: 5 - 1 = '}
                  <strong className="text-amber-300">{lang === 'ro' ? '4 spații' : '4 spaces'}</strong>, 2*1 - 1 = <strong className="text-cyan-300">1 &amp;</strong>
                </li>
                <li className="p-1 rounded bg-slate-900/80">
                  {lang === 'ro' ? 'Linia 2: 5 - 2 = ' : 'Line 2: 5 - 2 = '}
                  <strong className="text-amber-300">{lang === 'ro' ? '3 spații' : '3 spaces'}</strong>, 2*2 - 1 = <strong className="text-cyan-300">3 &amp;</strong>
                </li>
                <li className="p-1 rounded bg-slate-900/80">
                  {lang === 'ro' ? 'Linia 3: 5 - 3 = ' : 'Line 3: 5 - 3 = '}
                  <strong className="text-amber-300">{lang === 'ro' ? '2 spații' : '2 spaces'}</strong>, 2*3 - 1 = <strong className="text-cyan-300">5 &amp;</strong>
                </li>
                <li className="p-1 rounded bg-slate-900/80">
                  {lang === 'ro' ? 'Linia 4: 5 - 4 = ' : 'Line 4: 5 - 4 = '}
                  <strong className="text-amber-300">{lang === 'ro' ? '1 spațiu' : '1 space'}</strong>, 2*4 - 1 = <strong className="text-cyan-300">7 &amp;</strong>
                </li>
                <li className="p-1 rounded bg-slate-900/80">
                  {lang === 'ro' ? 'Linia 5: 5 - 5 = ' : 'Line 5: 5 - 5 = '}
                  <strong className="text-amber-300">{lang === 'ro' ? '0 spații' : '0 spaces'}</strong>, 2*5 - 1 = <strong className="text-cyan-300">9 &amp;</strong>
                </li>
              </ul>
            </div>
            <p className="text-[11px] text-emerald-400 mt-2 font-mono">
              {lang === 'ro'
                ? 'Rezultatul este o formă geometrică perfect centrată pe axa ecranului!'
                : 'The result is a geometric figure symmetrically centered on the screen!'}
            </p>
          </div>
        </div>

        {/* Interactive 2D Matrix Studio */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>
                  {lang === 'ro' ? 'Studio Interactiv de Generare Grafică 2D' : 'Interactive 2D Graphics Studio'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ro'
                  ? 'Alege modelul grafic și numărul de linii, apoi generează linie cu linie!'
                  : 'Choose a pattern and line count, then generate line by line!'}
              </p>
            </div>

            {/* Pattern Selectors */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleResetPattern('santa')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  selectedPattern === 'santa' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                🎅 {lang === 'ro' ? 'Căciulă &' : 'Santa Hat &'}
              </button>
              <button
                type="button"
                onClick={() => handleResetPattern('tree')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  selectedPattern === 'tree' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                🎄 {lang === 'ro' ? 'Brad *' : 'Tree *'}
              </button>
              <button
                type="button"
                onClick={() => handleResetPattern('triangle')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  selectedPattern === 'triangle' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                📐 {lang === 'ro' ? 'Triunghi #' : 'Triangle #'}
              </button>
              <button
                type="button"
                onClick={() => handleResetPattern('checker')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  selectedPattern === 'checker' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                🏁 {lang === 'ro' ? 'Tablă Șah' : 'Chessboard'}
              </button>
            </div>
          </div>

          {/* Controls: linesCount + Stepper */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                {lang === 'ro' ? 'Număr linii n:' : 'Line count n:'}
              </span>
              {[3, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleResetPattern(selectedPattern, num)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    linesCount === num ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  n = {num}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStepNext}
                disabled={activeStep >= linesCount}
                className={`py-1.5 px-4 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                  activeStep >= linesCount
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {activeStep === 0
                    ? (lang === 'ro' ? 'Generează Linia 1' : 'Generate Line 1')
                    : activeStep >= linesCount
                    ? (lang === 'ro' ? 'Desen Complet!' : 'Drawing Complete!')
                    : (lang === 'ro' ? `Următoarea Linie (${activeStep + 1}/${linesCount})` : `Next Line (${activeStep + 1}/${linesCount})`)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleResetPattern()}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title={lang === 'ro' ? 'Resetează desenul' : 'Reset drawing'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Console Canvas */}
          <div className="bg-black/95 border border-slate-800 rounded-2xl p-4 sm:p-6 font-mono text-center flex flex-col items-center justify-center min-h-[160px]">
            <div className="text-[11px] text-slate-600 mb-3 uppercase tracking-wider">
              {lang === 'ro'
                ? `Ecran Consolă Virtuală (Linii active: ${activeStep} din ${linesCount})`
                : `Virtual Console Screen (Active lines: ${activeStep} of ${linesCount})`}
            </div>

            {activeStep === 0 ? (
              <div className="text-slate-600 text-xs italic py-6">
                {lang === 'ro'
                  ? 'Apasă pe „Generează Linia 1” pentru a porni iterațiile buclei exterioare...'
                  : 'Click "Generate Line 1" to start outer loop iterations...'}
              </div>
            ) : (
              <div className="flex flex-col items-center text-sm sm:text-base leading-tight font-black tracking-widest text-cyan-300 whitespace-pre">
                {Array.from({ length: activeStep }).map((_, idx) => {
                  const r = idx + 1;
                  const rowData = generateRow(selectedPattern, r, linesCount);
                  return (
                    <div key={r} className="py-0.5 hover:text-amber-300 transition-colors">
                      <span className="text-slate-700 select-none">{rowData.spaces}</span>
                      <span className={selectedPattern === 'santa' ? 'text-rose-400' : selectedPattern === 'tree' ? 'text-emerald-400' : 'text-cyan-300'}>
                        {rowData.symbols}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>
                {lang === 'ro'
                  ? `Verificare Înțelegere: Bucle Îmbricate (${challengeStep + 1} din ${CHALLENGES.length})`
                  : `Comprehension Check: Nested Loops (${challengeStep + 1} of ${CHALLENGES.length})`}
              </span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {lang === 'ro' ? CHALLENGES[challengeStep].questionRo : CHALLENGES[challengeStep].questionEn}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-purple-300 whitespace-pre">
                  {CHALLENGES[challengeStep].code}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {(lang === 'ro' ? CHALLENGES[challengeStep].optionsRo : CHALLENGES[challengeStep].optionsEn).map((opt, oIdx) => {
                  const isSelected = selectedAnswers[challengeStep] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(challengeStep, oIdx)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? opt.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        opt.correct ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {challengeFeedback && (
                <div className={`p-3 rounded-xl text-xs border ${challengeFeedback.startsWith('Corect') || challengeFeedback.startsWith('Correct') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                  {challengeFeedback}
                </div>
              )}

              {selectedAnswers[challengeStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="self-end py-2 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {challengeStep < CHALLENGES.length - 1
                      ? (lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question')
                      : (lang === 'ro' ? 'Finalizează Nivelul 4' : 'Complete Level 4')}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">
                {lang === 'ro' ? 'Nivelul 4 Finalizat cu Succes!' : 'Level 4 Successfully Completed!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {lang === 'ro'
                  ? 'Ai stăpânit coordonarea buclelor imbricate pe linii și coloane, generarea spațiilor pentru centrare și arta modelelor ASCII.'
                  : 'You mastered 2D nested loop coordination on rows and columns, centering spaces, and ASCII graphic patterns.'}
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {lang === 'ro'
                    ? 'Treci la Nivelul 5: Laboratorul STEM de Fizică în C++'
                    : 'Proceed to Level 5: Physics STEM Lab in C++'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
