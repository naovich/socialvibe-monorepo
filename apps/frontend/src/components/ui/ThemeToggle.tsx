import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-text-secondary" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-text-secondary" aria-hidden="true" />
      )}
    </button>
  );
};

export { ThemeToggle };
export default ThemeToggle;
