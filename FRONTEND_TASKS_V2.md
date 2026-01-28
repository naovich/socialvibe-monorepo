# 🚀 Frontend Tasks V2 - SocialVibe (Fonctionnalités Complètes)

## 🎯 Objectif
Développer toutes les fonctionnalités front avec **mock data fonctionnel**, structure prête pour backend.

## 📁 Structure des Features

```
apps/frontend/src/
├── components/
│   ├── feed/           # Home feed (existant)
│   ├── messages/       # 💬 Direct Messages (nouveau)
│   ├── stories/        # 📸 Stories (existant, à compléter)
│   ├── friends/        # 👥 Friends & Requests (nouveau)
│   ├── groups/         # 👨‍👩‍👧‍👦 Groups (nouveau)
│   ├── saved/          # 🔖 Saved Posts (nouveau)
│   ├── profile/        # 👤 Profile (existant)
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── features/           # Feature-based modules (nouveau)
│   ├── messages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── stories/
│   ├── friends/
│   ├── groups/
│   └── saved/
├── mock/               # Mock data
├── services/           # API services
└── store/              # Zustand stores
```

---

## Phase 1 : Design System 🎨 (PRIORITÉ 1)

### 1.1 Couleurs & Tokens
- [ ] Convertir en Pantone 355C (`#009639`)
- [ ] Fond blanc `#ffffff`
- [ ] Mettre à jour `design-tokens.css`
- [ ] Ajuster tous les composants existants

### 1.2 Sidebar - Nettoyage
- [ ] **Supprimer :** Marketplace, Watch, Pages, Memories, Events
- [ ] **Garder :** Home, Friends, Groups, Saved
- [ ] Ajuster la navigation

**Estimation:** 2-3h

---

## Phase 2 : Navigation & Core UX 🧭 (PRIORITÉ 2)

### 2.1 Système de Navigation
- [ ] Créer `src/router/` simple (state-based)
- [ ] Views : home, profile, messages, stories, friends, groups, saved
- [ ] Breadcrumb navigation
- [ ] Fix liens internes (plus de `target="_blank"`)

### 2.2 Layout Responsive
- [ ] Header adaptatif
- [ ] Sidebar collapsible
- [ ] Mobile bottom nav
- [ ] Tablet layout

**Estimation:** 2-3h

---

## Phase 3 : 💬 Messages (Direct Messages) - FEATURE COMPLÈTE

### Structure Dossiers
```
src/features/messages/
├── components/
│   ├── MessagesList.tsx        # Liste conversations
│   ├── ConversationHeader.tsx  # Header conversation
│   ├── MessageBubble.tsx       # Bulle message
│   ├── MessageInput.tsx        # Input message
│   ├── EmojiPicker.tsx         # Picker emojis
│   └── AttachmentPreview.tsx   # Preview fichiers
├── hooks/
│   ├── useMessages.ts
│   └── useConversations.ts
├── services/
│   └── messagesService.ts      # API calls (mock)
├── types/
│   └── message.types.ts
└── mock/
    └── mockMessages.ts
```

### 3.1 UI Messages
- [ ] Liste des conversations (sidebar gauche)
- [ ] Conversation active (centre)
- [ ] Input avec emojis, fichiers
- [ ] Bulles messages (sent/received)
- [ ] Status messages (sent, delivered, read)
- [ ] Typing indicator
- [ ] Online/offline status

### 3.2 Fonctionnalités
- [ ] Envoyer message texte
- [ ] Envoyer image/fichier
- [ ] Réagir à un message (emojis)
- [ ] Supprimer message
- [ ] Rechercher dans conversation
- [ ] Scroll automatique vers nouveau message
- [ ] Notifications nouveau message

### 3.3 Mock Data
- [ ] `mockConversations.ts` - 10+ conversations
- [ ] `mockMessages.ts` - Messages par conversation
- [ ] Mock users pour conversations

### 3.4 Store Zustand
- [ ] `useMessagesStore.ts`
- [ ] Actions: sendMessage, deleteMessage, reactToMessage
- [ ] Persist conversations

**Estimation:** 6-8h

---

## Phase 4 : 📸 Stories - FEATURE COMPLÈTE

