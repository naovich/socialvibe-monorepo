# 🔍 CODE REVIEW EXPERT - SOCIALVIBE

**Date:** 2026-01-30  
**Reviewer:** HAL (Mode Expert)  
**Score actuel:** 100/100  
**Score réel après audit:** ~65/100  

---

## ⚠️ RÉSUMÉ EXÉCUTIF

L'application SocialVibe est **fonctionnelle** mais contient **des bugs critiques** et des **failles de sécurité majeures** qui la rendent **NON production-ready** dans son état actuel.

### Verdict
- ✅ **Structure:** Bonne architecture NestJS + React
- ❌ **Sécurité:** Failles majeures (XSS, auth cassée, fuites de données)
- ❌ **Performance:** Problèmes critiques (N+1, pas de pagination)
- ❌ **Bugs:** Auth frontend cassée, WebSocket incohérent
- ⚠️ **Tests:** Stub uniquement, pas de vrais tests

---

## 🔴 BUGS CRITIQUES (CASSENT L'APP)

### 1. **AUTH FRONTEND COMPLÈTEMENT CASSÉE** 🔥
**Localisation:** `apps/frontend/src/lib/api/auth.ts`

**Problème:**
```typescript
// Backend renvoie:
{ access_token: "...", refresh_token: "...", user: {...} }

// Frontend attend:
localStorage.setItem('auth_token', response.data.token); // ❌ token n'existe pas !
```

**Impact:** Login et Register crashent immédiatement.

**Fix:**
```typescript
// auth.ts ligne 32 et 40
localStorage.setItem('auth_token', response.data.access_token);
localStorage.setItem('refresh_token', response.data.refresh_token);
```

---

### 2. **WEBSOCKET NE SE CONNECTE JAMAIS** 🔥
**Localisation:** `apps/frontend/src/store.ts` ligne 218

**Problème:**
```typescript
// Store cherche:
const token = localStorage.getItem('access_token'); // ❌ Clé qui n'existe pas

// Auth stocke dans:
localStorage.setItem('auth_token', ...); // ❌ Clé différente
```

**Impact:** WebSocket ne se connecte jamais, notifications/messages en temps réel ne fonctionnent pas.

**Fix:**
```typescript
const token = localStorage.getItem('auth_token');
```

---

### 3. **REFRESH TOKEN NON GÉRÉ** 🔥
**Localisation:** `apps/frontend/src/lib/api/client.ts`

**Problème:**
- Access token expire après 15 minutes
- Refresh token valide 7 jours
- Aucune logique pour refresh automatiquement
- **Résultat:** User déconnecté toutes les 15 minutes

