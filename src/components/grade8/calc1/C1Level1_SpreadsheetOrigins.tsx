import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Cloud,
  HardDrive,
  RefreshCw,
  Calculator,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C1Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C1Level1_SpreadsheetOrigins: React.FC<C1Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Live Recalculation Demonstration (Manual Art Klett pag. 12)
  // Gradebook simulation: modifying geography grade changes total and average reactively
  const [grades, setGrades] = useState<{ subject: string; grade: number }[]>([
    { subject: 'Informatică & TIC', grade: 10 },
    { subject: 'Matematică', grade: 9 },
    { subject: 'Geografie', grade: 7 }, // Can be adjusted from 7 to 10
    { subject: 'Limba Română', grade: 9 },
  ]);

  const [activePlatform, setActivePlatform] = useState<'cloud' | 'desktop'>('cloud');

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const totalSum = grades.reduce((acc, curr) => acc + curr.grade, 0);
  const gradeAverage = (totalSum / grades.length).toFixed(2);

  const handleUpdateGeography = (newVal: number) => {
    sounds.playClick();
    setGrades(prev => prev.map(g => g.subject === 'Geografie' ? { ...g, grade: newVal } : g));
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'recalc') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'cloud') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'visicalc') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'recalc';
  const isQ2Correct = q2Answer === 'cloud';
  const isQ3Correct = q3Answer === 'visicalc';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-teal-900/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 12–13</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
              Nivelul 1: Originea Foilor de Calcul & Recalcularea Automată
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Înainte de computere, calculele se făceau cu pixul în registre masive de hârtie. Descoperă de ce foile electronice (Spreadsheets) au revoluționat lumea modernă prin recalculare instantanee și salvare sincronizată!
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Pas Curent</div>
            <div className="text-2xl font-black text-emerald-400">1 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Demonstration 1: The Magic of Reactive Recalculation (Manual pag. 12) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Laborator Interactiv: Recalcularea Dinamică</h2>
              <p className="text-xs text-slate-400">
                Schimbă nota la Geografie (exemplul din manual pag. 12) și observă efectul de cascadă
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/30">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Actualizare în Timp Real</span>
          </div>
        </div>

        {/* Live Mini Sheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-700/60 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-emerald-950/60 border-b border-slate-700 text-emerald-200">
                <th className="p-3 border-r border-slate-700 w-12 text-center font-mono">#</th>
                <th className="p-3 border-r border-slate-700 font-semibold">Coloana A: Disciplină Școlară</th>
                <th className="p-3 border-r border-slate-700 font-semibold text-center w-36">Coloana B: Notă</th>
                <th className="p-3 font-semibold text-slate-300">Stare Formulă</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/40">
              {grades.map((row, idx) => (
                <tr key={row.subject} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 border-r border-slate-800 text-center font-mono text-slate-400 bg-slate-900/50">
                    {idx + 1}
                  </td>
                  <td className="p-3 border-r border-slate-800 font-medium text-white flex items-center justify-between">
                    <span>{row.subject}</span>
                    {row.subject === 'Geografie' && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Modifică mai jos!
                      </span>
                    )}
                  </td>
                  <td className="p-3 border-r border-slate-800 text-center font-bold text-white">
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-800 text-emerald-300 font-mono text-base shadow-inner">
                      {row.grade}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-slate-400">
                    {row.subject === 'Geografie' ? (
                      <span className="text-emerald-400 font-mono">Valoare de intrare (modificată)</span>
                    ) : (
                      <span className="text-slate-500 font-mono">Valoare statică de intrare</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-900/20 font-bold border-t-2 border-emerald-500/40 text-emerald-200">
                <td className="p-3 border-r border-slate-800 text-center font-mono bg-slate-900/60">Σ</td>
                <td className="p-3 border-r border-slate-800 text-right pr-4">Total Puncte (Formula: =SUM(B1:B4)):</td>
                <td className="p-3 border-r border-slate-800 text-center text-emerald-300 font-mono text-base">
                  {totalSum}
                </td>
                <td className="p-3 text-xs text-emerald-400 font-mono">Recalculat automat la fiecare tastă</td>
              </tr>
              <tr className="bg-teal-900/30 font-black border-t border-slate-800 text-white">
                <td className="p-3 border-r border-slate-800 text-center font-mono bg-slate-900/60">x̄</td>
                <td className="p-3 border-r border-slate-800 text-right pr-4 text-teal-300">
                  Media Generală (Formula: =AVERAGE(B1:B4)):
                </td>
                <td className="p-3 border-r border-slate-800 text-center text-amber-300 font-mono text-lg">
                  {gradeAverage}
                </td>
                <td className="p-3 text-xs text-teal-300 font-semibold">
                  {Number(gradeAverage) >= 9.5 ? '🏆 Premiul I (Felicitări!)' : 'Excelentă progresie!'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Interactive Grade Slider / Buttons */}
        <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Schimbă nota la Geografie:
            </div>
            <p className="text-xs text-slate-400">
              Observă cum pe hârtie ar fi trebuit să ștergi cu radiera și să aduni iar toate cele 4 numere!
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[7, 8, 9, 10].map((score) => {
              const currentGeo = grades.find(g => g.subject === 'Geografie')?.grade;
              const isSelected = currentGeo === score;
              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => handleUpdateGeography(score)}
                  className={`px-4 py-2 rounded-xl font-bold font-mono text-sm transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  Nota {score}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison: Desktop (MS Excel) vs Cloud (Google Sheets / Excel Online) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Desktop vs Cloud: Cum Salvăm & Colaborăm</h2>
            <p className="text-xs text-slate-400">
              Aplicații instalate local pe calculator vs soluții moderne în browser (Manual pag. 12)
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => { sounds.playClick(); setActivePlatform('cloud'); }}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activePlatform === 'cloud'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-4 h-4" />
            Foi de Calcul în Cloud (Google Sheets / Excel 365)
          </button>
          <button
            type="button"
            onClick={() => { sounds.playClick(); setActivePlatform('desktop'); }}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activePlatform === 'desktop'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            Foi Desktop Tradiționale (MS Excel / LibreOffice Calc)
          </button>
        </div>

        {activePlatform === 'cloud' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
              <div className="text-teal-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Salvare Automată Continuă
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fiecare caracter tastat se salvează instantaneu pe serverele securizate Google Drive / OneDrive. Nu pierzi datele dacă se oprește curentul!
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
              <div className="text-teal-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Colaborare Simultană (Multiplayer)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mai mulți colegi de clasă sau profesori pot edita același tabel în același timp, văzând cursoarele colorate ale celilalți în direct.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
              <div className="text-teal-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Istoric Complet de Versiuni
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Poți călători în timp la orice versiune a registrului de acum 1 oră sau 3 săptămâni și să anulezi orice greșeală accidentală.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Putere Maximă Offline
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Funcționează impecabil fără nicio conexiune la internet. Ideal pentru procesarea de tabele gigantice cu sute de mii de rânduri.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Securitate Fizică & Fișiere .XLSX
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fișierele sunt stocate local pe SSD/HDD-ul calculatorului tău sau pe un stick USB și pot fi protejate prin parolă criptată.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Instrumente Avansate & Macrocomenzi
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suport complet pentru limbaje de automatizare (VBA), grafice complexe 3D și calcule statistice de nivel universitar.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificare Pedagogică a Noțiunilor</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 2</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Conform manualului (pag. 12), care este marele avantaj al unui program de calcul tabelar când schimbi nota la o materie?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'recalc', text: 'Toate mediile și formulele dependente se recalculează automat și instantaneu' },
              { id: 'delete', text: 'Programul șterge toate celelalte note și te pune să le reintroduci manual' },
              { id: 'nothing', text: 'Nu se întâmplă nimic; trebuie să reintroduci formula sumei de la tastatură' },
              { id: 'print', text: 'Documentul se trimite automat direct la imprimantă pe foaie A4' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'recalc'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Gândește-te la demonstrația interactivă de mai sus când ai schimbat nota la Geografie." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Esența calculului tabelar este recalcularea dinamică: modificarea oricărei celule de date primare actualizează imediat toate celulele dependente de formule."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Ce caracteristică majoră diferențiază foile de calcul în cloud (Google Sheets) de fișierele salvate strict pe calculator?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'mouse', text: 'În cloud nu poți folosi mouse-ul, doar comenzi de la tastatură' },
              { id: 'cloud', text: 'Salvare automată continuă și colaborare în timp real cu alți elevi/colegi' },
              { id: 'loss', text: 'În cloud documentele se șterg automat în fiecare seară la ora 24:00' },
              { id: 'single', text: 'Un singur utilizator are voie să acceseze documentul pe lună' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'cloud'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Manualul explică avantajele stocării în cloud: nu pierzi datele și poți lucra în echipă." />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! În aplicațiile cloud (Google Sheets, Excel 365), documentul se salvează automat la fiecare secundă și permite editarea concurentă a mai multor utilizatori."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Care a fost primul program de calcul tabelar din istorie (lansat în 1979 pentru Apple II), menționat în istoria TIC?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'visicalc', text: 'VisiCalc (creat de Dan Bricklin și Bob Frankston)' },
              { id: 'photoshop', text: 'Adobe Photoshop' },
              { id: 'scratch', text: 'Scratch 3.0 MIT' },
              { id: 'tiktok', text: 'TikTok Spreadsheet' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'visicalc'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Numele programului vine de la 'Visible Calculator' (Calculator Vizibil)." />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! VisiCalc a demonstrat în 1979 utilitatea calculatoarelor personale în afaceri și a deschis calea programelor Lotus 1-2-3 și Microsoft Excel."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={1}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
