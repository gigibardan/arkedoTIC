import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Play,
  RotateCcw,
  FileCode,
  Braces
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface A1Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface CodeLine {
  id: string;
  code: string;
  order: number;
  explanationRo: string;
  explanationEn: string;
}

const CORRECT_ORDER: CodeLine[] = [
  {
    id: 'inc',
    code: '#include <iostream>',
    order: 1,
    explanationRo: 'Directiva de preprocesare ce include biblioteca standard pentru operații de intrare/ieșire (cin/cout).',
    explanationEn: 'Preprocessor directive including the standard I/O library for stream operations (cin/cout).'
  },
  {
    id: 'std',
    code: 'using namespace std;',
    order: 2,
    explanationRo: 'Declară spațiul de nume standard, permițând scrierea simplificată a comenzilor fără prefixul std::',
    explanationEn: 'Declares standard namespace, avoiding repetitive std:: prefixes before stream keywords.'
  },
  {
    id: 'main',
    code: 'int main() {',
    order: 3,
    explanationRo: 'Punctul obligatoriu de intrare în execuție al oricărui program scris în C++.',
    explanationEn: 'The mandatory execution entry point of every C++ application.'
  },
  {
    id: 'cout',
    code: '    cout << "Salut, clasa a VIII-a!" << endl;',
    order: 4,
    explanationRo: 'Instrucțiunea de afișare pe ecran, încheiată obligatoriu cu punct și virgulă (;).',
    explanationEn: 'Standard stream output instruction, terminated by a semicolon (;).'
  },
  {
    id: 'ret',
    code: '    return 0;',
    order: 5,
    explanationRo: 'Semnalează sistemului de operare finalizarea cu succes (cod 0) a programului.',
    explanationEn: 'Signals successful program execution termination code 0 to the operating system.'
  },
  {
    id: 'close',
    code: '}',
    order: 6,
    explanationRo: 'Acolada dreaptă ce încheie corpul funcției principale main().',
    explanationEn: 'Closing curly brace terminating the scope of the main() function.'
  }
];

