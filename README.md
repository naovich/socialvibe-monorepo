# 🚀 SocialVibe - Monorepo

Modern social network built with React, NestJS, and Turborepo.

## 📦 Structure

```
socialvibe-monorepo/
├── apps/
│   ├── frontend/    # React + Vite + Tailwind
│   └── backend/     # NestJS + Prisma + PostgreSQL
├── packages/        # Shared packages (future)
├── turbo.json       # Turborepo configuration
└── package.json     # Root workspace
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19
- **Build:** Vite
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Animations:** Framer Motion
- **Language:** TypeScript

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL + Prisma
- **Auth:** JWT + Passport
- **Validation:** class-validator
- **Language:** TypeScript

### Monorepo
- **Tool:** Turborepo
- **Package Manager:** npm workspaces

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9
- Docker (for PostgreSQL)

### Installation

```bash
# Install all dependencies
npm install

# Start PostgreSQL (backend)
cd apps/backend
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev

# Return to root
cd ../..
```

### Development

```bash
# Run both apps in dev mode
npm run dev

# Or run individually
npm run dev --workspace=@socialvibe/frontend
npm run dev --workspace=@socialvibe/backend
```

Apps will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

### Build

```bash
# Build all apps
npm run build

# Build specific app
npm run build --workspace=@socialvibe/frontend
```

### Lint

```bash
# Lint all apps
npm run lint
```

### Test

```bash
# Run tests
npm run test
```

## 📁 Workspaces

- `@socialvibe/frontend` - React application
- `@socialvibe/backend` - NestJS API

## 🔧 Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps for production
- `npm run lint` - Lint all code
- `npm run test` - Run tests
- `npm run clean` - Clean build artifacts

## 🌟 Features

### Frontend
- 30+ React components
- Dark/Light theme
- Gamification system (Vibe Score, Badges)
- Emoji reactions
- Real-time updates ready
- Responsive design

### Backend
- JWT authentication
- RESTful API
- PostgreSQL database
- Prisma ORM
- CRUD operations (Posts, Comments, Likes)
- User management

## 📝 Environment Variables

### Frontend (`apps/frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Backend (`apps/backend/.env`)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialvibe?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

## 🚢 Deployment

### Frontend
```bash
cd apps/frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, etc.
```

### Backend
```bash
cd apps/backend
npm run build
npm run start:prod
```

## 📚 Documentation

- [Frontend README](./apps/frontend/README.md)
- [Backend README](./apps/backend/README.md)
- [Turborepo Docs](https://turbo.build/repo/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run build`
4. Submit a pull request

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ by Night Builder**