### Structure Dossiers
```
src/features/stories/
├── components/
│   ├── StoriesCarousel.tsx     # Carousel horizontal
│   ├── StoryViewer.tsx         # Fullscreen viewer
│   ├── StoryCreator.tsx        # Créer story
│   ├── StoryProgress.tsx       # Barre progression
│   └── StoryReactions.tsx      # Réactions
├── hooks/
│   └── useStories.ts
├── services/
│   └── storiesService.ts
├── types/
│   └── story.types.ts
└── mock/
    └── mockStories.ts
```

### 4.1 UI Stories
- [ ] Carousel stories (header)
- [ ] Fullscreen viewer (modal)
- [ ] Progress bar (timeline)
- [ ] Swipe gauche/droite
- [ ] Tap pour pause/play
- [ ] Story creator (upload image + text)

### 4.2 Fonctionnalités
- [ ] Voir story (auto-play, 5s par story)
- [ ] Créer story (image + texte overlay)
- [ ] Réagir à story (emojis + message)
- [ ] Voir qui a vu ta story
- [ ] Supprimer sa story
- [ ] Story expire après 24h
- [ ] Indicateur "nouveau" sur stories non vues

### 4.3 Mock Data
- [ ] `mockStories.ts` - 15+ stories
- [ ] Images placeholder (Unsplash)
- [ ] Viewed/unviewed logic

### 4.4 Store Zustand
- [ ] `useStoriesStore.ts`
- [ ] Actions: viewStory, createStory, reactToStory

**Estimation:** 5-7h

---

## Phase 5 : 👥 Friends - FEATURE COMPLÈTE

### Structure Dossiers
```
src/features/friends/
├── components/
│   ├── FriendsList.tsx         # Liste amis
│   ├── FriendCard.tsx          # Card ami
│   ├── FriendRequests.tsx      # Demandes en attente
│   ├── SuggestedFriends.tsx    # Suggestions
│   └── FriendSearch.tsx        # Recherche amis
├── hooks/
│   └── useFriends.ts
├── services/
│   └── friendsService.ts
├── types/
│   └── friend.types.ts
└── mock/
    └── mockFriends.ts
```

### 5.1 UI Friends
- [ ] Tabs: All Friends, Requests, Suggestions
- [ ] Liste amis (grid cards)
- [ ] Friend requests avec accept/decline
- [ ] Suggestions basées sur amis communs
- [ ] Recherche amis

### 5.2 Fonctionnalités
- [ ] Voir liste amis
- [ ] Envoyer demande ami
- [ ] Accepter/Refuser demande
- [ ] Retirer un ami
- [ ] Voir amis communs
- [ ] Voir profil ami
- [ ] Bloquer/Débloquer

### 5.3 Mock Data
- [ ] `mockFriends.ts` - 30+ amis
- [ ] `mockFriendRequests.ts` - 5+ demandes
- [ ] `mockSuggestions.ts` - 10+ suggestions
- [ ] Mutual friends logic

### 5.4 Store Zustand
- [ ] `useFriendsStore.ts`
- [ ] Actions: sendRequest, acceptRequest, removeFriend

**Estimation:** 4-6h

---

## Phase 6 : 👨‍👩‍👧‍👦 Groups - FEATURE COMPLÈTE

### Structure Dossiers
```
src/features/groups/
├── components/
│   ├── GroupsList.tsx          # Liste groupes
│   ├── GroupCard.tsx           # Card groupe
│   ├── GroupFeed.tsx           # Feed groupe
│   ├── GroupMembers.tsx        # Membres
│   ├── GroupSettings.tsx       # Paramètres
│   └── CreateGroupModal.tsx    # Créer groupe
├── hooks/
│   └── useGroups.ts
├── services/
│   └── groupsService.ts
├── types/
│   └── group.types.ts
└── mock/
    └── mockGroups.ts
```

### 6.1 UI Groups
- [ ] Liste groupes (joined, suggested)
- [ ] Page groupe (feed + about + members)
- [ ] Create group modal
- [ ] Group settings
- [ ] Member management

### 6.2 Fonctionnalités
- [ ] Voir liste groupes
- [ ] Créer groupe (nom, description, privacy)
- [ ] Rejoindre/Quitter groupe
- [ ] Poster dans groupe
- [ ] Inviter amis dans groupe
- [ ] Gérer membres (admin)
- [ ] Privacy: Public/Private

