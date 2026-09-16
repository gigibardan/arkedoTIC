import React, { useState } from 'react';
import { Copy, Edit3, Info, CheckCircle2, ChevronRight, FileText, Sparkles, HelpCircle } from 'lucide-react';
import { TeacherTip } from './TeacherTip';
import { sounds } from '../utils/audio';

interface Level4Props {
  onComplete: () => void;
}

export const Level4_CopyRenameProps: React.FC<Level4Props> = ({ onComplete }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [renamedName, setRenamedName] = useState<string>('test1.txt');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [hasRenamedWithF2, setHasRenamedWithF2] = useState<boolean>(false);
  const [showProperties, setShowProperties] = useState<boolean>(false);
  const [extensionAnswer, setExtensionAnswer] = useState<string | null>(null);

  const handleCopy = () => {
    sounds.playCorrect();
    setCopied(true);
  };

  const handleStartRename = () => {
    sounds.playClick();
    setIsRenaming(true);
  };

  const handleSaveRename = () => {
    if (renamedName.trim().length > 0 && renamedName !== 'test1.txt') {
      sounds.playCorrect();
      setIsRenaming(false);
      setHasRenamedWithF2(true);
    } else {
      sounds.playWrong();
    }
  };

  const handleAnswerExtension = (ans: string) => {
    setExtensionAnswer(ans);
    if (ans === 'type_program') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isLevelCompleted =
    copied && hasRenamedWithF2 && showProperties && extensionAnswer === 'type_program';

  const handleFinish = () => {
    sounds.playLevelUp();
    onComplete();
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Title & Mission Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-5">
        <div>
          <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs uppercase tracking-wider border border-purple-500/30">
            Nivelul 4 din 5 • Copiere, Redenumire & Extensii
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
            Copierea, Tasta F2 și Secretele Extensiilor 🔍
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            Conform manualului (paginile 28 și 30), copierea creează o dublură de siguranță, tasta rapidă <strong className="text-purple-300">F2</strong> redenumește fișierul,
            iar extensia (.txt, .docx, .jpg) indică tipul fișierului și programul cu care se deschide!
          </p>
        </div>
        <div className="hidden sm:flex text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-purple-400">
          📑
        </div>
      </div>

      {/* Teacher Tip from Textbook (p. 28 & 30) */}
      <TeacherTip
        title="Ce ne arată extensia unui fișier? (Manual pag. 28 & 30)"
        tip="• Extensia este compusă din 3 sau 4 litere după punct (ex: .docx pentru text Word, .jpg pentru imagini, .mp3 pentru sunet). Ea îi spune calculatorului cu ce program să deschidă fișierul! • Tasta F2 este scurtătura secretă de la tastatură pentru Redenumire (Rename)! • În fereastra de Proprietăți (Properties, Fig. 3) aflăm dimensiunea exactă pe disc a fișierului!"
        bookPage="28 și 30"
        extraAdvice="Când redenumești un fișier, ai grijă să nu îi ștergi extensia de după punct, altfel Windows nu va mai ști cu ce program să îl deschidă!"
      />

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Step A: Copy & Rename simulator */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                📁 Folderul "Teme"
              </span>
              <span className="text-[11px] text-purple-400 font-mono">
                {copied ? '2 fișiere' : '1 fișier'}
              </span>
            </div>

            <div className="space-y-3">
              {/* Original file */}
              <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="font-mono text-sm font-bold text-white">test1.txt</div>
                    <div className="text-xs text-slate-400">Document Text • 12 KB</div>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  disabled={copied}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                    copied
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/50 cursor-default'
                      : 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? '✓ Copiat (Ctrl+C/V)' : 'Copiază (Ctrl+C / Ctrl+V)'}</span>
                </button>
              </div>

              {/* Copied File (ready for rename with F2) */}
              {copied && (
                <div className="p-3.5 rounded-xl bg-purple-950/40 border-2 border-purple-500/70 flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-8 h-8 text-purple-400 shrink-0" />
                    <div className="flex-1">
                      {isRenaming ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={renamedName}
                            onChange={(e) => setRenamedName(e.target.value)}
                            className="bg-slate-950 border border-purple-400 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-400 w-44"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveRename}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono"
                          >
                            Enter ↵
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="font-mono text-sm font-bold text-purple-200 flex items-center gap-2">
                            {renamedName}
                            {hasRenamedWithF2 && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className="text-xs text-purple-300/80">
                            {hasRenamedWithF2
                              ? '✓ Redenumit cu succes!'
                              : 'Apasă tasta F2 pentru redenumire!'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isRenaming && (
                    <button
                      onClick={handleStartRename}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-750 text-purple-300 border border-purple-500/40 transition flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{hasRenamedWithF2 ? 'Modifică (F2)' : 'Tasta F2 (Rename)'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            {copied && !hasRenamedWithF2 && (
              <span className="text-amber-300 font-semibold">
                👉 Pasul următor: Apasă butonul „Tasta F2 (Rename)” și dă fișierului numele <strong>proiect_secret.txt</strong>!
              </span>
            )}
            {hasRenamedWithF2 && (
              <span className="text-emerald-400 font-semibold">
                ✓ Super! Fișierul a fost duplicat și redenumit!
              </span>
            )}
          </div>
        </div>

        {/* Step B: Properties inspection & Extension quiz */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                🔍 Fereastra de Proprietăți (Properties, Fig. 3)
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowProperties(!showProperties);
                }}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showProperties ? 'Ascunde Proprietăți' : 'Deschide Proprietăți'}</span>
              </button>
            </div>

            {showProperties ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-slate-300 border-b border-slate-800 pb-1.5 font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Proprietăți: {renamedName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Tip fișier:</span>
                  <span className="text-emerald-400 font-bold">Document Text (.txt)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Se deschide cu:</span>
                  <span className="text-cyan-300">Notepad (Bloc-notes)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Dimensiune pe disc:</span>
                  <span className="text-amber-300 font-bold">12.0 KB (12,288 octeți)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Creat la data:</span>
                  <span className="text-slate-300">{new Date().toLocaleDateString('ro-RO')}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                Apasă pe butonul „Deschide Proprietăți” pentru a examina fișa tehnică a fișierului conform manualului pag. 28!
              </div>
            )}

            {/* Extension question from manual p. 30 ex. 2 */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Exercițiul 2 din manual (pag. 30):
              </h4>
              <p className="text-xs text-slate-300 mb-2.5">
                Ce indică literele de după punct (extensia fișierului, de exemplu .txt sau .jpg)?
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => handleAnswerExtension('type_program')}
                  className={`w-full p-2.5 rounded-xl text-xs text-left transition ${
                    extensionAnswer === 'type_program'
                      ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300'
                  }`}
                >
                  <span>A) Tipul de date pe care le conține și programul cu care se deschide</span>
                  {extensionAnswer === 'type_program' && (
                    <span className="text-emerald-400 ml-2 font-bold">✓ Corect!</span>
                  )}
                </button>

                <button
                  onClick={() => handleAnswerExtension('size_only')}
                  className={`w-full p-2.5 rounded-xl text-xs text-left transition ${
                    extensionAnswer === 'size_only'
                      ? 'bg-rose-950/70 border border-rose-500 text-rose-300'
                      : 'bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300'
                  }`}
                >
                  <span>B) Numărul de pagini al documentului</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400">
          Recompensă: <span className="text-amber-400 font-bold">+20 Puncte</span> și insigna <span className="text-purple-400 font-bold">Detectiv Fișiere</span>
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`px-7 py-3 rounded-2xl font-bold font-heading text-sm transition transform flex items-center gap-2 shadow-lg ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white hover:scale-105 cursor-pointer shadow-purple-500/25'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Finalizează Nivelul 4</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
