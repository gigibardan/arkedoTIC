import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useHints } from '../../context/HintContext';

interface QuestionHintProps {
  id?: string;
  hintRo: string;
  hintEn: string;
  titleRo?: string;
  titleEn?: string;
  onHintUsed?: () => void;
}

export const QuestionHint: React.FC<QuestionHintProps> = ({
  id,
  hintRo,
  hintEn,
  titleRo = 'Ai nevoie de un indiciu?',
  titleEn = 'Need a clue?',
  onHintUsed,
}) => {
  const { lang } = useLanguage();
  const { useHint } = useHints();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      const hintKey = id || hintRo.substring(0, 30);
      useHint(hintKey);
      if (onHintUsed) onHintUsed();
    }
  };

  return (
    <div className="my-2">
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
      >
        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
        <span>{isOpen ? (lang === 'en' ? 'Hide Clue' : 'Ascunde Indiciul') : (lang === 'en' ? titleEn : titleRo)}</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="mt-2 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5 animate-fadeIn">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 mr-1">
              {lang === 'en' ? 'Smart Hint:' : 'Indiciu util:'}
            </span>
            {lang === 'en' ? hintEn : hintRo}
          </div>
        </div>
      )}
    </div>
  );
};
