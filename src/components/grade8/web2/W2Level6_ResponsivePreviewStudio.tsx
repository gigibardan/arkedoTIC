import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  X,
  Menu,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Maximize2,
  Minimize2,
  Layout
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W2Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const W2Level6_ResponsivePreviewStudio: React.FC<W2Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (qId: string, optId: string) => {
    if (submitted[qId] || isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = answers[qId] === correctId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmitted(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Eye className="w-5 h-5 text-emerald-300" />
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2B</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 6: Previzualizare Responsive & Testare Multi-Dispozitiv
            </h1>
            <p className="text-emerald-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 49–50: Învață cum funcționează modul de previzualizare în Google Sites pe
              calculator, tabletă și telefon mobil, și cum se adaptează automat meniul de navigare și coloanele.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">6 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-teal-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Design Responsive în Google Sites (Manual pag. 49–50)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-100 space-y-2">
            <div className="font-bold text-teal-900 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-teal-600" />
              Ecran Mare (Desktop)
            </div>
            <p className="text-slate-600 text-xs">
              Pe calculatoare și laptopuri, paginile afișează toate coloanele orizontale una lângă alta, iar meniul
              de navigare este desfășurat complet în bara de sus sau în panoul lateral fix.
            </p>
          </div>

          <div className="bg-cyan-50/70 p-4 rounded-xl border border-cyan-100 space-y-2">
            <div className="font-bold text-cyan-900 flex items-center gap-2">
              <Tablet className="w-4 h-4 text-cyan-600" />
              Mod Tabletă
            </div>
            <p className="text-slate-600 text-xs">
              Rezoluția intermediară ajustează marginile laterale și optimizează spațiile dintre butoane pentru
              interacțiunea tactilă facilă cu degetul.
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Ecran Telefon (Mobile)
            </div>
            <p className="text-slate-600 text-xs">
              Coloanele paralele se <strong>stivuiesc vertical</strong> (una sub alta), iar meniul orizontal
              se compactează automat într-un meniu pliabil cu 3 linii orizontale: <strong>meniul „hamburger” (☰)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Responsive Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Fereastra de Previzualizare Google Sites
            </h3>
          </div>
          <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-semibold">
            Testare Live
          </span>
        </div>

        {/* Device Switcher Bar (simulating the bottom right toolbar in Google Sites) */}
        <div className="flex flex-wrap items-center justify-between bg-slate-900 text-white p-3 rounded-xl shadow">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Eye className="w-4 h-4 text-teal-400" />
            <span>Comută modul de afișare (Bara plutitoare Google Sites):</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDevice('desktop');
                setMobileMenuOpen(false);
                sounds.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                device === 'desktop'
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Computer</span>
            </button>
            <button
              onClick={() => {
                setDevice('tablet');
                setMobileMenuOpen(false);
                sounds.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                device === 'tablet'
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tabletă</span>
            </button>
            <button
              onClick={() => {
                setDevice('mobile');
                sounds.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                device === 'mobile'
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Telefon</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-700 mx-1"></div>
            <button
              title="Ieși din previzualizare (X albastru în Google Sites)"
              onClick={() => sounds.playClick()}
              className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mock Device Container */}
        <div className="flex justify-center bg-slate-100 p-4 md:p-8 rounded-2xl border border-slate-200 overflow-hidden">
          <div
            className={`transition-all duration-300 bg-white rounded-xl shadow-2xl border-4 border-slate-700 overflow-hidden ${
              device === 'desktop'
                ? 'w-full max-w-4xl'
                : device === 'tablet'
                ? 'w-[640px]'
                : 'w-[360px]'
            }`}
          >
            {/* Mock Viewport Header */}
            <div className="bg-slate-800 text-slate-300 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-700">
              <div className="font-mono text-[11px] truncate">
                {device === 'desktop' && 'Desktop 1920×1080 (Lățime completă)'}
                {device === 'tablet' && 'Tabletă 768×1024 (Adaptare tactilă)'}
                {device === 'mobile' && 'Smartphone 375×812 (Flux vertical & Hamburger)'}
              </div>
              <span className="text-[10px] bg-teal-900/80 text-teal-300 px-2 py-0.5 rounded font-bold">
                {device.toUpperCase()}
              </span>
            </div>

            {/* Dynamic Site Content */}
            <div className="p-4 md:p-6 space-y-4">
              {/* Top Navigation */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                <div className="font-black text-sm md:text-base text-teal-800 tracking-tight">
                  ECO-ROBOTICA 2025
                </div>

                {device === 'mobile' ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(!mobileMenuOpen);
                      sounds.playClick();
                    }}
                    className="p-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex gap-3 text-xs font-semibold text-slate-600">
                    <span className="text-teal-700 font-bold border-b-2 border-teal-600">Acasă</span>
                    <span>Proiecte</span>
                    <span>Senzori</span>
                    <span>Contact</span>
                  </div>
                )}
              </div>

              {/* Mobile Drawer if open */}
              {device === 'mobile' && mobileMenuOpen && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 space-y-2 text-xs font-semibold text-teal-900 animate-fadeIn">
                  <div className="p-1.5 hover:bg-teal-100 rounded">📍 Acasă</div>
                  <div className="p-1.5 hover:bg-teal-100 rounded">🤖 Proiecte Robotică</div>
                  <div className="p-1.5 hover:bg-teal-100 rounded">⚡ Senzori & Cod</div>
                  <div className="p-1.5 hover:bg-teal-100 rounded">📬 Formular Contact</div>
                </div>
              )}

              {/* Banner */}
              <div className="bg-gradient-to-r from-teal-700 to-cyan-700 text-white rounded-xl p-4 md:p-6 shadow">
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-200 block mb-1">
                  Revista de Științe Aplicate
                </span>
                <h3 className="text-lg md:text-xl font-black">
                  Robotul Colector de Deșeuri Marine
                </h3>
                <p className="text-xs text-teal-100 mt-1 max-w-lg">
                  Proiect realizat de elevii clasei a VIII-a folosind plăcuțe compatibile Arduino și senzori ultrasonici.
                </p>
              </div>

              {/* Responsive Columns Layout */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Macheta de conținut (3 Coloane):</div>
                <div
                  className={`grid gap-3 ${
                    device === 'mobile'
                      ? 'grid-cols-1'
                      : device === 'tablet'
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                  }`}
                >
                  {[
                    { title: 'Modul Şasiu', desc: 'Structură din aluminiu reciclat cu roți motoare.', color: 'border-teal-300' },
                    { title: 'Senzor Ultrasonic', desc: 'Detectează obstacolele în rază de 4 metri.', color: 'border-cyan-300' },
                    { title: 'Placă Microcontroler', desc: 'Execută codul C++ în timp real.', color: 'border-blue-300' }
                  ].map((card, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border bg-slate-50 space-y-1.5 ${card.color}`}
                    >
                      <div className="h-20 bg-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                        Foto Componentă {i + 1}
                      </div>
                      <div className="font-bold text-xs text-slate-800">{card.title}</div>
                      <div className="text-[11px] text-slate-600">{card.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsive Behavior Note */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                <strong>Observație Responsive:</strong>{' '}
                {device === 'desktop' && 'Pe ecran mare, cele 3 carduri sunt aranjate orizontal (3 coloane paralele).'}
                {device === 'tablet' && 'Pe tabletă, cardurile se restrâng fluid pe 2 coloane pentru echilibru vizual.'}
                {device === 'mobile' && 'Pe mobil, cele 3 carduri s-au stivuit vertical pe o singură coloană, permițând derulare naturală fără zoom manual!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Comportamentul Responsive (Manual pag. 49–50)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Cum se transformă meniul orizontal de navigare al unui site Google Sites atunci când este vizualizat pe ecranul îngust al unui telefon mobil?
            </span>
            <QuestionHint
              hint="Manual pag. 49: Spațiul limitat pe smartphone nu permite afișarea tuturor butoanelor orizontale, motiv pentru care se apelează la un simbol specific de meniu derulant."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Meniul dispare complet și utilizatorul nu mai poate naviga pe alte pagini' },
              { id: 'opt_b', label: 'B. Se compactează automat într-un meniu pliabil cu 3 linii orizontale (simbolul hamburger ☰)' },
              { id: 'opt_c', label: 'C. Textul devine minuscul de 2 pixeli și nu mai poate fi citit' },
              { id: 'opt_d', label: 'D. Se deschide automat într-un fișier Excel separat' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-teal-600 bg-teal-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Pentru ecranele mobile, Google Sites pliază automat bara de navigare în meniul „hamburger” (☰), economisind spațiu valoros pe ecran fără a pierde structura paginilor."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Cum ieși din modul de Previzualizare pentru a reveni la ecranul de editare în Google Sites?
            </span>
            <QuestionHint
              hint="Manual pag. 50: Bara plutitoare din colțul din dreapta jos conține, lângă pictogramele de dispozitive, un buton albastru cu simbolul X."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Închizând calculatorul de la butonul de alimentare' },
              { id: 'opt_b', label: 'B. Dând clic pe butonul rotund marcat cu „X” din bara de previzualizare aflată în colțul dreapta jos' },
              { id: 'opt_c', label: 'C. Ștergând istoricul de navigare al browserului' },
              { id: 'opt_d', label: 'D. Doar deconectându-te din contul Google' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-teal-600 bg-teal-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Butonul albastru marcat cu „X” din bara plutitoare închide instantaneu modul de previzualizare și te readuce în spațiul complet de lucru al editorului."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={6}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 7: Evaluarea Sumativă Oficială Google Sites"
      />
    </div>
  );
};
