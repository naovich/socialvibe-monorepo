# 🏠 Feed Feature (Mur / Page d'accueil)

Le feed principal (mur) où les utilisateurs voient les posts de leurs amis.

## Components

- `FeedContainer.tsx` - Container principal
- `PostCard.tsx` - Card de post (existant, à migrer)
- `CreatePostButton.tsx` - Bouton rapide création
- `FeedFilters.tsx` - Filtres (All, Friends, Following)
- `InfiniteScroll.tsx` - Scroll infini
- `FeedSkeleton.tsx` - Loading state

## Features

- [x] Afficher posts (mock data)
- [x] Créer post (modal)
- [x] Like/Unlike
- [x] Commenter
- [ ] Infinite scroll
- [ ] Filtres (All/Friends/Following)
- [ ] Refresh feed
- [ ] Share post
- [ ] Edit/Delete post

## Structure

Le feed agrège :
- Posts des amis
- Posts publics (si filtre All)
- Posts des groupes suivis
- Stories en header
- Create post quick button

## Mock Data

`mockFeed.ts` - Posts du feed avec auteurs, likes, comments

## Store

`useFeedStore.ts` - Gestion state feed avec Zustand

## API (Future)

- `GET /feed` - Feed posts (with pagination)
- `GET /feed/friends` - Only friends posts
- `POST /feed/refresh` - Pull to refresh
- `WebSocket` - Real-time new posts notification

## Migration Notes

Composants existants à migrer vers cette feature :
- `components/feed/PostCard.tsx` → `features/feed/components/PostCard.tsx`
- `components/feed/Stories.tsx` → Keep in layout (cross-feature)
- `components/feed/CreatePostModal.tsx` → `features/feed/components/CreatePostModal.tsx`
