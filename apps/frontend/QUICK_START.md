# 🚀 Quick Start - SocialVibe

Guide de démarrage rapide pour lancer SocialVibe (Frontend + Backend)

## 📋 Prérequis

- Node.js 18+ installé
- Docker Desktop installé et lancé
- Git

## ⚡ Installation rapide (5 minutes)

### 1️⃣ Backend (SocialVibe-Backend)

```bash
cd SocialVibe-Backend

# Installer les dépendances
npm install

# Lancer PostgreSQL avec Docker
docker-compose up -d

# Générer le client Prisma
npx prisma generate

# Créer la base de données
npx prisma migrate dev --name init

# Lancer le serveur backend
npm run start:dev
```

✅ Backend disponible sur **http://localhost:3000**

---

### 2️⃣ Frontend (SocialVibe)

```bash
# Nouvelle fenêtre de terminal
cd SocialVibe

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

✅ Frontend disponible sur **http://localhost:5173**

---

## 🎯 Test rapide de l'API

### Créer un compte
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "username": "testuser"
  }'
```

### Se connecter
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Vous recevrez un `access_token` à utiliser pour les requêtes protégées.

### Créer un post (avec le token)
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "caption": "Mon premier post !",
    "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
  }'
```

---

## 🛠️ Commandes utiles

### Backend
```bash
# Voir les logs Docker
docker-compose logs -f

# Arrêter la DB
docker-compose down

# Réinitialiser la DB
npx prisma migrate reset

# Ouvrir Prisma Studio (GUI pour la DB)
npx prisma studio
```

### Frontend
```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

---

## 🐛 Troubleshooting

**Problème : Port 5432 déjà utilisé**
```bash
# Changer le port dans docker-compose.yml
ports:
  - "5433:5432"  # Au lieu de 5432:5432
  
# Mettre à jour .env
DATABASE_URL="postgresql://postgres:password@localhost:5433/socialvibe?schema=public"
```

**Problème : Erreur Prisma Client**
```bash
# Régénérer le client
npx prisma generate
```

**Problème : CORS error**
- Vérifier que le backend tourne sur le port 3000
- Vérifier que le frontend tourne sur le port 5173
- Vérifier la config CORS dans `src/main.ts`

---

## 📚 Documentation complète

- Backend : `SocialVibe-Backend/README.md`
- Plan de développement : `NIGHT_PLAN.md`
- Progression : `PROGRESSION_NIGHT.md`

---

**Bon développement ! 🎉**
