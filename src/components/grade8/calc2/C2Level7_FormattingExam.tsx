import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Star,
  FileSpreadsheet
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C2Level7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C2Level7_FormattingExam: React.FC<C2Level7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // 4 Questions from Textbook Autoevaluare (Page 25)
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'pct25') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'onlyRezultate') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'keepIntegrity') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const handleQ4 = (id: string) => {
    if (isLocked('q4')) return;
    setQ4Answer(id);
    if (id === 'dragFillHandle') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q4');
    }
  };

  const isQ1Correct = q1Answer === 'pct25';
  const isQ2Correct = q2Answer === 'onlyRezultate';
  const isQ3Correct = q3Answer === 'keepIntegrity';
  const isQ4Correct = q4Answer === 'dragFillHandle';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct, isQ4Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 4) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct && isQ4Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Exam Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-teal-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>
                {lang === 'en'
                  ? 'Official Self-Assessment Test • Art Klett Textbook 2025 p. 25'
                  : 'Test Oficial de Autoevaluare • Manual Art Klett 2025 Pag. 25'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-amber-400" />
              {lang === 'en'
                ? 'Level 7: Module 1B Summative Assessment (Formatting & Sorting)'
                : 'Nivelul 7: Evaluarea Sumativă a Modulului 1B (Formatare & Sortare)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Test your knowledge from Lesson 4 of the textbook: autofill, cell merging, percentage formats, and multi-level sorting to earn a Grade 10 and Certificate of Merit!'
                : 'Verifică-ți cunoștințele din Lecția 4 a manualului: autofill, îmbinare celule, formate procentuale și sortare pe niveluri multiple pentru a obține Nota 10 și Diploma de Merit!'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-amber-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Final Exam' : 'Evaluare Finală'}</div>
            <div className="text-2xl font-black text-amber-400">7 / 7</div>
          </div>
        </div>
      </div>

      {/* Grade Indicator Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl">
            {correctCount === 4 ? '10' : correctCount === 3 ? '8' : correctCount === 2 ? '6' : correctCount === 1 ? '4' : '1'}
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">{lang === 'en' ? 'Estimated Grade' : 'Notă Estimată'}</div>
            <div className="text-base font-bold text-white">
              {correctCount === 4
                ? (lang === 'en' ? '🌟 Top Grade: 10 (Unlocks Official Diploma!)' : '🌟 Notă Maximă: 10 (Deblochează Diploma Oficială!)')
                : (lang === 'en' ? `${correctCount} of 4 correct answers validated` : `${correctCount} din 4 răspunsuri corecte validate`)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((idx) => {
            const isDone = (idx === 1 && isQ1Correct) || (idx === 2 && isQ2Correct) || (idx === 3 && isQ3Correct) || (idx === 4 && isQ4Correct);
            return (
              <div
                key={idx}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {idx}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Official Questions from Textbook Page 25 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
        {/* Q1 (Manual pag. 25 - Ex. 1) */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. If you enter the value 0.25 into a cell and apply the Percentage format, what will Excel display?'
                : '1. Dacă introduci valoarea 0.25 într-o celulă și aplici formatul Procent (Percentage), ce va afișa Excel?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'pct25',
                textRo: '25% (deoarece 0.25 se multiplică automat cu 100)',
                textEn: '25% (since 0.25 is automatically multiplied by 100)'
              },
              {
                id: 'pct025',
                textRo: '0.25% (fără nicio multiplicare numerică)',
                textEn: '0.25% (without any numeric multiplication)'
              },
              {
                id: 'pct2500',
                textRo: '2500% cu două zerouri suplimentare',
                textEn: '2500% with two additional zeros'
              },
              {
                id: 'errValue',
                textRo: 'Mesajul de eroare #VALUE!',
                textEn: 'The #VALUE! error message'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'pct25'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="0.25 reprezintă un sfert dintr-un întreg (25 din 100)."
            hintEn="0.25 represents one quarter of a whole (25 out of 100)."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! The percentage format multiplies the cell value by 100 and appends the % symbol, converting 0.25 into 25%.'
                  : 'Corect! Formatul de procent înmulțește valoarea celulei cu 100 și afișează simbolul %, astfel încât 0.25 devine 25%.'
              }
            />
          )}
        </div>

        {/* Q2 (Manual pag. 25 - Ex. 2) */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. If you select range A1:D1 where A1 contains "Results" and B1 contains "Semester 1", and click Merge & Center, what happens?'
                : '2. Dacă selectezi domeniul A1:D1 unde A1 conține „Rezultate”, iar B1 conține „Semestrul I”, și apeși comanda Merge & Center, ce se întâmplă?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'onlyRezultate',
                textRo: 'Rămâne doar textul „Rezultate” (din celula din stânga-sus), conținutul din B1 fiind șters',
                textEn: 'Only the text "Results" (from upper-left cell) is kept, discarding content in B1'
              },
              {
                id: 'bothJoined',
                textRo: 'Cele două texte se concatenează ca „Rezultate Semestrul I”',
                textEn: 'Both texts concatenate as "Results Semester 1"'
              },
              {
                id: 'allErased',
                textRo: 'Toate celulele devin complet goale',
                textEn: 'All cells become completely empty'
              },
              {
                id: 'secondKept',
                textRo: 'Se păstrează doar textul din ultima celulă D1',
                textEn: 'Only the text from the last cell D1 is preserved'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'onlyRezultate'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="Amintește-ți de avertismentul oficial Excel: păstrează doar celula din stânga-sus (upper-left cell)."
            hintEn="Recall the official Excel warning: it only retains the upper-left cell."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                lang === 'en'
                  ? 'Excellent! The "Merge & Center" command preserves only the content of the upper-left cell, discarding data in all other selected cells.'
                  : 'Excelent! Comanda \'Merge & Center\' păstrează exclusiv conținutul primei celule din colțul stânga-sus, datele din celelalte celule selectate fiind eliminate.'
              }
            />
          )}
        </div>

        {/* Q3 (Manual pag. 25 - Ex. 3) */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. Why must you choose "Expand the selection" when sorting a data table?'
                : '3. De ce la sortarea unei tabele trebuie să alegi opțiunea „Expand the selection” (Extinde selecția)?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'keepIntegrity',
                textRo: 'Pentru ca întregul rând (Nume, Notă, Clasă) să fie mutat împreună, evitând amestecarea notelor',
                textEn: 'So the entire row (Name, Grade, Class) moves together, preventing grades from getting mismatched'
              },
              {
                id: 'makeBold',
                textRo: 'Pentru a îngroșa fontul pe tot ecranul',
                textEn: 'To make font bold across the entire screen'
              },
              {
                id: 'saveDisk',
                textRo: 'Pentru a crea o arhivă ZIP pe disc',
                textEn: 'To create a ZIP archive on the drive'
              },
              {
                id: 'printDirect',
                textRo: 'Pentru a trimite fișierul direct la tipar',
                textEn: 'To send the file straight to the printer'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'keepIntegrity'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="Dacă sortezi doar notele, acestea nu vor mai corespunde elevilor care le-au obținut."
            hintEn="If you only sort grades, they will no longer match the students who earned them."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! "Expand the selection" maintains record integrity, synchronously moving all columns linked to each student.'
                  : 'Corect! \'Expand the selection\' păstrează integritatea înregistrărilor, mutând sincron toate coloanele asociate fiecărui elev.'
              }
            />
          )}
        </div>

        {/* Q4 (Manual pag. 25 - Ex. 4) */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '4. How do you autofill the months of the year starting from a cell containing "January"?'
                : '4. Cum completezi automat lunile anului pornind de la celula ce conține „Ianuarie”?'}
            </h3>
            {cooldowns.q4 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q4} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'dragFillHandle',
                textRo: 'Trăgând mânerul de umplere (pătrățelul din colțul dreapta-jos) în jos pe coloană',
                textEn: 'Dragging the fill handle (the square in bottom-right corner) down the column'
              },
              {
                id: 'typeAllManual',
                textRo: 'Tastând manual fiecare lună de la tastatură timp de 10 minute',
                textEn: 'Manually typing each month by hand for 10 minutes'
              },
              {
                id: 'formatCurrency',
                textRo: 'Aplicând formatul Monedă (lei)',
                textEn: 'Applying Currency format'
              },
              {
                id: 'wrapTextRule',
                textRo: 'Apăsând comanda Wrap Text',
                textEn: 'Clicking the Wrap Text command'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q4')}
                onClick={() => handleQ4(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q4Answer === option.id
                    ? option.id === 'dragFillHandle'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="Mânerul de umplere (Fill Handle) utilizează listele predefinite de serii cronologice din Excel."
            hintEn="The Fill Handle utilizes Excel's built-in chronological series lists."
          />
          {q4Answer && (
            <AnswerExplanation
              isCorrect={isQ4Correct}
              explanation={
                lang === 'en'
                  ? 'Exactly! The Autofill feature recognizes calendar months and automatically produces February, March, April, etc. just by dragging the fill handle.'
                  : 'Exact! Funcția Autofill recunoaște lunile anului și generează automat Februarie, Martie, Aprilie etc. prin simpla glisare a mânerului de umplere.'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={7}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(100);
        }}
      />
    </div>
  );
};
