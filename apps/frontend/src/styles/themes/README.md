# 🎨 Système de Thèmes - SocialVibe

Système de thèmes modulaire basé sur des **variables CSS** utilisées par **Tailwind**.

## 📂 Structure

```
themes/
├── base.css       # Variables communes (spacing, radius, transitions...)
├── light.css      # Thème clair (défaut - Vert Émeraude)
├── dark.css       # Thème sombre
├── ocean.css      # Thème bleu océan
├── sunset.css     # Thème orange/rouge
└── purple.css     # Thème violet
```

## 🚀 Utilisation

### 1. Dans les composants React

Utiliser le hook `useTheme` :

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Thème actuel : {theme}</p>
      <button onClick={() => setTheme('ocean')}>Océan</button>
      <button onClick={toggleTheme}>Toggle Light/Dark</button>
    </div>
  );
}
```

### 2. Composants prêts à l'emploi

```tsx
import { ThemeSwitcher, ThemeSwitcherCompact, ThemeToggle } from '@/components/ThemeSwitcher';

// Select dropdown complet
<ThemeSwitcher />

// Boutons compacts
<ThemeSwitcherCompact />

// Simple toggle Light/Dark
<ThemeToggle />
```

### 3. Utiliser les variables dans Tailwind

Toutes les variables sont disponibles dans Tailwind :

```tsx
<div className="bg-bg-primary text-text-primary border border-border-primary">
  <h1 className="text-primary">Titre</h1>
  <p className="text-text-secondary">Description</p>
</div>
```

### 4. Utiliser directement en CSS

```css
.my-custom-component {
  background-color: var(--color-bg-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}
```

## 🎨 Variables disponibles

### Couleurs

#### Primary
- `--color-primary` → `text-primary`, `bg-primary`, `border-primary`
- `--color-primary-hover`
- `--color-primary-light`
- `--color-primary-dark`

#### Backgrounds
- `--color-bg-primary` → `bg-bg-primary`
- `--color-bg-secondary` → `bg-bg-secondary`
- `--color-bg-tertiary` → `bg-bg-tertiary`
- `--color-bg-card` → `bg-bg-card`
- `--color-bg-overlay` → `bg-bg-overlay`

#### Text
- `--color-text-primary` → `text-text-primary`
- `--color-text-secondary` → `text-text-secondary`
- `--color-text-muted` → `text-text-muted`
- `--color-text-disabled` → `text-text-disabled`

#### Borders
- `--color-border-primary` → `border-border-primary`
- `--color-border-secondary` → `border-border-secondary`
- `--color-border-hover` → `border-border-hover`

#### Semantic
- `--color-success` → `text-success`, `bg-success`, `border-success`
- `--color-error` → `text-error`, `bg-error`, `border-error`
- `--color-warning` → `text-warning`, `bg-warning`, `border-warning`
- `--color-info` → `text-info`, `bg-info`, `border-info`

### Spacing
- `--spacing-xs` → `space-xs`, `p-xs`, `m-xs`
- `--spacing-sm` → `space-sm`, `p-sm`, `m-sm`
- `--spacing-md` → `space-md`, `p-md`, `m-md`
- `--spacing-lg` → `space-lg`, `p-lg`, `m-lg`
- `--spacing-xl` → `space-xl`, `p-xl`, `m-xl`
- `--spacing-2xl` → `space-2xl`, `p-2xl`, `m-2xl`
- `--spacing-3xl` → `space-3xl`, `p-3xl`, `m-3xl`

### Border Radius
- `--radius-sm` → `rounded-token` (via tailwind.config.js)
- `--radius-md`
- `--radius-lg`
- `--radius-xl`
- `--radius-2xl`
- `--radius-full`

### Shadows
- `--shadow-sm` → `shadow-sm`
- `--shadow-md` → `shadow-md`
- `--shadow-lg` → `shadow-lg`
- `--shadow-xl` → `shadow-xl`
- `--shadow-primary` → `shadow-primary`

### Transitions
- `--transition-fast` → `duration-fast`
- `--transition-base` → `duration-base`
- `--transition-slow` → `duration-slow`

### Z-Index
- `--z-dropdown` → `z-dropdown`
- `--z-sticky` → `z-sticky`
- `--z-fixed` → `z-fixed`
- `--z-modal-backdrop` → `z-modal-backdrop`
- `--z-modal` → `z-modal`
- `--z-popover` → `z-popover`
- `--z-tooltip` → `z-tooltip`

## ➕ Ajouter un nouveau thème

1. Créer un fichier `themes/mon-theme.css`
2. Copier le template depuis `light.css`
3. Modifier les couleurs
4. Importer dans `design-tokens.css` :
   ```css
   @import './themes/mon-theme.css';
   ```
5. Ajouter dans le hook `useTheme.ts` :
   ```ts
   export type Theme = 'light' | 'dark' | 'ocean' | 'sunset' | 'purple' | 'mon-theme';
   ```
6. Ajouter le label dans `ThemeSwitcher.tsx` :
   ```ts
   const THEME_LABELS: Record<Theme, string> = {
     // ...
     'mon-theme': '🎨 Mon Thème',
   };
   ```

## 💡 Bonnes pratiques

1. **Toujours utiliser les variables** plutôt que des couleurs hardcodées
2. **Préférer les classes Tailwind** quand c'est possible
3. **Tester tous les thèmes** avant de merger du CSS custom
4. **Les transitions** sont automatiques via `body` (voir `design-tokens.css`)

## 🔧 Configuration Tailwind

Le fichier `tailwind.config.js` est déjà configuré pour utiliser toutes ces variables.

Exemple :
```js
colors: {
  primary: {
    DEFAULT: 'var(--color-primary)',
    hover: 'var(--color-primary-hover)',
    // ...
  },
}
```

## 📱 Détection automatique du thème système (futur)

Pour détecter le thème du système :

```ts
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = prefersDark ? 'dark' : 'light';
```

À ajouter dans `useTheme.ts` si souhaité.
