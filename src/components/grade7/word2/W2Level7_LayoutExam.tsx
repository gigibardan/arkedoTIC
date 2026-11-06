import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  GraduationCap,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level7_LayoutExam: React.FC<W2Level7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState<string | null>(null);
  const [q5Answer, setQ5Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleSelectAnswer = (qKey: 'q1' | 'q2' | 'q3' | 'q4' | 'q5', answer: string, correct: string) => {
    if (isLocked(qKey)) return;

    if (qKey === 'q1') setQ1Answer(answer);
    if (qKey === 'q2') setQ2Answer(answer);
    if (qKey === 'q3') setQ3Answer(answer);
    if (qKey === 'q4') setQ4Answer(answer);
    if (qKey === 'q5') setQ5Answer(answer);

    if (answer === correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qKey);
    }
  };

  const isQ1Correct = q1Answer === 'b';
  const isQ2Correct = q2Answer === 'c';
  const isQ3Correct = q3Answer === 'b';
  const isQ4Correct = q4Answer === 'a';
  const isQ5Correct = q5Answer === 'c';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct, isQ4Correct, isQ5Correct].filter(Boolean).length;
  const allCorrect = correctCount === 5;

  const calculateFinalScore = () => {
    // 5 questions * 20 pts = 100 max score
    return correctCount * 20;
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900/50 via-indigo-900/50 to-blue-900/50 border border-sky-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>{lang === 'ro' ? 'Misiunea 1B • Nivelul 7 din 7' : 'Mission 1B • Level 7 of 7'}</span>
              <span>•</span>
              <span>{lang === 'ro' ? 'Examen Final Sumativ' : 'Summative Final Exam'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Marele Examen de Machetare & Tipografie Românească'
                : 'Comprehensive Layout & Typography Exam'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              {lang === 'ro'
                ? 'Demonstrează că stăpânești toate conceptele de tehnoredactare din clasa a VII-a: geometria paginii A4, marginea de îndosariere, antetul și subsolul cărților, ruperile de secțiune pentru documente hibride, tabelele profesionale și notele de subsol.'
                : 'Demonstrate your mastery of 7th grade typesetting concepts: A4 page geometry, gutter margins, book headers and footers, section breaks for hybrid layouts, professional tables, and footnotes.'}
            </p>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-sky-400 self-start sm:self-auto">
            <Trophy className="w-10 h-10" />
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">{lang === 'ro' ? 'Răspunsuri Corecte:' : 'Correct Answers:'}</span>
          <span className={`font-black text-sm ${allCorrect ? 'text-emerald-400' : 'text-sky-300'}`}>
            {lang === 'ro'
              ? `${correctCount} / 5 Întrebări Rezolvate (${correctCount * 20} puncte)`
              : `${correctCount} / 5 Questions Solved (${correctCount * 20} points)`}
          </span>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {/* Q1 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message={lang === 'ro'
              ? 'Timp de reflecție: reanalizează dimensiunile fizice A4 și rolul marginii de îndosariere!'
              : 'Reflection cooldown: review A4 physical dimensions and the role of gutter margins!'}
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>{lang === 'ro' ? 'ÎNTREBAREA 1 DIN 5' : 'QUESTION 1 OF 5'}</span>
            <span>{lang === 'ro' ? '20 PUNCTE' : '20 POINTS'}</span>
          </div>
          <span className="text-sm font-bold text-white">
            {lang === 'ro'
              ? 'Care sunt dimensiunile formatului internațional A4 și ce rol îndeplinește „Marginea de îndosariere” (Gutter)?'
              : 'What are the dimensions of the international A4 standard and what role does the "Gutter margin" fulfill?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              {
                id: 'a',
                labelRo: '100 × 200 mm; lasă spațiu pentru imagini de fundal colorate',
                labelEn: '100 × 200 mm; leaves space for colorful background graphics',
              },
              {
                id: 'b',
                labelRo: '210 × 297 mm; rezervă spațiu suplimentar în stânga/interior pentru perforare și legare în dosar',
                labelEn: '210 × 297 mm; reserves extra clearance on the left/inside edge for hole-punching and folder binding',
              },
              {
                id: 'c',
                labelRo: '216 × 279 mm; mărește automat spațiul dintre cuvintele fiecărui rând',
                labelEn: '216 × 279 mm; automatically increases spacing between words in each line',
              },
              {
                id: 'd',
                labelRo: '297 × 420 mm; forțează textul să fie scris cu litere majuscule',
                labelEn: '297 × 420 mm; forces text into capitalized uppercase letters',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q1') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q1Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>
          <QuestionHint
            hint={lang === 'ro'
              ? '210 x 297 mm este standardul A4; marginea de îndosariere previne tăierea textului de către inelele dosarului.'
              : '210 × 297 mm is standard A4; gutter margins prevent text from being obscured by binder rings.'}
          />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation={lang === 'ro'
              ? 'Corect! Formatul A4 are 210 × 297 mm, iar marginea de îndosariere (Gutter margin) de 1–1.5 cm asigură spațiul fizic necesar găurilor perforatorului sau spiralei fără a afecta textul.'
              : 'Correct! The A4 sheet is 210 × 297 mm, and the 1–1.5 cm gutter margin reserves physical clearance for hole punches or spiral binding without cutting into page margins.'}
          />
        </div>

        {/* Q2 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message={lang === 'ro'
              ? 'Timp de reflecție: gândește-te la opțiunea Ribbon dedicată primei pagini dintr-un referat!'
              : 'Reflection cooldown: think about the ribbon option dedicated to the first page of a report!'}
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>{lang === 'ro' ? 'ÎNTREBAREA 2 DIN 5' : 'QUESTION 2 OF 5'}</span>
            <span>{lang === 'ro' ? '20 PUNCTE' : '20 POINTS'}</span>
          </div>
          <span className="text-sm font-bold text-white">
            {lang === 'ro'
              ? 'Cum procedăm corect pentru a numerota automat un referat de 10 pagini fără ca numărul de pagină să apară pe copertă?'
              : 'How do we correctly auto-number a 10-page report so that the page number does not appear on the cover?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              {
                id: 'a',
                labelRo: 'Tastăm de mână cifra 1 pe pagina 2, cifra 2 pe pagina 3 etc.',
                labelEn: 'Manually type digit 1 on page 2, digit 2 on page 3, etc.',
              },
              {
                id: 'b',
                labelRo: 'Ștergem manual numărul de pe copertă cu tasta Delete sau Backspace',
                labelEn: 'Manually delete the number from the cover using Delete or Backspace',
              },
              {
                id: 'c',
                labelRo: 'Bifăm opțiunea „Primă pagină diferită” (Different First Page) din fila Antet și Subsol',
                labelEn: 'Check "Different First Page" in the Header & Footer tab',
              },
              {
                id: 'd',
                labelRo: 'Micșorăm marginea inferioară a copertei la 0 cm',
                labelEn: 'Reduce the bottom margin of the cover page to 0 cm',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q2') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q2Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>
          <QuestionHint
            hint={lang === 'ro'
              ? 'Dacă ștergi manual numărul dintr-un subsol comun, acesta se va șterge automat de pe toate paginile! Opțiunea dedicată este Different First Page.'
              : 'If you manually delete the number in a shared footer, it will delete from all pages! The dedicated feature is Different First Page.'}
          />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation={lang === 'ro'
              ? 'Excelent! Opțiunea „Primă pagină diferită” decuplează antetul și subsolul primei pagini de restul documentului, permițând ca pe copertă să nu apară numărul de pagină, în timp ce pagina 2 va continua numerotarea corectă.'
              : 'Excellent! "Different First Page" decouples the cover header/footer from the rest of the document, hiding the number on the cover while page 2 continues correct numbering.'}
          />
        </div>

        {/* Q3 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message={lang === 'ro'
              ? 'Timp de reflecție: amintește-ți de ce este nevoie de o barieră de secțiune pentru a schimba orientarea!'
              : 'Reflection cooldown: remember why a section barrier is needed to alter page orientation!'}
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>{lang === 'ro' ? 'ÎNTREBAREA 3 DIN 5' : 'QUESTION 3 OF 5'}</span>
            <span>{lang === 'ro' ? '20 PUNCTE' : '20 POINTS'}</span>
          </div>
          <span className="text-sm font-bold text-white">
            {lang === 'ro'
              ? 'Cum putem configura un document astfel încât doar Pagina 5 (ce conține un tabel amplu) să fie în Vedere (Landscape), iar restul paginilor să rămână în Portret?'
              : 'How can we configure a document so only Page 5 (containing a wide table) is in Landscape, while remaining pages stay in Portrait?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              {
                id: 'a',
                labelRo: 'Apăsăm Ctrl+Enter înainte și după tabel și alegem Landscape',
                labelEn: 'Press Ctrl+Enter before and after the table and choose Landscape',
              },
              {
                id: 'b',
                labelRo: 'Inserăm o Rupere de Secțiune: Pagina Următoare înainte și după Pagina 5, apoi rotim doar acea secțiune',
                labelEn: 'Insert a Section Break: Next Page before and after Page 5, then rotate only that section',
              },
              {
                id: 'c',
                labelRo: 'Micșorăm dimensiunea fontului la 4 pt pentru a încăpea tabelul pe foaia verticală',
                labelEn: 'Shrink font size to 4 pt so the table fits on vertical sheets',
              },
              {
                id: 'd',
                labelRo: 'Salvăm tabelul ca imagine PNG și îl rotim cu mouse-ul',
                labelEn: 'Save the table as a PNG image and rotate it with the mouse',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q3')}
                onClick={() => handleSelectAnswer('q3', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q3') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q3Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>
          <QuestionHint
            hint={lang === 'ro'
              ? 'Orientarea paginii este o proprietate a secțiunii. Numai Section Break (Next Page) izolează o pagină într-o secțiune de sine stătătoare.'
              : 'Page orientation is a section-level attribute. Only Section Break (Next Page) isolates a page into an independent section.'}
          />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation={lang === 'ro'
              ? 'Corect! Doar Ruperile de Secțiune (Section Break - Next Page) permit schimbarea orientării fizice între Portret și Landscape pe parcursul aceluiași fișier Word.'
              : 'Correct! Only Section Breaks (Section Break - Next Page) allow modifying physical orientation between Portrait and Landscape within the same Word document.'}
          />
        </div>

        {/* Q4 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q4'] || 0}
            message={lang === 'ro'
              ? 'Timp de reflecție: reamintește-ți regula de aur a alinierii valorilor numerice!'
              : 'Reflection cooldown: recall the golden rule for numerical alignment!'}
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>{lang === 'ro' ? 'ÎNTREBAREA 4 DIN 5' : 'QUESTION 4 OF 5'}</span>
            <span>{lang === 'ro' ? '20 PUNCTE' : '20 POINTS'}</span>
          </div>
          <span className="text-sm font-bold text-white">
            {lang === 'ro'
              ? 'Care este standardul tipografic corect pentru alinierea valorilor numerice (note, prețuri, punctaje) într-un tabel?'
              : 'What is the correct typographic standard for aligning numerical values (grades, prices, scores) in a table?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              {
                id: 'a',
                labelRo: 'Aliniate la Dreapta (Right Align), astfel încât unitățile, zecile și virgulele zecimale să se alinieze vertical',
                labelEn: 'Right-aligned, ensuring units, tens, and decimal points line up vertically',
              },
              {
                id: 'b',
                labelRo: 'Aliniate obligatoriu la Stânga, la fel ca orice text narativ',
                labelEn: 'Left-aligned by default, identical to standard paragraph text',
              },
              {
                id: 'c',
                labelRo: 'Aliniate pe diagonală prin spații repetate',
                labelEn: 'Diagonally aligned using repeated spacebar presses',
              },
              {
                id: 'd',
                labelRo: 'Scrise cu caractere minuscule fără punctuație',
                labelEn: 'Typed in lowercase letters without punctuation',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q4')}
                onClick={() => handleSelectAnswer('q4', opt.id, 'a')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q4Answer === opt.id
                    ? opt.id === 'a'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q4') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q4Answer === opt.id && (opt.id === 'a' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>
          <QuestionHint
            hint={lang === 'ro'
              ? 'Alinierea la dreapta permite cititorului să compare instantaneu mărimile numerice.'
              : 'Right alignment allows readers to instantly compare numerical magnitudes.'}
          />
          <AnswerExplanation
            isCorrect={isQ4Correct}
            explanation={lang === 'ro'
              ? 'Exact! În orice tabel profesional, numerele se aliniază întotdeauna la Dreapta, garantând o citire clară și alinierea precisă a zecimalelor.'
              : 'Exactly! In any professional table, numbers are always right-aligned, guaranteeing easy visual scanning and decimal precision.'}
          />
        </div>

        {/* Q5 */}
        <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q5'] || 0}
            message={lang === 'ro'
              ? 'Timp de reflecție: reamintește-ți diferența dintre Footnote și Endnote și scurtătura aferentă!'
              : 'Reflection cooldown: recall the difference between Footnote and Endnote and its keyboard shortcut!'}
          />
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold">
            <span>{lang === 'ro' ? 'ÎNTREBAREA 5 DIN 5' : 'QUESTION 5 OF 5'}</span>
            <span>{lang === 'ro' ? '20 PUNCTE' : '20 POINTS'}</span>
          </div>
          <span className="text-sm font-bold text-white">
            {lang === 'ro'
              ? 'Unde se afișează o Notă de Subsol (Footnote) în comparație cu o Notă de Final (Endnote) și ce scurtătură se folosește în Word?'
              : 'Where does a Footnote appear compared to an Endnote, and what shortcut is used in Word?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {[
              {
                id: 'a',
                labelRo: 'Ambele apar în meniul Fișier; scurtătura este Ctrl + P',
                labelEn: 'Both appear in the File menu; shortcut is Ctrl + P',
              },
              {
                id: 'b',
                labelRo: 'Nota de subsol este pe copertă, iar nota de final în bara de căutare; scurtătura este F1',
                labelEn: 'Footnotes appear on the cover, endnotes in the search bar; shortcut is F1',
              },
              {
                id: 'c',
                labelRo: 'Nota de subsol este la baza paginii curente (Alt+Ctrl+F); nota de final este colectată la sfârșitul lucrării',
                labelEn: 'Footnotes sit at the bottom of the current page (Alt+Ctrl+F); endnotes are gathered at the very end of the document',
              },
              {
                id: 'd',
                labelRo: 'Nota de subsol se șterge automat la tipărire; scurtătura este Shift + Esc',
                labelEn: 'Footnotes delete automatically when printing; shortcut is Shift + Esc',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q5')}
                onClick={() => handleSelectAnswer('q5', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q5Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q5') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q5Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>
          <QuestionHint
            hint={lang === 'ro'
              ? 'Alt + Ctrl + F introduce instant nota la baza paginii curente (Footnote).'
              : 'Alt + Ctrl + F instantly inserts a footnote at the bottom of the current page.'}
          />
          <AnswerExplanation
            isCorrect={isQ5Correct}
            explanation={lang === 'ro'
              ? 'Corect! Nota de subsol (Footnote, Alt+Ctrl+F) apare la baza paginii curente sub linia de separare de 5 cm, în timp ce nota de final (Endnote) este centralizată la sfârșitul întregului document.'
              : 'Correct! Footnotes (Alt+Ctrl+F) appear at the bottom of the current page below the separator line, whereas endnotes are gathered at the conclusion of the entire document.'}
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={allCorrect}
        onNext={() => {
          sounds.playFanfare();
          onCompletePage(calculateFinalScore());
        }}
        promptText={
          allCorrect
            ? (lang === 'ro'
                ? 'Felicitări depline! Ai obținut punctaj maxim la Examenul de Machetare! Apasă pentru a revendica Marea Diplomă a Misiunii 1B!'
                : 'Full congratulations! You achieved maximum score on the Layout Exam! Click to claim the Grand Mission 1B Diploma!')
            : (lang === 'ro'
                ? `Răspunde corect la toate cele 5 întrebări ale examenului pentru a primi diploma! (${correctCount}/5 corecte).`
                : `Answer all 5 exam questions correctly to claim your diploma! (${correctCount}/5 correct).`)
        }
      />
    </div>
  );
};
