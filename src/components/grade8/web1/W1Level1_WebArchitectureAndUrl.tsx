import React, { useState } from 'react';
import {
  Globe,
  Server,
  Monitor,
  Link,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W1Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface UrlPart {
  id: string;
  label: string;
  value: string;
  desc: string;
  color: string;
}

const URL_PARTS: UrlPart[] = [
  {
    id: 'protocol',
    label: 'Protocolul de Comunicație',
    value: 'https://',
    desc: 'Manual pag. 36: HyperText Transfer Protocol Secure — protocolul criptat (SSL/TLS) ce garantează transferul securizat și confidențial al datelor între browser și server.',
    color: '#10b981'
  },
  {
    id: 'subdomain',
    label: 'Subdomeniul',
    value: 'www.',
    desc: 'Manual pag. 37: World Wide Web — prefixul istoric sau tehnic ce indică serviciul web al domeniului.',
    color: '#3b82f6'
  },
  {
    id: 'domain',
    label: 'Numele de Domeniu',
    value: 'arkyedu',
    desc: 'Manual pag. 37: Denumirea unică a organizației, platformei sau persoanei pe Internet, asociată cu o adresă IP prin sistemul DNS.',
    color: '#8b5cf6'
  },
  {
    id: 'tld',
    label: 'Domeniul de Nivel Superior (TLD)',
    value: '.ro',
    desc: 'Manual pag. 37: Top-Level Domain — indică originea geografică (.ro pentru România, .fr, .de) sau domeniul generic (.com, .org, .edu).',
    color: '#f59e0b'
  },
  {
    id: 'path',
    label: 'Calea către Fișier (Path)',
    value: '/lectii/clasa8/',
    desc: 'Manual pag. 37: Structura ierarhică a dosarelor (folderelor) de pe serverul web unde este găzduită resursa.',
    color: '#ec4899'
  },
  {
    id: 'resource',
    label: 'Resursa Web / Documentul',
    value: 'index.html',
    desc: 'Manual pag. 37: Numele fișierului efectiv descărcat și afișat în browser (de regulă cu extensia .html sau .htm).',
    color: '#06b6d4'
  }
];

export const W1Level1_WebArchitectureAndUrl: React.FC<W1Level1Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>('protocol');
  const [discoveredParts, setDiscoveredParts] = useState<string[]>(['protocol']);
  const [testedSimulations, setTestedSimulations] = useState<string[]>([]);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const handleSelectPart = (id: string) => {
    sounds.playClick();
    setSelectedPartId(id);
    if (!discoveredParts.includes(id)) {
      setDiscoveredParts(prev => [...prev, id]);
    }
  };

  const handleQuizAnswer = (qId: string, optIdx: number, isCorrect: boolean) => {
    if (quizSubmitted[qId] || isLocked(qId)) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const currentPart = URL_PARTS.find(p => p.id === selectedPartId) || URL_PARTS[0];
  const allPartsDiscovered = discoveredParts.length === URL_PARTS.length;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = allPartsDiscovered && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 36–37</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-400" />
              Nivelul 1: Arhitectura Web & Anatomia unui URL
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Cum comunică browserul tău cu serverul din celălalt colț al lumii? Disecă structura unei adrese web complete și înțelege rolul protocolului securizat HTTPS.
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-blue-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Elemente URL</div>
            <div className="text-2xl font-black text-blue-400">{discoveredParts.length}/{URL_PARTS.length}</div>
            <div className="text-[11px] text-slate-400">Părți Identificate</div>
          </div>
        </div>
      </div>

      {/* Client-Server Architecture Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Arhitectura Client - Server a Web-ului (Manual pag. 36)
          </div>
          <span className="text-xs text-slate-400 font-mono">Modelul Rețelei</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 items-center text-center">
          {/* Client (Browser) */}
          <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Clientul (Browser Web)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Chrome, Firefox, Safari, Edge. Trimite <strong>Cererea HTTP (Request)</strong> și interpretează codul HTML primit.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded border border-blue-800/40">
              Dispozitivul Elevului
            </span>
          </div>

          {/* Network Channel */}
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
              <span>Cerere (Request)</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500 rounded-full"></div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
              <ArrowRight className="w-4 h-4 text-sky-400 rotate-180 animate-pulse" />
              <span>Răspuns (HTML/CSS)</span>
            </div>
          </div>

          {/* Server */}
          <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Serverul Web (Host)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Computer conectat permanent la net care găzduiește fișierele HTML, procesează cererea și livrează conținutul.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40">
              Centru de Date
            </span>
          </div>
        </div>
      </div>

      {/* Interactive URL Dissector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Link className="w-4 h-4" /> Disecția Interactivă a unei Adrese URL (Uniform Resource Locator)
          </div>
          <span className="text-xs text-slate-400 font-mono">Manual pag. 37</span>
        </div>

        {/* Live URL Display Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
          <div className="flex items-center gap-1 font-mono text-base sm:text-lg justify-start sm:justify-center flex-wrap">
            {URL_PARTS.map(part => {
              const isSelected = selectedPartId === part.id;
              return (
                <button
                  key={part.id}
                  onClick={() => handleSelectPart(part.id)}
                  style={{
                    color: part.color,
                    borderColor: isSelected ? part.color : 'transparent',
                    backgroundColor: isSelected ? `${part.color}20` : 'transparent'
                  }}
                  className={`px-2 py-1 rounded-lg border font-bold transition-all hover:opacity-100 ${
                    isSelected ? 'ring-2' : 'opacity-80'
                  }`}
                >
                  {part.value}
                </button>
              );
            })}
          </div>
          <div className="text-center text-[11px] text-slate-500 mt-3 italic">
            Fă click pe fiecare fragment al adresei de mai sus pentru a-i descompune rolul conform manualului
          </div>
        </div>

        {/* Selected Fragment Explanation */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-base text-white">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: currentPart.color }}></span>
              {currentPart.label}: <code className="font-mono" style={{ color: currentPart.color }}>{currentPart.value}</code>
            </div>
            {discoveredParts.includes(currentPart.id) && (
              <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Identificat
              </span>
            )}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{currentPart.desc}</p>
        </div>

        {/* Buttons List for All Parts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {URL_PARTS.map(p => {
            const isSelected = selectedPartId === p.id;
            const isDiscovered = discoveredParts.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPart(p.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/15 text-blue-200 ring-2 ring-blue-500/20'
                    : isDiscovered
                    ? 'border-slate-800 bg-slate-950 text-slate-300'
                    : 'border-slate-800/60 bg-slate-950/40 text-slate-500'
                }`}
              >
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">{p.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">{p.value}</span>
                </div>
                {isDiscovered && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Reflecție Pedagogică: Arhitectura & Securitatea Web</h2>
            <p className="text-xs text-slate-400">Manual Art Klett pag. 36–37</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            1. De ce este protocolul <code className="text-emerald-400 font-mono">HTTPS</code> obligatoriu astăzi pentru site-urile web moderne, în locul vechiului HTTP?
          </div>
          <QuestionHint hint="Litera finală „S” provine de la Secure (securizat prin criptare SSL/TLS)." />
          <div className="space-y-2">
            {[
              { text: 'HTTPS criptează traficul de date între browser și server, împiedicând interceptarea parolelor, cardurilor sau a datelor personale de către atacatori', correct: true },
              { text: 'HTTPS face ca imaginile de pe site să se descarce mai colorate', correct: false },
              { text: 'HTTPS funcționează doar dacă utilizatorul nu este conectat la internet', correct: false }
            ].map((opt, idx) => {
              const qId = 'w1_l1_q1';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l1_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l1_q1'] || 0} />
          )}
          {quizSubmitted['w1_l1_q1'] && (
            <AnswerExplanation explanation="Corect! Manual pag. 36: Protocolul HTTPS asigură autenticitatea serverului și criptarea completă a canalului de transmisie, fiind standardul universal pentru securitate cibernetică." />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            2. Care este diferența dintre o „Pagină Web” (Web Page) și un „Sit Web” (Website)?
          </div>
          <QuestionHint hint="Gândește-te la o foaie dintr-o carte comparativ cu întreaga carte legată." />
          <div className="space-y-2">
            {[
              { text: 'Pagina web este un singur document HTML, în timp ce situl web este o colecție integrată de mai multe pagini web legate între ele prin hiperlegături și având un nume de domeniu comun', correct: true },
              { text: 'Pagina web conține doar text, iar situl web poate avea doar jocuri video', correct: false },
              { text: 'Nu există nicio diferență, sunt termeni complet identici', correct: false }
            ].map((opt, idx) => {
              const qId = 'w1_l1_q2';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l1_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l1_q2'] || 0} />
          )}
          {quizSubmitted['w1_l1_q2'] && (
            <AnswerExplanation explanation="Exact! Manual pag. 36: O pagină web este un fișier individual (ex: contact.html), pe când un sit web reprezintă ansamblul structurat de pagini interconectate sub aceeași identitate web." />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canFinish}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel="Spre Nivelul 2: Scheletul Documentului HTML5"
      />
    </div>
  );
};
