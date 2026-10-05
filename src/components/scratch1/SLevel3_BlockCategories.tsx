import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Check, 
  RotateCcw, 
  Layers, 
  ExternalLink,
  Move,
  Eye,
  Volume2,
  Flag,
  Cpu,
  Radio,
  Calculator,
  Database,
  Boxes
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface SLevel3Props {
  onCompletePage: (earnedScore: number) => void;
}

interface BlockItem {
  id: string;
  nameRo: string;
  nameEn: string;
  categoryId: string;
}

const BLOCKS_TO_CLASSIFY: BlockItem[] = [
  { id: 'b1', nameRo: 'mergi 10 pași', nameEn: 'move 10 steps', categoryId: 'motion' },
  { id: 'b2', nameRo: 'schimbă costumul la [costum2]', nameEn: 'switch costume to [costume2]', categoryId: 'looks' },
  { id: 'b3', nameRo: 'când tasta [spațiu] este apăsată', nameEn: 'when [space] key pressed', categoryId: 'events' },
  { id: 'b4', nameRo: 'repetă de 10 ori', nameEn: 'repeat 10', categoryId: 'control' },
  { id: 'b5', nameRo: 'atinge [indicatorul de maus] ?', nameEn: 'touching [mouse-pointer] ?', categoryId: 'sensing' },
  { id: 'b6', nameRo: 'alege aleator între (1) și (10)', nameEn: 'pick random (1) to (10)', categoryId: 'operators' },
];

const CATEGORIES = [
  { id: 'motion', nameRo: 'Mișcare (Motion)', nameEn: 'Motion', color: 'bg-blue-600 border-blue-500 text-white', icon: Move },
  { id: 'looks', nameRo: 'Aspect (Looks)', nameEn: 'Looks', color: 'bg-purple-600 border-purple-500 text-white', icon: Eye },
  { id: 'sound', nameRo: 'Sunet (Sound)', nameEn: 'Sound', color: 'bg-pink-600 border-pink-500 text-white', icon: Volume2 },
  { id: 'events', nameRo: 'Evenimente (Events)', nameEn: 'Events', color: 'bg-amber-500 border-amber-600 text-slate-950', icon: Flag },
  { id: 'control', nameRo: 'Control (Control)', nameEn: 'Control', color: 'bg-amber-600 border-amber-700 text-white', icon: Cpu },
  { id: 'sensing', nameRo: 'Detectare (Sensing)', nameEn: 'Sensing', color: 'bg-sky-500 border-sky-600 text-slate-950', icon: Radio },
  { id: 'operators', nameRo: 'Operatori (Operators)', nameEn: 'Operators', color: 'bg-emerald-600 border-emerald-500 text-white', icon: Calculator },
  { id: 'variables', nameRo: 'Variabile (Variables)', nameEn: 'Variables', color: 'bg-orange-600 border-orange-500 text-white', icon: Database },
  { id: 'myblocks', nameRo: 'Blocurile mele (My Blocks)', nameEn: 'My Blocks', color: 'bg-rose-600 border-rose-500 text-white', icon: Boxes },
];

