import React, { useState } from 'react';
import {
  Mail,
  Send,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  AtSign,
  UserCheck,
  Shield,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { TeacherTip } from '../TeacherTip';
import { QuestionHint } from '../internet1/QuestionHint';
import { AnswerExplanation } from '../internet1/AnswerExplanation';
import { PageNavigationFooter } from '../internet1/PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface I2Level3_EmailAnatomyProps {
  onCompletePage: (score: number) => void;
}

export const I2Level3_EmailAnatomy: React.FC<I2Level3_EmailAnatomyProps> = ({
  onCompletePage,
}) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Task 1: Bcc privacy question
  const [q1BccPurpose, setQ1BccPurpose] = useState<string>('');
  // Task 2: Email address syntax
  const [q2AtSymbol, setQ2AtSymbol] = useState<string>('');
  // Task 3: Interactive Email Composer
  const [emailForm, setEmailForm] = useState<{
    to: string;
    subject: string;
    greeting: string;
    attachment: string;
    signature: string;
  }>({
    to: '',
    subject: '',
    greeting: '',
    attachment: '',
    signature: '',
  });
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const isQ1Correct = q1BccPurpose === 'hide_recipients';
  const isQ2Correct = q2AtSymbol === 'at_sign';
  const isQ3Correct =
    emailForm.to === 'profesor' &&
    emailForm.subject === 'formal_project' &&
    emailForm.greeting === 'polite_greeting' &&
    emailForm.attachment === 'pdf_project' &&
    emailForm.signature === 'formal_signature';

  const correctCount = (isQ1Correct ? 1 : 0) + (isQ2Correct ? 1 : 0) + (isQ3Correct ? 1 : 0);
  const totalQuestions = 3;
  const pageScore = correctCount === 3 ? 15 : correctCount === 2 ? 10 : correctCount === 1 ? 5 : 0;

  const handleSendEmail = () => {
    sounds.playClick();
    setEmailSent(true);
    if (isQ3Correct) {
      sounds.playCorrect();
      arky.triggerSuccess(
        lang === 'en'
          ? 'Exceptional formal email formatting! Clear subject line, respectful greeting, and safe PDF attachment! ✉️✨'
          : 'Formatare excepțională a mesajului formal! Subiect clar, formulă politicoasă și atașament PDF curat! ✉️✨'
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
    setQ1BccPurpose('');
    setQ2AtSymbol('');
    setEmailForm({
      to: '',
      subject: '',
      greeting: '',
      attachment: '',
      signature: '',
    });
    setEmailSent(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-sky-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider border border-sky-500/30 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              {lang === 'en' ? 'Module 3B • Page 3 of 6' : 'Modulul 3B • Pagina 3 din 6'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Textbook pp. 41–42' : 'Manual pag. 41–42'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight mb-2">
            {lang === 'en'
              ? '3. E-mail Anatomy & Formal Communication'
              : '3. Anatomia E-mailului & Comunicarea Formală'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'en'
              ? 'Discover the components of electronic mail: understanding the @ separator, the crucial difference between To, Cc (Carbon Copy), and Bcc (Blind Carbon Copy), and how to compose a respectful school email with attachments!'
              : 'Descoperă toate componentele poștei electronice: rolul separatorului @ (a rond), diferența vitală între câmpurile To, Cc (Copie) și Bcc (Copie Ascunsă), și cum redactăm un e-mail formal corect către școală sau profesori!'}
          </p>
        </div>
      </div>

      {/* Teacher Tip Pill */}
      <TeacherTip
        title={
          lang === 'en'
            ? 'Teacher Tip: The Golden Rule of Bcc (Blind Carbon Copy) (pp. 41–42)'
            : 'Sfatul Profesorului: Regula de Aur a Câmpului Bcc (pag. 41–42)'
        }
        text={
          lang === 'en'
            ? '• To (Către): The primary recipient(s) expected to reply. • Cc (Carbon Copy): People receiving the message for information only (all recipients see their addresses). • Bcc (Blind Carbon Copy / Cco): Secret recipients! None of the other recipients can see who is in Bcc. Always use Bcc when emailing a whole group of students or parents to protect privacy and prevent GDPR violations!'
            : '• To (Către): Destinatarul principal căruia îi este adresat mesajul. • Cc (Copie): Persoane care primesc mesajul doar spre informare (toată lumea le vede adresa). • Bcc / Cco (Copie Ascunsă): Destinatarii ascunși! Niciun alt destinatar nu poate vedea adresele din Bcc. Folosește ÎNTOTDEAUNA Bcc când trimiți un mesaj la toată clasa sau la un grup mare, pentru a proteja confidențialitatea colegilor tăi!'
        }
        extra={
          lang === 'en'
            ? 'Never send an email with an empty Subject field! A blank subject often triggers spam filters and looks unprofessional.'
            : 'Nu lăsa niciodată câmpul Subiect (Subject) gol! Un e-mail fără subiect ajunge adesea direct în folderul de Spam (mesaje nedorite).'
        }
      />

      {/* Task 1: Rolul câmpului Bcc (Cco) */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center text-xs font-mono font-black">
              1
            </span>
            {lang === 'en'
              ? 'Why should you use Bcc (Blind Carbon Copy) when sending to 30 classmates?'
              : 'De ce trebuie să folosești câmpul Bcc (Copie Ascunsă) când trimiți un e-mail către 30 de colegi?'}
          </h3>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-md border border-sky-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          {lang === 'en'
            ? 'Select the privacy protection reason explained in textbook page 41:'
            : 'Alege motivul legat de securitate și confidențialitate explicat în manualul de TIC (pag. 41):'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ1BccPurpose('hide_recipients');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1BccPurpose === 'hide_recipients'
                ? 'bg-sky-950/80 border-sky-500 text-white shadow-md ring-1 ring-sky-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Protect Personal Privacy' : 'A) Protejarea Datelor Personale'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'It hides everyone’s email address so that nobody’s personal contact info is leaked to strangers or spammers.'
                : 'Ascunde adresele de e-mail ale colegilor, astfel încât contactele personale nu sunt divulgate tuturor sau roboților de spam.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1BccPurpose('speed_up');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1BccPurpose === 'speed_up'
                ? 'bg-sky-950/80 border-sky-500 text-white shadow-md ring-1 ring-sky-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Speeds up Internet Cable' : 'B) Mărește Viteza Cablului'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'It compresses electricity through fiber optic cables 10 times faster.'
                : 'Comprimă semnalul electric prin cablul de fibră optică pentru a ajunge de 10 ori mai repede.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1BccPurpose('delete_later');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1BccPurpose === 'delete_later'
                ? 'bg-sky-950/80 border-sky-500 text-white shadow-md ring-1 ring-sky-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'C) Auto-Destruct in 5 Minutes' : 'C) Șterge Mesajul în 5 Minute'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'It sets a countdown timer that burns the recipient’s inbox after 5 minutes.'
                : 'Pornește o numărătoare inversă care șterge automat mesajul din căsuța destinatarului după 5 minute.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q1-bcc-hint"
          hintRo="Gândește-te la confidențialitate: dacă pui 30 de adrese în câmpul To, oricine le poate copia și trimite reclame! În Bcc, adresele rămân invizibile."
          hintEn="Consider privacy: in Bcc, every recipient’s email address is kept hidden and shielded from others!"
        />

        {q1BccPurpose && (
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanationRo={
              isQ1Correct
                ? 'Foarte bine! Câmpul Bcc (Blind Carbon Copy) împiedică expunerea adreselor private de e-mail către terți și previne răspunsurile accidentale de tip «Reply to All».'
                : q1BccPurpose === 'speed_up'
                ? 'Câmpul Bcc nu are legătură cu viteza fizică a conexiunii la internet, ci este o regulă software de confidențialitate.'
                : 'Bcc nu activează nicio funcție de autodistrugere; mesajul rămâne salvat normal în căsuța poștală a fiecărui destinatar.'
            }
            explanationEn={
              isQ1Correct
                ? 'Spot on! Bcc masks private contact details from other recipients, preserving student data privacy.'
                : q1BccPurpose === 'speed_up'
                ? 'Bcc is a privacy header, not an internet speed accelerator.'
                : 'Bcc does not self-destruct emails; it simply hides recipient email addresses.'
            }
          />
        )}
      </div>

      {/* Task 2: Simbolul @ și Structura Adresei */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center text-xs font-mono font-black">
              2
            </span>
            {lang === 'en'
              ? 'What is the role of the "@" (at-sign / a rond) character in an email address?'
              : 'Ce rol are simbolul "@" (a rond / at) într-o adresă de e-mail (ex: elev@scoala.ro)?'}
          </h3>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-md border border-sky-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ2AtSymbol('at_sign');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q2AtSymbol === 'at_sign'
                ? 'bg-sky-950/80 border-sky-500 text-white shadow-md ring-1 ring-sky-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Separates User Name from Host Domain' : 'A) Separă Numele Utilizatorului de Domeniul Gazdă'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'It indicates that user "elev" has their mailbox located "at" the server domain "scoala.ro".'
                : 'Arată că utilizatorul «elev» își are contul găzduit «la» (at) serverul «scoala.ro».'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ2AtSymbol('password_encrypt');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q2AtSymbol === 'password_encrypt'
                ? 'bg-sky-950/80 border-sky-500 text-white shadow-md ring-1 ring-sky-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Encrypts the user password' : 'B) Criptează parola secretă a utilizatorului'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'It acts as an encryption cipher that prevents anyone from changing the password.'
                : 'Este un cifru matematic secret care împiedică schimbarea parolei contului.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q2-at-symbol-hint"
          hintRo="În 1971, Ray Tomlinson a ales simbolul @ tocmai pentru că în engleză se citește «at» (la), separând numele persoanei de numele calculatorului/domeniului!"
          hintEn="In 1971, Ray Tomlinson chose the @ symbol because it reads as 'at', locating the user at a specific host domain!"
        />

        {q2AtSymbol && (
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanationRo={
              isQ2Correct
                ? 'Excelent! Simbolul @ (a rond) face legătura logică: indică pe ce server de e-mail (domeniu) se află căsuța poștală a utilizatorului respectiv.'
                : 'Simbolul @ nu este un cifru de parolă, ci un simplu caracter separator standardizat între identificatorul utilizatorului și numele serverului.'
            }
            explanationEn={
              isQ2Correct
                ? 'Correct! The @ symbol specifies where the user inbox is hosted.'
                : 'The @ sign is a structural separator, not an encryption mechanism.'
            }
          />
        )}
      </div>

      {/* Task 3: Simulator Compunere E-mail Formal către Profesor */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center text-xs font-mono font-black">
              3
            </span>
            {lang === 'en'
              ? 'Interactive Email Lab: Compose a Formal Message to Your Teacher'
              : 'Laborator Interactiv: Compune un E-mail Formal către Profesorul de TIC'}
          </h3>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-md border border-sky-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {lang === 'en'
            ? 'Select the appropriate formal components to submit your school research project:'
            : 'Configurează câmpurile mesajului respectând normele de etichetă și politețe pentru predarea proiectului școlar:'}
        </p>

        {/* Email Interface Mockup */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>{lang === 'en' ? 'New Message • ARKEDO Mail Client' : 'Mesaj Nou • Client de Poștă ARKEDO'}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Draft</span>
          </div>

          {/* Field: To */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="w-24 text-xs font-mono text-slate-400 font-bold shrink-0">
              {lang === 'en' ? 'To (Către):' : 'Către (To):'}
            </label>
            <select
              value={emailForm.to}
              onChange={(e) => {
                setEmailForm((prev) => ({ ...prev, to: e.target.value }));
                setEmailSent(false);
              }}
              className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            >
              <option value="">{lang === 'en' ? '-- Select Recipient --' : '-- Alege Destinatarul --'}</option>
              <option value="profesor">profesor.tic@scoala-arkedo.ro (Profesor TIC)</option>
              <option value="anonymous_gamer">hacker999@free-games-cheat.xyz</option>
              <option value="spam_bot">offers-win-prize@spam-robot.top</option>
            </select>
          </div>

          {/* Field: Subject */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="w-24 text-xs font-mono text-slate-400 font-bold shrink-0">
              {lang === 'en' ? 'Subject:' : 'Subiect:'}
            </label>
            <select
              value={emailForm.subject}
              onChange={(e) => {
                setEmailForm((prev) => ({ ...prev, subject: e.target.value }));
                setEmailSent(false);
              }}
              className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            >
              <option value="">{lang === 'en' ? '-- Select Subject --' : '-- Alege Subiectul --'}</option>
              <option value="formal_project">Proiect TIC - Misiunea Internet - Maria Popescu Clasa V-B</option>
              <option value="empty_subject">(Fără subiect / Lăsat gol)</option>
              <option value="all_caps">UITA-TE AICI URGENT ACUM!!!</option>
            </select>
          </div>

          {/* Field: Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="w-24 text-xs font-mono text-slate-400 font-bold shrink-0">
              {lang === 'en' ? 'Greeting:' : 'Formulă:'}
            </label>
            <select
              value={emailForm.greeting}
              onChange={(e) => {
                setEmailForm((prev) => ({ ...prev, greeting: e.target.value }));
                setEmailSent(false);
              }}
              className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            >
              <option value="">{lang === 'en' ? '-- Select Greeting --' : '-- Alege Formula de Adresare --'}</option>
              <option value="polite_greeting">Bună ziua, stimate domnule profesor,</option>
              <option value="rude_greeting">Hei tu, dă-mi nota 10 repede!</option>
              <option value="slang_greeting">Ceau bro, ce mai zici?</option>
            </select>
          </div>

          {/* Field: Attachment */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="w-24 text-xs font-mono text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-sky-400" />
              {lang === 'en' ? 'Attach:' : 'Atașament:'}
            </label>
            <select
              value={emailForm.attachment}
              onChange={(e) => {
                setEmailForm((prev) => ({ ...prev, attachment: e.target.value }));
                setEmailSent(false);
              }}
              className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            >
              <option value="">{lang === 'en' ? '-- Select Attachment --' : '-- Alege Fișierul Atașat --'}</option>
              <option value="pdf_project">proiect_internet_maria_popescu.pdf (Document PDF)</option>
              <option value="virus_exe">free_cheat_roblox.exe (Program Executabil Dubios)</option>
              <option value="empty_attach">(Niciun fișier atașat)</option>
            </select>
          </div>

          {/* Field: Signature */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="w-24 text-xs font-mono text-slate-400 font-bold shrink-0">
              {lang === 'en' ? 'Signature:' : 'Semnătură:'}
            </label>
            <select
              value={emailForm.signature}
              onChange={(e) => {
                setEmailForm((prev) => ({ ...prev, signature: e.target.value }));
                setEmailSent(false);
              }}
              className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            >
              <option value="">{lang === 'en' ? '-- Select Closing Signature --' : '-- Alege Semnătura de Încheiere --'}</option>
              <option value="formal_signature">Cu respect și considerație, Maria Popescu, Clasa a V-a B</option>
              <option value="no_signature">(Fără semnătură / Anonim)</option>
              <option value="gaming_handle">xX_DarkDemon_Xx</option>
            </select>
          </div>

          {/* Send Button */}
          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              disabled={
                !emailForm.to ||
                !emailForm.subject ||
                !emailForm.greeting ||
                !emailForm.attachment ||
                !emailForm.signature
              }
              onClick={handleSendEmail}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                emailForm.to &&
                emailForm.subject &&
                emailForm.greeting &&
                emailForm.attachment &&
                emailForm.signature
                  ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-lg shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Send Formal Email' : 'Trimite E-mailul Formal'}</span>
            </button>
          </div>
        </div>

        {emailSent && (
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanationRo={
              isQ3Correct
                ? 'Felicitări! Ai structurat un e-mail impecabil: adresat profesorului, cu subiect descriptiv, formulă de politețe, referat atașat în format curat PDF și semnătură cu numele și clasa ta!'
                : 'Verifică elementele: e-mailul către profesor trebuie să aibă o adresă oficială, un subiect clar, formulă politicoasă («Bună ziua»), referatul .pdf atașat și semnătura ta completă (nu porecle sau anonim).'
            }
            explanationEn={
              isQ3Correct
                ? 'Congratulations! You composed a pristine formal email: verified teacher address, informative subject line, respectful greeting, clean PDF file, and full signature.'
                : 'Check components: a formal message requires polite phrasing, clear subject, attached PDF project, and full student name.'
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
