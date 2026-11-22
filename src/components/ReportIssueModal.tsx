import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Flag,
  Send,
  CheckCircle2,
  Copy,
  Link2,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Bug,
  FileWarning,
  ZapOff,
  Lightbulb,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useReportIssue } from '../context/ReportIssueContext';
import {
  capturePageDiagnostics,
  getCategoryLabel,
  IssueCategory,
  PRIMARY_CONTACT_EMAIL,
  ReporterRole,
  submitContactOrReport,
  SubmissionResult,
} from '../lib/contactReportService';
import { sounds } from '../utils/audio';

const CATEGORIES: Array<{
  id: IssueCategory;
  icon: React.FC<{ className?: string }>;
  accentClass: string;
}> = [
  { id: 'bug', icon: Bug, accentClass: 'text-rose-400' },
  { id: 'content', icon: FileWarning, accentClass: 'text-amber-400' },
  { id: 'loading', icon: ZapOff, accentClass: 'text-orange-400' },
  { id: 'suggestion', icon: Lightbulb, accentClass: 'text-emerald-400' },
  { id: 'other', icon: HelpCircle, accentClass: 'text-cyan-400' },
];

export const ReportIssueModal: React.FC = () => {
  const { lang } = useLanguage();
  const { isOpen, pageState, modalOptions, closeReportModal } = useReportIssue();

  const [category, setCategory] = useState<IssueCategory>('bug');
  const [role, setRole] = useState<ReporterRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const diagnostics = useMemo(() => {
    if (!isOpen) return null;
    return capturePageDiagnostics({
      view: pageState.view,
      missionId: modalOptions.missionId !== undefined ? modalOptions.missionId : pageState.activeMission,
      level: modalOptions.level !== undefined ? modalOptions.level : pageState.currentLevel,
      score: modalOptions.score !== undefined ? modalOptions.score : pageState.currentScore,
      studentName: pageState.studentName,
      lang: pageState.lang || lang,
      contextLabel: modalOptions.contextLabel,
      overrideUrl: modalOptions.overrideUrl,
      originUrl: modalOptions.originUrl,
    });
  }, [isOpen, pageState, modalOptions, lang]);

  // Reset form nicely each time modal opens
  useEffect(() => {
    if (!isOpen) return;
    setCategory(modalOptions.defaultCategory || 'bug');
    setName(pageState.studentName || '');
    setSubject(modalOptions.prefillSubject || '');
    setDescription(modalOptions.prefillDescription || '');
    setIncludeDiagnostics(true);
    setShowTechDetails(false);
    setErrorMsg(null);
    setStatus('idle');
    setResult(null);
  }, [isOpen, modalOptions, pageState.studentName]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeReportModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeReportModal]);

  if (!isOpen || !diagnostics) return null;

  const linkedUrl = diagnostics.originUrl || diagnostics.url;

  const handleCopyUrl = () => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(linkedUrl).then(() => {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }).catch(() => {});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDesc = description.trim();
    if (cleanDesc.length < 5) {
      setErrorMsg(
        lang === 'en'
          ? 'Please describe the issue briefly (at least 5 characters) so we can fix it quickly.'
          : 'Te rugăm să descrii pe scurt problema (minim 5 caractere) ca să o putem rezolva rapid.'
      );
      sounds.playWrong();
      return;
    }

    setErrorMsg(null);
    setStatus('submitting');
    sounds.playClick();

    const autoSubject =
      subject.trim() ||
      `${getCategoryLabel(category, lang)} · ${diagnostics.contextLabel}`;

    const submission = await submitContactOrReport({
      kind: 'bug_report',
      name,
      email,
      role,
      subject: autoSubject,
      message: cleanDesc,
      category,
      includeDiagnostics,
      diagnostics,
    });

    setResult(submission);
    setStatus('success');
    sounds.playSuccess();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-issue-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sounds.playClick();
          closeReportModal();
        }
      }}
    >
      <div className="w-full max-w-2xl max-h-[92dvh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 pb-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              closeReportModal();
            }}
            className="absolute top-4 right-4 p-2 min-w-[40px] min-h-[40px] rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
            title={lang === 'en' ? 'Close' : 'Închide'}
            aria-label={lang === 'en' ? 'Close' : 'Închide'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="report-issue-modal-title" className="text-lg sm:text-xl font-black text-white leading-tight">
                {lang === 'en' ? 'Report an Issue' : 'Raportează o problemă'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {lang === 'en'
                  ? `Sent directly by email to ${PRIMARY_CONTACT_EMAIL} with this page URL linked.`
                  : `Se trimite direct pe email la ${PRIMARY_CONTACT_EMAIL}, cu URL-ul paginii atașat automat.`}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Linked Page & URL Context Box */}
          <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Link2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-emerald-300 truncate">
                  {diagnostics.contextLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTechDetails((prev) => !prev)}
                className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>{lang === 'en' ? 'Details' : 'Detalii tehnice'}</span>
                {showTechDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
              <code className="text-[11px] font-mono text-cyan-300 truncate flex-1 select-all">
                {linkedUrl}
              </code>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0 transition"
                title={lang === 'en' ? 'Copy page URL' : 'Copiază URL-ul paginii'}
              >
                {copiedUrl ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">{lang === 'en' ? 'Copied' : 'Copiat'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Copy' : 'Copiază'}</span>
                  </>
                )}
              </button>
            </div>

            {showTechDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500">View:</span>{' '}
                  <span className="text-slate-200">{diagnostics.view}</span>
                </div>
                <div>
                  <span className="text-slate-500">Viewport:</span>{' '}
                  <span className="text-slate-200">
                    {diagnostics.viewport} ({diagnostics.deviceType})
                  </span>
                </div>
                {diagnostics.missionId && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">{lang === 'en' ? 'Mission:' : 'Misiune:'}</span>{' '}
                    <span className="text-amber-300">
                      {diagnostics.missionId}
                      {typeof diagnostics.level === 'number' ? ` · Nivel ${diagnostics.level}` : ''}
                    </span>
                  </div>
                )}
                <div className="sm:col-span-2 truncate">
                  <span className="text-slate-500">Title:</span>{' '}
                  <span className="text-slate-300">{diagnostics.pageTitle}</span>
                </div>
              </div>
            )}
          </div>

          {status === 'success' ? (
            <div className="py-4 space-y-5 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {lang === 'en' ? 'Thank you! Report sent.' : 'Mulțumim! Raportul a fost trimis.'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? `Your report from "${diagnostics.contextLabel}" was forwarded with the exact page link (${linkedUrl}) to our email (${PRIMARY_CONTACT_EMAIL}).`
                    : `Raportul tău pentru „${diagnostics.contextLabel}” a fost expediat cu linkul exact al paginii (${linkedUrl}) către email-ul echipei (${PRIMARY_CONTACT_EMAIL}).`}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                {result?.mailtoUrl && (
                  <a
                    href={result.mailtoUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    <Mail className="w-4 h-4 text-teal-400" />
                    <span>{lang === 'en' ? 'Also open in Email app' : 'Deschide și în aplicația Email'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setStatus('idle');
                    setDescription('');
                    setSubject('');
                  }}
                  className="px-4 py-2.5 min-h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  {lang === 'en' ? 'Send another report' : 'Trimite alt raport'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    closeReportModal();
                  }}
                  className="px-5 py-2.5 min-h-[42px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer"
                >
                  {lang === 'en' ? 'Back to page' : 'Înapoi la pagină'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  {lang === 'en' ? '1. What kind of issue did you encounter?' : '1. Ce tip de problemă ai întâlnit?'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setCategory(cat.id);
                        }}
                        className={`p-2.5 min-h-[44px] rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                          active
                            ? 'bg-amber-500/15 border-amber-400 text-white shadow-sm'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${cat.accentClass}`} />
                        <span className="truncate">{getCategoryLabel(cat.id, lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Issue Description */}
              <div className="space-y-1.5">
                <label htmlFor="report-issue-description" className="block text-xs font-bold text-slate-300">
                  {lang === 'en' ? '2. Describe what happened *' : '2. Descrie pe scurt problema *'}
                </label>
                <textarea
                  id="report-issue-description"
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={
                    lang === 'en'
                      ? 'Example: At level 3, button X does not advance, or there is a typo in question 2...'
                      : 'Exemplu: La exercițiul 3 butonul de verificare nu răspunde, sau am observat o greșeală în text...'
                  }
                  className="w-full rounded-2xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none px-3.5 py-2.5 text-sm text-white placeholder-slate-500 resize-y"
                />
              </div>

              {/* Short Subject (Optional) */}
              <div className="space-y-1.5">
                <label htmlFor="report-issue-subject" className="block text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Short title (optional)' : 'Titlu scurt (opțional)'}
                </label>
                <input
                  id="report-issue-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? `e.g. Issue in ${diagnostics.contextLabel}`
                      : `ex. Eroare în ${diagnostics.contextLabel}`
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none px-3.5 py-2 min-h-[42px] text-sm text-white placeholder-slate-500"
                />
              </div>

              {/* Reporter Info (Role, Name, Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="report-issue-role" className="block text-xs font-bold text-slate-300">
                    {lang === 'en' ? 'Role' : 'Cine raportează'}
                  </label>
                  <select
                    id="report-issue-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as ReporterRole)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none px-3 py-2 min-h-[42px] text-xs sm:text-sm text-white"
                  >
                    <option value="student">{lang === 'en' ? 'Student' : 'Elev'}</option>
                    <option value="teacher">{lang === 'en' ? 'Teacher' : 'Profesor'}</option>
                    <option value="parent">{lang === 'en' ? 'Parent' : 'Părinte'}</option>
                    <option value="other">{lang === 'en' ? 'Visitor / Other' : 'Vizitator / Altul'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="report-issue-name" className="block text-xs font-bold text-slate-300">
                    {lang === 'en' ? 'Name (optional)' : 'Nume (opțional)'}
                  </label>
                  <input
                    id="report-issue-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'en' ? 'Your name' : 'Numele tău'}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none px-3 py-2 min-h-[42px] text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="report-issue-email" className="block text-xs font-bold text-slate-300">
                    {lang === 'en' ? 'Email for reply (optional)' : 'Email răspuns (opțional)'}
                  </label>
                  <input
                    id="report-issue-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nume@exemplu.ro"
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none px-3 py-2 min-h-[42px] text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Diagnostics Opt-in Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDiagnostics}
                  onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                  className="mt-0.5 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-400"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? 'Automatically include the current page URL, active mission/level, and screen resolution so we can reproduce the issue faster.'
                    : 'Atașează automat URL-ul paginii curente, misiunea/nivelul activ și rezoluția ecranului pentru a identifica rapid cauza.'}
                </span>
              </label>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    closeReportModal();
                  }}
                  className="px-4 py-2.5 min-h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'Renunță'}
                </button>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-60 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/15"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>
                    {status === 'submitting'
                      ? lang === 'en'
                        ? 'Sending report...'
                        : 'Se trimite raportul...'
                      : lang === 'en'
                      ? 'Send Report to Email'
                      : 'Trimite Raportul pe Email'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
