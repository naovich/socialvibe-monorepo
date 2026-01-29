# 🚀 SocialVibe - Quick Start Guide

Démarrage rapide pour tester les 3 nouvelles features.

---

## Prerequisites

- Docker (pour MinIO)
- PostgreSQL running
- Node.js 18+

---

## 🏃 Setup (5 minutes)

### 1. Backend Setup

```bash
cd apps/backend

# 1. Start MinIO (S3-compatible storage)
docker-compose -f docker-compose.minio.yml up -d

# 2. Wait 5 seconds for MinIO to start
sleep 5

# 3. Configure .env (copy-paste)
cat >> .env << 'EOF'

# Storage
STORAGE_PROVIDER="minio"
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="socialvibe"
EOF

# 4. Run migrations
npx prisma migrate dev

# 5. Seed database (20 users + interactions)
npm run seed

# 6. Start backend
npm run dev
```

### 2. Frontend Setup

```bash
cd apps/frontend
npm run dev
```

---

## 🧪 Test Features

### 1. Test Seed Data

**Login avec n'importe quel compte:**
- Email: `alice@socialvibe.com` (ou bob, charlie, diana, ethan...)
- Password: `password123`

**Tu verras:**
- ✅ 40-80 posts existants
- ✅ Likes, commentaires déjà présents
- ✅ Amis déjà connectés
- ✅ Profils complets avec avatars

### 2. Test WebSockets (Real-time)

**Ouvre 2 onglets:**
1. Onglet 1: Login Alice
2. Onglet 2: Login Bob

**Actions:**
- ✅ Alice crée un post → Bob le voit instantanément (sans F5)
- ✅ Bob like le post d'Alice → Alice reçoit notification live
- ✅ Voir qui est en ligne (pastille verte sur avatars)

**Console logs:**
- `✅ WebSocket connected` → Connection OK
- `❌ WebSocket disconnected` → Si déconnecté

### 3. Test Upload (MinIO S3)

**Dans l'app:**
1. Clique "Create Post"
2. Upload une image depuis ton PC
3. Image uploadée sur MinIO
4. URL retournée: `http://localhost:9000/socialvibe/uploads/...`

**Vérifie MinIO Console:**
- URL: http://localhost:9001
- Login: minioadmin / minioadmin
- Bucket: `socialvibe`
- Dossier: `uploads/`

### 4. Test Switch Storage (Cloudinary)

**Pour tester Cloudinary:**
```bash
# .env
STORAGE_PROVIDER="cloudinary"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Redémarrer backend → Upload automatiquement sur Cloudinary!

---

## 📊 Data Summary (Seed)

```
👥 Users: 20
🤝 Friendships: 100+
📝 Posts: 40-80
❤️ Likes: 200+
💬 Comments: 100+
↩️ Replies: 30+
⏳ Pending requests: 10
```

**Tous les comptes:**
```
alice@socialvibe.com (@alice)
bob@socialvibe.com (@bob)
charlie@socialvibe.com (@charlie)
diana@socialvibe.com (@diana)
ethan@socialvibe.com (@ethan)
fiona@socialvibe.com (@fiona)
george@socialvibe.com (@george)
hannah@socialvibe.com (@hannah)
ian@socialvibe.com (@ian)
julia@socialvibe.com (@julia)
kevin@socialvibe.com (@kevin)
laura@socialvibe.com (@laura)
mike@socialvibe.com (@mike)
nina@socialvibe.com (@nina)
oscar@socialvibe.com (@oscar)
paula@socialvibe.com (@paula)
quinn@socialvibe.com (@quinn)
ryan@socialvibe.com (@ryan)
sarah@socialvibe.com (@sarah)
tom@socialvibe.com (@tom)
```

---

## 🔍 Troubleshooting

### WebSocket not connecting

```bash
# Check backend logs
# Should see: "📦 Storage: MinIO (S3-compatible)"

# Check console
# Should see: "✅ WebSocket connected"

# If token error:
localStorage.clear()
# Then login again
```

### Upload fails

```bash
# Check MinIO is running
docker ps | grep minio

# Check bucket exists
curl http://localhost:9000/socialvibe/

# Check MinIO console
open http://localhost:9001
```

### Seed data not showing

```bash
# Re-seed (clears existing data)
npm run seed

# Check database
npx prisma studio
```

---

## 🎯 What to Test

✅ **Real-time:**
- [ ] Create post → Appears on other tab instantly
- [ ] Like post → Author receives notification
- [ ] Online status → Green dot on online users

✅ **Upload:**
- [ ] Upload image → Stored on MinIO
- [ ] Image displays in post
- [ ] Access image directly via URL

✅ **Seed:**
- [ ] Login with different accounts
- [ ] See existing posts/likes/comments
- [ ] Friends already connected
- [ ] Pending friend requests visible

---

## 🚀 Next Steps

1. **Test real-time** (2 onglets)
2. **Test upload** (add images)
3. **Explore seed data** (login different users)
4. **Switch Cloudinary** (optional)

Enjoy! 🎉
