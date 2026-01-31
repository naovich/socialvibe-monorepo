# ✅ PLAN D'ACTION - SocialVibe

**Basé sur**: Audit du 31/01/2025  
**Objectif**: Rendre l'application production-ready  
**Timeline**: 4 semaines  

---

## 🔥 SEMAINE 1 - SÉCURITÉ CRITIQUE

### Jour 1-2: Migration JWT vers Cookies

**Backend (NestJS)**
```bash
cd backend
npm install cookie-parser
```

```typescript
// main.ts
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// auth/auth.service.ts
async login(user: any, res: Response) {
  const payload = { email: user.email, sub: user.id };
  const token = this.jwtService.sign(payload);
  
  res.cookie('access_token', token, {
    httpOnly: true,      // ✅ Protection XSS
    secure: true,        // ✅ HTTPS uniquement
    sameSite: 'strict',  // ✅ Protection CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
  });
  
  return { user };
}
```

**Frontend**
```typescript
// lib/api.ts
api.interceptors.request.use((config) => {
  // ❌ SUPPRIMER CETTE LIGNE
  // const token = localStorage.getItem('token');
  
  // ✅ Le cookie est envoyé automatiquement
  config.withCredentials = true;
  return config;
});

// services/authService.ts
async login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post('/auth/login', data, {
    withCredentials: true  // ✅ Inclure cookies
  });
  
  // ❌ SUPPRIMER localStorage.setItem('token')
  // ✅ Stocker uniquement les infos user (pas sensibles)
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data;
}
```

**Tests**
```bash
# Vérifier que le cookie est bien set
curl -c cookies.txt -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

cat cookies.txt
# Doit contenir: access_token=... HttpOnly Secure
```

✅ **Checklist**
- [ ] Backend: cookie-parser installé
- [ ] Backend: JWT set en cookie HttpOnly
- [ ] Backend: CORS credentials activé
- [ ] Frontend: `withCredentials: true` partout
- [ ] Frontend: localStorage.removeItem('token') partout
- [ ] Testé avec curl + browser DevTools
- [ ] Documentation mise à jour

---

### Jour 3: CSP Headers + Rate Limiting

**Content Security Policy**
```bash
cd backend
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Vite dev mode
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3000"],
    }
  }
}));
```

**Rate Limiting Frontend**
```bash
cd frontend
npm install lodash
```

```typescript
// utils/debounce.ts
import { debounce } from 'lodash';

export const createDebouncedAction = <T extends (...args: any[]) => any>(
  fn: T,
  wait = 500
) => {
  return debounce(fn, wait, { leading: true, trailing: false });
};

// PostCard.tsx
const debouncedLike = useMemo(
  () => createDebouncedAction((postId: string) => toggleLike(postId)),
  []
);
```

✅ **Checklist**
- [ ] Helmet installé et configuré
- [ ] CSP headers testés
- [ ] Rate limiting sur actions critiques (like, comment, post)
- [ ] Toast notification sur action trop rapide

---

### Jour 4-5: Audit Sécurité + Fixes

**Input Validation Backend**
```typescript
// dto/create-post.dto.ts
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2200)
  caption: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}
```

**Sanitization Frontend (défensive)**
```bash
npm install dompurify
npm install -D @types/dompurify
```

```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],  // Pas de HTML du tout
    ALLOWED_ATTR: []
  });
};

// CreatePostModal.tsx
const handleSubmit = async () => {
  await addPost({
    caption: sanitizeHtml(caption),
    image: images[0]
  });
};
```

**Checklist Sécurité Complète**
- [ ] Pas de `eval()` dans le code (✅ vérifié: 0)
- [ ] Pas de `dangerouslySetInnerHTML` (✅ vérifié: 0)
- [ ] Tous les DTOs validés (class-validator)
- [ ] CORS restrictif (pas de `*`)
- [ ] HTTPS forcé en production
- [ ] Environment variables sécurisées (.env.example)
- [ ] Secrets pas dans le code (git-secrets)
- [ ] Dependencies audit (npm audit fix)

