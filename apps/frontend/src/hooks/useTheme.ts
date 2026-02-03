import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'ocean' | 'sunset' | 'purple';

const THEME_STORAGE_KEY = 'socialvibe-theme';
const DEFAULT_THEME: Theme = 'light';

/**
 * Hook pour gérer le thème de l'application
 * Stocke le thème dans localStorage et applique sur document.documentElement
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Récupérer le thème depuis localStorage au chargement
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as Theme) || DEFAULT_THEME;
  });

  useEffect(() => {
    // Appliquer le thème sur l'élément <html>
    document.documentElement.setAttribute('data-theme', theme);
    // Sauvegarder dans localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    themes: ['light', 'dark', 'ocean', 'sunset', 'purple'] as const,
  };
}
