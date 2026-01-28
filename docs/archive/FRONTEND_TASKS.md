# 🎨 Frontend Tasks - SocialVibe Refonte

## Phase 1 : Design System (Fond Blanc + Pantone 355C) 🎨

### Couleurs à changer
**Ancien (Dark):**
- Background: `#0a0a0a` → **Nouveau:** `#ffffff`
- Text: `#ffffff` → **Nouveau:** `#1a1a1a`
- Primary: `#ff6b35` (orange) → **Nouveau:** `#009639` (Pantone 355C - vert émeraude)

### Tasks Design
- [ ] **1.1** Mettre à jour `design-tokens.css`
  - [ ] Background principal → blanc `#ffffff`
  - [ ] Background card → gris très clair `#f8f9fa`
  - [ ] Text principal → noir `#1a1a1a`
  - [ ] Primary color → Pantone 355C `#009639`
  - [ ] Hover primary → `#007d2f`
  - [ ] Borders → gris clair `#e5e7eb`

- [ ] **1.2** Ajuster les ombres pour fond clair
  - [ ] Cards : `shadow-sm` au lieu de `shadow-2xl`
  - [ ] Modals : adapter les overlays

- [ ] **1.3** Revoir les contrastes
  - [ ] Text muted → gris moyen `#6b7280`
  - [ ] Text secondary → gris foncé `#374151`
  - [ ] Hover states → ajuster pour fond blanc

- [ ] **1.4** Mettre à jour les gradients
  - [ ] Remplacer gradients orange par vert Pantone 355C
  - [ ] Ajuster les opacity pour fond clair

- [ ] **1.5** Tester dark mode toggle
  - [ ] Garder possibilité de switcher
  - [ ] Définir blanc comme défaut

---

## Phase 2 : Navigation & UX Fixes 🔗

### Tasks Navigation
- [ ] **2.1** Fixer les liens profile
  - [ ] Supprimer `target="_blank"` des liens internes
  - [ ] Navigation via state au lieu de nouvelles fenêtres
  - [ ] Sidebar : links → buttons avec callbacks

- [ ] **2.2** Améliorer la navigation interne
  - [ ] Créer système de routing simple (sans react-router)
  - [ ] View states : home, profile, friends, groups, etc.
  - [ ] Breadcrumb si nécessaire

- [ ] **2.3** Fix des modals
  - [ ] Vérifier que les modals se ferment correctement
  - [ ] Escape key pour fermer
  - [ ] Click outside pour fermer

- [ ] **2.4** Scrolling et UX
  - [ ] Smooth scroll vers le haut
  - [ ] Infinite scroll pour le feed (préparation)
  - [ ] Loading states élégants

---

## Phase 3 : Intégration Backend API 🔌

### Setup API Client
- [ ] **3.1** Configuration Axios
  - [ ] Base URL depuis env (`VITE_API_URL`)
  - [ ] Interceptors pour auth JWT
  - [ ] Error handling global
  - [ ] Loading states

- [ ] **3.2** Auth Service
  - [ ] `POST /auth/register` - Inscription
  - [ ] `POST /auth/login` - Connexion
  - [ ] JWT storage (localStorage)
  - [ ] Auto-logout si token expiré
  - [ ] Protected routes

### Tasks API Integration
- [ ] **3.3** Users
  - [ ] `GET /users/:id` - Profil utilisateur
  - [ ] `GET /users` - Liste utilisateurs
  - [ ] Remplacer mock users par API

- [ ] **3.4** Posts
  - [ ] `GET /posts` - Feed de posts (remplacer mock)
  - [ ] `POST /posts` - Créer un post (formulaire fonctionnel)
  - [ ] `PATCH /posts/:id` - Éditer un post
  - [ ] `DELETE /posts/:id` - Supprimer un post
  - [ ] Upload d'images (Cloudinary ou local)

- [ ] **3.5** Likes
  - [ ] `POST /likes/:postId` - Toggle like (remplacer mock)
  - [ ] `GET /likes/post/:postId` - Liste des likes
  - [ ] Optimistic UI (like instantané)

- [ ] **3.6** Comments
  - [ ] `POST /comments/:postId` - Ajouter commentaire (fonctionnel)
  - [ ] `GET /comments/post/:postId` - Liste commentaires
  - [ ] `DELETE /comments/:id` - Supprimer commentaire
  - [ ] Nested comments support

### Zustand Store Updates
- [ ] **3.7** Remplacer mock data par API calls
  - [ ] `fetchPosts()` → vraie API
  - [ ] `toggleLike()` → vraie API
  - [ ] `addComment()` → vraie API
  - [ ] `addPost()` → vraie API

- [ ] **3.8** Ajouter auth state
  - [ ] `currentUser` depuis JWT
  - [ ] `isAuthenticated`
  - [ ] `login()` / `logout()` / `register()`

---

## Phase 4 : Features Manquantes 🚀

### Authentification UI
- [ ] **4.1** Page Login
  - [ ] Formulaire email/password
  - [ ] Validation client
  - [ ] Error messages
  - [ ] Redirection après login

- [ ] **4.2** Page Register
  - [ ] Formulaire inscription complet
  - [ ] Validation (email, password, username)
  - [ ] Avatar upload (optionnel)
  - [ ] Success message

- [ ] **4.3** Protected Routes
  - [ ] Rediriger vers login si non authentifié
  - [ ] Persister la session (refresh token)