```bash
npm audit
npm audit fix
```

✅ **Deliverable Semaine 1**
- [ ] JWT en cookies HttpOnly ✅
- [ ] CSP headers actifs ✅
- [ ] Rate limiting frontend ✅
- [ ] Audit sécurité passé ✅
- [ ] 0 vulnérabilités critiques npm audit ✅

---

## 🧪 SEMAINE 2 - TESTS UNITAIRES

### Jour 1: Setup Testing Infrastructure

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom
```

**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

**src/test/setup.ts**
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
afterEach(() => cleanup());
```

**package.json**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

✅ **Checklist**
- [ ] Vitest installé et configuré
- [ ] Test de base qui passe (`npm test`)
- [ ] Coverage setup (`npm run test:coverage`)

---

### Jour 2-3: Tests Services (authService, postsService)

**src/services/authService.test.ts**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from './authService';
import { api } from '../lib/api';

vi.mock('../lib/api');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should store user on successful login', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@test.com', name: 'Test' }
        }
      };
      
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);
      
      await authService.login({ email: 'test@test.com', password: 'test' });
      
      expect(localStorage.getItem('user')).toBeTruthy();
    });

    it('should throw on invalid credentials', async () => {
      vi.mocked(api.post).mockRejectedValueOnce({
        response: { status: 401, data: { message: 'Invalid credentials' }}
      });
      
      await expect(
        authService.login({ email: 'wrong', password: 'wrong' })
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should clear storage', () => {
      localStorage.setItem('user', '{"id":"1"}');
      authService.logout();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if user exists', () => {
      localStorage.setItem('user', '{"id":"1"}');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false if no user', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
```

**Cible**: 80% coverage pour authService, postsService, commentsService

✅ **Checklist**
- [ ] authService.test.ts (15 tests)
- [ ] postsService.test.ts (20 tests)
- [ ] commentsService.test.ts (15 tests)
- [ ] usersService.test.ts (10 tests)
- [ ] Coverage > 80% sur services

---

### Jour 4-5: Tests Composants (Login, PostCard)

**src/pages/Login.test.tsx**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { useSocialStore } from '../store';

vi.mock('../store');

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    vi.mocked(useSocialStore).mockReturnValue({
      login: vi.fn(),
      isLoading: false
    });
  });

  it('should render login form', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should show error on empty submit', async () => {
    renderLogin();
    const user = userEvent.setup();
    
    await user.click(screen.getByRole('button', { name: /log in/i }));
    
    expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
  });

  it('should call login on valid submit', async () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    vi.mocked(useSocialStore).mockReturnValue({
      login: mockLogin,
      isLoading: false
    });
    
    renderLogin();
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
    });
  });
});
```

**Cible**: 60% coverage composants critiques

✅ **Checklist**
- [ ] Login.test.tsx (10 tests)
- [ ] Register.test.tsx (12 tests)
- [ ] PostCard.test.tsx (15 tests)
- [ ] CreatePostModal.test.tsx (10 tests)
- [ ] Coverage > 60% sur composants

---

✅ **Deliverable Semaine 2**
- [ ] Vitest configuré ✅
- [ ] 50+ tests unitaires ✅
- [ ] Coverage: Services 80%, Composants 60% ✅
- [ ] CI/CD avec tests auto (GitHub Actions)

---

## 🏗️ SEMAINE 3 - ARCHITECTURE CLEANUP

### Jour 1: Supprimer Duplication API

**1. Backup**
```bash
cp src/services/api.ts src/services/api.ts.OLD
```

**2. Identifier usages**
```bash
grep -r "from.*services/api" src/
# Remplacer par services spécifiques
```

**3. Migration**
```typescript
// Avant
import { authAPI } from './services/api';
await authAPI.login(email, password);

// Après
import { authService } from './services/authService';
await authService.login({ email, password });
```

**4. Supprimer**
```bash
rm src/services/api.ts
```

✅ **Checklist**
- [ ] Tous les imports migrés
- [ ] Tests passent
- [ ] api.ts supprimé
- [ ] Commit "chore: remove duplicate API services"

---

### Jour 2-3: Remplacer Mock Data

**Stories**
```typescript
// store.ts
// Avant
stories: mockStories.stories,

// Après
stories: [],  // Vide au départ

// Ajouter action
fetchStories: async () => {
  const stories = await storiesService.getStories();
  set({ stories });
}
```

**Backend à implémenter**
```typescript
// backend/src/stories/stories.service.ts
@Injectable()
export class StoriesService {
  async getUserStories(userId: string) {
    return this.prisma.story.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
```

**Notifications**
```typescript
// Idem pour notifications
fetchNotifications: async () => {
  const notifications = await notificationsService.getNotifications();
  set({ notifications });
}
```

✅ **Checklist**
- [ ] Backend: stories endpoints
- [ ] Backend: notifications endpoints
- [ ] Frontend: fetchStories() implémenté
- [ ] Frontend: fetchNotifications() implémenté
- [ ] Mock imports supprimés
- [ ] Tout fonctionne avec vraies données

---

### Jour 4-5: Migrer vers React Query

**Installation**
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**Setup**
```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 min
      cacheTime: 10 * 60 * 1000, // 10 min
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Router />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

**Migration du store**
```typescript
// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const usePosts = (page = 1) => {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => postsService.getPosts(page, 10),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postsService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => postsService.toggleLike(postId),
    onMutate: async (postId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      
      const previousPosts = queryClient.getQueryData(['posts']);
      
      queryClient.setQueryData(['posts'], (old: any) => {
        return {
          ...old,
          data: old.data.map((post: any) =>
            post.id === postId
              ? { ...post, _count: { ...post._count, likes: post._count.likes + 1 }}
              : post
          )
        };
      });
      
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
  });
};

// Home.tsx
const { data, isLoading } = usePosts(1);
const { mutate: createPost } = useCreatePost();
const { mutate: toggleLike } = useToggleLike();
```

✅ **Checklist**
- [ ] React Query installé
- [ ] Posts migré vers React Query
- [ ] Comments migré
- [ ] Optimistic updates fonctionnent
- [ ] Zustand store simplifié (uniquement UI state)
- [ ] DevTools activés

---

✅ **Deliverable Semaine 3**
- [ ] api.ts supprimé ✅
- [ ] Mock data remplacé ✅
- [ ] React Query intégré ✅
- [ ] Optimistic UI fonctionne ✅
- [ ] Code 30% plus propre ✅

---

## ⚡ SEMAINE 4 - PERFORMANCE & MONITORING

### Jour 1-2: Lazy Loading

**Routes**
```typescript
// Router.tsx
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Composants lourds**
```typescript
// App.tsx
const CreatePostModal = lazy(() => import('./components/feed/CreatePostModal'));
const NotificationCenter = lazy(() => import('./components/layout/NotificationCenter'));
```

✅ **Checklist**
- [ ] Routes lazy loaded
- [ ] Modals lazy loaded
- [ ] Skeleton loaders ajoutés
- [ ] Bundle size réduit de 20%+

---

### Jour 3: Infinite Scroll

```bash
npm install react-intersection-observer
```

```typescript
// Home.tsx
import { useInView } from 'react-intersection-observer';

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 1 }) => postsService.getPosts(pageParam, 10),
  getNextPageParam: (lastPage, pages) => {
    return lastPage.meta.page < lastPage.meta.totalPages
      ? lastPage.meta.page + 1
      : undefined;
  },
});

const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
}, [inView, hasNextPage, isFetchingNextPage]);

return (
  <>
    {data?.pages.map((page) =>
      page.data.map((post) => <PostCard key={post.id} post={post} />)
    )}
    <div ref={ref} className="h-10" /> {/* Sentinel */}
  </>
);
```

✅ **Checklist**
- [ ] Infinite scroll implémenté
- [ ] Sentinel element invisible
- [ ] Smooth loading (pas de flicker)

---

### Jour 4: Image Optimization

```typescript
// utils/imageOptimizer.ts
export const getOptimizedImageUrl = (
  url: string,
  width: number,
  quality = 80
): string => {
  // Utiliser Cloudinary, Imgix, ou image CDN
  return `${url}?w=${width}&q=${quality}&auto=format`;
};

// PostCard.tsx
<img
  src={getOptimizedImageUrl(post.user.avatar, 40)}
  srcSet={`
    ${getOptimizedImageUrl(post.user.avatar, 40)} 1x,
    ${getOptimizedImageUrl(post.user.avatar, 80)} 2x
  `}
  loading="lazy"
  alt={post.user.name}
/>
```

✅ **Checklist**
- [ ] Images lazy loaded
- [ ] Responsive images (srcset)
- [ ] WebP/AVIF support
- [ ] Placeholder blur

---

### Jour 5: Monitoring

**Sentry**
```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});

// Error boundary
<Sentry.ErrorBoundary fallback={<ErrorPage />}>
  <Router />
</Sentry.ErrorBoundary>
```

**Web Vitals**
```typescript
// utils/vitals.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onLCP(onPerfEntry);
  }
};

// main.tsx
reportWebVitals((metric) => {
  console.log(metric);
  // Envoyer à analytics
});
```

✅ **Checklist**
- [ ] Sentry configuré
- [ ] Web Vitals tracking
- [ ] Lighthouse score > 90
- [ ] Bundle analyzer (vite-plugin-bundle-analyzer)

---

✅ **Deliverable Semaine 4**
- [ ] Lazy loading activé ✅
- [ ] Infinite scroll fonctionne ✅
- [ ] Images optimisées ✅
- [ ] Monitoring actif (Sentry) ✅
- [ ] Lighthouse > 90 ✅

---

## 🎯 RÉSULTAT FINAL (Après 4 Semaines)

### Avant Audit
```
Sécurité:     ██░░░ 2/5  ❌
Tests:        █░░░░ 1/5  ❌
Performance:  ███░░ 3/5  ⚠️
Code Quality: ███░░ 3/5  ⚠️

SCORE: 16/30 (53%)
```

### Après Action Plan
```
Sécurité:     █████ 5/5  ✅
Tests:        ████░ 4/5  ✅
Performance:  ████░ 4/5  ✅
Code Quality: ████░ 4/5  ✅

SCORE: 26/30 (87%)  🎉
```

---

## 📋 CHECKLIST FINALE PRODUCTION

### Sécurité ✅
- [x] JWT en cookies HttpOnly
- [x] CSP headers configurés
- [x] Rate limiting actif
- [x] Input validation (frontend + backend)
- [x] HTTPS forcé
- [x] npm audit 0 vulnérabilités

### Tests ✅
- [x] Coverage > 80% services
- [x] Coverage > 60% composants
- [x] CI/CD avec tests auto
- [x] E2E smoke tests (critiques)

### Performance ✅
- [x] Lighthouse > 90
- [x] Lazy loading routes
- [x] Infinite scroll
- [x] Images optimisées
- [x] Bundle < 200KB gzipped

### Monitoring ✅
- [x] Sentry error tracking
- [x] Web Vitals
- [x] Analytics
- [x] Logging centralisé

### Documentation ✅
- [x] README à jour
- [x] API docs (Swagger)
- [x] Architecture diagram
- [x] Deployment guide

---

## 🚀 DÉPLOIEMENT

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Railway/Render)
```bash
git push railway main
```

### Database (Supabase)
```bash
# Configurer connection string
DATABASE_URL="postgresql://..."
```

---

**Vous êtes prêt pour la prod ! 🎉**

---

*Créé le 31/01/2025 | Basé sur AUDIT_RAPPORT_COMPLET.md*
