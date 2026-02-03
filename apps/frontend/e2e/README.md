# 🧪 Tests E2E - Guide de Lancement

## 📋 Prérequis

**IMPORTANT:** Le backend DOIT être démarré avant de lancer les tests E2E.

### 1. Démarrer le backend

```bash
# Dans un terminal séparé
cd apps/backend
npm run start:dev
```

Le backend sera accessible sur `http://localhost:3000`

### 2. Vérifier que PostgreSQL + MinIO sont up

```bash
# Depuis la racine du monorepo
docker-compose up -d
```

## 🚀 Lancer les tests

### Tests complets (headless)

```bash
cd apps/frontend
npm run test
```

### Tests avec UI interactive

```bash
cd apps/frontend
npm run test:ui
```

### Tests avec navigateur visible (debug)

```bash
cd apps/frontend
npm run test:headed
```

## 🎯 Configuration

- **Navigateurs:** Chromium uniquement (Firefox et WebKit désactivés - non installés)
- **Timeout:** 15s pour les redirections (API calls inclus)
- **Parallélisme:** Activé par défaut
- **Global Setup:** Vérifie que le backend est accessible avant de lancer les tests

## ⚡ Workflow complet

```bash
# Terminal 1 - Services
docker-compose up -d

# Terminal 2 - Backend
cd apps/backend
npm run start:dev

# Terminal 3 - Tests E2E
cd apps/frontend
npm run test
```

## 🐛 Debugging

### Tests échouent avec "Backend not available"

→ Le backend n'est pas démarré. Voir étape 1.

### Tests timeout sur redirect

→ Le backend met trop de temps à répondre. Vérifier PostgreSQL/MinIO.

### Tokens non stockés dans localStorage

→ CORS ou API non accessible. Vérifier les logs backend.

## 📊 Rapport HTML

Après l'exécution, un rapport HTML est généré :

```bash
npx playwright show-report
```

## 🔧 Structure des Tests

```
e2e/
├── 01-auth.spec.ts           # Authentification (register, login, logout)
├── 02-posts.spec.ts           # Posts (CRUD, likes, comments)
├── 03-social.spec.ts          # Social (follow, followers, following)
├── 04-features.spec.ts        # Messages, Groups, Search, Notifications
├── 05-security-performance.ts # Sécurité, Performance, Edge cases
├── helpers/
│   └── test-utils.ts          # Helpers réutilisables (register, login, etc.)
└── global-setup.ts            # Setup global (vérifie backend)
```

## 💡 Tips

- **Isolation:** Chaque test est isolé (nouveau browser context)
- **Parallélisme:** Attention aux tests qui modifient des données partagées
- **Screenshots:** Pris automatiquement en cas d'échec
- **Traces:** Disponibles pour debugging avec `trace: 'on-first-retry'`

## 🎯 Couverture

**Total:** 50+ tests E2E couvrant ~76% des User Stories

- ✅ Authentification (register, login, logout, tokens)
- ✅ Posts (create, edit, delete, like, comment)
- ✅ Social (follow, unfollow, followers, following)
- ✅ Messages (send, receive, delete, pagination)
- ✅ Groups (create, join, post, leave)
- ✅ Search (users, case-insensitive)
- ✅ Notifications (view, mark as read)
- ✅ Sécurité (XSS, CORS, JWT, routes protégées)
- ✅ Performance (load times, pagination, N+1)
- ✅ Edge cases (offline, rapid actions, long text, special chars)
