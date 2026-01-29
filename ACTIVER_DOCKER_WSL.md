# ✅ ACTIVER DOCKER DANS WSL2

Docker Desktop est installé mais pas accessible depuis WSL.  
**Solution: 2 minutes**

## 🔧 Steps

### 1. Ouvrir Docker Desktop
- Docker Desktop est déjà lancé ✅
- Regarde l'icône dans la system tray (en bas à droite Windows)

### 2. Activer WSL2 Integration
1. Click sur l'icône Docker Desktop
2. Settings (⚙️ en haut à droite)
3. Resources → WSL Integration
4. ✅ Activer "Enable integration with my default WSL distro"
5. ✅ Activer "Ubuntu" (ou ta distro WSL)
6. Click "Apply & Restart"

### 3. Vérifier dans WSL
Retourne dans ton terminal WSL:
```bash
docker --version
# Doit afficher: Docker version 24.x.x

docker ps
# Doit afficher: CONTAINER ID   IMAGE   ...
```

---

## 🚀 Ensuite (Après Activation)

Une fois `docker --version` marche:

```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend

# Start PostgreSQL
docker compose up -d

# Check
docker compose ps
# Doit montrer: socialvibe-postgres (running)

# Setup database
npx prisma migrate dev --name init
npm run seed

# Test
npm run dev
```

---

## ❓ Si ça ne marche toujours pas

### Redémarrer WSL
```bash
# Dans PowerShell (Windows)
wsl --shutdown

# Puis relance ton terminal WSL
```

### Vérifier Docker Desktop Status
Dans PowerShell Windows:
```powershell
docker --version
docker ps
```

Si ça marche dans PowerShell mais pas WSL → intégration WSL2 pas activée

---

## 🆘 Alternative

Si Docker Desktop reste bloqué, utilise **SQLite**:

```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend
cp prisma/schema.sqlite.prisma prisma/schema.prisma
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```

---

**Status:** Docker Desktop lancé ✅  
**Next:** Active WSL2 Integration (2 min)
