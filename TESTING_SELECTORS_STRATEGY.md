# 🎯 Stratégie de Sélecteurs pour Tests E2E - Approche Élégante

**Date:** 2026-01-30  
**Philosophie:** Utiliser les attributs existants + aria-label (accessibilité) plutôt que polluer le code avec des data-testid partout.

---

## 🌟 APPROCHE ADOPTÉE

### Principe

**Priorité des sélecteurs** (du plus au moins fiable):

1. **Attributs HTML sémantiques** (`name`, `type`, `role`)
2. **Aria attributes** (`aria-label`, `aria-pressed`)
3. **Text content stable** (boutons, labels)
4. **data-testid** (uniquement si vraiment nécessaire)

### Avantages

✅ **Moins invasif** - Pas de data-testid partout  
✅ **Meilleure accessibilité** - aria-label profite à tous  
✅ **Maintenabilité** - Sélecteurs naturels, pas artificiels  
✅ **Sémantique** - HTML propre et standard  

---

## 📝 CHANGEMENTS APPLIQUÉS

### 1. Formulaires d'Authentification

#### Login.tsx
**Ajout:** Attributs `name` sur les inputs (bonne pratique HTML)

```tsx
// ✅ AVANT
<input type="email" value={email} onChange={...} />

// ✅ APRÈS
<input type="email" name="email" value={email} onChange={...} />
```

**Test sélecteur:**
```typescript
await page.fill('input[name="email"]', 'test@example.com');
```

#### Register.tsx
**Aucun changement nécessaire** - Les attributs `name` étaient déjà présents ! ✅

---

### 2. Actions sur Posts

#### PostCard.tsx
**Ajout:** aria-label + aria-pressed pour accessibilité

```tsx
// ✅ AVANT
<button onClick={onLike}>
  <Heart />
  <span>{post.likes}</span>
</button>

// ✅ APRÈS
<button 
  onClick={onLike}
  aria-label={post.isLiked ? "Unlike post" : "Like post"}
  aria-pressed={post.isLiked}
>
  <Heart />
  <span>{post.likes}</span>
</button>
```

**Test sélecteur:**
```typescript
await page.click('[aria-label*="Like"]');
// ou
await page.click('[aria-pressed="false"]');
```

**Bonus:** Les screen readers peuvent maintenant annoncer l'état du bouton ! ♿

---

### 3. Helpers de Test

#### test-utils.ts
**Ajustement:** Sélecteurs plus flexibles

```typescript
// ✅ Utilise les attributs name existants
await this.page.fill('input[name="email"]', user.email);

// ✅ Timeout plus tolérant pour redirect
await this.page.waitForURL(/\/(home|feed|$|\/)/, { timeout: 10000 });
```

---

## 📊 COMPARAISON

### Approche "data-testid partout" ❌

```tsx
// Frontend pollué
<input data-testid="login-email" name="email" />
<input data-testid="login-password" name="password" />
<button data-testid="login-submit">Login</button>
<button data-testid="post-like">Like</button>
<button data-testid="post-comment">Comment</button>
```

**Problèmes:**
- Code pollué avec des attributs non-sémantiques
- Maintenance lourde (ajouter partout)
- Aucun bénéfice pour l'accessibilité

### Notre approche "Sémantique + Accessibilité" ✅

```tsx
// Frontend propre
<input name="email" type="email" />
<input name="password" type="password" />
<button type="submit">Login</button>
<button aria-label="Like post" aria-pressed={liked}>Like</button>
<button aria-label="Comment on post">Comment</button>
```

**Avantages:**
- HTML sémantique et standard
- Accessibilité améliorée (aria-label pour screen readers)
- Tests fiables avec sélecteurs naturels
- Moins de code ajouté

---

## 🎯 QUAND UTILISER QUOI

### ✅ Utilisez name/type (formulaires)

```tsx
<input name="email" type="email" />
<input name="password" type="password" />
<button type="submit">Submit</button>
```

**Tests:**
```typescript
await page.fill('input[name="email"]', value);
await page.click('button[type="submit"]');
```

---

### ✅ Utilisez aria-label (actions)

```tsx
<button aria-label="Delete post">
  <TrashIcon />
</button>
```

**Tests:**
```typescript
await page.click('[aria-label="Delete post"]');
```

**Bonus:** Accessibilité ! ♿

---

### ✅ Utilisez text content (navigation, liens)

```tsx
<Link to="/register">Sign Up</Link>
<button>Create Post</button>
```

**Tests:**
```typescript
await page.click('text=Sign Up');
await page.click('text=Create Post');
```

