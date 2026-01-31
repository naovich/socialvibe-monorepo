# 🔍 Configuration Linting & TypeScript Strict

**Date**: 31/01/2026  
**Auteur**: HAL (Assistant AI)

## 📋 Changements Effectués

### 1. TypeScript Strict Mode (Backend)

**Fichier**: `apps/backend/tsconfig.json`

**Avant** (Permissif ❌):
```json
{
  "noImplicitAny": false,
  "strictBindCallApply": false,
  "noFallthroughCasesInSwitch": false
}
```

**Après** (Strict ✅):
```json
{
  "noImplicitAny": true,
  "strictBindCallApply": true,
  "noFallthroughCasesInSwitch": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "strict": true
}
```

---

### 2. ESLint Rules Strictes (Backend)

**Fichier**: `apps/backend/eslint.config.mjs`

**Règles activées**:
- ✅ `@typescript-eslint/no-explicit-any`: **'error'** (bloque les `any`)
- ✅ `@typescript-eslint/no-unused-vars`: **'error'** (bloque variables non utilisées)
- ✅ `@typescript-eslint/no-floating-promises`: **'error'**
- ✅ `@typescript-eslint/no-unsafe-argument`: **'error'**
- ✅ `@typescript-eslint/no-unsafe-assignment`: **'error'**
- ✅ `@typescript-eslint/no-unsafe-member-access`: **'error'**
- ✅ `@typescript-eslint/no-unsafe-return`: **'error'**
- ✅ `@typescript-eslint/no-unsafe-call`: **'error'**

**Exception autorisée**: Variables préfixées par `_` (ex: `_unused`)

---

### 3. Pre-commit Hook Amélioré

**Fichier**: `.husky/pre-commit`

**Vérifications ajoutées**:
1. 📝 **ESLint** (backend + frontend)
2. 🔍 **Type-check** (`tsc --noEmit`)
3. 📦 **Build** (backend + frontend)

**Résultat**: Impossible de commit avec:
- Variables `any`
- Variables non utilisées
- Erreurs TypeScript
- Erreurs ESLint

---

## 🛠️ Auto-fix Appliqué

ESLint a automatiquement corrigé **67 fichiers** backend avec `--fix`.

---

## 📊 Impact

**Frontend**: Déjà strict ✅ (pas de changement)  
**Backend**: Passé de permissif à strict ✅

---

## 🔧 Commandes Utiles

### Lint manuel
```bash
# Backend
cd apps/backend
npm run lint

# Frontend
cd apps/frontend
npm run lint
```

### Type-check manuel
```bash
# Backend
cd apps/backend
npx tsc --noEmit

# Frontend
cd apps/frontend
npx tsc --noEmit
```

### Forcer un commit (déconseillé)
```bash
git commit --no-verify
```

---

## ✅ Résultat

**Plus aucun code non-strict ne peut être committé !** 🎉

Le pre-commit bloquera automatiquement:
- `any` non typé
- Variables déclarées mais non utilisées
- Erreurs TypeScript
- Erreurs de linting

---

**Note**: Si tu veux autoriser un `any` exceptionnel, utilise:
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = ...
```
