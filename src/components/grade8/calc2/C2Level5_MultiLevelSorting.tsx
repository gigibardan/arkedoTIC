import React, { useState } from 'react';
import {
  ArrowDownAZ,
  ArrowUpZA,
  ListFilter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Layers,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C2Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

interface StudentRecord {
  id: number;
  name: string;
  gradeClass: string;
  gpa: number;
  city: string;
}

export const C2Level5_MultiLevelSorting: React.FC<C2Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Multi-level sorting controls
  const [level1Field, setLevel1Field] = useState<'gradeClass' | 'gpa' | 'name'>('gradeClass');
  const [level1Order, setLevel1Order] = useState<'asc' | 'desc'>('asc');

  const [level2Field, setLevel2Field] = useState<'gpa' | 'name' | 'gradeClass'>('gpa');
  const [level2Order, setLevel2Order] = useState<'desc' | 'asc'>('desc');

  // Initial table data
  const initialData: StudentRecord[] = [
    { id: 1, name: 'Popescu Andrei', gradeClass: '8B', gpa: 9.80, city: 'București' },
    { id: 2, name: 'Ionescu Maria', gradeClass: '8A', gpa: 9.50, city: 'Cluj-Napoca' },
    { id: 3, name: 'Radu Elena', gradeClass: '8A', gpa: 10.00, city: 'Timișoara' },
    { id: 4, name: 'Dumitru Vlad', gradeClass: '8B', gpa: 10.00, city: 'Iași' },
    { id: 5, name: 'Stoica Bogdan', gradeClass: '8A', gpa: 8.90, city: 'Brașov' },
    { id: 6, name: 'Constantin Daria', gradeClass: '8B', gpa: 9.20, city: 'Constanța' },
  ];

  const [students, setStudents] = useState<StudentRecord[]>(initialData);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleApplySort = () => {
    sounds.playCorrect();
    const sorted = [...students].sort((a, b) => {
      // Level 1 Comparison
      let comp1 = 0;
      if (level1Field === 'gradeClass') comp1 = a.gradeClass.localeCompare(b.gradeClass);
      else if (level1Field === 'gpa') comp1 = a.gpa - b.gpa;
      else if (level1Field === 'name') comp1 = a.name.localeCompare(b.name);

      if (level1Order === 'desc') comp1 = -comp1;
      if (comp1 !== 0) return comp1;

      // Level 2 Comparison (Then by)
      let comp2 = 0;
      if (level2Field === 'gradeClass') comp2 = a.gradeClass.localeCompare(b.gradeClass);
      else if (level2Field === 'gpa') comp2 = a.gpa - b.gpa;
      else if (level2Field === 'name') comp2 = a.name.localeCompare(b.name);

      if (level2Order === 'desc') comp2 = -comp2;
      return comp2;
    });

    setStudents(sorted);
  };

  const handleResetSort = () => {
    sounds.playClick();
    setStudents(initialData);
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'thenBy') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'expandSelection') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'descending') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'thenBy';
  const isQ2Correct = q2Answer === 'expandSelection';
  const isQ3Correct = q3Answer === 'descending';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-emerald-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Textbook 2025 • Pages 24–25' : 'Manual Art Klett 2025 • Pag. 24–25'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ListFilter className="w-8 h-8 text-teal-400" />
              {lang === 'en'
                ? 'Level 5: Multi-Level Sorting (Sort by → Then by)'
                : 'Nivelul 5: Sortarea Multicriterială (Sort by → Then by)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'How do you order a student table first by Class (8A, 8B) and then by GPA descending? Discover the Custom Sort dialog and avoid the "Expand the Selection" pitfall!'
                : 'Cum ordonezi un tabel de elevi întâi după Clasă (8A, 8B) și apoi după Medie descrescător? Descoperă fereastra Custom Sort și capcana „Expand the Selection”!'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Module 1B' : 'Modulul 1B'}</div>
            <div className="text-2xl font-black text-teal-400">5 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Multi-Level Sort Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en' ? 'Custom Sort Dialog Simulator' : 'Simulator Fereastra „Sortare Particularizată” (Custom Sort)'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Configure sort levels just like in the official Excel dialog (Textbook p. 24)'
                  : 'Configurează nivelurile de sortare ca în dialogul oficial Excel (Manual pag. 24)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplySort}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'Apply Sort (OK)' : 'Aplică Sortarea (OK)'}</span>
            </button>
            <button
              type="button"
              onClick={handleResetSort}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:text-white transition cursor-pointer border border-slate-700"
            >
              {lang === 'en' ? 'Reset' : 'Resetează'}
            </button>
          </div>
        </div>

        {/* Custom Sort Configuration Panel (Emulating Excel Dialog) */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          {/* Level 1: Sort by */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400 w-28">
                {lang === 'en' ? '1. Sort by:' : '1. Sort by (După):'}
              </span>
              <select
                value={level1Field}
                onChange={(e) => setLevel1Field(e.target.value as any)}
                className="bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-400"
              >
                <option value="gradeClass">{lang === 'en' ? 'Column: Class (8A, 8B)' : 'Coloana: Clasa (8A, 8B)'}</option>
                <option value="gpa">{lang === 'en' ? 'Column: Overall GPA' : 'Coloana: Media Generală'}</option>
                <option value="name">{lang === 'en' ? 'Column: Student Name' : 'Coloana: Nume & Prenume'}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">{lang === 'en' ? 'Order:' : 'Ordine:'}</span>
              <select
                value={level1Order}
                onChange={(e) => setLevel1Order(e.target.value as any)}
                className="bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-400"
              >
                <option value="asc">{lang === 'en' ? 'A to Z / Smallest to Largest' : 'A la Z / Cel mai mic la cel mai mare'}</option>
                <option value="desc">{lang === 'en' ? 'Z to A / Largest to Smallest' : 'Z la A / Cel mai mare la cel mai mic'}</option>
              </select>
            </div>
          </div>

          {/* Level 2: Then by */}
          <div className="p-3 rounded-xl bg-slate-900 border border-teal-500/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-teal-300 w-28">
                {lang === 'en' ? '2. Then by:' : '2. Then by (Apoi):'}
              </span>
              <select
                value={level2Field}
                onChange={(e) => setLevel2Field(e.target.value as any)}
                className="bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400"
              >
                <option value="gpa">{lang === 'en' ? 'Column: Overall GPA' : 'Coloana: Media Generală'}</option>
                <option value="name">{lang === 'en' ? 'Column: Student Name' : 'Coloana: Nume & Prenume'}</option>
                <option value="gradeClass">{lang === 'en' ? 'Column: Class (8A, 8B)' : 'Coloana: Clasa (8A, 8B)'}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">{lang === 'en' ? 'Order:' : 'Ordine:'}</span>
              <select
                value={level2Order}
                onChange={(e) => setLevel2Order(e.target.value as any)}
                className="bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400"
              >
                <option value="desc">{lang === 'en' ? 'Largest to Smallest (Descending)' : 'De la cel mai mare la cel mai mic (Descrescător)'}</option>
                <option value="asc">{lang === 'en' ? 'Smallest to Largest (Ascending)' : 'De la cel mai mic la cel mai mare (Crescător)'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Sorted Table */}
        <div className="border border-slate-700 rounded-2xl overflow-x-auto bg-slate-950 font-mono text-xs shadow-inner">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <th className="p-2.5 text-center w-12 bg-slate-850">#</th>
                <th className="p-2.5">{lang === 'en' ? 'Student Full Name' : 'Nume & Prenume Elev'}</th>
                <th className="p-2.5 text-center">{lang === 'en' ? 'Class' : 'Clasa'}</th>
                <th className="p-2.5 text-center">{lang === 'en' ? 'Overall GPA' : 'Media Generală'}</th>
                <th className="p-2.5">{lang === 'en' ? 'City' : 'Oraș'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {students.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-2.5 text-center font-bold text-slate-500 bg-slate-900/50">{idx + 1}</td>
                  <td className="p-2.5 font-medium text-white">{st.name}</td>
                  <td className="p-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      st.gradeClass === '8A' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {st.gradeClass}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-black text-amber-300">
                    {st.gpa.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-slate-400">{st.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Warning Box: Expand the selection */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white font-bold">
              {lang === 'en' ? 'Critical textbook warning (p. 25):' : 'Atenționarea critică a manualului (pag. 25):'}
            </strong>
            <p className="leading-relaxed">
              {lang === 'en'
                ? 'If you select only the GPA column and click Sort, Excel asks: "Expand the selection?". If you mistakenly pick "Continue with current selection", the grades will shuffle independently of the students\' names, ruining the real gradebook records! Always choose "Expand the selection".'
                : 'Dacă selectezi doar coloana de Medii și dai Sort, Excel întreabă: Expand the selection?. Dacă răspunzi greșit cu Continue with current selection, notele se vor amesteca independent de numele elevilor, distrugând complet situația reală a clasei! Alege întotdeauna Expand the selection.'}
            </p>
          </div>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Pedagogical Check: Multi-Level Sorting' : 'Verificare Pedagogică: Sortare Multicriterială'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Answer the 3 textbook questions correctly to unlock the hands-on lab'
                : 'Răspunde corect la cele 3 întrebări din manual pentru a debloca atelierul practic'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. What is the name of the button used to add a second sorting criterion in the "Sort" dialog box?'
                : '1. Cum se numește butonul prin care adaugi un al doilea criteriu de sortare în caseta de dialog „Sort”?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'thenBy',
                textRo: 'Add Level (care creează rândul Then by / Apoi după)',
                textEn: 'Add Level (which creates the "Then by" row)'
              },
              {
                id: 'deleteAll',
                textRo: 'Delete Sheet (Șterge foaia)',
                textEn: 'Delete Sheet'
              },
              {
                id: 'randomSort',
                textRo: 'Shuffle aleatoriu',
                textEn: 'Random Shuffle'
              },
              {
                id: 'paintGreen',
                textRo: 'Umplere cu vopsea verde',
                textEn: 'Fill with green paint'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'thenBy'
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
            hintRo="Butonul 'Add Level' introduce un nou nivel de sortare numit 'Then by'."
            hintEn="The 'Add Level' button introduces a new sorting tier called 'Then by'."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! The "Add Level" button adds a new hierarchical level ("Then by"), allowing ties from the first criterion to be resolved.'
                  : 'Corect! Butonul \'Add Level\' adaugă un nou nivel ierarhic (\'Then by\'), permițând departajarea valorilor egale din primul nivel.'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. If you select a single column in a multi-column table, which option in the warning dialog must be chosen to preserve row integrity?'
                : '2. Dacă selectezi o singură coloană dintr-un tabel cu mai multe date, ce opțiune din dialogul de avertizare trebuie aleasă pentru a nu rupe legătura dintre rânduri?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'expandSelection',
                textRo: 'Extinde selecția (Expand the selection)',
                textEn: 'Expand the selection'
              },
              {
                id: 'continueSingle',
                textRo: 'Continuă doar cu selecția curentă (Continue with current selection)',
                textEn: 'Continue with current selection'
              },
              {
                id: 'cancelExcel',
                textRo: 'Închiderea calculatorului',
                textEn: 'Shut down computer'
              },
              {
                id: 'formatNumber',
                textRo: 'Transformă totul în procente',
                textEn: 'Convert everything to percentages'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'expandSelection'
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
            hintRo="Opțiunea 'Expand the selection' extinde automat sortarea la întregul rând de date pentru fiecare elev."
            hintEn="The 'Expand the selection' option automatically expands sorting across the entire row of student data."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                lang === 'en'
                  ? 'Excellent! "Expand the selection" guarantees table data integrity, moving the entire row (Name, Class, GPA) together to its new position.'
                  : 'Excelent! \'Expand the selection\' garantează integritatea datelor tabelului, mutând întregul rând (Nume, Clasă, Medie) pe noua poziție.'
              }
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. How do you sort the student GPA column to display top honors (the highest grade) on the very first row?'
                : '3. Cum se sortează coloana cu Mediile elevilor pentru a afișa premiantul I (cea mai mare notă) pe primul rând?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'descending',
                textRo: 'Descrescător (De la cel mai mare la cel mai mic / Largest to Smallest)',
                textEn: 'Descending (Largest to Smallest)'
              },
              {
                id: 'ascending',
                textRo: 'Crescător (De la cel mai mic la cel mai mare / Smallest to Largest)',
                textEn: 'Ascending (Smallest to Largest)'
              },
              {
                id: 'alphabetical',
                textRo: 'Alfabetic după prenumele bunicilor',
                textEn: 'Alphabetically by grandparents\' names'
              },
              {
                id: 'constant',
                textRo: 'Fără nicio sortare',
                textEn: 'No sorting at all'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'descending'
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
            hintRo="Dacă vrei ca nota 10 să fie prima și nota 5 să fie ultima, mergi de la mare la mic."
            hintEn="If you want grade 10 to be first and grade 5 to be last, sort from highest to lowest."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={
                lang === 'en'
                  ? 'Exactly! Descending sort (Largest to Smallest) brings the highest numeric values to the top, which is the standard way school rankings are generated.'
                  : 'Exact! Sortarea descrescătoare (Largest to Smallest) aduce în vârf cele mai mari valori numerice, fiind modul standard de întocmire a clasamentelor școlare.'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={5}
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
