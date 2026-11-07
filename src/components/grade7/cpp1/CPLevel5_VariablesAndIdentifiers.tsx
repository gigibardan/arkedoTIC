import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface IdentifierTest {
  id: string;
  name: string;
  isValid: boolean;
  ruleViolatedRo?: string;
  ruleViolatedEn?: string;
  explanationRo: string;
  explanationEn: string;
}

const IDENTIFIERS_LIST: IdentifierTest[] = [
  {
    id: 'i1',
    name: 'nota_elev',
    isValid: true,
    explanationRo: 'Valid: Conține doar litere mici și caracterul underscore (_) pentru separare.',
    explanationEn: 'Valid: Composed exclusively of lowercase letters and underscore (_) separator.'
  },
  {
    id: 'i2',
    name: '2prieteni',
    isValid: false,
    ruleViolatedRo: 'Nu poate începe cu o cifră',
    ruleViolatedEn: 'Cannot start with a digit',
    explanationRo: 'Invalid: În C++, un identificator nu are voie niciodată să înceapă cu o cifră (0-9)!',
    explanationEn: 'Invalid: In C++, an identifier name must never begin with a digit (0-9)!'
  },
  {
    id: 'i3',
    name: '_contor',
    isValid: true,
    explanationRo: 'Valid: Un identificator poate începe legal cu o literă sau cu caracterul underscore (_).',
    explanationEn: 'Valid: An identifier can legally start with an ASCII letter or underscore (_).'
  },
  {
    id: 'i4',
    name: 'medie-generala',
    isValid: false,
    ruleViolatedRo: 'Semnul minus nu este permis',
    ruleViolatedEn: 'Hyphen/minus sign is prohibited',
    explanationRo: 'Invalid: Caracterul cratimă (-) este tratat ca operatorul matematic de scădere!',
    explanationEn: 'Invalid: Hyphen (-) is evaluated as the arithmetic subtraction operator!'
  },
  {
    id: 'i5',
    name: 'numar elevi',
    isValid: false,
    ruleViolatedRo: 'Conține spațiu liber',
    ruleViolatedEn: 'Contains whitespace',
    explanationRo: 'Invalid: Numele unei variabile nu poate conține spații! Folosește numar_elevi sau numarElevi.',
    explanationEn: 'Invalid: Variable names cannot embed spaces! Use numar_elevi or numarElevi instead.'
  },
  {
    id: 'i6',
    name: 'double',
    isValid: false,
    ruleViolatedRo: 'Cuvânt cheie rezervat',
    ruleViolatedEn: 'Reserved keyword',
    explanationRo: 'Invalid: "double" este cuvânt cheie rezervat al limbajului C++ pentru tipul de date zecimal!',
    explanationEn: 'Invalid: "double" is a reserved C++ language keyword defining primitive floating point type!'
  },
  {
    id: 'i7',
    name: 'X2',
    isValid: true,
    explanationRo: 'Valid: Începe cu literă mare și este urmat de o cifră.',
    explanationEn: 'Valid: Starts with uppercase letter followed by an alphanumeric digit.'
  }
];

