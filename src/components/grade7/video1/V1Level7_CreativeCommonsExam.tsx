import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Film, Globe, Scale, BookOpen, AlertCircle } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface V1Level7Props {
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

export const V1Level7_CreativeCommonsExam: React.FC<V1Level7Props> = ({ onPass }) => {
  const { lang } = useLanguage();
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
      questionRo: 'Care este diferența critică dintre fișierul de proiect (.vpj) și fișierul video final exportat (.mp4)?',
      questionEn: 'What is the critical difference between a project file (.vpj) and an exported final video file (.mp4)?',
      options: [
        {
          id: 'A',
          textRo: 'Fișierul .vpj este doar un document text cu instrucțiuni și referințe către fișierele de pe disc, în timp ce .mp4 conține cadrele video gata randate ce pot rula pe orice dispozitiv.',
          textEn: 'The .vpj file is merely an instruction document referencing source files on disk, whereas .mp4 contains fully rendered video frames playable on any device.'
        },
        {
          id: 'B',
          textRo: 'Nu este nicio diferență; ambele sunt fișiere video complete ce pot fi trimise direct pe WhatsApp.',
          textEn: 'There is no difference; both are complete video files that can be sent straight to chat apps.'
        },
        {
          id: 'C',
          textRo: 'Fișierul .vpj conține doar sunetul, iar .mp4 conține doar subtitrările.',
          textEn: 'The .vpj file only contains sound, while .mp4 contains only subtitle tracks.'
        }
      ],
      correct: 'A',
      explanationRo: 'Un fișier de proiect conține doar coordonatele montajului. Dacă trimiți profesorului doar fișierul .vpj fără clipurile video sursă, el nu va putea vedea nimic!',
      explanationEn: 'A project file stores only editing pointers and markers. If you send only the .vpj file without source clips, nothing can be played back!'
    },
    {
      id: 2,
      questionRo: 'Ce semnifică licența „Creative Commons — CC-BY” aplicată unei melodii pe care vrei să o folosești într-un montaj video școlar?',
      questionEn: 'What does a "Creative Commons — CC-BY" license signify for a music track used in a school video?',
      options: [
        {
          id: 'A',
          textRo: 'Melodia este secretă și trebuie ștearsă din calculator după prima ascultare.',
          textEn: 'The music is confidential and must be wiped from disk after first playback.'
        },
        {
          id: 'B',
          textRo: 'Ai dreptul să folosești și să distribui gratuit melodia, cu o singură condiție obligatorie: să menționezi numele autorului (atribuire / BY) în genericul final.',
          textEn: 'You are permitted to use and share the song free of charge, under one strict condition: you must give proper attribution (credit the author) in the end credits.'
        },
        {
          id: 'C',
          textRo: 'Trebuie să plătești autorului o taxă de 50 de euro la fiecare vizualizare pe YouTube.',
          textEn: 'You must pay the artist a 50 Euro fee per viewer hit on video platforms.'
        }
      ],
      correct: 'B',
      explanationRo: 'CC-BY (Attribution) este una dintre cele mai generoase licențe libere. Condiția esențială este acordarea creditului cuvenit creatorului operei în generic.',
      explanationEn: 'CC-BY (Attribution) is among the most permissive open licenses. The non-negotiable rule is crediting the artist properly in the credits.'
    },
    {
      id: 3,
      questionRo: 'Deschizi proiectul VideoPad a doua zi și toate cadrele afișează un ecran roșu cu textul „Media Offline”. Care este cauza?',
      questionEn: 'You reopen your VideoPad project the next day and clips show a red warning reading "Media Offline". What happened?',
      options: [
        {
          id: 'A',
          textRo: 'Monitorul calculatorului s-a defectat fizic peste noapte.',
          textEn: 'The computer monitor physically malfunctioned overnight.'
        },
        {
          id: 'B',
          textRo: 'Fișierele video brute au fost șterse, mutate în alt folder sau redenumite, iar VideoPad nu le mai găsește la calea inițială salvată.',
          textEn: 'Raw source video files were deleted, moved to another directory, or renamed, so VideoPad cannot locate them at the saved filepaths.'
        },
        {
          id: 'C',
          textRo: 'Internetul din școală a fost oprit și VideoPad nu mai poate comunica cu sateliții.',
          textEn: 'School internet was turned off so VideoPad cannot contact satellites.'
        }
      ],
      correct: 'B',
      explanationRo: 'VideoPad nu stochează videoclipurile în interiorul fișierului de proiect. Păstrează mereu toate materialele (video, poze, melodii) în același folder bine organizat!',
      explanationEn: 'VideoPad does not embed media inside project files. Always organize all media assets (videos, photos, music) in a dedicated project directory!'
    },
    {
      id: 4,
      questionRo: 'Care este tasta rapidă pentru a împărți un clip în două segmente la poziția cursorului (Split) și cum se numește ștergerea care închide spațiul gol?',
      questionEn: 'Which shortcut splits a clip into two segments at the playhead cursor, and what is the deletion method that automatically closes the gap?',
      options: [
        {
          id: 'A',
          textRo: 'Tasta L pentru Split, urmată de comanda Ripple Delete (ștergere cu ondulare).',
          textEn: 'Key L for Split, followed by Ripple Delete to close the gap.'
        },
        {
          id: 'B',
          textRo: 'Tasta Space pentru Split, urmată de comanda Copy-Paste.',
          textEn: 'Spacebar for Split, followed by Copy-Paste.'
        },
        {
          id: 'C',
          textRo: 'Tasta F1 pentru Split, urmată de oprirea calculatorului de la buton.',
          textEn: 'F1 for Split, followed by powering off the machine.'
        }
      ],
      correct: 'A',
      explanationRo: 'Tasta L este scurtătura standard pentru Split în VideoPad, iar Ripple Delete elimină instantaneu spațiul gol fără a crea ecrane negre.',
      explanationEn: 'L is the standard Split shortcut in VideoPad, while Ripple Delete pulls subsequent clips tight to avoid black voids.'
    },
    {
      id: 5,
      questionRo: 'Care sunt caracteristicile rezoluției video standard Full HD 1080p pe format de ecran lat (Widescreen)?',
      questionEn: 'What are the technical specs of standard Full HD 1080p widescreen video?',
      options: [
        {
          id: 'A',
          textRo: '640x480 pixeli și raport de aspect 4:3 (ecran pătrat vechi).',
          textEn: '640x480 pixels with a 4:3 aspect ratio (legacy square display).'
        },
        {
          id: 'B',
          textRo: '1920 pixeli pe orizontală x 1080 linii pe verticală, cu raport de aspect 16:9.',
          textEn: '1920 horizontal pixels by 1080 vertical lines, in a 16:9 aspect ratio.'
        },
        {
          id: 'C',
          textRo: '1080x1920 pixeli vertical, rezervat exclusiv pentru telefoane mobile (9:16).',
          textEn: '1080x1920 vertical pixels, strictly reserved for mobile reels (9:16).'
        }
      ],
      correct: 'B',
      explanationRo: 'Standardul televizat și de monitor Full HD este 1920x1080 pixeli cu raportul 16:9, oferind o definiție impecabilă a fiecărui detaliu.',
      explanationEn: 'The television and computer widescreen Full HD standard is 1920x1080 at 16:9, delivering pristine detail and sharp legibility.'
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
      setErrors((prev) => ({
        ...prev,
        [qId]: lang === 'ro' ? question.explanationRo : question.explanationEn
      }));
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
          <span>
            {lang === 'ro'
              ? 'Nivelul 7 • Certificare Finală & Drepturi de Autor (Manual pag. 46–47)'
              : 'Level 7 • Final Certification & Copyright Law (Textbook pp. 46–47)'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {lang === 'ro'
            ? 'Examenul de Regie & Licențe Creative Commons'
            : 'Director Exam & Creative Commons Licensing'}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Felicitări pentru realizarea montajului! În acest nivel final, demonstrăm că stăpânești atât latura tehnică (rezoluții, piste, tăieri chirurgicale), cât și legislația privind{' '}
              <strong className="text-white">dreptul de autor (Copyright)</strong> și licențele libere{' '}
              <strong className="text-white">Creative Commons (CC)</strong>.
            </>
          ) : (
            <>
              Congratulations on mastering post-production! In this final certification level, prove your command over both technical execution (resolutions, multitrack, surgical splits) and media law surrounding{' '}
              <strong className="text-white">Copyright</strong> and open{' '}
              <strong className="text-white">Creative Commons (CC)</strong> licensing.
            </>
          )}
        </p>
      </div>

      {/* Creative Commons Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
            <span className="font-mono bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">CC-BY</span>
            <span>{lang === 'ro' ? 'Atribuire' : 'Attribution'}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Permite reutilizarea gratuită, dar impune menționarea obligatorie a autorului în genericul de final.'
              : 'Allows free remixing and reuse, provided full attribution is credited to the author in credits.'}
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-pink-400 font-bold text-xs">
            <span className="font-mono bg-pink-950 px-1.5 py-0.5 rounded border border-pink-800">CC-NC</span>
            <span>{lang === 'ro' ? 'Necomercial' : 'Non-Commercial'}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Permite utilizarea operei doar în scopuri necomerciale (școlare, educative, personale).'
              : 'Allows usage solely for non-profit and non-commercial purposes (educational, school, personal).'}
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <span className="font-mono bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">CC-SA</span>
            <span>{lang === 'ro' ? 'Distribuire Identică' : 'Share-Alike'}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Orice operă derivată trebuie distribuită sub aceeași licență deschisă ca și originalul.'
              : 'Any derivative creation must be distributed under the identical open license terms.'}
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
            <span className="font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">CC0</span>
            <span>{lang === 'ro' ? 'Domeniu Public' : 'Public Domain'}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Fără drepturi rezervate. Opera poate fi utilizată, modificată și partajată liber de oricine.'
              : 'No rights reserved. Free for anyone to use, modify, and repurpose worldwide with zero restrictions.'}
          </p>
        </div>
      </div>

      {/* Exam Questions Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>
              {lang === 'ro'
                ? 'Testul Oficial de Competențe Video (5 Întrebări)'
                : 'Official Video Competency Exam (5 Questions)'}
            </span>
          </div>
          <div className="text-xs font-mono">
            {lang === 'ro' ? 'Răspunsuri Corecte:' : 'Correct Answers:'}{' '}
            <span className="text-emerald-400 font-bold">{answeredCorrectCount}</span> / 5
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
                  {q.id}. {lang === 'ro' ? q.questionRo : q.questionEn}
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
                      <span>{lang === 'ro' ? opt.textRo : opt.textEn}</span>
                    </button>
                  ))}
                </div>

                {cooldown > 0 && (
                  <div className="text-xs text-rose-400 font-mono flex items-center gap-2 mt-1 animate-pulse">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === 'ro' ? 'Explicație Pedagogică:' : 'Pedagogical Explanation:'} {errorMsg}{' '}
                      {lang === 'ro'
                        ? `(Așteaptă ${cooldown}s pentru a reîncerca)`
                        : `(Wait ${cooldown}s to retry)`}
                    </span>
                  </div>
                )}

                {isCorrect && (
                  <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{lang === 'ro' ? q.explanationRo : q.explanationEn}</span>
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
          <span>
            {lang === 'ro'
              ? 'Rezolvă toate cele 5 întrebări pentru a absolvi Misiunea 2B și a obține Diploma de Regizor Digital.'
              : 'Answer all 5 exam questions correctly to pass Mission 2B and claim your Digital Director Certificate.'}
          </span>
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
          <span>
            {isPassed
              ? (lang === 'ro' ? 'Examen Promovat!' : 'Exam Passed!')
              : (lang === 'ro' ? 'Finalizează Misiunea 2B & Revendică Diploma' : 'Complete Mission 2B & Claim Certificate')}
          </span>
        </button>
      </div>
    </div>
  );
};
