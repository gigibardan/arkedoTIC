import React, { useState } from 'react';
import {
  Users,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface EmailLevel2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface Scenario {
  id: string;
  titleRo: string;
  titleEn: string;
  contextRo: string;
  contextEn: string;
  correctTo: string;
  correctCc: string;
  correctBcc: string;
  explanationRo: string;
  explanationEn: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    titleRo: 'Scenariul 1: Trimiterea Temei la Informatică',
    titleEn: 'Scenario 1: Submitting ICT Homework',
    contextRo: 'Trimiți proiectul final către profesorul tău de TIC, iar mama ta vrea să fie informată că ai trimis tema la timp.',
    contextEn: 'You send the final project to your ICT teacher, and your parent wants to be kept in the loop.',
    correctTo: 'profesor.tic@scoala.ro',
    correctCc: 'mama@email.ro',
    correctBcc: 'niciunul',
    explanationRo: 'To este pentru profesor (destinatarul principal). CC este pentru mamă (informată secundar). Nu este nevoie de BCC.',
    explanationEn: 'To is for the teacher (primary recipient). CC is for parent (kept informed). No BCC needed.'
  },
  {
    id: 's2',
    titleRo: 'Scenariul 2: Invitație la Aniversare către 25 de Colegi',
    titleEn: 'Scenario 2: Birthday Invite to 25 Classmates',
    contextRo: 'Vrei să inviți 25 de colegi de clasă la ziua ta, dar legea protecției datelor (GDPR) și bunul-simț impun să NU le expui adresele personale de e-mail unii altora!',
    contextEn: 'You invite 25 classmates to your birthday party, but privacy rules require you NOT to leak their personal email addresses to everyone!',
    correctTo: 'propria.mea.adresa@scoala.ro',
    correctCc: 'niciunul',
    correctBcc: 'colegi.clasa@grup.ro (25 adrese)',
    explanationRo: 'Obligatoriu BCC (Blind Carbon Copy / Copie ascunsă)! Fiecare coleg primește invitația fără a vedea adresele de e-mail ale celorlalți!',
    explanationEn: 'Mandatory BCC (Blind Carbon Copy)! Each classmate receives the invite without seeing everyone else’s private email address!'
  }
];

