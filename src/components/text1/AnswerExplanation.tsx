import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface AnswerExplanationProps {
  isCorrect: boolean;
  explanation: string;
  ruleReference?: string;
}

export const AnswerExplanation: React.FC<AnswerExplanationProps> = ({
  isCorrect,
  explanation,
  ruleReference,
}) => {
  return (
    <div
      className={`mt-2 p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 transition-all animate-fadeIn ${
        isCorrect
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isCorrect ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-400" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{explanation}</p>
        {ruleReference && (
          <div className="mt-1 flex items-center gap-1.5 text-[11px] opacity-80 font-mono text-cyan-300">
            <Info className="w-3 h-3" />
            <span>{ruleReference}</span>
          </div>
        )}
      </div>
    </div>
  );
};
