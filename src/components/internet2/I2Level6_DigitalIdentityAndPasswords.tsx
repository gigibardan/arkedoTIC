import React, { useState } from 'react';
import {
  KeyRound,
  Shield,
  Lock,
  Smartphone,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Eye,
  EyeOff,
  Fingerprint,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { TeacherTip } from '../TeacherTip';
import { QuestionHint } from '../internet1/QuestionHint';
import { AnswerExplanation } from '../internet1/AnswerExplanation';
import { PageNavigationFooter } from '../internet1/PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface I2Level6_DigitalIdentityAndPasswordsProps {
  onCompletePage: (score: number) => void;
}

export const I2Level6_DigitalIdentityAndPasswords: React.FC<
  I2Level6_DigitalIdentityAndPasswordsProps
> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Task 1: Digital footprint
  const [q1Footprint, setQ1Footprint] = useState<string>('');
  // Task 2: 2FA definition
  const [q2TwoFactor, setQ2TwoFactor] = useState<string>('');
  // Task 3: Password Strength & Public Logout Simulator
  const [testPassword, setTestPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [didLogout, setDidLogout] = useState<boolean>(false);

  // Criteria for password
  const hasLength = testPassword.length >= 12;
  const hasUpper = /[A-Z]/.test(testPassword);
  const hasLower = /[a-z]/.test(testPassword);
  const hasNumber = /[0-9]/.test(testPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(testPassword);
  const isPasswordStrong = hasLength && hasUpper && hasLower && hasNumber && hasSymbol;

  const isQ1Correct = q1Footprint === 'permanent_record';
  const isQ2Correct = q2TwoFactor === 'password_plus_phone';
  const isQ3Correct = isPasswordStrong && didLogout;

  const correctCount = (isQ1Correct ? 1 : 0) + (isQ2Correct ? 1 : 0) + (isQ3Correct ? 1 : 0);
  const totalQuestions = 3;
  const pageScore = correctCount === 3 ? 15 : correctCount === 2 ? 10 : correctCount === 1 ? 5 : 0;

  const handleApplyPresetPassword = () => {
    sounds.playClick();
    setTestPassword('St3lute#Verzi2026!');
  };

  const handleProceed = () => {
    sounds.playVictory();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    sounds.playClick();
    setQ1Footprint('');
    setQ2TwoFactor('');
    setTestPassword('');
    setDidLogout(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              {lang === 'en' ? 'Module 3B • Page 6 of 6' : 'Modulul 3B • Pagina 6 din 6'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Textbook pp. 47–48' : 'Manual pag. 47–48'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight mb-2">
            {lang === 'en'
              ? '6. Digital Identity, Fortress Passwords & 2FA'
              : '6. Identitate Digitală, Parole de Neclintit & 2FA'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'en'
              ? 'Your online identity is your digital self! Master the art of crafting impenetrable passwords, activating Two-Factor Authentication (2FA), and always securing public computer sessions by logging out properly (Textbook pp. 47–48).'
              : 'Identitatea ta online este extensia ta digitală în lume! Învață cum să construiești parole impenetrabile, de ce activăm Autentificarea în 2 Pași (2FA) și de ce este obligatoriu să te deconectezi (Log Out) de pe orice calculator public din laboratorul școlar!'}
          </p>
        </div>
      </div>

      {/* Teacher Tip Pill */}
      <TeacherTip
        title={
          lang === 'en'
            ? 'Teacher Tip: Anatomy of an Unbreakable Password (pp. 47–48)'
            : 'Sfatul Profesorului: Rețeta unei Parole Blindate (pag. 47–48)'
        }
        text={
          lang === 'en'
            ? '• The 4 Fortress Ingredients: 1) Minimum 12-16 characters; 2) Uppercase & lowercase letters; 3) Numbers; 4) Special symbols (!@#$%&*). • Never use personal data: Do not use your birth year, your dog’s name, or sequential numbers (e.g. 123456 or parola123)! • Two-Factor Authentication (2FA): Even if a hacker guesses your password, they cannot log in without the temporary security code sent to your phone! • Lab Rule: Always click "Log Out" (Deconectare) before leaving the school computer!'
            : '• Cele 4 ingrediente ale unei parole sigure: 1) Minim 12-16 caractere lungime; 2) Litere mari și mici; 3) Cifre; 4) Simboluri speciale (!@#$%&*). • Fără date previzibile: Nu folosi niciodată anul nașterii, numele animalului de companie sau secvențe simple (123456 sau parola123)! • Autentificarea în 2 Pași (2FA): Chiar dacă un atacator îți ghicește parola, nu se poate loga fără codul temporar de pe telefon! • Regula laboratorului: Dă mereu click pe „Deconectare” (Log Out) când pleci de la calculatorul școlii!'
        }
        extra={
          lang === 'en'
            ? 'Pro Tip: Use a passphrase! For example, "Pisica#Mov*Sare100M!" is extremely easy for you to remember, but mathematically impossible for brute-force hacker computers to crack.'
            : 'Truc de informatician: Folosește o frază secretă! De exemplu, «Pisica#Mov*Sare100M!» este foarte ușor de reținut de către tine, dar imposibil de spart de supercalculatoarele hackerilor.'
        }
      />

      {/* Task 1: Amprenta Digitală */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center text-xs font-mono font-black">
              1
            </span>
            {lang === 'en'
              ? 'What is a "Digital Footprint" (Amprenta Digitală)?'
              : 'Ce este «Amprenta Digitală» (Digital Footprint) a unei persoane?'}
          </h3>
          <span className="text-xs font-mono text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ1Footprint('permanent_record');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1Footprint === 'permanent_record'
                ? 'bg-teal-950/80 border-teal-500 text-white shadow-md ring-1 ring-teal-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Total Trail of Online Activity Left Behind' : 'A) Urma Permanentă a Tuturor Activităților Tale Online'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'All photos, comments, search queries, and posts stored on global servers that form your online reputation.'
                : 'Toate fotografiile, comentariile, căutările și postările stocate pe servere care alcătuiesc reputația ta pe internet.'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ1Footprint('physical_dirt');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q1Footprint === 'physical_dirt'
                ? 'bg-teal-950/80 border-teal-500 text-white shadow-md ring-1 ring-teal-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Physical dirt on keyboard keys' : 'B) Praful de pe tastele calculatorului'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Urmele lăsate pe birou dacă nu cureți tastatura cu o cârpă.'
                : 'Urmele fizice lăsate pe birou de praful din clasă.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q1-footprint-hint"
          hintRo="Pe internet, nimic nu se șterge cu adevărat: orice comentariu sau poză devine parte din istoricul tău digital permanent!"
          hintEn="Online, everything you publish leaves a persistent record that shapes your permanent digital footprint!"
        />

        {q1Footprint && (
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanationRo={
              isQ1Correct
                ? 'Corect! Amprenta digitală reprezintă totalitatea urmelor pe care le lași navigând pe internet. Gândește-te întotdeauna de două ori înainte de a posta ceva ce ar putea să-ți afecteze viitorul!'
                : 'Amprenta digitală este un concept informațional legat de datele stocate pe internet, nu praful fizic de pe birou.'
            }
            explanationEn={
              isQ1Correct
                ? 'Spot on! Your digital footprint comprises all stored online interactions, defining your long-term digital reputation.'
                : 'Digital footprint is a cybersecurity concept describing online data traces, not physical desk dirt.'
            }
          />
        )}
      </div>

      {/* Task 2: Autentificarea în 2 Pași (2FA) */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center text-xs font-mono font-black">
              2
            </span>
            {lang === 'en'
              ? 'How does Two-Factor Authentication (2FA) protect your account?'
              : 'Cum te protejează Autentificarea în 2 Pași (2FA / Two-Factor Authentication)?'}
          </h3>
          <span className="text-xs font-mono text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setQ2TwoFactor('password_plus_phone');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q2TwoFactor === 'password_plus_phone'
                ? 'bg-teal-950/80 border-teal-500 text-white shadow-md ring-1 ring-teal-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'A) Password + Temporary Code on Personal Device' : 'A) Parolă + Cod Temporar pe Dispozitivul Personal'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Requires both something you KNOW (password) and something you HAVE (phone/security key).'
                : 'Necesită două dovezi: ceva ce ȘTII (parola secretă) și ceva ce DEȚII (telefonul sau aplicația de autentificare).'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQ2TwoFactor('double_typing');
              sounds.playClick();
            }}
            className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
              q2TwoFactor === 'double_typing'
                ? 'bg-teal-950/80 border-teal-500 text-white shadow-md ring-1 ring-teal-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-100 mb-1">
              {lang === 'en' ? 'B) Typing your password twice in a row' : 'B) Scrierea parolei de două ori la rând'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Typing the same word two times in the same text box.'
                : 'Introducerea aceluiași cuvânt de două ori în aceeași căsuță.'}
            </span>
          </button>
        </div>

        <QuestionHint
          id="q2-2fa-hint"
          hintRo="2FA înseamnă două straturi de securitate distincte: parola secretă + un cod de 6 cifre primit instant pe telefonul tău!"
          hintEn="2FA combines two distinct factors: knowledge (your password) and possession (your mobile authenticator app)!"
        />

        {q2TwoFactor && (
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanationRo={
              isQ2Correct
                ? 'Excelent! Autentificarea în 2 pași (2FA) blochează 99.9% din atacurile cibernetice, fiindcă hackerul nu are acces fizic la telefonul tău pentru a prelua codul temporar.'
                : 'Scrierea parolei de două ori este doar o confirmare la crearea contului, nu o autentificare în doi factori independenți.'
            }
            explanationEn={
              isQ2Correct
                ? 'Correct! 2FA neutralizes automated cyberattacks by requiring physical possession of your registered mobile device.'
                : 'Retyping a password is standard confirmation, not a multi-factor authentication mechanism.'
            }
          />
        )}
      </div>

      {/* Task 3: Simulatorul Cetății Parolelor & Deconectare din Laborator */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center text-xs font-mono font-black">
              3
            </span>
            {lang === 'en'
              ? 'Password Strength Meter & Public Computer Log Out Protocol'
              : 'Simulator de Rezistență a Parolei & Protocolul Deconectării din Laborator'}
          </h3>
          <span className="text-xs font-mono text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-500/30">
            5 {lang === 'en' ? 'pts' : 'pct'}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {lang === 'en'
            ? 'Type or generate a fortress password meeting all 4 security criteria, and ensure you perform a safe Log Out from the public lab session:'
            : 'Construiește sau testează o parolă blindată care îndeplinește toate cele 4 criterii de securitate, apoi efectuează Deconectarea (Log Out) de pe calculatorul școlii:'}
        </p>

        {/* Password Tester Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                {lang === 'en' ? 'Test Your Password in the Security Meter:' : 'Testează Parola în Simulatorul de Securitate:'}
              </label>
              <button
                type="button"
                onClick={handleApplyPresetPassword}
                className="text-[11px] font-bold text-teal-400 hover:text-teal-300 underline cursor-pointer"
              >
                {lang === 'en' ? '✨ Insert Fortress Example' : '✨ Inserează Exemplu Blindat'}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder={lang === 'en' ? 'Type a password (e.g., St3lute#Verzi2026!)...' : 'Scrie o parolă sigură (ex: St3lute#Verzi2026!)...'}
                className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 4 Security Criteria Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                hasLength
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasLength ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>{lang === 'en' ? 'Min 12 Chars' : 'Min. 12 Caractere'}</span>
            </div>

            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                hasUpper && hasLower
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasUpper && hasLower ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>{lang === 'en' ? 'Upper & Lower (Aa)' : 'Mari & Mici (Aa)'}</span>
            </div>

            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                hasNumber
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>{lang === 'en' ? 'Numbers (0-9)' : 'Cifre (0-9)'}</span>
            </div>

            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                hasSymbol
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasSymbol ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>{lang === 'en' ? 'Symbols (!@#$)' : 'Simboluri (!@#$)'}</span>
            </div>
          </div>

          {/* Lab Security: Logout Button */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              <span className="font-bold text-slate-300 block mb-0.5">
                {lang === 'en' ? 'School Computer Lab Safety Rule:' : 'Regula de Aur a Laboratorului de TIC:'}
              </span>
              {lang === 'en'
                ? 'Always close active browser sessions before leaving your seat!'
                : 'Deconectează-te întotdeauna de pe contul școlar înainte de a te ridica de la birou!'}
            </div>

            <button
              type="button"
              onClick={() => {
                setDidLogout(true);
                sounds.playCorrect();
                arky.triggerSuccess(
                  lang === 'en'
                    ? 'Session securely closed! No subsequent student can access your personal account!'
                    : 'Sesiune închisă cu succes! Următorul elev nu va putea intra în contul tău!'
                );
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                didLogout
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-slate-900 border-rose-500/40 text-rose-300 hover:bg-rose-950/40'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{didLogout ? (lang === 'en' ? '✓ Logged Out Safely' : '✓ Deconectat în Siguranță') : (lang === 'en' ? 'Execute Log Out' : 'Efectuează Deconectarea')}</span>
            </button>
          </div>
        </div>

        {(testPassword.length > 0 || didLogout) && (
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanationRo={
              isQ3Correct
                ? 'Felicitări depline! Ai creat o parolă ultra-rezistentă (complexă, lungă, cu cifre și simboluri) și ai asigurat calculatorul prin deconectare la plecare!'
                : !isPasswordStrong
                ? 'Parola trebuie să aibă minim 12 caractere și să conțină litere mari, mici, cifre și cel puțin un caracter special (ex: ! @ # $ % &).'
                : 'Nu uita să apeși butonul roșu «Efectuează Deconectarea» pentru a securiza sesiunea pe calculatorul laboratorului!'
            }
            explanationEn={
              isQ3Correct
                ? 'Splendid! You forged a fortress-level password and ensured workstation security via explicit logout!'
                : !isPasswordStrong
                ? 'The password must reach at least 12 characters and mix uppercase, lowercase, numerals, and special symbols.'
                : 'Remember to click the "Execute Log Out" button to secure the shared lab computer!'
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
        isLastPage={true}
      />
    </div>
  );
};
