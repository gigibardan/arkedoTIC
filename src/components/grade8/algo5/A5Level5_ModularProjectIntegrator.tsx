import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  GraduationCap,
  Layers,
  Check,
  Award,
  ChevronRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A5Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface StudentGrade {
  id: number;
  nume: string;
  nota: number;
}

export const A5Level5_ModularProjectIntegrator: React.FC<A5Level5Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();

  const [students, setStudents] = useState<StudentGrade[]>([
    { id: 1, nume: 'Andrei Popa', nota: 8 },
    { id: 2, nume: 'Elena Dobre', nota: 10 },
    { id: 3, nume: 'Mihai Radu', nota: 4 },
    { id: 4, nume: 'Ioana Stan', nota: 9 },
    { id: 5, nume: 'Cristian Enache', nota: 7 },
    { id: 6, nume: 'Daria Munteanu', nota: 6 }
  ]);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'modular' | 'monolithic'>('modular');

  // Stats computed by modular functions
  const [stats, setStats] = useState<{
    medie: number;
    maxNota: number;
    corigenti: number;
    isSorted: boolean;
  }>({
    medie: 7.33,
    maxNota: 10,
    corigenti: 1,
    isSorted: false
  });

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const pipelineSteps = [
    {
      id: 1,
      title: '1. citireNote(note, n)',
      descRo: 'Citește numărul de elevi și vectorul de note',
      descEn: 'Reads student count and grades array',
      snippet: 'void citireNote(int v[], int &n)'
    },
    {
      id: 2,
      title: '2. calculMedie(note, n)',
      descRo: 'Calculează media aritmetică a clasei',
      descEn: 'Calculates class arithmetic average',
      snippet: 'double calculMedie(int v[], int n)'
    },
    {
      id: 3,
      title: '3. notaMaxima(note, n)',
      descRo: 'Identifică cea mai mare notă obținută',
      descEn: 'Identifies highest grade achieved',
      snippet: 'int notaMaxima(int v[], int n)'
    },
    {
      id: 4,
      title: '4. numarCorigenti(note, n)',
      descRo: 'Numără elevii cu nota sub 5',
      descEn: 'Counts students with grade below 5',
      snippet: 'int numarCorigenti(int v[], int n)'
    },
    {
      id: 5,
      title: '5. sortareNote(note, n)',
      descRo: 'Sortează catalogul descrescător după performanță',
      descEn: 'Sorts gradebook in descending order',
      snippet: 'void sortareDescrescatoare(int v[], int n)'
    }
  ];

  const handleRunStep = (stepIdx: number) => {
    sounds.playClick();
    setActiveStep(stepIdx);

    if (stepIdx === 1) {
      setPipelineLogs((prev) => [
        ...prev,
        lang === 'ro'
          ? `[Step 1] citireNote(): S-au încărcat ${students.length} înregistrări în vectorul note[].`
          : `[Step 1] readGrades(): Loaded ${students.length} records into grades[] array.`
      ]);
    } else if (stepIdx === 2) {
      const sum = students.reduce((acc, curr) => acc + curr.nota, 0);
      const avg = Number((sum / students.length).toFixed(2));
      setStats((prev) => ({ ...prev, medie: avg }));
      setPipelineLogs((prev) => [
        ...prev,
        lang === 'ro'
          ? `[Step 2] calculMedie(): Suma notelor = ${sum}, Media generală a clasei = ${avg}.`
          : `[Step 2] calcAverage(): Sum of grades = ${sum}, Class overall average = ${avg}.`
      ]);
    } else if (stepIdx === 3) {
      const mx = Math.max(...students.map((s) => s.nota));
      setStats((prev) => ({ ...prev, maxNota: mx }));
      setPipelineLogs((prev) => [
        ...prev,
        lang === 'ro'
          ? `[Step 3] notaMaxima(): Nota maximă găsită în vector este ${mx}.`
          : `[Step 3] maxGrade(): Highest grade found in array is ${mx}.`
      ]);
    } else if (stepIdx === 4) {
      const cor = students.filter((s) => s.nota < 5).length;
      setStats((prev) => ({ ...prev, corigenti: cor }));
      setPipelineLogs((prev) => [
        ...prev,
        lang === 'ro'
          ? `[Step 4] numarCorigenti(): S-au identificat ${cor} elevi corigenți (nota < 5).`
          : `[Step 4] countFailing(): Identified ${cor} failing students (grade < 5).`
      ]);
    } else if (stepIdx === 5) {
      const sorted = [...students].sort((a, b) => b.nota - a.nota);
      setStudents(sorted);
      setStats((prev) => ({ ...prev, isSorted: true }));
      setPipelineLogs((prev) => [
        ...prev,
        lang === 'ro'
          ? `[Step 5] sortareDescrescatoare(): Catalogul a fost ordonat descrescător după medii!`
          : `[Step 5] sortDescending(): Gradebook sorted in descending order of grades!`
      ]);
    }
  };

  const handleRunFullPipeline = () => {
    sounds.playClick();
    const sum = students.reduce((acc, curr) => acc + curr.nota, 0);
    const avg = Number((sum / students.length).toFixed(2));
    const mx = Math.max(...students.map((s) => s.nota));
    const cor = students.filter((s) => s.nota < 5).length;
    const sorted = [...students].sort((a, b) => b.nota - a.nota);

    setStudents(sorted);
    setStats({
      medie: avg,
      maxNota: mx,
      corigenti: cor,
      isSorted: true
    });
    setActiveStep(5);

    if (lang === 'ro') {
      setPipelineLogs([
        `=== EXECUTIE PIPELINE MODULAR INTEGRATOR ===`,
        `[main()] -> citireNote(note, n); // S-au încărcat ${students.length} elevi`,
        `[main()] -> medie = calculMedie(note, n); // Media: ${avg}`,
        `[main()] -> max = notaMaxima(note, n); // Nota maximă: ${mx}`,
        `[main()] -> corig = numarCorigenti(note, n); // Corigenți: ${cor}`,
        `[main()] -> sortareDescrescatoare(note, n); // Catalog ordonat cu succes!`,
        `=== PIPELINE FINALIZAT: COD CURAT, FĂRĂ LINII REDUNDANTE ===`
      ]);
    } else {
      setPipelineLogs([
        `=== MODULAR INTEGRATOR PIPELINE EXECUTION ===`,
        `[main()] -> readGrades(grades, n); // Loaded ${students.length} students`,
        `[main()] -> average = calcAverage(grades, n); // Average: ${avg}`,
        `[main()] -> max = maxGrade(grades, n); // Highest grade: ${mx}`,
        `[main()] -> failing = countFailing(grades, n); // Failing count: ${cor}`,
        `[main()] -> sortDescending(grades, n); // Gradebook sorted successfully!`,
        `=== PIPELINE COMPLETED: CLEAN ARCHITECTURE, ZERO REDUNDANCY ===`
      ]);
    }
  };

  const isCompleted =
    activeStep >= 5 &&
    q1Answer === 'main_curat' &&
    q2Answer === 'modular_reducere';

  const handleFinish = () => {
    if (!isCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-purple-400 font-semibold">
                {lang === 'ro' ? 'Nivelul 5 • Unitatea 3 (Manual pag. 87–88)' : 'Level 5 • Unit 3 (Textbook pp. 87–88)'}
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {lang === 'ro' ? 'Proiect Integrator C++: Catalogul Școlar Modular' : 'C++ Integrator Project: Modular School Gradebook'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/40 border border-purple-700/50 rounded-lg text-purple-300 text-sm font-mono">
            <span>{lang === 'ro' ? 'Arhitectură de Sistem C++' : 'C++ System Architecture'}</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          {lang === 'ro' ? (
            <>
              Punctul culminant al programării de clasa a VIII-a: integrarea tuturor conceptelor (vectori, decizii,
              bucle, căutare și sortare) într-un <strong>proiect modular complet</strong>. Funcția <code>main()</code> devine
              un dirijor elegant de orchestră, apelând subprograme dedicate.
            </>
          ) : (
            <>
              The capstone of 8th grade computer science: integrating all core concepts (arrays, decisions,
              loops, searching, and sorting) into a <strong>complete modular project</strong>. The <code>main()</code> function becomes
              an elegant conductor, coordinating specialized subprograms.
            </>
          )}
        </p>
      </div>

      {/* Code Architecture Switcher */}
      <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
        <span className="text-xs font-mono text-slate-400">
          {lang === 'ro' ? 'Comparație Arhitecturală de Cod:' : 'Code Architecture Comparison:'}
        </span>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setViewMode('modular');
              sounds.playClick();
            }}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'modular'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ro' ? 'Cod Modular (Clean C++)' : 'Modular Code (Clean C++)'}
          </button>
          <button
            onClick={() => {
              setViewMode('monolithic');
              sounds.playClick();
            }}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'monolithic'
                ? 'bg-rose-700 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ro' ? 'Cod Monolitic (Spaghetti)' : 'Monolithic Code (Spaghetti)'}
          </button>
        </div>
      </div>

      {/* Code Comparison Banner */}
      {viewMode === 'monolithic' ? (
        <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-4 font-mono text-xs text-rose-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {lang === 'ro'
                ? 'Anti-Pattern: Cod Monolitic într-un singur main() gigantic'
                : 'Anti-Pattern: Monolithic Code in a single gigantic main()'}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {lang === 'ro'
              ? 'Peste 100 de linii într-o singură funcție! Dacă apare un bug la calculul mediei sau sortare, trebuie recitit tot fișierul. Greu de testat, imposibil de refolosit într-un alt proiect.'
              : 'Over 100 lines inside a single function! If a bug occurs in average calculation or sorting, the entire file must be re-read. Hard to test, impossible to reuse in another project.'}
          </p>
        </div>
      ) : (
        <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4 font-mono text-xs text-purple-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'ro'
                ? 'Best Practice: Funcția main() devine un pipeline limpede'
                : 'Best Practice: The main() function becomes a clean pipeline'}
            </span>
          </div>
          <pre className="text-slate-300 text-[11px] overflow-x-auto">
{`int main() {
    citireNote(note, n);
    cout << "Medie clasa: " << calculMedie(note, n);
    cout << "Nota maxima: " << notaMaxima(note, n);
    sortareDescrescatoare(note, n);
    afisareNote(note, n);
    return 0;
}`}
          </pre>
        </div>
      )}

      {/* Interactive Pipeline & Gradebook Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pipeline steps */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-semibold text-purple-300 uppercase tracking-wider">
                {lang === 'ro' ? 'Etape Pipeline Subprograme' : 'Subprograms Pipeline Steps'}
              </span>
              <button
                onClick={handleRunFullPipeline}
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-mono font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {lang === 'ro' ? 'Rulează Tot Pipeline-ul' : 'Run Full Pipeline'}
              </button>
            </div>

            <div className="space-y-2">
              {pipelineSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => handleRunStep(step.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    activeStep === step.id
                      ? 'bg-purple-950/60 border-purple-400 text-white shadow-md'
                      : activeStep > step.id
                      ? 'bg-slate-950/60 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">
                      {step.title}
                    </span>
                    {activeStep >= step.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'ro' ? step.descRo : step.descEn}
                  </div>
                  <div className="text-[10px] font-mono text-purple-400 mt-1">
                    <code>{step.snippet}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Console / Pipeline logs */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>{lang === 'ro' ? 'Consola de Execuție main()' : 'main() Execution Console'}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800/80 font-mono text-xs space-y-1 max-h-[140px] overflow-y-auto">
              {pipelineLogs.length === 0 ? (
                <div className="text-slate-500 italic">
                  {lang === 'ro'
                    ? 'Apasă pe oricare etapă sau "Rulează Tot Pipeline-ul".'
                    : 'Click any step or "Run Full Pipeline".'}
                </div>
              ) : (
                pipelineLogs.map((log, idx) => (
                  <div key={idx} className="text-purple-300 text-[11px]">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Gradebook & Statistics */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-semibold">
                <GraduationCap className="w-5 h-5" />
                <span>{lang === 'ro' ? 'Catalogul Clasei a VIII-a' : 'Grade 8 Student Gradebook'}</span>
              </div>
              {stats.isSorted && (
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {lang === 'ro' ? 'Sortat descrescător' : 'Sorted descending'}
                </span>
              )}
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">{lang === 'ro' ? 'Nume Elev' : 'Student Name'}</th>
                    <th className="py-2 px-3 text-right">{lang === 'ro' ? 'Notă C++' : 'C++ Grade'}</th>
                    <th className="py-2 px-3 text-right">{lang === 'ro' ? 'Statut' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map((st, idx) => (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        st.nota === stats.maxNota
                          ? 'bg-purple-950/20 text-purple-200'
                          : st.nota < 5
                          ? 'bg-rose-950/20 text-rose-200'
                          : 'text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold">{st.nume}</td>
                      <td className="py-2 px-3 text-right font-bold text-sm">
                        {st.nota}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {st.nota === 10 ? (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                            {lang === 'ro' ? 'Premiant' : 'Top Student'}
                          </span>
                        ) : st.nota >= 5 ? (
                          <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-mono">
                            {lang === 'ro' ? 'Promovat' : 'Passed'}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-mono font-bold">
                            {lang === 'ro' ? 'Corigent' : 'Failing'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Computed KPI Cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">
                  {lang === 'ro' ? 'Media Clasei' : 'Class Average'}
                </span>
                <span className="text-xl font-bold font-mono text-purple-400">
                  {stats.medie}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">
                  {lang === 'ro' ? 'Nota Maximă' : 'Highest Grade'}
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {stats.maxNota}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">
                  {lang === 'ro' ? 'Corigenți (<5)' : 'Failing (<5)'}
                </span>
                <span className="text-xl font-bold font-mono text-rose-400">
                  {stats.corigenti}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Check Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>{lang === 'ro' ? 'Verificare Înțelegere Arhitectură (Manual pag. 88)' : 'Architecture Checkpoint (Textbook p. 88)'}</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                {lang === 'ro'
                  ? '1. Ce rol are funcția main() într-o aplicație C++ modulară proiectată corect?'
                  : '1. What is the role of main() in a properly architected modular C++ program?'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'main_curat',
                    textRo: 'Coordonează fluxul programului, apelând pe rând subprogramele specializate.',
                    textEn: 'Coordinates program flow, invoking specialized subprograms in sequence.'
                  },
                  {
                    id: 'main_spaghetti',
                    textRo: 'Trebuie să conțină toți algoritmii scriși cap-coadă fără nicio altă funcție.',
                    textEn: 'Must contain all algorithms written end-to-end without any external functions.'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ1Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q1Answer === opt.id
                        ? opt.id === 'main_curat'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lang === 'ro' ? opt.textRo : opt.textEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <p className="text-slate-300 font-medium">
                {lang === 'ro'
                  ? '2. Dacă dorim să schimbăm algoritmul de sortare (de ex. din Bubble Sort în Selection Sort), ce modificăm într-un proiect modular?'
                  : '2. If we want to replace the sorting algorithm (e.g. from Bubble Sort to Selection Sort), what is modified in a modular project?'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'modular_reducere',
                    textRo: 'Modificăm doar corpul funcției sortareNote(), restul programului și main() rămânând intacte.',
                    textEn: 'We modify only the body of sortGrades(), leaving main() and the rest of the code intact.'
                  },
                  {
                    id: 'tot_codul',
                    textRo: 'Trebuie să rescriem complet de la zero întreg programul.',
                    textEn: 'We must rewrite the entire program from scratch.'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ2Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q2Answer === opt.id
                        ? opt.id === 'modular_reducere'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lang === 'ro' ? opt.textRo : opt.textEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isCompleted
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isCompleted
                ? lang === 'ro'
                  ? 'Proiectul Integrator Finalizat cu Succes!'
                  : 'Integrator Project Completed Successfully!'
                : lang === 'ro'
                ? 'Cerințe: Parcurge pipeline-ul complet (sau apasă Rulează Tot) și răspunde corect la întrebări.'
                : 'Requirements: Run the complete pipeline (or click Run Full Pipeline) and answer both questions.'}
            </div>
            <div className="text-xs text-slate-400">
              {lang === 'ro'
                ? 'Recompensă: +150 puncte XP și deblocarea Clinicii de Depanare (Nivelul 6).'
                : 'Reward: +150 XP points and unlock the Debugging Clinic (Level 6).'}
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isCompleted
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-lg shadow-purple-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>{lang === 'ro' ? 'Continuă spre Nivelul 6' : 'Continue to Level 6'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
