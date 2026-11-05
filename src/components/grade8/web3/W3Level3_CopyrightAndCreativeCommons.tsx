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
import { useLanguage } from '../../../context/LanguageContext';

interface W3Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface LicenseType {
  code: string;
  nameRo: string;
  nameEn: string;
  badge: string;
  commercial: boolean;
  derivative: 'yes' | 'sharealike' | 'no';
  summaryRo: string;
  summaryEn: string;
  schoolContextRo: string;
  schoolContextEn: string;
}

const LICENSES: LicenseType[] = [
  {
    code: 'CC BY',
    nameRo: 'Atribuire (Attribution)',
    nameEn: 'Attribution',
    badge: 'BY',
    commercial: true,
    derivative: 'yes',
    summaryRo: 'Permite redistribuirea, modificarea și utilizarea comercială sau necomercială, cu condiția obligatorie de a credita autorul.',
    summaryEn: 'Permits redistribution, remixing, and both commercial and non-commercial reuse, provided mandatory author attribution.',
    schoolContextRo: 'Cea mai flexibilă licență. Excelentă pentru articole școlare și tutoriale deschise.',
    schoolContextEn: 'Most accommodating license. Ideal for open school articles, collaborative guides, and tutorials.'
  },
  {
    code: 'CC BY-SA',
    nameRo: 'Atribuire - Distribuire în condiții identice (ShareAlike)',
    nameEn: 'Attribution - ShareAlike',
    badge: 'BY-SA',
    commercial: true,
    derivative: 'sharealike',
    summaryRo: 'Permite adaptarea lucrării, dar orice lucrare derivată trebuie distribuită sub exact aceeași licență (modelul Wikipedia).',
    summaryEn: 'Permits remixing and adaptations, provided all derivative works carry the identical license terms (the Wikipedia model).',
    schoolContextRo: 'Ideală pentru proiecte comunitare deschise dezvoltate împreună cu alte școli.',
    schoolContextEn: 'Ideal for open community projects co-created with partner schools.'
  },
  {
    code: 'CC BY-NC',
    nameRo: 'Atribuire - Necomercial (NonCommercial)',
    nameEn: 'Attribution - NonCommercial',
    badge: 'BY-NC',
    commercial: false,
    derivative: 'yes',
    summaryRo: 'Permite descărcarea și modificarea operei, dar exclusiv în scopuri necomerciale (educaționale, non-profit).',
    summaryEn: 'Allows downloading and modifying the work, strictly restricted to non-commercial (educational, non-profit) purposes.',
    schoolContextRo: 'Licența standard pentru materialele didactice școlare, fișe de lucru și reviste ale elevilor.',
    schoolContextEn: 'Standard baseline for school worksheets, study guides, and student journalism.'
  },
  {
    code: 'CC BY-NC-ND',
    nameRo: 'Atribuire - Necomercial - Fără derivate (NoDerivs)',
    nameEn: 'Attribution - NonCommercial - NoDerivs',
    badge: 'BY-NC-ND',
    commercial: false,
    derivative: 'no',
    summaryRo: 'Cea mai restrictivă licență CC: permite doar descărcarea și partajarea operei intacte, fără modificări și fără scop comercial.',
    summaryEn: 'Most restrictive CC license: permits downloading and sharing only intact originals, with no derivatives or commercial use.',
    schoolContextRo: 'Potrivită pentru poezii, eseuri premiate la olimpiadă sau fotografii oficiale de arhivă.',
    schoolContextEn: 'Suitable for literature prize essays, school anthem compositions, or historical archives.'
  },
  {
    code: 'CC0',
    nameRo: 'Domeniu Public (Public Domain Dedication)',
    nameEn: 'Public Domain Dedication',
    badge: '0',
    commercial: true,
    derivative: 'yes',
    summaryRo: 'Autorul a renunțat complet la drepturile de autor; opera poate fi utilizată liber fără nicio restricție.',
    summaryEn: 'The creator waives copyright completely; the work is free for all uses without restrictions.',
    schoolContextRo: 'Resurse preluate de pe platforme gratuite precum Unsplash sau Wikimedia Commons.',
    schoolContextEn: 'Public domain assets sourced from Unsplash, Pixabay, or Wikimedia Commons.'
  }
];

