import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  FileCheck,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { TeacherTip } from '../TeacherTip';
import { QuestionHint } from '../internet1/QuestionHint';
import { AnswerExplanation } from '../internet1/AnswerExplanation';
import { PageNavigationFooter } from '../internet1/PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface I2Level2_InformationEvaluationProps {
  onCompletePage: (score: number) => void;
}

export const I2Level2_InformationEvaluation: React.FC<I2Level2_InformationEvaluationProps> = ({
  onCompletePage,
}) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Task 1: 3 criteria for evaluating sources
  const [q1Criteria, setQ1Criteria] = useState<string>('');
  // Task 2: News credibility inspector (3 articles)
  const [article1Eval, setArticle1Eval] = useState<'real' | 'fake' | ''>('');
  const [article2Eval, setArticle2Eval] = useState<'real' | 'fake' | ''>('');
  const [article3Eval, setArticle3Eval] = useState<'real' | 'fake' | ''>('');
  // Task 3: Cross verification rule
  const [q3CrossCheck, setQ3CrossCheck] = useState<string>('');

  const isQ1Correct = q1Criteria === 'author_date_domain';
  const isQ2Correct =
    article1Eval === 'fake' && article2Eval === 'real' && article3Eval === 'fake';
  const isQ3Correct = q3CrossCheck === 'triangulation';

  const correctCount = (isQ1Correct ? 1 : 0) + (isQ2Correct ? 1 : 0) + (isQ3Correct ? 1 : 0);
  const totalQuestions = 3;
  const pageScore = correctCount === 3 ? 15 : correctCount === 2 ? 10 : correctCount === 1 ? 5 : 0;

  const handleProceed = () => {
    sounds.playVictory();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    sounds.playClick();
    setQ1Criteria('');
    setArticle1Eval('');
    setArticle2Eval('');
    setArticle3Eval('');
    setQ3CrossCheck('');
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'en' ? 'Module 3B • Page 2 of 6' : 'Modulul 3B • Pagina 2 din 6'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Textbook pp. 39–40' : 'Manual pag. 39–40'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight mb-2">
            {lang === 'en'
              ? '2. Evaluating Information & The Fake News Shield'
              : '2. Evaluarea Informației & Scutul Anti Fake News'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'en'
              ? 'Anyone can publish anything on the Internet! Learn how to distinguish verified, scientific facts from fake news, sensational clickbait headlines, and unverified internet rumors (Textbook pp. 39–40).'
              : 'Pe Internet oricine poate publica orice! Învață cum să deosebești informațiile științifice verificate de știrile false (Fake News), titlurile senzaționale de tip momeală (Clickbait) și zvonurile nesusținute de dovezi (Manual pag. 39–40).'}
          </p>
        </div>
      </div>

      {/* Teacher Tip Pill */}
      <TeacherTip
        title={
          lang === 'en'
            ? 'Teacher Tip: The 4 Golden Clues of Credible Information (pp. 39–40)'
            : 'Sfatul Profesorului: Cei 4 Piloni ai unei Informații de Încredere (pag. 39–40)'
        }
        text={
          lang === 'en'
            ? '• Author & Reputation: Does the article name a real author, professor, or recognized institution? • Publication Date: Is the data up-to-date or obsolete from 15 years ago? • Evidence & Citations: Are there links to scientific studies, or just emotional claims? • Cross-checking: Never trust a single post on social media; always verify across 3 independent, reputable news or educational sources!'
            : '• Autor & Instituție: Are articolul un autor asumat, un profesor sau o organizație recunoscută? • Data publicării: Este o informație recentă sau un articol învechit de acum 15 ani? • Surse și Citate: Există trimiteri către studii științifice sau doar afirmații exagerate? • Regula celor 3 surse: Nu crede niciodată o postare izolată de pe rețelele sociale; verifică mereu pe cel puțin 3 site-uri oficiale diferite!'
        }
        extra={
          lang === 'en'
            ? 'Clickbait Warning: Headlines with excessive exclamation marks ("SHOCKING!!! YOU WON’T BELIEVE THIS!") are designed to steal your clicks for ad revenue, not to inform you.'
            : 'Atenție la Clickbait: Titlurile cu multe semne de exclamare («ȘOCANT! NU O SĂ-ȚI VINĂ SĂ CREZI!») au ca scop doar să strângă clickuri pentru reclame, nu să ofere informații reale.'
        }
      />

      {/* Task 1: Criteriile de evaluare */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xs font-mono font-black">
              1
            </span>
            {lang === 'en'
              ? 'What are the main criteria for evaluating a web page’s credibility?'
              : 'Care sunt criteriile esențiale pentru evaluarea credibilității unei pagini web?'}
          </h3>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          {lang === 'en'
            ? 'Select the answer that lists genuine credibility markers according to the textbook:'
            : 'Selectează răspunsul care cuprinde indicii reali de credibilitate conform manualului:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ1Criteria('author_date_domain');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1Criteria === 'author_date_domain'
                ? 'bg-amber-950/80 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Author, Date, Institution & Sources' : 'A) Autor, Dată, Instituție & Surse'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Clear author credentials, recent date, official domain (.edu / .gov), and verified bibliography links.'
                : 'Numele clar al autorului, data recentă a publicării, domeniu oficial (.edu / .gov / instituție) și bibliografie citată.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1Criteria('flashy_colors');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1Criteria === 'flashy_colors'
                ? 'bg-amber-950/80 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Flashing Banners & Popup Ads' : 'B) Reclame Clipitoare & Ferestre Popup'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'If the page has glowing banners and multiple popups promising free prizes.'
                : 'Dacă pagina este plină de bannere luminoase colorate și ferestre care promit premii instantanee.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1Criteria('many_emojis');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1Criteria === 'many_emojis'
                ? 'bg-amber-950/80 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'C) All-Caps Screaming Title' : 'C) Titlu Scris cu MAJUSCULE'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'If the title uses all-caps letters and urgent emotional words like "URGENT ALARM".'
                : 'Dacă textul are litere mari de tipar și cuvinte de panică precum «ALARMĂ URGENTĂ DISTRIBUIE ACUM». '}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q1-eval-criteria"
          hintRo="Un articol serios are întotdeauna un specialist care își semnează numele, o dată calendaristică precisă și o sursă verificabilă!"
          hintEn="A trustworthy article always features a designated author, publication date, and verified reference sources!"
        />

        {q1Criteria && (
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanationRo={
              isQ1Correct
                ? 'Corect! Credibilitatea unei pagini web se bazează pe verificarea autorului (specialist în domeniu), a datei (să nu fie depășită) și a instituției care găzduiește conținutul.'
                : q1Criteria === 'flashy_colors'
                ? 'Reclamele agresive și bannerele clipitoare sunt indicii tipice ale site-urilor comerciale dubioase sau malițioase, nu dovezi de credibilitate.'
                : 'Textele scrise cu majuscule și cuvintele de panică sunt tehnici clasice de clickbait și dezinformare emoțională menite să manipuleze cititorul.'
            }
            explanationEn={
              isQ1Correct
                ? 'Correct! Credibility relies on verifiable author identity, recent publication date, and institutional reputation.'
                : q1Criteria === 'flashy_colors'
                ? 'Flashing popups and prize claims are signs of spam or ad traps, not credible information.'
                : 'All-caps screaming and emotional panic words are hallmarks of clickbait disinformation designed to manipulate readers.'
            }
          />
        )}
      </div>

      {/* Task 2: Detectorul de Știri False (Fake News Lab) */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xs font-mono font-black">
              2
            </span>
            {lang === 'en'
              ? 'Fake News Detector: Inspect 3 Online Headlines'
              : 'Detectorul de Știri False: Analizează 3 articole online'}
          </h3>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {lang === 'en'
            ? 'Read each scenario carefully and classify whether it represents a Credible Verified Source or a Fake News / Clickbait Rumor:'
            : 'Citește cu atenție cele 3 știri și marchează dacă este o Sursă Credibilă sau o Știre Falsă / Zvon Nesigur:'}
        </p>

        <div className="space-y-3">
          {/* Article 1 */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-[11px] font-mono text-rose-400 font-bold mb-1">
                🌐 www.senzational-secrete-extraterestre.xyz • Anonim • Fără dată
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                «ȘOCANT! Luna s-a oprit pe cer timp de 4 ore noaptea trecută! Oamenii de știință ascund adevărul, distribuie rapid!»
              </h4>
              <p className="text-xs text-slate-400">
                Text plin de semne de exclamare, fără trimitere la niciun observator astronomic oficial.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setArticle1Eval('real');
                  sounds.playClick();
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  article1Eval === 'real'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Verified Fact' : 'Informație Reală'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setArticle1Eval('fake');
                  sounds.playCorrect();
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  article1Eval === 'fake'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Fake News 🚨' : 'Știre Falsă 🚨'}
              </button>
            </div>
          </div>

          {/* Article 2 */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">
                🌐 www.antipa.ro • Muzeul Național de Istorie Naturală • 15 Septembrie 2026
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                «Descoperire paleontologică: O nouă fosilă de dinozaur pitic a fost identificată în Bazinul Hațeg de către cercetătorii români.»
              </h4>
              <p className="text-xs text-slate-400">
                Articol semnat de cercetătorul principal, cu fotografii clare, metodologie științifică și bibliografie academică.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setArticle2Eval('real');
                  sounds.playCorrect();
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  article2Eval === 'real'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Verified Fact ✓' : 'Informație Reală ✓'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setArticle2Eval('fake');
                  sounds.playClick();
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  article2Eval === 'fake'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Fake News 🚨' : 'Știre Falsă 🚨'}
              </button>
            </div>
          </div>

          {/* Article 3 */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-[11px] font-mono text-rose-400 font-bold mb-1">
                🌐 Grup public de social media • Postat de «User99214»
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                «Ministerul Educației a decis: De mâine nu se mai dau deloc teme pentru acasă în nicio școală! Trimite mesajul la 10 prieteni!»
              </h4>
              <p className="text-xs text-slate-400">
                Niciun ordin oficial publicat pe site-ul ministerului (edu.ro) și niciun comunicat în presa națională.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setArticle3Eval('real');
                  sounds.playClick();
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  article3Eval === 'real'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Verified Fact' : 'Informație Reală'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setArticle3Eval('fake');
                  sounds.playCorrect();
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  article3Eval === 'fake'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Fake News / Rumor 🚨' : 'Zvon Fals 🚨'}
              </button>
            </div>
          </div>
        </div>

        {article1Eval && article2Eval && article3Eval && (
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanationRo={
              isQ2Correct
                ? 'Excelent! Ai identificat corect cele două știri false (senzaționalism extraterestru și zvon nesusținut de pe rețele) și articolul științific oficial de pe site-ul Muzeului Antipa.'
                : 'Verifică din nou: Articolul 1 și 3 nu au nicio sursă oficială și folosesc panică sau promisiuni exagerate (Fake News), în timp ce Articolul 2 este pe domeniul oficial al Muzeului Antipa.'
            }
            explanationEn={
              isQ2Correct
                ? 'Spot on! You accurately classified the sensational extraterrestrial clickbait and the chain rumor as fake, while recognizing the official museum publication.'
                : 'Review the clues: Articles 1 and 3 lack credible sources, whereas Article 2 comes from an official national museum domain.'
            }
          />
        )}
      </div>

      {/* Task 3: Regula verificării încrucișate */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xs font-mono font-black">
              3
            </span>
            {lang === 'en'
              ? 'What is the "3-Source Cross-Checking Rule" when preparing a school project?'
              : 'Ce reprezintă «Regula celor 3 Surse» (Verificarea Încrucișată) când redactezi un proiect școlar?'}
          </h3>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ3CrossCheck('triangulation');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q3CrossCheck === 'triangulation'
                ? 'bg-amber-950/80 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) 3 Independent Trusted Sources' : 'A) 3 Surse Independente de Încredere'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Confirming the exact same historical or scientific fact across at least 3 separate encyclopedias, textbooks, or official portals before including it.'
                : 'Confirmarea aceleiași informații științifice sau istorice pe cel puțin 3 site-uri enciclopedice, manuale sau portaluri oficiale diferite înainte de a o considera certă.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ3CrossCheck('single_tiktok');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q3CrossCheck === 'single_tiktok'
                ? 'bg-amber-950/80 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Asking 3 random comments on TikTok' : 'B) Întrebarea a 3 comentatori la întâmplare pe TikTok'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Reading 3 anonymous user opinions under a short video.'
                : 'Citirea a 3 păreri de la utilizatori anonimi din secțiunea de comentarii a unui clip scurt.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q3-cross-check-hint"
          hintRo="Verificarea încrucișată înseamnă să nu te bazezi pe o singură sursă, ci să găsești confirmarea în 3 locuri independente și de prestigiu (ex: manual, enciclopedie, site universitar)!"
          hintEn="Cross-checking means confirming factual claims across multiple independent reputable sources (encyclopedias, textbooks, university sites)!"
        />

        {q3CrossCheck && (
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanationRo={
              isQ3Correct
                ? 'Bravo! În cercetarea digitală și jurnalism, regula celor 3 surse protejează elevii și cercetătorii de erori și dezinformare.'
                : 'Comentariile de pe rețelele sociale exprimă opinii personale neverificate, nu surse științifice sau academice independente.'
            }
            explanationEn={
              isQ3Correct
                ? 'Bravo! The 3-source rule shields researchers from accidental disinformation and bias.'
                : 'Social media comments reflect unverified personal opinions, not objective academic facts.'
            }
          />
        )}
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={correctCount > 0}
        onProceed={handleProceed}
        onRetry={handleReset}
      />
    </div>
  );
};
