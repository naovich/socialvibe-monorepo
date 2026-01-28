# 🤝 Contributing to SocialVibe

## 📋 Workflow

### Before Every Push ⚠️

**TOUJOURS** builder avant de pousser :

```bash
# Quick check
npm run build

# Full pre-push checks (lint + build)
npm run pre-push
```

### Development Workflow

1. **Créer une branche** (optionnel)
   ```bash
   git checkout -b feature/ma-feature
   ```

2. **Développer**
   ```bash
   npm run dev
   ```

3. **Tester localement**
   - Vérifier que les apps fonctionnent
   - Pas d'erreurs dans la console

4. **Lint + Build**
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "✨ Add amazing feature"
   ```

6. **Push**
   ```bash
   git push origin main
   ```

---

## ✅ Pre-Push Checklist

- [ ] `npm run lint` passe sans erreur
- [ ] `npm run build` passe sans erreur
- [ ] Les apps démarrent correctement avec `npm run dev`
- [ ] Pas d'erreurs TypeScript
- [ ] Code testé manuellement

---

## 🎨 Commit Convention

Utilise des emojis et des messages clairs :

- ✨ `:sparkles:` - Nouvelle feature
- 🐛 `:bug:` - Bug fix
- 📝 `:memo:` - Documentation
- 🔧 `:wrench:` - Configuration
- ♻️ `:recycle:` - Refactoring
- 🎨 `:art:` - Style/UI
- ⚡ `:zap:` - Performance
- 🔒 `:lock:` - Security
- 🚀 `:rocket:` - Deployment

**Exemples:**
```
✨ Add user authentication
🐛 Fix login redirect loop
📝 Update README with setup instructions
🔧 Configure ESLint rules
```

---

## 🏗️ Structure du Monorepo

```
socialvibe-monorepo/
├── apps/
│   ├── frontend/          # React app
│   └── backend/           # NestJS API
├── packages/              # Shared code (future)
├── scripts/
│   └── pre-push.sh       # Pre-push checks
├── turbo.json            # Turborepo config
└── package.json          # Root workspace
```

---

## 🧪 Tests

### Lint
```bash
# Lint everything
npm run lint

# Lint one app
npm run lint --workspace=@socialvibe/frontend
```

### Build
```bash
# Build everything (with Turborepo cache)
npm run build

# Build one app
npm run build --workspace=@socialvibe/backend
```

### Clean
```bash
# Clean all build artifacts
npm run clean
```

---

## 📦 Adding Dependencies

### Root dependencies (dev tools)
```bash
npm install -D package-name
```

### Frontend dependencies
```bash
npm install package-name --workspace=@socialvibe/frontend
```

### Backend dependencies
```bash
npm install package-name --workspace=@socialvibe/backend
```

---

## 🚀 Turborepo Cache

Turborepo cache les builds pour aller plus vite :

**Premier build:** ~6-7 secondes  
**Builds suivants (cached):** <200ms ⚡

Le cache est local et ne nécessite aucune configuration.

---

## 🔍 Debugging

### Frontend ne démarre pas
```bash
cd apps/frontend
rm -rf node_modules dist
npm install
npm run build
```

### Backend ne démarre pas
```bash
cd apps/backend
npx prisma generate
npm run build
```

### Database issues
```bash
cd apps/backend
npx prisma migrate reset  # ⚠️ Efface les données
npx prisma migrate dev
```

---

## 📝 Code Style

- **TypeScript strict mode** activé
- **ESLint** configuré
- **Prettier** (optionnel, à ajouter)
- **Pas de `any`** types
- **Imports organisés** (React en premier)

---

## 🎯 Quality Standards

### TypeScript
- ✅ 0 erreurs `tsc`
- ✅ Pas de `any`
- ✅ Interfaces bien définies

### ESLint
- ✅ 0 erreurs
- ✅ 0 warnings

### Build
- ✅ Frontend build < 5s
- ✅ Backend build < 5s
- ✅ Total < 10s

---

## 🤝 Pull Requests

1. Fork le repo
2. Crée une branche
3. Fait tes changements
4. Run `npm run pre-push`
5. Commit et push
6. Ouvre une PR avec description claire

---

## 📞 Support

- **Issues:** https://github.com/naovich/socialvibe-monorepo/issues
- **Discussions:** https://github.com/naovich/socialvibe-monorepo/discussions

---

**Merci de contribuer à SocialVibe ! 🎉**
