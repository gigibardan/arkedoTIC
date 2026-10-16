import React, { useState } from 'react';
import {
  Mail,
  Inbox,
  Send,
  FileText,
  AlertOctagon,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  AtSign,
  Globe,
  UserCheck,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface EmailLevel1Props {
  onCompletePage: (earnedScore: number) => void;
}

interface AddressTestItem {
  id: string;
  address: string;
  isValid: boolean;
  reasonRo: string;
  reasonEn: string;
}

const ADDRESS_TESTS: AddressTestItem[] = [
  {
    id: 'a1',
    address: 'andrei.popescu@scoala.ro',
    isValid: true,
    reasonRo: 'Corect: conține nume de utilizator, exact un simbol @ și domeniu valid (.ro).',
    reasonEn: 'Valid: contains username, exactly one @ symbol, and valid domain (.ro).'
  },
  {
    id: 'a2',
    address: 'maria scoala@gmail.com',
    isValid: false,
    reasonRo: 'Greșit: adresele de e-mail NU pot conține spații libere!',
    reasonEn: 'Invalid: email addresses cannot contain blank spaces!'
  },
  {
    id: 'a3',
    address: 'elev_clasa6@edu@yahoo.com',
    isValid: false,
    reasonRo: 'Greșit: o adresă de e-mail nu poate avea două simboluri @!',
    reasonEn: 'Invalid: an email address cannot have two @ symbols!'
  },
  {
    id: 'a4',
    address: 'profesor.tic@arkyedu.com',
    isValid: true,
    reasonRo: 'Corect: structură perfectă de e-mail instituțional profesional.',
    reasonEn: 'Valid: perfect structure of professional institutional email.'
  },
  {
    id: 'a5',
    address: 'alexandru.informaticagmail.com',
    isValid: false,
    reasonRo: 'Greșit: lipsește simbolul obligatoriu @ (a-rond / la) care separă utilizatorul de domeniu!',
    reasonEn: 'Invalid: missing mandatory @ symbol separating user from domain!'
  }
];

export const EmailLevel1_AnatomyAndAddresses: React.FC<EmailLevel1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Active folder simulator state
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'spam' | 'trash'>('inbox');

  // Address validation interactive tests
  const [testedAddresses, setTestedAddresses] = useState<Record<string, 'valid' | 'invalid'>>({});
  const [addressFeedback, setAddressFeedback] = useState<Record<string, boolean>>({});

  // Sorting email quiz with 5-second pedagogical cooldown
  const [qSortAnswer, setQSortAnswer] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleTestAddress = (id: string, userChoice: 'valid' | 'invalid') => {
    if (testedAddresses[id]) return;
    const testItem = ADDRESS_TESTS.find((t) => t.id === id);
    if (!testItem) return;

    const isCorrect = (userChoice === 'valid' && testItem.isValid) || (userChoice === 'invalid' && !testItem.isValid);
    setTestedAddresses((prev) => ({ ...prev, [id]: userChoice }));
    setAddressFeedback((prev) => ({ ...prev, [id]: isCorrect }));

    if (isCorrect) sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleSortAnswer = (choice: string) => {
    if (isLocked('qSort') || qSortAnswer === 'spam') return;
    setQSortAnswer(choice);
    if (choice === 'spam') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qSort', 5);
    }
  };

  const completedAllTests = Object.keys(testedAddresses).length === ADDRESS_TESTS.length;
  const isAllDone = completedAllTests && qSortAnswer === 'spam';

  const folderDetails = {
    inbox: {
      name: isEn ? 'Inbox (Received)' : 'Inbox (Mesaje Primite)',
      icon: <Inbox className="w-5 h-5 text-blue-400" />,
      descRo: 'Folderul principal unde sosesc toate mesajele legitime de la profesori, colegi și servicii de încredere.',
      descEn: 'The primary folder where all legitimate messages from teachers, classmates, and trusted services arrive.',
      exampleCount: 14
    },
    sent: {
      name: isEn ? 'Sent Messages' : 'Mesaje Trimise (Sent)',
      icon: <Send className="w-5 h-5 text-emerald-400" />,
      descRo: 'Păstrează copiile tuturor e-mailurilor pe care le-ai expediat către alte persoane, utile pentru verificare și dovezi.',
      descEn: 'Keeps copies of all emails you sent to others, useful for verification and records.',
      exampleCount: 8
    },
    drafts: {
      name: isEn ? 'Drafts (Ciorne)' : 'Drafts (Ciorne / Schițe)',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      descRo: 'Mesaje începute dar încă netrimise. Furnizorul le salvează automat pentru a nu pierde textul dacă se întrerupe conexiunea.',
      descEn: 'Messages started but not yet sent. Saved automatically so you do not lose progress if disconnected.',
      exampleCount: 2
    },
    spam: {
      name: isEn ? 'Spam / Junk' : 'Spam (Mesaje Nesolicitate)',
      icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
      descRo: 'Mesaje publicitare nesolicitate, reclame suspecte sau tentative de fraudă filtrate automat de serverul de mail.',
      descEn: 'Unsolicited advertising, suspicious offers, or fraud attempts filtered automatically by the mail server.',
      exampleCount: 19
    },
    trash: {
      name: isEn ? 'Trash / Bin' : 'Coș de Gunoi (Trash / Bin)',
      icon: <Trash2 className="w-5 h-5 text-slate-400" />,
      descRo: 'Mesajele șterse temporar. De regulă sunt șterse definitiv automat după 30 de zile.',
      descEn: 'Temporarily deleted messages. Typically permanently purged automatically after 30 days.',
      exampleCount: 5
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/70 to-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/40">
                {isEn ? 'Unit 3 • Lesson 1 • Grade 6' : 'Unitatea 3 • Lecția 1 • Clasa a VI-a'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? 'Level 1 of 7' : 'Nivelul 1 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
              {isEn ? 'Anatomy of Email & Mailbox Architecture' : 'Anatomia Poștei Electronice & Structura Căsuței de E-mail'}
            </h1>
            <p className="text-sm text-blue-200/90 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Discover how an email address is formed, explore how mail servers route messages across folders, and learn to distinguish valid addresses from syntax errors.'
                : 'Descoperă cum este alcătuită o adresă de e-mail, cum funcționează folderele unei căsuțe poștale digitale (Inbox, Sent, Drafts, Spam) și recunoaște formatele valide.'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            📬
          </div>
        </div>
      </div>

      {/* Anatomy Interactive Breakdown Card */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-sm uppercase tracking-wider">
          <AtSign className="w-4 h-4" />
          <span>{isEn ? '1. Structure of an Email Address' : '1. Structura Obligatorie a unei Adrese de E-mail'}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left">
          <div className="px-4 py-3 rounded-xl bg-blue-950/60 border border-blue-500/40">
            <span className="text-xs font-mono text-blue-400 block font-bold">1. Nume Utilizator (User)</span>
            <span className="text-lg font-black text-white font-mono">andrei.popescu</span>
            <span className="text-[11px] text-slate-400 block mt-1">Identifică persoana sau rolul</span>
          </div>

          <div className="text-3xl font-black text-amber-400 px-2 animate-pulse">
            @
            <span className="text-[10px] text-amber-300 block font-mono font-normal">„at” / „la”</span>
          </div>

          <div className="px-4 py-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40">
            <span className="text-xs font-mono text-indigo-400 block font-bold">2. Server & Domeniu</span>
            <span className="text-lg font-black text-white font-mono">scoala.ro</span>
            <span className="text-[11px] text-slate-400 block mt-1">Serverul gazdă / furnizorul</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="font-bold text-amber-300 block mb-1">Simbolul @ (a-rond)</span>
            <p className="text-slate-300 leading-relaxed">
              Separă numele utilizatorului de domeniul serverului de poștă. Nu poate lipsi și nu poate apărea de două ori!
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="font-bold text-blue-300 block mb-1">Fără Spații Libere</span>
            <p className="text-slate-300 leading-relaxed">
              O adresă de e-mail nu conține spații. Se folosesc puncte (.), liniuțe de subliniere (_) sau cratime (-).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="font-bold text-emerald-300 block mb-1">Insensibilitate la Majuscule</span>
            <p className="text-slate-300 leading-relaxed">
              <code className="text-emerald-400 font-mono">Andrei@Scoala.ro</code> este identică cu <code className="text-emerald-400 font-mono">andrei@scoala.ro</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Mailbox Folders Explorer */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>{isEn ? '2. Mailbox Folders Simulator' : '2. Simulatorul Folderelor Căsuței Poștale'}</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {isEn ? 'Click each folder to inspect' : 'Apasă pe fiecare folder pentru detalii'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(folderDetails) as Array<keyof typeof folderDetails>).map((key) => {
            const f = folderDetails[key];
            const isActive = activeFolder === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveFolder(key);
                  sounds.playClick();
                }}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {f.icon}
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 font-bold">
                    {f.exampleCount}
                  </span>
                </div>
                <div className="font-bold text-xs truncate">{f.name.split(' ')[0]}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Folder Details Inspector */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
            {folderDetails[activeFolder].icon}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{folderDetails[activeFolder].name}</span>
              <span className="text-xs font-mono text-slate-400">({folderDetails[activeFolder].exampleCount} mesaje)</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {isEn ? folderDetails[activeFolder].descEn : folderDetails[activeFolder].descRo}
            </p>
          </div>
        </div>
      </div>

      {/* Practical Lab: Address Validation Challenge */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{isEn ? '3. Address Validator Challenge' : '3. Provocare: Inspector de Adrese de E-mail'}</span>
          </div>
          <span className="text-xs font-mono text-amber-300">
            {Object.keys(testedAddresses).length} / {ADDRESS_TESTS.length} verificate
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {isEn
            ? 'Determine whether each address below adheres to valid email syntax or contains fatal errors:'
            : 'Stabilește pentru fiecare adresă de mai jos dacă este validă conform regulilor oficiale sau incorectă:'}
        </p>

        <div className="space-y-3">
          {ADDRESS_TESTS.map((item) => {
            const currentChoice = testedAddresses[item.id];
            const isCorrect = addressFeedback[item.id];

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  currentChoice
                    ? isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50'
                      : 'bg-rose-950/40 border-rose-500/50'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-sm sm:text-base font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                    {item.address}
                  </div>
                  {currentChoice && (
                    <span className="text-xs font-mono font-bold flex items-center gap-1">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Corect!
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Greșit
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {!currentChoice ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTestAddress(item.id, 'valid')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono flex items-center gap-1 shadow-md transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Valid' : 'Validă'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTestAddress(item.id, 'invalid')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono flex items-center gap-1 shadow-md transition-all active:scale-95"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Invalid' : 'Greșită'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-300 md:text-right max-w-md">
                    {isEn ? item.reasonEn : item.reasonRo}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Applied Scenario Question */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>{isEn ? '4. Applied Situation Test' : '4. Aplicație Practică: Trierea Mesajelor'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            {isEn
              ? 'You receive an unexpected email from "lottery-winner-99@xyz.biz" claiming you won $1,000,000 and asking you to click an unknown link immediately. In which folder should this message belong?'
              : 'Primești un e-mail neașteptat de la „castiga-milioane-99@xyz.biz” care îți spune că ai câștigat 100.000 de euro și îți cere să apeși urgent pe un link dubios. În ce folder trebuie trimis acest mesaj?'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleSortAnswer('inbox')}
            disabled={isLocked('qSort') || qSortAnswer === 'spam'}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all text-left cursor-pointer disabled:cursor-not-allowed ${
              qSortAnswer === 'inbox'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            A. În Inbox (este o oportunitate)
          </button>
          <button
            type="button"
            onClick={() => handleSortAnswer('drafts')}
            disabled={isLocked('qSort') || qSortAnswer === 'spam'}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all text-left cursor-pointer disabled:cursor-not-allowed ${
              qSortAnswer === 'drafts'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            B. În Drafts (să-l editez mai târziu)
          </button>
          <button
            type="button"
            onClick={() => handleSortAnswer('spam')}
            disabled={isLocked('qSort') || qSortAnswer === 'spam'}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all text-left cursor-pointer disabled:cursor-not-allowed ${
              qSortAnswer === 'spam'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            C. În Spam / Junk & Blocat (este o capcană phishing)
          </button>
        </div>

        {cooldowns.qSort && cooldowns.qSort > 0 ? (
          <PedagogicalReflectionBanner
            cooldown={cooldowns.qSort}
            totalSeconds={5}
            customMessageRo="Timp de reflecție: Mesajele nesolicitate cu premii uriașe sunt escrocherii phishing!"
            customMessageEn="Reflection buffer: Unsolicited lottery emails are phishing scams!"
          />
        ) : null}

        <QuestionHint
          hint={
            isEn
              ? 'Unsolicited prize emails with high urgency and unknown senders are textbook spam and phishing scams.'
              : 'Mesajele nesolicitate cu premii fabuloase și linkuri suspecte sunt capcane clasice de phishing și trebuie marcate ca Spam!'
          }
        />

        {qSortAnswer && (
          <AnswerExplanation
            isCorrect={qSortAnswer === 'spam'}
            explanation={
              qSortAnswer === 'spam'
                ? 'Excelent! Mesajele suspecte se trimit imediat la Spam/Junk. Nu apăsa niciodată pe linkurile din interiorul lor!'
                : 'Greșit. Orice mesaj nesolicitat care promite bani sau premii este o fraudă de tip Spam/Phishing și trebuie izolat!'
            }
          />
        )}
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isAllDone}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(15);
        }}
        nextLabel={isEn ? 'Next: To, CC & BCC Simulator ➜' : 'Următorul: Simulatorul To, CC & BCC ➜'}
      />
    </div>
  );
};
