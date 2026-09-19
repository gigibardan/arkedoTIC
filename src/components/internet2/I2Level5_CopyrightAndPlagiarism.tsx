import React, { useState } from 'react';
import {
  FileCheck2,
  Copyright,
  Quote,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  BookMarked,
  Link2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { TeacherTip } from '../TeacherTip';
import { QuestionHint } from '../internet1/QuestionHint';
import { AnswerExplanation } from '../internet1/AnswerExplanation';
import { PageNavigationFooter } from '../internet1/PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface I2Level5_CopyrightAndPlagiarismProps {
  onCompletePage: (score: number) => void;
}

export const I2Level5_CopyrightAndPlagiarism: React.FC<I2Level5_CopyrightAndPlagiarismProps> = ({
  onCompletePage,
}) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Task 1: Plagiarism definition
  const [q1Plagiarism, setQ1Plagiarism] = useState<string>('');
  // Task 2: Creative Commons / Public Domain
  const [q2Licenses, setQ2Licenses] = useState<string>('');
  // Task 3: Interactive Citation Lab
  const [citationForm, setCitationForm] = useState<{
    author: string;
    title: string;
    source: string;
    accessDate: string;
  }>({
    author: '',
    title: '',
    source: '',
    accessDate: '',
  });
  const [citationBuilt, setCitationBuilt] = useState<boolean>(false);

  const isQ1Correct = q1Plagiarism === 'intellectual_theft';
  const isQ2Correct = q2Licenses === 'creative_commons';
  const isQ3Correct =
    citationForm.author === 'author_correct' &&
    citationForm.title === 'title_correct' &&
    citationForm.source === 'source_correct' &&
    citationForm.accessDate === 'date_correct';

  const correctCount = (isQ1Correct ? 1 : 0) + (isQ2Correct ? 1 : 0) + (isQ3Correct ? 1 : 0);
  const totalQuestions = 3;
  const pageScore = correctCount === 3 ? 15 : correctCount === 2 ? 10 : correctCount === 1 ? 5 : 0;

  const handleBuildCitation = () => {
    sounds.playClick();
    setCitationBuilt(true);
    if (isQ3Correct) {
      sounds.playCorrect();
      arky.triggerSuccess(
        lang === 'en'
          ? 'Magnificent academic citation! You credited the original author and respected copyright laws! 📚✨'
          : 'Citare academică impecabilă! Ai menționat autorul original și ai respectat legea drepturilor de autor! 📚✨'
      );
    } else {
      sounds.playWrong();
    }
  };

  const handleProceed = () => {
    sounds.playVictory();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    sounds.playClick();
    setQ1Plagiarism('');
    setQ2Licenses('');
    setCitationForm({
      author: '',
      title: '',
      source: '',
      accessDate: '',
    });
    setCitationBuilt(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <Copyright className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'en' ? 'Module 3B • Page 5 of 6' : 'Modulul 3B • Pagina 5 din 6'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Textbook pp. 45–46' : 'Manual pag. 45–46'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight mb-2">
            {lang === 'en'
              ? '5. Copyright, Plagiarism & Creative Commons'
              : '5. Drepturi de Autor, Plagiat & Licențe Creative Commons'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'en'
              ? 'Understand digital property: what Copyright © protects, why copying someone else’s essay without citation constitutes plagiarism (intellectual fraud), and how to legally use free Creative Commons resources!'
              : 'Înțelege proprietatea digitală: ce protejează Dreptul de Autor (Copyright ©), de ce copierea unui referat fără citarea sursei este plagiat (furt intelectual) și cum folosim legal imagini și texte gratuite cu licențe Creative Commons!'}
          </p>
        </div>
      </div>

      {/* Teacher Tip Pill */}
      <TeacherTip
        title={
          lang === 'en'
            ? 'Teacher Tip: The Difference Between Research & Plagiarism (pp. 45–46)'
            : 'Sfatul Profesorului: Diferența între Cercetare și Plagiat (pag. 45–46)'
        }
        text={
          lang === 'en'
            ? '• What is Plagiarism? Copying whole paragraphs or artwork and pretending YOU created them. In school and university, plagiarism results in grade 1 (F) and disciplinary penalties! • How to be an honest researcher: Put short quotes in quotation marks and always add a Bibliography list at the end with: Author, Title, Website URL, and Date of access! • Creative Commons (CC): Licenses created by artists and scientists who generously allow students to reuse their photos or music for free!'
            : '• Ce este Plagiatul? Copierea unor paragrafe sau imagini de pe internet și prezentarea lor ca fiind creația ta proprie. La școală și facultate, plagiatul atrage nota 1 și sancțiuni! • Cum facem o cercetare onestă: Punem pasajele preluate între ghilimele și adăugăm mereu la final Bibliografia cu: Numele autorului, Titlul articolului, Link-ul web și Data consultării! • Creative Commons (CC): Licențe speciale prin care autorii permit elevilor să le folosească gratuit fotografiile sau muzica!'
        }
        extra={
          lang === 'en'
            ? 'Did you know? Works in the Public Domain (e.g., classical fairy tales whose authors passed away over 70 years ago) can be used and remixed completely free by anyone!'
            : 'Știați că? Operele intrate în Domeniul Public (ex: poveștile lui Ion Creangă sau tablourile istorice vechi) pot fi utilizate și adaptate liber de către oricine fără restricții de drepturi de autor!'
        }
      />

      {/* Task 1: Definiția Plagiatului */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-mono font-black">
              1
            </span>
            {lang === 'en'
              ? 'What constitutes Plagiarism in a school essay or digital project?'
              : 'Ce reprezintă Plagiatul într-un referat sau proiect școlar digital?'}
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ1Plagiarism('intellectual_theft');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1Plagiarism === 'intellectual_theft'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Copying without Crediting Original Creator' : 'A) Însușirea Lucrării Fără Citarea Autorului'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Copying text, ideas, or illustrations made by someone else and presenting them as your own original work.'
                : 'Preluarea unor texte, idei sau imagini create de altcineva și prezentarea lor drept creație personală proprie.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1Plagiarism('spelling_mistake');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1Plagiarism === 'spelling_mistake'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Minor grammar spelling error' : 'B) O simplă greșeală de ortografie'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Writing a word with a missing letter in a document.'
                : 'Omiterea unei litere dintr-un cuvânt din neatenție.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1Plagiarism('slow_typing');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1Plagiarism === 'slow_typing'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'C) Typing too slowly on keyboard' : 'C) Tastarea lentă a textului'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Typing fewer than 10 words per minute.'
                : 'Scrierea pe tastatură cu mai puțin de 10 cuvinte pe minut.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q1-plagiarism-hint"
          hintRo="În manualul de TIC (pag. 45), plagiatul este definit drept o fraudă intelectuală: a te lăuda cu munca altuia fără să-i recunoști meritul!"
          hintEn="Textbook p. 45 defines plagiarism as intellectual dishonesty: claiming someone else's work as your own creation!"
        />

        {q1Plagiarism && (
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanationRo={
              isQ1Correct
                ? 'Corect! Plagiatul este o încălcare a eticii academice și a legii dreptului de autor. Menționarea autorului și a sursei transformă o simplă copiere într-o cercetare științifică onestă.'
                : q1Plagiarism === 'spelling_mistake'
                ? 'O greșeală gramaticală sau de tipar nu este plagiat; plagiatul se referă strict la furtul ideilor sau textelor altor persoane.'
                : 'Viteza de tastare nu are nicio legătură cu plagiatul sau drepturile de autor.'
            }
            explanationEn={
              isQ1Correct
                ? 'Correct! Plagiarism violates academic ethics and copyright law. Adding citations turns copied text into legitimate scientific research.'
                : q1Plagiarism === 'spelling_mistake'
                ? 'A typographical typo is simply an error, whereas plagiarism is taking intellectual credit for someone else’s work.'
                : 'Typing speed is a mechanical motor skill unrelated to copyright laws.'
            }
          />
        )}
      </div>

      {/* Task 2: Licențe Libere Creative Commons */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-mono font-black">
              2
            </span>
            {lang === 'en'
              ? 'What do Creative Commons (CC) licenses allow students to do?'
              : 'Ce le permit elevilor licențele libere de tip Creative Commons (CC)?'}
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ2Licenses('creative_commons');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q2Licenses === 'creative_commons'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Freely use and share content with attribution' : 'A) Utilizarea gratuită și legală a resurselor cu citarea autorului'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Authors give permission for their photos, music, or texts to be used freely in school projects as long as they are credited.'
                : 'Autorii permit în mod generos ca fotografiile, muzica sau textele lor să fie folosite liber în proiecte școlare dacă se menționează numele autorului.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ2Licenses('commercial_sale');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q2Licenses === 'commercial_sale'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Obligatory payment of $100 per photo' : 'B) Plata obligatorie a sumei de 100$ pentru fiecare poză'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'You must mail cash in an envelope to an overseas company.'
                : 'Trebuie să trimiți bani prin poștă pentru fiecare imagine descărcată.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q2-cc-licenses-hint"
          hintRo="Creative Commons este un sistem flexibil creat special pentru ca internetul să rămână un loc al împărtășirii libere a culturii și științei!"
          hintEn="Creative Commons provides flexible licenses enabling free and legal sharing of creative and scientific works!"
        />

        {q2Licenses && (
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanationRo={
              isQ2Correct
                ? 'Excelent! Licențele Creative Commons (ex: CC-BY, CC-NC) oferă dreptul gratuit de reutilizare pentru educație, cu condiția atribuirii corecte a autorului original.'
                : 'Licențele Creative Commons sunt concepute tocmai pentru a fi gratuite și accesibile, fără taxe ascunse pentru uz educațional.'
            }
            explanationEn={
              isQ2Correct
                ? 'Spot on! Creative Commons enables legal educational reuse while preserving author attribution.'
                : 'Creative Commons is designed for open, free sharing rather than commercial paid licensing.'
            }
          />
        )}
      </div>

      {/* Task 3: Laborator Practic de Citare a unei Surse */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-mono font-black">
              3
            </span>
            {lang === 'en'
              ? 'Interactive Citation Lab: Build a Perfect Bibliographic Entry for Your Essay'
              : 'Laborator de Citare: Construiește intrarea bibliografică corectă pentru referat'}
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {lang === 'en'
            ? 'Assemble the 4 required academic citation elements for a science article from an educational portal:'
            : 'Configurează cei 4 piloni ai unei citări corecte conform normelor din manualul de informatică:'}
        </p>

        {/* Builder controls */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Element 1: Autor */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {lang === 'en' ? '1. Author / Creator:' : '1. Numele Autorului:'}
              </label>
              <select
                value={citationForm.author}
                onChange={(e) => {
                  setCitationForm((prev) => ({ ...prev, author: e.target.value }));
                  setCitationBuilt(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              >
                <option value="">{lang === 'en' ? '-- Select Author --' : '-- Alege Autorul --'}</option>
                <option value="author_correct">Dr. Radu Ionescu (Cercetător Astronomie)</option>
                <option value="author_fake">Eu am inventat totul singur</option>
                <option value="author_none">(Niciun autor specificat / Anonim)</option>
              </select>
            </div>

            {/* Element 2: Titlu */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {lang === 'en' ? '2. Article Title:' : '2. Titlul Articolului:'}
              </label>
              <select
                value={citationForm.title}
                onChange={(e) => {
                  setCitationForm((prev) => ({ ...prev, title: e.target.value }));
                  setCitationBuilt(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              >
                <option value="">{lang === 'en' ? '-- Select Title --' : '-- Alege Titlul --'}</option>
                <option value="title_correct">«Planetele Sistemului Solar și Misiunile Spațiale»</option>
                <option value="title_generic">Un text oarecare de pe net</option>
              </select>
            </div>

            {/* Element 3: Sursa / Portal */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {lang === 'en' ? '3. Web Source / URL:' : '3. Adresa Web / Portal:'}
              </label>
              <select
                value={citationForm.source}
                onChange={(e) => {
                  setCitationForm((prev) => ({ ...prev, source: e.target.value }));
                  setCitationBuilt(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              >
                <option value="">{lang === 'en' ? '-- Select Web Source --' : '-- Alege Sursa Web --'}</option>
                <option value="source_correct">Revista de Știință Școlară (www.stiinta-edu.ro)</option>
                <option value="source_vague">De pe Google</option>
              </select>
            </div>

            {/* Element 4: Data accesării */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {lang === 'en' ? '4. Access Date:' : '4. Data Consultării:'}
              </label>
              <select
                value={citationForm.accessDate}
                onChange={(e) => {
                  setCitationForm((prev) => ({ ...prev, accessDate: e.target.value }));
                  setCitationBuilt(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              >
                <option value="">{lang === 'en' ? '-- Select Access Date --' : '-- Alege Data Accesării --'}</option>
                <option value="date_correct">[Accesat la data de 18 Septembrie 2026]</option>
                <option value="date_none">(Fără dată)</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              disabled={
                !citationForm.author ||
                !citationForm.title ||
                !citationForm.source ||
                !citationForm.accessDate
              }
              onClick={handleBuildCitation}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                citationForm.author &&
                citationForm.title &&
                citationForm.source &&
                citationForm.accessDate
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Generate Official Citation' : 'Generează Citarea Oficială'}</span>
            </button>
          </div>
        </div>

        {/* Citation Output */}
        {citationBuilt && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 animate-fadeIn">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
              <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'en' ? 'Bibliographic Entry Preview:' : 'Previzualizare Referință Bibliografică:'}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed">
              {citationForm.author === 'author_correct' ? 'IONESCU, Radu.' : '[Autor incorect] '}{' '}
              {citationForm.title === 'title_correct' ? '„Planetele Sistemului Solar și Misiunile Spațiale”.' : '[Titlu incorect] '}{' '}
              {citationForm.source === 'source_correct' ? 'Revista de Știință Școlară, www.stiinta-edu.ro. ' : '[Sursă incorectă] '}{' '}
              {citationForm.accessDate === 'date_correct' ? '[Consultat la 18 Septembrie 2026].' : ''}
            </div>
          </div>
        )}

        {citationBuilt && (
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanationRo={
              isQ3Correct
                ? 'Excelent! Ai compus o referință bibliografică conform standardelor internaționale de redactare științifică: Autor ➔ Titlu ➔ Sursă Web ➔ Data accesării.'
                : 'Atenție la detalii: Nu scrie niciodată „De pe Google” (Google este doar un motor de căutare, nu autorul articolului!) și menționează întotdeauna numele real al cercetătorului și data consultării.'
            }
            explanationEn={
              isQ3Correct
                ? 'Superb! You created a standard academic bibliographic entry: Author ➔ Title ➔ Web Source ➔ Access Date.'
                : 'Watch out: Never cite "From Google" (Google is an indexing engine, not the author!). Always cite the real scientist and access date.'
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
