import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, UserX, Lock, LogOut } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface C1Level7Props {
  onPass: (score: number) => void;
}

interface ExamQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
}

export const C1Level7_CloudNetiquetteExam: React.FC<C1Level7Props> = ({ onPass }) => {
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
      question: 'Ce se întâmplă din punct de vedere tehnic atunci când lucrezi într-un document Google Docs în cloud?',
      options: [
        { id: 'A', text: 'Trebuie să apeși manual tasta F12 la fiecare 3 minute pentru a nu pierde textul.' },
        { id: 'B', text: 'Fiecare tastare este trimisă și salvată automat în câteva milisecunde pe serverele securizate din cloud.' },
        { id: 'C', text: 'Documentul se salvează doar pe monitorul fizic din laboratorul de informatică.' }
      ],
      correct: 'B',
      explanation: 'În Cloud Computing, salvarea este continuă și automată la fiecare literă tastată, eliminând riscul pierderii datelor la căderi de curent.'
    },
    {
      id: 2,
      question: 'Ce nivel de permisiune este indicat să acorzi unui coleg însărcinat exclusiv cu verificarea ortografică și feedback-ul de stil?',
      options: [
        { id: 'A', text: 'Editor complet, permițându-i să șteargă orice capitol fără avertizare.' },
        { id: 'B', text: 'Comentator (Commenter), permițându-i să propună sugestii și notițe fără a altera textul original.' },
        { id: 'C', text: 'Niciun acces, comunicând exclusiv prin mesaje vocale.' }
      ],
      correct: 'B',
      explanation: 'Rolul de Comentator protejează structura documentului de ștergeri accidentale și permite urmărirea clară a propunerilor.'
    },
    {
      id: 3,
      question: 'Cum recunoști în mod direct prezența unui coleg care editează simultan cu tine în Google Docs?',
      options: [
        { id: 'A', text: 'Apare un cursor colorat însoțit de eticheta cu numele său exact în locul unde acesta scrie.' },
        { id: 'B', text: 'Ecranul devine complet negru până când colegul termină de tastat.' },
        { id: 'C', text: 'Calculatorul emite un semnal sonor de sirenă la fiecare literă nouă.' }
      ],
      correct: 'A',
      explanation: 'Fiecare colaborator activ este reprezentat printr-o culoare unică pe avatar și pe cursorul din text.'
    },
    {
      id: 4,
      question: 'Care este modalitatea corectă de a delega o sarcină urgentă unui membru al echipei în interiorul documentului?',
      options: [
        { id: 'A', text: 'Scrii cu majuscule în titlu numele colegului.' },
        { id: 'B', text: 'Inserezi un comentariu cu mențiunea @adresa_coleg și bifezi „Atribuiți lui...”.' },
        { id: 'C', text: 'Ștergi tot ce a scris colegul până acum ca să îl forțezi să răspundă.' }
      ],
      correct: 'B',
      explanation: 'Mențiunea @ generează o notificare automată prin e-mail și atribuie oficial sarcina în panoul de activitate.'
    },
    {
      id: 5,
      question: 'Dacă un coleg șterge din greșeală o secțiune importantă cu 15 minute în urmă, care este soluția corectă?',
      options: [
        { id: 'A', text: 'Rescrierea manuală de la zero din memorie a întregului referat.' },
        { id: 'B', text: 'Deschiderea Istoricului Versiunilor (Version History) și apăsarea butonului „Restaurați această versiune”.' },
        { id: 'C', text: 'Repornirea calculatorului și reinstalarea browserului Google Chrome.' }
      ],
      correct: 'B',
      explanation: 'Istoricul versiunilor păstrează toate variantele documentului și permite restaurarea instantanee la starea anterioară incidentului.'
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
        [qId]: `Incorect! ${targetQ.explanation}`
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Nivelul 7 • Examen Final de Sinteză</span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Netichetă Colaborativă, Securitate Cloud & Examenul Final
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Recapitulare completă a Unității 3 (Manual Art Klett pag. 48–56): bune practici de securitate digitală, etica lucrului în echipă sincronă și testul final pentru acordarea Diplomei de Coordonator Proiecte Cloud.
        </p>
      </div>

      {/* Netiquette 4 Golden Rules Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
            <ShieldCheck className="w-4 h-4" /> Regula 1: Respect
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nu șterge niciodată paragraful unui coleg; folosește comentarii politicoase sau modul de Sugestii dacă propui o formulare mai bună.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
            <Lock className="w-4 h-4" /> Regula 2: Link Sigur
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nu posta niciodată linkuri de editare pe grupuri publice de social media (TikTok, Discord public) pentru a preveni vandalismul.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
            <UserX className="w-4 h-4" /> Regula 3: GDPR
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Protejează datele private: nu include numere de telefon, adrese de domiciliu sau date confidențiale în referate partajate.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
            <LogOut className="w-4 h-4" /> Regula 4: Delogare
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Când termini lucrul pe calculatorul laboratorului de informatică, apasă întotdeauna pe Deconectare (Sign Out) din contul școlar.
          </p>
        </div>
      </div>

      {/* 5-Question Comprehensive Exam with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Examenul Oficial de Sinteză (5 Întrebări Curriculare)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {Object.keys(answers).filter((id) => answers[Number(id)] === examQuestions.find(q => q.id === Number(id))?.correct).length} / 5 Rezolvate
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
                    Întrebarea {q.id} din 5
                  </span>
                  {isAnswered && (
                    <span className="text-xs font-mono font-bold">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Corect (+20 pct)
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Incorect
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-100">{q.question}</p>

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
                      <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
                    </button>
                  ))}
                </div>

                {cooldown > 0 && (
                  <div className="text-xs text-amber-400 font-mono animate-pulse">
                    Cooldown activ: {cooldown}s până la următoarea încercare. {errorMsg}
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
                Felicitări! Toate cele 5 întrebări ale examenului au fost validate!
              </span>
            ) : (
              <span>Răspunde corect la toate cele 5 întrebări pentru a finaliza misiunea și a primi diploma.</span>
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
            <span>Finalizează Misiunea 3A (+100 XP & Diplomă)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
