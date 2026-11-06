import React, { useState, useEffect } from 'react';
import { MessageSquare, AtSign, Check, X, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, UserPlus, Eye, CornerDownRight } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface C1Level4Props {
  onPass: (score: number) => void;
}

export const C1Level4_CommentsAndMentions: React.FC<C1Level4Props> = ({ onPass }) => {
  const { lang } = useLanguage();

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
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Mențiunea cu @ trimite o notificare directă colegului și îl poate desemna oficial responsabil pentru rezolvarea sarcinii.'
          : 'Incorrect! An @mention sends a direct notification to your teammate and can formally assign the task to them for follow-up.'
      );
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
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Modul „Sugestii” marchează modificările vizibil (text tăiat / text colorat), lăsând proprietarului decizia de acceptare sau respingere.'
          : 'Incorrect! Suggesting mode visually distinguishes edits (strikethrough / colored additions), leaving acceptance or rejection to the document owner.'
      );
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
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Comentariile rezolvate dispar de pe marginea vizibilă, dar rămân arhivate în istoricul de comentarii pentru trasabilitate.'
          : 'Incorrect! Resolved comments clear from the active margin gutter, but remain safely archived in comment history for full audit trail.'
      );
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
              {lang === 'ro'
                ? 'Nivelul 4 • Manual Art Klett pag. 52–55'
                : 'Level 4 • Art Klett Textbook pp. 52–55'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Comentarii, Mențiuni @, Atribuire de Sarcini & Modul Sugestii'
                : 'Comments, @Mentions, Task Assignment & Suggesting Mode'}
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Învață cum să colaborezi ca un profesionist: cum se adresează sarcini punctuale prin <strong>@mențiuni</strong>, cum se rezolvă comentariile și de ce <strong>modul Sugestii (Suggesting)</strong> este mult mai sigur decât editarea directă când faci corectură colegilor.
            </>
          ) : (
            <>
              Master professional editorial workflows: how to assign action items with <strong>@mentions</strong>, how to resolve comment threads, and why <strong>Suggesting mode</strong> is far safer than direct overwriting when reviewing peer contributions.
            </>
          )}
        </p>
      </div>

      {/* Simulator: Interactive Google Docs Comments & Suggestions Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <AtSign className="w-5 h-5 text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'ro'
                ? 'Atelier Interactiv: Rezolvă Task-urile & Aprobă Sugestiile'
                : 'Interactive Workshop: Action Tasks & Accept Suggestions'}
            </h3>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Mod Document:' : 'Document Mode:'}
            </span>
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
              {lang === 'ro' ? '🟢 Sugestii (Suggesting)' : '🟢 Suggesting'}
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
              {lang === 'ro' ? '✏️ Editare (Editing)' : '✏️ Editing'}
            </button>
          </div>
        </div>

        {/* Main Document & Sidebar Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Content on Left 2 Cols */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 text-xs sm:text-sm">
            <h4 className="font-bold text-white text-base border-b border-slate-800 pb-2">
              {lang === 'ro'
                ? 'Capitolul 1: Istoric & Date Geografice Retezat'
                : 'Chapter 1: History & Geographic Context of Retezat'}
            </h4>

            <p className="text-slate-300 leading-relaxed font-sans">
              {lang === 'ro' ? (
                <>
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
                </>
              ) : (
                <>
                  Retezat National Park is a protected area in Hunedoara County. It was formally established in{' '}
                  {isYearSuggestionAccepted ? (
                    <span className="bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/50">
                      the year 1935
                    </span>
                  ) : (
                    <span className="bg-amber-950/80 text-amber-200 border-b-2 border-amber-400 px-1 py-0.5 rounded">
                      <span className="line-through text-rose-400 mr-1">the year 1930</span>
                      <span className="text-emerald-400 font-bold">the year 1935</span>
                    </span>
                  )}{' '}
                  through the dedicated advocacy of Professor Alexandru Borza and scientist Emil Racovita.
                </>
              )}
            </p>

            <p className="text-slate-300 leading-relaxed font-sans">
              {lang === 'ro' ? (
                <>
                  Masivul muntos adăpostește peste 50 de lacuri glaciare permanente, fiind renumit pentru puritatea apelor și peisajul alpin spectaculos.
                  <span className={`ml-1 px-1 py-0.5 rounded ${isComment1Resolved ? 'text-slate-400' : 'bg-teal-950/90 text-teal-200 border-b-2 border-teal-400'}`}>
                    [Bibliografie necesară: Raportul Academiei Române 1935]
                  </span>
                </>
              ) : (
                <>
                  The mountain massif protects over 50 permanent glacial tarns, renowned for water clarity and pristine alpine panoramas.
                  <span className={`ml-1 px-1 py-0.5 rounded ${isComment1Resolved ? 'text-slate-400' : 'bg-teal-950/90 text-teal-200 border-b-2 border-teal-400'}`}>
                    [Citation Needed: Romanian Academy Proceedings 1935]
                  </span>
                </>
              )}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>
                {lang === 'ro' ? 'Scurtătură adăugare comentariu:' : 'Add comment shortcut:'}{' '}
                <strong>Ctrl + Alt + M</strong>
              </span>
              <span>
                {lang === 'ro' ? 'Stare:' : 'Status:'}{' '}
                {documentMode === 'suggesting'
                  ? (lang === 'ro' ? 'Mod Sugestii Activ' : 'Suggesting Mode Active')
                  : (lang === 'ro' ? 'Mod Editare Activ' : 'Editing Mode Active')}
              </span>
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
                  <span className="text-xs font-bold text-white">
                    {lang === 'ro' ? 'Maria Popescu' : 'Maria Miller'}
                  </span>
                </div>
                {isComment1Resolved ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> {lang === 'ro' ? 'Rezolvat' : 'Resolved'}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/40">
                    {lang === 'ro' ? 'Sarcină Atribuită' : 'Assigned Task'}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 mb-3">
                <strong className="text-teal-400 font-mono">
                  {lang === 'ro' ? '@Tu' : '@You'}
                </strong>{' '}
                {lang === 'ro'
                  ? 'Te rog verifică și adaugă referința oficială despre anul înființării în bibliografie!'
                  : 'Please check and append the official citation for the founding year in our bibliography!'}
              </p>

              {!isReplySubmitted ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={commentReplyText}
                    onChange={(e) => setCommentReplyText(e.target.value)}
                    placeholder={
                      lang === 'ro'
                        ? 'Răspunde-i Mariei (ex: Am verificat și am adăugat sursa)...'
                        : 'Reply to Maria (e.g. Checked and added citation)...'
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!commentReplyText.trim()}
                    className="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer self-end"
                  >
                    {lang === 'ro' ? 'Răspunde' : 'Reply'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-[11px] bg-slate-900/90 p-2 rounded-xl text-slate-300 border border-slate-800 flex items-start gap-1.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                    <span>
                      {lang === 'ro' ? 'Tu: ' : 'You: '}
                      {commentReplyText}
                    </span>
                  </div>

                  {!isComment1Resolved && (
                    <button
                      onClick={handleResolveComment1}
                      className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'ro' ? 'Marchează ca Rezolvat (Resolve)' : 'Mark as Resolved'}</span>
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
                  <span className="text-xs font-bold text-white">
                    {lang === 'ro' ? 'Andrei (Sugestie)' : 'Andrew (Suggestion)'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300">
                  {isYearSuggestionAccepted
                    ? (lang === 'ro' ? 'Acceptată ✓' : 'Accepted ✓')
                    : (lang === 'ro' ? 'În așteptare' : 'Pending')}
                </span>
              </div>

              <div className="text-xs text-slate-300 mb-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                {lang === 'ro' ? (
                  <>
                    Înlocuiește <code className="text-rose-400 line-through">„anul 1930”</code> cu{' '}
                    <code className="text-emerald-400 font-bold">„anul 1935”</code>.
                  </>
                ) : (
                  <>
                    Replace <code className="text-rose-400 line-through">"the year 1930"</code> with{' '}
                    <code className="text-emerald-400 font-bold">"the year 1935"</code>.
                  </>
                )}
              </div>

              {!isYearSuggestionAccepted ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAcceptSuggestion}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'ro' ? 'Acceptă' : 'Accept'}</span>
                  </button>
                  <button
                    onClick={() => sounds.playWrong()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs transition flex items-center justify-center cursor-pointer"
                    title={lang === 'ro' ? 'Respinge sugestia' : 'Reject suggestion'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {lang === 'ro'
                      ? 'Sugestia a fost integrată în document!'
                      : 'Suggestion merged into document body!'}
                  </span>
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
            {lang === 'ro'
              ? 'Verificare Noțiuni: Comentarii & Sugestii (3 Întrebări Interactive)'
              : 'Knowledge Check: Comments & Suggestions (3 Interactive Questions)'}
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 1 din 3' : 'Question 1 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'Ce efect produce menționarea unui coleg folosind simbolul @ (de exemplu @Andrei) într-un comentariu?'
              : 'What effect does mentioning a peer using the @ symbol (e.g. @Andrew) inside a comment produce?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Îi blochează accesul la internet pentru 24 de ore',
                textEn: 'Blocks their internet connection for 24 hours'
              },
              {
                id: 'B',
                textRo: 'Îi trimite o notificare pe e-mail și îi atribuie direct acea sarcină spre rezolvare',
                textEn: 'Dispatches an email alert and formally assigns that actionable task to them'
              },
              {
                id: 'C',
                textRo: 'Șterge automat paragraful selectat',
                textEn: 'Deletes the selected paragraph automatically'
              }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q1Cooldown}s până la următoarea încercare. ${q1ErrorMsg}`
                : `Cooldown active: ${q1Cooldown}s until next attempt. ${q1ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 2 din 3' : 'Question 2 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'Care este principalul avantaj al modului „Sugestii” (Suggesting) atunci când corectezi referatul unui coleg?'
              : 'What is the primary advantage of "Suggesting" mode when reviewing and proofreading a teammate’s draft?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Modificările apar colorate și tăiate, iar autorul poate decide cu un clic dacă le acceptă sau le respinge',
                textEn: 'Edits appear color-coded and struck-through, letting the author accept or reject with a click'
              },
              {
                id: 'B',
                textRo: 'Sugestiile nu pot fi văzute de profesor niciodată',
                textEn: 'Suggestions are permanently invisible to the teacher'
              },
              {
                id: 'C',
                textRo: 'Textul se transformă automat în fișier audio MP3',
                textEn: 'The text is automatically converted into an MP3 audio file'
              }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q2Cooldown}s până la următoarea încercare. ${q2ErrorMsg}`
                : `Cooldown active: ${q2Cooldown}s until next attempt. ${q2ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 3 din 3' : 'Question 3 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'Ce se întâmplă cu o discuție dintr-un comentariu după ce apeși pe butonul de marcare „Rezolvă” (Resolve)?'
              : 'What happens to a comment thread when the "Resolve" checkmark is clicked?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Se șterge definitiv de pe server fără nicio urmă',
                textEn: 'It is wiped permanently from the cloud server with zero trace'
              },
              {
                id: 'B',
                textRo: 'Documentul se blochează în modul Numai Citire',
                textEn: 'The document locks into Read-Only state'
              },
              {
                id: 'C',
                textRo: 'Dispare de pe marginea activă a paginii, dar rămâne salvat în istoricul de comentarii',
                textEn: 'It disappears from the active page margin, but remains archived in comment history'
              }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q3Cooldown}s până la următoarea încercare. ${q3ErrorMsg}`
                : `Cooldown active: ${q3Cooldown}s until next attempt. ${q3ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Pass Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {isWorkflowCompleted && allAnsweredCorrectly ? (
              <span className="text-teal-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                {lang === 'ro'
                  ? 'Task-urile au fost rezolvate și testul este promovat!'
                  : 'Tasks resolved and knowledge check passed!'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde-i Mariei, rezolvă comentariul, acceptă sugestia lui Andrei și rezolvă testul.'
                  : 'Reply to Maria, resolve the comment, accept Andrew’s suggestion, and answer all questions.'}
              </span>
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
            <span>
              {lang === 'ro' ? 'Finalizează Nivelul 4 (+100 XP)' : 'Complete Level 4 (+100 XP)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
