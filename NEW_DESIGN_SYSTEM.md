# 🎨 New Design System - SocialVibe

## Couleurs Principales

### Pantone 355C (Primary)
```css
--color-primary: #009639;           /* Pantone 355C - Vert émeraude */
--color-primary-hover: #007d2f;     /* Darker pour hover */
--color-primary-light: #e6f7ed;     /* Light pour backgrounds */
--color-primary-dark: #006425;      /* Très foncé pour text on light */
```

### Backgrounds (Fond Blanc)
```css
--color-bg-primary: #ffffff;        /* Fond principal */
--color-bg-secondary: #f8f9fa;      /* Fond cards/sections */
--color-bg-tertiary: #f1f3f5;       /* Hover states */
--color-bg-overlay: rgba(0, 0, 0, 0.5); /* Modals backdrop */
```

### Text (Noir/Gris)
```css
--color-text-primary: #1a1a1a;      /* Texte principal */
--color-text-secondary: #374151;    /* Texte secondaire */
--color-text-muted: #6b7280;        /* Texte discret */
--color-text-disabled: #9ca3af;     /* Texte désactivé */
```

### Borders
```css
--color-border-primary: #e5e7eb;    /* Borders normales */
--color-border-secondary: #d1d5db;  /* Borders accentuées */
--color-border-hover: #009639;      /* Borders hover (primary) */
```

### Semantic Colors
```css
--color-success: #10b981;           /* Succès (vert) */
--color-error: #ef4444;             /* Erreur (rouge) */
--color-warning: #f59e0b;           /* Warning (orange) */
--color-info: #3b82f6;              /* Info (bleu) */
```

---

## Shadows (Fond Clair)

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Primary colored shadows */
--shadow-primary: 0 10px 15px -3px rgba(0, 150, 57, 0.3);
```

---

## Typography

```css
/* Sizes */
--font-xs: 0.75rem;    /* 12px */
--font-sm: 0.875rem;   /* 14px */
--font-base: 1rem;     /* 16px */
--font-lg: 1.125rem;   /* 18px */
--font-xl: 1.25rem;    /* 20px */
--font-2xl: 1.5rem;    /* 24px */
--font-3xl: 1.875rem;  /* 30px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Spacing

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

---

## Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Cercle complet */
```

---

## Components Examples

### Button Primary (Pantone 355C)
```css
.btn-primary {
  background-color: #009639;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  box-shadow: 0 10px 15px -3px rgba(0, 150, 57, 0.3);
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #007d2f;
  box-shadow: 0 20px 25px -5px rgba(0, 150, 57, 0.4);
  transform: translateY(-2px);
}
```

### Card
```css
.card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  border-color: #009639;
}
```

### Input
```css
.input {
  background-color: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: #1a1a1a;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: #009639;
  box-shadow: 0 0 0 3px rgba(0, 150, 57, 0.1);
  background-color: #ffffff;
}
```

### Badge
```css
.badge {
  background-color: #e6f7ed;
  color: #006425;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}
```

---

## Comparaison Avant/Après

### Ancien (Dark + Orange)
```css
Background: #0a0a0a (noir)
Text: #ffffff (blanc)
Primary: #ff6b35 (orange)
Cards: #1a1a1a (gris très foncé)
```

### Nouveau (Blanc + Pantone 355C)
```css
Background: #ffffff (blanc)
Text: #1a1a1a (noir)
Primary: #009639 (vert émeraude Pantone 355C)
Cards: #f8f9fa (gris très clair)
```

---

## Migration Steps

### 1. Mettre à jour `design-tokens.css`
Remplacer toutes les couleurs dans le fichier

### 2. Ajuster les composants
Parcourir tous les composants et ajuster :
- `bg-` classes
- `text-` classes
- `border-` classes
- Shadows
- Hover states

### 3. Tester les contrastes
- Vérifier WCAG AA (4.5:1 pour texte normal)
- Tester avec différents thèmes
- Vérifier accessibilité

### 4. Dark mode (optionnel)
Garder la possibilité de toggle, mais blanc par défaut

---

## Palette Complète

```
Primary (Pantone 355C):
#009639 - Base
#007d2f - Hover
#006425 - Dark
#e6f7ed - Light background

Grays:
#1a1a1a - Text primary
#374151 - Text secondary
#6b7280 - Text muted
#9ca3af - Text disabled
#e5e7eb - Border
#f1f3f5 - Background tertiary
#f8f9fa - Background secondary
#ffffff - Background primary

Semantic:
#10b981 - Success
#ef4444 - Error
#f59e0b - Warning
#3b82f6 - Info
```

---

**Ready to implement!** 🚀
