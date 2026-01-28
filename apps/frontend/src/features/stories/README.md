# 📸 Stories Feature

Instagram-like stories (24h expiration).

## Components

- `StoriesCarousel.tsx` - Carousel horizontal (header)
- `StoryViewer.tsx` - Fullscreen viewer
- `StoryCreator.tsx` - Créer story (upload + text)
- `StoryProgress.tsx` - Progress bar
- `StoryReactions.tsx` - Réactions emojis

## Features

- [x] Voir stories (carousel)
- [x] Fullscreen viewer
- [x] Auto-play (5s par story)
- [ ] Créer story (image + text overlay)
- [ ] Réagir à story
- [ ] Voir qui a vu
- [ ] Swipe gauche/droite
- [ ] Tap pour pause

## Mock Data

`mockStories.ts` - Stories avec images, vues, réactions

## API (Future)

- `GET /stories` - Liste stories (friends)
- `POST /stories` - Créer story
- `POST /stories/:id/view` - Marquer comme vue
- `POST /stories/:id/react` - Réagir
- `DELETE /stories/:id` - Supprimer
