import React, { useState } from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Table as TableIcon, 
  Shapes, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Star,
  Check,
  Video,
  Music,
  Plus
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P2Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface PlacedObject {
  id: string;
  type: 'text' | 'image' | 'shape' | 'table';
  label: string;
  icon: string;
  x: number;
  y: number;
}

export const P2Level2_InsertObjects: React.FC<P2Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Slide Objects Playground
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([
    { id: 't1', type: 'text', label: 'Titlu: Călătorie în Univers', icon: '📝', x: 20, y: 15 }
  ]);
  const [testedInsertTypes, setTestedInsertTypes] = useState<Record<string, boolean>>({ text: true });

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleAddObject = (type: 'text' | 'image' | 'shape' | 'table') => {
    sounds.playRetro('coin');
    const labels = {
      text: 'Casetă Text: Planetele Sistemului Solar',
      image: 'Imagine: Telescopul Spațial James Webb 🪐',
      shape: 'Formă: Săgeată Tridimensională ➔',
      table: 'Tabel: Comparație Diametru & Masă (3x3)'
    };
    const icons = {
      text: '📝',
      image: '🖼️',
      shape: '⭐',
      table: '📊'
    };
    const newObj: PlacedObject = {
      id: `${type}_${Date.now()}`,
      type,
      label: labels[type],
      icon: icons[type],
      x: Math.floor(Math.random() * 40) + 10,
      y: Math.floor(Math.random() * 40) + 20
    };
    setPlacedObjects(prev => [...prev, newObj]);
    setTestedInsertTypes(prev => ({ ...prev, [type]: true }));
  };

  const handleClearSlide = () => {
    sounds.playClick();
    setPlacedObjects([{ id: 't1', type: 'text', label: 'Titlu: Călătorie în Univers', icon: '📝', x: 20, y: 15 }]);
  };

  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'textbox_mandatory') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'aspect_ratio') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'textbox_mandatory';
  const isQ2Correct = q2Answer === 'aspect_ratio';

  const insertedCount = Object.keys(testedInsertTypes).length;
  const explorerScore = insertedCount >= 3 ? 50 : insertedCount * 15;
  const quizScore = (isQ1Correct ? 25 : 0) + (isQ2Correct ? 25 : 0);
  const totalScore = Math.min(100, explorerScore + quizScore);

  const isPageComplete = (q1Answer !== null && q2Answer !== null) || insertedCount >= 3;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/40">
              {lang === 'en' ? 'Grade 6 • Unit 1 • Page 17' : 'Clasa a VI-a • Unitatea 1 • Pag. 17'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {lang === 'en' ? 'Screen 2 of 7 • Mission 1B' : 'Ecranul 2 din 7 • Misiunea 1B'}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
              <Shapes className="w-6 h-6" />
            </span>
            <span>
              {lang === 'en'
                ? 'Inserting Objects: Text Boxes, Tables, Images & Shapes'
                : 'Inserarea Obiectelor: Casete Text, Imagini, Tabele & Forme'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'A PowerPoint slide is a modular container! In PowerPoint, you cannot type directly on the background: text ALWAYS lives inside a Text Box (Casetă de text).'
              : 'Un diapozitiv este un container modular! În PowerPoint, nu poți scrie direct pe fundal ca într-un document Word: textul trebuie introdus ÎNTOTDEAUNA într-o Casetă de Text (Text Box) sau într-o formă.'}
          </p>
        </div>
      </div>

      {/* 4 Object Categories Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Type className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Casete de Text</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Permit plasarea liberă a titlurilor, paragrafelor și listelor marcate oriunde pe diapozitiv.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <ImageIcon className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Imagini (Locale/Web)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Fotografii clare, diagrame sau hărți care susțin vizual mesajul prezentării.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Shapes className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Forme Geometrice</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dreptunghiuri, cercuri, săgeți direcționale și casete de dialog pentru evidențiere.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <TableIcon className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Tabele & Date</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Organizarea datelor comparative în rânduri și coloane ordonate logic.
          </p>
        </div>
      </div>

      {/* Interactive Composition Studio */}
      <div className="bg-slate-900/95 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              {lang === 'en' ? 'Slide Composition Studio' : 'Atelierul de Compoziție al Diapozitivului'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-heading">
              {lang === 'en' ? 'Add objects onto the slide canvas:' : 'Adaugă obiecte pe pânza diapozitivului:'}
            </h3>
          </div>

          {/* Quick Insert Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAddObject('text')}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Casetă Text</span>
            </button>
            <button
              onClick={() => handleAddObject('image')}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Imagine</span>
            </button>
            <button
              onClick={() => handleAddObject('shape')}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Formă</span>
            </button>
            <button
              onClick={() => handleAddObject('table')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tabel</span>
            </button>
            <button
              onClick={handleClearSlide}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Live Canvas Viewport */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="w-full max-w-2xl h-72 bg-gradient-to-br from-slate-900 to-indigo-950/70 border-2 border-slate-700 rounded-2xl p-4 relative shadow-2xl overflow-hidden">
            <span className="text-[10px] font-mono text-slate-500 absolute top-2 right-3">
              Diapozitiv Activ • {placedObjects.length} Obiecte Inserate
            </span>

            {/* Render placed objects */}
            <div className="flex flex-col gap-2.5 mt-4 max-h-56 overflow-y-auto pr-1">
              {placedObjects.map((obj, i) => (
                <div
                  key={obj.id}
                  className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-600/80 shadow-md flex items-center justify-between gap-3 text-xs text-white animate-in fade-in"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{obj.icon}</span>
                    <span className="font-semibold truncate">{obj.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-orange-300 shrink-0">
                    Obiect #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoint Quiz */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg sm:text-xl font-black text-white font-heading">
            {lang === 'en' ? 'Checkpoint Questions (Art Klett p. 17)' : 'Întrebări de Fixare (Manual Art Klett pag. 17)'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '1. Can you write text directly onto an empty slide background in PowerPoint?'
                : '1. Poți scrie text direct pe fundalul unui diapozitiv fără o casetă de text în PowerPoint?'}
            </span>
            <QuestionHint
              hintRo="Spre deosebire de Word, în PowerPoint textul stă întotdeauna într-un container (Text Box)."
              hintEn="Unlike Word, in PowerPoint text always lives in a Text Box container."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'textbox_mandatory', ro: 'Nu, textul trebuie introdus OBLIGATORIU într-o Casetă de Text (Text Box) sau într-o formă', en: 'No, text must MANDATORILY go inside a Text Box or a Shape' },
              { id: 'yes_anywhere', ro: 'Da, poți da clic oriunde pe ecran și începi să tastezi', en: 'Yes, just click anywhere and start typing' },
              { id: 'only_titles', ro: 'Nu poți scrie text deloc, doar imagini', en: 'You cannot write text at all, only images' },
              { id: 'only_numbers', ro: 'Doar dacă tastezi cifre, nu și litere', en: 'Only if you type numbers, not letters' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'textbox_mandatory'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
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
              customMessageRo="Reflecție didactică: În PowerPoint, toate elementele de text se află în casete de text independente!"
              customMessageEn="Pedagogical reflection: In PowerPoint, all text elements live inside independent text boxes!"
            />
          ) : null}

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! În PowerPoint, textul se introduce exclusiv în Casete de Text (Text Box) sau forme geometrice, ceea ce permite repoziționarea liberă a textului pe ecran."
              explanationEn="Correct! In PowerPoint, text is placed exclusively inside Text Boxes or shapes, allowing free placement on canvas."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '2. How do you resize an image proportionally without distorting (stretching) it?'
                : '2. Cum redimensionezi corect o imagine fără a o deforma (alungi sau turti)?'}
            </span>
            <QuestionHint
              hintRo="Tragi de colțuri (sau ții apăsată tasta Shift), nu de marginile laterale!"
              hintEn="Drag from the corners (or hold Shift), not from the side edges!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'aspect_ratio', ro: 'Trăgând de cercurile din colțuri (menținând proporțiile lățime-înălțime)', en: 'Dragging from the corner handles (preserving aspect ratio)' },
              { id: 'stretch_sides', ro: 'Trăgând doar de latura din stânga până se lățește', en: 'Dragging only the left side until it widens' },
              { id: 'delete_insert', ro: 'Ștergând și reîncărcând de 10 ori poza', en: 'Deleting and re-inserting 10 times' },
              { id: 'close_app', ro: 'Închizând prezentarea', en: 'Closing the presentation' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'aspect_ratio'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
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
              customMessageRo="Reflecție didactică: Redimensionarea de la colțuri păstrează raportul de aspect original al fotografiei!"
              customMessageEn="Pedagogical reflection: Corner resizing preserves the original aspect ratio of the photo!"
            />
          ) : null}

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Excelent! Redimensionarea de la mânerele din colțuri (colțurile chenarului de selecție) păstrează proporțiile naturale ale imaginii fără deformare."
              explanationEn="Excellent! Dragging the corner handles preserves the natural proportions without any ugly distortion."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={2}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 3: Teme, Raport de Aspect (16:9 vs 4:3) & Fundaluri"
        nextButtonLabelEn="Proceed to Page 3: Themes, Aspect Ratio (16:9 vs 4:3) & Backgrounds"
      />
    </div>
  );
};
