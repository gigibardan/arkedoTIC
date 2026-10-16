import React, { useState } from 'react';
import {
  Paperclip,
  FileText,
  FileCode,
  Video,
  FileArchive,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CloudUpload,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface EmailLevel3Props {
  onCompletePage: (earnedScore: number) => void;
}

interface AttachmentFile {
  id: string;
  name: string;
  sizeMb: number;
  extension: string;
  typeIcon: React.ReactNode;
  correctDecision: 'attach_direct' | 'block_malware' | 'cloud_link';
  reasonRo: string;
  reasonEn: string;
}

const FILES_TO_INSPECT: AttachmentFile[] = [
  {
    id: 'f1',
    name: 'Referat_Geografie_Carpati.pdf',
    sizeMb: 3.2,
    extension: '.pdf',
    typeIcon: <FileText className="w-5 h-5 text-rose-400" />,
    correctDecision: 'attach_direct',
    reasonRo: 'Document PDF inofensiv sub 25 MB. Se poate atașa direct în siguranță.',
    reasonEn: 'Harmless PDF under 25 MB. Can be directly attached safely.'
  },
  {
    id: 'f2',
    name: 'Hack_Robux_Instalare.exe',
    sizeMb: 14.5,
    extension: '.exe',
    typeIcon: <FileCode className="w-5 h-5 text-rose-500" />,
    correctDecision: 'block_malware',
    reasonRo: 'Fișierele executabile (.exe) sunt blocate automat de sistemul de mail deoarece sunt cel mai comun vector de infecție cu malware/troieni!',
    reasonEn: 'Executable files (.exe) are automatically blocked because they are the main attack vector for malware!'
  },
  {
    id: 'f3',
    name: 'Montaj_Video_Serbare_Scoala.mp4',
    sizeMb: 850.0,
    extension: '.mp4',
    typeIcon: <Video className="w-5 h-5 text-indigo-400" />,
    correctDecision: 'cloud_link',
    reasonRo: 'Depășește limita standard de 25 MB! Trebuie încărcat în Cloud (Google Drive / OneDrive) și trimis doar linkul de acces.',
    reasonEn: 'Exceeds the standard 25 MB limit! Must be uploaded to Cloud storage with a shared link.'
  },
  {
    id: 'f4',
    name: 'Proiect_Imagini_Documente.zip',
    sizeMb: 18.0,
    extension: '.zip',
    typeIcon: <FileArchive className="w-5 h-5 text-amber-400" />,
    correctDecision: 'attach_direct',
    reasonRo: 'Arhivă ZIP curată de 18 MB (sub limita de 25 MB). Este perfectă pentru trimitere directă.',
    reasonEn: 'Clean ZIP archive of 18 MB (under 25 MB). Perfect for direct dispatch.'
  }
];

export const EmailLevel3_AttachmentsAndSecurity: React.FC<EmailLevel3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [decisions, setDecisions] = useState<Record<string, 'attach_direct' | 'block_malware' | 'cloud_link'>>({});
  const [fileFeedback, setFileFeedback] = useState<Record<string, boolean>>({});

  // Theory question: maximum size limit with 5s cooldown
  const [qLimitAnswer, setQLimitAnswer] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleDecision = (fileId: string, choice: 'attach_direct' | 'block_malware' | 'cloud_link') => {
    if (decisions[fileId]) return;
    const file = FILES_TO_INSPECT.find((f) => f.id === fileId);
    if (!file) return;

    const isCorrect = choice === file.correctDecision;
    setDecisions((prev) => ({ ...prev, [fileId]: choice }));
    setFileFeedback((prev) => ({ ...prev, [fileId]: isCorrect }));

    if (isCorrect) sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleLimitAnswer = (ans: string) => {
    if (isLocked('qLimit') || qLimitAnswer === '25mb') return;
    setQLimitAnswer(ans);
    if (ans === '25mb') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qLimit', 5);
    }
  };

  const allFilesDecided = Object.keys(decisions).length === FILES_TO_INSPECT.length;
  const isAllComplete = allFilesDecided && qLimitAnswer === '25mb';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                {isEn ? 'Unit 3 • Lesson 3 • Grade 6' : 'Unitatea 3 • Lecția 3 • Clasa a VI-a'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? 'Level 3 of 7' : 'Nivelul 3 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
              {isEn ? 'Attachments, Size Limits & File Security' : 'Atașamente, Limite de Dimensiune & Securitatea Fișierelor'}
            </h1>
            <p className="text-sm text-amber-200/90 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Learn how the paperclip icon works, inspect file formats for security risks, and discover the standard 25 MB email payload limit.'
                : 'Învață rolul agrafei de birou (Attach), respectă limita standard de 25 MB și recunoaște fișierele periculoase (.exe) pe care serverele de e-mail le resping automat.'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            📎
          </div>
        </div>
      </div>

      {/* Rules matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Fișiere Sigure</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-1">Documente & Imagini</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Extensii precum <code className="text-emerald-300 font-mono">.pdf, .docx, .pptx, .png, .jpg, .zip</code> sunt permise fără restricții de securitate.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded-xl">
            ✓ Permise ca atașament direct
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-rose-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">Pericol Malware</span>
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-1">Fișiere Executabile</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Extensii precum <code className="text-rose-300 font-mono">.exe, .bat, .vbs, .js, .scr</code> sunt blocate automat de Gmail/Outlook pentru prevenirea virușilor.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-mono text-rose-400 bg-rose-950/40 p-2 rounded-xl">
            ✕ Strict interzise în e-mail
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Limita 25 MB</span>
              <CloudUpload className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-1">Fișiere Voluminoase</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dacă fișierul depășește 25 MB (ex: videoclipuri), serverul refuză trimiterea. Soluția: încărcare pe Google Drive / OneDrive și trimitere link.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-mono text-indigo-400 bg-indigo-950/40 p-2 rounded-xl">
            ☁️ Soluție: Link partajare Cloud
          </div>
        </div>
      </div>

      {/* Interactive File Inspector Lab */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm uppercase tracking-wider">
            <Paperclip className="w-4 h-4" />
            <span>Laborator: Inspectorul de Atașamente</span>
          </div>
          <span className="text-xs font-mono text-amber-300">
            {Object.keys(decisions).length} / {FILES_TO_INSPECT.length} analizate
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Un coleg încearcă să trimită 4 fișiere prin e-mail. Analizează fiecare fișier și alege acțiunea tehnică și de securitate corectă:
        </p>

        <div className="space-y-4">
          {FILES_TO_INSPECT.map((file) => {
            const userChoice = decisions[file.id];
            const isCorrect = fileFeedback[file.id];

            return (
              <div
                key={file.id}
                className={`p-4 rounded-2xl border transition-all ${
                  userChoice
                    ? isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50'
                      : 'bg-rose-950/40 border-rose-500/50'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                      {file.typeIcon}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-white">{file.name}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        Mărime: <span className="text-amber-400 font-bold">{file.sizeMb} MB</span> • Tip: {file.extension}
                      </div>
                    </div>
                  </div>

                  {userChoice && (
                    <span className="text-xs font-mono font-bold">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Decizie Corectă!
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Decizie Greșită
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {!userChoice ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handleDecision(file.id, 'attach_direct')}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500 text-xs font-mono text-slate-200 hover:text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Atașează Direct (&lt;25 MB)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDecision(file.id, 'cloud_link')}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500 text-xs font-mono text-slate-200 hover:text-indigo-300 font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CloudUpload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Trimite prin Cloud (&gt;25 MB)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDecision(file.id, 'block_malware')}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500 text-xs font-mono text-slate-200 hover:text-rose-300 font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Blochează (Pericol .exe)</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                    {isEn ? file.reasonEn : file.reasonRo}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Size Limit Theory Check */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm uppercase tracking-wider">
          <HardDrive className="w-4 h-4" />
          <span>Verificare Curriculară: Dimensiunea Maximă</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          Care este dimensiunea maximă standard a fișierelor pe care le poți atașa direct într-un e-mail (Gmail / Outlook / Yahoo)?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleLimitAnswer('100mb')}
            disabled={isLocked('qLimit') || qLimitAnswer === '25mb'}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
              qLimitAnswer === '100mb'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            A. Până la 100 MB
          </button>
          <button
            type="button"
            onClick={() => handleLimitAnswer('25mb')}
            disabled={isLocked('qLimit') || qLimitAnswer === '25mb'}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
              qLimitAnswer === '25mb'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            B. Exact 25 MB (standard mondial)
          </button>
          <button
            type="button"
            onClick={() => handleLimitAnswer('nelimitat')}
            disabled={isLocked('qLimit') || qLimitAnswer === '25mb'}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
              qLimitAnswer === 'nelimitat'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            C. Nelimitat, cât permite hard diskul
          </button>
        </div>

        {cooldowns.qLimit && cooldowns.qLimit > 0 ? (
          <PedagogicalReflectionBanner
            cooldown={cooldowns.qLimit}
            totalSeconds={5}
            customMessageRo="Timp de reflecție: Majoritatea serviciilor de e-mail au o limită de atașament de 25 MB!"
            customMessageEn="Reflection buffer: Most email providers enforce a 25 MB attachment limit!"
          />
        ) : null}

        <QuestionHint hint="Standardul majorității serverelor de poștă electronică impune o limită strictă de 25 MB per mesaj." />

        {qLimitAnswer && (
          <AnswerExplanation
            isCorrect={qLimitAnswer === '25mb'}
            explanation={
              qLimitAnswer === '25mb'
                ? 'Corect! Limita standard este de 25 MB. Pentru fișiere mai mari se utilizează servicii de stocare în Cloud.'
                : 'Greșit. Limita standard pentru atașamente directe este de 25 MB.'
            }
          />
        )}
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isAllComplete}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(45);
        }}
        nextLabel={isEn ? 'Next: Netiquette Master ➜' : 'Următorul: Maestrul Netichetei Digitale ➜'}
      />
    </div>
  );
};
