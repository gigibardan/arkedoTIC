import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  ShieldCheck,
  Check,
  QrCode,
  GraduationCap,
  Calendar,
  BookOpen
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
  studentName?: string;
}

interface Question {
  id: string;
  question: string;
  codeSnippet?: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'Care este ordinea corectă de execuție a celor 3 elemente din antetul buclei for (int i = 1; i <= n; i++) la prima iterație?',
    codeSnippet: 'for (int i = 1; i <= n; i++) {\n    cout << i;\n}',
    options: [
      { text: '1. Inițializare (i=1) -> 2. Test condiție (i<=n) -> 3. Corpul buclei -> 4. Pasul de incrementare (i++)', isCorrect: true },
      { text: '1. Pasul de incrementare (i++) -> 2. Inițializare -> 3. Condiție', isCorrect: false },
      { text: '1. Corpul buclei -> 2. Condiția -> 3. Inițializarea', isCorrect: false },
      { text: 'Toate cele 3 se execută simultan în paralel', isCorrect: false }
    ],
    explanation: 'Inițializarea se execută o singură dată la intrare, apoi se testează condiția, se rulează instrucțiunile, iar la sfârșitul pasului se face incrementarea i++.'
  },
  {
    id: 'q2',
    question: 'De ce este obligatoriu semnul punct și virgulă (;) după condiția buclei do { ... } while (cond); ?',
    codeSnippet: 'do {\n    cin >> nota;\n} while (nota < 1 || nota > 10); // Obligatoriu punct si virgula!',
    options: [
      { text: 'Pentru că marchează finalul instrucțiunii compuse do-while în gramatica limbajului C++', isCorrect: true },
      { text: 'Pentru a șterge ecranul consolei', isCorrect: false },
      { text: 'Este doar o sugestie, programul compilează și fără el', isCorrect: false },
      { text: 'Pentru a converti numărul în zecimal', isCorrect: false }
    ],
    explanation: 'Spre deosebire de for și while unde acoladele urmează după condiție, la do-while acoladele sunt înainte, iar condiția finală reprezintă sfârșitul comenzii (de aceea cere punct și virgulă).'
  },
  {
    id: 'q3',
    question: 'Care este cel mai eficient interval în care căutăm divizorii proprii ai unui număr natural n?',
    codeSnippet: 'for (int d = 2; d <= n / 2; d++) {\n    if (n % d == 0) cout << d << " ";\n}',
    options: [
      { text: 'De la d = 2 până la n / 2 (jumătatea numărului)', isCorrect: true },
      { text: 'De la d = 1 până la 100.000', isCorrect: false },
      { text: 'De la d = n până la 2 * n', isCorrect: false },
      { text: 'Numai numerele impare', isCorrect: false }
    ],
    explanation: 'Niciun număr n nu poate avea un divizor propriu strict mai mare decât n / 2 (ex: pentru 50, cel mai mare divizor propriu este 25).'
  },
  {
    id: 'q4',
    question: 'Numărul 28 este un „Număr Perfect” (pag. 89). Care este motivul matematic?',
    codeSnippet: '// Divizorii proprii ai lui 28 sunt: 1, 2, 4, 7, 14',
    options: [
      { text: 'Suma divizorilor săi proprii este exact egală cu numărul: 1 + 2 + 4 + 7 + 14 = 28', isCorrect: true },
      { text: 'Are doar cifre pare', isCorrect: false },
      { text: 'Este divizibil cu 10', isCorrect: false },
      { text: 'Este cel mai mare număr prim din manual', isCorrect: false }
    ],
    explanation: 'Prin definiție, un număr este perfect dacă este egal cu suma divizorilor săi stricți (fără el însuși): 1 + 2 + 4 + 7 + 14 = 28.'
  },
  {
    id: 'q5',
    question: 'În laboratorul de fizică (pag. 97), cum calculăm forța de frecare la mișcarea unei sănii pe zăpadă?',
    codeSnippet: 'double Ff = mu * m * 9.8;',
    options: [
      { text: 'Ff = μ · m · g (unde μ este coeficientul de frecare, m este masa în kg, iar g = 9.8 N/kg)', isCorrect: true },
      { text: 'Ff = m / μ + 9.8', isCorrect: false },
      { text: 'Ff = m · d / t', isCorrect: false },
      { text: 'Ff = viteza · timpul', isCorrect: false }
    ],
    explanation: 'Forța de frecare la alunecare pe suprafață orizontală este Ff = μ * Greutate = μ * m * g.'
  },
  {
    id: 'q6',
    question: 'Dacă temperatura minimă a fost de -10°C, iar maxima a fost de +25°C, cât este amplitudinea termică anuală?',
    codeSnippet: 'double amp = T_max - T_min;',
    options: [
      { text: '35°C (25 - (-10) = 35°C)', isCorrect: true },
      { text: '15°C (25 - 10)', isCorrect: false },
      { text: '-35°C', isCorrect: false },
      { text: '250°C', isCorrect: false }
    ],
    explanation: 'Ecartul termic este diferența dintre maximă și minimă: 25 - (-10) = 35°C.'
  }
];

