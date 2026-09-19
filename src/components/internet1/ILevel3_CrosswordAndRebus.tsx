import React, { useState } from 'react';
import { Grid, Sparkles, CheckCircle2, Award, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuestionHint } from './QuestionHint';
import { AnswerExplanation } from './AnswerExplanation';
import { PageNavigationFooter } from './PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface ILevel3Props {
  onCompletePage: (earnedScore: number) => void;
}

interface CrosswordRow {
  num: number;
  clueRo: string;
  clueEn: string;
  answer: string; // all uppercase letters
  startCol: number; // 0-based offset so that column 3 forms the vertical secret word
}

// Rebus from Textbook p. 33 (Ex. 2)
// Vertical AB column reveals: TELNET (or INTERNET)
// 1. RETEA (R-E-T-E-A) -> T is at index 2
// 2. INTERNET (I-N-T-E-R-N-E-T) -> E is at index 3
// 3. CALCULATOR (C-A-L-C-U-L-A-T-O-R) -> L is at index 2
// 4. INFORMATICA (I-N-F-O-R-M-A-T-I-C-A) -> N is at index 1
// 5. EMAIL (E-M-A-I-L) -> E is at index 0
// 6. FTP (F-T-P) -> T is at index 1
// Vertical Word formed on column AB: T - E - L - N - E - T ! (Telnet)

