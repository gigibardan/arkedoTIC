import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Printer, 
  RotateCcw, 
  Download, 
  Star,
  Presentation,
  Check,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { getActiveStudent } from '../../../lib/studentAuthService';
import { useQuestionCooldowns, computeGradeDetails } from '../../../utils/pedagogicalGrading';

interface P1Level7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P1Level7_CommandsLabAndExam: React.FC<P1Level7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const studentProfile = getActiveStudent();
  const studentName = studentProfile?.username || 'Elev ArkyEdu';

  // Command Matching Lab State
  // Connect command with correct tab
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

  // Grand Exam Quiz States
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [showDiploma, setShowDiploma] = useState<boolean>(false);

  const commandItems = [
    { id: 'c1', label: 'Diapozitiv nou (Ctrl+M)', correctTab: 'home' },
    { id: 'c2', label: 'Inserare Imagine / Tabel', correctTab: 'insert' },
    { id: 'c3', label: 'Efect Tranziție Cortină', correctTab: 'transitions' },
    { id: 'c4', label: 'Salvare Prezentare (Ctrl+S)', correctTab: 'file' }
  ];

  const targetTabs = [
    { id: 'file', label: 'Fila Fișier' },
    { id: 'home', label: 'Fila Pornire' },
    { id: 'insert', label: 'Fila Inserare' },
    { id: 'transitions', label: 'Fila Tranziții' }
  ];

  const handleSelectCommand = (id: string) => {
    sounds.playClick();
    setSelectedCommand(id);
  };

  const handleMatchWithTab = (tabId: string) => {
    if (!selectedCommand) return;
    const cmd = commandItems.find(c => c.id === selectedCommand);
    if (!cmd) return;

    if (cmd.correctTab === tabId) {
      sounds.playCorrect();
      setMatches(prev => ({ ...prev, [selectedCommand]: tabId }));
    } else {
      sounds.playWrong();
    }
    setSelectedCommand(null);
  };

  const matchedCount = Object.keys(matches).length;

  // Final Exam questions
  const examQuestions = [
    {
      id: 'eq1',
      questionRo: '1. Ce este un diapozitiv (slide)?',
      questionEn: '1. What is a slide?',
      optionsRo: [
        { id: 'a', text: 'O pagină electronică individuală din cadrul unei prezentări' },
        { id: 'b', text: 'O piesă mecanică din interiorul mouse-ului' },
        { id: 'c', text: 'Un cablu de rețea internet' }
      ],
      optionsEn: [
        { id: 'a', text: 'An individual digital page within a presentation' },
        { id: 'b', text: 'A mechanical part inside the mouse' },
        { id: 'c', text: 'An internet network cable' }
      ],
      correctId: 'a',
      hintRo: 'Prezentarea este o succesiune de diapozitive (slides).',
      hintEn: 'A presentation is a sequence of slides.',
      explanationRo: 'Exact! Diapozitivul este echivalentul unei foi electronice care conține textele și imaginile prezentării.',
      explanationEn: 'Exactly! A slide is the digital sheet that holds presentation text and media.'
    },
    {
      id: 'eq2',
      questionRo: '2. Ce scurtătură de la tastatură inserează un Diapozitiv Nou?',
      questionEn: '2. What keyboard shortcut inserts a New Slide?',
      optionsRo: [
        { id: 'a', text: 'Ctrl + M' },
        { id: 'b', text: 'Ctrl + Alt + Delete' },
        { id: 'c', text: 'Caps Lock' }
      ],
      optionsEn: [
        { id: 'a', text: 'Ctrl + M' },
        { id: 'b', text: 'Ctrl + Alt + Delete' },
        { id: 'c', text: 'Caps Lock' }
      ],
      correctId: 'a',
      hintRo: 'Reține: Ctrl + N este pentru prezentare nouă, iar Ctrl + M pentru diapozitiv nou!',
      hintEn: 'Remember: Ctrl+N is new file, Ctrl+M is new slide!',
      explanationRo: 'Corect! Ctrl + M adaugă imediat un nou diapozitiv după cel activ.',
      explanationEn: 'Correct! Ctrl+M immediately inserts a new slide after the active one.'
    },
    {
      id: 'eq3',
      questionRo: '3. Unde sunt notate ideile de discurs secrete ale vorbitorului?',
      questionEn: '3. Where are the speaker private talking points written?',
      optionsRo: [
        { id: 'a', text: 'În Panoul de Note (Speaker Notes)' },
        { id: 'b', text: 'Pe spatele ecranului cu markerul' },
        { id: 'c', text: 'În titlul principal cu litere mari' }
      ],
      optionsEn: [
        { id: 'a', text: 'In the Speaker Notes pane' },
        { id: 'b', text: 'On the back of the monitor with a marker' },
        { id: 'c', text: 'In the main title in big letters' }
      ],
      correctId: 'a',
      hintRo: 'Panoul din partea inferioară a diapozitivului.',
      hintEn: 'The pane at the bottom of the slide.',
      explanationRo: 'Excelent! Panoul de note este ascuns publicului și vizibil doar prezentatorului.',
      explanationEn: 'Excellent! The notes pane is hidden from audience and visible only to speaker.'
    }
  ];

  const handleAnswerExam = (qId: string, optId: string, correctId: string) => {
    if (isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    if (optId === correctId) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId, 5);
    }
  };

  const correctAnswersCount = examQuestions.filter(q => answers[q.id] === q.correctId).length;
  const examScore = correctAnswersCount * 25;
  const labScore = matchedCount * 6.25;
  const totalScore = Math.min(100, Math.round(examScore + labScore));
  const gradeDetails = computeGradeDetails(totalScore, 100);

  const isPageComplete = Object.keys(answers).length >= 2 || matchedCount >= 2;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleUnlockDiploma = () => {
    sounds.playVictory();
    setShowDiploma(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/40">
              {lang === 'en' ? 'Grade 6 • Unit 1 • Page 15' : 'Clasa a VI-a • Unitatea 1 • Pag. 15'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {lang === 'en' ? 'Screen 7 of 7 • Final Exam' : 'Ecranul 7 din 7 • Evaluare & Diplomă'}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
              <Trophy className="w-6 h-6" />
            </span>
            <span>
              {lang === 'en'
                ? 'Command Lab & Junior PowerPoint Diploma'
                : 'Laborator de Comenzi & Marea Diplomă PowerPoint'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'Complete the matching challenge, answer the official curriculum evaluation, and unlock your certified Junior PowerPoint Specialist Diploma!'
              : 'Asociază comenzile cu filele corecte, rezolvă testul recapitulativ al Unității 1 și deblochează Marea Diplomă Oficială de Operator PowerPoint Junior!'}
          </p>
        </div>
      </div>

      {/* Interactive Command Matching Lab */}
      <div className="bg-slate-900/95 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              {lang === 'en' ? 'Laboratory Matcher' : 'Laboratorul de Asociere a Comenzilor'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-heading">
              {lang === 'en' ? 'Connect each action with its home tab:' : 'Asociază fiecare acțiune cu fila din care face parte:'}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            {matchedCount}/4 Asociate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Commands to connect */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Pasul 1: Alege comanda:
            </span>
            {commandItems.map(cmd => {
              const isMatched = !!matches[cmd.id];
              const isSelected = selectedCommand === cmd.id;
              return (
                <button
                  key={cmd.id}
                  disabled={isMatched}
                  onClick={() => handleSelectCommand(cmd.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${
                    isMatched
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 cursor-default'
                      : isSelected
                      ? 'bg-orange-600 border-orange-400 text-white ring-2 ring-orange-400/40'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{cmd.label}</span>
                  {isMatched && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Column 2: Target Tabs */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Pasul 2: Apasă pe fila corectă:
            </span>
            {targetTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleMatchWithTab(tab.id)}
                disabled={!selectedCommand}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${
                  selectedCommand
                    ? 'bg-slate-950 border-orange-500/60 text-white hover:bg-orange-950/40 hover:border-orange-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono text-slate-400">Ribbon</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Official Curriculum Grand Exam Questionnaire */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg sm:text-xl font-black text-white font-heading">
            {lang === 'en' ? 'Official Curriculum Verification Exam' : 'Marea Evaluare a Unității 1 (Manual Art Klett)'}
          </h2>
        </div>

        <div className="space-y-6">
          {examQuestions.map(eq => {
            const chosen = answers[eq.id];
            const isCorrect = chosen === eq.correctId;
            return (
              <div key={eq.id} className="flex flex-col gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-bold text-white">
                    {lang === 'en' ? eq.questionEn : eq.questionRo}
                  </span>
                  <QuestionHint
                    hintRo={eq.hintRo}
                    hintEn={eq.hintEn}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(lang === 'en' ? eq.optionsEn : eq.optionsRo).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerExam(eq.id, opt.id, eq.correctId)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                        chosen === opt.id
                          ? opt.id === eq.correctId
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/80 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>

                {cooldowns[eq.id] && cooldowns[eq.id] > 0 ? (
                  <PedagogicalReflectionBanner
                    cooldown={cooldowns[eq.id]}
                    totalSeconds={5}
                    customMessageRo="Reflecție didactică: Analizează cu atenție opțiunile din manual înainte de a alege!"
                    customMessageEn="Pedagogical reflection: Carefully review textbook options before picking!"
                  />
                ) : null}

                {chosen && (
                  <AnswerExplanation
                    isCorrect={isCorrect}
                    explanationRo={eq.explanationRo}
                    explanationEn={eq.explanationEn}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Capstone Evaluation Summary Card & Finalization */}
      <div className="bg-gradient-to-br from-slate-900 via-orange-950/30 to-slate-950 border-2 border-orange-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🏆
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {lang === 'en' ? 'Synthesis Evaluation Completed' : 'Evaluare Finală Modulul 1A'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {lang === 'en'
              ? 'Your score is dynamically calculated based on your lab shortcuts and quiz performance.'
              : 'Punctajul și nota sunt calculate dinamic în baza asocierilor și răspunsurilor tale.'}
          </p>
        </div>

        {/* Dynamic Score & Grade Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-amber-500/50 shadow-lg">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
            Punctaj: {totalScore} / 100 Puncte
          </span>
          <span className="text-slate-500 font-bold">•</span>
          <span className="text-sm sm:text-base font-bold text-emerald-300">
            {gradeDetails.calificativRo}
          </span>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              sounds.playVictory();
              onCompletePage(totalScore);
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 cursor-pointer transition transform active:scale-95 flex items-center gap-2.5"
          >
            <Trophy className="w-5 h-5" />
            <span>{lang === 'en' ? 'Finalize Mission 1A & Claim Official Diploma!' : 'Finalizează Misiunea 1A & Revendică Marea Diplomă!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
