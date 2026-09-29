import React, { createContext, useContext, useState, useEffect } from 'react';
import { EquippedItems, ShopCategory } from '../types';
import { DEFAULT_EQUIPPED } from '../lib/shopCatalog';
import { getActiveStudent } from '../lib/studentAuthService';

interface ThemeContextType {
  equipped: EquippedItems;
  setEquipped: React.Dispatch<React.SetStateAction<EquippedItems>>;
  updateEquippedItem: (category: ShopCategory, itemId: string) => void;
  theme: string;
  themeClass: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_EQUIPPED_KEY = 'arkedo_equipped_items';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipped, setEquipped] = useState<EquippedItems>(() => {
    try {
      const active = getActiveStudent();
      if (active?.equipped) {
        return active.equipped;
      }
      const saved = localStorage.getItem(LOCAL_EQUIPPED_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return DEFAULT_EQUIPPED;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_EQUIPPED_KEY, JSON.stringify(equipped));
    } catch {
      // Ignore
    }
  }, [equipped]);

  const updateEquippedItem = (category: ShopCategory, itemId: string) => {
    setEquipped((prev) => {
      let next = { ...prev };
      if (category === 'arky_skin') {
        next.arkySkin = itemId.replace('skin_', '');
      } else if (category === 'theme') {
        next.theme = itemId.replace('theme_', '');
      } else if (category === 'title') {
        next.title = itemId.replace('title_', '');
      } else if (category === 'avatar_frame') {
        next.avatarFrame = itemId.replace('frame_', '');
      }
      try {
        localStorage.setItem(LOCAL_EQUIPPED_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Compute theme CSS class
  const getThemeClass = (t: string) => {
    switch (t) {
      case 'matrix':
        return 'theme-matrix bg-black text-emerald-100 selection:bg-emerald-500 selection:text-black';
      case 'synthwave':
        return 'theme-synthwave bg-slate-950 text-pink-100 selection:bg-pink-500 selection:text-white';
      case 'win98':
        return 'theme-win98 bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white';
      case 'emerald':
        return 'theme-emerald bg-emerald-950 text-emerald-50 selection:bg-emerald-400 selection:text-slate-950';
      case 'nebula':
        return 'theme-nebula bg-slate-950 text-sky-100 selection:bg-cyan-500 selection:text-white';
      case 'sunset':
        return 'theme-sunset bg-slate-950 text-amber-100 selection:bg-amber-400 selection:text-slate-950';
      default:
        return 'theme-default bg-slate-900 text-slate-100 selection:bg-teal-500 selection:text-white';
    }
  };

  const themeClass = getThemeClass(equipped.theme);

  return (
    <ThemeContext.Provider
      value={{
        equipped,
        setEquipped,
        updateEquippedItem,
        theme: equipped.theme,
        themeClass,
      }}
    >
      <div className={`min-h-screen transition-colors duration-500 ${themeClass}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      equipped: DEFAULT_EQUIPPED,
      setEquipped: () => {},
      updateEquippedItem: () => {},
      theme: 'default',
      themeClass: 'theme-default bg-slate-900 text-slate-100 selection:bg-teal-500 selection:text-white',
    };
  }
  return ctx;
};
