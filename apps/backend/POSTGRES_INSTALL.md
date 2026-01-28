# 🐘 PostgreSQL Installation Guide for Mac

## Option 1: Postgres.app (Le plus simple) ⭐ RECOMMANDÉ

### Installation
1. **Télécharge** Postgres.app: https://postgresapp.com/
2. **Déplace** l'app dans Applications
3. **Lance** Postgres.app
4. **Clique** sur "Initialize" pour créer un serveur
5. **Done!** PostgreSQL tourne maintenant

### Configuration
```bash
# Ajoute psql au PATH (dans ton terminal)
echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Vérifie que ça marche
psql --version
```

### Créer la database
```bash
# Se connecter à postgres (depuis le terminal)
psql postgres

# Dans psql, tape :
CREATE DATABASE socialvibe;
\q
```

---

## Option 2: Homebrew

### Installer Homebrew (si pas déjà fait)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Installer PostgreSQL
```bash
brew install postgresql@15
brew services start postgresql@15

# Ajouter au PATH
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Créer la database
```bash
createdb socialvibe
```

---

## Option 3: Docker Desktop (Si tu as Docker)

### Installer Docker Desktop
1. Télécharge: https://www.docker.com/products/docker-desktop/
2. Installe et lance Docker Desktop
3. Attends que Docker démarre

### Lancer PostgreSQL
```bash
cd /path/to/socialvibe-monorepo/apps/backend
docker-compose up -d

# Vérifier
docker ps
```

---

## ✅ Vérification

### Tester la connexion
```bash
# Option 1 & 2 : PostgreSQL local
psql -U postgres -d socialvibe -c "SELECT version();"

# Option 3 : Docker
docker exec -it socialvibe-db psql -U postgres -d socialvibe -c "SELECT version();"
```

### Si ça marche, lance Prisma
```bash
cd /path/to/socialvibe-monorepo/apps/backend
npx prisma migrate dev --name init
```

---

## 🔧 Troubleshooting

### "psql: command not found"
Le PATH n'est pas configuré. Redemarre ton terminal ou :
```bash
source ~/.zshrc
```

### "connection refused"
PostgreSQL n'est pas démarré.
- **Postgres.app**: Vérifie qu'il tourne dans Applications
- **Homebrew**: `brew services start postgresql@15`
- **Docker**: `docker-compose up -d`

### "database does not exist"
```bash
createdb socialvibe
# ou
psql postgres -c "CREATE DATABASE socialvibe;"
```

---

## 🎯 Configuration pour SocialVibe

Une fois PostgreSQL installé et démarré :

### Si PostgreSQL local (Option 1 ou 2)
Le `.env` actuel devrait marcher :
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
```

**MAIS** ajuste si besoin :
- User par défaut : `postgres` (ou ton username Mac)
- Password : aucun par défaut sur Mac (enlève `:password`)

Essaie ça si connexion refusée :
```env
DATABASE_URL="postgresql://localhost:5432/socialvibe?schema=public"
```

### Si Docker (Option 3)
Le `.env` actuel est parfait ! Garde-le tel quel.

---

## 📝 Quelle option choisir ?

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| **Postgres.app** | ✅ Super simple<br>✅ Interface graphique<br>✅ Gestion facile | ❌ Spécifique Mac |
| **Homebrew** | ✅ CLI classique<br>✅ Bonne intégration | ⚠️ Nécessite Homebrew |
| **Docker** | ✅ Isolation totale<br>✅ Portable | ⚠️ Nécessite Docker Desktop |

**Ma recommandation : Postgres.app** (le plus rapide à setup)

---

## 🚀 Next Steps

1. **Installe** PostgreSQL avec une des options ci-dessus
2. **Crée** la database `socialvibe`
3. **Lance** `npx prisma migrate dev --name init`
4. **Profit!** 🎉
