# SocialVibe - Social Media Platform

## Project Overview

SocialVibe is a **full-stack social media platform** built with modern web technologies. It features real-time messaging, posts, stories, groups, and friendships in a monorepo architecture.

## Tech Stack

### Backend
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via Prisma ORM
- **Real-time:** Socket.IO (WebSockets)
- **Authentication:** JWT (access + refresh tokens)
- **API Docs:** Swagger/OpenAPI
- **Testing:** Jest (unit + integration)
- **E2E:** Playwright

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **State:** Zustand
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Testing:** Vitest + Testing Library

### Infrastructure
- **Monorepo:** npm workspaces
- **Package Manager:** npm
- **Code Quality:** ESLint + TypeScript strict
- **Git Hooks:** Husky (pre-commit linting + type-checking)

## Architecture

### Monorepo Structure
```
socialvibe-monorepo/
├── apps/
│   ├── backend/     # NestJS API
│   └── frontend/    # React SPA
├── packages/        # Shared packages (future)
└── package.json     # Workspace root
```

### Backend Architecture (Clean Architecture)

**Layers:**
1. **Controllers** (`*.controller.ts`) - HTTP endpoints + validation
2. **Services** (`*.service.ts`) - Business logic
3. **Repositories** (Prisma) - Data access
4. **DTOs** (`dto/*.ts`) - Request/response types
5. **Guards/Interceptors** - Cross-cutting concerns

**Key Modules:**
- `auth` - JWT authentication (login, register, refresh, email verification)
- `users` - User management + profiles
- `posts` - Feed, create/edit/delete posts
- `comments` - Post comments
- `likes` - Post likes
- `stories` - 24h ephemeral content
- `friendships` - Friend requests/accept/deny
- `groups` - User groups (create, join, leave)
- `messages` - Real-time chat (conversations + DMs)
- `notifications` - User notifications
- `events` - WebSocket events (via EventsGateway)

**Database Schema (Prisma):**
- 12 entities: User, Post, Comment, Like, Friendship, Story, Group, GroupMember, Conversation, Message, Notification, PasswordReset
- Cascading deletes configured for data integrity
- Soft deletes NOT implemented (hard deletes used)

### Frontend Architecture (Feature-Slice)

**Structure:**
- `pages/` - Route components
- `components/` - Reusable UI components
- `features/` - Feature-specific logic
- `services/` - API clients + WebSocket
- `store.ts` - Global state (Zustand)
- `types.ts` - TypeScript interfaces

**State Management:**
- Zustand for global state (currentUser, posts, stories, notifications)
- Socket.IO client for real-time updates
- Optimistic UI updates

## Code Standards

### TypeScript Rules
- ✅ **Strict mode enabled** (`strict: true`)
- ✅ **No `any` types** - Use `unknown` + type guards
- ✅ **Definite assignment** - Use `!` operator for class properties
- ✅ **Explicit return types** - Required for exported functions
- ✅ **No unused variables** - ESLint enforces

### Testing Standards
- ✅ **Unit tests** for service logic (business rules)
- ❌ **Skip controller tests** if they only test "should be defined"
- ✅ **Mock external dependencies** (Prisma, EventsGateway)
- ✅ **E2E tests** for critical user flows (auth, posts, social features)

### Git Workflow
- **Branch:** `develop` (main development)
- **Commits:** Conventional commits (`fix:`, `feat:`, `refactor:`)
- **Pre-commit:** Lint + type-check (both backend + frontend)
- **Push:** Only when all checks pass

## Current State (2026-02-01)

### ✅ Completed
- Backend: All modules implemented + tested
- Frontend: Core features (feed, auth, messages, groups, stories)
- TypeScript: 0 errors (strict mode) ✅
- ESLint: 0 errors ✅
- Tests: Service tests passing (auth, posts, comments, groups, messages)
- Build: Production builds working

### ⚠️ Known Issues
- 2 ESLint warnings (exhaustive-deps) - non-blocking
- E2E tests need update (some flaky)
- No coverage reporting yet

### 📋 TODO / Backlog
- [ ] Add coverage reporting (aim 60%+)
- [ ] Fix exhaustive-deps warnings (useCallback)
- [ ] Implement CI/CD pipeline
- [ ] Add integration tests (backend + frontend)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] SEO optimization (meta tags, SSR future)

## Development Guidelines

### Before Making Changes
1. **Read this file** - Understand architecture
2. **Check existing patterns** - Follow established conventions
3. **Run tests** - Ensure nothing breaks
4. **Type-check** - `npx tsc --noEmit`
5. **Lint** - `npm run lint`

### Code Review Focus
1. **Type safety** - No `any`, proper interfaces
2. **Security** - SQL injection, XSS, JWT validation
3. **Performance** - N+1 queries, unnecessary re-renders
4. **Error handling** - Proper try/catch, error messages
5. **Tests** - Cover business logic, edge cases

### Common Patterns

**Backend Service:**
```typescript
@Injectable()
export class ExampleService {
  constructor(
    private prisma: PrismaService,
    private events: EventsGateway
  ) {}

  async create(dto: CreateDto, userId: string) {
    // 1. Validate input
    // 2. Prisma operation
    // 3. Emit WebSocket event
    // 4. Return result
  }
}
```

**Frontend Component:**
```typescript
const Component = () => {
  const { currentUser } = useSocialStore();
  const [state, setState] = useState('');
  
  // ✅ Hooks BEFORE early returns
  if (!currentUser) return null;
  
  // Component logic...
}
```

## Error Handling

**Backend:**
- Use NestJS exceptions (`NotFoundException`, `BadRequestException`, `ForbiddenException`)
- Generic catch blocks return 500 errors
- JWT errors caught by guards

**Frontend:**
- API errors extracted via `error-utils.ts` helper
- Display user-friendly messages
- Socket errors logged to console

## WebSocket Events

**Server → Client:**
- `post:new` - New post created
- `post:liked` - Post liked
- `comment:new` - New comment
- `friend:request` - Friend request received
- `friend:accepted` - Friend request accepted
- `message:new` - New message in conversation
- `user:online` / `user:offline` - Presence updates
- `users:online` - Online users list

**Client → Server:**
- Connection with JWT auth
- Auto-reconnect on disconnect

## Security Considerations

- ✅ JWT tokens: 15min access, 7d refresh
- ✅ Email verification required for new accounts
- ✅ Password reset with expiring tokens (1h)
- ✅ CORS configured (whitelist origins)
- ✅ Helmet enabled (security headers)
- ✅ Rate limiting (future TODO)
- ⚠️ XSS: Sanitize user input in frontend
- ⚠️ SQL Injection: Prisma prevents (parameterized queries)

## Performance Notes

- **Database:** Prisma uses connection pooling
- **WebSocket:** Single connection per client
- **Frontend:** React.memo for expensive components (future optimization)
- **Bundle size:** ~187KB main chunk (can be optimized)

## Deployment (Future)

- Backend: Docker + PostgreSQL
- Frontend: Static hosting (Vercel/Netlify)
- Database: Managed PostgreSQL (e.g., Supabase)
- Env vars: `.env.production`

---

**This file is the source of truth for SocialVibe architecture.**  
Update it when making significant changes.
