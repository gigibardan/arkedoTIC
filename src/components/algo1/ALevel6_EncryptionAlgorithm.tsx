import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Lock, 
  Unlock,
  RotateCcw,
  Check,
  Binary,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface ALevel6Props {
  onCompletePage: (earnedScore: number) => void;
}

const ALPHABET_MAP: Record<string, string> = {
  'A': '01', 'B': '02', 'C': '03', 'D': '04', 'E': '05',
  'F': '06', 'G': '07', 'H': '08', 'I': '09', 'J': '10',
  'K': '11', 'L': '12', 'M': '13', 'N': '14', 'O': '15',
  'P': '16', 'Q': '17', 'R': '18', 'S': '19', 'T': '20',
  'U': '21', 'V': '22', 'W': '23', 'X': '24', 'Y': '25',
  'Z': '26', ' ': '00'
};

export const ALevel6_EncryptionAlgorithm: React.FC<ALevel6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Live Encoder State
  const [inputText, setInputText] = useState<string>('TIC');
  
  // Secret Mystery Decoder Challenge from Textbook p. 60
  // Code: 01 12 07 15 18 09 20 13 (ALGORITM)
  const secretCode = '01 12 07 15 18 09 20 13';
  const [secretGuess, setSecretGuess] = useState<string>('');
  const [decoderValidated, setDecoderValidated] = useState<boolean>(false);
  const [decoderCooldown, setDecoderCooldown] = useState<number>(0);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);

  // Timer cooldown decrement
  useEffect(() => {
    if (decoderCooldown <= 0 && q1Cooldown <= 0 && q2Cooldown <= 0) return;
    const timer = setInterval(() => {
      if (decoderCooldown > 0) setDecoderCooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q1Cooldown > 0) setQ1Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q2Cooldown > 0) setQ2Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [decoderCooldown, q1Cooldown, q2Cooldown]);

  // Compute live encoded string
  const encodedStream = inputText
    .toUpperCase()
    .split('')
    .map(ch => ALPHABET_MAP[ch] || '??')
    .join(' ');

  const isSecretCorrect = secretGuess.trim().toUpperCase() === 'ALGORITM';

  const handleValidateDecoder = () => {
    if (decoderCooldown > 0) return;
    setDecoderValidated(true);
    if (isSecretCorrect) {
      sounds.playVictory();
    } else {
      sounds.playWrong();
      setDecoderCooldown(5);
    }
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'two_digits';
  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'two_digits') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const isQ2Correct = q2Answer === 'encryption_algorithm';
  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'encryption_algorithm') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  // Scoring
  let correctCount = 0;
  if (decoderValidated && isSecretCorrect) correctCount += 2;
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 4;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 text-3xl shrink-0 shadow-inner">
            🔐
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5A • Page 6 of 7' : 'Modulul 5A • Pagina 6 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 60–61, Ex. 3' : 'Manual pag. 60–61, Ex. 3'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '6. Cryptography: The Message Encoding Algorithm' : '6. Algoritmul de Criptare & Codificare Numerică'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Algorithms can convert confidential text messages into secret numerical codes by substituting each letter with its 2-digit alphabetical position (A=01, B=02... Space=00).'
                : 'Un algoritm de criptare transformă mesajele text în coduri numerice secrete prin înlocuirea fiecărei litere cu poziția ei din alfabet pe două cifre (A=01, B=02, C=03... spațiu=00).'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Live Interactive Coder & Decoder Studio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Encoder Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold text-white font-heading">
              {lang === 'en' ? 'Live Text Encoder' : 'Simulator: Criptare în Timp Real'}
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">
              {lang === 'en' ? 'Type any word or name (e.g. ROBOT, CEAI, CLASA):' : 'Introdu un cuvânt sau nume (ex: ROBOT, CEAI, CLASA):'}
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value.toUpperCase());
                sounds.playClick();
              }}
              maxLength={15}
              className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2.5 rounded-xl font-mono text-white text-sm font-bold tracking-widest focus:outline-none focus:border-emerald-400 uppercase"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
              {lang === 'en' ? 'Generated Numerical Stream (A=01...):' : 'Șirul Numeric Generat:'}
            </div>
            <div className="text-sm sm:text-base font-mono font-black text-emerald-300 tracking-wider break-all">
              {encodedStream || '00'}
            </div>
          </div>
        </div>

        {/* Decoder Challenge Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Unlock className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm sm:text-base font-bold text-white font-heading">
              {lang === 'en' ? 'Mission: Decode Secret Message' : 'Misiune: Decodifică Mesajul Secret'}
            </h2>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">
              {lang === 'en' ? 'Encrypted Code from Textbook (pag. 60):' : 'Codul din Manual (pag. 60):'}
            </div>
            <div className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-widest">
              {secretCode}
            </div>
            <div className="text-[10px] text-slate-400">
              Indiciu: 01=A, 12=L, 07=G, 15=O, 18=R, 09=I, 20=T, 13=M
            </div>
          </div>

          {decoderCooldown > 0 && (
            <PedagogicalReflectionBanner
              cooldown={decoderCooldown}
              customMessageRo="Cuvânt decodificat incorect! Te rugăm să acorzi 5 secunde pentru a asocia fiecare număr cu litera din alfabet (01=A, 12=L, 07=G...)."
              customMessageEn="Incorrect decoded word! Please take 5 seconds to match each number with the alphabet (01=A, 12=L, 07=G...)."
            />
          )}

          <div className="space-y-2">
            <input
              type="text"
              value={secretGuess}
              disabled={decoderCooldown > 0}
              onChange={(e) => setSecretGuess(e.target.value.toUpperCase())}
              placeholder={lang === 'en' ? 'Type decoded word here...' : 'Scrie cuvântul decodificat...'}
              maxLength={12}
              className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2 rounded-xl font-mono text-white text-sm font-bold tracking-widest focus:outline-none focus:border-teal-400 uppercase disabled:opacity-50"
            />
            <button
              type="button"
              disabled={decoderCooldown > 0 || !secretGuess}
              onClick={handleValidateDecoder}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                decoderCooldown > 0 || !secretGuess
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/30'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'en' ? 'Validate Decoded Word' : 'Validează Decodificarea'}</span>
            </button>
          </div>

          {decoderValidated && (
            <div className={`text-xs font-bold flex items-center gap-1.5 ${isSecretCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isSecretCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Excellent! You decoded: ALGORITM' : 'Excelent! Ai descoperit cuvântul: ALGORITM!'}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Incorrect. Check the letter positions.' : 'Incorect. Verifică poziția literelor în alfabet.'}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Cryptography & Algorithms' : 'Verifică-ți Cunoștințele: Criptografie & Algoritmi'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Why are single-digit numbers represented with a leading zero (e.g. 01 for A, 02 for B) in this algorithm?'
              : 'De ce literele din prima parte a alfabetului sunt codificate cu două cifre (01 pentru A, 02 pentru B, 09 pentru I)?'}
          </div>

          {(q1Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza necesitatea lungimii fixe de 2 cifre la decodificare."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on fixed-length numerical decoding."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'two_digits', text: lang === 'en' ? 'A) To maintain a fixed 2-digit length so the decoder knows where each letter starts and ends' : 'A) Pentru ca fiecare caracter să aibă lungime fixă de 2 cifre, evitând confuzia la decodificare' },
              { id: 'for_fun', text: lang === 'en' ? 'B) Zero was added just because the screen was too empty' : 'B) Cifra zero a fost adăugată doar ca decor' },
              { id: 'zero_is_letter_z', text: lang === 'en' ? 'C) 0 represents letter Z' : 'C) 0 reprezintă litera Z' },
              { id: 'only_three_letters', text: lang === 'en' ? 'D) Only 3 letters can be encoded' : 'D) Doar 3 litere pot fi codificate' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q1Cooldown > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  q1Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q1Answer === opt.id
                    ? opt.id === 'two_digits'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_crypto_q1"
            hintRo="Dacă am scrie 12, am putea confunda litera L (12) cu A și B (1 și 2). Lungimea fixă de 2 cifre elimină ambiguitatea."
            hintEn="If we wrote 12, it could be confused between L (12) and AB (1 and 2). Fixed 2-digit blocks remove ambiguity."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! Uniform 2-digit blocks prevent ambiguity (e.g. distinguishing 12 as L versus 01 02 as AB).' : 'Exact! Formatul uniform de 2 cifre (01, 02... 26) garantează că decodificarea se face fără ambiguitate.')
                  : (lang === 'en' ? 'Incorrect. Fixed-width representation eliminates decoding confusion.' : 'Incorect. Cifra zero inițială asigură citirea sigură a fiecărei litere pe blocuri de exact două cifre.')
              }
              ruleReference="Manual TIC pag. 60"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What is the name of the branch of computer science that deals with creating and solving secret encryption algorithms?'
              : 'Cum se numește ramura informaticii care se ocupă cu securizarea și cifrarea datelor prin algoritmi de criptare?'}
          </div>

          {(q2Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza termenul Criptografie (din limba greacă: scriere secretă)."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on Cryptography."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'encryption_algorithm', text: lang === 'en' ? 'A) Cryptography (Criptografie)' : 'A) Criptografie (știința securizării informației)' },
              { id: 'botany', text: lang === 'en' ? 'B) Botany' : 'B) Botanică' },
              { id: 'astronomy', text: lang === 'en' ? 'C) Astronomy' : 'C) Astronomie' },
              { id: 'geography', text: lang === 'en' ? 'D) Physical Geography' : 'D) Geografie fizică' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  q2Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q2Answer === opt.id
                    ? opt.id === 'encryption_algorithm'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_crypto_q2"
            hintRo="Cuvântul provine din grecescul kryptos (ascuns) și graphein (a scrie)."
            hintEn="The word comes from Greek kryptos (hidden) and graphein (to write)."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! Cryptography is the essential domain securing bank transactions, passwords, and communications.' : 'Corect! Criptografia este domeniul informaticii care protejează parolele, tranzacțiile bancare și comunicațiile de pe Internet.')
                  : (lang === 'en' ? 'Incorrect. The field is called Cryptography.' : 'Incorect. Știința cifrării și securizării datelor este Criptografia.')
              }
              ruleReference="Manual TIC pag. 60"
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => {
          sounds.playCorrect();
          onCompletePage(earnedScore);
        }}
      />
    </div>
  );
};
