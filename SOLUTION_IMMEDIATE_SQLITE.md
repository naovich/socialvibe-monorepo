# 🚀 SOLUTION IMMÉDIATE: SQLITE (2 minutes)

## Pendant que Docker s'active, utilise SQLite!

Tu peux **tester l'app MAINTENANT** avec SQLite.  
Pas besoin d'attendre Docker.

---

## 🎯 Commandes (Copy-Paste)

```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend

# 1. Switch to SQLite
cp prisma/schema.sqlite.prisma prisma/schema.prisma

# 2. Update .env
cat > .env << 'EOF'
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
STORAGE_PROVIDER="minio"
EOF

# 3. Generate Prisma & Migrate
npx prisma generate
npx prisma migrate dev --name init

# 4. Seed Data (20 users + posts)
npm run seed

# 5. Start Backend
npm run dev
```

**Nouveau terminal:**
```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/frontend

# Start Frontend  
npm run dev
```

---

## ✅ Test l'App

### 1. Ouvrir
http://localhost:5173

### 2. Register
- Email: `test@example.com`
- Password: `password123`
- Name: `Test User`
- Username: `testuser`

### 3. Test Features
- ✅ Create post
- ✅ Like/Comment
- ✅ Search users (try "alice", "bob")
- ✅ Send message
- ✅ Create group
- ✅ Edit profile

### 4. Comptes de Test (Seed)
```
alice@socialvibe.com / password123
bob@socialvibe.com / password123
charlie@socialvibe.com / password123
... (20 users total)
```

---

## 🔄 Switch Back to PostgreSQL Later

Quand Docker est activé:

```bash
cd apps/backend

# Restore PostgreSQL schema
cp prisma/schema.postgres.prisma prisma/schema.prisma 2>/dev/null || git restore prisma/schema.prisma

# Update .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
STORAGE_PROVIDER="minio"
EOF

# Start PostgreSQL
docker compose up -d

# Migrate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

---

## ⚡ SQLite vs PostgreSQL

### SQLite ✅
- **Pro:** Instant, no install, perfect for dev/test
- **Pro:** File-based (./dev.db)
- **Con:** Single connection (not for production)
- **Con:** No concurrent writes

### PostgreSQL ✅
- **Pro:** Production-ready, concurrent users
- **Pro:** Advanced features
- **Con:** Requires Docker/install

---

## 📊 Status

**SQLite Ready:** ✅ 2 minutes  
**PostgreSQL Ready:** ⏸️ Attends Docker WSL2 activation

**Recommendation:** Start avec SQLite NOW, switch to PostgreSQL plus tard

---

## 🆘 Si Erreur

### "Prisma schema not found"
```bash
cd apps/backend
ls prisma/schema.prisma
# Doit exister
```

### "Migration failed"
```bash
rm -rf prisma/migrations prisma/dev.db
npx prisma migrate dev --name init
```

### "Port already in use"
```bash
# Backend (port 3000)
lsof -ti:3000 | xargs kill -9

# Frontend (port 5173)  
lsof -ti:5173 | xargs kill -9
```

---

**START NOW! (2 min)** 🚀