export const StemLevel7_EvaluationAndCertificate: React.FC<Props> = ({ onPass, studentName }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitExam = () => {
    // Verify all answered
    if (Object.keys(selectedAnswers).length < EVALUATION_QUESTIONS.length) {
      sounds.playWrong();
      alert('Te rugăm să răspunzi la toate cele 6 întrebări înainte de evaluare!');
      return;
    }

    let correctCount = 0;
    EVALUATION_QUESTIONS.forEach(q => {
      const pickedIdx = selectedAnswers[q.id];
      if (pickedIdx !== undefined && q.options[pickedIdx].isCorrect) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / EVALUATION_QUESTIONS.length) * 100);
    setCalculatedScore(finalScore);
    setIsSubmitted(true);

    if (finalScore >= 70) {
      sounds.playSuccess();
      onPass(finalScore);
    } else {
      sounds.playWrong();
    }
  };

  const handleResetExam = () => {
    sounds.playClick();
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCalculatedScore(0);
  };

  const handlePrintCertificate = () => {
    sounds.playClick();
    window.print();
  };

  const isPassed = isSubmitted && calculatedScore >= 70;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900/80 via-blue-900/80 to-slate-900 p-6 rounded-3xl border border-cyan-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30 mb-2">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nivelul 7 din 7 • Evaluare Finală &amp; Certificare</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Test Sumativ STEM &amp; Diploma Oficială C++
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Dovedește că stăpânești buclele <span className="text-cyan-300 font-mono font-bold">for</span> și <span className="text-teal-300 font-mono font-bold">do-while</span>, algoritmii pe divizori și aplicarea formulelor din Fizică și Geografie în C++.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>100 Puncte</span>
            </span>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="flex flex-col gap-5">
        {EVALUATION_QUESTIONS.map((q, qIndex) => {
          const selectedIdx = selectedAnswers[q.id];
          return (
            <div
              key={q.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Întrebarea {qIndex + 1} din {EVALUATION_QUESTIONS.length}
                </span>
                {isSubmitted && (
                  <span className={`text-xs font-mono font-bold flex items-center gap-1 ${q.options[selectedIdx]?.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {q.options[selectedIdx]?.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>{q.options[selectedIdx]?.isCorrect ? 'Corect (+17 pct)' : 'Incorect (0 pct)'}</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-relaxed">
                {q.question}
              </h3>

              {q.codeSnippet && (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono text-xs text-cyan-300 mb-4 whitespace-pre">
                  {q.codeSnippet}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, optIndex) => {
                  const isPicked = selectedIdx === optIndex;
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`p-3.5 rounded-2xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isPicked
                          ? isSubmitted
                            ? opt.isCorrect
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/60 border-rose-500 text-rose-200'
                            : 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md'
                          : isSubmitted && opt.isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950/60 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isPicked && (
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-cyan-300" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-800 text-xs text-slate-400 leading-relaxed font-sans">
                  <strong className="text-slate-300">Explicație: </strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {!isSubmitted ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="text-xs text-slate-400 font-mono">
            Răspunsuri completate:{' '}
            <strong className="text-cyan-300">
              {Object.keys(selectedAnswers).length} / {EVALUATION_QUESTIONS.length}
            </strong>
          </div>
          <button
            type="button"
            onClick={handleSubmitExam}
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-sm transition shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95"
          >
            Finalizează Evaluarea &amp; Vezi Diploma
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Results Bar */}
          <div className={`w-full p-6 rounded-3xl border text-center flex flex-col items-center gap-2 ${isPassed ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-rose-950/40 border-rose-500/40'}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Rezultat Evaluare Sumativă
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white">
              Nota {calculatedScore >= 95 ? '10' : calculatedScore >= 80 ? '9' : calculatedScore >= 70 ? '8' : 'Sub 7'} ({calculatedScore} Puncte)
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              {isPassed
                ? 'Felicitări! Ai promovat cu succes Modulul 4E: Bucle for, do-while & Aplicații STEM!'
                : 'Scorul este sub 70%. Poți reîncerca testul pentru a obține diploma de merit!'}
            </p>
            {!isPassed && (
              <button
                type="button"
                onClick={handleResetExam}
                className="mt-3 py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reia Testul</span>
              </button>
            )}
          </div>

          {/* Official Printable Diploma */}
          {isPassed && (
            <div className="w-full flex flex-col items-center gap-4">
              <div
                id="diploma-stem-grade7"
                className="w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-400/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center text-slate-200"
              >
                {/* Gold ornament border styling */}
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-400/30 rounded-2xl pointer-events-none" />

                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 text-3xl shadow-lg">
                    🎓
                  </div>

                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    MINISTERUL EDUCAȚIEI • PROGRAMA NAȚIONALĂ OMEN 3393/2017 &amp; OM 5420/2024
                  </span>

                  <h2 className="text-xl sm:text-3xl font-black text-white font-serif tracking-tight mt-1">
                    DIPLOMĂ DE MERIT STEM &amp; PROGRAMARE C++
                  </h2>

                  <p className="text-xs text-slate-400 max-w-lg italic font-serif">
                    Se acordă elevului / elevei
                  </p>

                  <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-mono py-1 border-b-2 border-amber-400/40 min-w-[240px]">
                    {studentName?.trim() || 'Elev Clasa a VII-a'}
                  </div>

                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed mt-2">
                    Pentru absolvirea cu succes a <strong>Modulului 4E: Bucle for, do-while &amp; Aplicații Interdisciplinare STEM</strong> (Manual pag. 86–102). A demonstrat competențe avansate în structuri repetitive, determinarea divizorilor, numere prime, modele grafice ASCII și rezolvarea de probleme practice din Fizică și Geografie.
                  </p>

                  {/* Badges & Seal Row */}
                  <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-6 pt-6 border-t border-slate-800 text-center">
                    <div className="flex flex-col items-center">
                      <GraduationCap className="w-5 h-5 text-cyan-400 mb-1" />
                      <span className="text-[10px] font-mono uppercase text-slate-400">Disciplina</span>
                      <strong className="text-xs font-mono text-white">Informatică &amp; TIC</strong>
                    </div>

                    <div className="flex flex-col items-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                      <span className="text-[10px] font-mono uppercase text-slate-400">Punctaj Obținut</span>
                      <strong className="text-xs font-mono text-emerald-300">{calculatedScore} / 100 Pct</strong>
                    </div>

                    <div className="flex flex-col items-center">
                      <Calendar className="w-5 h-5 text-amber-400 mb-1" />
                      <span className="text-[10px] font-mono uppercase text-slate-400">An Școlar</span>
                      <strong className="text-xs font-mono text-white">2025–2026</strong>
                    </div>
                  </div>

                  {/* Digital Signature & Stamp */}
                  <div className="flex items-center justify-between w-full max-w-lg mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono">
                    <div className="flex flex-col items-start text-left">
                      <span className="text-slate-500">Certificat Verificat:</span>
                      <span className="text-amber-400 font-bold">ARK3DO-STEM-G7-PASS</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <QrCode className="w-8 h-8 text-cyan-400 opacity-80" />
                      <div className="w-10 h-10 rounded-full border border-amber-400/50 bg-amber-500/10 flex items-center justify-center text-[8px] font-mono text-amber-300 font-bold rotate-[-12deg]">
                        OFICIAL
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Printează Diploma / Salvează PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
