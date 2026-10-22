import React, { useState } from 'react';
import {
  Quote,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  Bookmark,
  Plus,
  Trash2,
  FileText,
  ArrowRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level5_FootnotesEndnotes: React.FC<W2Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Footnote Management State
  const [activeFootnotes, setActiveFootnotes] = useState<{ id: string; anchor: string; text: string }[]>([
    {
      id: 'fn1',
      anchor: 'Johannes Gutenberg',
      text: 'Johannes Gensfleisch zur Laden zum Gutenberg (c. 1398–1468), inventatorul german al tiparului cu litere mobile din plumb.'
    }
  ]);

  const availableFootnotePresets = [
    {
      id: 'fn2',
      anchor: 'incunabul',
      text: 'Incunabul (din lat. incunabula = leagăn): exemplar tipărit în primii ani ai tiparului, mai exact până la 31 decembrie 1500.'
    },
    {
      id: 'fn3',
      anchor: 'Standardul ISO 216',
      text: 'Standard internațional adoptat în 1975, bazat pe raportul matematic 1:√2 dintre laturile dreptunghiului de hârtie A4.'
    }
  ];

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleAddFootnote = (preset: typeof availableFootnotePresets[0]) => {
    if (activeFootnotes.some((fn) => fn.id === preset.id)) return;
    sounds.playCorrect();
    setActiveFootnotes([...activeFootnotes, preset]);
  };

  const handleRemoveFootnote = (id: string) => {
    sounds.playClick();
    setActiveFootnotes(activeFootnotes.filter((fn) => fn.id !== id));
  };

  const handleSelectAnswer = (qKey: 'q1' | 'q2' | 'q3', answer: string, correct: string) => {
    if (isLocked(qKey)) return;

    if (qKey === 'q1') setQ1Answer(answer);
    if (qKey === 'q2') setQ2Answer(answer);
    if (qKey === 'q3') setQ3Answer(answer);

    if (answer === correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qKey);
    }
  };

  const isQ1Correct = q1Answer === 'b';
  const isQ2Correct = q2Answer === 'a';
  const isQ3Correct = q3Answer === 'c';
  const allCorrect = isQ1Correct && isQ2Correct && isQ3Correct;

  const calculateScore = () => {
    let score = 70;
    if (isQ1Correct) score += 10;
    if (isQ2Correct) score += 10;
    if (isQ3Correct) score += 10;
    return score;
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-orange-900/40 to-blue-900/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>Misiunea 1B • Nivelul 5 din 7</span>
              <span>•</span>
              <span>Manual pag. 25-26</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Note de Subsol (Footnotes) & Note de Final (Endnotes)
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Standardul academic de citare și clarificare: învață diferența dintre nota de subsol (de la baza fiecărei pagini) și nota de final (de la sfârșitul referatului), comanda rapidă <code className="text-amber-300 font-mono">Alt+Ctrl+F</code> și cum renumerotează Word automat toate referințele.
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 self-start sm:self-auto">
            <Quote className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Theory Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
            <FileText className="w-5 h-5" />
            <span>Notă de Subsol (Footnote)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Apare la <strong>baza paginii curente</strong>, separată printr-o linie orizontală scurtă de 5 cm. Numerotată de regulă cu cifre arabe (1, 2, 3...) pentru termeni de dicționar sau clarificări rapide.
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Bookmark className="w-5 h-5" />
            <span>Notă de Final (Endnote)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Se adună la <strong>sfârșitul întregului document</strong> sau la sfârșitul capitolului. Numerotată uzual cu cifre romane mici (i, ii, iii...). Folosită frecvent pentru bibliografie completă.
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
            <Sparkles className="w-5 h-5" />
            <span>Renumerotare Automată</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dacă inserezi o notă nouă la începutul documentului sau ștergi nota 2 dintr-un set de 10 note, Word <strong>actualizează instantaneu toți indicii numerici</strong> fără niciun efort manual!
          </p>
        </div>
      </div>

      {/* Interactive Academic Essay Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">Laborator Practic</span>
            <h2 className="text-xl font-black text-white">Laborator: Inserare, Renumerotare & Separator Tipografic</h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span>Scurtătură Word:</span>
            <kbd className="px-2 py-0.5 bg-slate-700 text-amber-300 rounded font-bold">Alt + Ctrl + F</kbd>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls: Add Available Footnotes */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-300">Ancore Disponibile în Textul Referatului:</span>

            <div className="flex flex-col gap-2.5">
              {availableFootnotePresets.map((preset) => {
                const isAdded = activeFootnotes.some((fn) => fn.id === preset.id);

                return (
                  <div
                    key={preset.id}
                    className={`p-3.5 rounded-2xl border transition flex flex-col gap-2 ${
                      isAdded
                        ? 'bg-amber-950/20 border-amber-600/50'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Quote className="w-4 h-4 text-amber-400" />
                        Ancoră: „{preset.anchor}”
                      </span>
                      {isAdded ? (
                        <button
                          onClick={() => handleRemoveFootnote(preset.id)}
                          className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Șterge
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddFootnote(preset)}
                          className="px-2.5 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition flex items-center gap-1 cursor-pointer shadow"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adaugă Notă
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 italic">{preset.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Încearcă să ștergi și să readaugi notele pentru a vedea cum indicii exponențiali (¹ ²) se renumerotează instantaneu!
              </span>
            </div>
          </div>

          {/* Academic Page Sheet Simulation */}
          <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-800 min-h-[380px] justify-between border border-slate-300">
            {/* DOCUMENT BODY */}
            <div className="space-y-3 font-serif text-xs leading-relaxed text-slate-800 text-justify">
              <h3 className="text-base font-black text-center font-serif text-slate-900 border-b border-slate-200 pb-2">
                Evoluția Tiparului: De la Gutenberg la Era Digitală
              </h3>

              <p className="indent-4">
                Revoluția comunicării umane a început la mijlocul secolului al XV-lea, când meșterul german{' '}
                <strong className="text-amber-800">
                  Johannes Gutenberg
                  {activeFootnotes.some((fn) => fn.id === 'fn1') && (
                    <sup className="text-amber-600 font-bold ml-0.5 text-[11px]">
                      {activeFootnotes.findIndex((fn) => fn.id === 'fn1') + 1}
                    </sup>
                  )}
                </strong>{' '}
                a perfecționat tiparul cu litere metalice mobile și cerneală pe bază de ulei.
              </p>

              <p className="indent-4">
                Cea mai celebră operă rezultată din atelierul său este Biblia cu 42 de rânduri, considerată primul mare{' '}
                <strong className="text-amber-800">
                  incunabul
                  {activeFootnotes.some((fn) => fn.id === 'fn2') && (
                    <sup className="text-amber-600 font-bold ml-0.5 text-[11px]">
                      {activeFootnotes.findIndex((fn) => fn.id === 'fn2') + 1}
                    </sup>
                  )}
                </strong>{' '}
                al Europei occidentale, deschizând calea răspândirii științei către mase.
              </p>

              <p className="indent-4">
                Astăzi, în era tehnoredactării pe calculator, principiile geometrice moștenite din secolul al XV-lea sunt codificate în{' '}
                <strong className="text-amber-800">
                  Standardul ISO 216
                  {activeFootnotes.some((fn) => fn.id === 'fn3') && (
                    <sup className="text-amber-600 font-bold ml-0.5 text-[11px]">
                      {activeFootnotes.findIndex((fn) => fn.id === 'fn3') + 1}
                    </sup>
                  )}
                </strong>
                , definind formatele uniforme A4 utilizate în toate școlile moderne.
              </p>
            </div>

            {/* FOOTNOTES SECTION AT BOTTOM OF PAGE */}
            <div className="mt-6 pt-3">
              {/* The standard 5cm Word Footnote Separator Line */}
              <div className="w-24 h-px bg-slate-400 mb-2"></div>

              {activeFootnotes.length === 0 ? (
                <span className="text-[10px] text-slate-400 italic font-sans block">
                  [Nicio notă de subsol activă pe această pagină]
                </span>
              ) : (
                <div className="space-y-1.5 text-[11px] font-serif text-slate-700">
                  {activeFootnotes.map((fn, idx) => (
                    <div key={fn.id} className="flex items-start gap-1.5 leading-snug">
                      <sup className="font-bold text-amber-700 font-mono text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </sup>
                      <span>{fn.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Quiz */}
      <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-amber-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-xl font-black text-white font-heading">
            Verificarea Cunoștințelor • Note de Subsol & Note de Final
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message="Timp de reflecție: gândește-te la poziția fizică unde apare fiecare tip de notă!"
          />
          <span className="text-sm font-bold text-slate-200">
            1. Care este diferența de poziționare dintre o Notă de Subsol (Footnote) și o Notă de Final (Endnote)?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Nota de subsol apare pe copertă, iar nota de final în meniul Start' },
              { id: 'b', label: 'Nota de subsol este la baza paginii curente; nota de final este colectată la sfârșitul întregului document' },
              { id: 'c', label: 'Ambele apar exclusiv în bara de stare a aplicației Word' },
              { id: 'd', label: 'Nota de final apare ca o fereastră pop-up care se închide la click' },
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
                <span>{opt.label}</span>
                {q1Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="Foot = picior / josul paginii curente; End = finalul întregii lucrări." />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation="Corect! Footnote (Notă de subsol) se plasează la baza paginii unde se află trimiterea, pe când Endnote (Notă de final) se adună la sfârșitul lucrării."
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message="Timp de reflecție: amintește-ți mecanismul automat de câmpuri dinamice din Word!"
          />
          <span className="text-sm font-bold text-slate-200">
            2. Ce se întâmplă dacă ai 4 note de subsol într-un eseu și ștergi nota numărul 2?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Word renumerotează automat notele: nota 3 devine 2, iar nota 4 devine 3' },
              { id: 'b', label: 'Rămâne un gol și numărul 2 va lipsi definitiv din document' },
              { id: 'c', label: 'Toate celelalte note se șterg automat' },
              { id: 'd', label: 'Trebuie să rescrii întregul eseu de la capăt' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id, 'a')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'a'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q2') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q2Answer === opt.id && (opt.id === 'a' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="Procesorul de text gestionează automat ordinea numerică a referințelor." />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation="Exact! Word actualizează automat numerele tuturor notelor și ale indicilor din text, garantând o numerotare continuă și fără erori."
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message="Timp de reflecție: analizează litera cheie din cuvântul Footnote (F)!"
          />
          <span className="text-sm font-bold text-slate-200">
            3. Care este comanda rapidă de tastatură Word pentru a insera o Notă de Subsol (Insert Footnote)?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Ctrl + S' },
              { id: 'b', label: 'Shift + F3' },
              { id: 'c', label: 'Alt + Ctrl + F' },
              { id: 'd', label: 'Ctrl + F' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q3')}
                onClick={() => handleSelectAnswer('q3', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q3') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q3Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint hint="Alt + Ctrl urmat de litera F (de la Footnote)." />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation="Corect! Alt + Ctrl + F inserează instantaneu o notă de subsol în Microsoft Word, plasând cursorul direct la baza paginii pentru introducerea explicației."
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={allCorrect}
        onNext={() => {
          sounds.playFanfare();
          onCompletePage(calculateScore());
        }}
        promptText={allCorrect ? 'Ai stăpânit notele academice! Treci la Studioul de Machetare a Revistei Școlare!' : 'Răspunde corect la cele 3 întrebări de verificare pentru a debloca nivelul următor!'}
      />
    </div>
  );
};
