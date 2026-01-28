# 🚀 SocialVibe Backend - API NestJS

Backend complet pour SocialVibe, un clone de Facebook moderne.

## 🛠️ Stack Technique

- **Framework**: NestJS (Node.js)
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Auth**: JWT + Passport
- **Validation**: class-validator
- **Hash**: bcrypt

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate
```

## 🐳 Lancer la base de données (Docker)

```bash
# Démarrer PostgreSQL avec Docker Compose
docker-compose up -d

# Vérifier que le conteneur tourne
docker ps
```

## 🗄️ Migrations Prisma

```bash
# Créer et appliquer les migrations
npx prisma migrate dev --name init

# (Optionnel) Ouvrir Prisma Studio pour explorer la DB
npx prisma studio
```

## 🚀 Lancer l'application

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera disponible sur **http://localhost:3000**

## 🔑 Variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
JWT_SECRET="super-secret-key-123"
```

## 📚 Endpoints disponibles

### 🔐 Authentication (`/auth`)
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter

### 👤 Users (`/users`)
- `GET /users` - Liste des utilisateurs
- `GET /users/:id` - Profil utilisateur

### 📝 Posts (`/posts`)
- `POST /posts` - Créer un post (🔒 Protected)
- `GET /posts` - Liste des posts
- `PATCH /posts/:id` - Modifier un post (🔒 Protected)
- `DELETE /posts/:id` - Supprimer un post (🔒 Protected)

### 💬 Comments (`/comments`)
- `POST /comments/:postId` - Commenter un post (🔒 Protected)
- `GET /comments/post/:postId` - Commentaires d'un post
- `DELETE /comments/:id` - Supprimer un commentaire (🔒 Protected)

### ❤️ Likes (`/likes`)
- `POST /likes/:postId` - Liker/Unliker un post (🔒 Protected)
- `GET /likes/post/:postId` - Likes d'un post

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📁 Structure du projet

```
src/
├── auth/           # Authentification JWT
│   ├── dto/
│   ├── guard/
│   ├── strategy/
│   └── decorator/
├── users/          # Gestion utilisateurs
├── posts/          # CRUD Posts
├── comments/       # CRUD Commentaires
├── likes/          # Likes/Unlikes
└── prisma/         # Service Prisma
```

## 🔮 Prochaines étapes

- [ ] WebSockets pour le real-time
- [ ] Upload d'images (Cloudinary/S3)
- [ ] Système de friendships complet
- [ ] Notifications en temps réel
- [ ] Rate limiting
- [ ] Tests E2E complets

---

**Développé avec ❤️ par Night Builder**
