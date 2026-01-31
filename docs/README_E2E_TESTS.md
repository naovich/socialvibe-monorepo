# Tests E2E Playwright - SocialVibe

## 📊 État Actuel

**Date**: 31 Janvier 2026  
**Backend**: ✅ Opérationnel (port 3000)  
**Frontend**: ✅ Opérationnel (port 5173)  
**Playwright**: ✅ Installé et configuré

---

## 🎯 Configuration

### Installation

```bash
npm install -D @playwright/test playwright
npx playwright install chromium
```

### Configuration (`playwright.config.ts`)

- **Test Directory**: `./e2e`
- **Workers**: 1 (pas de parallélisme pour éviter les race conditions)
- **Timeout**: 60s par test
- **Browser**: Chromium (headless par défaut, requis pour WSL)
- **Global Setup**: Vérifie que le backend est accessible sur port 3000
- **WebServer**: Lance automatiquement Vite sur port 5173

---

## 📝 Tests Créés

### 1. Authentication (`e2e/auth.spec.ts`) - 4 tests

- ✅ `should register a new user successfully`
  - Teste la création de compte
  - Vérifie la redirection vers home après inscription
  
- 🔄 `should login with valid credentials`
  - Crée un utilisateur, se déconnecte, puis teste le login
  - Vérifie l'authentification et la redirection
  
- 🔄 `should show error with invalid credentials`
  - Teste le rejet de credentials invalides
  - Vérifie l'affichage d'un message d'erreur
  
- 🔄 `should logout successfully`
  - Crée un utilisateur, se connecte, puis se déconnecte
  - Vérifie la redirection vers login

### 2. Posts (`e2e/posts.spec.ts`) - 4 tests

- Création de post
- Like d'un post
- Commentaire sur un post
- Suppression d'un post

### 3. Stories (`e2e/stories.spec.ts`) - 4 tests

- Création de story
- Visualisation de story
- Navigation entre stories
- Suppression de story

### 4. Notifications (`e2e/notifications.spec.ts`) - 5 tests

- Notification de like
- Notification de commentaire
- Marquer comme lu
- Badge de notifications
- Multi-utilisateurs (contexts)

---

## 🚀 Commandes

### Lancer tous les tests

```bash
npm run test:e2e
```

### Lancer un fichier spécifique

```bash
npx playwright test e2e/auth.spec.ts
```

### Mode debug (avec interface visuelle - nécessite X Server)

```bash
npm run test:e2e:debug
```

### Voir le rapport HTML

```bash
npm run test:e2e:report
```

---

## 🔧 Structure de Test Typique

```typescript
test('should do something', async ({ page }) => {
  // 1. Navigation
  await page.goto('/some-page');
  
  // 2. Interaction
  await page.getByLabel(/email/i).fill('test@test.com');
  await page.getByRole('button', { name: /submit/i }).click();
  
  // 3. Vérification de la réponse réseau
  await page.waitForResponse(
    (response) => response.url().includes('/api/endpoint') && response.ok,
    { timeout: 10000 }
  );
  
  // 4. Assertions
  await expect(page).toHaveURL(/expected-url/);
  await expect(page.getByText(/success/i)).toBeVisible();
});
```

---

## 🎨 Patterns Utilisés

### Sélecteurs Robustes

```typescript
// ✅ BIEN - Par rôle et nom
await page.getByRole('button', { name: /sign up/i })
await page.getByLabel(/email/i)

// ❌ ÉVITER - Sélecteurs CSS fragiles
await page.locator('.btn-primary')
await page.locator('#submit-btn')
```

### Données Uniques

```typescript
// Utiliser timestamp pour éviter les conflits entre tests
const timestamp = Date.now();
const testUser = {
  username: `user${timestamp}`,
  email: `test${timestamp}@test.com`,
  password: 'Test123!@#',
};
```

### Attendre les Requêtes Réseau

```typescript
// Attendre la réponse avant de continuer
await page.waitForResponse(
  (response) => response.url().includes('/auth/login') && response.ok,
  { timeout: 10000 }
);
```

---

## 🐛 Problèmes Résolus

### 1. Pas de X Server (WSL)

**Problème**: Tests `--headed` échouent sans serveur graphique  
**Solution**: Utiliser mode headless (par défaut)

```bash
# ❌ Ne fonctionne pas dans WSL
npx playwright test --headed

# ✅ Fonctionne
npx playwright test
```

### 2. Backend non démarré

**Problème**: Tests échouent si backend pas en cours  
**Solution**: Global setup vérifie la disponibilité du backend

```typescript
// e2e/global-setup.ts
const response = await fetch('http://localhost:3000/api');
if (!response.ok && response.status !== 404) {
  throw new Error('Backend not reachable');
}
```

### 3. Race Conditions

**Problème**: Tests qui échouent aléatoirement en parallèle  
**Solution**: Workers = 1, fullyParallel = false

```typescript
// playwright.config.ts
workers: 1,
fullyParallel: false,
```

### 4. Selectors Non Trouvés

**Problème**: `getByRole('heading', { name: /sign up/i })` ne trouve rien  
**Solution**: Vérifier le code réel du frontend

```typescript
// ❌ Frontend a "Join SocialVibe", pas "Sign Up"
await page.getByRole('heading', { name: /sign up/i })

// ✅ Correspond au h1 réel
await page.getByRole('heading', { name: /join socialvibe/i })
```

---

## 📈 Prochaines Étapes

1. ✅ Faire passer 100% des tests d'authentification
2. ⏳ Adapter les tests Posts/Stories/Notifications à la vraie structure UI
3. ⏳ Lancer la suite complète de tests
4. ⏳ Générer le rapport HTML final
5. ⏳ Documenter les screenshots et traces

---

## 🔍 Debugging

### Voir le screenshot d'un test échoué

```bash
ls test-results/*/test-failed-1.png
```

### Voir la trace vidéo

```bash
ls test-results/*/video.webm
```

### Consulter le contexte d'erreur

```bash
cat test-results/*/error-context.md
```

---

## 💡 Conseils

- **Toujours attendre les requêtes réseau** avant d'asserter
- **Utiliser des données uniques** (timestamp) pour chaque test
- **Vérifier la vraie structure UI** dans le code source avant d'écrire les sélecteurs
- **Tester un à la fois** quand on débugge (`--grep "nom du test"`)
- **Augmenter les timeouts** si nécessaire (networking lent)

---

**Créé par**: Subagent AI  
**Mission**: Réparer et Valider 100% des Tests E2E
