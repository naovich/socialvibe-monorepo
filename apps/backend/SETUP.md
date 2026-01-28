# 🚀 Backend Setup - SocialVibe

## 📋 Prerequisites

1. **PostgreSQL** - Database server
2. **Node.js** >= 18
3. **npm** >= 9

---

## 🐘 PostgreSQL Setup

### Option 1: Docker (Recommended)

```bash
# Start PostgreSQL with Docker Compose
cd apps/backend
docker-compose up -d

# Check it's running
docker ps
```

### Option 2: Local PostgreSQL

Si tu as PostgreSQL installé localement :

```bash
# Create database
createdb socialvibe

# Update .env with your connection
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/socialvibe?schema=public"
```

### Option 3: Cloud Database

Utilise un service cloud comme :
- **Supabase** (gratuit)
- **Railway** (gratuit)
- **Neon** (gratuit)

Copie l'URL de connexion dans `.env`

---

## ⚙️ Environment Variables

Le fichier `.env` a été créé avec les valeurs par défaut :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
JWT_SECRET="socialvibe-super-secret-jwt-key-change-this-in-production"
PORT=3000
```

**⚠️ Important:** Change le `JWT_SECRET` en production !

---

## 🗄️ Database Migration

Une fois PostgreSQL démarré :

```bash
cd apps/backend

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

---

## 🚀 Start Development

```bash
# From backend directory
npm run dev

# Or from monorepo root
npm run dev --workspace=@socialvibe/backend
```

API disponible sur: http://localhost:3000

---

## 📝 Test Endpoints

### Register
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

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🐛 Troubleshooting

### Error: "The datasource.url property is required"
✅ **Fixed!** Le fichier `.env` a été créé.

### Error: "Can't reach database server"
❌ PostgreSQL n'est pas démarré.

**Solution:**
```bash
# With Docker
docker-compose up -d

# Or install PostgreSQL locally
```

### Error: "Port 3000 already in use"
Quelque chose utilise déjà le port 3000.

**Solution:**
```bash
# Change port in .env
PORT=3001
```

---

## 📚 Useful Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database
npx prisma studio

# Format Prisma schema
npx prisma format
```

---

## ✅ Quick Start Checklist

- [x] ✅ `.env` créé
- [x] ✅ `.env.example` créé
- [ ] ⏳ PostgreSQL démarré
- [ ] ⏳ Migrations lancées
- [ ] ⏳ Backend démarré

---

**Next:** Démarre PostgreSQL puis lance `npx prisma migrate dev` !