**Fix nécessaire:**
```typescript
// client.ts - interceptor 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post('/auth/refresh', { refreshToken });
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        error.config.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(error.config);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 🔐 FAILLES DE SÉCURITÉ MAJEURES

### 4. **FUITE DE DONNÉES PERSONNELLES** 🔥
**Localisation:** `apps/backend/src/users/users.service.ts`

**Problème:**
```typescript
// findOne et findByUsername exposent l'EMAIL publiquement
select: {
  id: true,
  email: true, // ❌ FUITE ! L'email est visible par tout le monde
  name: true,
  // ...
}
```

**Impact:** N'importe qui peut récupérer l'email de n'importe quel user.

**Fix:**
```typescript
// Retirer email du select, ou le retourner uniquement si userId === currentUserId
select: {
  id: true,
  // email: true, ❌ RETIRER
  name: true,
  username: true,
  avatar: true,
}
```

---

### 5. **JWT SECRET FAIBLE** 🔥
**Localisation:** `apps/backend/.env`

**Problème:**
```env
JWT_SECRET="socialvibe-super-secret-jwt-key-change-this-in-production"
```

**Impact:** Secret prévisible, potentiellement crackable.

**Fix:**
```bash
# Générer un secret fort
openssl rand -base64 64
```

---

### 6. **PASSWORD RESET VULNÉRABLE À DOS** ⚠️
**Localisation:** `apps/backend/src/auth/auth.service.ts` ligne 218

**Problème:**
```typescript
// Boucle sur TOUS les tokens non-expirés et fait bcrypt.compare
for (const t of tokens) {
  const isValid = await bcrypt.compare(token, t.token);
  // ...
}
```

**Impact:** Si 1000 tokens actifs, 1000 bcrypt.compare = très lent. Attaque DoS facile.

**Fix:**
```typescript
// Hasher le token avant de chercher en DB
const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
const validToken = await this.prisma.passwordResetToken.findUnique({
  where: { token: hashedToken }
});
```

---

### 7. **EMAIL VERIFICATION NE FAIT RIEN** 🔥
**Localisation:** `apps/backend/src/auth/auth.service.ts` ligne 328

**Problème:**
```typescript
// Code commenté !
// await this.prisma.user.update({
//   where: { id: validToken.userId },
//   data: { emailVerified: true },
// });
```

**Impact:** La vérification email ne met rien à jour. Fonctionnalité inutile.

**Fix:**
1. Ajouter `emailVerified Boolean @default(false)` au schema User
2. Décommenter le code
3. Run migration

---

## 🐛 BUGS PERFORMANCE CRITIQUES

### 8. **N+1 PROBLEM DANS GROUPS.FINDALL** 🔥
**Localisation:** `apps/backend/src/groups/groups.service.ts` ligne 67-78

**Problème:**
```typescript
// Pour CHAQUE groupe, on fait une requête DB supplémentaire
groups.map(async (group) => {
  const isMember = await this.prisma.group.findFirst({...}); // ❌ N+1 !
});
```

**Impact:** Si 100 groupes → 101 requêtes DB au lieu de 1.

**Fix:**
```typescript
// Récupérer isMember en 1 seule requête avec un join
const membershipMap = await this.prisma.group.findMany({
  where: { 
    id: { in: groups.map(g => g.id) },
    members: { some: { id: userId } }
  },
  select: { id: true }
});
```

---

### 9. **POSTS.FINDONE CHARGE TOUS LES COMMENTAIRES** 🔥
**Localisation:** `apps/backend/src/posts/posts.service.ts` ligne 119

**Problème:**
```typescript
comments: {
  include: {...},
  orderBy: { createdAt: 'desc' },
  // ❌ Pas de `take` ! Si 10000 commentaires, ça charge tout
}
```

**Impact:** OOM (Out of Memory) si post viral avec beaucoup de commentaires.

**Fix:**
```typescript
comments: {
  take: 10,
  include: {...},
  orderBy: { createdAt: 'desc' },
}
```

---

### 10. **MESSAGES SANS PAGINATION** 🔥
**Localisation:** `apps/backend/src/messages/messages.service.ts` ligne 126

**Problème:**
```typescript
messages: {
  include: {...},
  orderBy: { createdAt: 'asc' },
  // ❌ Pas de pagination
}
```

**Impact:** Conversations anciennes vont charger 50000+ messages d'un coup.

**Fix:**
```typescript
async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
  // ...
  messages: {
    skip: (page - 1) * limit,
    take: limit,
    include: {...},
    orderBy: { createdAt: 'desc' }, // Plus récent en premier
  }
}
```

---

### 11. **NOTIFIE TOUS LES USERS À CHAQUE POST** ⚠️
**Localisation:** `apps/backend/src/posts/posts.service.ts` ligne 34

**Problème:**
```typescript
// Envoie WebSocket à TOUS les users connectés
this.eventsGateway.notifyNewPost({...});
```

**Impact:** Ne scale pas. Si 10000 users connectés, 10000 notifications à chaque post.

**Fix:**
```typescript
// Notifier uniquement les followers
const followers = await this.prisma.friendship.findMany({
  where: { friendId: userId, status: 'ACCEPTED' },
  select: { userId: true }
});
followers.forEach(f => {
  this.eventsGateway.notifyUser(f.userId, 'post:new', post);
});
```

---

## 🗄️ PROBLÈMES DATABASE

### 12. **MANQUE D'INDEX CRITIQUES** ⚠️
**Localisation:** `apps/backend/prisma/schema.prisma`

**Problème:**
```prisma
model Comment {
  postId String // ❌ Pas d'index
  authorId String // ❌ Pas d'index
}

model Like {
  postId String // ❌ Pas d'index
  userId String // ❌ Pas d'index
}

model Notification {
  recipientId String // ❌ Pas d'index
  read Boolean // ❌ Pas d'index
}
```

**Impact:** Requêtes lentes sur tables volumineuses.

**Fix:**
```prisma
model Comment {
  // ...
  @@index([postId])
  @@index([authorId])
}

model Like {
  // ...
  @@index([postId])
  @@index([userId])
}