export const EmailLevel2_ToCcBccSimulator: React.FC<EmailLevel2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive Tab State
  const [activeTab, setActiveTab] = useState<'concepts' | 'scenario1' | 'scenario2'>('concepts');

  // Scenario 1 selections
  const [s1To, setS1To] = useState<string>('');
  const [s1Cc, setS1Cc] = useState<string>('');
  const [s1Submitted, setS1Submitted] = useState<boolean>(false);
  const [s1Correct, setS1Correct] = useState<boolean>(false);

  // Scenario 2 selections
  const [s2Field, setS2Field] = useState<string>('');
  const [s2Submitted, setS2Submitted] = useState<boolean>(false);
  const [s2Correct, setS2Correct] = useState<boolean>(false);

  // Theory quiz
  const [qBccConcept, setQBccConcept] = useState<string | null>(null);

  const handleSubmitS1 = () => {
    if (!s1To || !s1Cc) return;
    const isSuccess = s1To === 'profesor' && s1Cc === 'mama';
    setS1Submitted(true);
    setS1Correct(isSuccess);
    if (isSuccess) sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleSubmitS2 = () => {
    if (!s2Field) return;
    const isSuccess = s2Field === 'bcc';
    setS2Submitted(true);
    setS2Correct(isSuccess);
    if (isSuccess) sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleBccConceptAnswer = (ans: string) => {
    if (qBccConcept) return;
    setQBccConcept(ans);
    if (ans === 'invisible') sounds.playCorrect();
    else sounds.playWrong();
  };

  const isAllComplete = s1Correct && s2Correct && qBccConcept === 'invisible';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/70 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/40">
                {isEn ? 'Unit 3 • Lesson 2 • Grade 6' : 'Unitatea 3 • Lecția 2 • Clasa a VI-a'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? 'Level 2 of 7' : 'Nivelul 2 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
              {isEn ? 'Mastering To, CC & BCC (Carbon Copy vs Blind Copy)' : 'Misterul Câmpurilor To, CC & BCC: Vizibil vs Ascuns'}
            </h1>
            <p className="text-sm text-indigo-200/90 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Learn who receives direct tasks (To), who is kept informed (CC), and how to protect personal privacy using blind carbon copy (BCC).'
                : 'Învață cine primește sarcina principală (To), cine este doar informat (CC) și cum protejezi datele private folosind Copia Ascunsă (BCC / Cci)!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            ✉️
          </div>
        </div>
      </div>

      {/* 3 Pillars Concept Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TO */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-blue-500/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
                Câmpul TO (Către)
              </span>
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-black text-white font-heading mb-2">Destinatar Principal</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              Persoana căreia i se adresează direct e-mailul și de la care se așteaptă o acțiune, răspuns sau rezolvare a temei.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-blue-300 font-mono">
            ● Vizibilitate: PUBLICĂ (toată lumea îi vede adresa)
          </div>
        </div>

        {/* CC */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                Câmpul CC (Carbon Copy)
              </span>
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-black text-white font-heading mb-2">Copie la Indigo (Informare)</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              Persoane trimise „spre știință”. Nu li se cere o acțiune imediată, dar trebuie să fie la curent cu situația (ex: părinți, diriginte).
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-mono">
            ● Vizibilitate: PUBLICĂ (toți văd cine este în CC)
          </div>
        </div>

        {/* BCC */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-rose-500/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-mono font-bold text-xs">
                Câmpul BCC (Blind Copy / Cci)
              </span>
              <EyeOff className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-lg font-black text-white font-heading mb-2">Copie Ascunsă (Confidențial)</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              Adresele din BCC sunt <span className="text-rose-400 font-bold">100% INVIZIBILE</span> pentru ceilalți destinatari. Protejează datele la trimiteri în masă!
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-rose-300 font-mono font-bold">
            🔒 Vizibilitate: SECRETĂ (adresele sunt ascunse)
          </div>
        </div>
      </div>

      {/* Interactive Lab Challenge 1: The Homework Dispatch */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Misiunea Practică 1: Trimiterea Temei</span>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            {s1Correct ? '✅ Rezolvat cu Succes' : 'În Lucru'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
          {SCENARIOS[0].contextRo}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="text-xs font-mono font-bold text-blue-400 uppercase block">
              Pe cine treci în câmpul TO (Către)?
            </label>
            <select
              value={s1To}
              onChange={(e) => {
                setS1To(e.target.value);
                setS1Submitted(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Alege destinatarul To --</option>
              <option value="profesor">profesor.tic@scoala.ro (Profesorul)</option>
              <option value="mama">mama@email.ro (Mama)</option>
              <option value="colegul">colegul.banca@scoala.ro (Colegul de bancă)</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="text-xs font-mono font-bold text-amber-400 uppercase block">
              Pe cine treci în câmpul CC (Copie la indigo)?
            </label>
            <select
              value={s1Cc}
              onChange={(e) => {
                setS1Cc(e.target.value);
                setS1Submitted(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Alege destinatarul CC --</option>
              <option value="mama">mama@email.ro (Mama - spre informare)</option>
              <option value="profesor">profesor.tic@scoala.ro (Profesorul)</option>
              <option value="toata_clasa">toti_elevii@scoala.ro (Toți elevii)</option>
            </select>
          </div>
        </div>

        {!s1Submitted ? (
          <button
            type="button"
            onClick={handleSubmitS1}
            disabled={!s1To || !s1Cc}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Validează Trimiterea Temei</span>
          </button>
        ) : (
          <AnswerExplanation
            isCorrect={s1Correct}
            explanation={
              s1Correct
                ? 'Felicitări! Profesorul este în To (destinatarul temei), iar părintele este în CC (informat la timp).'
                : 'Atenție! Profesorul trebuie să fie în To, iar părintele în CC spre informare.'
            }
          />
        )}
      </div>

      {/* Interactive Lab Challenge 2: Birthday Invite Privacy Protocol */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Misiunea Practică 2: Protejarea Confidențialității la Aniversare</span>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            {s2Correct ? '✅ Protecție GDPR Asigurată' : 'În Lucru'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
          {SCENARIOS[1].contextRo}
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <label className="text-xs font-mono font-bold text-white block">
            În care câmp vei adăuga lista celor 25 de adrese de e-mail ale colegilor?
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setS2Field('to');
                setS2Submitted(false);
              }}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${
                s2Field === 'to'
                  ? 'bg-blue-600/30 border-blue-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              A. În câmpul TO (Către)
            </button>
            <button
              type="button"
              onClick={() => {
                setS2Field('cc');
                setS2Submitted(false);
              }}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${
                s2Field === 'cc'
                  ? 'bg-amber-600/30 border-amber-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              B. În câmpul CC (Copie la indigo)
            </button>
            <button
              type="button"
              onClick={() => {
                setS2Field('bcc');
                setS2Submitted(false);
              }}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${
                s2Field === 'bcc'
                  ? 'bg-rose-600/30 border-rose-400 text-white ring-2 ring-rose-500/40'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              C. În câmpul BCC (Copie ascunsă)
            </button>
          </div>
        </div>

        {!s2Submitted ? (
          <button
            type="button"
            onClick={handleSubmitS2}
            disabled={!s2Field}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <EyeOff className="w-4 h-4" />
            <span>Verifică Alegerea de Confidențialitate</span>
          </button>
        ) : (
          <AnswerExplanation
            isCorrect={s2Correct}
            explanation={
              s2Correct
                ? 'Absolut corect! Câmpul BCC protejează datele personale. Dacă i-ai fi pus în To sau CC, toți cei 25 de colegi ar fi văzut adresele celorlalți!'
                : 'Pericol! Dacă folosești To sau CC, toți cei 25 de colegi își vor vedea reciproc adresele private, ceea ce este o greșeală gravă de confidențialitate. Doar BCC ascunde adresele!'
            }
          />
        )}
      </div>

      {/* Applied Concept Question */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Verificare Rapidă de Teorie Didactică</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-medium">
          Dacă o persoană este trecută în câmpul BCC (Cci), ce văd ceilalți destinatari care au primit e-mailul?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleBccConceptAnswer('visible_marked')}
            disabled={!!qBccConcept}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qBccConcept === 'visible_marked'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            A. Îi văd adresa marcată cu o stea galbenă
          </button>
          <button
            type="button"
            onClick={() => handleBccConceptAnswer('invisible')}
            disabled={!!qBccConcept}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qBccConcept === 'invisible'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            B. Nu văd absolut deloc adresa acelei persoane (rămâne secretă)
          </button>
        </div>

        <QuestionHint hint="BCC vine de la Blind Carbon Copy. Cuvântul Blind (orb/nevăzut) indică faptul că ceilalți nu pot vedea lista respectivă." />

        {qBccConcept && (
          <AnswerExplanation
            isCorrect={qBccConcept === 'invisible'}
            explanation={
              qBccConcept === 'invisible'
                ? 'Corect! Adresa din BCC este complet invizibilă pentru oricine altcineva în afară de expeditor.'
                : 'Incorect. Destinatarii din BCC sunt 100% ascunși pentru ceilalți destinatari ai mesajului.'
            }
          />
        )}
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isAllComplete}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(30);
        }}
        nextLabel={isEn ? 'Next: Attachments & File Security ➜' : 'Următorul: Atașamente & Securitatea Fișierelor ➜'}
      />
    </div>
  );
};
