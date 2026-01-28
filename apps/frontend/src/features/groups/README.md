# 👨‍👩‍👧‍👦 Groups Feature

Community groups.

## Components

- `GroupsList.tsx` - Liste groupes
- `GroupCard.tsx` - Card groupe
- `GroupFeed.tsx` - Feed groupe
- `GroupMembers.tsx` - Membres
- `GroupSettings.tsx` - Paramètres (admin)
- `CreateGroupModal.tsx` - Créer groupe

## Features

- [x] Liste groupes (joined/suggested)
- [ ] Créer groupe
- [ ] Rejoindre/Quitter
- [ ] Poster dans groupe
- [ ] Inviter amis
- [ ] Gérer membres (admin)
- [ ] Privacy (Public/Private)

## Mock Data

`mockGroups.ts` - Groupes avec posts et membres

## API (Future)

- `GET /groups` - Liste groupes
- `POST /groups` - Créer groupe
- `POST /groups/:id/join` - Rejoindre
- `DELETE /groups/:id/leave` - Quitter
- `GET /groups/:id/posts` - Posts du groupe
- `POST /groups/:id/posts` - Poster
