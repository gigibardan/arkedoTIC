import React, { useState } from 'react';
import { ListOrdered, List, CheckCircle2, Sparkles, BookOpen, Layers, Check, CornerDownRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { PageNavigationFooter } from './PageNavigationFooter';
import { AnswerExplanation } from './AnswerExplanation';
import { QuestionHint } from './QuestionHint';

interface TLevel5Props {
  onCompletePage: (score: number) => void;
}

interface ListScenario {
  id: string;
  titleRo: string;
  titleEn: string;
  itemsRo: string[];
  itemsEn: string[];
  correctType: 'numbered' | 'bulleted';
  explanationRo: string;
  explanationEn: string;
}

const SCENARIOS: ListScenario[] = [
  {
    id: 'pc_boot',
    titleRo: 'Pașii de pornire și conectare la PC',
    titleEn: 'Steps to turn on and log into PC',
    itemsRo: [
      'Apasă butonul Power de pe carcasă',
      'Așteaptă încărcarea sistemului de operare',
      'Introdu numele de utilizator și parola',
      'Deschide aplicația dorită din meniul Start'
    ],
    itemsEn: [
      'Press the Power button on the PC case',
      'Wait for the operating system to boot',
      'Enter your username and password',
      'Launch your desired app from the Start menu'
    ],
    correctType: 'numbered',
    explanationRo: 'Ordinea este strict cronologică: nu te poți autentifica înainte de pornirea fizică a calculatorului!',
    explanationEn: 'The sequence is strictly chronological: you cannot log in before turning on the machine!',
  },
  {
    id: 'backpack',
    titleRo: 'Componentele hardware din carcasă',
    titleEn: 'Hardware components inside chassis',
    itemsRo: [
      'Procesorul central (CPU)',
      'Memoria de lucru (RAM)',
      'Placa de bază (Motherboard)',
      'Sursa de alimentare (PSU)'
    ],
    itemsEn: [
      'Central Processor (CPU)',
      'Working Memory (RAM)',
      'Motherboard circuit',
      'Power Supply Unit (PSU)'
    ],
    correctType: 'bulleted',
    explanationRo: 'Ordinea enumerării pieselor nu contează: fie că spui mai întâi RAM sau CPU, componentele există toate simultan!',
    explanationEn: 'The order of parts does not matter: listing RAM or CPU first has no chronological priority.',
  },
  {
    id: 'baking',
    titleRo: 'Algoritmul de salvare a unui document nou',
    titleEn: 'Steps to save a new document to disk',
    itemsRo: [
      'Apasă pe meniul Fișier (File) din stânga sus',
      'Selectează opțiunea „Salvare ca...” (Save As)',
      'Alege folderul destinație (ex: Folderul TIC)',
      'Tastează numele fișierului și apasă butonul Salvare'
    ],
    itemsEn: [
      'Click the File menu in the upper-left corner',
      'Choose the option "Save As"',
      'Pick the destination folder (e.g. ICT folder)',
      'Type the filename and click the Save button'
    ],
    correctType: 'numbered',
    explanationRo: 'Este un algoritm de operare cu pași obligatorii ce trebuie respectați în această succesiune exactă!',
    explanationEn: 'It is a sequential computer procedure with steps that must be carried out in exact order.',
  },
  {
    id: 'peripherals',
    titleRo: 'Exemple de periferice de intrare',
    titleEn: 'Examples of input peripherals',
    itemsRo: [
      'Tastatură alfanumerică',
      'Mouse optic cu fir sau wireless',
      'Microfon pentru conferințe',
      'Cameră web (Webcam)'
    ],
    itemsEn: [
      'Alphanumeric Keyboard',
      'Optical mouse',
      'Voice microphone',
      'Digital Webcam'
    ],
    correctType: 'bulleted',
    explanationRo: 'Este o simplă enumerare de dispozitive echivalente, unde ordinea este opțională.',
    explanationEn: 'It is a collection of equivalent devices where sequencing carries no special meaning.',
  },
];

export const TLevel5_ListsAndHierarchy: React.FC<TLevel5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Selected types for scenarios
  const [selectedTypes, setSelectedTypes] = useState<{ [id: string]: 'numbered' | 'bulleted' }>({});

  // Quiz questions
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleSelectType = (scenarioId: string, type: 'numbered' | 'bulleted') => {
    sounds.playClick();
    setSelectedTypes((prev) => ({ ...prev, [scenarioId]: type }));

    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario && scenario.correctType === type) {
      sounds.playCorrect();
      arky.triggerSuccess(
        lang === 'en' ? 'Smart choice! The list type fits perfectly.' : 'Alegere excelentă! Tipul de listă ales este optim!'
      );
    } else {
      sounds.playWrong();
    }
  };

  const handleQ1 = (val: string) => {
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'chronology') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleQ2 = (val: string) => {
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'tab') sounds.playCorrect();
    else sounds.playWrong();
  };

  // Evaluation
  let scenariosCorrect = 0;
  SCENARIOS.forEach((s) => {
    if (selectedTypes[s.id] === s.correctType) scenariosCorrect += 1;
  });

  const isQ1Correct = q1Answer === 'chronology';
  const isQ2Correct = q2Answer === 'tab';

  let correctTotal = 0;
  if (scenariosCorrect === SCENARIOS.length) correctTotal += 1;
  if (isQ1Correct) correctTotal += 1;
  if (isQ2Correct) correctTotal += 1;

  const totalQuestions = 3;
  const earnedScore = Math.round((correctTotal / totalQuestions) * 15);
  const canProceed = scenariosCorrect >= 3;

  const handleReset = () => {
    sounds.playClick();
    setSelectedTypes({});
    setQ1Answer(null);
    setQ2Answer(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-orange-950/60 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Module 4 • Page 5 of 7' : 'Modulul 4 • Pagina 5 din 7'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'en' ? 'Bulleted & Numbered Lists' : 'Liste Marcate (Bullets) & Liste Numerotate'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Organize ideas cleanly (Textbook pp. 62–64): choose between numbered sequences and bullet points, and build multi-level hierarchical outlines using TAB.'
                : 'Structurează informația clar (Manual pag. 62–64): alege între pași numerotați și buline marcate, și construiește liste ierarhice cu tasta TAB.'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            📋
          </div>
        </div>
      </div>

      {/* Theory Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'en' ? 'List Types Rulebook (Textbook p. 62)' : 'Regula de Aur a Listelor (Manual pag. 62)'}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {lang === 'en' ? 'When to Use Numbers vs. When to Use Bullets' : 'Când folosim numere și când folosim buline?'}
        </h2>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-blue-500/30">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono uppercase mb-1">
              <ListOrdered className="w-4 h-4" /> 1. Liste Numerotate (Ordinea CONTEAZĂ)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Folosim cifre (1, 2, 3) sau litere (A, B, C) atunci când elementele trebuie parcurse într-o ordine strictă, cronologică:
            </p>
            <ul className="mt-2 text-xs text-slate-300 space-y-1 list-decimal list-inside font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <li>Rețete de gătit și pași de preparare</li>
              <li>Instrucțiuni de asamblare și ghiduri pas cu pas</li>
              <li>Clasamente sportive și topuri de performanță</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono uppercase mb-1">
              <List className="w-4 h-4" /> • Liste Marcate (Ordinea NU contează)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Folosim marcatori vizuali (buline •, pătrate ■, săgeți ➢) atunci când elementele sunt echivalente și pot fi citite în orice ordine:
            </p>
            <ul className="mt-2 text-xs text-slate-300 space-y-1 list-disc list-inside font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <li>Ingredientele dintr-un preparat</li>
              <li>Caracteristicile unui smartphone modern</li>
              <li>Regulile de comportament în laboratorul TIC</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Workshop */}
      <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
              <Layers className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Interactive Lab • List Architect' : 'Laborator Interactiv • Arhitectul de Liste'}
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {lang === 'en' ? 'Classify each Document Section with the Right List Style' : 'Alege tipul optim de listă pentru fiecare situație practică!'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">{lang === 'en' ? 'Correctly Configured:' : 'Configurate corect:'}</span>
            <span className="text-sm font-bold font-mono text-amber-400">
              {scenariosCorrect} / {SCENARIOS.length}
            </span>
          </div>
        </div>

        {/* 4 Interactive Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map((scenario) => {
            const currentSelected = selectedTypes[scenario.id];
            const isCorrect = currentSelected === scenario.correctType;

            return (
              <div
                key={scenario.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  currentSelected
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-200 text-sm">
                      {lang === 'en' ? scenario.titleEn : scenario.titleRo}
                    </h4>
                    {currentSelected && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {isCorrect ? (lang === 'en' ? 'CORRECT' : 'CORECT ✓') : (lang === 'en' ? 'WRONG' : 'INCORECT ✗')}
                      </span>
                    )}
                  </div>

                  {/* List preview block */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 my-2 text-xs font-mono space-y-1">
                    {(lang === 'en' ? scenario.itemsEn : scenario.itemsRo).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="text-amber-400 font-bold shrink-0">
                          {currentSelected === 'numbered' ? `${idx + 1}.` : currentSelected === 'bulleted' ? '•' : '?'}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {currentSelected && (
                    <div className="text-[11px] text-slate-400 italic mb-2">
                      💡 {lang === 'en' ? scenario.explanationEn : scenario.explanationRo}
                    </div>
                  )}
                </div>

                {/* Option Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleSelectType(scenario.id, 'numbered')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentSelected === 'numbered'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span>1, 2, 3 Numerotată</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectType(scenario.id, 'bulleted')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentSelected === 'bulleted'
                        ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>• Buline Marcate</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Textbook Assessment Questions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider font-mono">
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'en' ? 'Textbook Assessment (p. 64, Ex. 1 & 2)' : 'Verificare din Manual (pag. 64, Ex. 1 & 2)'}</span>
        </div>

        {/* Question 1 */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '1. In which situation is a Numbered List strictly mandatory instead of bullet points?'
                : '1. În care dintre următoarele situații este obligatoriu să folosim o Listă Numerotată în locul bulinelor?'}
            </h4>
            <span className="text-xs font-mono text-amber-400 font-semibold shrink-0">1 punct</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQ1('chronology')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'chronology'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'When explaining step-by-step algorithms where order is essential' : 'La explicarea pașilor unui algoritm unde ordinea executării este vitală'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('colors')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'colors'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'When listing the 7 rainbow colors' : 'Când enumerăm cele 7 culori ale curcubeului'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('animals')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'animals'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'When writing names of animals in a zoo' : 'Când scriem numele animalelor dintr-o grădină zoologică'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('short')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'short'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'Only when text is shorter than 5 words' : 'Doar când textul are mai puțin de 5 cuvinte'}
            </button>
          </div>

          <QuestionHint
            hintRo="Dacă schimbi ordinea pașilor și rezultatul se strică (ca la o rețetă sau pornirea unui aparat), lista trebuie să fie numerotată!"
            hintEn="If reversing the order breaks the result (like recipes or boot sequences), use numbers!"
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Correct! Numbered lists convey chronological order, algorithmic sequence, and priority.' : 'Corect! Listele numerotate indică o ordine obligatorie sau etape cronologice de urmat.')
                  : (lang === 'en' ? 'Incorrect. Numbered lists are strictly required when step order matters.' : 'Incorect. Listele numerotate sunt obligatorii când pașii depind de ordine.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 62 • Numbered Lists Usage' : 'Manual pag. 62 • Utilizarea Listelor Numerotate'}
            />
          )}
        </div>

        {/* Question 2: TAB key for hierarchy */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '2. Which keyboard key increases the indent level of a list item to create a sub-list (hierarchy)?'
                : '2. Ce tastă se apasă în timp ce redactezi o listă pentru a crea o sublistă (nivel ierarhic inferior)?'}
            </h4>
            <span className="text-xs font-mono text-amber-400 font-semibold shrink-0">1 punct</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQ2('tab')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'tab'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'The TAB key (⇥)' : 'Tasta TAB (⇥)'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('caps')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'caps'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'The Caps Lock key' : 'Tasta Caps Lock'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('escape')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'escape'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'The Escape key (Esc)' : 'Tasta Esc (Escape)'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('space')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'space'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'Pressing Spacebar 10 times' : 'Apăsarea barei de spațiu de 10 ori'}
            </button>
          </div>

          <QuestionHint
            hintRo="Tasta TAB (Tabulator) are adesea două săgeți opuse ⇥ și se află în stânga tastei Q."
            hintEn="The TAB key is located on the left side of your keyboard next to the Q key."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Spot on! Pressing TAB indents the list item to a deeper sub-level. Pressing Shift + TAB promotes it back up.' : 'Excelent! Tasta TAB crește nivelul de indentare, transformând elementul într-o sublistă. Combinația Shift + TAB îl readuce la nivelul principal.')
                  : (lang === 'en' ? 'Incorrect. The TAB key creates indented sub-lists.' : 'Incorect. Tasta TAB crește nivelul de indentare pentru subliste.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 63 • Multi-level Lists' : 'Manual pag. 63 • Liste pe mai multe niveluri'}
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctTotal}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => onCompletePage(earnedScore)}
        onRetry={handleReset}
      />
    </div>
  );
};
