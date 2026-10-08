import React, { useState } from 'react';
import { 
  Presentation, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  ExternalLink,
  Layers,
  Monitor,
  Printer,
  FileText
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P1Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P1Level1_PresentationIntro: React.FC<P1Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Presentation Type Explorer
  const [selectedType, setSelectedType] = useState<string>('digital');
  const [exploredTypes, setExploredTypes] = useState<Record<string, boolean>>({ digital: true });

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleSelectType = (id: string) => {
    sounds.playClick();
    setSelectedType(id);
    setExploredTypes(prev => ({ ...prev, [id]: true }));
  };

  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'slides_diapozitive') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'speaker_notes') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const handleQ3 = (id: string) => {
    if ((cooldowns.q3 || 0) > 0) return;
    setQ3Answer(id);
    if (id === 'electronic_print') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q3: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'slides_diapozitive';
  const isQ2Correct = q2Answer === 'speaker_notes';
  const isQ3Correct = q3Answer === 'electronic_print';

  const exploredAllTypes = Object.keys(exploredTypes).length >= 3;

  let totalScore = 0;
  if (exploredAllTypes) totalScore += 25;
  if (isQ1Correct) totalScore += 25;
  if (isQ2Correct) totalScore += 25;
  if (isQ3Correct) totalScore += 25;

  const isPageComplete = exploredAllTypes || (q1Answer !== null && q2Answer !== null && q3Answer !== null) || totalScore >= 40;

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-6xl mx-auto pb-12 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600/30 via-indigo-600/20 to-slate-900 border border-violet-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg text-2xl shrink-0">
              📽️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 uppercase tracking-wider">
                  {lang === 'en' ? 'Grade 6 • Unit 1 • Lesson 1' : 'Clasa a VI-a • Unitatea 1 • Lecția 1'}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {lang === 'en' ? 'Page 1 of 7' : 'Pagina 1 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {lang === 'en' ? 'Presentations & Presentation Software: Purpose and Benefits' : 'Prezentarea și Aplicații de Prezentare: Scop și Avantaje'}
              </h1>
              <div className="text-xs text-slate-300 mt-0.5">
                {lang === 'en' ? 'Textbook pages 10–11 • Transparencies, Flipcharts & Electronic Slides' : 'Manual pag. 10–11 • Folii, Flipchart, Diapozitive Electronice & Aplicații'}
              </div>
            </div>
          </div>

          <a
            href="https://www.microsoft.com/ro-ro/microsoft-365/powerpoint"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 text-xs font-bold transition cursor-pointer"
          >
            <span>{lang === 'en' ? 'About PowerPoint' : 'Despre PowerPoint'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Theory Card */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-violet-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'What is a Presentation? (Textbook p. 10)' : 'Ce este o Prezentare? (Manual pag. 10)'}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'A presentation is a concise exposition of information on a specific topic, structured according to a previously established plan. To ensure ideas are clearly understood and remembered by the audience, presentations must be visual, synthesizing information through graphics, images, and text.'
            : 'Prezentarea este o expunere pe scurt a unor informații legate de o anumită temă, organizată după un plan stabilit anterior. Dacă ne dorim ca informațiile transmise să fie cât mai bine înțelese și reținute de ceilalți, modalitatea de prezentare trebuie să fie una vizuală, având informațiile sintetizate și organizate într-un mod grafic, cu imagini și text.'}
        </p>
      </div>

      {/* Interactive Lab: 3 Types of Presentations */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base font-heading">
            <Presentation className="w-5 h-5 text-violet-400" />
            <span>{lang === 'en' ? 'Interactive Lab: Explore the 3 Types of Presentations' : 'Laborator Interactiv: Cele 3 Tipuri de Prezentări'}</span>
          </div>
          <span className="text-[11px] font-mono text-violet-300 bg-violet-950/60 px-2.5 py-1 rounded-full border border-violet-500/40">
            {Object.keys(exploredTypes).length}/3 {lang === 'en' ? 'Explored' : 'Explorate'}
          </span>
        </div>

        {/* Type Switcher Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'transparency',
              emoji: '🎞️',
              titleRo: '1. Folii Transparente',
              titleEn: '1. Transparencies',
              deviceRo: 'Retroproiector',
              deviceEn: 'Overhead Projector',
            },
            {
              id: 'paper',
              emoji: '📋',
              titleRo: '2. Prezentări pe Hârtie',
              titleEn: '2. Paper Presentations',
              deviceRo: 'Șevalet Rotafoliu (Flipchart)',
              deviceEn: 'Flipchart Easel',
            },
            {
              id: 'digital',
              emoji: '💻',
              titleRo: '3. Prezentări Electronice',
              titleEn: '3. Electronic Slides',
              deviceRo: 'Videoproiector & Calculator',
              deviceEn: 'Video Projector & PC',
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectType(item.id)}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                selectedType === item.id
                  ? 'bg-violet-950/70 border-violet-400 text-white shadow-lg shadow-violet-500/20 scale-[1.02]'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-3xl mb-1.5">{item.emoji}</span>
              <span className="text-xs sm:text-sm font-black font-heading">{lang === 'en' ? item.titleEn : item.titleRo}</span>
              <span className="text-[10px] font-mono mt-0.5 text-violet-300/80">{lang === 'en' ? item.deviceEn : item.deviceRo}</span>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          {selectedType === 'transparency' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
                <span>🎞️</span>
                <h4>{lang === 'en' ? 'Transparencies on Overhead Projector (Manual p. 10)' : 'Prezentări pe folii transparente (Manual pag. 10)'}</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Information was printed or hand-written on transparent plastic sheets placed on an overhead projector lamp, projecting the image onto a white screen behind the speaker. Static and manual, used heavily in the 20th century.'
                  : 'Informațiile sunt înscrise pe folii transparente din plastic ce se pun la un aparat numit retroproiector, care le proiectează pe un ecran aflat în spatele celui care prezintă. Foaia este fixă și nu permite animații dinamice sau sunete.'}
              </p>
            </div>
          )}

          {selectedType === 'paper' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
                <span>📋</span>
                <h4>{lang === 'en' ? 'Paper Presentations & Flipcharts (Manual p. 10)' : 'Prezentări pe hârtie pe șevalet rotafoliu (Flipchart)'}</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Prepared on large sheets of paper, printed or drawn manually with markers. Attached to an aluminum easel called a flipchart (șevalet rotafoliu). Sheets are turned over by hand during meetings.'
                  : 'Informațiile sunt pregătite pe foi de hârtie mari, tipărite sau scrise manual cu markere. Se fixează pe un suport din aluminiu numit șevalet rotafoliu (în engleză flipchart), foile fiind date peste cap manual pe măsură ce avansează expunerea.'}
              </p>
            </div>
          )}

          {selectedType === 'digital' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <span>💻</span>
                <h4>{lang === 'en' ? 'Electronic Presentations: Slides & Multimedia (Manual p. 10)' : 'Prezentarea Electronică: Diapozitive & Multimedia'}</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Organized as a sequence of electronic slides (diapozitive). Slides can contain text, charts, photos, sound effects, videos, animations, and hyperlinks. Can be displayed on PC, smartboards, tablets, or projected via videoprojector.'
                  : 'Realizate cu ajutorul programelor specializate pe calculatoare sau tablete și proiectate cu un videoproiector. Informațiile sunt organizate ca o înlănțuire de imagini numite diapozitive (slide-uri), permițând animații, sunete, clipuri video și actualizare rapidă!'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-violet-300 block mb-0.5">🔊 Multimedia Complet</strong>
                  Sunete, muzică, animații grafice și legături web.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-violet-300 block mb-0.5">📝 Notele Vorbitorului</strong>
                  Note (Speaker Notes) vizibile doar pe ecranul prezentatorului.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-violet-300 block mb-0.5">📄 Extrase (Handouts)</strong>
                  Diapozitivele se pot tipări pe hârtie și împărți publicului.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5 Major Software Applications */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-xs font-bold uppercase text-slate-400 font-mono">
            {lang === 'en' ? 'Major Presentation Applications (Textbook p. 11):' : 'Cele mai utilizate aplicații de prezentare (Manual pag. 11):'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-lg mb-0.5">🔴 P</div>
              <strong className="text-white block">PowerPoint</strong>
              <span className="text-[10px] text-slate-400">Microsoft</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-lg mb-0.5">🍎 K</div>
              <strong className="text-white block">Keynote</strong>
              <span className="text-[10px] text-slate-400">Apple Inc.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-lg mb-0.5">🟡 G</div>
              <strong className="text-white block">Google Slides</strong>
              <span className="text-[10px] text-slate-400">Google Cloud</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-lg mb-0.5">🌀 P</div>
              <strong className="text-white block">Prezi</strong>
              <span className="text-[10px] text-slate-400">Zoom dinamic</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-lg mb-0.5">🐧 I</div>
              <strong className="text-white block">Impress</strong>
              <span className="text-[10px] text-slate-400">LibreOffice (Gratuit)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Questions from Textbook p. 11 */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base font-heading border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge (Textbook p. 11)' : 'Verifică-ți Cunoștințele (Manual pag. 11)'}</span>
        </div>

        {/* Q1 */}
        <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-violet-400 font-mono">
              {lang === 'en' ? 'Question 1 of 3' : 'Întrebarea 1 din 3'}
            </span>
            <QuestionHint
              hintRo="Fiecare ecran individual dintr-o prezentare electronică poartă această denumire (termenul englezesc este slide)."
              hintEn="Each individual screen in a digital presentation is called a slide."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'How are the individual visual pages that make up an electronic presentation called?'
              : 'Cum se numesc imaginile/paginile electronice care compun o prezentare electronică?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'slides_diapozitive', ro: 'Diapozitive (sau slide-uri)', en: 'Slides (diapozitive)' },
              { id: 'w1', ro: 'Paragrafe Word', en: 'Word paragraphs' },
              { id: 'w2', ro: 'Foi de calcul Excel', en: 'Excel worksheets' },
              { id: 'w3', ro: 'Pictograme desktop', en: 'Desktop icons' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'slides_diapozitive'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 hover:border-violet-500/50 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q1}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: O prezentare electronică este o succesiune de diapozitive (slide-uri)!"
              customMessageEn="Pedagogical reflection: Electronic presentations consist of sequential slides!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! Prezentările electronice sunt organizate ca o înlănțuire de imagini numite diapozitive sau slide-uri."
              explanationEn="Correct! Electronic presentations are organized as chains of images called slides (diapozitive)."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-violet-400 font-mono">
              {lang === 'en' ? 'Question 2 of 3' : 'Întrebarea 2 din 3'}
            </span>
            <QuestionHint
              hintRo="Sunt texte ascunse publicului, vizibile doar pentru prezentator pe ecranul său pentru a-l ghida în discurs."
              hintEn="Text notes visible only to the presenter to assist during the speech."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What are speaker notes (notele vorbitorului) in a presentation software?'
              : 'Ce reprezintă „notele vorbitorului” (speaker notes) într-o prezentare electronică?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'speaker_notes', ro: 'Informații suplimentare văzute doar de cel care prezintă, ca sprijin în expunere', en: 'Supplementary text seen only by the presenter to assist speech' },
              { id: 'w1', ro: 'Note muzicale care se aud automat când începe slide-ul', en: 'Musical notes playing automatically on slide load' },
              { id: 'w2', ro: 'Catalogul de note pe care profesorul le trece elevilor', en: 'Grade sheet where teacher enters student marks' },
              { id: 'w3', ro: 'Titlul scris cu caractere de mărime 44', en: 'Title written in 44pt font' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'speaker_notes'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 hover:border-violet-500/50 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Notele vorbitorului îl ajută pe prezentator să vorbească liber fără să citească de pe ecran!"
              customMessageEn="Pedagogical reflection: Speaker notes help the presenter talk freely without reading the screen!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Exact! Notele vorbitorului sunt texte asociate diapozitivelor, văzute doar de prezentator, pentru a-l ajuta în timpul expunerii."
              explanationEn="Exact! Speaker notes are attached texts seen only by the presenter to guide their speech."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-violet-400 font-mono">
              {lang === 'en' ? 'Question 3 of 3 (Textbook Ex. 3)' : 'Întrebarea 3 din 3 (Manual Ex. 3)'}
            </span>
            <QuestionHint
              hintRo="Verifică afirmațiile: o prezentare electronică poate fi oricând tipărită pe foi de hârtie (extrase/handouts)!"
              hintEn="Check the statements: an electronic presentation can always be printed on paper!"
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which of the following statements is strictly TRUE (Textbook p. 11, Ex. 3)?'
              : 'Care dintre afirmațiile următoare este ADEVĂRATĂ (Manual pag. 11, Ex. 3)?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'electronic_print', ro: 'O prezentare electronică poate fi tipărită pe hârtie', en: 'An electronic presentation can be printed on paper' },
              { id: 'w1', ro: 'O prezentare pe hârtie poate conține animații video', en: 'A paper presentation can contain video animations' },
              { id: 'w2', ro: 'O prezentare pe folii se proiectează cu videoproiector', en: 'Transparencies are projected with a videoprojector' },
              { id: 'w3', ro: 'PowerPoint nu permite adăugarea de imagini sau sunete', en: 'PowerPoint does not allow adding images or sounds' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q3 || 0) > 0}
                onClick={() => handleQ3(opt.id)}
                className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'electronic_print'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 hover:border-violet-500/50 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q3}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Diapozitivele electronice se pot imprima oricând pe hârtie sau foi transparente!"
              customMessageEn="Pedagogical reflection: Digital slides can always be printed on paper or transparencies!"
            />
          ) : null}
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanationRo="Excelent! Diapozitivele electronice pot fi tipărite pe hârtie ca extrase (handouts) pentru participanți."
              explanationEn="Excellent! Digital slides can be printed on paper as handouts for participants."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={1}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 2: Pornirea PowerPoint & Ecranul de Start"
        nextButtonLabelEn="Proceed to Page 2: PowerPoint Launch & Start Screen"
      />
    </div>
  );
};
