import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Bug,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface SkeletonLine {
  id: string;
  code: string;
  roleRo: string;
  roleEn: string;
  correctIndex: number;
}

const INITIAL_SHUFFLED: SkeletonLine[] = [
  {
    id: 's3',
    code: 'int main() {',
    roleRo: 'Punctul de intrare: funcția principală unde începe execuția',
    roleEn: 'Entry point: main function where execution commences',
    correctIndex: 2
  },
  {
    id: 's1',
    code: '#include <iostream>',
    roleRo: 'Directivă preprocesor: include biblioteca de intrare/ieșire',
    roleEn: 'Preprocessor directive: includes standard I/O library',
    correctIndex: 0
  },
  {
    id: 's5',
    code: '    return 0;',
    roleRo: 'Codul de ieșire: semnalează sistemului operativ că totul a decurs fără erori',
    roleEn: 'Exit code: signals operating system that program exited without errors',
    correctIndex: 4
  },
  {
    id: 's2',
    code: 'using namespace std;',
    roleRo: 'Spațiul de nume standard (ne scutește de a scrie std::cout)',
    roleEn: 'Standard namespace (omits repetitive std:: qualifiers)',
    correctIndex: 1
  },
  {
    id: 's4',
    code: '    cout << "Salut, clasa a 7-a!";',
    roleRo: 'Instrucțiune de ieșire: afișează textul pe ecranul consolei',
    roleEn: 'Output statement: prints text to the terminal console',
    correctIndex: 3
  },
  {
    id: 's6',
    code: '}',
    roleRo: 'Acolada de închidere: marchează sfârșitul blocului funcției main',
    roleEn: 'Closing brace: terminates the main function block scope',
    correctIndex: 5
  }
];

