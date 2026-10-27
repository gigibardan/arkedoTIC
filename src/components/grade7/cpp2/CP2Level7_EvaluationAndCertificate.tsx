import React, { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, Printer, Share2, Sparkles, BookOpen, Check, X, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
  studentName?: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'Care este rolul operatorului >> în instrucțiunea cin >> x;?',
    options: [
      'Inserează textul pe ecranul consolei',
      'Extrage datele introduse de utilizator de la tastatură și le stochează în variabila x',
      'Compară dacă cin este mai mare strict decât x',
      'Șterge conținutul variabilei x din memorie'
    ],
    correctIdx: 1,
    explanation: 'Operatorul >> este operatorul de extracție din fluxul de intrare (cin) și direcționează datele de la tastatură înspre variabila din memorie.'
  },
  {
    id: 'q2',
    question: 'Într-un algoritm liniar simplu, care este ordinea logică corectă a celor 4 pași?',
    options: [
      'Afișare -> Calcul -> Citire -> Declarare',
      'Calcul -> Declarare -> Afișare -> Citire',
      'Declarare variabile -> Citire date intrare -> Calcul / Prelucrare -> Afișare rezultate',
      'Citire -> Afișare -> Declarare -> Calcul'
    ],
    correctIdx: 2,
    explanation: 'În structura liniară ordinea este strictă: întâi rezervăm memorie (declarare), apoi cerem date utilizatorului (citire), efectuăm calculele, iar la final tipărim rezultatul (afișare).'
  },
  {
    id: 'q3',
    question: 'Dacă executăm în C++ expresia 23 / 4, ce valoare obținem (ambele fiind de tip int)?',
    options: [
      '5.75',
      '5 (câtul împărțirii întregi)',
      '3 (restul împărțirii întregi)',
      'Eroare de compilare'
    ],
    correctIdx: 1,
    explanation: '23 / 4 între două numere întregi reprezintă câtul întreg: 23 = 4 * 5 + 3. Câtul este 5.'
  },
  {
    id: 'q4',
    question: 'Ce valoare returnează expresia 23 % 4 în C++?',
    options: [
      '5',
      '3 (restul împărțirii)',
      '23%',
      '0'
    ],
    correctIdx: 1,
    explanation: 'Operatorul modulo (%) returnează restul împărțirii întregi. 23 împărțit la 4 dă restul 3.'
  },
  {
    id: 'q5',
    question: 'Ce se întâmplă dacă încercăm să inversăm două variabile folosind instrucțiunile a = b; b = a;?',
    options: [
      'Variabilele își schimbă valorile fără probleme',
      'Valoarea inițială a lui a este suprascrisă și pierdută la primul pas, iar ambele variabile vor avea valoarea lui b',
      'Compilatorul C++ inversează automat variabilele în fundal',
      'Valoarea lui b devine 0'
    ],
    correctIdx: 1,
    explanation: 'La a = b, memoria lui a primește valoarea din b, ștergând ireversibil vechea valoare a lui a. Apoi b = a doar recopiază aceeași valoare a lui b.'
  },
  {
    id: 'q6',
    question: 'Care este succesiunea corectă a instrucțiunilor pentru Regula celor 3 Pahare (folosind variabila auxiliară aux)?',
    options: [
      'a = b; b = aux; aux = a;',
      'aux = a; a = b; b = aux;',
      'b = a; aux = b; a = aux;',
      'aux = b; b = aux; a = b;'
    ],
    correctIdx: 1,
    explanation: 'Ordinea de aur a interschimbării: 1) Salvăm a în aux (aux = a); 2) Copiem b în a (a = b); 3) Transferăm valoarea salvată în b (b = aux).'
  }
];