model Notification {
  // ...
  @@index([recipientId, read])
}
```

---

### 13. **LIKE.POST MANQUE ONCASCADE** ⚠️
**Localisation:** `schema.prisma` ligne 92

**Problème:**
```prisma
post Post @relation(fields: [postId], references: [id])
// ❌ Manque onDelete: Cascade
```

**Impact:** Si post supprimé, likes orphelins causent des erreurs.

**Fix:**
```prisma
post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
```

---

### 14. **USER.EMAILVERIFIED N'EXISTE PAS** 🔥
**Problème:** Code auth essaie de mettre à jour un champ qui n'existe pas.

**Fix:**
```prisma
model User {
  // ...
  emailVerified Boolean @default(false)
}
```

---

## 📊 INCOHÉRENCES LOGIQUES

### 15. **FRIENDSHIP AUTO-ACCEPT** ⚠️
**Localisation:** `apps/backend/src/users/users.service.ts` ligne 145

**Problème:**
```typescript
status: 'ACCEPTED', // Auto-accept
```

**Mais:** Le model a `status: PENDING | ACCEPTED | BLOCKED`

**Impact:** Logique incohérente. Si c'est un follow, pourquoi PENDING existe ?

**Fix:**
Décider si c'est:
- **Follow system** → Retirer status, auto-follow
- **Friend request system** → status: 'PENDING', accepter manuellement

---

### 16. **CONVERSATION RACE CONDITION** ⚠️
**Localisation:** `apps/backend/src/messages/messages.service.ts` ligne 16

**Problème:**
```typescript
// Si 2 users appellent getOrCreateConversation simultanément, 2 conversations créées
const existing = await this.prisma.conversation.findFirst({...});
if (existing) return existing;
return this.prisma.conversation.create({...}); // ❌ Race condition
```

**Fix:**
```typescript
// Upsert avec contrainte unique
await this.prisma.conversation.upsert({
  where: {
    participants_userId1_userId2: {
      userId1: Math.min(userId, recipientId),
      userId2: Math.max(userId, recipientId),
    }
  },
  create: {...},
  update: {}
});
```
(Nécessite migration pour ajouter contrainte unique)

---

## 🧪 TESTS

### 17. **PAS DE VRAIS TESTS** ⚠️
**Localisation:** Tous les `.spec.ts`

**Problème:**
```typescript
it("should be defined", () => {
  expect(service).toBeDefined();
}); // ❌ C'est tout !
```

**Impact:** Aucune couverture de test réelle.

---

## 🎯 MANQUES FONCTIONNELS

### 18. **GROUP JOIN REQUESTS IMPOSSIBLE** ⚠️
- Groupes privés existent
- Mais aucun moyen de demander à rejoindre
- `join()` rejette avec ForbiddenException

**Solution nécessaire:** Table `GroupJoinRequest`

---

### 19. **PAS DE LIMIT SUR SEARCH** ⚠️
**Localisation:** `users.service.ts` ligne 92

```typescript
async search(query: string, limit: number = 20) {
  // Bon, mais pas de pagination
}
```

**Manque:** Page parameter

---

### 20. **GETMEMBERS LIMITE À 20 SANS LE DIRE** ⚠️
**Localisation:** `groups.service.ts` ligne 121

```typescript
members: {
  select: {...},
  take: 20, // ❌ Frontend ne sait pas qu'il y en a plus
}
```

---

## 📋 PLAN DE CORRECTIONS PAR PRIORITÉ

### 🔴 URGENT (Blocants)
1. ✅ **Fix auth frontend** (token → access_token)
2. ✅ **Fix WebSocket storage key** (access_token → auth_token)
3. ✅ **Implémenter refresh token logic**
4. ✅ **Retirer email du select public**
5. ✅ **Ajouter emailVerified au schema**
6. ✅ **Fix Like onDelete Cascade**

### 🟠 IMPORTANT (Performance)
7. ✅ **Paginer messages.getMessages()**
8. ✅ **Paginer posts.findOne() commentaires**
9. ✅ **Fix N+1 dans groups.findAll()**
10. ✅ **Ajouter index DB critiques**
11. ✅ **Limiter notifyNewPost aux followers**

### 🟡 MOYEN (Sécurité)
12. ✅ **Changer JWT_SECRET**
13. ✅ **Fix password reset DoS** (hash token)
14. ✅ **Fix email verification DoS**

### 🟢 NICE TO HAVE
15. ⚠️ **Clarifier logique friendship vs follow**
16. ⚠️ **Implémenter GroupJoinRequest**
17. ⚠️ **Écrire vrais tests**
18. ⚠️ **Ajouter pagination partout**

---

## 📊 SCORE RÉVISÉ

| Catégorie | Score Actuel | Score Réel | Raison |
|-----------|--------------|------------|--------|
| **Features** | 20/20 | 18/20 | Fonctionnalités présentes mais incomplètes (group requests) |
| **Technical** | 20/20 | 12/20 | Auth cassée, bugs critiques, N+1 problems |
| **Security** | 20/20 | 8/20 | Fuites de données, JWT faible, DoS possible |
| **Performance** | 20/20 | 10/20 | Pas de pagination, N+1, charge tout en mémoire |
| **Testing** | 20/20 | 5/20 | Stub seulement, 0 couverture réelle |
| **Infrastructure** | 20/20 | 18/20 | CI/CD OK, mais tests ne testent rien |
| **TOTAL** | **100/100** | **~65/100** | **Fonctionnel mais pas production-ready** |

---

## 🎯 RECOMMENDATION FINALE

### ✅ Ce qui est bon
- Structure NestJS propre
- Architecture modulaire
- Docker setup correct
- CI/CD pipeline présent
- Monitoring (Winston + Sentry)

### ❌ Avant production
1. **Fixer les 6 bugs URGENT** (auth, sécurité)
2. **Ajouter pagination partout**
3. **Fixer N+1 problems**
4. **Écrire tests E2E critiques** (auth, posts, messages)
5. **Audit sécurité complet**

### Timeline estimée
- **Fixes URGENT:** 4-6h
- **Fixes IMPORTANT:** 6-8h
- **Tests minimaux:** 4-6h
- **Total:** ~2-3 jours de dev

---

**Conclusion:** L'app est **bien structurée** mais contient **trop de bugs critiques** pour être déployée en production. Après corrections urgentes, elle sera solide.

**Prochaine étape recommandée:** Fixer les 6 bugs URGENT en priorité, puis tester manuellement auth + messages + posts.
