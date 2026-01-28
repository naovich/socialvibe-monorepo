# 👥 Friends Feature

Friend management system.

## Components

- `FriendsList.tsx` - Liste amis (grid)
- `FriendCard.tsx` - Card ami
- `FriendRequests.tsx` - Demandes en attente
- `SuggestedFriends.tsx` - Suggestions
- `FriendSearch.tsx` - Recherche

## Features

- [x] Liste amis
- [x] Friend requests (accept/decline)
- [ ] Suggestions (mutual friends)
- [ ] Envoyer demande
- [ ] Retirer ami
- [ ] Bloquer/Débloquer
- [ ] Voir profil ami

## Mock Data

`mockFriends.ts` - Amis, demandes, suggestions

## API (Future)

- `GET /friends` - Liste amis
- `GET /friends/requests` - Demandes
- `GET /friends/suggestions` - Suggestions
- `POST /friends/request/:userId` - Envoyer demande
- `POST /friends/accept/:requestId` - Accepter
- `DELETE /friends/:userId` - Retirer
