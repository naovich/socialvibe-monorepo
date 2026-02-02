# 🚀 SocialVibe - Modern Social Network

> A full-stack social network built with React, NestJS, and Turborepo.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)]()
[![License](https://img.shields.io/badge/license-Private-red)]()

---

## 📦 Quick Start

### 1. Prerequisites

Ensure you have:
- Node.js 22+ installed
- Docker and Docker Compose installed
- WSL2 (if on Windows)

### 2. Setup Infrastructure

```bash
# Start PostgreSQL + MinIO with Docker Compose
docker-compose up -d

# Wait for containers to be healthy (~10 seconds)
docker-compose ps
```

### 3. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

### 4. Setup Database

```bash
# Run Prisma migrations
cd apps/backend
npx prisma migrate deploy

# (Optional) Seed database with demo data
npx prisma db seed
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run start:dev    # Backend on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev          # Frontend on http://localhost:5173
```

### 6. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs (Swagger):** http://localhost:3000/api/docs
- **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin)

---

## 🐳 Docker Services

The `docker-compose.yml` provides:

- **PostgreSQL 15** (port 5432)
  - Database: `socialvibe`
  - User: `postgres`
  - Password: `password`

- **MinIO** (ports 9000/9001)
  - API: http://localhost:9000
  - Console: http://localhost:9001
  - Credentials: `minioadmin` / `minioadmin`

**Stop services:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```

---

## 🏗️ Project Structure

```
socialvibe-monorepo/
├── apps/
│   ├── frontend/      # React + Vite + Tailwind
│   └── backend/       # NestJS + Prisma + PostgreSQL
├── tasks/             # Daily tasks with checkboxes
├── docs/              # Documentation & archived files
└── README.md
```

---

## 🎯 Key Features

### ✅ Completed

**Frontend:**
- Stories System (24h ephemeral content)
- Nested Comments (3 levels)
- Share & Bookmark
- Search (Users + Hashtags)
- Polls & Emoji Picker
- Image Editor (8 filters)
- Error Boundaries & Loading States
- Dark/Light Theme Toggle
- Responsive Design (Mobile/Desktop)

**Backend:**
- Authentication (JWT + Refresh Tokens)
- User Management (Register, Login, Profile)
- Posts (CRUD + Like)
- Comments (Add, Delete, Nested)
- Friendships (Request, Accept, Reject)
- Stories (24h, Auto-delete)
- Groups (Create, Join, Leave, Post)
- Messages (Real-time via WebSocket)
- Notifications (Real-time)
- Search (Users, Content)
- File Upload (MinIO S3-compatible)
- Email Service (Password Reset, Verification)
- Rate Limiting & Security Headers
- Swagger API Documentation

### 🔄 Future Enhancements
- Video Posts Support
- Live Streaming
- Voice/Video Calls
- Advanced Analytics
- Mobile Apps (React Native)

---

## 📚 Documentation

- **[Frontend README](./apps/frontend/README.md)** - React app documentation
- **[Backend README](./apps/backend/README.md)** - NestJS API documentation
- **[Tasks System](./tasks/README.md)** - Daily tasks tracking
- **[Code Review Report](./CODE_REVIEW_REPORT.md)** - Latest review
- **[PR Summary](./PR_SUMMARY.md)** - Feature branch summary

---

## 🛠️ Tech Stack

### Frontend
- React 19.2 + TypeScript
- Vite 7 + Tailwind CSS 4
- Zustand (state) + Framer Motion (animations)

### Backend
- NestJS + Prisma
- PostgreSQL + JWT
- WebSocket (Socket.io)

### Tools
- Turborepo (monorepo)
- ESLint + Prettier
- Vitest + Playwright

---

## 🚀 Development

### Frontend
```bash
cd apps/frontend
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run lint         # Lint code
```

### Backend
```bash
cd apps/backend
npm run start:dev    # Start dev server (port 3000)
npm run build        # Build for production
npx prisma studio    # Open Prisma Studio
```

---

## 📋 Tasks

Daily tasks are tracked in `tasks/YYYY-MM-DD.md` with checkboxes:
- `[ ]` = To do
- `[x]` = Done

See [tasks/README.md](./tasks/README.md) for details.

---

## 🔗 Links

- **GitHub:** [github.com/naovich/socialvibe-monorepo](https://github.com/naovich/socialvibe-monorepo)
- **Documentation:** `./docs/`
- **Tasks:** `./tasks/`

---

## 🔧 Troubleshooting

### Docker Permission Issues (Linux/WSL)

If you see permission errors with Docker:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply changes (or restart WSL)
newgrp docker

# Verify
docker ps
```

### Backend Not Starting

If backend exits immediately:

1. **Check PostgreSQL is running:**
   ```bash
   docker-compose ps
   ```

2. **Check logs:**
   ```bash
   cd apps/backend
   npm run start:dev
   ```
   (Keep terminal open)

3. **Alternative: Use tmux/screen:**
   ```bash
   tmux new -s backend
   cd apps/backend
   npm run start:dev
   # Press Ctrl+B then D to detach
   ```

### Port Already in Use

If ports 3000, 5173, or 5432 are busy:

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or stop old Docker containers
docker stop $(docker ps -aq)
docker-compose up -d
```

### Database Connection Error

```bash
# Reset database
docker-compose down -v  # Warning: destroys data
docker-compose up -d
cd apps/backend
npx prisma migrate deploy
```

---

## 📊 Project Status

- **Tests:** 29/29 backend unit tests passing ✅
- **Code Quality:** 0 TypeScript errors, 0 ESLint errors ✅
- **Infrastructure:** Docker Compose ready ✅
- **Documentation:** Swagger API docs available ✅

See [TEST_REPORT_2026-02-02.md](./TEST_REPORT_2026-02-02.md) for detailed test results.

---

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ by Night Builder**