### 6.3 Mock Data
- [ ] `mockGroups.ts` - 10+ groupes
- [ ] Posts par groupe
- [ ] Members par groupe

### 6.4 Store Zustand
- [ ] `useGroupsStore.ts`
- [ ] Actions: createGroup, joinGroup, leaveGroup, postToGroup

**Estimation:** 5-7h

---

## Phase 7 : 🔖 Saved Posts - FEATURE COMPLÈTE

### Structure Dossiers
```
src/features/saved/
├── components/
│   ├── SavedPostsList.tsx      # Liste posts sauvés
│   ├── SavedCollections.tsx    # Collections
│   └── CreateCollectionModal.tsx
├── hooks/
│   └── useSaved.ts
├── services/
│   └── savedService.ts
├── types/
│   └── saved.types.ts
└── mock/
    └── mockSaved.ts
```

### 7.1 UI Saved
- [ ] Grid posts sauvés
- [ ] Collections (catégories)
- [ ] Créer collection
- [ ] Ajouter post à collection
- [ ] Recherche dans saved

### 7.2 Fonctionnalités
- [ ] Sauvegarder un post
- [ ] Retirer de saved
- [ ] Créer collection (ex: "Recipes", "Travel")
- [ ] Ajouter à collection
- [ ] Voir posts par collection
- [ ] Rechercher dans saved

### 7.3 Mock Data
- [ ] `mockSaved.ts` - 20+ posts sauvés
- [ ] Collections avec posts

### 7.4 Store Zustand
- [ ] `useSavedStore.ts`
- [ ] Actions: savePost, unsavePost, createCollection

**Estimation:** 3-4h

---

## Phase 8 : 🔔 Notifications - FEATURE COMPLÈTE

### Structure Dossiers
```
src/features/notifications/
├── components/
│   ├── NotificationsList.tsx
│   ├── NotificationItem.tsx
│   └── NotificationBadge.tsx
├── hooks/
│   └── useNotifications.ts
├── services/
│   └── notificationsService.ts
├── types/
│   └── notification.types.ts
└── mock/
    └── mockNotifications.ts
```

### 8.1 UI Notifications
- [ ] Notification center (dropdown)
- [ ] Badge count
- [ ] Liste notifications
- [ ] Mark as read
- [ ] Filter par type

### 8.2 Types de Notifications
- [ ] Like sur post
- [ ] Commentaire sur post
- [ ] Friend request
- [ ] Message reçu
- [ ] Mention dans post/comment
- [ ] Invitation groupe
- [ ] Réaction sur story

### 8.3 Mock Data
- [ ] `mockNotifications.ts` - 30+ notifications

### 8.4 Store Zustand
- [ ] `useNotificationsStore.ts`
- [ ] Actions: markAsRead, deleteNotification

**Estimation:** 3-4h

---

## Phase 9 : 🔍 Search Globale - FEATURE COMPLÈTE

### 9.1 UI Search
- [ ] Search bar (header)
- [ ] Tabs: All, Users, Posts, Groups
- [ ] Résultats en temps réel
- [ ] Historique de recherche
- [ ] Trending searches

### 9.2 Fonctionnalités
- [ ] Rechercher users
- [ ] Rechercher posts (caption, hashtags)
- [ ] Rechercher groups
- [ ] Debounce (300ms)
- [ ] Highlight matching text
- [ ] Click → navigation

### 9.3 Mock Data
- [ ] Index searchable (users + posts + groups)

**Estimation:** 3-4h

---

## Phase 10 : Profile Complet 👤

### 10.1 Ajouts Profile
- [ ] Edit profile modal (bio, avatar, cover)
- [ ] Tabs: Posts, About, Friends
- [ ] Photo gallery
- [ ] Voir profil d'un autre user
- [ ] Follow/Unfollow (si pas ami)

### 10.2 Mock Data
- [ ] Profiles complets pour mock users

**Estimation:** 3-4h

---

## Phase 11 : Posts Améliorés ✨