### Profile Management
- [ ] **4.4** Éditer profil
  - [ ] Modal ou page dédiée
  - [ ] Changer avatar, cover, bio
  - [ ] `PATCH /users/:id` API call

- [ ] **4.5** Voir profil d'un autre user
  - [ ] Cliquer sur avatar/nom → voir profil
  - [ ] Posts de cet utilisateur
  - [ ] Follow/Unfollow (futur)

### Posts Features
- [ ] **4.6** Upload d'images
  - [ ] Drag & drop
  - [ ] Preview avant upload
  - [ ] Multi-images carousel
  - [ ] Compression côté client

- [ ] **4.7** Éditer/Supprimer posts
  - [ ] Bouton "..." sur ses propres posts
  - [ ] Modal confirmation delete
  - [ ] Édition inline ou modal

- [ ] **4.8** Partage de posts
  - [ ] ShareModal fonctionnel
  - [ ] Copier lien
  - [ ] Partager sur réseaux sociaux (futur)

### Comments & Interactions
- [ ] **4.9** Nested comments
  - [ ] Répondre à un commentaire
  - [ ] Afficher les réponses
  - [ ] Indentation visuelle

- [ ] **4.10** Reactions avancées
  - [ ] 6 réactions (pas juste like)
  - [ ] Afficher qui a réagi
  - [ ] Modal avec liste des réactions

### Notifications
- [ ] **4.11** NotificationCenter fonctionnel
  - [ ] `GET /notifications` API
  - [ ] Mark as read
  - [ ] Click → redirection
  - [ ] Badge count

### Search
- [ ] **4.12** SearchBar fonctionnelle
  - [ ] Recherche users, posts, hashtags
  - [ ] Debounce (300ms)
  - [ ] Résultats en temps réel
  - [ ] Historique de recherche

---

## Phase 5 : Polish & Optimisations ✨

### Performance
- [ ] **5.1** Lazy loading des images
  - [ ] Utiliser `<img loading="lazy">`
  - [ ] Placeholder blur

- [ ] **5.2** Code splitting
  - [ ] Lazy load des routes
  - [ ] Lazy load des modals

- [ ] **5.3** Optimistic UI
  - [ ] Like/Unlike instantané
  - [ ] Post creation instantané
  - [ ] Rollback si erreur

### UX Improvements
- [ ] **5.4** Loading states
  - [ ] Skeleton screens
  - [ ] Spinner élégants
  - [ ] Progress bars pour uploads

- [ ] **5.5** Error handling
  - [ ] Toast notifications (succès/erreur)
  - [ ] Retry logic pour API fails
  - [ ] Offline mode message

- [ ] **5.6** Animations
  - [ ] Transitions fluides entre views
  - [ ] Micro-interactions (hover, click)
  - [ ] Page transitions

### Responsive
- [ ] **5.7** Mobile optimization
  - [ ] Bottom navigation mobile
  - [ ] Swipe gestures
  - [ ] Touch-friendly buttons

- [ ] **5.8** Tablet optimization
  - [ ] Layout adaptatif
  - [ ] Sidebar responsive

---

## Phase 6 : Tests & Documentation 🧪

### Tests
- [ ] **6.1** Unit tests (Vitest)
  - [ ] Components critiques
  - [ ] Utils functions
  - [ ] Store actions

- [ ] **6.2** E2E tests (Playwright)
  - [ ] Login flow
  - [ ] Post creation
  - [ ] Comment flow

### Documentation
- [ ] **6.3** Components documentation
  - [ ] Storybook (optionnel)
  - [ ] Props documentation
  - [ ] Usage examples

- [ ] **6.4** API documentation frontend
  - [ ] Services documentation
  - [ ] API calls examples

---

## Priorités Suggérées 🎯

### Sprint 1 (Urgent)
1. **Phase 1** - Design System (blanc + Pantone 355C)
2. **Phase 2** - Navigation fixes (liens profil, etc.)
3. **Phase 3.1-3.2** - Setup API client + Auth

### Sprint 2 (Important)
4. **Phase 3.3-3.6** - Intégration Posts/Likes/Comments API
5. **Phase 4.1-4.3** - Auth UI (Login/Register)
6. **Phase 4.6-4.7** - Upload images + Edit/Delete posts

### Sprint 3 (Nice to have)
7. **Phase 4.8-4.12** - Features avancées (search, notifs, reactions)
8. **Phase 5** - Polish & optimisations
9. **Phase 6** - Tests & docs

---

## Estimation de Temps ⏱️

- **Phase 1 (Design):** 2-3h
- **Phase 2 (Navigation):** 1-2h
- **Phase 3 (API Integration):** 4-6h
- **Phase 4 (Features):** 6-8h
- **Phase 5 (Polish):** 3-4h
- **Phase 6 (Tests):** 4-6h

**Total:** ~20-30h de dev

---

## Notes Importantes 📝

### Design System
- Garder le système de design tokens
- Penser accessibilité (contraste WCAG AA minimum)
- Tester sur différents écrans

### API
- Toujours gérer les erreurs
- Loading states pour meilleure UX
- Optimistic UI quand possible

### Performance
- Keep bundle size < 500KB
- Lazy load non-critical code
- Optimize images

---

**Prêt à démarrer ?** Commence par la **Phase 1** (Design System) ! 🎨
