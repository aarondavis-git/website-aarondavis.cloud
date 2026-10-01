'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Always start false on both server and client, so the first client
  // render matches the server-rendered HTML exactly — no hydration mismatch,
  // even for components that branch their output on `darkMode`.
  //
  // ThemeScript (see layout.tsx) already set the correct `dark` class on
  // <html> synchronously, before this ever paints, so there's no visible
  // flash: this effect just syncs React's state to match reality right
  // after hydration finishes.
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Syncing from an external source (the DOM, set by ThemeScript) on
    // mount — a legitimate use of an effect per React's own docs, which
    // this lint rule can't distinguish from the anti-pattern it targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    // Briefly kill every CSS transition site-wide (see the matching rule in
    // globals.css) so the switch — including the fade normally used for
    // hover states on glass panels, which also fires when their colors
    // change here — is instant, then restore normal hover transitions a
    // moment later. A timeout (rather than the next animation frame) gives
    // React's effect above, which is what actually flips the `dark` class,
    // reliable time to run first.
    document.documentElement.classList.add('theme-toggle-instant');
    setDarkMode((prev) => !prev);
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-toggle-instant');
    }, 50);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
