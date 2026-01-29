# ⚠️ ACTION REQUISE: INSTALLATION DATABASE

## 🎯 TU DOIS INSTALLER POSTGRESQL (10 minutes)

L'application **NE PEUT PAS FONCTIONNER** sans database.  
Docker et PostgreSQL ne sont **PAS installés** sur ton système.

---

## ✅ OPTION 1: Docker (RECOMMANDÉ)

### 1. Installer Docker
```bash
# Update system
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# IMPORTANT: Logout puis login
exit
# Puis reconnecte-toi en SSH/terminal
```

### 2. Vérifier Installation
```bash
docker --version
# Doit afficher: Docker version 24.x.x

docker compose version
# Doit afficher: Docker Compose version v2.x.x
```

### 3. Lancer PostgreSQL
```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend

# Start database
docker compose up -d

# Check status
docker compose ps
# Doit afficher: socialvibe-postgres (running)
```

### 4. Créer Tables
```bash
# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma migrate dev --name init

# Seed data (20 users + posts)
npm run seed

# Verify
npx prisma studio
# Opens http://localhost:5555
```

---

## ✅ OPTION 2: PostgreSQL Direct (Sans Docker)

### 1. Installer PostgreSQL
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Créer Database
```bash
sudo -u postgres psql

# Dans psql:
CREATE DATABASE socialvibe;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE socialvibe TO postgres;
\\q
```

### 3. Vérifier .env
```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend
cat .env

# Doit contenir:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
```

### 4. Créer Tables
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

---

## ✅ OPTION 3: PostgreSQL Cloud (Production)

### Neon (Gratuit, facile)
1. Va sur https://neon.tech
2. Sign up (GitHub/Google)
3. Create project "socialvibe"
4. Copy connection string
5. Update `.env`:
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/socialvibe?sslmode=require"
```
6. Run migrations:
```bash
npx prisma migrate deploy
npm run seed
```

### Supabase (Gratuit, plus features)
1. Va sur https://supabase.com
2. Create project "socialvibe"
3. Settings > Database > Connection String
4. Copy et update `.env`
5. Run migrations

---

## 🚀 APRÈS INSTALLATION

### Test que ça marche
```bash
# Terminal 1: Backend
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend
npm run dev
# Doit démarrer sur http://localhost:3000

# Terminal 2: Frontend
cd /home/naovich/clawd/socialvibe-monorepo/apps/frontend
npm run dev
# Doit démarrer sur http://localhost:5173
```

### Ouvrir App
1. Va sur http://localhost:5173
2. Register un compte
3. Login
4. Test features:
   - Créer post
   - Chercher users
   - Envoyer message
   - Créer groupe

---

## 🆘 PROBLÈMES COURANTS

### "docker: command not found"
```bash
# Re-installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Must logout/login après install
exit
```

### "Permission denied (Docker)"
```bash
sudo usermod -aG docker $USER
exit
# Reconnecte-toi
```

### "Can't reach database server"
```bash
# Docker
docker compose ps
docker compose logs postgres

# Local PostgreSQL
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### "Port 5432 already in use"
```bash
# Stop existing PostgreSQL
sudo systemctl stop postgresql

# Or change port in docker-compose.yml:
ports:
  - "5433:5432"
# Then update .env: DATABASE_URL="...@localhost:5433/..."
```

---

## 📝 ALTERNATIVE TEMPORAIRE: SQLite

Si tu veux tester **MAINTENANT** sans installer PostgreSQL:

### 1. Switch to SQLite
```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend

# Backup current schema
cp prisma/schema.prisma prisma/schema.postgres.prisma

# Use SQLite schema
cp prisma/schema.sqlite.prisma prisma/schema.prisma

# Update .env
echo 'DATABASE_URL="file:./dev.db"' > .env
```

### 2. Run Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 3. Test App
```bash
npm run dev
```

**⚠️ Note:** SQLite est pour test local seulement.  
Pour production/deploy, tu DOIS utiliser PostgreSQL.

---

## ✅ CHECKLIST

Installation terminée quand:
- [ ] Docker installé OU PostgreSQL installé
- [ ] `docker compose ps` montre postgres running OU `psql` fonctionne
- [ ] `npx prisma migrate dev` réussi
- [ ] `npm run seed` réussi
- [ ] `npx prisma studio` ouvre http://localhost:5555
- [ ] Backend démarre sur http://localhost:3000
- [ ] Frontend démarre sur http://localhost:5173
- [ ] App accessible et fonctionnelle

---

## 📊 TEMPS ESTIMÉ

| Option | Temps | Difficulté |
|--------|-------|------------|
| Docker | 10 min | Facile |
| PostgreSQL Local | 5 min | Très Facile |
| Cloud (Neon) | 3 min | Très Facile |
| SQLite (temp) | 2 min | Facile |

---

## 💬 BESOIN D'AIDE ?

Si problème:
1. Lis `INSTALL_DOCKER.md`
2. Lis `SETUP_DB.md`
3. Check les logs:
```bash
# Docker
docker compose logs postgres

# Backend
cd apps/backend
npm run dev
# Copie les erreurs

# Frontend
cd apps/frontend
npm run dev
# Copie les erreurs
```

---

**STATUS:** ⏸️ EN ATTENTE TON ACTION  
**PRIORITY:** 🔴 BLOQUANT  
**NEXT:** Installe Docker → Run migrations → Test app
