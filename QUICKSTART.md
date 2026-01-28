# ⚡ Quick Start - SocialVibe Monorepo

## 🚀 Démarrage Rapide (5 minutes)

### 1️⃣ Clone le repo
```bash
git clone https://github.com/naovich/socialvibe-monorepo.git
cd socialvibe-monorepo
```

### 2️⃣ Installe les dépendances
```bash
npm install
```

### 3️⃣ Configure PostgreSQL

**Option A : Postgres.app (Mac) - RECOMMANDÉ**
- Télécharge https://postgresapp.com/
- Lance l'app → "Initialize"
- Dans le terminal:
```bash
psql postgres -c "CREATE DATABASE socialvibe;"
```

**Option B : Docker**
```bash
cd apps/backend
docker-compose up -d
```

### 4️⃣ Configure le backend

Le fichier `.env` existe déjà dans `apps/backend/.env` :
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
JWT_SECRET="socialvibe-super-secret-jwt-key-change-this-in-production"
PORT=3000
```

⚠️ **Si tu utilises Postgres.app sans password**, change en :
```env
DATABASE_URL="postgresql://localhost:5432/socialvibe?schema=public"
```

### 5️⃣ Lance les migrations
```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma generate
```

### 6️⃣ Démarre tout ! 🎉
```bash
cd ../..
npm run dev
```

✅ **Frontend:** http://localhost:5173  
✅ **Backend:** http://localhost:3000

---

## 🔧 Commandes Utiles

### Développement
```bash
# Tout démarrer
npm run dev

# Frontend seulement
npm run dev --workspace=@socialvibe/frontend

# Backend seulement
npm run dev --workspace=@socialvibe/backend
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Base de données
```bash
cd apps/backend

# Générer le client Prisma
npx prisma generate

# Créer une migration
npx prisma migrate dev --name your_migration

# Ouvrir Prisma Studio
npx prisma studio

# Reset la DB (⚠️ efface toutes les données)
npx prisma migrate reset
```

---

## ❓ Problèmes Courants

### "Property 'user' does not exist on PrismaService"
**Solution:** Le client Prisma n'est pas généré
```bash
cd apps/backend
npx prisma generate
```

### "Can't reach database server"
**Solution:** PostgreSQL n'est pas démarré
- Postgres.app: Vérifie qu'il tourne
- Docker: `docker-compose up -d`

### "Port 5173 already in use"
**Solution:** Quelque chose utilise déjà le port
```bash
# Trouve le process
lsof -i :5173
# Tue-le ou change le port dans vite.config.ts
```

---

## 📚 Plus d'Infos

- **README.md** - Documentation complète
- **apps/backend/SETUP.md** - Setup backend détaillé
- **apps/backend/POSTGRES_INSTALL.md** - Guide d'installation PostgreSQL
- **DEPLOYMENT.md** - Infos de déploiement

---

## ✅ Checklist

- [x] ✅ Repo cloné
- [x] ✅ Dépendances installées
- [x] ✅ PostgreSQL installé et démarré
- [x] ✅ `.env` configuré
- [x] ✅ Migrations lancées
- [x] ✅ Client Prisma généré
- [ ] ⏳ Apps démarrées avec `npm run dev`

**Have fun! 🎉**
