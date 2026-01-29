# 🗄️ DATABASE SETUP - SOCIALVIBE

## Option 1: Docker (Recommandé)

### 1. Installer Docker
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose-plugin
sudo systemctl start docker
sudo usermod -aG docker $USER
# Logout/login pour appliquer
```

### 2. Démarrer PostgreSQL
```bash
cd apps/backend
docker compose up -d
```

### 3. Vérifier
```bash
docker compose ps
# Devrait montrer: socialvibe-postgres (running)
```

---

## Option 2: PostgreSQL Local

### 1. Installer PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Créer Database
```bash
sudo -u postgres psql
CREATE DATABASE socialvibe;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE socialvibe TO postgres;
\q
```

### 3. Vérifier .env
```bash
cd apps/backend
cat .env
# DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
```

---

## Option 3: PostgreSQL Cloud (Production)

### Neon (Gratuit)
1. Aller sur https://neon.tech
2. Créer un projet "socialvibe"
3. Copier la connection string
4. Mettre dans `.env`:
```
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/socialvibe?sslmode=require"
```

### Supabase (Gratuit)
1. Aller sur https://supabase.com
2. Créer un projet "socialvibe"
3. Aller dans Settings > Database
4. Copier la connection string
5. Mettre dans `.env`

---

## Appliquer Migrations

Une fois la DB running:

```bash
cd apps/backend

# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma migrate dev --name init

# Seed data (optionnel)
npm run seed

# Vérifier
npx prisma studio
# Ouvre http://localhost:5555
```

---

## Troubleshooting

### "Can't reach database server"
```bash
# Vérifier que PostgreSQL est running
sudo systemctl status postgresql  # Local
docker compose ps                  # Docker
```

### "Prisma schema not found"
```bash
cd apps/backend
ls prisma/schema.prisma  # Doit exister
```

### "Migration failed"
```bash
# Reset database (⚠️ Efface toutes les données)
npx prisma migrate reset
npx prisma migrate dev --name init
```

---

## Status Actuel

⚠️ **PostgreSQL n'est pas installé sur ce système**

Pour continuer le développement, tu dois :
1. Installer Docker (option 1) OU
2. Installer PostgreSQL (option 2)
3. Lancer `npx prisma migrate dev --name init`

Sans DB, l'application ne peut pas démarrer.
