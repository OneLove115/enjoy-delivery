'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => {}, resolved: 'dark' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolved, setResolved] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('enjoy-theme') as Theme) || 'dark';
    setThemeState(saved);
    apply(saved);

    // Listen for system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onMqChange = () => {
      if (localStorage.getItem('enjoy-theme') === 'system') apply('system');
    };
    mq.addEventListener('change', onMqChange);
    return () => mq.removeEventListener('change', onMqChange);
  }, []);

  function apply(t: Theme) {
    const isDark = t === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : t === 'dark';
    document.documentElement.classList.toggle('light', !isDark);
    setResolved(isDark ? 'dark' : 'light');
  }

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('enjoy-theme', t);
    apply(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