export const SLevel3_BlockCategories: React.FC<SLevel3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Matcher state: blockId -> chosen categoryId
  const [classifications, setClassifications] = useState<Record<string, string>>({});
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(BLOCKS_TO_CLASSIFY[0].id);
  const [classificationValidated, setClassificationValidated] = useState<boolean>(false);
  const [classCooldown, setClassCooldown] = useState<number>(0);

  // Active category tab for preview
  const [previewCategory, setPreviewCategory] = useState<string>('motion');

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0) || classCooldown > 0;
    if (!hasActive) return;
    const timer = setInterval(() => {
      if (classCooldown > 0) setClassCooldown(prev => (prev <= 1 ? 0 : prev - 1));
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const [k, v] of Object.entries(prev)) {
          const val = v as number;
          if (val > 1) next[k] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldowns, classCooldown]);

  const handleAssignCategory = (catId: string) => {
    if (!selectedBlockId) return;
    sounds.playClick();
    setClassifications(prev => ({
      ...prev,
      [selectedBlockId]: catId
    }));
    setClassificationValidated(false);

    // Auto select next unassigned block if any
    const nextUnassigned = BLOCKS_TO_CLASSIFY.find(b => b.id !== selectedBlockId && !classifications[b.id]);
    if (nextUnassigned) {
      setSelectedBlockId(nextUnassigned.id);
    }
  };

  const isAllClassified = BLOCKS_TO_CLASSIFY.every(b => !!classifications[b.id]);
  const isClassificationCorrect = isAllClassified && BLOCKS_TO_CLASSIFY.every(b => classifications[b.id] === b.categoryId);

  const handleValidateClassification = () => {
    if (classCooldown > 0) return;
    setClassificationValidated(true);
    if (isClassificationCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setClassCooldown(5);
    }
  };

  const handleResetClassification = () => {
    sounds.playClick();
    setClassifications({});
    setSelectedBlockId(BLOCKS_TO_CLASSIFY[0].id);
    setClassificationValidated(false);
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'nine_categories') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'yellow_events') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'nine_categories';
  const isQ2Correct = q2Answer === 'yellow_events';

  let totalScore = 0;
  if (classificationValidated && isClassificationCorrect) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = classificationValidated && isClassificationCorrect && isQ1Correct && isQ2Correct;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/40 text-purple-300">
              <Palette className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0' : 'Unitatea 6 • Scratch 3.0'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 3 of 7' : 'Pagina 3 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'The 9 Color-Coded Block Categories in Scratch'
                  : 'Cele 9 Categorii de Blocuri Colorate din Scratch'}
              </h1>
            </div>
          </div>
          <a
            href="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-200 text-xs font-semibold transition cursor-pointer"
          >
            <span>{lang === 'en' ? 'Open MIT Scratch' : 'Deschide Scratch Oficial'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Educational Guide: The 9 Categories Overview */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'The 9 Palette Colors & Their Roles (Textbook pp. 74–76)' : 'Cele 9 Culori ale Paletei Scratch și Rolul Lor (Manual pag. 74–76)'}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => setPreviewCategory(cat.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  previewCategory === cat.id
                    ? `${cat.color} ring-2 ring-white/50 shadow-lg scale-[1.02]`
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold">{lang === 'en' ? cat.nameEn : cat.nameRo}</span>
                </div>
                <p className="text-[11px] opacity-80 leading-tight">
                  {cat.id === 'motion' && (lang === 'en' ? 'Controls position, rotation, glide' : 'Comandă deplasarea, rotația, glisarea')}
                  {cat.id === 'looks' && (lang === 'en' ? 'Speech, costumes, size, effects' : 'Replică, costume, mărime, efecte grafice')}
                  {cat.id === 'sound' && (lang === 'en' ? 'Audio clips, pitch, volume' : 'Efecte sonore, înălțime, volum')}
                  {cat.id === 'events' && (lang === 'en' ? 'Hat blocks, triggers, keys, broadcast' : 'Blocuri pălărie de start, taste, mesaje')}
                  {cat.id === 'control' && (lang === 'en' ? 'Loops, if/else decisions, wait, stop' : 'Bucle (repetă), decizii dacă/altfel, pauze')}
                  {cat.id === 'sensing' && (lang === 'en' ? 'Touch detection, distance, mouse input' : 'Detectare atingeri, distanță, maus, întrebări')}
                  {cat.id === 'operators' && (lang === 'en' ? 'Math (+,-,*,/), logic (<,>,=, și, sau), join' : 'Operații matematice, comparații, alăturare')}
                  {cat.id === 'variables' && (lang === 'en' ? 'Creating, storing and changing values' : 'Creare, atribuire și incrementare valori')}
                  {cat.id === 'myblocks' && (lang === 'en' ? 'Custom modular functions/procedures' : 'Proceduri și funcții proprii reutilizabile')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Classification Lab */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3>{lang === 'en' ? 'Interactive Block Classification Lab' : 'Laborator Interactiv: Clasificarea Blocurilor pe Categorii'}</h3>
          </div>
          <button
            type="button"
            onClick={handleResetClassification}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset' : 'Resetează'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Select a Scratch block on the left, then click its corresponding category on the right to categorize all 6 blocks correctly.'
            : 'Selectează un bloc din lista din stânga, apoi apasă pe categoria corectă din dreapta pentru a le clasifica pe toate 6.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Blocks to assign */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? '1. Select Block to Categorize:' : '1. Selectează Blocul:'}
            </h4>
            {BLOCKS_TO_CLASSIFY.map(block => {
              const assignedCatId = classifications[block.id];
              const assignedCat = CATEGORIES.find(c => c.id === assignedCatId);
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedBlockId(block.id);
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/70 border-purple-500 ring-2 ring-purple-500/40'
                      : assignedCat
                      ? 'bg-slate-950/80 border-slate-700'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">🧩</span>
                    <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                      {lang === 'en' ? block.nameEn : block.nameRo}
                    </span>
                  </div>
                  <div>
                    {assignedCat ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${assignedCat.color}`}>
                        {lang === 'en' ? assignedCat.nameEn : assignedCat.nameRo.split(' ')[0]}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">
                        {lang === 'en' ? 'Unassigned' : 'Neclasificat'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category Target Buttons */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? '2. Assign to Category:' : '2. Atribuie Categoriei:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.slice(0, 8).map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleAssignCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${cat.color} hover:brightness-110 shadow-sm`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{lang === 'en' ? cat.nameEn : cat.nameRo}</span>
                  </button>
                );
              })}
            </div>

            {/* Validation Button */}
            <div className="pt-3">
              <button
                type="button"
                disabled={!isAllClassified || classCooldown > 0}
                onClick={handleValidateClassification}
                className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  !isAllClassified
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : classCooldown > 0
                    ? 'bg-amber-900/50 text-amber-300 border border-amber-500/50 cursor-wait'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {classCooldown > 0
                    ? `${lang === 'en' ? 'Wait' : 'Așteaptă'} ${classCooldown}s...`
                    : lang === 'en'
                    ? 'Validate Block Categories (+40 Pts)'
                    : 'Verifică Clasificarea Blocurilor (+40 Pcte)'}
                </span>
              </button>
            </div>

            {classCooldown > 0 && (
              <PedagogicalReflectionBanner
                cooldown={classCooldown}
                totalSeconds={5}
                customMessageRo="Reflecție didactică: Asociază fiecare bloc cu scopul său funcțional (ex: buclele aparțin categoriei Control)!"
                customMessageEn="Pedagogical reflection: Match each block to its functional purpose (e.g., loops belong to Control)!"
              />
            )}

            {classificationValidated && (
              <div className={`p-3 rounded-xl border text-xs ${
                isClassificationCorrect
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {isClassificationCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  <span>{isClassificationCorrect ? (lang === 'en' ? 'Excellent! All blocks categorized perfectly!' : 'Excelent! Toate blocurile au fost asociate corect!') : (lang === 'en' ? 'Some categories are mismatched. Try again!' : 'Unele blocuri sunt asociate greșit. Reîncearcă!')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>{lang === 'en' ? 'Category Mastery Quiz' : 'Test de Cunoștințe: Categoriile Scratch'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Paleta standard de bază din Scratch 3.0 este organizată în exact 9 categorii de culori distincte."
              hintEn="The standard basic Scratch 3.0 palette is organized into exactly 9 distinct colored categories."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'How many standard block categories are available in the basic Scratch 3.0 palette?'
              : 'Câte categorii standard de blocuri există în paleta principală Scratch 3.0?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'nine_categories', ro: '9 categorii principale (Mișcare, Aspect, Sunet, Evenimente, Control, Detectare, Operatori, Variabile, Blocurile mele)', en: '9 main categories (Motion, Looks, Sound, Events, Control, Sensing, Operators, Variables, My Blocks)' },
              { id: 'three_cats', ro: 'Doar 3 categorii (Start, Stop, Pauză)', en: 'Only 3 categories (Start, Stop, Pause)' },
              { id: 'fifty_cats', ro: '50 de categorii diferite', en: '50 different categories' },
              { id: 'twenty_cats', ro: '20 de categorii', en: '20 categories' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'nine_categories'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: În Scratch 3.0 există 9 categorii principale de bază plus extensiile adiționale!"
              customMessageEn="Pedagogical reflection: Scratch 3.0 features 9 basic main categories plus additional extensions!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Paleta conține 9 categorii colorate distinctiv, facilitând găsirea rapidă a oricărui bloc după nuanța sa specifică."
              explanationEn="The palette contains 9 distinct colored categories, allowing students to spot blocks quickly by color."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Blocurile cu formă rotunjită de pălărie (Hat blocks) declanșează acțiuni la evenimente exterioare și au culoarea galben-aurie."
              hintEn="Hat blocks trigger actions on outside events and are styled in golden yellow."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which category contains the blocks that START scripts (like "when green flag clicked" or "when key pressed")?'
              : 'Din ce categorie fac parte blocurile care PORNESC scripturile (precum „când se dă clic pe steag” sau „când tasta este apăsată”)?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'yellow_events', ro: 'Evenimente (Events - galben / auriu)', en: 'Events (yellow / gold)' },
              { id: 'blue_motion', ro: 'Mișcare (Motion - albastru)', en: 'Motion (blue)' },
              { id: 'pink_sound', ro: 'Sunet (Sound - roz / magenta)', en: 'Sound (pink / magenta)' },
              { id: 'green_ops', ro: 'Operatori (Operators - verde)', en: 'Operators (green)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'yellow_events'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Categoria Evenimente furnizează declanșatorii oricărei animații sau interacțiuni!"
              customMessageEn="Pedagogical reflection: The Events category provides the triggers for all animations and interactions!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Blocurile din categoria Evenimente au formă convexă deasupra (pălărie), semnificând că ele reprezintă întotdeauna începutul unui lanț de instrucțiuni."
              explanationEn="Events blocks have a curved hat top, signifying they always sit at the start of an instruction chain."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={3}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 4: Proiectul „RoboTIC se prezintă”"
        nextButtonLabelEn="Proceed to Page 4: Project 'RoboTIC Introduces Himself'"
      />
    </div>
  );
};
