import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, UserX, Lock, LogOut } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface C1Level7Props {
  onPass: (score: number) => void;
}

interface ExamQuestion {
  id: number;
  questionRo: string;
  questionEn: string;
  options: { id: string; textRo: string; textEn: string }[];
  correct: string;
  explanationRo: string;
  explanationEn: string;
}

export const C1Level7_CloudNetiquetteExam: React.FC<C1Level7Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [cooldowns, setCooldowns] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns((prev) => {
        const next: Record<number, number> = {};
        let changed = false;
        for (const [k, v] of Object.entries(prev)) {
          const val = Number(v);
          if (val > 0) {
            next[Number(k)] = val - 1;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const examQuestions: ExamQuestion[] = [
    {
      id: 1,
      questionRo: 'Ce se întâmplă din punct de vedere tehnic atunci când lucrezi într-un document Google Docs în cloud?',
      questionEn: 'What happens under the hood when typing in a Google Docs cloud document?',
      options: [
        {
          id: 'A',
          textRo: 'Trebuie să apeși manual tasta F12 la fiecare 3 minute pentru a nu pierde textul.',
          textEn: 'You must press F12 manually every 3 minutes to avoid losing text.'
        },
        {
          id: 'B',
          textRo: 'Fiecare tastare este trimisă și salvată automat în câteva milisecunde pe serverele securizate din cloud.',
          textEn: 'Every keystroke is transmitted and autosaved in milliseconds onto resilient cloud servers.'
        },
        {
          id: 'C',
          textRo: 'Documentul se salvează doar pe monitorul fizic din laboratorul de informatică.',
          textEn: 'The document is saved exclusively to the local computer monitor memory.'
        }
      ],
      correct: 'B',
      explanationRo: 'În Cloud Computing, salvarea este continuă și automată la fiecare literă tastată, eliminând riscul pierderii datelor la căderi de curent.',
      explanationEn: 'In Cloud Computing, saving is continuous and automatic for every character, eliminating data loss during power outages.'
    },
    {
      id: 2,
      questionRo: 'Ce nivel de permisiune este indicat să acorzi unui coleg însărcinat exclusiv cu verificarea ortografică și feedback-ul de stil?',
      questionEn: 'What permission tier should be granted to a peer tasked strictly with proofreading and style feedback?',
      options: [
        {
          id: 'A',
          textRo: 'Editor complet, permițându-i să șteargă orice capitol fără avertizare.',
          textEn: 'Full Editor, allowing them to delete any section without warning.'
        },
        {
          id: 'B',
          textRo: 'Comentator (Commenter), permițându-i să propună sugestii și notițe fără a altera textul original.',
          textEn: 'Commenter, allowing them to propose suggestions and margin notes without altering master text.'
        },
        {
          id: 'C',
          textRo: 'Niciun acces, comunicând exclusiv prin mesaje vocale.',
          textEn: 'Zero access, communicating exclusively through voice notes.'
        }
      ],
      correct: 'B',
      explanationRo: 'Rolul de Comentator protejează structura documentului de ștergeri accidentale și permite urmărirea clară a propunerilor.',
      explanationEn: 'The Commenter role guards document integrity against accidental cuts and maintains clear audit tracking of proposals.'
    },
    {
      id: 3,
      questionRo: 'Cum recunoști în mod direct prezența unui coleg care editează simultan cu tine în Google Docs?',
      questionEn: 'How do you directly observe a collaborator co-editing with you in real time in Google Docs?',
      options: [
        {
          id: 'A',
          textRo: 'Apare un cursor colorat însoțit de eticheta cu numele său exact în locul unde acesta scrie.',
          textEn: 'A colored cursor with their name badge appears exactly at their active insertion point.'
        },
        {
          id: 'B',
          textRo: 'Ecranul devine complet negru până când colegul termină de tastat.',
          textEn: 'The display turns black until the collaborator stops typing.'
        },
        {
          id: 'C',
          textRo: 'Calculatorul emite un semnal sonor de sirenă la fiecare literă nouă.',
          textEn: 'The computer plays a siren beep on every new character.'
        }
      ],
      correct: 'A',
      explanationRo: 'Fiecare colaborator activ este reprezentat printr-o culoare unică pe avatar și pe cursorul din text.',
      explanationEn: 'Each active co-author is represented by a unique palette color across avatars and text carets.'
    },
    {
      id: 4,
      questionRo: 'Care este modalitatea corectă de a delega o sarcină urgentă unui membru al echipei în interiorul documentului?',
      questionEn: 'What is the standard procedure to assign an urgent task to a teammate inside a cloud document?',
      options: [
        {
          id: 'A',
          textRo: 'Scrii cu majuscule în titlu numele colegului.',
          textEn: 'Writing the teammate’s name in all capital letters in the title.'
        },
        {
          id: 'B',
          textRo: 'Inserezi un comentariu cu mențiunea @adresa_coleg și bifezi „Atribuiți lui...”.',
          textEn: 'Inserting a comment with an @teammate mention and checking "Assign to...".'
        },
        {
          id: 'C',
          textRo: 'Ștergi tot ce a scris colegul până acum ca să îl forțezi să răspundă.',
          textEn: 'Erasing their previous text to force a response.'
        }
      ],
      correct: 'B',
      explanationRo: 'Mențiunea @ generează o notificare automată prin e-mail și atribuie oficial sarcina în panoul de activitate.',
      explanationEn: 'The @mention triggers an automated notification and logs the item in the active task list.'
    },
    {
      id: 5,
      questionRo: 'Dacă un coleg șterge din greșeală o secțiune importantă cu 15 minute în urmă, care este soluția corectă?',
      questionEn: 'If a teammate mistakenly deletes a critical chapter 15 minutes ago, what is the correct remedy?',
      options: [
        {
          id: 'A',
          textRo: 'Rescrierea manuală de la zero din memorie a întregului referat.',
          textEn: 'Retyping the entire report from scratch by memory.'
        },
        {
          id: 'B',
          textRo: 'Deschiderea Istoricului Versiunilor (Version History) și apăsarea butonului „Restaurați această versiune”.',
          textEn: 'Opening Version History and clicking "Restore this version" on the preceding milestone.'
        },
        {
          id: 'C',
          textRo: 'Repornirea calculatorului și reinstalarea browserului Google Chrome.',
          textEn: 'Rebooting the PC and reinstalling the web browser.'
        }
      ],
      correct: 'B',
      explanationRo: 'Istoricul versiunilor păstrează toate variantele documentului și permite restaurarea instantanee la starea anterioară incidentului.',
      explanationEn: 'Version history archives every historical revision, enabling instantaneous rollback to before the mishap.'
    }
  ];

  const handleSelectOption = (qId: number, optId: string) => {
    if ((cooldowns[qId] || 0) > 0) return;

    setAnswers((prev) => ({ ...prev, [qId]: optId }));
    const targetQ = examQuestions.find((q) => q.id === qId)!;

    if (optId === targetQ.correct) {
      sounds.playCorrect();
      setErrors((prev) => ({ ...prev, [qId]: '' }));
    } else {
      sounds.playFailure();
      setCooldowns((prev) => ({ ...prev, [qId]: 5 }));
      setErrors((prev) => ({
        ...prev,
        [qId]: lang === 'ro' ? `Incorect! ${targetQ.explanationRo}` : `Incorrect! ${targetQ.explanationEn}`
      }));
    }
  };

  const allQuestionsCorrect = examQuestions.every((q) => answers[q.id] === q.correct);

  const handleCompleteExam = () => {
    if (!allQuestionsCorrect) return;
    setIsPassed(true);
    sounds.playLevelComplete();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'ro'
                ? 'Nivelul 7 • Examen Final de Sinteză'
                : 'Level 7 • Final Comprehensive Certification'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Netichetă Colaborativă, Securitate Cloud & Examenul Final'
                : 'Collaborative Netiquette, Cloud Security & Final Exam'}
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Recapitulare completă a Unității 3 (Manual Art Klett pag. 48–56): bune practici de securitate digitală, etica lucrului în echipă sincronă și testul final pentru acordarea Diplomei de Coordonator Proiecte Cloud.
            </>
          ) : (
            <>
              Comprehensive review of Unit 3 (Art Klett Textbook pp. 48–56): cyber safety standards, synchronous co-author etiquette, and the final exam granting the Cloud Project Coordinator Certificate.
            </>
          )}
        </p>
      </div>

      {/* Netiquette 4 Golden Rules Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
            <ShieldCheck className="w-4 h-4" />{' '}
            {lang === 'ro' ? 'Regula 1: Respect' : 'Rule 1: Respect'}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Nu șterge niciodată paragraful unui coleg; folosește comentarii politicoase sau modul de Sugestii dacă propui o formulare mai bună.'
              : 'Never overwrite a teammate’s paragraphs; leave respectful comments or employ Suggesting mode for edits.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
            <Lock className="w-4 h-4" />{' '}
            {lang === 'ro' ? 'Regula 2: Link Sigur' : 'Rule 2: Secure Links'}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Nu posta niciodată linkuri de editare pe grupuri publice de social media (TikTok, Discord public) pentru a preveni vandalismul.'
              : 'Never broadcast public edit links onto open social channels (Discord, TikTok) to prevent anonymous vandalism.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
            <UserX className="w-4 h-4" />{' '}
            {lang === 'ro' ? 'Regula 3: GDPR' : 'Rule 3: Privacy & GDPR'}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Protejează datele private: nu include numere de telefon, adrese de domiciliu sau date confidențiale în referate partajate.'
              : 'Guard personally identifiable data: exclude home addresses, private phone numbers, or credentials from shared coursework.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
            <LogOut className="w-4 h-4" />{' '}
            {lang === 'ro' ? 'Regula 4: Delogare' : 'Rule 4: Sign Out'}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Când termini lucrul pe calculatorul laboratorului de informatică, apasă întotdeauna pe Deconectare (Sign Out) din contul școlar.'
              : 'Always click Sign Out from your educational profile whenever stepping away from shared school computers.'}
          </p>
        </div>
      </div>

      {/* 5-Question Comprehensive Exam with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'ro'
                ? 'Examenul Oficial de Sinteză (5 Întrebări Curriculare)'
                : 'Official Certification Exam (5 Curriculum Questions)'}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {Object.keys(answers).filter((id) => answers[Number(id)] === examQuestions.find(q => q.id === Number(id))?.correct).length} / 5{' '}
            {lang === 'ro' ? 'Rezolvate' : 'Passed'}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {examQuestions.map((q) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCorrect = answers[q.id] === q.correct;
            const cooldown = cooldowns[q.id] || 0;
            const errorMsg = errors[q.id] || '';

            return (
              <div
                key={q.id}
                className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                    {lang === 'ro' ? `Întrebarea ${q.id} din 5` : `Question ${q.id} of 5`}
                  </span>
                  {isAnswered && (
                    <span className="text-xs font-mono font-bold">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                          {lang === 'ro' ? 'Corect (+20 pct)' : 'Correct (+20 pts)'}
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />{' '}
                          {lang === 'ro' ? 'Incorect' : 'Incorrect'}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-100">
                  {lang === 'ro' ? q.questionRo : q.questionEn}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.id}
                      disabled={cooldown > 0}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                        answers[q.id] === opt.id
                          ? opt.id === q.correct
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/80 border-rose-500 text-rose-200'
                          : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                      } ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                      {lang === 'ro' ? opt.textRo : opt.textEn}
                    </button>
                  ))}
                </div>

                {cooldown > 0 && (
                  <div className="text-xs text-amber-400 font-mono animate-pulse">
                    {lang === 'ro'
                      ? `Cooldown activ: ${cooldown}s până la următoarea încercare. ${errorMsg}`
                      : `Cooldown active: ${cooldown}s until next attempt. ${errorMsg}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Exam Completion Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {allQuestionsCorrect ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'ro'
                  ? 'Felicitări! Toate cele 5 întrebări ale examenului au fost validate!'
                  : 'Congratulations! All 5 exam questions have been successfully validated!'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la toate cele 5 întrebări pentru a finaliza misiunea și a primi diploma.'
                  : 'Answer all 5 questions correctly to graduate Mission 3A and earn your certificate.'}
              </span>
            )}
          </div>

          <button
            onClick={handleCompleteExam}
            disabled={!allQuestionsCorrect || isPassed}
            className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              allQuestionsCorrect && !isPassed
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'ro'
                ? 'Finalizează Misiunea 3A (+100 XP & Diplomă)'
                : 'Complete Mission 3A (+100 XP & Diploma)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