export const W3Level3_CopyrightAndCreativeCommons: React.FC<W3Level3Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
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
              <span>
                {lang === 'ro'
                  ? 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C'
                  : 'Unit 2: Web Pages & Online Projects • Module 2C'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 3: Drepturi de Autor (Copyright) & Licențe Creative Commons'
                : 'Lesson 3: Copyright & Creative Commons Licensing'}
            </h1>
            <p className="text-amber-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 54–55: Înțelege proprietatea intelectuală în mediul digital, riscurile plagiatului, cum se folosesc legal imaginile de pe internet și cum atribui corect o licență Creative Commons proiectului tău.'
                : 'Curriculum p. 54–55: Understand digital intellectual property, plagiarism risks, lawful image sourcing, and how to apply standard Creative Commons license badges to your project.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-amber-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">3 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Proprietate Intelectuală & Etică Digitală (Manual pag. 54–55)'
              : 'Theoretical Reference: Intellectual Property & Digital Ethics (Curriculum p. 54–55)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <Copyright className="w-4 h-4 text-rose-600" />
              {lang === 'ro' ? 'Dreptul de Autor (Copyright ©)' : 'Copyright Law (©)'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Conform Legii nr. 8/1996, orice creație originală (texte, fotografii, ilustrații, clipuri video) este protejată automat. Faptul că o imagine apare pe Google Images nu înseamnă că este liberă de drepturi!'
                : 'Under copyright laws, every original creation (text, photography, illustrations, videos) is automatically protected. Simply appearing in Google Images does NOT mean an asset is public domain!'}
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              {lang === 'ro' ? 'Licențele Creative Commons (CC)' : 'Creative Commons (CC) Framework'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Sunt licențe juridice standardizate care permit autorilor să ofere dreptul de reutilizare publicului, păstrând controlul prin clauze: BY (Atribuire), NC (Necomercial), SA (Condiții identice), ND (Fără derivate).'
                : 'Standardized legal licenses allowing authors to grant public reuse while retaining rights via clauses: BY (Attribution), NC (NonCommercial), SA (ShareAlike), and ND (NoDerivs).'}
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              {lang === 'ro' ? 'Formula Corectă de Atribuire' : 'Correct Attribution Syntax'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Pentru a respecta etica, o citare completă include: Titlul operei, Autorul, Sursa (link web) și Tipul de licență aplicat (ex: „Foto realizată de Ion Popescu sub licență CC BY 4.0”).'
                : 'Ethical attribution requires TASL: Title of work, Author, Source (hyperlink), and specific License type applied (e.g. "Photo by Jane Doe under CC BY 4.0").'}
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
              {lang === 'ro'
                ? 'Simulator Interactiv: Generatorul de Licențe Creative Commons'
                : 'Interactive Simulator: Creative Commons License Generator'}
            </h3>
          </div>
          <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
            {lang === 'ro' ? 'Laborator Juridic & Etic' : 'Legal & Ethics Lab'}
          </span>
        </div>

        {/* Configuration Matrix */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {lang === 'ro' ? 'Titlul Proiectului Școlar & Autorul:' : 'School Project Title & Author:'}
              </label>
              <input
                type="text"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none"
                placeholder={lang === 'ro' ? 'Titlul proiectului' : 'Project title'}
              />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none"
                placeholder={lang === 'ro' ? 'Numele elevului / Echipei' : 'Student / Team name'}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {lang === 'ro' ? '1. Permiteți utilizarea comercială a operei?' : '1. Allow commercial uses of your work?'}
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
                  {lang === 'ro' ? 'Da (Comercial permis)' : 'Yes (Commercial allowed)'}
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
                  {lang === 'ro' ? 'Nu (Exclusiv Necomercial - NC)' : 'No (NonCommercial only - NC)'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {lang === 'ro'
                  ? '2. Permiteți altora să modifice lucrarea (opere derivate)?'
                  : '2. Allow adaptations of your work (derivatives)?'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'yes', labelRo: 'Da (Modificări libere)', labelEn: 'Yes (Freely)' },
                  { id: 'sharealike', labelRo: 'Da, ShareAlike (SA)', labelEn: 'Yes, ShareAlike (SA)' },
                  { id: 'no', labelRo: 'Nu (Fără derivate - ND)', labelEn: 'No (NoDerivs - ND)' }
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
                    {lang === 'ro' ? item.labelRo : item.labelEn}
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
                  {lang === 'ro' ? 'Insignă Generată Oficială' : 'Generated Official Badge'}
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
                  {lang === 'ro'
                    ? `Această operă („${workTitle || 'Titlu Proiect'}”) creată de `
                    : `This work ("${workTitle || 'Project Title'}") created by `}
                  <strong className="text-amber-300">{authorName || (lang === 'ro' ? 'Autor' : 'Author')}</strong>
                  {lang === 'ro'
                    ? ` este pusă la dispoziție conform termenilor licenței `
                    : ` is licensed under `}
                  <span className="text-white font-bold">{currentLicenseCode}</span>.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                {lang === 'ro' ? 'Ce permite această licență vizitatorilor:' : 'What visitors are permitted to do:'}
              </div>
              <div>
                • {lang === 'ro' ? 'Atribuire obligatorie: ' : 'Attribution required: '}
                <strong>{lang === 'ro' ? 'DA (Trebuie citat autorul)' : 'YES (Must credit creator)'}</strong>
              </div>
              <div>
                • {lang === 'ro' ? 'Utilizare comercială: ' : 'Commercial use: '}
                <strong>
                  {commercialAllowed
                    ? lang === 'ro' ? 'PERMISĂ' : 'ALLOWED'
                    : lang === 'ro' ? 'INTERZISĂ (Doar educațional / non-profit)' : 'PROHIBITED (Educational / non-profit only)'}
                </strong>
              </div>
              <div>
                • {lang === 'ro' ? 'Modificări / Remix: ' : 'Modifications / Remixes: '}
                <strong>
                  {modificationsAllowed === 'yes'
                    ? lang === 'ro' ? 'PERMISE' : 'ALLOWED'
                    : modificationsAllowed === 'sharealike'
                    ? lang === 'ro' ? 'PERMISE DOAR SUB ACEEAȘI LICENȚĂ (SA)' : 'ALLOWED UNDER SAME LICENSE ONLY (SA)'
                    : lang === 'ro' ? 'INTERZISE (ND)' : 'PROHIBITED (ND)'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            {lang === 'ro'
              ? 'Verificare Pedagogică: Drepturi de Autor & Etică Web (Manual pag. 54–55)'
              : 'Pedagogical Check: Copyright & Web Ethics (Curriculum p. 54–55)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 1: Cauți imagini pe Google pentru o pagină despre animale pe cale de dispariție. Care este comportamentul etic și legal corect conform manualului de clasa a VIII-a?'
                : 'Requirement 1: You are searching Google Images for an endangered species project. What is the lawful, ethical procedure taught in the 8th grade curriculum?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 54: Motoarele de căutare au un filtru dedicat în fila „Instrumente” -> „Drepturi de utilizare” pentru a găsi exclusiv imagini cu licență liberă Creative Commons."
              hintEn="Curriculum p. 54: Search engines provide a dedicated filter under Tools -> Usage Rights to locate Creative Commons licensed images exclusively."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Descarci prima poză găsită fără să verifici, deoarece tot ce e pe Google este gratuit și fără proprietar',
                labelEn: 'A. Download the first photo you find without checking, assuming everything on Google is unowned and free'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Folosești filtrul „Licențe Creative Commons” sau bănci de imagini libere (ex: Wikimedia Commons, Pixabay) și menționezi autorul în descrierea imaginii',
                labelEn: 'B. Use the "Creative Commons licenses" filter or free repositories (e.g. Wikimedia Commons, Pixabay) and credit the creator in the image caption'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Ștergi sigla autorului din colțul pozei cu Paint pentru a nu se vedea',
                labelEn: 'C. Erase the author\'s watermark in Paint so no one notices'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Trimiți o scrisoare tipărită fiecărui vizitator al site-ului',
                labelEn: 'D. Mail a printed letter to every visitor of the site'
              }
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
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Corect! Utilizarea filtrului pentru licențe Creative Commons și creditarea autorului constituie respectarea legii dreptului de autor și a eticii cibernetice.'
                  : 'Correct! Applying the Creative Commons license filter and properly crediting creators upholds copyright law and sound digital ethics.'
              }
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 2: Ce semnifică pictograma „NC” (NonCommercial) din componența unei licențe Creative Commons (CC BY-NC)?'
                : 'Requirement 2: What does the "NC" (NonCommercial) symbol signify in a Creative Commons license (CC BY-NC)?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 55: Clauza NC interzice utilizarea creației în activități care aduc profit financiar sau vânzări comerciale."
              hintEn="Curriculum p. 55: The NC clause restricts reuse exclusively to non-monetized educational or cultural endeavors."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Că opera este interzisă copiilor (No Children)',
                labelEn: 'A. That the work is prohibited for children (No Children)'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Că opera poate fi folosită doar în scopuri necomerciale (educație, cercetare, uz personal fără profit)',
                labelEn: 'B. That the work may only be used for non-commercial purposes (education, scholarship, personal non-profit use)'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Că opera nu conține conexiune la rețea (No Connection)',
                labelEn: 'C. That the file requires no internet connection (No Connection)'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Că site-ul nu acceptă culori (No Colors)',
                labelEn: 'D. That the site cannot render colors (No Colors)'
              }
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
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Excelent! Clauza „NC” (NonCommercial) asigură că munca creatorului este utilizată exclusiv pentru binele comun, învățământ sau cultură, fără a fi exploatată financiar de terțe părți.'
                  : 'Excellent! The "NC" (NonCommercial) clause ensures creator contributions benefit the common good, education, and culture without being monetized by third parties.'
              }
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
        nextLabel={
          lang === 'ro'
            ? 'Continuă cu Lecția 4: Securitate Web & Protocolul HTTPS'
            : 'Continue to Lesson 4: Web Security & The HTTPS Protocol'
        }
      />
    </div>
  );
};
