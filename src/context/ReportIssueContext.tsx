import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { IssueCategory } from '../lib/contactReportService';

export interface ReportPageContextState {
  view: string;
  activeMission: string | null;
  currentLevel: number;
  currentScore: number;
  studentName: string;
  lang: 'ro' | 'en';
}

export interface OpenReportOptions {
  contextLabel?: string;
  missionId?: string | null;
  level?: number | null;
  score?: number | null;
  defaultCategory?: IssueCategory;
  prefillSubject?: string;
  prefillDescription?: string;
  overrideUrl?: string;
  originUrl?: string;
}

interface ReportIssueContextValue {
  isOpen: boolean;
  pageState: ReportPageContextState;
  modalOptions: OpenReportOptions;
  openReportModal: (options?: OpenReportOptions) => void;
  closeReportModal: () => void;
  syncPageState: (next: Partial<ReportPageContextState>) => void;
}

const DEFAULT_PAGE_STATE: ReportPageContextState = {
  view: 'catalog',
  activeMission: null,
  currentLevel: 1,
  currentScore: 0,
  studentName: '',
  lang: 'ro',
};

const ReportIssueContext = createContext<ReportIssueContextValue>({
  isOpen: false,
  pageState: DEFAULT_PAGE_STATE,
  modalOptions: {},
  openReportModal: () => {},
  closeReportModal: () => {},
  syncPageState: () => {},
});

export const useReportIssue = () => useContext(ReportIssueContext);

export const OPEN_REPORT_ISSUE_EVENT = 'arkyedu:open-report';

export function triggerReportIssueModal(options?: OpenReportOptions): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<OpenReportOptions>(OPEN_REPORT_ISSUE_EVENT, { detail: options || {} }));
}

export const ReportIssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageState, setPageState] = useState<ReportPageContextState>(DEFAULT_PAGE_STATE);
  const [modalOptions, setModalOptions] = useState<OpenReportOptions>({});

  const openReportModal = useCallback((options: OpenReportOptions = {}) => {
    setModalOptions(options);
    setIsOpen(true);
  }, []);

  const closeReportModal = useCallback(() => {
    setIsOpen(false);
    setModalOptions({});
    try {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#raporteaza' || hash === '#report' || hash === '#report-issue') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        const params = new URLSearchParams(window.location.search);
        if (params.has('report') || params.has('from')) {
          params.delete('report');
          params.delete('from');
          const nextSearch = params.toString();
          window.history.replaceState(
            null,
            '',
            window.location.pathname + (nextSearch ? `?${nextSearch}` : '') + window.location.hash
          );
        }
      }
    } catch {
      // Ignore URL cleanup errors
    }
  }, []);

  const syncPageState = useCallback((next: Partial<ReportPageContextState>) => {
    setPageState((prev) => {
      if (
        (next.view === undefined || next.view === prev.view) &&
        (next.activeMission === undefined || next.activeMission === prev.activeMission) &&
        (next.currentLevel === undefined || next.currentLevel === prev.currentLevel) &&
        (next.currentScore === undefined || next.currentScore === prev.currentScore) &&
        (next.studentName === undefined || next.studentName === prev.studentName) &&
        (next.lang === undefined || next.lang === prev.lang)
      ) {
        return prev;
      }
      return { ...prev, ...next };
    });
  }, []);

  // Support global custom event & URL shortcuts (?report=1&from=... or #raporteaza / #report)
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenReportOptions>).detail;
      openReportModal(detail || {});
    };

    const checkUrlTriggers = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const hash = window.location.hash.toLowerCase();
        const shouldOpen =
          params.get('report') === '1' ||
          params.get('report') === 'true' ||
          hash === '#raporteaza' ||
          hash === '#report' ||
          hash === '#report-issue';

        if (shouldOpen) {
          const fromParam = params.get('from');
          const ctxParam = params.get('ctx');
          openReportModal({
            originUrl: fromParam || undefined,
            contextLabel: ctxParam || undefined,
          });
        }
      } catch {
        // Ignore URL parse errors
      }
    };

    checkUrlTriggers();
    window.addEventListener(OPEN_REPORT_ISSUE_EVENT, handleCustomOpen);
    window.addEventListener('hashchange', checkUrlTriggers);
    return () => {
      window.removeEventListener(OPEN_REPORT_ISSUE_EVENT, handleCustomOpen);
      window.removeEventListener('hashchange', checkUrlTriggers);
    };
  }, [openReportModal]);

  return (
    <ReportIssueContext.Provider
      value={{
        isOpen,
        pageState,
        modalOptions,
        openReportModal,
        closeReportModal,
        syncPageState,
      }}
    >
      {children}
    </ReportIssueContext.Provider>
  );
};
