import React, { useState, useEffect, useCallback } from 'react';
import {
  Code2,
  Terminal,
  Zap,
  Flame,
  Swords,
  Trophy,
  RotateCcw,
  Sparkles,
  Bot,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  Play
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';

interface CppChallenge {
  id: number;
  titleRo: string;
  titleEn: string;
  conceptRo: string;
  conceptEn: string;
  codeSnippet: string[];
  blankLineIndex: number;
  correctToken: string;
  options: string[];
  compilerOutput: string;
}

const CPP_CHALLENGES: CppChallenge[] = [
  {
    id: 1,
    titleRo: 'Runda 1: Regula celor 3 Pahare (Interschimbare Swap)',
    titleEn: 'Round 1: The 3-Glasses Rule (Variable Swap)',
    conceptRo: 'Manual TIC Clasa a 7-a — Interschimbarea a două variabile cu variabilă auxiliară',
    conceptEn: 'Grade 7 ICT Textbook — Swapping two variables using an auxiliary variable',
    codeSnippet: [
      '#include <iostream>',
      'using namespace std;',
      'int main() {',
      '    int a = 10, b = 20;',
      '    int aux = a;',
      '    a = b;',
      '    b = ___;',
      '    cout << a << " " << b;',
      '    return 0;',
      '}'
    ],
    blankLineIndex: 6,
    correctToken: 'aux',
    options: ['aux', 'a', 'b', '0'],
    compilerOutput: 'OUTPUT: 20 10 (Interschimbare cu succes!)'
  },
  {
    id: 2,
    titleRo: 'Runda 2: Bucla for & Suma Numerelor până la N',
    titleEn: 'Round 2: For Loop & Number Sum Accumulator',
    conceptRo: 'Pasul de incrementare al buclei repetitive cu contor',
    conceptEn: 'Increment step in counting loop',
    codeSnippet: [
      'int n = 10, suma = 0;',
      'for (int i = 1; i <= n; ___) {',
      '    suma += i;',
      '}',
      'cout << "Suma Gauss: " << suma;'
    ],
    blankLineIndex: 1,
    correctToken: 'i++',
    options: ['i++', 'i--', 'i = 0', 'n++'],
    compilerOutput: 'OUTPUT: Suma Gauss: 55'
  },
  {
    id: 3,
    titleRo: 'Runda 3: Algoritmul pe Cifre (Tăierea Ultimei Cifre)',
    titleEn: 'Round 3: Number Digit Algorithm (Truncate Last Digit)',
    conceptRo: 'Manual TIC Clasa a 7-a pag. 81 — Împărțirea întreagă la 10',
    conceptEn: 'Grade 7 ICT Textbook p. 81 — Integer division by 10',
    codeSnippet: [
      'int n = 1234, oglindit = 0;',
      'while (n > 0) {',
      '    int cifra = n % 10;',
      '    oglindit = oglindit * 10 + cifra;',
      '    n = n ___ 10;',
      '}',
      'cout << "Oglindit: " << oglindit;'
    ],
    blankLineIndex: 4,
    correctToken: '/',
    options: ['/', '%', '*', '+'],
    compilerOutput: 'OUTPUT: Oglindit: 4321'
  },
  {
    id: 4,
    titleRo: 'Runda 4: Operatori Logici & Paritate',
    titleEn: 'Round 4: Modulo Operator & Parity Test',
    conceptRo: 'Verificarea restului împărțirii unui număr la 2',
    conceptEn: 'Remainder test for even/odd number',
    codeSnippet: [
      'int numar = 42;',
      'if (numar ___ 2 == 0) {',
      '    cout << "Numar PAR!";',
      '} else {',
      '    cout << "Numar IMPAR!";',
      '}'
    ],
    blankLineIndex: 1,
    correctToken: '%',
    options: ['%', '/', '==', '&&'],
    compilerOutput: 'OUTPUT: Numar PAR!'
  },
  {
    id: 5,
    titleRo: 'Runda 5: Decizia Multiplă switch & Instrucțiunea break',
    titleEn: 'Round 5: Multi-way Decision switch & break Statement',
    conceptRo: 'Manual TIC Clasa a 8-a pag. 45 — Oprirea execuției cazului activ',
    conceptEn: 'Grade 8 ICT Textbook p. 45 — Halting active case fallthrough',
    codeSnippet: [
      'switch (prima_cifra_cnp) {',
      '    case 1: cout << "Barbat nascut sec. XX"; break;',
      '    case 5: cout << "Baiat nascut dupa 2000"; ___;',
      '    case 6: cout << "Fata nascuta dupa 2000"; break;',
      '}'
    ],
    blankLineIndex: 2,
    correctToken: 'break',
    options: ['break', 'continue', 'return', 'default'],
    compilerOutput: 'OUTPUT: Baiat nascut dupa 2000 (Case oprit corect!)'
  },
  {
    id: 6,
    titleRo: 'Runda 6: Tablouri Unidimensionale (Găsire Maxim)',
    titleEn: 'Round 6: Arrays / Vector Max Finder Algorithm',
    conceptRo: 'Manual TIC Clasa a 8-a pag. 65 — Compararea fiecărui element cu maximul curent',
    conceptEn: 'Grade 8 ICT Textbook p. 65 — Sequential max element comparison',
    codeSnippet: [
      'int v[5] = {12, 45, 9, 88, 32};',
      'int maxim = v[0];',
      'for (int i = 1; i < 5; i++) {',
      '    if (v[i] ___ maxim) {',
      '        maxim = v[i];',
      '    }',
      '}',
      'cout << "Valoare maxima: " << maxim;'
    ],
    blankLineIndex: 3,
    correctToken: '>',
    options: ['>', '<', '==', '!='],
    compilerOutput: 'OUTPUT: Valoare maxima: 88'
  }
];

interface CodeRacerCppDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, isWinner: boolean) => void;
  onBack?: () => void;
}

