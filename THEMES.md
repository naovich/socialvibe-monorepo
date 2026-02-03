# 🎨 Système de Thèmes - SocialVibe

## ✅ Ce qui a été créé

### 📁 Structure des fichiers

```
apps/frontend/src/
├── styles/
│   ├── themes/
│   │   ├── README.md           # Documentation complète du système
│   │   ├── base.css            # Variables communes (spacing, radius, etc.)
│   │   ├── light.css           # Thème clair (Vert Émeraude - défaut)
│   │   ├── dark.css            # Thème sombre
│   │   ├── ocean.css           # Thème bleu océan
│   │   ├── sunset.css          # Thème orange/rouge
│   │   └── purple.css          # Thème violet
│   └── design-tokens.css       # Import des thèmes + utilitaires
├── hooks/
│   └── useTheme.ts             # Hook React pour gérer les thèmes
└── components/
    ├── ThemeSwitcher.tsx       # Composants pour changer de thème
    └── ThemeDemo.tsx           # Page de démo de tous les tokens
```

## 🎯 Thèmes disponibles

1. **Light** (défaut) - Vert Émeraude Pantone 355C
2. **Dark** - Thème sombre avec accents verts
3. **Ocean** - Bleu océan apaisant
4. **Sunset** - Orange/rouge chaleureux
5. **Purple** - Violet/mauve élégant

## 🚀 Utilisation rapide

### 1. Utiliser le hook

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme('ocean')}>Océan</button>
      <button onClick={toggleTheme}>Toggle Light/Dark</button>
    </div>
  );
}
```

### 2. Composants prêts à l'emploi

```tsx
import { ThemeSwitcher, ThemeSwitcherCompact, ThemeToggle } from '@/components/ThemeSwitcher';

// Dans votre layout/header
<ThemeSwitcher />           // Select dropdown
<ThemeSwitcherCompact />    // Boutons compacts
<ThemeToggle />             // Simple toggle Light/Dark
```

### 3. Utiliser les classes Tailwind

```tsx
<div className="bg-bg-primary text-text-primary border border-border-primary">
  <h1 className="text-primary">Titre</h1>
  <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg">
    Action
  </button>
</div>
```

### 4. Variables CSS directes

```css
.my-component {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-md);
}
```

## 📊 Variables principales

### Couleurs

- **Primary**: `primary`, `primary-hover`, `primary-light`, `primary-dark`
- **Backgrounds**: `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-card`
- **Text**: `text-primary`, `text-secondary`, `text-muted`, `text-disabled`
- **Borders**: `border-primary`, `border-secondary`, `border-hover`
- **Semantic**: `success`, `error`, `warning`, `info`

### Design Tokens

- **Spacing**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- **Shadows**: `sm`, `md`, `lg`, `xl`, `primary`
- **Border Radius**: `token`, `token-lg`, `token-xl`, `token-2xl`
- **Transitions**: `fast`, `base`, `slow`

Voir le fichier `apps/frontend/src/styles/themes/README.md` pour la liste complète.

## 🎨 Page de démonstration

Le composant `ThemeDemo` affiche tous les tokens de design :

```tsx
import { ThemeDemo } from '@/components/ThemeDemo';

// Affiche tous les thèmes, couleurs, typographie, boutons, etc.
<ThemeDemo />
```

## ➕ Ajouter un nouveau thème

1. **Créer le fichier** : `src/styles/themes/mon-theme.css`
2. **Copier le template** depuis `light.css`
3. **Modifier les couleurs** selon vos besoins
4. **Importer** dans `design-tokens.css` :
   ```css
   @import './themes/mon-theme.css';
   ```
5. **Ajouter le type** dans `useTheme.ts` :
   ```ts
   export type Theme = '...' | 'mon-theme';
   ```
6. **Ajouter le label** dans `ThemeSwitcher.tsx` :
   ```ts
   'mon-theme': '🎨 Mon Thème'
   ```

## 🔧 Comment ça marche ?

1. **Variables CSS** définies dans `themes/*.css`
2. **Tailwind config** (`tailwind.config.js`) utilise ces variables
3. **Hook React** (`useTheme`) gère le state et localStorage
4. **Attribute HTML** `data-theme="dark"` sur `<html>` active le thème

```
Variables CSS → Tailwind → React Hook → Composants
```

## 💾 Persistance

Le thème choisi est **automatiquement sauvegardé** dans `localStorage` :

```ts
localStorage.getItem('socialvibe-theme') // 'light', 'dark', etc.
```

Au rechargement de la page, le thème est restauré.

## 🎯 Prochaines étapes possibles

- [ ] Détection automatique du thème système (`prefers-color-scheme`)
- [ ] Synchronisation multi-onglets (via `storage` event)
- [ ] Thèmes personnalisables par l'utilisateur (color picker)
- [ ] Thèmes saisonniers ou événementiels
- [ ] Export/import de thèmes custom

## 📚 Documentation complète

Voir `apps/frontend/src/styles/themes/README.md` pour :
- Liste exhaustive de toutes les variables
- Exemples d'utilisation avancés
- Bonnes pratiques
- Guide de contribution

---

**Auteur:** HAL 🤖  
**Date:** 2026-02-03  
**Version:** 1.0.0
