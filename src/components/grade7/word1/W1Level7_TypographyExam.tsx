import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Trophy,
  GraduationCap,
  FileCheck,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W1Level7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W1Level7_TypographyExam: React.FC<W1Level7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState<string | null>(null);
  const [q5Answer, setQ5Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'correct_serif_sans') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'correct_ro_standards') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'correct_ruler_spacing') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const handleQ4 = (id: string) => {
    if (isLocked('q4')) return;
    setQ4Answer(id);
    if (id === 'correct_styles_toc') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q4', 5);
    }
  };

  const handleQ5 = (id: string) => {
    if (isLocked('q5')) return;
    setQ5Answer(id);
    if (id === 'correct_pdf_export') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q5', 5);
    }
  };

  const isQ1Correct = q1Answer === 'correct_serif_sans';
  const isQ2Correct = q2Answer === 'correct_ro_standards';
  const isQ3Correct = q3Answer === 'correct_ruler_spacing';
  const isQ4Correct = q4Answer === 'correct_styles_toc';
  const isQ5Correct = q5Answer === 'correct_pdf_export';

  let totalScore = 0;
  if (isQ1Correct) totalScore += 20;
  if (isQ2Correct) totalScore += 20;
  if (isQ3Correct) totalScore += 20;
  if (isQ4Correct) totalScore += 20;
  if (isQ5Correct) totalScore += 20;

  const canProceed = totalScore >= 70;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>NIVELUL 7 DIN 7 • MAREA EVALUARE FINALĂ A UNITĂȚII 1A</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Examenul Tehnoredactorului & Certificarea de Tipar
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Demonstrează că stăpânești toate conceptele fundamentale: anatomia fonturilor, standardul românesc SR 13411, geometria paragrafelor pe riglă, stilurile ierarhice și exportul universal în format PDF.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-amber-500/40 text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Punctaj Examen</span>
              <span className="text-2xl font-black font-mono text-amber-400">{totalScore} / 100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Un coleg dorește să creeze un afiș publicitar pentru proiector și o carte tipărită de 150 de pagini. Ce recomandare de fonturi este corectă conform principiilor tipografice?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'correct_serif_sans',
                text: 'Font Sans-serif (Calibri, Arial) pentru afișul proiectat (lizibilitate de la distanță) și font Serif (Times New Roman, Georgia) pentru corpul cărții tipărite.',
              },
              {
                id: 'all_comic',
                text: 'Comic Sans atât pentru carte, cât și pentru afiș, deoarece este cel mai formal font din lume.',
              },
              {
                id: 'all_mono',
                text: 'Consolas peste tot, deoarece textele literare trebuie redactate ca un cod sursă C++.',
              },
              {
                id: 'inverted',
                text: 'Serif pentru ecranul telefonului și Sans-serif doar pentru cărțile academice.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'correct_serif_sans'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Gândește-te la mediul de afișare: ecranele digitale preferă liniile drepte Sans-serif, iar paginile de hârtie dense au nevoie de serife pentru a ghida ochiul."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Sans-serif oferă claritate geometrică pe ecrane și panouri, în timp ce Serif oferă continuitate optică rândurilor dense tipărite pe hârtie."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Care dintre următoarele fragmente respectă cu strictețe toate normele tipografiei românești (SR 13411, punctuație și ghilimele)?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'correct_ro_standards',
                text: 'Elevii au exclamat: „România este minunată!”, bucurându-se de excursie.',
              },
              {
                id: 'wrong_spaces',
                text: 'Elevii au exclamat : "România este minunată !" ,bucurându-se de excursie.',
              },
              {
                id: 'wrong_sedilla',
                text: 'Elevii au exclamat: „România este minunată!”, bucurându-se de excursie cu învăţătură şi voinţă.',
              },
              {
                id: 'wrong_quotes',
                text: 'Elevii au exclamat: "România este minunată!", bucurându -se de excursie.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'correct_ro_standards'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Verifică două puncte lipite de cuvânt, ghilimelele „99 jos / 99 sus” și virgula de după semnul de exclamare."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Perfect! Fragmentul corect utilizează diacritice cu virgulă dedesubt, ghilimele românești conforme și semne de punctuație lipite de cuvântul precedent urmate de un spațiu."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Cum configurezi corect un alineat academic de 1.25 cm și o distanță vizuală plăcută între două paragrafe fără a folosi tasta Enter?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'correct_ruler_spacing',
                text: 'Tragi triunghiul superior de pe riglă (First Line Indent) la 1.25 cm și setezi proprietatea „Spațiu după” (Spacing After) la 6 pt în caseta Paragraf.',
              },
              {
                id: 'spaces_bar',
                text: 'Apeși de 10 ori pe bara de spațiu la începutul fiecărui rând și apeși de 3 ori tasta Enter între paragrafe.',
              },
              {
                id: 'hanging_only',
                text: 'Tragi triunghiul de Hanging Indent la 5 cm și micșorezi fontul.',
              },
              {
                id: 'table_hack',
                text: 'Introduci un tabel cu celule invizibile pe fiecare pagină.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'correct_ruler_spacing'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Rigla digitală are triunghiul superior (First Line Indent) dedicat primului rând, iar spațierea paragrafelor se reglează în puncte (pt)."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! Bara de spațiu și apăsarea Enter-ului sunt greșeli grosolane. Triunghiul de pe riglă și setarea Spacing After garantează o machetă stabilă."
            />
          )}
        </div>

        {/* Q4 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              4. Profesorul cere ca referatul să aibă un Cuprins automat (Table of Contents). Ce trebuie să faci înainte de a genera cuprinsul?
            </h3>
            {cooldowns.q4 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q4} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'correct_styles_toc',
                text: 'Să aplici stilurile predefinite Titlu 1 (Heading 1) și Titlu 2 (Heading 2) pe numele fiecărui capitol și subcapitol din document.',
              },
              {
                id: 'manual_dots',
                text: 'Să tastezi puncte repetate manual pe tastatură și să cauți paginile manual pe foaie.',
              },
              {
                id: 'just_bold',
                text: 'Este suficient să îngroși textul cu tasta Bold (Ctrl+B), Word știe automat ce ai gândit.',
              },
              {
                id: 'delete_pages',
                text: 'Să ștergi toate numerele de pagină din subsol.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q4')}
                onClick={() => handleQ4(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q4Answer === option.id
                    ? option.id === 'correct_styles_toc'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Word nu poate ghici care este un titlu dacă doar l-ai îngroșat. Are nevoie de eticheta stilului Titlu 1 / Heading 1!"
          />
          {q4Answer && (
            <AnswerExplanation
              isCorrect={isQ4Correct}
              explanation="Corect! Cuprinsul automat se construiește scanând stilurile Heading din document. Fără stiluri, Word va raporta că nu a găsit intrări de cuprins."
            />
          )}
        </div>

        {/* Q5 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              5. De ce se recomandă salvarea/exportarea documentului final ca fișier PDF înainte de a-l trimite profesorului sau tipografiei?
            </h3>
            {cooldowns.q5 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q5} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'correct_pdf_export',
                text: 'Formatul PDF (Portable Document Format) păstrează fidel așezarea în pagină, fonturile și imaginile pe orice computer, fără riscul ca textul să se decaleze din cauza altei versiuni de Word.',
              },
              {
                id: 'editable_secret',
                text: 'PDF-ul permite oricui să șteargă textul autorului fără parolă.',
              },
              {
                id: 'video_file',
                text: 'Convertește automat textul într-un clip video cu sunet pe YouTube.',
              },
              {
                id: 'smaller_pixel',
                text: 'Transformă documentul într-o imagine alb-negru la rezoluție foarte scăzută.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q5')}
                onClick={() => handleQ5(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q5Answer === option.id
                    ? option.id === 'correct_pdf_export'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Gândește-te: ce se întâmplă dacă profesorul deschide un .docx pe telefon sau pe un laptop fără fonturile tale instalate?"
          />
          {q5Answer && (
            <AnswerExplanation
              isCorrect={isQ5Correct}
              explanation="Excelent! Standardul PDF înglobează fonturile și coordonatele grafice exacte, asigurând că documentul arată impecabil pe orice ecran și pe orice imprimantă."
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
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