### 11.1 Features Posts
- [ ] Upload multi-images (carousel)
- [ ] Video posts (preview + play)
- [ ] Poll posts (créer + voter)
- [ ] Feeling/Activity (emoji status)
- [ ] Tag friends dans post
- [ ] Location dans post
- [ ] Privacy selector (Public/Friends/Only Me)

### 11.2 Interactions
- [ ] Share post (repost)
- [ ] Edit post
- [ ] Delete post
- [ ] Report post

**Estimation:** 4-5h

---

## Phase 12 : Polish & UX ✨

### 12.1 Animations
- [ ] Page transitions
- [ ] Hover effects
- [ ] Loading states
- [ ] Skeleton screens

### 12.2 Error Handling
- [ ] Toast notifications
- [ ] Error boundaries
- [ ] Retry logic

### 12.3 Performance
- [ ] Lazy loading images
- [ ] Virtual scroll (messages, feed)
- [ ] Code splitting par feature
- [ ] Optimistic UI

### 12.4 Responsive
- [ ] Mobile UX complet
- [ ] Tablet optimization
- [ ] Touch gestures

**Estimation:** 4-6h

---

## Phase 13 : Backend Integration 🔌 (Plus tard)

### 13.1 API Client Setup
- [ ] Axios configuration
- [ ] JWT interceptors
- [ ] Error handling

### 13.2 Remplacer Mock par API
- [ ] Posts → `GET /posts`
- [ ] Messages → WebSocket + API
- [ ] Stories → API
- [ ] Friends → API
- [ ] Groups → API
- [ ] Notifications → WebSocket

**Estimation:** 6-8h

---

## Phase 14 : Tests & Docs 🧪

### 14.1 Tests
- [ ] Unit tests (Vitest)
- [ ] Component tests
- [ ] E2E tests (Playwright)

### 14.2 Documentation
- [ ] Components documentation
- [ ] Features documentation
- [ ] API integration guide

**Estimation:** 6-8h

---

## 📊 Estimation Totale

| Phase | Feature | Temps |
|-------|---------|-------|
| 1 | Design System | 2-3h |
| 2 | Navigation | 2-3h |
| 3 | Messages | 6-8h |
| 4 | Stories | 5-7h |
| 5 | Friends | 4-6h |
| 6 | Groups | 5-7h |
| 7 | Saved | 3-4h |
| 8 | Notifications | 3-4h |
| 9 | Search | 3-4h |
| 10 | Profile | 3-4h |
| 11 | Posts améliorés | 4-5h |
| 12 | Polish & UX | 4-6h |
| 13 | Backend (later) | 6-8h |
| 14 | Tests (later) | 6-8h |

**Total Frontend:** ~50-65h  
**Avec Backend:** ~56-73h

---

## 🎯 Ordre de Priorité

### Sprint 1 (Fondations) 🚀
1. **Phase 1** - Design System (Pantone 355C)
2. **Phase 2** - Navigation clean
3. **Phase 3** - Messages (feature #1)

### Sprint 2 (Social Core) 👥
4. **Phase 4** - Stories
5. **Phase 5** - Friends
6. **Phase 8** - Notifications

### Sprint 3 (Community) 🎉
7. **Phase 6** - Groups
8. **Phase 7** - Saved Posts
9. **Phase 9** - Search

### Sprint 4 (Polish) ✨
10. **Phase 10** - Profile complet
11. **Phase 11** - Posts améliorés
12. **Phase 12** - Polish & UX

### Sprint 5 (Backend) 🔌
13. **Phase 13** - Backend integration
14. **Phase 14** - Tests

---

## 📝 Notes Importantes

### Mock Data Structure
Chaque feature aura sa propre mock data **fonctionnelle** :
- State management complet
- Actions complètes
- Prêt pour remplacer par API

### Features à Supprimer
❌ **Retirer du Sidebar :**
- Marketplace
- Watch
- Pages
- Memories
- Events

✅ **Garder :**
- Home (Feed)
- Messages
- Friends
- Groups
- Saved

### Design
- **Primary:** Pantone 355C `#009639`
- **Background:** Blanc `#ffffff`
- **Contraste:** WCAG AA minimum

---

**Prêt à démarrer ?** On commence par la **Phase 1** (Design System), puis **Phase 2** (Navigation), puis **Phase 3** (Messages) ! 🚀
