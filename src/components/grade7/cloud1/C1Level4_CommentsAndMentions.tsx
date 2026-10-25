import React, { useState, useEffect } from 'react';
import { MessageSquare, AtSign, Check, X, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, UserPlus, Eye, CornerDownRight } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface C1Level4Props {
  onPass: (score: number) => void;
}

export const C1Level4_CommentsAndMentions: React.FC<C1Level4Props> = ({ onPass }) => {
  // Simulator State: Comments & Suggestions Workflow
  const [isComment1Resolved, setIsComment1Resolved] = useState<boolean>(false);
  const [commentReplyText, setCommentReplyText] = useState<string>('');
  const [isReplySubmitted, setIsReplySubmitted] = useState<boolean>(false);

  // Suggestion: 1930 -> 1935
  const [isYearSuggestionAccepted, setIsYearSuggestionAccepted] = useState<boolean>(false);
  const [documentMode, setDocumentMode] = useState<'editing' | 'suggesting'>('suggesting');

  // Quiz questions state with 5s cooldown
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q1ErrorMsg, setQ1ErrorMsg] = useState<string>('');

  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q2ErrorMsg, setQ2ErrorMsg] = useState<string>('');

  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);
  const [q3ErrorMsg, setQ3ErrorMsg] = useState<string>('');

  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ2Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ3Cooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendReply = () => {
    if (!commentReplyText.trim()) return;
    setIsReplySubmitted(true);
    sounds.playCorrect();
  };

  const handleResolveComment1 = () => {
    setIsComment1Resolved(true);
    sounds.playCorrect();
  };

  const handleAcceptSuggestion = () => {
    setIsYearSuggestionAccepted(true);
    sounds.playCorrect();
  };

  const handleCheckQ1 = (choice: string) => {
    if (q1Cooldown > 0) return;
    setQ1Answer(choice);
    if (choice === 'B') {
      sounds.playCorrect();
      setQ1ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ1Cooldown(5);
      setQ1ErrorMsg('Incorect! Mențiunea cu @ trimite o notificare directă colegului și îl poate desemna oficial responsabil pentru rezolvarea sarcinii.');
    }
  };

  const handleCheckQ2 = (choice: string) => {
    if (q2Cooldown > 0) return;
    setQ2Answer(choice);
    if (choice === 'A') {
      sounds.playCorrect();
      setQ2ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ2Cooldown(5);
      setQ2ErrorMsg('Incorect! Modul „Sugestii” marchează modificările vizibil (text tăiat / text colorat), lăsând proprietarului decizia de acceptare sau respingere.');
    }
  };

  const handleCheckQ3 = (choice: string) => {
    if (q3Cooldown > 0) return;
    setQ3Answer(choice);
    if (choice === 'C') {
      sounds.playCorrect();
      setQ3ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ3Cooldown(5);
      setQ3ErrorMsg('Incorect! Comentariile rezolvate dispar de pe marginea vizibilă, dar rămân arhivate în istoricul de comentarii pentru trasabilitate.');
    }
  };

  const isWorkflowCompleted = isComment1Resolved && isReplySubmitted && isYearSuggestionAccepted;
  const allAnsweredCorrectly = q1Answer === 'B' && q2Answer === 'A' && q3Answer === 'C';

  const handleFinishLevel = () => {
    if (!allAnsweredCorrectly || !isWorkflowCompleted) return;
    setIsPassed(true);
    sounds.playLevelComplete();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-emerald-950/80 border border-teal-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">Nivelul 4 • Manual Art Klett pag. 52–55</span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Comentarii, Mențiuni @, Atribuire de Sarcini & Modul Sugestii
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Învață cum să colaborezi ca un profesionist: cum se adresează sarcini punctuale prin <strong>@mențiuni</strong>, cum se rezolvă comentariile și de ce <strong>modul Sugestii (Suggesting)</strong> este mult mai sigur decât editarea directă când faci corectură colegilor.
        </p>
      </div>

      {/* Simulator: Interactive Google Docs Comments & Suggestions Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <AtSign className="w-5 h-5 text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Atelier Interactiv: Rezolvă Task-urile & Aprobă Sugestiile
            </h3>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Mod Document:</span>
            <button
              onClick={() => {
                setDocumentMode('suggesting');
                sounds.playClick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                documentMode === 'suggesting'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🟢 Sugestii (Suggesting)
            </button>
            <button
              onClick={() => {
                setDocumentMode('editing');
                sounds.playClick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                documentMode === 'editing'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ✏️ Editare (Editing)
            </button>
          </div>
        </div>

        {/* Main Document & Sidebar Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Content on Left 2 Cols */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 text-xs sm:text-sm">
            <h4 className="font-bold text-white text-base border-b border-slate-800 pb-2">
              Capitolul 1: Istoric & Date Geografice Retezat
            </h4>

            <p className="text-slate-300 leading-relaxed font-sans">
              Parcul Național Retezat este o arie protejată de interes național, situată în județul Hunedoara. Acesta a fost înființat oficial în{' '}
              {isYearSuggestionAccepted ? (
                <span className="bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/50">
                  anul 1935
                </span>
              ) : (
                <span className="bg-amber-950/80 text-amber-200 border-b-2 border-amber-400 px-1 py-0.5 rounded">
                  <span className="line-through text-rose-400 mr-1">anul 1930</span>
                  <span className="text-emerald-400 font-bold">anul 1935</span>
                </span>
              )}{' '}
              prin eforturile profesorului Alexandru Borza și ale savantului Emil Racoviță.
            </p>

            <p className="text-slate-300 leading-relaxed font-sans">
              Masivul muntos adăpostește peste 50 de lacuri glaciare permanente, fiind renumit pentru puritatea apelor și peisajul alpin spectaculos.
              <span className={`ml-1 px-1 py-0.5 rounded ${isComment1Resolved ? 'text-slate-400' : 'bg-teal-950/90 text-teal-200 border-b-2 border-teal-400'}`}>
                [Bibliografie necesară: Raportul Academiei Române 1935]
              </span>
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Scurtătură adăugare comentariu: <strong>Ctrl + Alt + M</strong></span>
              <span>Stare: {documentMode === 'suggesting' ? 'Mod Sugestii Activ' : 'Mod Editare Activ'}</span>
            </div>
          </div>

          {/* Comment & Suggestion Cards on Right Col */}
          <div className="flex flex-col gap-4">
            {/* Task Card 1: Maria's @mention task */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isComment1Resolved
                  ? 'bg-slate-950/60 border-slate-800 opacity-60'
                  : 'bg-teal-950/30 border-teal-500/60 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center">
                    M
                  </div>
                  <span className="text-xs font-bold text-white">Maria Popescu</span>
                </div>
                {isComment1Resolved ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Rezolvat
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/40">
                    Sarcină Atribuită
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 mb-3">
                <strong className="text-teal-400 font-mono">@Tu</strong> Te rog verifică și adaugă referința oficială despre anul înființării în bibliografie!
              </p>

              {!isReplySubmitted ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={commentReplyText}
                    onChange={(e) => setCommentReplyText(e.target.value)}
                    placeholder="Răspunde-i Mariei (ex: Am verificat și am adăugat sursa)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!commentReplyText.trim()}
                    className="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer self-end"
                  >
                    Răspunde
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-[11px] bg-slate-900/90 p-2 rounded-xl text-slate-300 border border-slate-800 flex items-start gap-1.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                    <span>Tu: {commentReplyText}</span>
                  </div>

                  {!isComment1Resolved && (
                    <button
                      onClick={handleResolveComment1}
                      className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Marchează ca Rezolvat (Resolve)</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Task Card 2: Andrei's Suggestion */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isYearSuggestionAccepted
                  ? 'bg-slate-950/60 border-slate-800 opacity-60'
                  : 'bg-emerald-950/30 border-emerald-500/60 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                    A
                  </div>
                  <span className="text-xs font-bold text-white">Andrei (Sugestie)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300">
                  {isYearSuggestionAccepted ? 'Acceptată ✓' : 'În așteptare'}
                </span>
              </div>

              <div className="text-xs text-slate-300 mb-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                Înlocuiește <code className="text-rose-400 line-through">„anul 1930”</code> cu{' '}
                <code className="text-emerald-400 font-bold">„anul 1935”</code>.
              </div>

              {!isYearSuggestionAccepted ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAcceptSuggestion}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acceptă</span>
                  </button>
                  <button
                    onClick={() => sounds.playWrong()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs transition flex items-center justify-center cursor-pointer"
                    title="Respinge sugestia"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sugestia a fost integrată în document!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Section with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Verificare Noțiuni: Comentarii & Sugestii (3 Întrebări Interactive)
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">Întrebarea 1 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Ce efect produce menționarea unui coleg folosind simbolul @ (de exemplu @Andrei) într-un comentariu?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Îi blochează accesul la internet pentru 24 de ore' },
              { id: 'B', text: 'Îi trimite o notificare pe e-mail și îi atribuie direct acea sarcină spre rezolvare' },
              { id: 'C', text: 'Șterge automat paragraful selectat' }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q1Cooldown > 0}
                onClick={() => handleCheckQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'B'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q1Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q1Cooldown}s până la următoarea încercare. {q1ErrorMsg}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">Întrebarea 2 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Care este principalul avantaj al modului „Sugestii” (Suggesting) atunci când corectezi referatul unui coleg?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Modificările apar colorate și tăiate, iar autorul poate decide cu un clic dacă le acceptă sau le respinge' },
              { id: 'B', text: 'Sugestiile nu pot fi văzute de profesor niciodată' },
              { id: 'C', text: 'Textul se transformă automat în fișier audio MP3' }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q2Cooldown > 0}
                onClick={() => handleCheckQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'A'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q2Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q2Cooldown}s până la următoarea încercare. {q2ErrorMsg}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">Întrebarea 3 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Ce se întâmplă cu o discuție dintr-un comentariu după ce apeși pe butonul de marcare „Rezolvă” (Resolve)?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Se șterge definitiv de pe server fără nicio urmă' },
              { id: 'B', text: 'Documentul se blochează în modul Numai Citire' },
              { id: 'C', text: 'Dispare de pe marginea activă a paginii, dar rămâne salvat în istoricul de comentarii' }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q3Cooldown > 0}
                onClick={() => handleCheckQ3(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'C'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q3Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q3Cooldown}s până la următoarea încercare. {q3ErrorMsg}
            </div>
          )}
        </div>

        {/* Pass Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {isWorkflowCompleted && allAnsweredCorrectly ? (
              <span className="text-teal-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Task-urile au fost rezolvate și testul este promovat!
              </span>
            ) : (
              <span>Răspunde-i Mariei, rezolvă comentariul, acceptă sugestia lui Andrei și rezolvă testul.</span>
            )}
          </div>

          <button
            onClick={handleFinishLevel}
            disabled={!isWorkflowCompleted || !allAnsweredCorrectly || isPassed}
            className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              isWorkflowCompleted && allAnsweredCorrectly && !isPassed
                ? 'bg-teal-600 hover:bg-teal-500 text-white font-black shadow-lg shadow-teal-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Finalizează Nivelul 4 (+100 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
