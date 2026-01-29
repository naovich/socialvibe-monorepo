# ✅ COMMANDES QUAND DOCKER EST PRÊT

## Après avoir activé WSL2 Integration dans Docker Desktop

---

## 1️⃣ Vérifier Docker

```bash
docker --version
# Doit afficher: Docker version 24.x.x

docker ps
# Doit afficher: CONTAINER ID   IMAGE   ...
```

Si ça ne marche pas:
- Redémarrer WSL: `wsl --shutdown` (dans PowerShell Windows)
- Relancer terminal WSL
- Vérifier Docker Desktop settings

---

## 2️⃣ Start PostgreSQL

```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend

# Start database
docker compose up -d

# Check status
docker compose ps
# Doit montrer: socialvibe-postgres (running, healthy)

# Check logs si problème
docker compose logs postgres
```

---

## 3️⃣ Setup Database

### Si tu étais sur SQLite avant:

```bash
# Restore PostgreSQL schema
git restore prisma/schema.prisma

# Update .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
STORAGE_PROVIDER="minio"
EOF
```

### Create Tables

```bash
# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma migrate dev --name init

# Seed data (20 users + posts)
npm run seed
```

---

## 4️⃣ Start Application

### Terminal 1: Backend
```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend
npm run dev
```

**Output attendu:**
```
[Nest] INFO NestApplication successfully started
[Nest] INFO Application is running on: http://localhost:3000
```

### Terminal 2: Frontend
```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/frontend
npm run dev
```

**Output attendu:**
```
VITE ready in 521 ms
➜  Local:   http://localhost:5173/
```

---

## 5️⃣ Test Application

### Ouvrir: http://localhost:5173

### Test Complet:
1. ✅ Register nouveau compte
2. ✅ Login
3. ✅ Create post
4. ✅ Like/Comment post
5. ✅ Search users ("alice", "bob")
6. ✅ Send message
7. ✅ Create group
8. ✅ Edit profile
9. ✅ Upload image
10. ✅ View stories

### Comptes de Test (Seed):
```
alice@socialvibe.com / password123
bob@socialvibe.com / password123
charlie@socialvibe.com / password123
diana@socialvibe.com / password123
...
(20 users total)
```

---

## 6️⃣ Run Tests E2E

```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/frontend

# Install Playwright (première fois)
npx playwright install

# Run all tests
npm test

# Run avec UI (debug)
npx playwright test --ui

# Run specific suite
npx playwright test e2e/complete.spec.ts -g "Authentication"
```

**25 tests couvrent:**
- Authentication (4 tests)
- Posts (4 tests)
- Friends (3 tests)
- Profile (3 tests)
- Messages (2 tests)
- Groups (3 tests)
- Settings (3 tests)
- Stories, Search, Notifications (3 tests)

---

## 7️⃣ Prisma Studio (Database UI)

```bash
cd apps/backend
npx prisma studio
```

Ouvre: http://localhost:5555

Tu peux:
- ✅ View all tables
- ✅ Edit records
- ✅ Delete data
- ✅ Add test data manually

---

## 🐛 Troubleshooting

### "Can't reach database server"
```bash
docker compose ps
# Doit montrer postgres running

docker compose logs postgres
# Check les erreurs

# Restart si nécessaire
docker compose down
docker compose up -d
```

### "Port 5432 already in use"
```bash
# Check si autre PostgreSQL running
sudo systemctl status postgresql
sudo systemctl stop postgresql

# Ou change port dans docker-compose.yml
```

### "Migration failed"
```bash
# Reset database (⚠️ efface données)
docker compose down -v
docker compose up -d
npx prisma migrate dev --name init
npm run seed
```

### Tests E2E échouent
```bash
# Assure que l'app est running
# Backend: http://localhost:3000
# Frontend: http://localhost:5173

# Run avec debug
npx playwright test --debug
```

---

## 📊 Commandes Utiles

### Backend
```bash
# Build
npm run build

# Start prod
npm run start:prod

# Lint
npm run lint

# Format
npm run format
```

### Docker
```bash
# Start
docker compose up -d

# Stop
docker compose down

# Stop + Remove data
docker compose down -v

# Logs
docker compose logs -f postgres

# Restart
docker compose restart postgres
```

### Prisma
```bash
# Generate client
npx prisma generate

# Create migration
npx prisma migrate dev --name <name>

# Deploy migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Studio
npx prisma studio
```

---

## ✅ Everything Working Checklist

- [ ] `docker ps` shows postgres running
- [ ] `npm run dev` (backend) starts on :3000
- [ ] `npm run dev` (frontend) starts on :5173
- [ ] Can access http://localhost:5173
- [ ] Can register + login
- [ ] Can create post
- [ ] Can send message
- [ ] `npx prisma studio` opens :5555
- [ ] `npm test` passes (frontend E2E)

---

**Status:** 🟢 READY TO GO!