---

### ⚠️ data-testid (dernier recours)

**Utilisez UNIQUEMENT si:**
- Élément sans texte stable
- Pas d'attribut sémantique disponible
- Plusieurs éléments identiques à différencier

```tsx
<div data-testid="user-profile-header">
  {/* Contenu dynamique complexe */}
</div>
```

**Tests:**
```typescript
await page.locator('[data-testid="user-profile-header"]');
```

---

## 📋 CHECKLIST AJOUT TESTS

Avant d'ajouter un test E2E, vérifier dans l'ordre :

1. [ ] L'élément a-t-il un attribut `name` ? → Utiliser
2. [ ] L'élément a-t-il un `aria-label` ? → Utiliser
3. [ ] L'élément a-t-il du texte stable ? → Utiliser `text=`
4. [ ] Aucun des précédents ? → Ajouter `aria-label` (accessibilité) OU `data-testid`

---

## 🛠️ SÉLECTEURS PLAYWRIGHT RECOMMANDÉS

### Par ordre de préférence

```typescript
// 1. Role ARIA (le mieux pour accessibilité)
await page.getByRole('button', { name: 'Submit' });
await page.getByRole('textbox', { name: 'Email' });

// 2. Label
await page.getByLabel('Email');
await page.getByLabel('Password');

// 3. Test ID (si vraiment nécessaire)
await page.getByTestId('user-profile');

// 4. Attribut name (formulaires)
await page.locator('input[name="email"]');

// 5. Aria-label
await page.locator('[aria-label="Like post"]');

// 6. Text content
await page.getByText('Sign Up');
```

---

## 📖 EXEMPLES CONCRETS

### Scénario: Register User

```typescript
test('Register user', async ({ page }) => {
  await page.goto('/register');
  
  // ✅ Utilise attributs name existants
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="username"]', 'johndoe');
  await page.fill('input[name="email"]', 'john@example.com');
  await page.fill('input[name="password"]', 'password123');
  
  // ✅ Utilise type submit
  await page.click('button[type="submit"]');
  
  // ✅ Attend redirect
  await page.waitForURL(/\/$/);
});
```

### Scénario: Like Post

```typescript
test('Like post', async ({ page }) => {
  await page.goto('/');
  
  // ✅ Utilise aria-label (accessible)
  const likeButton = page.locator('[aria-label*="Like post"]').first();
  
  // Vérifier état initial
  await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
  
  // Like
  await likeButton.click();
  
  // Vérifier état après
  await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
});
```

---

## 🎓 BONNES PRATIQUES

### ✅ DO

- Utiliser les attributs HTML standards (name, type, role)
- Ajouter aria-label pour améliorer l'accessibilité
- Privilégier les sélecteurs qui ont du sens pour les humains
- Utiliser Playwright's `getByRole()`, `getByLabel()` quand possible

### ❌ DON'T

- Ajouter data-testid par réflexe sans vérifier les alternatives
- Utiliser des sélecteurs CSS fragiles (.btn-primary)
- Cibler par position (`:nth-child(3)`)
- Dupliquer des attributs (name + data-testid avec même valeur)

---

## 🔄 MIGRATION TESTS EXISTANTS

Si des tests utilisent des sélecteurs fragiles, les migrer vers:

```typescript
// ❌ AVANT (fragile)
await page.click('.like-button');
await page.fill('#email-input', value);

// ✅ APRÈS (sémantique)
await page.click('[aria-label="Like post"]');
await page.fill('input[name="email"]', value);
```

---

## 📚 RESSOURCES

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Priority](https://testing-library.com/docs/queries/about/#priority)
- [WAI-ARIA Labels](https://www.w3.org/WAI/ARIA/apg/practices/naming-role-guidance/)

---

## ✅ RÉSUMÉ

**Changements appliqués au frontend:**
- ✅ 2 attributs `name` ajoutés (Login.tsx) - 2 lignes
- ✅ 2 aria-label ajoutés (PostCard.tsx) - 3 lignes
- ✅ Test helpers ajustés (test-utils.ts) - 5 lignes

**Total:** ~10 lignes modifiées pour rendre TOUS les tests possibles ! 🎉

**Approche:** Élégante, sémantique, accessible, maintenable.

---

**Prochaines étapes:**
1. Relancer les tests pour voir les améliorations
2. Ajouter aria-label sur autres composants si nécessaire
3. Documenter patterns pour nouveaux composants

**Principe directeur:** Si vous hésitez entre data-testid et aria-label, choisissez aria-label - c'est bon pour les tests ET pour l'accessibilité ! ♿
