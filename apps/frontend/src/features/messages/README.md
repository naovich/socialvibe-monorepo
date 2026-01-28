# 💬 Messages Feature

Direct messaging system.

## Components

- `MessagesList.tsx` - Liste des conversations
- `ConversationHeader.tsx` - Header de conversation
- `MessageBubble.tsx` - Bulle de message (sent/received)
- `MessageInput.tsx` - Input + emojis + attachments
- `EmojiPicker.tsx` - Sélecteur emojis
- `AttachmentPreview.tsx` - Preview fichiers

## Features

- [x] Liste conversations
- [x] Conversation 1-to-1
- [x] Envoyer texte/emoji
- [x] Envoyer images
- [ ] Typing indicator
- [ ] Read receipts
- [ ] Réactions messages
- [ ] Recherche dans conversation

## Mock Data

`mockMessages.ts` - Conversations et messages fictifs

## Store

`useMessagesStore.ts` - Gestion state messages avec Zustand

## API (Future)

- `GET /messages` - Liste conversations
- `GET /messages/:conversationId` - Messages d'une conversation
- `POST /messages` - Envoyer message
- `DELETE /messages/:id` - Supprimer message
- `WebSocket` - Real-time messages
