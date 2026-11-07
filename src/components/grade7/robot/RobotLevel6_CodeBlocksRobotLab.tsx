import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Lightbulb,
  ChevronRight,
  Code2,
  Terminal,
  Cpu
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface CodeLabTask {
  id: string;
  titleRo: string;
  titleEn: string;
  scenarioDescRo: string;
  scenarioDescEn: string;
  manualRefRo: string;
  manualRefEn: string;
  initialCode: string;
  expectedToken: string;
  validTokens: string[];
  codeExplanationRo: string;
  codeExplanationEn: string;
  compilerOutputSuccessRo: string[];
  compilerOutputSuccessEn: string[];
}

const TASKS: CodeLabTask[] = [
  {
    id: 'task1',
    titleRo: 'Misiunea 1: Patrulare Pătrată cu Buclă for',
    titleEn: 'Mission 1: Square Patrol with for Loop',
    scenarioDescRo: 'Programează robotul să execute un traseu pătrat de latură 50 cm. Folosește o buclă for care se repetă de 4 ori și virează la 90° la fiecare colț.',
    scenarioDescEn: 'Program the robot to trace a 50 cm square path. Use a for loop repeating 4 times that turns 90° at each corner.',
    manualRefRo: 'Manual pag. 104',
    manualRefEn: 'Textbook p. 104',
    initialCode: `#include <iostream>
#include <robotica.h>
using namespace std;

int main() {
    Robot robot;
    robot.porneste();

    // Completează bucla for pentru cele 4 laturi
    for (int i = 1; i <= 4; i++) {
        robot.inainte(50);         // avansează 50 cm
        robot.vireazaDreapta(___); // Câți grade virează la colț?
    }

    robot.opreste();
    return 0;
}`,
    expectedToken: '90',
    validTokens: ['90'],
    codeExplanationRo: 'Pătratul are 4 colțuri drepte de 90°. Virajul exterior la fiecare vârf este de exact 90°.',
    codeExplanationEn: 'A square has 4 right angles of 90°. The exterior turn at each vertex is exactly 90°.',
    compilerOutputSuccessRo: [
      'Compilator GNU GCC: robotica.h detectat.',
      'Construire țintă: Debug in RobotProject (compiler: GNU GCC Compiler)',
      'Running: C:\\Proiecte\\Robotica\\bin\\Debug\\RobotProject.exe',
      '[ROBOT] Pornire motoare...',
      '[ROBOT] Latura 1: Înainte 50 cm -> Viraj Dreapta 90°',
      '[ROBOT] Latura 2: Înainte 50 cm -> Viraj Dreapta 90°',
      '[ROBOT] Latura 3: Înainte 50 cm -> Viraj Dreapta 90°',
      '[ROBOT] Latura 4: Înainte 50 cm -> Viraj Dreapta 90°',
      '[ROBOT] Circuit pătrat finalizat cu succes! Motoare oprite.',
      'Process returned 0 (0x0)   execution time : 0.420 s'
    ],
    compilerOutputSuccessEn: [
      'GNU GCC Compiler: robotica.h detected.',
      'Build target: Debug in RobotProject (compiler: GNU GCC Compiler)',
      'Running: C:\\Projects\\Robotics\\bin\\Debug\\RobotProject.exe',
      '[ROBOT] Starting motors...',
      '[ROBOT] Side 1: Forward 50 cm -> Turn Right 90°',
      '[ROBOT] Side 2: Forward 50 cm -> Turn Right 90°',
      '[ROBOT] Side 3: Forward 50 cm -> Turn Right 90°',
      '[ROBOT] Side 4: Forward 50 cm -> Turn Right 90°',
      '[ROBOT] Square circuit completed successfully! Motors halted.',
      'Process returned 0 (0x0)   execution time : 0.420 s'
    ]
  },
  {
    id: 'task2',
    titleRo: 'Misiunea 2: Frână de Urgență Ultrasonică cu Buclă while',
    titleEn: 'Mission 2: Ultrasonic Emergency Brake with while Loop',
    scenarioDescRo: 'Robotul trebuie să meargă continuu înainte până când senzorul ultrasonic detectează un obstacol la o distanță mai mică de 20 cm.',
    scenarioDescEn: 'The robot must continuously advance until the ultrasonic sensor detects an obstacle closer than 20 cm.',
    manualRefRo: 'Manual pag. 105',
    manualRefEn: 'Textbook p. 105',
    initialCode: `#include <iostream>
#include <robotica.h>
using namespace std;

int main() {
    Robot robot;
    robot.porneste();

    // Avansează cât timp distanța până la zid este mai mare de 20 cm
    while (robot.citesteDistanta() ___ 20) {
        robot.inainte(5); // avans pas cu pas
    }

    cout << "Obstacol detectat! Frânare de urgență." << endl;
    robot.opreste();
    return 0;
}`,
    expectedToken: '>',
    validTokens: ['>'],
    codeExplanationRo: 'Condiția de continuare este ca distanța să fie strict mai mare de 20 ( > 20 ). Când distanța scade sub 20, bucla while se încheie și intervine oprirea.',
    codeExplanationEn: 'The loop continuation condition is distance strictly greater than 20 ( > 20 ). When distance drops below 20, the while loop terminates and braking engages.',
    compilerOutputSuccessRo: [
      'Compilator GNU GCC: robotica.h detectat.',
      'Construire țintă: Debug in RobotProject',
      '[ROBOT] Senzor ultrasonic ping... Distanță: 110 cm -> Înainte 5 cm',
      '[ROBOT] Senzor ultrasonic ping... Distanță: 65 cm -> Înainte 5 cm',
      '[ROBOT] Senzor ultrasonic ping... Distanță: 28 cm -> Înainte 5 cm',
      '[ROBOT] Senzor ultrasonic ping... Distanță: 19 cm -> ALERTĂ CRITICĂ!',
      'Obstacol detectat! Frânare de urgență.',
      '[ROBOT] Motoare decuplate la 19.4 cm de perete. Coliziune evitată!',
      'Process returned 0 (0x0)   execution time : 0.380 s'
    ],
    compilerOutputSuccessEn: [
      'GNU GCC Compiler: robotica.h detected.',
      'Build target: Debug in RobotProject',
      '[ROBOT] Ultrasonic ping... Distance: 110 cm -> Forward 5 cm',
      '[ROBOT] Ultrasonic ping... Distance: 65 cm -> Forward 5 cm',
      '[ROBOT] Ultrasonic ping... Distance: 28 cm -> Forward 5 cm',
      '[ROBOT] Ultrasonic ping... Distance: 19 cm -> CRITICAL ALERT!',
      'Obstacle detected! Emergency brake activated.',
      '[ROBOT] Motors decoupled at 19.4 cm from wall. Collision avoided!',
      'Process returned 0 (0x0)   execution time : 0.380 s'
    ]
  },
  {
    id: 'task3',
    titleRo: 'Misiunea 3: Corecție Automată Direcție (Line Follower)',
    titleEn: 'Mission 3: Automatic Heading Correction (Line Follower)',
    scenarioDescRo: 'Robotul urmărește linia neagră. Dacă senzorul din stânga iese de pe bandă și vede negru (1), robotul trebuie să vireze la stânga.',
    scenarioDescEn: 'The robot follows a black line. If the left sensor hits black (1), the robot must steer left.',
    manualRefRo: 'Manual pag. 107',
    manualRefEn: 'Textbook p. 107',
    initialCode: `#include <iostream>
#include <robotica.h>
using namespace std;

int main() {
    Robot robot;
    robot.porneste();

    while (!robot.laSosire()) {
        int sL = robot.citesteLinieStanga();
        int sR = robot.citesteLinieDreapta();

        if (sL == 1 && sR == 0) {
            // Deviație spre dreapta, linia este sub senzorul stâng
            robot.vireaza______(15);
        } else if (sL == 0 && sR == 1) {
            robot.vireazaDreapta(15);
        } else {
            robot.inainte(10);
        }
    }

    robot.opreste();
    return 0;
}`,
    expectedToken: 'Stanga',
    validTokens: ['stanga', 'stânga', 'left'],
    codeExplanationRo: 'Dacă senzorul stâng vede negru (sL == 1), robotul corectează traiectoria virând la stânga (vireazaStanga).',
    codeExplanationEn: 'If the left sensor detects black (sL == 1), the robot corrects course by steering left (vireazaStanga / steerLeft).',
    compilerOutputSuccessRo: [
      'Compilator GNU GCC: robotica.h detectat.',
      'Construire țintă: Debug in RobotProject',
      '[LINE TRACKER] Segment drept: sL=0, sR=0 -> Înainte 10 cm',
      '[LINE TRACKER] Curbă la stânga: sL=1, sR=0 -> Corecție vireazaStanga(15°)',
      '[LINE TRACKER] Reinițializare pe ax: sL=0, sR=0 -> Înainte 10 cm',
      '[LINE TRACKER] Curbă la dreapta: sL=0, sR=1 -> Corecție vireazaDreapta(15°)',
      '[LINE TRACKER] Punct SOSIRE atins cu succes!',
      'Process returned 0 (0x0)   execution time : 0.510 s'
    ],
    compilerOutputSuccessEn: [
      'GNU GCC Compiler: robotica.h detected.',
      'Build target: Debug in RobotProject',
      '[LINE TRACKER] Straight segment: sL=0, sR=0 -> Forward 10 cm',
      '[LINE TRACKER] Left curve: sL=1, sR=0 -> Correction steerLeft(15°)',
      '[LINE TRACKER] Centered on track: sL=0, sR=0 -> Forward 10 cm',
      '[LINE TRACKER] Right curve: sL=0, sR=1 -> Correction steerRight(15°)',
      '[LINE TRACKER] FINISH point reached successfully!',
      'Process returned 0 (0x0)   execution time : 0.510 s'
    ]
  }
];

