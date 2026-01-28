# 🏗️ Architecture SocialVibe

## 📐 Vue d'ensemble

SocialVibe est un clone de Facebook moderne avec une architecture **Frontend React + Backend NestJS**.

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Layout  │  │   Feed   │  │ Profile  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│         │              │              │                  │
│         └──────────────┴──────────────┘                  │
│                        │                                 │
│                  ┌─────▼─────┐                          │
│                  │  API      │                          │
│                  │  Service  │                          │
│                  └─────┬─────┘                          │
└────────────────────────┼──────────────────────────────┘
                         │ HTTP/REST
                         │ JWT Auth
┌────────────────────────▼──────────────────────────────┐
│                  BACKEND (NestJS)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   Auth   │  │  Posts   │  │ Comments │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│         │              │              │                │
│         └──────────────┴──────────────┘                │
│                        │                               │
│                  ┌─────▼─────┐                        │
│                  │  Prisma   │                        │
│                  │    ORM    │                        │
│                  └─────┬─────┘                        │
└────────────────────────┼────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│             PostgreSQL Database                      │
│   Users | Posts | Comments | Likes | Friendships    │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend (React + Vite + TypeScript)

### Structure des dossiers
```
SocialVibe/src/
├── components/
│   ├── layout/          # Navbar, Sidebar, Layout, Search, Notifications
│   ├── feed/            # PostCard, StoryBar, CreatePost, PostModal
│   ├── profile/         # Profile page avec couverture et timeline
│   └── ui/              # Composants réutilisables
├── services/
│   └── api.ts           # Service API avec Axios + JWT
├── store.ts             # Zustand store (à remplacer par API)
├── types.ts             # Types TypeScript
└── App.tsx              # Router principal
```

### Technologies
- **React 19** : UI Library
- **Vite** : Build tool ultra-rapide
- **TypeScript** : Type safety
- **Tailwind CSS** : Styling utility-first
- **Framer Motion** : Animations fluides
- **Zustand** : State management (à migrer vers React Query)
- **React Router** : Navigation
- **Axios** : HTTP client

### Composants principaux créés

#### Layout
- `Navbar.tsx` : Barre de navigation avec search, notifs, profil
- `Sidebar.tsx` : Menu latéral avec navigation et shortcuts
- `RightSidebar.tsx` : Contacts en ligne et suggestions
- `Search.tsx` : Recherche avec historique
- `NotificationsPopover.tsx` : Dropdown notifications

#### Feed
- `StoryBar.tsx` : Barre de stories (type Instagram)
- `CreatePost.tsx` : Widget de création de post
- `PostModal.tsx` : Modal avancée avec mood, preview, tagging
- `PostCard.tsx` : Carte de post avec likes, comments, share

#### Profile
- `Profile.tsx` : Page profil complète avec cover, tabs, intro

---

## 🔧 Backend (NestJS + Prisma + PostgreSQL)

### Structure des dossiers
```
SocialVibe-Backend/src/
├── auth/                # JWT Auth, Guards, Strategies
│   ├── dto/
│   ├── guard/
│   ├── strategy/
│   └── decorator/
├── users/               # CRUD Utilisateurs
├── posts/               # CRUD Posts
├── comments/            # CRUD Commentaires
├── likes/               # Toggle Likes
└── prisma/              # Service Prisma global
```

### Technologies
- **NestJS** : Framework backend structuré
- **Prisma** : ORM moderne et type-safe
- **PostgreSQL** : Base de données relationnelle
- **JWT** : Authentification stateless
- **Passport** : Stratégies d'authentification
- **bcrypt** : Hash des mots de passe
- **class-validator** : Validation des DTOs

### Modules principaux

#### Auth (`/auth`)
- `POST /auth/register` : Inscription
- `POST /auth/login` : Connexion
- JWT Strategy + Guards pour protéger les routes

#### Posts (`/posts`)
- `GET /posts` : Liste tous les posts
- `POST /posts` : Créer un post (🔒 Protected)
- `PATCH /posts/:id` : Modifier (🔒 Protected)
- `DELETE /posts/:id` : Supprimer (🔒 Protected)

#### Comments (`/comments`)
- `GET /comments/post/:postId` : Commentaires d'un post
- `POST /comments/:postId` : Commenter (🔒 Protected)
- `DELETE /comments/:id` : Supprimer (🔒 Protected)

#### Likes (`/likes`)
- `POST /likes/:postId` : Toggle like/unlike (🔒 Protected)
- `GET /likes/post/:postId` : Liste des likes

---

## 🗄️ Base de données (PostgreSQL + Prisma)

### Schéma
```prisma
User {
  id, email, password (hashed), name, username,
  avatar, coverImage, bio, createdAt, updatedAt
  ├─ posts[]
  ├─ comments[]
  ├─ likes[]
  └─ friendships[]
}

Post {
  id, caption, image, createdAt, updatedAt
  ├─ author (User)
  ├─ comments[]
  └─ likes[]
}

Comment {
  id, text, createdAt
  ├─ post (Post)
  └─ author (User)
}

Like {
  id, createdAt
  ├─ post (Post)
  └─ user (User)
  @@unique([postId, userId])  # Un user = 1 like max par post
}

Friendship {
  id, status (PENDING/ACCEPTED/BLOCKED), createdAt
  ├─ user (User)
  └─ friend (User)
}

Notification {
  id, type, content, read, createdAt
  ├─ recipient (User)
  └─ sender (User)
}
```

---

## 🔐 Sécurité

### Authentification
- **JWT** : Token signé avec secret (`JWT_SECRET`)
- **Expiration** : 7 jours
- **Storage** : `localStorage` côté frontend
- **Refresh** : Intercepteur Axios pour détecter 401

### Protection des routes
- **JwtGuard** : Protège les routes sensibles
- **GetUser decorator** : Récupère l'user authentifié
- **Validation** : class-validator sur tous les DTOs

### Hashing
- **bcrypt** : Hash des mots de passe (10 rounds)
- **Comparaison** : bcrypt.compare() au login

---

## 🚀 Déploiement (Future)

### Frontend
- **Vercel** ou **Netlify** : Déploiement automatique sur push
- Build avec `npm run build`

### Backend
- **Railway** ou **Render** : Déploiement Node.js
- PostgreSQL managé

### Base de données
- **Supabase** ou **Railway PostgreSQL**

---

## 📊 Flux de données

### 1. Authentification
```
User → Login Form → authAPI.login()
  ↓
Backend /auth/login → Validate → Sign JWT
  ↓
Return { access_token } → Store in localStorage
  ↓
API Service adds token to all future requests
```

### 2. Création de post
```
User → CreatePost Modal → Fill caption + image
  ↓
postsAPI.create({ caption, image })
  ↓
Backend POST /posts (JWT Guard) → Prisma.post.create()
  ↓
Return new post → Update frontend state
```

### 3. Like/Unlike
```
User → Click ❤️ → likesAPI.toggle(postId)
  ↓
Backend POST /likes/:postId → Check if exists
  ↓
If exists: Delete like | Else: Create like
  ↓
Return { liked: true/false } → Update UI
```

---

## 🔮 Next Steps (Phase 3)

### Intégration API
1. Remplacer Zustand store par React Query
2. Connecter tous les composants à l'API réelle
3. Gérer les états de chargement et erreurs

### Real-time
1. WebSockets avec Socket.io
2. Notifications instantanées
3. Présence utilisateur (online/offline)

### Features avancées
1. Upload d'images (Cloudinary/S3)
2. Infinite scroll
3. Système de friendships complet
4. Messages privés

---

**Architecture complète et prête à scaler ! 🚀**
