import React, { useState } from 'react';
import {
  UploadCloud,
  Globe,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Lock,
  Server
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W3Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const W3Level1_PublishingAndDomains: React.FC<W3Level1Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Publishing simulator state
  const [siteSlug, setSiteSlug] = useState<string>('revista-infoteen-8');
  const [requestNoIndex, setRequestNoIndex] = useState<boolean>(false);
  const [customDomainActive, setCustomDomainActive] = useState<boolean>(false);
  const [published, setPublished] = useState<boolean>(false);

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

  // Slug cleaner
  const cleanSlug = siteSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <UploadCloud className="w-5 h-5 text-sky-300" />
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 1: Procedura de Publicare & Gestionarea Domeniilor Web
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 52–53: Învață cum se transformă un proiect privat din spațiul de editare Google Sites
              într-un site public accesibil pe întreg globul, cum se alege adresa URL și rolul domeniilor personalizate.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-sky-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">1 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Dialogul de Publicare Google Sites (Manual pag. 52)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              Butonul „Publicați” (Publish)
            </div>
            <p className="text-slate-600 text-xs">
              Situat în colțul din dreapta-sus al editorului. Până la acționarea acestui buton, site-ul tău există
              doar ca ciornă de lucru privată (Draft) în Google Drive, inaccesibilă altor utilizatori pe internet.
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              Adresa Web Canonică
            </div>
            <p className="text-slate-600 text-xs">
              Structura URL standard este: <code>https://sites.google.com/view/<strong>[nume-site]</strong></code>.
              Numele trebuie să conțină doar litere mici, cifre și cratime (-), fără spații sau diacritice românești (ă, î, ș, ț, â).
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              Domenii Personalizate
            </div>
            <p className="text-slate-600 text-xs">
              Pentru proiecte oficiale ale școlii, se poate atașa un domeniu propriu (ex: <code>www.cn-vladimirescu.ro</code>)
              prin configurarea înregistrărilor CNAME în serverele de nume de domeniu (DNS).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Publishing Dialog Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Fereastra „Publicare pe web” (Google Sites Publish Modal)
            </h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
            Laborator Practic
          </span>
        </div>

        {/* Modal Window Simulator */}
        <div className="max-w-2xl mx-auto border-2 border-slate-300 rounded-2xl shadow-xl overflow-hidden bg-white">
          <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-sky-400" />
              Publicare pe web
            </span>
            <span className="text-xs text-slate-400 font-mono">Google Sites Engine</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Slug Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Adresă Web (Numele proiectului tău):
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs">
                <span className="text-slate-500 font-mono whitespace-nowrap">
                  https://sites.google.com/view/
                </span>
                <input
                  type="text"
                  value={siteSlug}
                  onChange={(e) => {
                    setSiteSlug(e.target.value);
                    setPublished(false);
                  }}
                  className="w-full bg-transparent font-bold text-indigo-700 outline-none ml-1 font-mono"
                  placeholder="nume-site-clasa"
                />
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Adresă validată: <code>https://sites.google.com/view/{cleanSlug || 'nume'}</code></span>
              </div>
            </div>

            {/* Custom Domain Option */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Domeniu Personalizat (Custom Domain)
                </div>
                <button
                  onClick={() => {
                    setCustomDomainActive(!customDomainActive);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    customDomainActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {customDomainActive ? 'Activat' : 'Activează'}
                </button>
              </div>
              {customDomainActive && (
                <div className="text-xs text-indigo-900 bg-indigo-50 p-2.5 rounded-lg border border-indigo-200 animate-fadeIn">
                  Site-ul va răspunde și la: <strong>www.infoteen-colegiu.edu.ro</strong> (certificat SSL securizat activat).
                </div>
              )}
            </div>

            {/* Search Engine Visibility Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={requestNoIndex}
                  onChange={(e) => {
                    setRequestNoIndex(e.target.checked);
                    sounds.playClick();
                  }}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <div>
                  <strong className="text-slate-900 block">Setări de căutare:</strong>
                  Solicitați motoarelor de căutare publice să nu afișeze site-ul meu (noindex).
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Util atunci când site-ul este încă în construcție sau este destinat exclusiv colegilor din clasă.
                  </span>
                </div>
              </label>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setSiteSlug('revista-infoteen-8');
                  setRequestNoIndex(false);
                  setPublished(false);
                  sounds.playClick();
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Anulează
              </button>

              <button
                onClick={() => {
                  setPublished(true);
                  sounds.playCorrect();
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition transform active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Publicați Site-ul Acum</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Published Feedback */}
        {published && (
          <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-xl text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Site-ul a fost publicat cu succes pe internet!
            </div>
            <p className="text-emerald-800">
              Oricine poate accesa pagina ta folosind adresa securizată:{' '}
              <a
                href="#simulator"
                onClick={(e) => e.preventDefault()}
                className="font-mono font-bold underline text-blue-700"
              >
                https://sites.google.com/view/{cleanSlug}
              </a>
            </p>
            <div className="text-[11px] text-slate-600">
              Stare indexare Google: {requestNoIndex ? '❌ Ascuns de motoarele de căutare publice' : '✅ Indexabil de Googlebot & Bing'}
            </div>
          </div>
        )}
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Regulile de Publicare (Manual pag. 52–53)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Dacă ai terminat de aranjat textele și imaginile pe pânza Google Sites, dar nu ai apăsat butonul albastru „Publicați” (Publish), ce vor vedea vizitatorii care încearcă să acceseze adresa site-ului?
            </span>
            <QuestionHint
              hint="Manual pag. 52: Până la publicare, modificările există doar în spațiul privat de editare din Google Drive al autorului."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Vor vedea automat ultima variantă editată, deoarece Google salvează totul în cloud' },
              { id: 'opt_b', label: 'B. Vor primi o eroare (404 - Sit negăsit) sau vor vedea doar varianta publicată anterior, deoarece noile modificări sunt doar ciorne private' },
              { id: 'opt_c', label: 'C. Calculatorul vizitatorilor va descărca automat fișierul pe desktop' },
              { id: 'opt_d', label: 'D. Vor primi un apel telefonic de la Google' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Butonul „Publicați” este comutatorul esențial care propagă ciorna (Draft) din modul de editare în versiunea publică online accesibilă vizitatorilor."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Care dintre următoarele adrese URL respectă regulile stricte de denumire a unui site Google Sites conform manualului (pag. 52)?
            </span>
            <QuestionHint
              hint="Manual pag. 52: Adresele URL nu permit spații libere, majuscule sau diacritice românești (ă, î, ș, ț, â), utilizându-se cratima (-) ca separator."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. sites.google.com/view/Revista Școlară Clasa a 8-a!' },
              { id: 'opt_b', label: 'B. sites.google.com/view/revista-scolara-clasa8' },
              { id: 'opt_c', label: 'C. sites.google.com/view/proiect învățământ 2025' },
              { id: 'opt_d', label: 'D. sites.google.com/view/școala_noastră#1' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Numai varianta B folosește exclusiv litere mici fără diacritice, cifre și cratime (-) ca separatori, fiind compatibilă 100% cu standardele de adresare URL la nivel mondial."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={1}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 2: Partajare & Colaborare Multi-Utilizator"
      />
    </div>
  );
};