export const RobotLevel6_CodeBlocksRobotLab: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<number, string>>({
    0: '',
    1: '',
    2: ''
  });
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [runLogs, setRunLogs] = useState<string[]>([]);
  const [taskStatus, setTaskStatus] = useState<Record<number, 'pending' | 'success' | 'error'>>({
    0: 'pending',
    1: 'pending',
    2: 'pending'
  });

  const activeTask = TASKS[currentTaskIndex];

  const handleBuildAndRun = () => {
    setIsBuilding(true);
    sounds.playClick();
    setRunLogs([
      lang === 'ro'
        ? 'Compilare fișier main.cpp prin MinGW GCC 8.1.0...'
        : 'Compiling main.cpp via MinGW GCC 8.1.0...'
    ]);

    const currentInput = userInputs[currentTaskIndex]?.trim().toLowerCase() || '';
    const isValid = activeTask.validTokens.some(tok => tok.toLowerCase() === currentInput);

    setTimeout(() => {
      setIsBuilding(false);

      if (isValid) {
        sounds.playSuccess();
        setTaskStatus(prev => ({ ...prev, [currentTaskIndex]: 'success' }));
        setRunLogs(lang === 'ro' ? activeTask.compilerOutputSuccessRo : activeTask.compilerOutputSuccessEn);
      } else {
        sounds.playError();
        setTaskStatus(prev => ({ ...prev, [currentTaskIndex]: 'error' }));
        setRunLogs([
          lang === 'ro'
            ? 'Compilator GNU GCC: EROARE sintaxă sau logică.'
            : 'GNU GCC Compiler: Syntax or logic ERROR.',
          lang === 'ro'
            ? `Linie eroare: valoarea introdusă "${userInputs[currentTaskIndex]}" nu este conformă cu specificațiile robotului.`
            : `Error line: entered value "${userInputs[currentTaskIndex]}" does not match robot specifications.`,
          `${lang === 'ro' ? 'Indiciu: ' : 'Hint: '}${lang === 'ro' ? activeTask.codeExplanationRo : activeTask.codeExplanationEn}`
        ]);
      }
    }, 700);
  };

  const allPassed =
    taskStatus[0] === 'success' && taskStatus[1] === 'success' && taskStatus[2] === 'success';

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Code2 className="w-36 h-36 text-indigo-400" />
        </div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Terminal className="w-4 h-4" />
          <span>
            {lang === 'ro'
              ? 'Nivelul 6 • Laborator Code::Blocks & Biblioteca <robotica.h> (Manual pag. 104–108)'
              : 'Level 6 • Code::Blocks Lab & <robotica.h> Library (Textbook pp. 104–108)'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {lang === 'ro'
            ? 'Laborator de Programare Code::Blocks pentru Roboți'
            : 'Code::Blocks Programming Lab for Robots'}
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          {lang === 'ro' ? (
            <>În manualul de Informatică (pag. 104), roboții educaționali sunt programați în limbajul C++
            utilizând funcții dedicate pentru motoare și senzori. Rezolvă cele 3 scenarii critice de programare,
            apasă <strong className="text-amber-300 font-mono">Build &amp; Run (F9)</strong> și validează comportamentul robotului!</>
          ) : (
            <>In the Computer Science textbook (p. 104), educational robots are programmed in C++
            using dedicated motor and sensor APIs. Solve the 3 critical programming scenarios,
            press <strong className="text-amber-300 font-mono">Build &amp; Run (F9)</strong>, and validate robot behavior!</>
          )}
        </p>
      </div>

      {/* Tabs pentru cele 3 sarcini */}
      <div className="flex flex-wrap gap-2">
        {TASKS.map((task, idx) => {
          const status = taskStatus[idx];
          const isActive = currentTaskIndex === idx;
          const title = lang === 'ro' ? task.titleRo : task.titleEn;

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => {
                setCurrentTaskIndex(idx);
                setRunLogs([]);
                sounds.playClick();
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                  : status === 'success'
                  ? 'bg-slate-900 border-emerald-500/40 text-emerald-300 hover:bg-slate-850'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
              }`}
            >
              <span>{title.split(':')[0]}</span>
              {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              {status === 'error' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
            </button>
          );
        })}
      </div>

      {/* Panou Editor Code::Blocks */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Bara de meniu Code::Blocks */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-2 font-mono text-slate-400">Code::Blocks 20.03 • main.cpp</span>
            </div>
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900">
              {lang === 'ro' ? activeTask.manualRefRo : activeTask.manualRefEn}
            </span>
          </div>

          <button
            type="button"
            disabled={isBuilding}
            onClick={handleBuildAndRun}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Build &amp; Run (F9)</span>
          </button>
        </div>

        {/* Descriere sarcină */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-start gap-3">
          <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-white">
              {lang === 'ro' ? activeTask.titleRo : activeTask.titleEn}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {lang === 'ro' ? activeTask.scenarioDescRo : activeTask.scenarioDescEn}
            </p>
          </div>
        </div>

        {/* Zona de cod */}
        <div className="p-4 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
          <pre className="whitespace-pre">{activeTask.initialCode}</pre>
        </div>

        {/* Formular de completare token lipsă */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            {lang === 'ro'
              ? 'Valoarea parametrului / operatorului lipsă (___):'
              : 'Missing parameter / operator value (___):'}
          </span>
          <input
            type="text"
            value={userInputs[currentTaskIndex]}
            onChange={e =>
              setUserInputs(prev => ({
                ...prev,
                [currentTaskIndex]: e.target.value
              }))
            }
            placeholder={
              currentTaskIndex === 0
                ? 'Ex: 90'
                : currentTaskIndex === 1
                ? 'Ex: >'
                : lang === 'ro' ? 'Ex: Stanga' : 'Ex: Left'
            }
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 w-36"
            onKeyDown={e => {
              if (e.key === 'Enter') handleBuildAndRun();
            }}
          />
          <button
            type="button"
            onClick={handleBuildAndRun}
            disabled={isBuilding || !userInputs[currentTaskIndex]?.trim()}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer"
          >
            {lang === 'ro' ? 'Verifică Codul' : 'Verify Code'}
          </button>

          {taskStatus[currentTaskIndex] === 'success' && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4" />{' '}
              {lang === 'ro' ? 'Soluție C++ Validată!' : 'C++ Solution Validated!'}
            </span>
          )}
        </div>

        {/* Fereastră Consolă & Jurnal Execuție */}
        <div className="bg-black/90 p-4 border-t border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-slate-900 pb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>
              {lang === 'ro'
                ? 'Fereastră Execuție Program (Consolă Virtuală C++)'
                : 'Program Execution Window (Virtual C++ Console)'}
            </span>
          </div>

          {runLogs.length === 0 ? (
            <div className="text-slate-600 italic">
              {lang === 'ro'
                ? 'Apasă "Build & Run (F9)" pentru a compila codul și a rula robotul pe traseul virtual...'
                : 'Click "Build & Run (F9)" to compile the code and execute the robot on the virtual path...'}
            </div>
          ) : (
            <div className="space-y-1">
              {runLogs.map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.includes('ALERTĂ') || line.includes('EROARE') || line.includes('ALERT') || line.includes('ERROR')
                      ? 'text-rose-400 font-bold'
                      : line.includes('SUCCES') || line.includes('finalizat') || line.includes('evitată') || line.includes('SUCCESS') || line.includes('completed') || line.includes('avoided')
                      ? 'text-emerald-400 font-bold'
                      : line.includes('[ROBOT]') || line.includes('[LINE TRACKER]')
                      ? 'text-cyan-300'
                      : 'text-slate-400'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Răspuns explicativ și navigare */}
      {taskStatus[currentTaskIndex] === 'success' && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-200">
          <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {lang === 'ro' ? 'Explicație Curriculară: ' : 'Curricular Explanation: '}
            </span>
            {lang === 'ro' ? activeTask.codeExplanationRo : activeTask.codeExplanationEn}
          </div>
        </div>
      )}

      {/* Pas final / completare laborator */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs font-mono text-slate-400">
          {lang === 'ro' ? 'Progres Laborator: ' : 'Lab Progress: '}
          <span className="text-indigo-400 font-bold">
            {Object.values(taskStatus).filter(s => s === 'success').length} / 3{' '}
            {lang === 'ro' ? 'Misiuni validate' : 'Missions validated'}
          </span>
        </div>

        {allPassed ? (
          <button
            type="button"
            onClick={() => {
              sounds.playLevelUp();
              onPass(100);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold transition flex items-center gap-2 shadow-xl shadow-emerald-600/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'ro'
                ? 'Laborator Finalizat! Mergi la Evaluarea Finală & Diplomă'
                : 'Lab Completed! Proceed to Final Evaluation & Diploma'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              const nextIndex = (currentTaskIndex + 1) % 3;
              setCurrentTaskIndex(nextIndex);
              setRunLogs([]);
              sounds.playClick();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>{lang === 'ro' ? 'Misiunea Următoare' : 'Next Mission'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
