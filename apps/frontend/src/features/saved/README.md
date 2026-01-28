# 🔖 Saved Posts Feature

Save and organize posts.

## Components

- `SavedPostsList.tsx` - Liste posts sauvés (grid)
- `SavedCollections.tsx` - Collections/catégories
- `CreateCollectionModal.tsx` - Créer collection

## Features

- [x] Liste saved posts
- [ ] Créer collection (ex: Recipes, Travel)
- [ ] Ajouter à collection
- [ ] Retirer de saved
- [ ] Rechercher dans saved
- [ ] Voir par collection

## Mock Data

`mockSaved.ts` - Posts sauvés + collections

## API (Future)

- `GET /saved` - Posts sauvés
- `POST /saved/:postId` - Sauvegarder
- `DELETE /saved/:postId` - Retirer
- `POST /saved/collections` - Créer collection
- `POST /saved/collections/:id/add/:postId` - Ajouter à collection
