import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type FormLocale = 'ru' | 'en';

interface LocaleContextValue {
  locale: FormLocale;
  setLocale: (next: FormLocale) => void;
  toggleLocale: () => void;
}

const LOCALE_STORAGE_KEY = 'adminkit_form_locale';

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ru',
  setLocale: () => {},
  toggleLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<FormLocale>(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      return saved === 'en' ? 'en' : 'ru';
    } catch {
      return 'ru';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore storage errors
    }
  }, [locale]);

  const setLocale = (next: FormLocale) => setLocaleState(next);
  const toggleLocale = () => setLocaleState((prev) => (prev === 'ru' ? 'en' : 'ru'));

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useFormLocale() {
  return useContext(LocaleContext);
}
