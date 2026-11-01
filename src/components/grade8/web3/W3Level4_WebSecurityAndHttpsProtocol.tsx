import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Eye,
  Key,
  FileWarning,
  CheckCircle2,
  Server
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W3Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const W3Level4_WebSecurityAndHttpsProtocol: React.FC<W3Level4Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [protocol, setProtocol] = useState<'http' | 'https'>('https');
  const [formInput, setFormInput] = useState<string>('ParolaSecretă123!');

  // Quiz state
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
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 4: Securitate Web, Protocolul HTTPS & Protecția Datelor (GDPR)
            </h1>
            <p className="text-emerald-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 55–56: Înțelege diferența vitală dintre HTTP și HTTPS, rolul criptării SSL/TLS,
              simbolul lacătului din browser și normele de protecție a datelor personale pe un site școlar.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">4 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Criptare Web & Confidențialitate (Manual pag. 55–56)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              HTTPS & Certificatul SSL/TLS
            </div>
            <p className="text-slate-600 text-xs">
              <strong>HTTPS</strong> adaugă un strat criptografic de securitate. Toate pachetele de date
              dintre vizitator și server sunt cifrate cu chei matematice, fiind protejate de interceptare chiar și pe rețele Wi-Fi publice.
            </p>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Pericolul HTTP Tradițional
            </div>
            <p className="text-slate-600 text-xs">
              Pe o conexiune simplă <strong>HTTP</strong>, datele călătoresc în text clar (Plain Text).
              Orice intermediar rău intenționat din rețea poate citi parolele, mesajele sau răspunsurile la chestionare.
            </p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-blue-600" />
              Protecția Datelor Personale (GDPR)
            </div>
            <p className="text-slate-600 text-xs">
              Pe site-ul clasei este <strong>strict interzisă</strong> publicarea datelor cu caracter personal:
              CNP, adrese de domiciliu, numere de telefon sau fotografii ale minorilor fără acordul scris al părinților.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Network Packet Inspector Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Inspectorul de Pachete de Rețea (HTTP vs HTTPS)
            </h3>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
            Laborator Criptografie
          </span>
        </div>

        {/* Protocol Switcher */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setProtocol('https');
              sounds.playClick();
            }}
            className={`flex-1 p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
              protocol === 'https'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-300" />
            <span>Conexiune HTTPS Securizată (Port 443 + TLS)</span>
          </button>

          <button
            onClick={() => {
              setProtocol('http');
              sounds.playClick();
            }}
            className={`flex-1 p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
              protocol === 'http'
                ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Unlock className="w-4 h-4 text-rose-300" />
            <span>Conexiune HTTP Nesecurizată (Port 80 - Text Clar)</span>
          </button>
        </div>

        {/* Mock Browser URL Bar */}
        <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 flex items-center gap-2 text-xs font-mono">
          {protocol === 'https' ? (
            <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              https://
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded">
              <Unlock className="w-3.5 h-3.5 text-rose-600" />
              http:// (Nesigur!)
            </span>
          )}
          <span className="text-slate-800">sites.google.com/view/revista-infoteen-8/login</span>
        </div>

        {/* Transmission Simulation */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Date transmise de elev în formularul de autentificare:
            </label>
            <input
              type="text"
              value={formInput}
              onChange={(e) => setFormInput(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 font-mono"
            />
            <span className="text-[11px] text-slate-500 block">
              Modifică textul pentru a vedea cum se transformă datele în tranzitul pe rețea.
            </span>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
            <div className="text-[11px] text-slate-400 border-b border-slate-800 pb-1 flex justify-between">
              <span>Ce vede un hacker / interceptor de rețea (Sniffer):</span>
              <span className={protocol === 'https' ? 'text-emerald-400' : 'text-rose-400'}>
                {protocol === 'https' ? 'Criptat AES-256' : 'EXPUS ÎN CLAR!'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 break-all text-[11px]">
              {protocol === 'https' ? (
                <span className="text-emerald-400">
                  {`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855#ENC:${btoa(formInput || 'data')}`}
                </span>
              ) : (
                <span className="text-rose-400 font-bold">
                  POST /login HTTP/1.1<br />
                  Host: sites.google.com<br />
                  password={formInput || 'gol'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Securitate Web & Date Personale (Manual pag. 55–56)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Ce indică prezența pictogramei în formă de lacăt închis din bara de adrese a browserului atunci când vizitezi un site Google Sites?
            </span>
            <QuestionHint
              hint="Manual pag. 55: Lacătul simbolizează prezența unui certificat de securitate valid și folosirea protocolului securizat HTTPS."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Că site-ul este blocat și nu mai poate fi accesat niciodată' },
              { id: 'opt_b', label: 'B. Că datele dintre utilizator și server sunt criptate prin protocolul HTTPS și conexiunea este sigură' },
              { id: 'opt_c', label: 'C. Că trebuie să introduci o cheie metalică în unitatea centrală' },
              { id: 'opt_d', label: 'D. Că site-ul nu funcționează fără conexiune prin cablu TV' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-emerald-600 bg-emerald-50 font-semibold'
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Lacătul închis confirmă că site-ul folosește un certificat digital valid și protocolul HTTPS, protejând datele împotriva interceptării pe traseu."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: În cadrul proiectului online al clasei, care dintre următoarele elemente este STRICT INTERZIS să fie publicat pe site conform legislației de protecție a datelor (GDPR)?
            </span>
            <QuestionHint
              hint="Manual pag. 56: Datele cu caracter personal care pot identifica sau localiza fizic un minor în viața reală trebuie strict protejate."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Titlul proiectului și descrierea temei alese de echipă' },
              { id: 'opt_b', label: 'B. Datele personale sensibile ale elevilor: CNP, adresa de domiciliu și numărul de telefon privat' },
              { id: 'opt_c', label: 'C. O schemă logică sau un cod sursă C++ scris la ore' },
              { id: 'opt_d', label: 'D. Numele profesorului îndrumător' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-emerald-600 bg-emerald-50 font-semibold'
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! CNP-ul, adresa locuinței și numerele de telefon constituie date cu caracter personal cu risc ridicat și nu trebuie publicate niciodată pe pagini web publice."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={4}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 5: Optimizare pentru Motoarele de Căutare (SEO)"
      />
    </div>
  );
};
