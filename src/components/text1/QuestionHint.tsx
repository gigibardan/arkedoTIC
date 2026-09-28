import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useHints } from '../../context/HintContext';

interface QuestionHintProps {
  hintId?: string;
  hintRo: string;
  hintEn: string;
  cost?: number;
}

export const QuestionHint: React.FC<QuestionHintProps> = ({
  hintId,
  hintRo,
  hintEn,
  cost = 0,
}) => {
  const { lang } = useLanguage();
  const { useHint } = useHints();
  const [revealed, setRevealed] = useState<boolean>(false);

  const handleToggle = () => {
    if (!revealed) {
      useHint(hintId || `${hintRo.slice(0, 15)}_${cost}`);
      setRevealed(true);
    } else {
      setRevealed(false);
    }
  };

  return (
    <div className="mt-2.5">
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors cursor-pointer"
      >
        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
        <span>{revealed ? (lang === 'en' ? 'Hide Hint' : 'Ascunde Indiciul') : (lang === 'en' ? 'Need a Hint?' : 'Ai nevoie de un indiciu?')}</span>
        {revealed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {revealed && (
        <div className="mt-2 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 leading-relaxed animate-fadeIn">
          <p className="flex items-start gap-1.5">
            <span className="font-bold text-amber-400 shrink-0">💡 {lang === 'en' ? 'Tip:' : 'Indiciu didactic:'}</span>
            <span>{lang === 'en' ? hintEn : hintRo}</span>
          </p>
        </div>
      )}
    </div>
  );
};
