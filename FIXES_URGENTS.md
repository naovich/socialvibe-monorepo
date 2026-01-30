# 🔧 FIXES URGENTS - PATCHES PRÊTS À APPLIQUER

**Ordre d'application:** Suivre l'ordre numérique pour éviter les conflits.

---

## 1️⃣ FIX AUTH FRONTEND (CRITIQUE)

**Fichier:** `apps/frontend/src/lib/api/auth.ts`

### ❌ AVANT
```typescript
async register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/register', data);
  localStorage.setItem('auth_token', response.data.token);
  localStorage.setItem('auth_user', JSON.stringify(response.data.user));
  return response.data;
},

async login(data: LoginData): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/login', data);
  localStorage.setItem('auth_token', response.data.token);
  localStorage.setItem('auth_user', JSON.stringify(response.data.user));
  return response.data;
},
```

### ✅ APRÈS
```typescript
async register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/register', data);
  // Backend renvoie access_token et refresh_token, pas juste "token"
  localStorage.setItem('auth_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  localStorage.setItem('auth_user', JSON.stringify(response.data.user));
  return response.data;
},

async login(data: LoginData): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/login', data);
  localStorage.setItem('auth_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  localStorage.setItem('auth_user', JSON.stringify(response.data.user));
  return response.data;
},
```

---

## 2️⃣ FIX WEBSOCKET STORAGE KEY

**Fichier:** `apps/frontend/src/store.ts` ligne 218

### ❌ AVANT
```typescript
connectWebSocket: () => {
  const token = localStorage.getItem('access_token');
  if (!token) return;
```

### ✅ APRÈS
```typescript
connectWebSocket: () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return;
```

---

## 3️⃣ IMPLÉMENTER REFRESH TOKEN AUTO

**Fichier:** `apps/frontend/src/lib/api/client.ts`

### ❌ AVANT
```typescript
// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### ✅ APRÈS
```typescript
// Response interceptor - handle errors + auto refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });
        
        // Update tokens
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**⚠️ Important:** Ajouter `import axios from 'axios';` en haut du fichier.

---

## 4️⃣ RETIRER EMAIL DU SELECT PUBLIC

**Fichier:** `apps/backend/src/users/users.service.ts`

### ❌ AVANT (ligne 14-27)
```typescript
async findOne(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true, // ❌ FUITE DE DONNÉES
      name: true,
      username: true,
      avatar: true,
      coverImage: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          friends: true,
        },
      },
    },
  });
```

### ✅ APRÈS
```typescript
async findOne(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      // email: true, ✅ RETIRÉ - email visible uniquement par le user lui-même
      name: true,
      username: true,
      avatar: true,
      coverImage: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          friends: true,
        },
      },
    },
  });
```

**Répéter pour `findByUsername` (ligne 40-56)** - même modification.

---

## 5️⃣ AJOUTER EMAILVERIFIED AU SCHEMA

**Fichier:** `apps/backend/prisma/schema.prisma`

### ❌ AVANT (ligne 13-22)
```prisma
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  password   String
  name       String
  username   String   @unique
  avatar     String?
  coverImage String?
  bio        String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
```

### ✅ APRÈS
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  emailVerified Boolean  @default(false)
  password      String
  name          String
  username      String   @unique
  avatar        String?
  coverImage    String?
  bio           String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
```

**Puis décommenter dans auth.service.ts ligne 328:**

```typescript
// Activer email verification
await this.prisma.user.update({
  where: { id: validToken.userId },
  data: { emailVerified: true },
});
```

**⚠️ Ne pas oublier:**
```bash
cd apps/backend
npx prisma migrate dev --name add_email_verified
npx prisma generate
```

---

## 6️⃣ FIX LIKE ONCASCADE

**Fichier:** `apps/backend/prisma/schema.prisma` ligne 92

### ❌ AVANT
```prisma
model Like {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())

  post   Post   @relation(fields: [postId], references: [id])
  postId String

  user   User   @relation(fields: [userId], references: [id])
  userId String

  @@unique([postId, userId])
}
```

### ✅ APRÈS
```prisma
model Like {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  @@unique([postId, userId])
}
```

**Migration:**
```bash
cd apps/backend
npx prisma migrate dev --name fix_like_cascade
```

---

## 7️⃣ CHANGER JWT SECRET

**Fichier:** `apps/backend/.env`

### ❌ AVANT
```env
JWT_SECRET="socialvibe-super-secret-jwt-key-change-this-in-production"
```

### ✅ APRÈS
```bash
# Générer un secret fort
openssl rand -base64 64
```

Puis copier le résultat dans `.env`:
```env
JWT_SECRET="<ton-secret-généré-ici>"
```

**⚠️ ATTENTION:** Changer le JWT_SECRET invalide tous les tokens existants. Les users seront déconnectés.

---

## 8️⃣ PAGINER MESSAGES.GETMESSAGES

**Fichier:** `apps/backend/src/messages/messages.service.ts` ligne 106

### ❌ AVANT
```typescript
async getMessages(conversationId: string, userId: string) {
  const conversation = await this.prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { id: userId },
      },
    },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
