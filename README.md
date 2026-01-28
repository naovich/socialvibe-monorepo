# 🚀 SocialVibe - Modern Social Network

> A full-stack social network built with React, NestJS, and Turborepo.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)]()
[![License](https://img.shields.io/badge/license-Private-red)]()

---

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test
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

### ✅ Completed (Frontend)
- Stories System
- Nested Comments (3 levels)
- Share & Bookmark
- Search (Users + Hashtags)
- Polls & Emoji Picker
- Image Editor (8 filters)
- Error Boundaries & Loading States

### 🔄 In Progress (Backend)
- Authentication (JWT)
- REST API (Posts, Comments, Users)
- WebSocket (Real-time)
- File Upload (Images)

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

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ by Night Builder**
