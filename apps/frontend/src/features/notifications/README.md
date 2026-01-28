# 🔔 Notifications Feature

Real-time notifications system.

## Components

- `NotificationsList.tsx` - Liste notifications
- `NotificationItem.tsx` - Item notification
- `NotificationBadge.tsx` - Badge count

## Types de Notifications

- Like sur post
- Commentaire sur post
- Friend request
- Message reçu
- Mention dans post/comment
- Invitation groupe
- Réaction sur story

## Features

- [x] Liste notifications
- [x] Badge count (unread)
- [ ] Mark as read
- [ ] Filter par type
- [ ] Click → navigation
- [ ] Real-time updates (WebSocket)

## Mock Data

`mockNotifications.ts` - Notifications avec types variés

## API (Future)

- `GET /notifications` - Liste notifications
- `PATCH /notifications/:id/read` - Marquer lu
- `DELETE /notifications/:id` - Supprimer
- `WebSocket` - Real-time notifications