export const A1Level1_CppEnvironmentAndStructure: React.FC<A1Level1Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Puzzle state: scrambled code lines to place in order
  const [placedLines, setPlacedLines] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isCompiled, setIsCompiled] = useState<boolean>(false);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const availableLines = CORRECT_ORDER.filter(l => !placedLines.includes(l.id));

  const handleAddLine = (id: string) => {
    setPlacedLines(prev => [...prev, id]);
    setIsCompiled(false);
    sounds.playClick();
  };

  const handleRemoveLine = (id: string) => {
    setPlacedLines(prev => prev.filter(item => item !== id));
    setIsCompiled(false);
    sounds.playClick();
  };

  const handleResetCode = () => {
    setPlacedLines([]);
    setConsoleOutput('');
    setIsCompiled(false);
    sounds.playClick();
  };

  const handleRunProgram = () => {
    const isOrderCorrect =
      placedLines.length === CORRECT_ORDER.length &&
      placedLines.every((id, idx) => id === CORRECT_ORDER[idx].id);

    if (isOrderCorrect) {
      sounds.playCorrect();
      setIsCompiled(true);
      setConsoleOutput(
        lang === 'ro'
          ? '=== Compilare Reușită (GCC 14.2 C++17) ===\n' +
            '--------------------------------------------\n' +
            'Salut, clasa a VIII-a!\n\n' +
            'Process returned 0 (0x0)   execution time : 0.002 s\n' +
            'Press any key to continue.'
          : '=== Build Succeeded (GCC 14.2 C++17) ===\n' +
            '--------------------------------------------\n' +
            'Hello, 8th Grade!\n\n' +
            'Process returned 0 (0x0)   execution time : 0.002 s\n' +
            'Press any key to continue.'
      );
    } else {
      sounds.playWrong();
      setIsCompiled(false);
      setConsoleOutput(
        lang === 'ro'
          ? '=== EROARE DE COMPILARE (Compile Error) ===\n' +
            'main.cpp: error: structura programului este incompletă sau liniile sunt inversate!\n' +
            'Asigură-te că #include <iostream> este primul, urmat de using namespace std;, apoi funcția int main() cu acolade.'
          : '=== COMPILE ERROR ===\n' +
            'main.cpp: error: program skeleton incomplete or statements out of order!\n' +
            'Ensure #include <iostream> comes first, followed by using namespace std;, then int main() with braces.'
      );
    }
  };

  const handleSelectAnswer = (qId: string, optId: string) => {
    if (submitted[qId] || isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = answers[qId] === correctId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmitted(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];
  const canProceed = isCompiled && allQuizzesPassed;

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Code2 className="w-5 h-5 text-cyan-300" />
              <span>
                {lang === 'ro'
                  ? 'Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A'
                  : 'Unit 3: Algorithms & Advanced C++ Programming • Module 3A'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 1: Mediul de Programare & Structura Canonică a unui Program C++'
                : 'Lesson 1: Development Environment & Canonical C++ Program Structure'}
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 59–64: Recapitularea elementelor fundamentale C++: directiva #include <iostream>, spațiul de nume std, funcția principală int main(), acoladele de bloc și rolul punctului și virgulei (;).'
                : 'Curriculum p. 59–64: Reviewing foundational C++ syntax: #include <iostream> directive, std namespace, int main() entry function, scoped braces, and the mandatory semicolon (;).'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-cyan-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">1 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Scheletul Canonic C++ (Manual pag. 59)'
              : 'Theoretical Reference: Canonical C++ Program Skeleton (Curriculum p. 59)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-600" />
              Directiva #include &lt;iostream&gt;
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Instrucțiune adresată preprocesorului ce include fișierul antet standard pentru fluxurile de date: cin (intrarea standard - tastatura) și cout (ieșirea standard - ecranul).'
                : 'Preprocessor instruction importing standard I/O streams: cin (standard input from keyboard) and cout (standard output to terminal screen).'}
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Braces className="w-4 h-4 text-indigo-600" />
              Funcția int main()
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Orice program C++ își începe execuția în funcția main(). Instrucțiunile sunt cuprinse între acolade { ... } și se execută secvențial de sus în jos.'
                : 'Every C++ application begins execution inside main(). Instructions are wrapped in curly braces { ... } and execute sequentially from top to bottom.'}
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              {lang === 'ro' ? 'Punct și Virgulă (;) & return 0;' : 'Semicolon (;) & return 0;'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Fiecare instrucțiune se termină obligatoriu cu ;. Lipsa lui oprește compilarea. return 0; transmite sistemului de operare că programul s-a încheiat fără eroare.'
                : 'Every simple statement must terminate with a semicolon (;). Omitting it triggers a syntax error. return 0; confirms flawless termination to the operating system.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Code Assembly Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              {lang === 'ro'
                ? 'Simulator Interactiv: Asamblează Scheletul unui Program C++'
                : 'Interactive Simulator: Assemble Canonical C++ Skeleton'}
            </h3>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
            {lang === 'ro' ? 'Laborator C++' : 'C++ Lab'}
          </span>
        </div>

        <p className="text-xs text-slate-600">
          {lang === 'ro'
            ? 'Apasă pe instrucțiunile de mai jos în ordinea logică corectă de compilare pentru a asambla fișierul main.cpp, apoi apasă butonul „Compilează & Rulează”.'
            : 'Click the code blocks below in the correct lexical sequence to assemble main.cpp, then click "Build & Run".'}
        </p>

        {/* Available blocks */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {lang === 'ro' ? 'Instrucțiuni disponibile (Clic pentru adăugare):' : 'Available statements (Click to insert):'}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableLines.length === 0 ? (
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                {lang === 'ro' ? 'Toate instrucțiunile au fost plasate în cod!' : 'All statements placed into code!'}
              </span>
            ) : (
              availableLines.map(line => (
                <button
                  key={line.id}
                  onClick={() => handleAddLine(line.id)}
                  className="px-3 py-2 bg-slate-100 hover:bg-indigo-50 hover:border-indigo-400 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 transition transform active:scale-95 text-left"
                >
                  <code>{line.code}</code>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Code Editor Mockup */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-mono text-slate-300 ml-2">main.cpp</span>
              </div>
              <button
                onClick={handleResetCode}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                title={lang === 'ro' ? 'Resetează codul' : 'Reset code'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Resetează' : 'Reset'}</span>
              </button>
            </div>

            <div className="p-4 font-mono text-xs flex-1 space-y-1 bg-slate-950 text-slate-100 min-h-[220px]">
              {placedLines.length === 0 ? (
                <div className="text-slate-600 italic py-8 text-center">
                  {lang === 'ro' ? (
                    <>
                      // Spațiul tău de lucru este gol.<br />
                      // Dă clic pe blocurile de sus pentru a asambla codul sursă.
                    </>
                  ) : (
                    <>
                      // Workspace is empty.<br />
                      // Click code blocks above to construct main.cpp.
                    </>
                  )}
                </div>
              ) : (
                placedLines.map((id, index) => {
                  const lineObj = CORRECT_ORDER.find(l => l.id === id)!;
                  return (
                    <div
                      key={id}
                      onClick={() => handleRemoveLine(id)}
                      className="flex items-center justify-between group hover:bg-slate-800/80 p-1 rounded cursor-pointer transition"
                      title={lang === 'ro' ? 'Clic pentru a elimina rândul' : 'Click to remove line'}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 select-none w-4 text-right text-[11px]">{index + 1}</span>
                        <span className="text-cyan-300">{lineObj.code}</span>
                      </div>
                      <span className="text-[10px] text-rose-400 opacity-0 group-hover:opacity-100">
                        ✕ {lang === 'ro' ? 'elimină' : 'remove'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleRunProgram}
                disabled={placedLines.length === 0}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'ro' ? 'Compilează & Rulează (F9)' : 'Build & Run (F9)'}</span>
              </button>
            </div>
          </div>

          {/* Console Output Mockup */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2 text-xs text-slate-300 border-b border-slate-700 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ro' ? 'Consolă de Execuție (stdout / stderr)' : 'Terminal Output (stdout / stderr)'}</span>
            </div>
            <div className="p-4 font-mono text-xs flex-1 bg-black text-emerald-400 min-h-[220px] whitespace-pre-wrap">
              {consoleOutput || (lang === 'ro' ? '// Așteptare compilare... Apasă „Compilează & Rulează”.' : '// Waiting for compilation... Click "Build & Run".')}
            </div>
            {isCompiled && (
              <div className="p-3 bg-emerald-950/80 border-t border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ro' ? 'Programul C++ a fost validat cu succes!' : 'C++ program built and executed successfully!'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            {lang === 'ro'
              ? 'Verificare Pedagogică: Structura Limbajului C++ (Manual pag. 59)'
              : 'Pedagogical Check: C++ Program Architecture (Curriculum p. 59)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 1: Care este rolul instrucțiunii using namespace std; la începutul unui program C++ conform manualului?'
                : 'Requirement 1: What is the purpose of using namespace std; at the top of a C++ source file according to the curriculum?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 59: Spațiul de nume (namespace) grupează identificatorii din biblioteca standard C++. Fără această linie, ar trebui să scrii std::cout și std::cin la fiecare utilizare."
              hintEn="Curriculum p. 59: Namespaces encapsulate standard library symbols. Without it, you must prefix every stream call with std::cout and std::cin."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Oprește calculatorul în caz de eroare gravă',
                labelEn: 'A. Shuts down the PC in case of fatal error'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Permite utilizarea directă a identificatorilor standard (cin, cout, endl) fără a fi necesară prefixarea lor cu std::',
                labelEn: 'B. Enables direct usage of standard stream keywords (cin, cout, endl) without typing std:: every time'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Traduce programul în limba română',
                labelEn: 'C. Translates program keywords into Romanian'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Desenează o fereastră grafică 3D pe ecran',
                labelEn: 'D. Draws a 3D window on screen'
              }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Corect! Instrucțiunea `using namespace std;` specifică faptul că folosim spațiul de nume standard, scutindu-ne de scrierea repetitivă a prefixului `std::` înainte de `cout`, `cin` sau `endl`.'
                  : 'Correct! The directive brings the standard namespace into current scope, allowing concise calls to cout, cin, and endl without repetitive prefixes.'
              }
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 2: Ce se întâmplă dacă omiți punctul și virgula (;) de la sfârșitul unei instrucțiuni C++ (de exemplu după cout << "Salut")?'
                : 'Requirement 2: What happens if you omit the semicolon (;) at the end of a C++ statement (such as after cout << "Hello")?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 59: Punctul și virgula este delimitatorul obligatoriu al instrucțiunilor în C++. Compilatorul analizează textul și nu poate determina unde se termină comanda curentă."
              hintEn="Curriculum p. 59: Semicolons are mandatory statement terminators in C++. Without it, the compiler parser cannot identify where one command ends and the next begins."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Compilatorul raportează o eroare de sintaxă (expected \';\' before...) și refuză generarea fișierului executabil',
                labelEn: 'A. The compiler emits a syntax error (expected \';\' before...) and halts build execution'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Programul se execută mai repede cu 5 secunde',
                labelEn: 'B. The executable runs 5 seconds faster'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Calculatorul adaugă automat un punct și virgulă fără să te anunțe',
                labelEn: 'C. The OS automatically injects a semicolon silently'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Se va afișa textul inversat pe monitor',
                labelEn: 'D. The string text prints backwards'
              }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_a')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Excelent! În limbajul C++, fiecare instrucțiune simplă trebuie delimitată prin `;`. Dacă lipsește, compilatorul semnalează eroare de sintaxă și întrerupe procesul de compilare.'
                  : 'Excellent! In C++, every simple statement must be terminated with a `;`. Missing semicolons halt lexical parsing and abort the compilation pipeline.'
              }
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={1}
        totalLevels={7}
        isCompleted={canProceed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel={
          lang === 'ro'
            ? 'Continuă cu Lecția 2: Tipuri de Date & Reprezentarea în Memorie'
            : 'Continue to Lesson 2: Data Types & Memory Representation'
        }
      />
    </div>
  );
};
