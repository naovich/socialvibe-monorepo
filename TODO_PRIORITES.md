# ✅ TODO - SOCIALVIBE
**Généré:** 2026-01-29 14:15  
**Source:** Audit Complet

---

## 🔴 URGENT (À faire MAINTENANT)

### 1. ✅ Prisma Generate Automatique
**Temps:** 5 min  
**Commandes:**
```bash
cd apps/backend
# Ajouter postinstall script
npm pkg set scripts.postinstall="prisma generate"
npm install
```

---

### 2. ✅ Appliquer Migrations
**Temps:** 5 min  
**Commandes:**
```bash
cd apps/backend
npx prisma migrate dev --name add-messages-and-groups
npx prisma generate
```

---

### 3. 🟡 Rate Limiting
**Temps:** 30 min  
**Steps:**
```bash
cd apps/backend
npm install @nestjs/throttler
```

**Code:**
```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    // ...
  ],
})
```

```typescript
// auth.controller.ts
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 req/min
@Post('login')
login() {}
```

---

### 4. 🟡 Password Reset
**Temps:** 1h30  
**Tasks:**
- [ ] Create PasswordResetToken model (Prisma)
- [ ] POST /auth/forgot-password endpoint
- [ ] POST /auth/reset-password endpoint
- [ ] Email service (NodeMailer)
- [ ] Frontend forgot-password page

---

### 5. 🟡 Fix Posts Service - Likes
**Temps:** 10 min  
**Fichier:** `apps/backend/src/posts/posts.service.ts:95`
```typescript
// ❌ Avant
const postsWithLiked = posts.map((post) => ({
  ...post,
  isLiked: Array.isArray(post.likes) ? post.likes.length > 0 : false,
  likes: undefined,
}));

// ✅ Après
const postsWithLiked = posts.map((post) => {
  const { likes, ...rest } = post;
  return {
    ...rest,
    isLiked: Array.isArray(likes) ? likes.length > 0 : false,
  };
});
```

---

## 🟡 IMPORTANT (Cette Semaine)

### 6. 🧪 Tests Backend
**Temps:** 2h  
**À créer:**
- [ ] `groups.service.spec.ts`
- [ ] `messages.service.spec.ts`
- [ ] `stories.service.spec.ts`
- [ ] `friendships.service.spec.ts`

**Target:** 60% coverage

---

### 7. 🧪 Tests Frontend E2E
**Temps:** 1h30  
**À créer:**
- [ ] `messages.spec.ts`
- [ ] `groups.spec.ts`
- [ ] `profile-edit.spec.ts`

---

### 8. ⚡ Code Splitting
**Temps:** 30 min  
**Fichier:** `apps/frontend/src/Router.tsx`
```typescript
import { lazy, Suspense } from 'react';

const Chat = lazy(() => import('./pages/Chat'));
const Groups = lazy(() => import('./pages/Groups'));
const Group = lazy(() => import('./pages/Group'));
const Messages = lazy(() => import('./pages/Messages'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/chat/:id" element={<Chat />} />
</Suspense>
```

---

### 9. 🔒 Input Sanitization
**Temps:** 30 min  
**Frontend:**
```bash
npm install dompurify @types/dompurify
```
```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
};
```

---

### 10. 📊 Error Handler Global
**Temps:** 45 min  
**Backend:**
```typescript
// filters/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    // Log error
    console.error('[ERROR]', {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message,
      stack: exception instanceof Error ? exception.stack : null,
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

**Frontend:**
```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Send to Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 🟢 NICE TO HAVE (Plus Tard)

### 11. 📝 Swagger API Docs
**Temps:** 1h  
```bash
cd apps/backend
npm install @nestjs/swagger
```

---

### 12. 📊 Logging (Winston)
**Temps:** 45 min  
```bash
npm install winston nest-winston
```

---

### 13. 🔍 Monitoring (Sentry)
**Temps:** 30 min  
```bash
npm install @sentry/node @sentry/browser
```

---

### 14. 🚀 Deploy
**Temps:** 2h  
**Backend:** Railway/Render  
**Frontend:** Vercel  
**Database:** Neon/Supabase

---

### 15. 📱 PWA Manifest
**Temps:** 30 min  
```json
// public/manifest.json
{
  "name": "SocialVibe",
  "short_name": "SocialVibe",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#050505",
  "theme_color": "#FF6B35",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 📅 PLANNING SUGGÉRÉ

### Jour 1 (Aujourd'hui)
- [x] Audit complet
- [ ] Fix Prisma (5min)
- [ ] Migrations (5min)
- [ ] Rate Limiting (30min)
- [ ] Fix Likes (10min)
- [ ] Tests Backend (2h)
**Total:** ~3h

---

### Jour 2
- [ ] Password Reset (1h30)
- [ ] Code Splitting (30min)
- [ ] Error Handler (45min)
- [ ] Tests Frontend (1h30)
**Total:** ~4h15

---

### Jour 3
- [ ] Input Sanitization (30min)
- [ ] Deploy Staging (2h)
- [ ] Final tests (1h)
- [ ] Documentation (30min)
**Total:** ~4h

---

### Semaine 2
- [ ] Monitoring (Sentry)
- [ ] Logging (Winston)
- [ ] PWA
- [ ] Swagger Docs
- [ ] Performance optimization

---

## ✅ CHECKLIST AVANT DEPLOY

### Must Have
- [ ] Prisma généré automatiquement
- [ ] Migrations appliquées
- [ ] Rate limiting activé
- [ ] Password reset fonctionnel
- [ ] Tests backend >60%
- [ ] Tests frontend >40%
- [ ] Error handling global
- [ ] CORS configuré pour production
- [ ] JWT secret fort
- [ ] SSL/HTTPS

### Should Have
- [ ] Code splitting
- [ ] Input sanitization
- [ ] Monitoring (Sentry)
- [ ] Health check endpoint
- [ ] Logging structuré

### Nice to Have
- [ ] Swagger docs
- [ ] PWA manifest
- [ ] CI/CD pipeline
- [ ] Staging environment

---

**Prêt à commencer ?** 🚀
**Première action:** `cd apps/backend && npm pkg set scripts.postinstall="prisma generate"`
