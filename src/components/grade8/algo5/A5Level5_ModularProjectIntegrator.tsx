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
      desc: 'Citește numărul de elevi și vectorul de note',
      snippet: 'void citireNote(int v[], int &n)'
    },
    {
      id: 2,
      title: '2. calculMedie(note, n)',
      desc: 'Calculează media aritmetică a clasei',
      snippet: 'double calculMedie(int v[], int n)'
    },
    {
      id: 3,
      title: '3. notaMaxima(note, n)',
      desc: 'Identifică cea mai mare notă obținută',
      snippet: 'int notaMaxima(int v[], int n)'
    },
    {
      id: 4,
      title: '4. numarCorigenti(note, n)',
      desc: 'Numără elevii cu nota sub 5',
      snippet: 'int numarCorigenti(int v[], int n)'
    },
    {
      id: 5,
      title: '5. sortareNote(note, n)',
      desc: 'Sortează catalogul descrescător după performanță',
      snippet: 'void sortareDescrescatoare(int v[], int n)'
    }
  ];

  const handleRunStep = (stepIdx: number) => {
    sounds.playClick();
    setActiveStep(stepIdx);

    if (stepIdx === 1) {
      setPipelineLogs((prev) => [
        ...prev,
        `[Step 1] citireNote(): S-au încărcat ${students.length} înregistrări în vectorul note[].`
      ]);
    } else if (stepIdx === 2) {
      const sum = students.reduce((acc, curr) => acc + curr.nota, 0);
      const avg = Number((sum / students.length).toFixed(2));
      setStats((prev) => ({ ...prev, medie: avg }));
      setPipelineLogs((prev) => [
        ...prev,
        `[Step 2] calculMedie(): Suma notelor = ${sum}, Media generală a clasei = ${avg}.`
      ]);
    } else if (stepIdx === 3) {
      const mx = Math.max(...students.map((s) => s.nota));
      setStats((prev) => ({ ...prev, maxNota: mx }));
      setPipelineLogs((prev) => [
        ...prev,
        `[Step 3] notaMaxima(): Nota maximă găsită în vector este ${mx}.`
      ]);
    } else if (stepIdx === 4) {
      const cor = students.filter((s) => s.nota < 5).length;
      setStats((prev) => ({ ...prev, corigenti: cor }));
      setPipelineLogs((prev) => [
        ...prev,
        `[Step 4] numarCorigenti(): S-au identificat ${cor} elevi corigenți (nota < 5).`
      ]);
    } else if (stepIdx === 5) {
      const sorted = [...students].sort((a, b) => b.nota - a.nota);
      setStudents(sorted);
      setStats((prev) => ({ ...prev, isSorted: true }));
      setPipelineLogs((prev) => [
        ...prev,
        `[Step 5] sortareDescrescatoare(): Catalogul a fost ordonat descrescător după medii!`
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
    setPipelineLogs([
      `=== EXECUTIE PIPELINE MODULAR INTEGRATOR ===`,
      `[main()] -> citireNote(note, n); // S-au încărcat ${students.length} elevi`,
      `[main()] -> medie = calculMedie(note, n); // Media: ${avg}`,
      `[main()] -> max = notaMaxima(note, n); // Nota maximă: ${mx}`,
      `[main()] -> corig = numarCorigenti(note, n); // Corigenți: ${cor}`,
      `[main()] -> sortareDescrescatoare(note, n); // Catalog ordonat cu succes!`,
      `=== PIPELINE FINALIZAT: COD CURAT, FĂRĂ LINII REDUNDANTE ===`
    ]);
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
                Nivelul 5 • Unitatea 3 (Manual pag. 87–88)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Proiect Integrator C++: Catalogul Școlar Modular
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/40 border border-purple-700/50 rounded-lg text-purple-300 text-sm font-mono">
            <span>Arhitectură de Sistem C++</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Punctul culminant al programării de clasa a VIII-a: integrarea tuturor conceptelor (vectori, decizii,
          bucle, căutare și sortare) într-un <strong>proiect modular complet</strong>. Funcția <code>main()</code> devine
          un dirijor elegant de orchestră, apelând subprograme dedicate.
        </p>
      </div>

      {/* Code Architecture Switcher */}
      <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
        <span className="text-xs font-mono text-slate-400">
          Comparație Arhitecturală de Cod:
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
            Cod Modular (Clean C++)
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
            Cod Monolitic (Spaghetti)
          </button>
        </div>
      </div>

      {/* Code Comparison Banner */}
      {viewMode === 'monolithic' ? (
        <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-4 font-mono text-xs text-rose-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Anti-Pattern: Cod Monolitic într-un singur main() gigantic</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Peste 100 de linii într-o singură funcție! Dacă apare un bug la calculul mediei sau sortare,
            trebuie recitit tot fișierul. Greu de testat, imposibil de refolosit într-un alt proiect.
          </p>
        </div>
      ) : (
        <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4 font-mono text-xs text-purple-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>Best Practice: Funcția main() devine un pipeline limpede</span>
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
                Etape Pipeline Subprograme
              </span>
              <button
                onClick={handleRunFullPipeline}
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-mono font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Rulează Tot Pipeline-ul
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
                    {step.desc}
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
              <span>Consola de Execuție main()</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800/80 font-mono text-xs space-y-1 max-h-[140px] overflow-y-auto">
              {pipelineLogs.length === 0 ? (
                <div className="text-slate-500 italic">
                  Apasă pe oricare etapă sau &quot;Rulează Tot Pipeline-ul&quot;.
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
                <span>Catalogul Clasei a VIII-a</span>
              </div>
              {stats.isSorted && (
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Sortat descrescător
                </span>
              )}
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Nume Elev</th>
                    <th className="py-2 px-3 text-right">Notă C++</th>
                    <th className="py-2 px-3 text-right">Statut</th>
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
                            Premiant
                          </span>
                        ) : st.nota >= 5 ? (
                          <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-mono">
                            Promovat
                          </span>
                        ) : (
                          <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-mono font-bold">
                            Corigent
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
                  Media Clasei
                </span>
                <span className="text-xl font-bold font-mono text-purple-400">
                  {stats.medie}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">
                  Nota Maximă
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {stats.maxNota}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">
                  Corigenți (&lt;5)
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
              <span>Verificare Înțelegere Arhitectură (Manual pag. 88)</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                1. Ce rol are funcția <code>main()</code> într-o aplicație C++ modulară proiectată corect?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'main_curat',
                    text: 'Coordonează fluxul programului, apelând pe rând subprogramele specializate.'
                  },
                  {
                    id: 'main_spaghetti',
                    text: 'Trebuie să conțină toți algoritmii scriși cap-coadă fără nicio altă funcție.'
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
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <p className="text-slate-300 font-medium">
                2. Dacă dorim să schimbăm algoritmul de sortare (de ex. din Bubble Sort în Selection Sort), ce modificăm într-un proiect modular?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'modular_reducere',
                    text: 'Modificăm doar corpul funcției sortareNote(), restul programului și main() rămânând intacte.'
                  },
                  {
                    id: 'tot_codul',
                    text: 'Trebuie să rescriem complet de la zero întreg programul.'
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
                    {opt.text}
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
                ? 'Proiectul Integrator Finalizat cu Succes!'
                : 'Cerințe: Parcurge pipeline-ul complet (sau apasă Rulează Tot) și răspunde corect la întrebări.'}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și deblocarea Clinicii de Depanare (Nivelul 6).
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
          <span>Continuă spre Nivelul 6</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