```

### ✅ APRÈS
```typescript
async getMessages(
  conversationId: string,
  userId: string,
  page: number = 1,
  limit: number = 50
) {
  const skip = (page - 1) * limit;
  
  const conversation = await this.prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { id: userId },
      },
    },
    include: {
      messages: {
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' }, // Plus récent en premier
      },
```

**Mettre à jour le controller aussi** (`messages.controller.ts`):
```typescript
@Get(':conversationId')
async getMessages(
  @Param('conversationId') conversationId: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Request() req,
) {
  return this.messagesService.getMessages(
    conversationId,
    req.user.sub,
    page ? parseInt(page) : 1,
    limit ? parseInt(limit) : 50
  );
}
```

---

## 9️⃣ LIMITER COMMENTAIRES DANS POSTS.FINDONE

**Fichier:** `apps/backend/src/posts/posts.service.ts` ligne 119

### ❌ AVANT
```typescript
comments: {
  include: {
    author: {
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
},
```

### ✅ APRÈS
```typescript
comments: {
  take: 20, // Limiter à 20 commentaires
  include: {
    author: {
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
},
```

**Bonus:** Ajouter un endpoint séparé pour paginer les commentaires:
```typescript
// posts.controller.ts
@Get(':id/comments')
async getPostComments(
  @Param('id') postId: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  return this.commentsService.getByPost(
    postId,
    page ? parseInt(page) : 1,
    limit ? parseInt(limit) : 20
  );
}
```

---

## 🔟 AJOUTER INDEX DB CRITIQUES

**Fichier:** `apps/backend/prisma/schema.prisma`

### ❌ AVANT
```prisma
model Comment {
  id        String   @id @default(uuid())
  text      String
  createdAt DateTime @default(now())

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String

  author   User   @relation(fields: [authorId], references: [id])
  authorId String

  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  parentId String?
  replies  Comment[] @relation("CommentReplies")
}
```

### ✅ APRÈS
```prisma
model Comment {
  id        String   @id @default(uuid())
  text      String
  createdAt DateTime @default(now())

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String

  author   User   @relation(fields: [authorId], references: [id])
  authorId String

  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  parentId String?
  replies  Comment[] @relation("CommentReplies")
  
  @@index([postId])
  @@index([authorId])
  @@index([createdAt])
}
```

**Faire pareil pour:**

```prisma
model Like {
  // ...
  @@index([postId])
  @@index([userId])
}

model Notification {
  // ...
  @@index([recipientId])
  @@index([read])
  @@index([createdAt])
}
```

**Migration:**
```bash
cd apps/backend
npx prisma migrate dev --name add_performance_indexes
```

---

## 📋 CHECKLIST D'APPLICATION

```bash
# 1. Frontend fixes (auth + WebSocket)
cd apps/frontend/src/lib/api
# Éditer auth.ts et client.ts

cd apps/frontend/src
# Éditer store.ts

# 2. Backend fixes (schema + services)
cd apps/backend/prisma
# Éditer schema.prisma

cd apps/backend
npx prisma migrate dev --name urgent_fixes
npx prisma generate

# 3. Backend services
cd apps/backend/src/users
# Éditer users.service.ts

cd apps/backend/src/posts
# Éditer posts.service.ts

cd apps/backend/src/messages
# Éditer messages.service.ts et messages.controller.ts

cd apps/backend/src/auth
# Éditer auth.service.ts (décommenter ligne 328)

# 4. Env
cd apps/backend
# Éditer .env (JWT_SECRET)

# 5. Rebuild
cd /home/naovich/clawd/socialvibe-monorepo
npm run build

# 6. Redémarrer
docker-compose restart
npm run dev # Backend et Frontend
```

---

## 🧪 TESTS APRÈS FIXES

### Test 1: Auth fonctionne
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "username": "testuser"
  }'
```

**Attendu:** `{"access_token": "...", "refresh_token": "...", "user": {...}}`

### Test 2: Refresh token
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<refresh_token_du_test1>"}'
```

**Attendu:** `{"access_token": "...", "refresh_token": "..."}`

### Test 3: Email non exposé
```bash
curl http://localhost:3000/users/username/testuser
```

**Attendu:** Pas de champ `email` dans la réponse.

### Test 4: Messages paginés
```bash
curl "http://localhost:3000/messages/<conversation_id>?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

**Attendu:** Max 10 messages.

---

## ⏱️ TEMPS ESTIMÉ

- **Fixes 1-3** (Auth frontend): 15 min
- **Fix 4** (Email select): 5 min
- **Fix 5** (Schema emailVerified): 10 min
- **Fix 6** (Cascade): 5 min
- **Fix 7** (JWT secret): 2 min
- **Fixes 8-9** (Pagination): 20 min
- **Fix 10** (Index): 10 min
- **Tests:** 15 min

**TOTAL: ~1h30**

---

**Après ces fixes, l'app sera vraiment fonctionnelle et sécurisée pour des tests réels ! 🚀**
