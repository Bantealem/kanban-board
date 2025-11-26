import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from '../constants';

const STORAGE_KEY_LANGUAGE = 'kanban-lang';
const STORAGE_KEY_THEME = 'kanban-theme';

const UiContext = createContext(null);

const getStoredValue = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(key);
  return stored || fallback;
};

export const UiProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => getStoredValue(STORAGE_KEY_LANGUAGE, DEFAULT_LANGUAGE));
  const [theme, setTheme] = useState(() => getStoredValue(STORAGE_KEY_THEME, DEFAULT_THEME));

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY_LANGUAGE, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      theme,
      toggleLanguage: () => setLanguage((prev) => (prev === 'en' ? 'it' : 'en')),
      toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [language, theme]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error('useUi must be used within UiProvider');
  }
  return context;
};