export const CP2Level7_EvaluationAndCertificate: React.FC<Props> = ({ onPass, studentName = 'Elev Clasa a VII-a' }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    sounds.playClick();
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitEvaluation = () => {
    sounds.playClick();
    let correctCount = 0;
    EVALUATION_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctIdx) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / EVALUATION_QUESTIONS.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);

    if (calculatedScore >= 70) {
      sounds.playLevelUp();
    } else {
      sounds.playError();
    }
  };

  const handleRetake = () => {
    sounds.playClick();
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handlePrintCertificate = () => {
    sounds.playClick();
    window.print();
  };

  const handleFinalFinish = () => {
    sounds.playLevelUp();
    onPass(score);
  };

  const isPassed = isSubmitted && score >= 70;
  const allAnswered = EVALUATION_QUESTIONS.every(q => userAnswers[q.id] !== undefined);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Nivelul 7 • Evaluare Finală Misiunea 4B</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Test de Sinteză &amp; <span className="text-violet-400 font-mono">Certificare C++</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Demonstrează că stăpânești fluxurile <code className="text-indigo-300 font-mono">cin/cout</code>, structura liniară de execuție, operatorii cât &amp; rest, și celebra <strong>Regulă a celor 3 Pahare</strong>.
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-violet-500/20">
            <span className="text-xs text-slate-400 font-mono">Condiție Promovare</span>
            <span className="text-sm font-bold text-violet-300 font-mono">Minim 70% (5/6 corecte)</span>
          </div>
        </div>
      </div>

      {/* Quiz Form */}
      {!isPassed ? (
        <div className="bg-slate-900/95 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-6">
            {EVALUATION_QUESTIONS.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctIdx;

              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/40 text-violet-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug">
                      {q.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 ml-0 sm:ml-9">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let optionStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300';

                      if (isSubmitted) {
                        if (optIdx === q.correctIdx) {
                          optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        } else {
                          optionStyle = 'bg-slate-950 border-slate-850 text-slate-500 opacity-60';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-violet-950/80 border-violet-500 text-violet-200 ring-2 ring-violet-500/30';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          disabled={isSubmitted}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && optIdx === q.correctIdx && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                          {isSubmitted && isSelected && !isCorrect && (
                            <X className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="mt-3 ml-0 sm:ml-9 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      💡 <strong>Explicație:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission and Result Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitEvaluation}
                disabled={!allAnswered}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-violet-900/30"
              >
                Trimite Răspunsurile &amp; Calculează Nota
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-white">
                  Punctaj obținut: <span className={score >= 70 ? 'text-emerald-400' : 'text-rose-400'}>{score}%</span>
                </div>
                {score < 70 && (
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reîncearcă Testul</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* OFFICIAL CERTIFICATE SCREEN */
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 border-4 border-amber-500/60 p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center">
            {/* Corner Ornamental Accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400" />

            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 p-1 shadow-xl shadow-amber-500/20 mb-4 flex items-center justify-center text-slate-950">
              <Award className="w-12 h-12" />
            </div>

            <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold mb-1">
              Ministerul Educației • Programa Școlară Națională OMEN 3393/2017 &amp; OM 5420/2024
            </span>
            <span className="text-xs text-slate-400 font-mono mb-4">
              Platforma Educațională Interactivă Ark3do C++ Academy
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-wide mb-2">
              CERTIFICAT DE ABSOLVIRE
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6" />

            <p className="text-xs sm:text-sm text-slate-300 font-mono mb-2">Se conferă cu felicitări elevului / elevei:</p>
            <div className="text-xl sm:text-3xl font-extrabold text-amber-300 font-serif mb-4 px-6 py-2 border-b-2 border-amber-500/40">
              {studentName}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed mb-6">
              pentru parcurgerea cu brio a <strong>Misiunii 4B: Structura Liniară, cin/cout &amp; Regula celor 3 Pahare (swap)</strong>, dobândind competențe avansate în organizarea secvențială a algoritmilor, calculul expresiilor aritmetice și manipularea celulelor de memorie RAM în limbajul C++.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg mb-8 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Punctaj Evaluare:</span>
                <span className="text-emerald-400 font-bold text-sm">{score}% (Excelent)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Nivel Disciplină:</span>
                <span className="text-cyan-400 font-bold text-sm">Clasa a VII-a</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">Statut Certificat:</span>
                <span className="text-amber-400 font-bold text-sm">Verificat &amp; Valid</span>
              </div>
            </div>

            {/* Seal & Signature Row */}
            <div className="flex items-center justify-between w-full max-w-md pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
              <div className="text-left">
                <span className="text-amber-400 font-bold block">Prof. Mentor Arky</span>
                <span>Asistent Algoritmic AI</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-amber-500/50 flex items-center justify-center text-[10px] text-amber-400 font-bold text-center">
                ARK3DO<br />SEAL
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-bold block">Informatica &amp; TIC</span>
                <span>Clasa a VII-a • C++</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-xs font-bold flex items-center gap-2 border border-slate-700 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Printează / Salvează PDF</span>
            </button>

            <button
              type="button"
              onClick={handleFinalFinish}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer transition"
            >
              <span>Finalizează Misiunea 4B &amp; Revino la Catalog</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
