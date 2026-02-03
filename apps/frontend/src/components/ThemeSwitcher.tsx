import { useTheme, type Theme } from '../hooks/useTheme';

const THEME_LABELS: Record<Theme, string> = {
  light: '☀️ Clair',
  dark: '🌙 Sombre',
  ocean: '🌊 Océan',
  sunset: '🌅 Sunset',
  purple: '💜 Violet',
};

/**
 * Composant pour changer de thème
 * Affiche un sélecteur avec tous les thèmes disponibles
 */
export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm font-medium text-text-secondary">
        Thème:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="px-3 py-2 rounded-lg border border-border-primary bg-bg-card text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {THEME_LABELS[t]}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Version compacte : boutons colorés
 */
export function ThemeSwitcherCompact() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex gap-2">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            theme === t
              ? 'bg-primary text-text-primary shadow-primary'
              : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
          }`}
          title={THEME_LABELS[t]}
        >
          {THEME_LABELS[t].split(' ')[0]}
        </button>
      ))}
    </div>
  );
}

/**
 * Toggle simple Light/Dark
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary transition-colors"
      title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
