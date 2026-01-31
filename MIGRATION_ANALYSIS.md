# Analyse de Migration SocialVibe/ → socialvibe-monorepo/

**Date**: 31 janvier 2026  
**Mission**: Migrer le travail utile de SocialVibe/ vers le monorepo officiel  

---

## 📊 ANALYSE COMPARATIVE

### Backend

| Module | SocialVibe | Monorepo | Action |
|--------|------------|----------|--------|
| auth/ | ✓ (SQLite, simple) | ✓ (PostgreSQL, tokens) | ❌ Garder monorepo (plus complet) |
| users/ | ✓ (basique) | ✓ (complet) | ❌ Garder monorepo |
| posts/ | ✓ (basique) | ✓ (complet + groups) | ❌ Garder monorepo |
| comments/ | ❌ | ✓ (nested) | ❌ Garder monorepo |
| stories/ | ✓ (simple) | ✓ (même chose) | ❌ Garder monorepo |
| **notifications/** | **✓ (nouveau)** | **❌ MANQUANT** | **✅ MIGRER** |
| friendships/ | ❌ | ✓ | ❌ Garder monorepo |
| messages/ | ❌ | ✓ | ❌ Garder monorepo |
| groups/ | ❌ | ✓ | ❌ Garder monorepo |
| upload/ | ❌ | ✓ (Cloudinary/MinIO) | ❌ Garder monorepo |
| search/ | ❌ | ✓ | ❌ Garder monorepo |
| email/ | ❌ | ✓ (Nodemailer) | ❌ Garder monorepo |
| logger/ | ❌ | ✓ (Winston) | ❌ Garder monorepo |

**Conclusion Backend**: Le monorepo est BEAUCOUP plus complet. Seul **notifications/** est à migrer.

---

### Frontend

| Service | SocialVibe | Monorepo | Action |
|---------|------------|----------|--------|
| authService.ts | ✓ (séparé) | ✓ (dans api.ts) | ⚠️ Comparer |
| postsService.ts | ✓ (séparé) | ✓ (dans api.ts) | ❌ Garder monorepo |
| **notificationsService.ts** | **✓ (nouveau)** | **❌ MANQUANT** | **✅ AJOUTER** |
| storiesService.ts | ✓ (séparé) | ✓ (dans api.ts) | ❌ Garder monorepo |
| commentsService.ts | ✓ (séparé) | ✓ (dans api.ts) | ❌ Garder monorepo |
| usersService.ts | ✓ (séparé) | ✓ (dans api.ts) | ❌ Garder monorepo |
| friendshipsService.ts | ✓ (séparé) | ✓ (dans api.ts) | ❌ Garder monorepo |

**Note**: SocialVibe a séparé les services en fichiers individuels (meilleure architecture), mais le monorepo a TOUT dans `api.ts` (365 lignes).

**Action**: Ajouter `notificationsAPI` dans api.ts du monorepo.

---

### Tests E2E

| Test | SocialVibe | Monorepo | Action |
|------|------------|----------|--------|
| auth.spec.ts | ✓ (5213 bytes, récent) | ✓ (1892 bytes) | ⚠️ Comparer qualité |
| posts.spec.ts | ✓ (8630 bytes) | ❌ | ✅ MIGRER (comme référence) |
| **notifications.spec.ts** | **✓ (8739 bytes)** | **❌** | **✅ MIGRER** |
| stories.spec.ts | ✓ (7254 bytes) | ❌ | ⚠️ Comparer avec 01-auth, etc. |
| global-setup.ts | ✓ (1011 bytes) | ✓ (1483 bytes) | ⚠️ Comparer |
| - | ❌ | ✓ (01-auth.spec.ts) | ❌ Garder |
| - | ❌ | ✓ (02-posts.spec.ts) | ❌ Garder |
| - | ❌ | ✓ (03-social.spec.ts) | ❌ Garder |
| - | ❌ | ✓ (04-features.spec.ts) | ❌ Garder |
| - | ❌ | ✓ (05-security-performance.spec.ts) | ❌ Garder |
| - | ❌ | ✓ (complete.spec.ts) | ❌ Garder |

**Conclusion Tests**: Le monorepo a UNE SUITE COMPLÈTE de tests E2E (beaucoup plus nombreux). SocialVibe a des tests spécifiques pour notifications (à migrer) et peut-être des améliorations dans posts/stories.

---

### Documentation

SocialVibe/ contient **36 fichiers .md** (rapports d'audit, guides, etc.)

**À migrer** (documentation utile):
- ✅ BACKEND_REQUIREMENTS.md (guide pour implémenter les features manquantes)
- ✅ AUDIT_RAPPORT_COMPLET.md (audit détaillé de l'architecture)
- ✅ AUDIT_RESUME_EXECUTIF.md (résumé exécutif)
- ✅ ACTION_PLAN.md (plan d'action pour atteindre production-ready)
- ✅ E2E_FINAL_REPORT.md (rapport tests E2E)
- ✅ INTEGRATION_TEST_REPORT.md (rapport intégration backend)
- ✅ README_E2E_TESTS.md (guide tests E2E)

**À ignorer** (historique de développement):
- ❌ MISSION_*.md (rapports de subagent)
- ❌ PROGRESS.md, FINAL_PROGRESS.md, etc.
- ❌ NIGHT_PLAN.md, DAY_TASKS.md, TASKS.md
- ❌ CLAUDE.md, WAKE_UP_MESSAGE.md

---

## 🎯 PLAN DE MIGRATION

### Phase 1: Backend - Notifications Module ✅

```bash
# Copier le module notifications
cp -r ~/clawd/SocialVibe/backend/src/notifications/ \
      ~/clawd/socialvibe-monorepo/apps/backend/src/

# Vérifier que ça compile
cd ~/clawd/socialvibe-monorepo/apps/backend
npm run build
```

**Adaptation nécessaire**:
- ⚠️ Changer le schéma Prisma (SQLite → PostgreSQL)
- ⚠️ Vérifier les relations User/Post

---

### Phase 2: Frontend - Notifications API ✅

Ajouter dans `apps/frontend/src/services/api.ts`:

```typescript
// ========== NOTIFICATIONS ==========
export const notificationsAPI = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
};
```

---

### Phase 3: Tests E2E - Notifications ✅

```bash
# Copier le test notifications
cp ~/clawd/SocialVibe/e2e/notifications.spec.ts \
   ~/clawd/socialvibe-monorepo/apps/frontend/e2e/

# Adapter les imports/config si nécessaire
```

---

### Phase 4: Documentation ✅

```bash
cd ~/clawd/socialvibe-monorepo/

# Créer dossier docs/ si n'existe pas
mkdir -p docs/audit

# Copier les rapports utiles
cp ~/clawd/SocialVibe/BACKEND_REQUIREMENTS.md docs/
cp ~/clawd/SocialVibe/AUDIT_RAPPORT_COMPLET.md docs/audit/
cp ~/clawd/SocialVibe/AUDIT_RESUME_EXECUTIF.md docs/audit/
cp ~/clawd/SocialVibe/ACTION_PLAN.md docs/
cp ~/clawd/SocialVibe/E2E_FINAL_REPORT.md docs/audit/
cp ~/clawd/SocialVibe/INTEGRATION_TEST_REPORT.md docs/audit/
cp ~/clawd/SocialVibe/README_E2E_TESTS.md docs/
```

---

### Phase 5: Vérification ✅

```bash
# Backend build
cd ~/clawd/socialvibe-monorepo/apps/backend
npm install
npm run build

# Frontend build
cd ~/clawd/socialvibe-monorepo/apps/frontend
npm install
npm run build

# Tests E2E
npm run test:e2e -- --grep "notification"
```

---

### Phase 6: Commit Git ✅

```bash
cd ~/clawd/socialvibe-monorepo
git add .
git commit -m "feat: Migrate notifications module from SocialVibe project

- Backend: Add notifications module (controller, service, dto)
- Frontend: Add notificationsAPI to services/api.ts  
- Tests: Add E2E tests for notifications workflow
- Docs: Migrate audit reports and integration guides

This work was mistakenly done in a separate SocialVibe/ project.
All useful code and documentation has been migrated to the monorepo.

Ref: Migration from ~/clawd/SocialVibe/"
```

---

## ❌ CE QUI NE SERA PAS MIGRÉ

### Backend

- ❌ auth/, users/, posts/, stories/ (versions simplifiées SQLite)
- ❌ prisma/schema.prisma (SQLite vs PostgreSQL, moins complet)
- ❌ Configuration basique (le monorepo a Helmet, rate limiting, etc.)

### Frontend

- ❌ Services séparés (authService.ts, postsService.ts, etc.) - Le monorepo préfère un seul api.ts
- ❌ store.ts modifications (le monorepo a probablement une version différente)
- ❌ Modifications de composants (le monorepo a une architecture features/ différente)

### Tests

- ❌ auth.spec.ts, posts.spec.ts, stories.spec.ts (le monorepo a déjà 01-auth, 02-posts, etc. plus complets)
- ❌ global-setup.ts (le monorepo a déjà le sien)

### Documentation

- ❌ Tous les fichiers MISSION_*, PROGRESS_*, TASKS_*, etc. (historique de dev)
- ❌ README.md, CLAUDE.md, QUICK_START.md (spécifiques au projet SocialVibe/)

---

## 📝 NOTES IMPORTANTES

1. **Le monorepo est le projet officiel** sur GitHub avec bien plus de features (messages, groups, upload, search, etc.)

2. **SocialVibe/ était un projet de test/dev** créé par erreur au lieu de travailler dans le monorepo

3. **La seule vraie nouveauté est notifications** - Tout le reste existe déjà dans le monorepo (souvent en mieux)

4. **La documentation** est précieuse car elle documente les choix techniques et l'architecture

---

## ✅ CRITÈRES DE SUCCÈS

- [ ] Module notifications backend copié et compile
- [ ] notificationsAPI ajouté au frontend
- [ ] Tests E2E notifications fonctionnels
- [ ] Documentation migrée vers docs/
- [ ] Backend build ✓
- [ ] Frontend build ✓
- [ ] Commit pushed sur origin/develop
- [ ] ~/clawd/SocialVibe/ supprimé (après vérification)