export const CPLevel3_ProgramSkeletonSyntax: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [lines, setLines] = useState<SkeletonLine[]>(INITIAL_SHUFFLED);
  const [isAssembled, setIsAssembled] = useState<boolean>(false);
  const [assemblyError, setAssemblyError] = useState<string | null>(null);

  // Bug fixing challenge
  const [foundBugs, setFoundBugs] = useState<Set<number>>(new Set());
  const [fixedCode, setFixedCode] = useState<boolean>(false);
  const [bugError, setBugError] = useState<string | null>(null);

  const moveLine = (index: number, direction: 'up' | 'down') => {
    sounds.playClick();
    setAssemblyError(null);
    const newLines = [...lines];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLines.length) return;

    const temp = newLines[index];
    newLines[index] = newLines[targetIndex];
    newLines[targetIndex] = temp;
    setLines(newLines);
  };

  const handleVerifyAssembly = () => {
    const isCorrect = lines.every((line, idx) => line.correctIndex === idx);
    if (isCorrect) {
      sounds.playCorrect();
      setIsAssembled(true);
      setAssemblyError(null);
    } else {
      sounds.playWrong();
      setAssemblyError(
        lang === 'ro'
          ? 'Ordinea nu este încă perfectă. Începe cu #include <iostream>, apoi using namespace std;, apoi int main() { ... }!'
          : 'Order is not quite right. Start with #include <iostream>, then using namespace std;, followed by int main() { ... }!'
      );
    }
  };

  const handleToggleBug = (bugId: number) => {
    sounds.playClick();
    setBugError(null);
    setFoundBugs(prev => {
      const next = new Set(prev);
      if (next.has(bugId)) next.delete(bugId);
      else next.add(bugId);
      return next;
    });
  };

  const handleVerifyBugs = () => {
    if (foundBugs.has(1) && foundBugs.has(2) && foundBugs.has(3)) {
      sounds.playCorrect();
      setFixedCode(true);
      setBugError(null);
    } else {
      sounds.playWrong();
      setBugError(
        lang === 'ro'
          ? 'Mai sunt erori de sintaxă nedepistate! Caută la directiva include (lipsă #), la finalul afișării (lipsă ;) și la codul de ieșire return 0!'
          : 'Undetected syntax bugs remain! Look closely at the include directive (missing #), end of print statement (missing ;), and standard exit return 0;!'
      );
    }
  };

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
            3
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>
                {lang === 'ro'
                  ? 'Unitatea 4 • Limbajul C++ (Manual Art Klett pag. 68–71)'
                  : 'Unit 4 • C++ Programming (Art Klett Textbook pp. 68–71)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Anatomia & Scheletul Primului Program C++'
                : 'Anatomy & Skeleton of Your First C++ Program'}
            </h2>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {lang === 'ro'
            ? `Etapa: ${isAssembled ? (fixedCode ? 'Finalizată (Nota 10)' : '2/2 Depanare Erori') : '1/2 Asamblare Schelet'}`
            : `Stage: ${isAssembled ? (fixedCode ? 'Completed (100%)' : '2/2 Syntax Debugging') : '1/2 Skeleton Assembly'}`}
        </div>
      </div>

      {/* Part 1: Skeleton Assembly */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>
                {lang === 'ro'
                  ? 'Etapa 1: Ordonează liniile pentru a obține programul C++ valid'
                  : 'Stage 1: Reorder lines to construct a valid C++ program skeleton'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ro'
                ? 'Folosește butoanele ▲ și ▼ pentru a muta instrucțiunile în secvența canonică de compilare.'
                : 'Use ▲ and ▼ buttons to arrange instructions in the canonical compilation sequence.'}
            </p>
          </div>
        </div>

        {assemblyError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{assemblyError}</span>
          </div>
        )}

        <div className="flex flex-col gap-2 bg-slate-950 p-3 sm:p-4 rounded-2xl border-2 border-slate-800 font-mono text-xs sm:text-sm">
          {lines.map((line, idx) => {
            const role = lang === 'ro' ? line.roleRo : line.roleEn;
            return (
              <div
                key={line.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isAssembled
                    ? 'bg-slate-900/90 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono select-none w-6">
                    {idx + 1}.
                  </span>
                  <div>
                    <span className="font-bold text-violet-300">{line.code}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                      {role}
                    </div>
                  </div>
                </div>

                {!isAssembled && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveLine(idx, 'up')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition cursor-pointer"
                      title={lang === 'ro' ? 'Mută în sus' : 'Move up'}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === lines.length - 1}
                      onClick={() => moveLine(idx, 'down')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition cursor-pointer"
                      title={lang === 'ro' ? 'Mută în jos' : 'Move down'}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {isAssembled && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {!isAssembled && (
          <button
            onClick={handleVerifyAssembly}
            className="w-full sm:w-auto self-end px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition cursor-pointer"
          >
            {lang === 'ro' ? 'Verifică Ordinea Scheletului' : 'Verify Skeleton Sequence'}
          </button>
        )}
      </div>

      {/* Part 2: Bug Hunting Challenge */}
      {isAssembled && (
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border-2 border-violet-500/40 flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-rose-400" />
              <div>
                <h4 className="font-bold text-sm text-white font-heading">
                  {lang === 'ro'
                    ? 'Etapa 2: Detectorul de Erori de Compilare (Bugs)'
                    : 'Stage 2: Syntax Bug Hunting & Diagnostic'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ro'
                    ? 'Un coleg a scris codul de mai jos în Code::Blocks, dar compilatorul a semnalat 3 erori grave de sintaxă. Identifică cele 3 linii greșite dând clic pe ele:'
                    : 'A student wrote the snippet below in Code::Blocks, but GCC flagged 3 critical syntax errors. Click the 3 broken lines to flag them:'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
              {lang === 'ro'
                ? `${foundBugs.size} / 3 erori bifate`
                : `${foundBugs.size} / 3 errors flagged`}
            </span>
          </div>

          {bugError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{bugError}</span>
            </div>
          )}

          {/* Faulty Code Snippet with interactive lines */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm space-y-1.5">
            {/* Line 1 - Bug 1: missing # */}
            <button
              onClick={() => handleToggleBug(1)}
              className={`w-full text-left p-2 rounded-lg transition border flex items-center justify-between cursor-pointer ${
                foundBugs.has(1)
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                  : 'hover:bg-slate-800/60 border-transparent text-slate-300'
              }`}
            >
              <span><span className="text-slate-500 mr-3">1</span>include &lt;iostream&gt;</span>
              {foundBugs.has(1) && (
                <span className="text-[10px] text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded font-sans">
                  {lang === 'ro'
                    ? 'Eroare: lipsește caracterul diez # în fața directivei!'
                    : 'Error: Missing hash # prefix before include directive!'}
                </span>
              )}
            </button>

            {/* Line 2 - Correct */}
            <div className="p-2 text-slate-400">
              <span className="text-slate-500 mr-3">2</span>using namespace std;
            </div>

            {/* Line 3 - Correct */}
            <div className="p-2 text-slate-400">
              <span className="text-slate-500 mr-3">3</span>int main() &#123;
            </div>

            {/* Line 4 - Bug 2: missing ; */}
            <button
              onClick={() => handleToggleBug(2)}
              className={`w-full text-left p-2 rounded-lg transition border flex items-center justify-between cursor-pointer ${
                foundBugs.has(2)
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                  : 'hover:bg-slate-800/60 border-transparent text-slate-300'
              }`}
            >
              <span><span className="text-slate-500 mr-3">4</span>    cout &lt;&lt; "Nota 10 la informatica"</span>
              {foundBugs.has(2) && (
                <span className="text-[10px] text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded font-sans">
                  {lang === 'ro'
                    ? 'Eroare: lipsește caracterul punct și virgulă (;) la final!'
                    : 'Error: Semicolon (;) missing at statement end!'}
                </span>
              )}
            </button>

            {/* Line 5 - Bug 3: missing return 0; */}
            <button
              onClick={() => handleToggleBug(3)}
              className={`w-full text-left p-2 rounded-lg transition border flex items-center justify-between cursor-pointer ${
                foundBugs.has(3)
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                  : 'hover:bg-slate-800/60 border-transparent text-slate-300'
              }`}
            >
              <span><span className="text-slate-500 mr-3">5</span>    exit_program;</span>
              {foundBugs.has(3) && (
                <span className="text-[10px] text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded font-sans">
                  {lang === 'ro'
                    ? 'Eroare: în C++ ieșirea standard se face prin "return 0;"!'
                    : 'Error: Canonical C++ main termination is "return 0;"!'}
                </span>
              )}
            </button>

            {/* Line 6 - Correct */}
            <div className="p-2 text-slate-400">
              <span className="text-slate-500 mr-3">6</span>&#125;
            </div>
          </div>

          {!fixedCode ? (
            <button
              onClick={handleVerifyBugs}
              disabled={foundBugs.size < 3}
              className="w-full sm:w-auto self-end px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition cursor-pointer"
            >
              {lang === 'ro' ? 'Validează Erorile Depistate' : 'Validate Identified Errors'}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'ro'
                  ? 'Excelent! Ai stăpânit perfect anatomia și regulile de bază ale sintaxei C++.'
                  : 'Outstanding! You mastered the syntax anatomy and rules of C++ programs.'}
              </span>
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer"
              >
                <span>
                  {lang === 'ro'
                    ? 'Mergi la Nivelul 4: Tipuri de Date Fundamentale'
                    : 'Advance to Level 4: Fundamental Data Types'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
