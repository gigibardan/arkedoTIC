import React, { useState } from 'react';
import {
  MessageSquare,
  Smile,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  HeartHandshake,
  ShieldCheck,
  UserX,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { TeacherTip } from '../TeacherTip';
import { QuestionHint } from '../internet1/QuestionHint';
import { AnswerExplanation } from '../internet1/AnswerExplanation';
import { PageNavigationFooter } from '../internet1/PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface I2Level4_NetiquetteProps {
  onCompletePage: (score: number) => void;
}

export const I2Level4_Netiquette: React.FC<I2Level4_NetiquetteProps> = ({
  onCompletePage,
}) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Task 1: All caps meaning
  const [q1AllCaps, setQ1AllCaps] = useState<string>('');
  // Task 2: Netiquette Sorting (4 scenarios)
  const [scenarios, setScenarios] = useState<{
    s1: 'good' | 'bad' | '';
    s2: 'good' | 'bad' | '';
    s3: 'good' | 'bad' | '';
    s4: 'good' | 'bad' | '';
  }>({
    s1: '',
    s2: '',
    s3: '',
    s4: '',
  });
  // Task 3: Cyberbullying reaction
  const [q3Bullying, setQ3Bullying] = useState<string>('');

  const isQ1Correct = q1AllCaps === 'shouting';
  const isQ2Correct =
    scenarios.s1 === 'good' &&
    scenarios.s2 === 'bad' &&
    scenarios.s3 === 'good' &&
    scenarios.s4 === 'bad';
  const isQ3Correct = q3Bullying === 'tell_adult';

  const correctCount = (isQ1Correct ? 1 : 0) + (isQ2Correct ? 1 : 0) + (isQ3Correct ? 1 : 0);
  const totalQuestions = 3;
  const pageScore = correctCount === 3 ? 15 : correctCount === 2 ? 10 : correctCount === 1 ? 5 : 0;

  const handleProceed = () => {
    sounds.playVictory();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    sounds.playClick();
    setQ1AllCaps('');
    setScenarios({ s1: '', s2: '', s3: '', s4: '' });
    setQ3Bullying('');
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-pink-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider border border-pink-500/30 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
              {lang === 'en' ? 'Module 3B • Page 4 of 6' : 'Modulul 3B • Pagina 4 din 6'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Textbook pp. 43–44' : 'Manual pag. 43–44'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight mb-2">
            {lang === 'en'
              ? '4. Netiquette: The Code of Online Courtesy'
              : '4. Neticheta: Regulile de Bun-Simț în Lumea Digitală'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'en'
              ? 'Netiquette (Network + Etiquette) defines respectful communication in classroom group chats, forum comments, and online gaming. Learn why shouting in ALL CAPS is rude, how to protect friends’ privacy, and what to do against cyberbullying!'
              : 'Neticheta (Network + Etiquette) reprezintă codul manierelor elegante pe internet: în grupurile de clasă, mesagerii și jocuri online. Află de ce scrierea cu MAJUSCULE este considerată țipăt, cum protejăm intimitatea prietenilor și cum răspundem la cyberbullying!'}
          </p>
        </div>
      </div>

      {/* Teacher Tip Pill */}
      <TeacherTip
        title={
          lang === 'en'
            ? 'Teacher Tip: The 3 Cardinal Rules of Netiquette (pp. 43–44)'
            : 'Sfatul Profesorului: Cele 3 Reguli Cardinali de Netichetă (pag. 43–44)'
        }
        text={
          lang === 'en'
            ? '• Remember the Human: Behind every screen and avatar is a real person with genuine feelings. Never say online what you wouldn’t dare say politely to their face! • ALL CAPS = SCREAMING: Typing entire sentences with Caps Lock ON is perceived across the global Internet as aggressive screaming! • Privacy Consent: Never post or forward pictures, videos, or private remarks of classmates without their explicit permission!'
            : '• Omul din spatele ecranului: În spatele fiecărui profil se află un om adevărat. Nu scrie niciodată online ceva ce nu ai avea curajul să spui politicos față în față! • MAJUSCULE = ȚIPĂT: Scrierea unui text integral cu Caps Lock aprins este interpretată pe tot globul ca o răbufnire agresivă sau un țipăt nepoliticos! • Acordul pentru poze: Nu publica și nu redistribui fotografii sau filmulețe cu colegii fără acordul lor explicit!'
        }
        extra={
          lang === 'en'
            ? 'Cyberbullying Alert: If someone insults or harasses you or a friend online, do NOT retaliate with insults. Take a screenshot, block the user, and immediately inform a teacher, parent, or trusted adult!'
            : 'Sfat Anti-Bullying: Dacă cineva te jignește sau hărțuiește online, nu răspunde cu aceeași monedă. Fă o captură de ecran (screenshot), blochează utilizatorul și anunță imediat profesorul sau părinții!'
        }
      />

      {/* Task 1: Scrierea cu MAJUSCULE */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center text-xs font-mono font-black">
              1
            </span>
            {lang === 'en'
              ? 'In online messaging, typing text with ALL CAPS (Caps Lock) is equivalent to:'
              : 'În comunicarea pe internet, scrierea unui text exclusiv cu MAJUSCULE (Caps Lock) echivalează cu:'}
          </h3>
          <span className="text-xs font-mono text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-md border border-pink-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ1AllCaps('shouting');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1AllCaps === 'shouting'
                ? 'bg-pink-950/80 border-pink-500 text-white shadow-md ring-1 ring-pink-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Screaming / Shouting Aggressively' : 'A) Țipăt / Strigăt Agresiv'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'It is perceived as shouting rudely at the recipient and creating tension.'
                : 'Este considerat un gest nepoliticos, agresiv, similar cu a țipa la celălalt.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1AllCaps('great_respect');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1AllCaps === 'great_respect'
                ? 'bg-pink-950/80 border-pink-500 text-white shadow-md ring-1 ring-pink-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Utmost Formal Respect' : 'B) Semn de Suprem Respect'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'An official mark of deep admiration reserved only for kings.'
                : 'O formulă nobilă de reverență rezervată ceremoniilor oficiale.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1AllCaps('secret_code');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1AllCaps === 'secret_code'
                ? 'bg-pink-950/80 border-pink-500 text-white shadow-md ring-1 ring-pink-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'C) Encrypted Military Code' : 'C) Cod Militar Criptat'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'A secret military cipher that makes the text unreadable to computers.'
                : 'Un cifru secret care împiedică serverele să citească mesajul.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q1-all-caps-hint"
          hintRo="În manualul de TIC (pag. 43), se specifică clar: literele mari transmit o senzație de ton ridicat și iritare, fiind complet nerecomandate în dialoguri normale!"
          hintEn="Textbook p. 43 clearly highlights: typing in ALL CAPS conveys a raised, agitated tone equivalent to shouting!"
        />

        {q1AllCaps && (
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanationRo={
              isQ1Correct
                ? 'Corect! Scrierea integrală cu litere mari este percepută universal în comunitatea online ca un țipăt zgomotos și lipsit de politețe.'
                : q1AllCaps === 'great_respect'
                ? 'Dimpotrivă, majusculele forțate transmit agresivitate și deranjează vizual cititorul, nefiind o dovadă de respect.'
                : 'Literele mari nu constituie un cod de criptare; ele sunt caractere standard din alfabetul ASCII/Unicode.'
            }
            explanationEn={
              isQ1Correct
                ? 'Spot on! Typing in ALL CAPS is globally recognized in netiquette standards as aggressive shouting.'
                : q1AllCaps === 'great_respect'
                ? 'On the contrary, all-caps text creates visual hostility rather than polite reverence.'
                : 'All-caps letters are plain standard glyphs, not cryptographic encryption.'
            }
          />
        )}
      </div>

      {/* Task 2: Netiquette Inspector (4 situații practice) */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center text-xs font-mono font-black">
              2
            </span>
            {lang === 'en'
              ? 'Netiquette Inspector: Classify 4 Classroom Group Chat Behaviors'
              : 'Inspectorul de Netichetă: Evaluează 4 comportamente în grupul clasei'}
          </h3>
          <span className="text-xs font-mono text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-md border border-pink-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="space-y-3">
          {/* S1 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">
                1. «Mulțumesc mult pentru tema trimisă, Andrei! O seară frumoasă!»
              </span>
              <span className="text-[11px] text-slate-400">
                Limbaj civilizat, recunoștință și urare de bun-simț.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setScenarios((prev) => ({ ...prev, s1: 'good' }));
                  sounds.playCorrect();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  scenarios.s1 === 'good'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Civilized ✓' : 'Civilizat ✓'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setScenarios((prev) => ({ ...prev, s1: 'bad' }));
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  scenarios.s1 === 'bad'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Toxic / Rude' : 'Nepoliticos'}
              </button>
            </div>
          </div>

          {/* S2 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">
                2. Postarea unei fotografii caraghioase cu un coleg din pauză, fără ca el să știe sau să-și dea acordul.
              </span>
              <span className="text-[11px] text-slate-400">
                Încălcarea intimității și risc de batjocură publică.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setScenarios((prev) => ({ ...prev, s2: 'good' }));
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  scenarios.s2 === 'good'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Civilized' : 'Civilizat'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setScenarios((prev) => ({ ...prev, s2: 'bad' }));
                  sounds.playCorrect();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  scenarios.s2 === 'bad'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Forbidden / Toxic ❌' : 'Interzis / Toxic ❌'}
              </button>
            </div>
          </div>

          {/* S3 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">
                3. «Nu sunt de acord cu părerea ta despre joc, dar îți respect punctul de vedere.»
              </span>
              <span className="text-[11px] text-slate-400">
                Dezacord exprimat calm și cu respect pentru opinia celuilalt.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setScenarios((prev) => ({ ...prev, s3: 'good' }));
                  sounds.playCorrect();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  scenarios.s3 === 'good'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Civilized ✓' : 'Civilizat ✓'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setScenarios((prev) => ({ ...prev, s3: 'bad' }));
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  scenarios.s3 === 'bad'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Toxic' : 'Nepoliticos'}
              </button>
            </div>
          </div>

          {/* S4 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">
                4. Trimiterea a 50 de stickere și mesaje repetate («Spam») la ora 23:00 pe grupul de teme.
              </span>
              <span className="text-[11px] text-slate-400">
                Spam nocturn care deranjează somnul și notificările tuturor membrilor.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setScenarios((prev) => ({ ...prev, s4: 'good' }));
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  scenarios.s4 === 'good'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Civilized' : 'Civilizat'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setScenarios((prev) => ({ ...prev, s4: 'bad' }));
                  sounds.playCorrect();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  scenarios.s4 === 'bad'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Forbidden / Spam ❌' : 'Interzis / Spam ❌'}
              </button>
            </div>
          </div>
        </div>

        {scenarios.s1 && scenarios.s2 && scenarios.s3 && scenarios.s4 && (
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanationRo={
              isQ2Correct
                ? 'Superb! Ai identificat corect bunele maniere (mulțumiri politicoase, respectul în dezacord) și comportamentele toxice (postarea pozelor fără acord, spamul nocturn).'
                : 'Reanalizează situațiile: respectul reciproc și politețea sunt civilizate, în timp ce pozele fără acord și spamul sunt abateri grave de la netichetă.'
            }
            explanationEn={
              isQ2Correct
                ? 'Superb! You correctly identified respectful etiquette vs unacceptable privacy violations and spamming.'
                : 'Re-evaluate: polite greetings and constructive debate are proper netiquette, while non-consensual photos and spamming violate rules.'
            }
          />
        )}
      </div>

      {/* Task 3: Reacția la Cyberbullying */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center text-xs font-mono font-black">
              3
            </span>
            {lang === 'en'
              ? 'What is the correct protocol if you witness or experience Cyberbullying online?'
              : 'Care este protocolul corect de acțiune dacă ești martor sau victimă a hărțuirii online (Cyberbullying)?'}
          </h3>
          <span className="text-xs font-mono text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-md border border-pink-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ3Bullying('tell_adult');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q3Bullying === 'tell_adult'
                ? 'bg-pink-950/80 border-pink-500 text-white shadow-md ring-1 ring-pink-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Save Proof, Block & Tell an Adult' : 'A) Salvează Dovada, Blochează & Anunță un Adult'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Take a screenshot, do not insult back, block the harasser, and immediately tell parents or teachers.'
                : 'Fă captură de ecran (screenshot), nu răspunde cu jigniri, blochează agresorul și anunță imediat părinții sau profesorul.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ3Bullying('insult_back');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q3Bullying === 'insult_back'
                ? 'bg-pink-950/80 border-pink-500 text-white shadow-md ring-1 ring-pink-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Insult them back even louder' : 'B) Jignește-l înapoi și mai agresiv'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Reply with worse insults in public to win the argument.'
                : 'Scrie jigniri mai grave pe grup pentru a-i demonstra că ești mai puternic.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q3-bullying-hint"
          hintRo="Regula de aur a siguranței digitale: NICIODATĂ nu escalada un conflict jignind înapoi. Dovada salvată + blocarea + sprijinul unui adult rezolvă problema în siguranță!"
          hintEn="Golden rule: Never escalate with retaliation. Screenshot evidence + blocking + notifying a trusted adult is the safest protocol!"
        />

        {q3Bullying && (
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanationRo={
              isQ3Correct
                ? 'Excelent! Păstrarea dovezilor prin capturi de ecran și raportarea către adulți de încredere (profesori, părinți) stopează hărțuirea fără a te pune în pericol.'
                : 'Răspunsul cu jigniri nu face decât să amplifice conflictul și te poate transforma chiar pe tine într-un agresor sancționabil conform regulamentului școlar.'
            }
            explanationEn={
              isQ3Correct
                ? 'Spot on! Documenting evidence via screenshots, blocking the user, and seeking adult support safely halts cyberbullying.'
                : 'Retaliating with insults worsens the hostility and can turn you into an offender subject to school disciplinary actions.'
            }
          />
        )}
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={correctCount > 0}
        onProceed={handleProceed}
        onRetry={handleReset}
      />
    </div>
  );
};