export const CodeRacerCppDuelGame: React.FC<CodeRacerCppDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Campion TIC',
  studentAvatar = '⚡',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [compilerStatus, setCompilerStatus] = useState<{ isSuccess: boolean; msg: string } | null>(null);
  const [hasFinishedLocal, setHasFinishedLocal] = useState(false);

  // Bot Practice fallback
  const [botProgress, setBotProgress] = useState(0);
  const [botScore, setBotScore] = useState(0);

  const challenge = CPP_CHALLENGES[currentIdx % CPP_CHALLENGES.length];
  const progressPercent = Math.min(100, Math.round((currentIdx / CPP_CHALLENGES.length) * 100));

  const me: DuelPlayer | null = isHost ? roomData?.host || null : (roomData?.guest || null);
  const opponent: DuelPlayer | null = isHost ? roomData?.guest || null : (roomData?.host || null);

  const opponentProgress = roomData ? (opponent?.progress || 0) : botProgress;
  const opponentScore = roomData ? (opponent?.score || 0) : botScore;
  const opponentName = roomData ? (opponent?.name || (lang === 'en' ? 'Opponent' : 'Oponent')) : (lang === 'en' ? 'C++ Compiler Bot 🤖' : 'Robot Programator 🤖');

  // Handle Token Selection
  const handleSelectToken = (token: string) => {
    if (hasFinishedLocal || compilerStatus) return;

    if (token === challenge.correctToken) {
      sounds.playCorrect();
      setCompilerStatus({
        isSuccess: true,
        msg: `[BUILD SUCCESSFUL] Compilare cu ieșire 0.\n${challenge.compilerOutput}`
      });

      const points = 120 + streak * 30;
      const nextScore = score + points;
      const nextIndex = currentIdx + 1;
      const nextStreak = streak + 1;

      setScore(nextScore);
      setStreak(nextStreak);

      setTimeout(() => {
        if (nextIndex >= CPP_CHALLENGES.length) {
          setHasFinishedLocal(true);
          sounds.playFanfare();

          if (roomData?.roomCode) {
            updateDuelProgress(
              roomData.roomCode,
              isHost,
              { progress: 100, score: nextScore, finishedAt: Date.now() },
              isHost ? roomData.host.id : roomData.guest?.id,
              isHost ? roomData.host.name : (roomData.guest?.name || 'Elev')
            );
          }

          recordStudentDuelResult(true, 'algo_race_cpp', nextScore);
          onFinish?.(nextScore, true);
        } else {
          const newProg = Math.round((nextIndex / CPP_CHALLENGES.length) * 100);
          if (roomData?.roomCode) {
            updateDuelProgress(roomData.roomCode, isHost, {
              progress: newProg,
              score: nextScore,
              currentStageIndex: nextIndex
            });
          }

          setCurrentIdx(nextIndex);
          setCompilerStatus(null);
        }
      }, 700);
    } else {
      sounds.playWrong();
      setStreak(0);
      setCompilerStatus({
        isSuccess: false,
        msg: `[COMPILATION ERROR] Simbolul '${token}' a generat eroare de sintaxă sau logică! Încearcă din nou.`
      });
      setTimeout(() => setCompilerStatus(null), 900);
    }
  };

  // Bot practice opponent
  useEffect(() => {
    if (roomData || hasFinishedLocal) return;

    const interval = setInterval(() => {
      setBotProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const delta = Math.floor(Math.random() * 9) + 8;
        const next = Math.min(100, prev + delta);
        setBotScore((s) => s + 130);
        if (next >= 100 && !hasFinishedLocal) {
          setHasFinishedLocal(true);
          sounds.playWrong();
          onFinish?.(score, false);
        }
        return next;
      });
    }, 4200);

    return () => clearInterval(interval);
  }, [roomData, hasFinishedLocal, score, onFinish]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none font-sans">
      {/* Top HUD */}
      <div className="bg-slate-900/95 border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Me */}
          <div className="sm:col-span-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg ring-2 ring-emerald-400/40 shrink-0">
              {studentAvatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-black text-white text-sm truncate">{studentName} (Tu)</span>
                <span className="font-mono text-xs font-bold text-emerald-300">{score} XP</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {lang === 'en' ? `Algorithm ${currentIdx + 1} of ${CPP_CHALLENGES.length}` : `Algoritm ${currentIdx + 1} din ${CPP_CHALLENGES.length}`}
              </span>
            </div>
          </div>

          {/* Versus */}
          <div className="sm:col-span-2 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-black text-xs shadow-inner">
              C++ VS
            </div>
            {streak > 1 && (
              <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1 mt-1 font-mono animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> {streak}x Code Streak
              </span>
            )}
          </div>

          {/* Opponent */}
          <div className="sm:col-span-5 flex items-center gap-3">
            <div className="min-w-0 flex-1 text-right">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-xs font-bold text-rose-300">{opponentScore} XP</span>
                <span className="font-black text-white text-sm truncate">{opponentName}</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                <div
                  className="h-full bg-gradient-to-l from-rose-500 to-amber-400 transition-all duration-300 rounded-full float-right"
                  style={{ width: `${opponentProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {opponentProgress}% compilat
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg ring-2 ring-rose-400/40 shrink-0">
              {roomData?.guest ? roomData.guest.avatar : '🤖'}
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Deck */}
      <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Editor Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              main.cpp — {lang === 'en' ? challenge.titleEn : challenge.titleRo}
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
            GCC C++17
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          💡 {lang === 'en' ? challenge.conceptEn : challenge.conceptRo}
        </p>

        {/* Syntax Highlighted Code Viewer */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm border border-slate-800/80 mb-6 space-y-1 overflow-x-auto shadow-inner">
          {challenge.codeSnippet.map((line, idx) => {
            const isBlankLine = idx === challenge.blankLineIndex;
            return (
              <div key={idx} className={`flex items-center gap-3 ${isBlankLine ? 'bg-emerald-500/10 -mx-2 px-2 py-1 rounded border-l-4 border-emerald-400' : ''}`}>
                <span className="text-slate-600 select-none w-5 text-right text-[11px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-slate-300 font-mono">
                  {isBlankLine ? (
                    <span>
                      {line.split('___')[0]}
                      <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-400/80 text-emerald-300 font-black animate-pulse shadow-sm">
                        [ ? ]
                      </span>
                      {line.split('___')[1] || ''}
                    </span>
                  ) : (
                    line
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* 4 Multi-Choice Code Token Options */}
        <div className="mb-6">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
            {lang === 'en' ? 'Select the Missing Operator / Token to Compile:' : 'Alege Simbolul / Instrucțiunea Lipsă pentru a Compila:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {challenge.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectToken(opt)}
                disabled={Boolean(compilerStatus)}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-emerald-600 hover:text-slate-950 border-2 border-slate-800 hover:border-emerald-400 font-mono font-black text-base text-emerald-300 transition-all cursor-pointer active:scale-95 text-center shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Live Terminal Output Box */}
        {compilerStatus && (
          <div className={`p-4 rounded-2xl border font-mono text-xs transition-all animate-fade-in ${
            compilerStatus.isSuccess
              ? 'bg-emerald-950/80 border-emerald-400/80 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/80 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 mb-1 font-bold">
              <Terminal className="w-4 h-4" />
              <span>{compilerStatus.isSuccess ? 'COMPILARE REUȘITĂ ✓' : 'EROARE LA COMPILARE ✗'}</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{compilerStatus.msg}</pre>
          </div>
        )}
      </div>

      {/* Finished Banner */}
      {hasFinishedLocal && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border-2 border-emerald-500/60 rounded-3xl p-6 text-center shadow-2xl">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce" />
          <h3 className="text-xl font-black text-white font-heading">
            {lang === 'en' ? 'C++ Code Racer Duel Conquered!' : 'Cursa Compilatorului C++ Câștigată! 🚀'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {lang === 'en'
              ? `All algorithmic challenges compiled with a score of ${score} XP!`
              : `Ai compilat toți algoritmii C++ cu brio și ai obținut ${score} XP!`}
          </p>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/30"
            >
              {lang === 'en' ? 'Return to Lobby' : 'Înapoi în Arenă'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
