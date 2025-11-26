import { useEffect, useState } from 'react';
import KanbanBoard from './components/KanbanBoard';
import { UiProvider, useUi } from './context/UiContext';
import { COLUMN_ORDER, TRANSLATIONS } from './constants';

const AppShell = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMobileColumn, setActiveMobileColumn] = useState('todo');
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const { language, theme, toggleLanguage, toggleTheme } = useUi();
  const dictionary = TRANSLATIONS[language];
  const { header, buttons } = dictionary;
  const themeButtonLabel = theme === 'dark' ? buttons.themeLight : buttons.themeDark;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleLanguageClick = () => {
    toggleLanguage();
    setIsMenuOpen(false);
  };

  const handleThemeClick = () => {
    toggleTheme();
    setIsMenuOpen(false);
  };

  const nextLanguage = language === 'en' ? 'it' : 'en';
  const languageIndicator =
    nextLanguage === 'it' ? (
      <span className="text-lg" role="img" aria-hidden="true">
        🇮🇹
      </span>
    ) : (
      <span className="text-xs font-extrabold tracking-wide">EN</span>
    );

  const handleColumnSelect = (columnId) => {
    setActiveMobileColumn(columnId);
    setIsMenuOpen(false);
  };

  const ThemeIcon = () =>
    theme === 'dark' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314 1.414 1.414m11.314 11.314-1.414-1.414" />
      </svg>
    );

  const ActionButtons = ({ variant = 'desktop' }) => (
    <>
      <button
        type="button"
        onClick={handleLanguageClick}
        aria-label={buttons.languageToggle}
        className={`flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-700 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-100 dark:hover:border-indigo-400 ${
          variant === 'mobile' ? 'w-full gap-2 px-4 py-3 text-left' : 'w-10 h-10'
        }`}
      >
        {languageIndicator}
        {variant === 'mobile' && <span className="text-sm font-semibold">{buttons.languageToggle}</span>}
      </button>
      <button
        type="button"
        onClick={handleThemeClick}
        aria-label={themeButtonLabel}
        className={`flex items-center justify-center rounded-full bg-indigo-500 p-2 text-white transition hover:bg-indigo-400 dark:bg-indigo-400 dark:text-slate-900 dark:hover:bg-indigo-300 ${
          variant === 'mobile' ? 'w-full gap-2 px-4 py-3' : 'w-10 h-10'
        }`}
      >
        <ThemeIcon />
        {variant === 'mobile' && <span className="text-sm font-semibold">{themeButtonLabel}</span>}
      </button>
    </>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-500 dark:text-indigo-300">
              {header.eyebrow}
            </p>
            <h1 className="text-3xl font-bold">{header.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{header.subtitle}</p>
          </div>

          <div className="hidden gap-3 md:flex">
            <ActionButtons />
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-100 dark:hover:border-indigo-400"
              aria-label={buttons.menu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M4 8h16M4 16h16" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12h8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {COLUMN_ORDER.map((id) => {
                    const isActive = activeMobileColumn === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleColumnSelect(id)}
                        className={`rounded-xl border px-3 py-2 text-left transition ${
                          isActive
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {dictionary.columns[id]}
                      </button>
                    );
                  })}
                </nav>
                <div className="border-t border-slate-200 dark:border-slate-700" />
                <ActionButtons variant="mobile" />
              </div>
            )}
          </div>
        </header>

        <KanbanBoard activeColumn={isMobile ? activeMobileColumn : null} />
      </div>
    </main>
  );
};

const App = () => (
  <UiProvider>
    <AppShell />
  </UiProvider>
);

export default App;