export const ILevel3_CrosswordAndRebus: React.FC<ILevel3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const clues: CrosswordRow[] = [
    {
      num: 1,
      clueRo: '1. Mai multe calculatoare interconectate pentru a folosi în comun resursele lor',
      clueEn: '1. Multiple interconnected computers sharing resources together',
      answer: 'RETEA',
      startCol: 1, // 'T' at index 2 aligns with secret col 3
    },
    {
      num: 2,
      clueRo: '2. Rețea globală de calculatoare care facilitează schimbul de informații',
      clueEn: '2. Global computer network facilitating information exchange',
      answer: 'INTERNET',
      startCol: 0, // 'E' at index 3 aligns with secret col 3
    },
    {
      num: 3,
      clueRo: '3. Echipament de calcul care are în numele său două litere C',
      clueEn: '3. Computing equipment having two "C" letters in its Romanian name',
      answer: 'CALCULATOR',
      startCol: 1, // 'L' at index 2 aligns with secret col 3
    },
    {
      num: 4,
      clueRo: '4. Știința care se ocupă cu studiul prelucrării informației cu sisteme de calcul',
      clueEn: '4. Science dealing with automated information processing by computers',
      answer: 'INFORMATICA',
      startCol: 2, // 'N' at index 1 aligns with secret col 3
    },
    {
      num: 5,
      clueRo: '5. Serviciu internet de poștă electronică',
      clueEn: '5. Internet electronic mail service',
      answer: 'EMAIL',
      startCol: 3, // 'E' at index 0 aligns with secret col 3
    },
    {
      num: 6,
      clueRo: '6. Serviciu de transfer de fișiere între diverse calculatoare legate la internet',
      clueEn: '6. File transfer protocol service between connected computers',
      answer: 'FTP',
      startCol: 2, // 'T' at index 1 aligns with secret col 3
    },
  ];

  // User inputs for each of the 6 words
  const [userInputs, setUserInputs] = useState<string[]>(['', '', '', '', '', '']);
  const [secretWordGuess, setSecretWordGuess] = useState<string>('');

  const rowChecks = clues.map((c, i) => {
    const inputClean = (userInputs[i] || '').trim().toUpperCase().replace(/Ț/g, 'T').replace(/Ș/g, 'S').replace(/Ă/g, 'A').replace(/Â/g, 'A').replace(/Î/g, 'I');
    return inputClean === c.answer;
  });

  const isSecretCorrect = secretWordGuess.trim().toUpperCase() === 'TELNET';

  const totalQuestions = 7; // 6 rows + 1 secret word
  const correctCount = rowChecks.filter(Boolean).length + (isSecretCorrect ? 1 : 0);
  const pageScore = Math.min(20, Math.round((correctCount / totalQuestions) * 20));

  const handleInputChange = (index: number, val: string) => {
    const updated = [...userInputs];
    updated[index] = val.toUpperCase();
    setUserInputs(updated);
    sounds.playClick();
  };

  const handleProceed = () => {
    if (correctCount >= 4) sounds.playVictory();
    else sounds.playClick();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    setUserInputs(['', '', '', '', '', '']);
    setSecretWordGuess('');
    sounds.playClick();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-2">
          <Grid className="w-4 h-4" />
          <span>{lang === 'en' ? 'Module 3A • Page 3 / 6 (Textbook p. 33, Ex. 2)' : 'Modulul 3A • Pagina 3 / 6 (Manual pag. 33, Ex. 2)'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white font-heading">
          {lang === 'en' ? '3. The Digital Crossword & Secret Word AB' : '3. Rebusul Digital & Cuvântul Secret pe Coloana A-B'}
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          {lang === 'en'
            ? 'Solve the official textbook crossword by identifying the 6 ICT terms to uncover the mystery internet service along column A-B!'
            : 'Rezolvă rebusul oficial din manualul de clasa a V-a (pag. 33) completând cele 6 cuvinte pentru a descoperi serviciul secret de pe coloana A-B!'}
        </p>
      </div>

      {/* Crossword Interactive Board */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'en' ? 'Crossword Clues & Solution Grid' : 'Definiții Rebus & Grilă de Rezolvare'}
            </h3>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/40">
            {lang === 'en' ? 'Secret Column = TELNET' : 'Coloana A-B = Serviciu Secret'}
          </span>
        </div>

        {/* Rows */}
        <div className="space-y-4">
          {clues.map((row, idx) => (
            <div
              key={row.num}
              className={`p-4 rounded-2xl border transition ${
                rowChecks[idx]
                  ? 'bg-emerald-950/30 border-emerald-500/50'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {lang === 'en' ? row.clueEn : row.clueRo}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={userInputs[idx] || ''}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder={lang === 'en' ? `(${row.answer.length} letters)` : `(${row.answer.length} litere)`}
                    maxLength={row.answer.length + 2}
                    className="w-44 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-widest text-center text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 uppercase"
                  />
                  {userInputs[idx] && (
                    <span>
                      {rowChecks[idx] ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <span className="text-rose-400 font-bold text-xs">✗</span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Letter Blocks Preview */}
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {Array.from({ length: row.answer.length }).map((_, letterIdx) => {
                  const userLetter = (userInputs[idx] || '')[letterIdx] || '';
                  const isSecretLetter = letterIdx === (3 - row.startCol);
                  return (
                    <div
                      key={letterIdx}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs sm:text-sm border ${
                        isSecretLetter
                          ? 'bg-purple-600/30 border-purple-400 text-purple-200 ring-2 ring-purple-500/40 font-black'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                      title={isSecretLetter ? 'Litera ce aparține coloanei secrete A-B' : ''}
                    >
                      {userLetter}
                    </div>
                  );
                })}
              </div>

              {userInputs[idx] && userInputs[idx].length >= 3 && (
                <AnswerExplanation
                  isCorrect={rowChecks[idx]}
                  explanationRo={
                    rowChecks[idx]
                      ? `Corect! «${row.answer}» este noțiunea căutată!`
                      : `Ai introdus «${userInputs[idx]}». Răspunsul corect are ${row.answer.length} litere și începe cu «${row.answer[0]}».`
                  }
                  explanationEn={
                    rowChecks[idx]
                      ? `Correct! "${row.answer}" is the sought ICT term!`
                      : `You entered "${userInputs[idx]}". The answer has ${row.answer.length} letters starting with "${row.answer[0]}".`
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* Secret Word AB Final Input */}
        <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-purple-900/40 border-2 border-purple-500/50 rounded-2xl p-5 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1 font-mono">
            {lang === 'en' ? 'Mystery Service on Column A-B:' : 'Cuvântul descoperit pe coloana verticală A-B:'}
          </div>
          <div className="max-w-xs mx-auto flex items-center justify-center gap-2 mt-2">
            <input
              type="text"
              value={secretWordGuess}
              onChange={(e) => {
                setSecretWordGuess(e.target.value.toUpperCase());
                sounds.playClick();
              }}
              placeholder={lang === 'en' ? 'Enter secret word...' : 'Scrie serviciul secret...'}
              className="w-full bg-slate-950 border border-purple-400 px-4 py-2 rounded-xl text-center font-mono font-black tracking-widest text-white text-base focus:ring-2 focus:ring-purple-400 uppercase"
            />
            {secretWordGuess && (
              <span>
                {isSecretCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <span className="text-rose-400 font-bold">✗</span>
                )}
              </span>
            )}
          </div>

          {secretWordGuess && (
            <div className="max-w-md mx-auto mt-2">
              <AnswerExplanation
                isCorrect={isSecretCorrect}
                explanationRo={
                  isSecretCorrect
                    ? 'Extraordinar! TELNET este serviciul de conectare la distanță format din literele T-E-L-N-E-T din rebus!'
                    : 'Literele evidențiate cu violet din fiecare rând compun numele serviciului de conectare de la distanță (6 litere, începe cu T).'
                }
                explanationEn={
                  isSecretCorrect
                    ? 'Extraordinary! TELNET is the remote terminal service spelled by T-E-L-N-E-T!'
                    : 'The purple-highlighted letters from each row form the remote login service (6 letters, starts with T).'
                }
              />
            </div>
          )}

          <QuestionHint
            id="i3-crossword-telnet"
            hintRo="Răspunsurile rebusului sunt: 1. RETEA, 2. INTERNET, 3. CALCULATOR, 4. INFORMATICA, 5. EMAIL, 6. FTP. Literele de pe coloană formează T-E-L-N-E-T."
            hintEn="The answers are: 1. RETEA, 2. INTERNET, 3. CALCULATOR, 4. INFORMATICA, 5. EMAIL, 6. FTP. Column spells TELNET."
          />
        </div>
      </div>

      {/* Page Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={20}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={userInputs.some((u) => u.length > 0) || secretWordGuess.length > 0}
        onProceed={handleProceed}
        onRetry={handleReset}
      />
    </div>
  );
};
