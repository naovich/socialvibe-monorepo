# Features Structure

Chaque feature est organisée en modules isolés et réutilisables.

## Structure

```
features/
├── messages/           # 💬 Direct Messages
├── stories/            # 📸 Stories
├── friends/            # 👥 Friends & Requests
├── groups/             # 👨‍👩‍👧‍👦 Groups
├── saved/              # 🔖 Saved Posts
└── notifications/      # 🔔 Notifications
```

## Pattern

Chaque feature contient :

- `components/` - UI components spécifiques à la feature
- `hooks/` - Custom hooks
- `services/` - API calls (mock puis real)
- `types/` - TypeScript types
- `mock/` - Mock data

## Exemple : Messages

```
messages/
├── components/
│   ├── MessagesList.tsx
│   ├── MessageBubble.tsx
│   └── MessageInput.tsx
├── hooks/
│   └── useMessages.ts
├── services/
│   └── messagesService.ts
├── types/
│   └── message.types.ts
└── mock/
    └── mockMessages.ts
```

## Guidelines

1. **Isolation** - Chaque feature est autonome
2. **Mock First** - Développer avec mock data
3. **Type-Safe** - TypeScript strict
4. **Ready for Backend** - Structure prête pour API
5. **Reusable** - Components réutilisables
