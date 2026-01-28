# 🌟 SocialVibe - Frontend

> Réseau social moderne construit avec React, TypeScript, Tailwind CSS et Framer Motion

![SocialVibe](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-Latest-cyan)

## 📸 Features

- ✨ **Interface Facebook-like** avec navigation complexe
- 🎨 **Dark Theme** avec glass-morphism effects
- 🔔 **Notifications** en temps réel (ready for WebSockets)
- 📖 **Stories** avec carrousel interactif
- 💬 **Posts & Comments** avec likes et partages
- 👤 **Profil utilisateur** complet (cover, bio, timeline)
- 🔍 **Recherche** interactive avec historique
- 📱 **Responsive Design** (mobile-first)
- ⚡ **Animations fluides** (Framer Motion)

## 🚀 Quick Start

```bash
# Installation
npm install

# Dev server (http://localhost:5173)
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## 🔧 Configuration

### Variables d'environnement

Créer `.env.local` :

```env
VITE_API_URL=http://localhost:3000
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── layout/        # Header, Sidebar, Search, Notifications
│   ├── feed/          # Stories, CreatePost, PostCard
│   └── profile/       # Profile page
├── services/
│   └── api.ts         # API service layer
├── types.ts           # TypeScript types
├── store.ts           # Zustand state management
└── App.tsx            # Main component
```

## 🎨 Stack Technique

- **React 19** - UI Library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Zustand** - State management
- **Lucide React** - Icons
- **Vite** - Build tool

## 🔗 Backend Integration

Le frontend est prêt à communiquer avec le backend NestJS (voir `../social-vibe-backend/`).

Le `ApiService` dans `src/services/api.ts` gère toutes les communications :

```typescript
import { api } from './services/api';

// Login
const { access_token, user } = await api.login({ username, password });
api.setToken(access_token);

// Get posts
const posts = await api.getPosts(0, 10);

// Create post
await api.createPost({ caption, image });
```

## 📊 State Management

Zustand store avec persistence :

```typescript
const { posts, fetchPosts, toggleLike, addComment } = useSocialStore();
```

## 🎨 Composants Principaux

### Header
Navigation principale avec recherche, notifications, et actions rapides.

### Sidebar
- **Left**: Raccourcis, groupes, navigation principale
- **Right**: Contacts online, conversations de groupe

### Stories
Carrousel de stories avec indicateur vu/non-vu.

### PostCard
Carte de post complexe avec :
- Stats (likes, comments, shares)
- Actions (Like, Comment, Share, Bookmark)
- Section commentaires expandable
- Animations sur interactions

### Profile
Page profil complète :
- Cover image + avatar
- Bio et informations
- Tabs (Posts, About, Friends, Photos)
- Timeline personnelle

## 🚧 TODO

- [ ] Intégrer Socket.IO pour real-time
- [ ] Upload d'images (Cloudinary)
- [ ] Dark/Light mode toggle
- [ ] Tests (Jest + React Testing Library)
- [ ] PWA capabilities

## 📝 License

MIT

---

Built with ❤️ by Night Builder
