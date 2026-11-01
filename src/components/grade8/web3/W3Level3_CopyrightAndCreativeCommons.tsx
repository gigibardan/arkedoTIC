import React, { useState } from 'react';
import {
  ShieldAlert,
  Scale,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Copyright,
  ExternalLink,
  Info
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W3Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface LicenseType {
  code: string;
  name: string;
  badge: string;
  commercial: boolean;
  derivative: 'yes' | 'sharealike' | 'no';
  summary: string;
  schoolContext: string;
}

const LICENSES: LicenseType[] = [
  {
    code: 'CC BY',
    name: 'Atribuire (Attribution)',
    badge: 'BY',
    commercial: true,
    derivative: 'yes',
    summary: 'Permite redistribuirea, modificarea și utilizarea comercială sau necomercială, cu condiția obligatorie de a credita autorul.',
    schoolContext: 'Cea mai flexibilă licență. Excelentă pentru articole școlare și tutoriale deschise.'
  },
  {
    code: 'CC BY-SA',
    name: 'Atribuire - Distribuire în condiții identice (ShareAlike)',
    badge: 'BY-SA',
    commercial: true,
    derivative: 'sharealike',
    summary: 'Permite adaptarea lucrării, dar orice lucrare derivată trebuie distribuită sub exact aceeași licență (modelul Wikipedia).',
    schoolContext: 'Ideală pentru proiecte comunitare deschise dezvoltate împreună cu alte școli.'
  },
  {
    code: 'CC BY-NC',
    name: 'Atribuire - Necomercial (NonCommercial)',
    badge: 'BY-NC',
    commercial: false,
    derivative: 'yes',
    summary: 'Permite descărcarea și modificarea operei, dar exclusiv în scopuri necomerciale (educaționale, non-profit).',
    schoolContext: 'Licența standard pentru materialele didactice școlare, fișe de lucru și reviste ale elevilor.'
  },
  {
    code: 'CC BY-NC-ND',
    name: 'Atribuire - Necomercial - Fără derivate (NoDerivs)',
    badge: 'BY-NC-ND',
    commercial: false,
    derivative: 'no',
    summary: 'Cea mai restrictivă licență CC: permite doar descărcarea și partajarea operei intacte, fără modificări și fără scop comercial.',
    schoolContext: 'Potrivită pentru poezii, eseuri premiate la olimpiadă sau fotografii oficiale de arhivă.'
  },
  {
    code: 'CC0',
    name: 'Domeniu Public (Public Domain Dedication)',
    badge: '0',
    commercial: true,
    derivative: 'yes',
    summary: 'Autorul a renunțat complet la drepturile de autor; opera poate fi utilizată liber fără nicio restricție.',
    schoolContext: 'Resurse preluate de pe platforme gratuite precum Unsplash sau Wikimedia Commons.'
  }
];

export const W3Level3_CopyrightAndCreativeCommons: React.FC<W3Level3Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // License Generator State
  const [commercialAllowed, setCommercialAllowed] = useState<boolean>(false);
  const [modificationsAllowed, setModificationsAllowed] = useState<'yes' | 'sharealike' | 'no'>('yes');
  const [workTitle, setWorkTitle] = useState<string>('Ghid de Robotică Clasa a VIII-a');
  const [authorName, setAuthorName] = useState<string>('Echipa STEAM ArkyEdu');

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

  // Determine current computed license
  let currentLicenseCode = 'CC BY';
  if (!commercialAllowed) {
    if (modificationsAllowed === 'no') currentLicenseCode = 'CC BY-NC-ND';
    else if (modificationsAllowed === 'sharealike') currentLicenseCode = 'CC BY-NC-SA';
    else currentLicenseCode = 'CC BY-NC';
  } else {
    if (modificationsAllowed === 'no') currentLicenseCode = 'CC BY-ND';
    else if (modificationsAllowed === 'sharealike') currentLicenseCode = 'CC BY-SA';
    else currentLicenseCode = 'CC BY';
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-rose-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Scale className="w-5 h-5 text-amber-300" />
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 3: Drepturi de Autor (Copyright) & Licențe Creative Commons
            </h1>
            <p className="text-amber-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 54–55: Înțelege proprietatea intelectuală în mediul digital, riscurile plagiatului,
              cum se folosesc legal imaginile de pe internet și cum atribui corect o licență Creative Commons proiectului tău.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-amber-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">3 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Proprietate Intelectuală & Etică Digitală (Manual pag. 54–55)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <Copyright className="w-4 h-4 text-rose-600" />
              Dreptul de Autor (Copyright ©)
            </div>
            <p className="text-slate-600 text-xs">
              Conform Legii nr. 8/1996, orice creație originală (texte, fotografii, ilustrații, clipuri video)
              este protejată automat. Faptul că o imagine apare pe Google Images <strong>nu înseamnă</strong> că este liberă de drepturi!
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              Licențele Creative Commons (CC)
            </div>
            <p className="text-slate-600 text-xs">
              Sunt licențe juridice standardizate care permit autorilor să ofere dreptul de reutilizare publicului,
              păstrând controlul prin clauze: <strong>BY</strong> (Atribuire), <strong>NC</strong> (Necomercial), <strong>SA</strong> (Condiții identice), <strong>ND</strong> (Fără derivate).
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Formula Corectă de Atribuire
            </div>
            <p className="text-slate-600 text-xs">
              Pentru a respecta etica, o citare completă include: <em>Titlul operei</em>, <em>Autorul</em>,
              <em>Sursa (link web)</em> și <em>Tipul de licență aplicat</em> (ex: „Foto realizată de Ion Popescu sub licență CC BY 4.0”).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Creative Commons License Generator Studio */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Generatorul de Licențe Creative Commons
            </h3>
          </div>
          <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
            Laborator Juridic & Etic
          </span>
        </div>

        {/* Configuration Matrix */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Titlul Proiectului Școlar & Autorul:
              </label>
              <input
                type="text"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none"
                placeholder="Titlul proiectului"
              />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none"
                placeholder="Numele elevului / Echipei"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                1. Permiteți utilizarea comercială a operei?
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCommercialAllowed(true);
                    sounds.playClick();
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    commercialAllowed
                      ? 'bg-amber-600 text-white border-amber-700 shadow'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Da (Comercial permis)
                </button>
                <button
                  onClick={() => {
                    setCommercialAllowed(false);
                    sounds.playClick();
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    !commercialAllowed
                      ? 'bg-amber-600 text-white border-amber-700 shadow'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Nu (Exclusiv Necomercial - NC)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. Permiteți altora să modifice lucrarea (opere derivate)?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'yes', label: 'Da (Modificări libere)' },
                  { id: 'sharealike', label: 'Da, ShareAlike (SA)' },
                  { id: 'no', label: 'Nu (Fără derivate - ND)' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setModificationsAllowed(item.id as any);
                      sounds.playClick();
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border text-center transition leading-tight ${
                      modificationsAllowed === item.id
                        ? 'bg-amber-600 text-white border-amber-700 shadow'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated License Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  Insignă Generată Oficială
                </span>
                <span className="font-mono text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                  {currentLicenseCode}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-lg font-black text-white">
                  Creative Commons {currentLicenseCode} 4.0 International
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Această operă („{workTitle || 'Titlu Proiect'}”) creată de{' '}
                  <strong className="text-amber-300">{authorName || 'Autor'}</strong> este pusă la dispoziție conform termenilor licenței{' '}
                  <span className="text-white font-bold">{currentLicenseCode}</span>.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Ce permite această licență vizitatorilor:
              </div>
              <div>• Atribuire obligatorie: <strong>DA (Trebuie citat autorul)</strong></div>
              <div>• Utilizare comercială: <strong>{commercialAllowed ? 'PERMISĂ' : 'INTERZISĂ (Doar educațional / non-profit)'}</strong></div>
              <div>• Modificări / Remix: <strong>{modificationsAllowed === 'yes' ? 'PERMISE' : modificationsAllowed === 'sharealike' ? 'PERMISE DOAR SUB ACEEAȘI LICENȚĂ (SA)' : 'INTERZISE (ND)'}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Drepturi de Autor & Etică Web (Manual pag. 54–55)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Cauți imagini pe Google pentru o pagină despre animale pe cale de dispariție. Care este comportamentul etic și legal corect conform manualului de clasa a VIII-a?
            </span>
            <QuestionHint
              hint="Manual pag. 54: Motoarele de căutare au un filtru dedicat în fila „Instrumente” -> „Drepturi de utilizare” pentru a găsi exclusiv imagini cu licență liberă Creative Commons."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Descarci prima poză găsită fără să verifici, deoarece tot ce e pe Google este gratuit și fără proprietar' },
              { id: 'opt_b', label: 'B. Folosești filtrul „Licențe Creative Commons” sau bănci de imagini libere (ex: Wikimedia Commons, Pixabay) și menționezi autorul în descrierea imaginii' },
              { id: 'opt_c', label: 'C. Ștergi sigla autorului din colțul pozei cu Paint pentru a nu se vedea' },
              { id: 'opt_d', label: 'D. Trimiți o scrisoare tipărită fiecărui vizitator al site-ului' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-amber-600 bg-amber-50 font-semibold'
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
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Utilizarea filtrului pentru licențe Creative Commons și creditarea autorului constituie respectarea legii dreptului de autor și a eticii cibernetice."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Ce semnifică pictograma „NC” (NonCommercial) din componența unei licențe Creative Commons (CC BY-NC)?
            </span>
            <QuestionHint
              hint="Manual pag. 55: Clauza NC interzice utilizarea creației în activități care aduc profit financiar sau vânzări comerciale."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Că opera este interzisă copiilor (No Children)' },
              { id: 'opt_b', label: 'B. Că opera poate fi folosită doar în scopuri necomerciale (educație, cercetare, uz personal fără profit)' },
              { id: 'opt_c', label: 'C. Că opera nu conține conexiune la rețea (No Connection)' },
              { id: 'opt_d', label: 'D. Că site-ul nu acceptă culori (No Colors)' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-amber-600 bg-amber-50 font-semibold'
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
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Clauza „NC” (NonCommercial) asigură că munca creatorului este utilizată exclusiv pentru binele comun, învățământ sau cultură, fără a fi exploatată financiar de terțe părți."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={3}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 4: Securitate Web & Protocolul HTTPS"
      />
    </div>
  );
};
