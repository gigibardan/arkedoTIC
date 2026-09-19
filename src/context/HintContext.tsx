import React, { createContext, useContext, useState, useEffect } from 'react';

interface HintContextType {
  usedHints: Set<string>;
  hintsCount: number;
  useHint: (hintId: string) => void;
  resetHints: () => void;
}

const HintContext = createContext<HintContextType | undefined>(undefined);

export const HintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usedHints, setUsedHints] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('arkedo_hints_used');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
    return new Set<string>();
  });

  useEffect(() => {
    try {
      localStorage.setItem('arkedo_hints_used', JSON.stringify(Array.from(usedHints)));
    } catch {
      // Ignore
    }
  }, [usedHints]);

  const useHint = (hintId: string) => {
    setUsedHints((prev) => {
      const next = new Set(prev);
      next.add(hintId);
      return next;
    });
  };

  const resetHints = () => {
    setUsedHints(new Set());
    try {
      localStorage.removeItem('arkedo_hints_used');
    } catch {
      // Ignore
    }
  };

  return (
    <HintContext.Provider
      value={{
        usedHints,
        hintsCount: usedHints.size,
        useHint,
        resetHints,
      }}
    >
      {children}
    </HintContext.Provider>
  );
};

export const useHints = (): HintContextType => {
  const context = useContext(HintContext);
  if (!context) {
    return {
      usedHints: new Set(),
      hintsCount: 0,
      useHint: () => {},
      resetHints: () => {},
    };
  }
  return context;
};
