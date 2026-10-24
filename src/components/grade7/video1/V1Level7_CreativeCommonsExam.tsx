import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Film, Globe, Scale, BookOpen, AlertCircle } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface V1Level7Props {
  onPass: (score: number) => void;
}

interface ExamQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
}

export const V1Level7_CreativeCommonsExam: React.FC<V1Level7Props> = ({ onPass }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [cooldowns, setCooldowns] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Cooldown timers management
  React.useEffect(() => {
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
      question: 'Care este diferența critică dintre fișierul de proiect (.vpj) și fișierul video final exportat (.mp4)?',
      options: [
        { id: 'A', text: 'Fișierul .vpj este doar un document text cu instrucțiuni și referințe către fișierele de pe disc, în timp ce .mp4 conține cadrele video gata randate ce pot rula pe orice dispozitiv.' },
        { id: 'B', text: 'Nu este nicio diferență; ambele sunt fișiere video complete ce pot fi trimise direct pe WhatsApp.' },
        { id: 'C', text: 'Fișierul .vpj conține doar sunetul, iar .mp4 conține doar subtitrările.' }
      ],
      correct: 'A',
      explanation: 'Un fișier de proiect conține doar coordonatele montajului. Dacă trimiți profesorului doar fișierul .vpj fără clipurile video sursă, el nu va putea vedea nimic!'
    },
    {
      id: 2,
      question: 'Ce semnifică licența „Creative Commons — CC-BY” aplicată unei melodii pe care vrei să o folosești într-un montaj video școlar?',
      options: [
        { id: 'A', text: 'Melodia este secretă și trebuie ștearsă din calculator după prima ascultare.' },
        { id: 'B', text: 'Ai dreptul să folosești și să distribui gratuit melodia, cu o singură condiție obligatorie: să menționezi numele autorului (atribuire / BY) în genericul final.' },
        { id: 'C', text: 'Trebuie să plătești autorului o taxă de 50 de euro la fiecare vizualizare pe YouTube.' }
      ],
      correct: 'B',
      explanation: 'CC-BY (Attribution) este una dintre cele mai generoase licențe libere. Condiția esențială este acordarea creditului cuvenit creatorului operei în generic.'
    },
    {
      id: 3,
      question: 'Deschizi proiectul VideoPad a doua zi și toate cadrele afișează un ecran roșu cu textul „Media Offline”. Care este cauza?',
      options: [
        { id: 'A', text: 'Monitorul calculatorului s-a defectat fizic peste noapte.' },
        { id: 'B', text: 'Fișierele video brute au fost șterse, mutate în alt folder sau redenumite, iar VideoPad nu le mai găsește la calea inițială salvată.' },
        { id: 'C', text: 'Internetul din școală a fost oprit și VideoPad nu mai poate comunica cu sateliții.' }
      ],
      correct: 'B',
      explanation: 'VideoPad nu stochează videoclipurile în interiorul fișierului de proiect. Păstrează mereu toate materialele (video, poze, melodii) în același folder bine organizat!'
    },
    {
      id: 4,
      question: 'Care este tasta rapidă pentru a împărți un clip în două segmente la poziția cursorului (Split) și cum se numește ștergerea care închide spațiul gol?',
      options: [
        { id: 'A', text: 'Tasta L pentru Split, urmată de comanda Ripple Delete (ștergere cu ondulare).' },
        { id: 'B', text: 'Tasta Space pentru Split, urmată de comanda Copy-Paste.' },
        { id: 'C', text: 'Tasta F1 pentru Split, urmată de oprirea calculatorului de la buton.' }
      ],
      correct: 'A',
      explanation: 'Tasta L este scurtătura standard pentru Split în VideoPad, iar Ripple Delete elimină instantaneu spațiul gol fără a crea ecrane negre.'
    },
    {
      id: 5,
      question: 'Care sunt caracteristicile rezoluției video standard Full HD 1080p pe format de ecran lat (Widescreen)?',
      options: [
        { id: 'A', text: '640x480 pixeli și raport de aspect 4:3 (ecran pătrat vechi).' },
        { id: 'B', text: '1920 pixeli pe orizontală x 1080 linii pe verticală, cu raport de aspect 16:9.' },
        { id: 'C', text: '1080x1920 pixeli vertical, rezervat exclusiv pentru telefoane mobile (9:16).' }
      ],
      correct: 'B',
      explanation: 'Standardul televizat și de monitor Full HD este 1920x1080 pixeli cu raportul 16:9, oferind o definiție impecabilă a fiecărui detaliu.'
    }
  ];

  const handleSelect = (qId: number, optId: string) => {
    if (cooldowns[qId] > 0 || answers[qId] === examQuestions.find((q) => q.id === qId)?.correct) return;

    const question = examQuestions.find((q) => q.id === qId);
    if (!question) return;

    if (optId === question.correct) {
      sounds.playSuccess();
      setAnswers((prev) => ({ ...prev, [qId]: optId }));
      setErrors((prev) => ({ ...prev, [qId]: '' }));
    } else {
      sounds.playFailure();
      setCooldowns((prev) => ({ ...prev, [qId]: 5 }));
      setErrors((prev) => ({ ...prev, [qId]: question.explanation }));
    }
  };

  const answeredCorrectCount = examQuestions.filter((q) => answers[q.id] === q.correct).length;
  const allCorrect = answeredCorrectCount === examQuestions.length;

  const handleFinalPass = () => {
    if (!allCorrect) return;
    sounds.playLevelComplete();
    setIsPassed(true);
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/60 via-pink-900/40 to-slate-900 p-6 rounded-2xl border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 text-rose-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>Nivelul 7 • Certificare Finală & Drepturi de Autor (Manual pag. 46–47)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Examenul de Regie & Licențe Creative Commons
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          Felicitări pentru realizarea montajului! În acest nivel final, demonstrăm că stăpânești atât latura tehnică (rezoluții, piste, tăieri chirurgicale), cât și legislația privind{' '}
          <strong className="text-white">dreptul de autor (Copyright)</strong> și licențele libere{' '}
          <strong className="text-white">Creative Commons (CC)</strong>.
        </p>
      </div>

      {/* Creative Commons Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
            <span className="font-mono bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">CC-BY</span>
            <span>Atribuire</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Permite reutilizarea gratuită, dar impune menționarea obligatorie a autorului în genericul de final.
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-pink-400 font-bold text-xs">
            <span className="font-mono bg-pink-950 px-1.5 py-0.5 rounded border border-pink-800">CC-NC</span>
            <span>Necomercial</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Permite utilizarea operei doar în scopuri necomerciale (școlare, educative, personale).
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <span className="font-mono bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">CC-SA</span>
            <span>Distribuire Identică</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Orice operă derivată trebuie distribuită sub aceeași licență deschisă ca și originalul.
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
            <span className="font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">CC0</span>
            <span>Domeniu Public</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Fără drepturi rezervate. Opera poate fi utilizată, modificată și partajată liber de oricine.
          </p>
        </div>
      </div>

      {/* Exam Questions Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Testul Oficial de Competențe Video (5 Întrebări)</span>
          </div>
          <div className="text-xs font-mono">
            Răspunsuri Corecte: <span className="text-emerald-400 font-bold">{answeredCorrectCount}</span> / 5
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {examQuestions.map((q) => {
            const isCorrect = answers[q.id] === q.correct;
            const cooldown = cooldowns[q.id] || 0;
            const errorMsg = errors[q.id] || '';

            return (
              <div key={q.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
                <div className="font-semibold text-sm text-white">
                  {q.id}. {q.question}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={cooldown > 0 || isCorrect}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`p-3 rounded-xl border text-xs text-left transition cursor-pointer flex items-center gap-3 ${
                        answers[q.id] === opt.id
                          ? opt.id === q.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                      } ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-rose-400 text-xs shrink-0">
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>

                {cooldown > 0 && (
                  <div className="text-xs text-rose-400 font-mono flex items-center gap-2 mt-1 animate-pulse">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Explicație Pedagogică: {errorMsg} (Așteaptă {cooldown}s pentru a reîncerca)</span>
                  </div>
                )}

                {isCorrect && (
                  <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Graduation Banner & Pass Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Rezolvă toate cele 5 întrebări pentru a absolvi Misiunea 2B și a obține Diploma de Regizor Digital.</span>
        </div>

        <button
          type="button"
          disabled={!allCorrect || isPassed}
          onClick={handleFinalPass}
          className={`px-8 py-3.5 rounded-xl font-extrabold text-sm transition flex items-center gap-2 cursor-pointer ${
            allCorrect && !isPassed
              ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white shadow-xl shadow-rose-600/40 ring-2 ring-rose-400/50'
              : isPassed
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 cursor-default'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          {isPassed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Award className="w-5 h-5" />}
          <span>{isPassed ? 'Examen Promovat!' : 'Finalizează Misiunea 2B & Revendică Diploma'}</span>
        </button>
      </div>
    </div>
  );
};