export const CPLevel5_VariablesAndIdentifiers: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [tested, setTested] = useState<Record<string, { userSaidValid: boolean; isCorrect: boolean }>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleVote = (id: string, userSaidValid: boolean) => {
    const item = IDENTIFIERS_LIST.find(i => i.id === id);
    if (!item) return;

    const isCorrect = item.isValid === userSaidValid;
    const explanation = lang === 'ro' ? item.explanationRo : item.explanationEn;

    if (isCorrect) {
      sounds.playCorrect();
      setFeedback(lang === 'ro' ? `CORECT! ${explanation}` : `CORRECT! ${explanation}`);
    } else {
      sounds.playWrong();
      setFeedback(lang === 'ro' ? `GREȘIT! ${explanation}` : `INCORRECT! ${explanation}`);
    }

    setTested(prev => ({
      ...prev,
      [id]: { userSaidValid, isCorrect }
    }));
  };

  const allTested = Object.keys(tested).length === IDENTIFIERS_LIST.length;
  const correctCount = Object.values(tested).filter((t: { userSaidValid: boolean; isCorrect: boolean }) => t.isCorrect).length;

  const handleFinish = () => {
    sounds.playVictory();
    onPass(100);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg text-2xl font-black">
            5
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>
                {lang === 'ro'
                  ? 'Unitatea 4 • Limbajul C++ (Manual Art Klett pag. 72–73)'
                  : 'Unit 4 • C++ Programming (Art Klett Textbook pp. 72–73)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Reguli de Aur: Identificatori & Declarare Variabile'
                : 'Golden Rules: Identifiers & Variable Declarations'}
            </h2>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {lang === 'ro'
            ? `Scanate: ${Object.keys(tested).length} / ${IDENTIFIERS_LIST.length}`
            : `Evaluated: ${Object.keys(tested).length} / ${IDENTIFIERS_LIST.length}`}
        </div>
      </div>

      {/* Rules Summary Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{lang === 'ro' ? '1. Caractere Permise' : '1. Permitted Characters'}</span>
          </div>
          <p className="text-slate-400 leading-snug">
            {lang === 'ro'
              ? 'Doar litere (mari și mici), cifre și caracterul de subliniere (_).'
              : 'Only uppercase and lowercase letters, decimal digits, and underscore (_).'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="font-bold text-rose-400 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{lang === 'ro' ? '2. Fără Cifră la Start' : '2. No Leading Digits'}</span>
          </div>
          <p className="text-slate-400 leading-snug">
            {lang === 'ro'
              ? 'Numele NU are voie să înceapă cu cifre (ex: 2a este interzis, a2 este permis).'
              : 'Names CANNOT begin with digits (e.g. 2a is illegal, while a2 is valid).'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lang === 'ro' ? '3. Fără Cuvinte Rezervate' : '3. No Reserved Keywords'}</span>
          </div>
          <p className="text-slate-400 leading-snug">
            {lang === 'ro'
              ? 'Nu poți numi o variabilă: int, return, main, double, bool sau float.'
              : 'Keywords cannot be variable identifiers: int, return, main, double, bool, etc.'}
          </p>
        </div>
      </div>

      {/* Scanner List */}
      <div className="flex flex-col gap-3">
        <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>
            {lang === 'ro'
              ? 'Decide pentru fiecare nume dacă este un IDENTIFICATOR VALID în C++:'
              : 'Decide whether each candidate name is a VALID C++ IDENTIFIER:'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {IDENTIFIERS_LIST.map(item => {
            const result = tested[item.id];
            const explanation = lang === 'ro' ? item.explanationRo : item.explanationEn;

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                  result
                    ? result.isCorrect
                      ? 'bg-slate-950/80 border-emerald-500/50'
                      : 'bg-slate-950/80 border-rose-500/50'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono font-bold text-sm sm:text-base text-amber-300 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                    {item.name}
                  </span>

                  {!result ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(item.id, true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
                      >
                        VALID
                      </button>
                      <button
                        onClick={() => handleVote(item.id, false)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer"
                      >
                        INVALID
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {result.isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> {lang === 'ro' ? 'Corect' : 'Correct'}
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> {lang === 'ro' ? 'Greșit' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {result && (
                  <p className="text-[11px] text-slate-400 leading-snug pt-1 border-t border-slate-900 font-sans">
                    {explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion */}
      {allTested && (
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              {lang === 'ro'
                ? `Scor: ${correctCount} din ${IDENTIFIERS_LIST.length} identificatori analizați corect!`
                : `Score: ${correctCount} of ${IDENTIFIERS_LIST.length} identifiers analyzed correctly!`}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer"
          >
            <span>
              {lang === 'ro'
                ? 'Treci la Nivelul 6: Simulator Code::Blocks Virtual'
                : 'Advance to Level 6: Virtual Code::Blocks Simulator'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
