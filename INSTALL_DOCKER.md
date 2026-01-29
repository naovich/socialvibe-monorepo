# 🐳 INSTALLATION DOCKER - UBUNTU/WSL

## Méthode Rapide (10 minutes)

### 1. Installation Docker
```bash
# Update packages
sudo apt update

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (no sudo needed)
sudo usermod -aG docker $USER
```

### 2. Logout/Login
```bash
# IMPORTANT: Logout puis login pour appliquer docker group
exit
# Puis reconnecte-toi
```

### 3. Test Docker
```bash
docker --version
# Should show: Docker version 24.x.x

docker compose version
# Should show: Docker Compose version v2.x.x
```

---

## Lancer PostgreSQL (après installation)

```bash
cd /home/naovich/clawd/socialvibe-monorepo/apps/backend

# Start PostgreSQL
docker compose up -d

# Check status
docker compose ps
# Should show: socialvibe-postgres (running)

# Apply migrations
npx prisma migrate dev --name init

# Seed data
npm run seed

# Test connection
npx prisma studio
# Opens http://localhost:5555
```

---

## Troubleshooting

### "Cannot connect to Docker daemon"
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
# Logout/login
```

### "Permission denied"
```bash
# Must logout/login after adding to docker group
exit
# Then reconnect
```

### "Port 5432 already in use"
```bash
# Stop existing PostgreSQL
sudo systemctl stop postgresql

# Or use different port in docker-compose.yml
ports:
  - "5433:5432"  # Change 5432 to 5433
```

---

## Alternative: PostgreSQL Sans Docker

Si Docker ne marche pas, install PostgreSQL directement:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE socialvibe;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE socialvibe TO postgres;
\q

# Test
psql -h localhost -U postgres -d socialvibe
# Password: password
```

---

## Note WSL

Si tu es sur WSL2 (Windows), Docker Desktop est recommandé:
1. Installer Docker Desktop for Windows
2. Activer WSL2 integration dans Docker Desktop settings
3. Redémarrer WSL
4. `docker compose up -d` devrait marcher
