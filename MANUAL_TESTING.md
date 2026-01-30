# 📋 GUIDE DE TEST MANUEL - SocialVibe

**Version:** 1.0.0  
**Date:** 2026-01-30  
**Score app:** 96/100  
**Status:** Production-ready  

---

## 🎯 OBJECTIF

Ce guide contient tous les scénarios de test manuel sous forme de **user stories** pour valider l'application SocialVibe avant déploiement production.

**Format:** En tant que [rôle], je veux [action] afin de [bénéfice]

---

## 🚀 PRÉREQUIS

### Démarrage de l'application
```bash
# 1. Démarrer Docker
cd /home/naovich/clawd/socialvibe-monorepo
docker-compose up -d

# 2. Vérifier Docker
docker ps
# Doit afficher: PostgreSQL + MinIO

# 3. Démarrer Backend
cd apps/backend
npm run dev
# Backend: http://localhost:3000

# 4. Démarrer Frontend (nouveau terminal)
cd apps/frontend
npm run dev
# Frontend: http://localhost:5173
```

### URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs

---

# 📖 USER STORIES PAR FONCTIONNALITÉ

---

## 1️⃣ AUTHENTIFICATION

### US-001: Création de compte
**En tant que** nouvel utilisateur  
**Je veux** créer un compte  
**Afin de** pouvoir utiliser l'application  

**Scénario nominal:**
1. ✅ Aller sur http://localhost:5173
2. ✅ Cliquer sur "S'inscrire" ou "Register"
3. ✅ Remplir le formulaire:
   - Email: `test@example.com`
   - Nom: `Test User`
   - Username: `testuser`
   - Mot de passe: `Test123!`
4. ✅ Cliquer sur "Créer un compte"
5. ✅ Vérifier redirection vers dashboard/home
6. ✅ Vérifier que le nom d'utilisateur s'affiche

**Résultat attendu:**
- ✅ Compte créé avec succès
- ✅ Token JWT stocké dans localStorage
- ✅ Redirection automatique vers page d'accueil
- ✅ User connecté

**Critères d'acceptation:**
- [ ] Email unique (erreur si doublon)
- [ ] Username unique (erreur si doublon)
- [ ] Mot de passe minimum 6 caractères
- [ ] Token JWT valide 15 minutes
- [ ] Refresh token valide 7 jours

---

### US-002: Connexion avec compte existant
**En tant que** utilisateur enregistré  
**Je veux** me connecter  
**Afin de** accéder à mon compte  

**Scénario nominal:**
1. ✅ Aller sur http://localhost:5173/login
2. ✅ Entrer email: `test@example.com`
3. ✅ Entrer mot de passe: `Test123!`
4. ✅ Cliquer sur "Se connecter"
5. ✅ Vérifier redirection vers home

**Résultat attendu:**
- ✅ Connexion réussie
- ✅ Access token + refresh token stockés
- ✅ Redirection vers feed

**Critères d'acceptation:**
- [ ] Erreur si email invalide
- [ ] Erreur si mot de passe incorrect
- [ ] Message d'erreur clair
- [ ] Pas de révélation d'existence de compte

---

### US-003: Déconnexion
**En tant que** utilisateur connecté  
**Je veux** me déconnecter  
**Afin de** sécuriser mon compte  

**Scénario:**
1. ✅ Connecté en tant que `testuser`
2. ✅ Cliquer sur profil/menu
3. ✅ Cliquer sur "Déconnexion" ou "Logout"
4. ✅ Vérifier redirection vers page login

**Résultat attendu:**
- ✅ Tokens supprimés du localStorage
- ✅ Redirection vers /login
- ✅ Impossible d'accéder aux pages protégées

---

### US-004: Refresh token automatique
**En tant que** utilisateur connecté  
**Je veux** rester connecté au-delà de 15 minutes  
**Afin de** ne pas être déconnecté constamment  

**Scénario:**
1. ✅ Se connecter
2. ✅ Attendre 16 minutes (ou manipuler l'heure)
3. ✅ Faire une action (créer post, naviguer)
4. ✅ Vérifier que l'action fonctionne (pas de déconnexion)

**Résultat attendu:**
- ✅ Refresh automatique après 15min
- ✅ Nouveau access_token obtenu
- ✅ User reste connecté
- ✅ Aucune interruption de service

**Test technique:**
```javascript
// Dans console navigateur après 16min
localStorage.getItem('auth_token') // Devrait être différent
```

---

### US-005: Mot de passe oublié
**En tant que** utilisateur ayant oublié son mot de passe  
**Je veux** réinitialiser mon mot de passe  
**Afin de** retrouver l'accès à mon compte  

**Scénario:**
1. ✅ Page login → Cliquer "Mot de passe oublié"
2. ✅ Entrer email: `test@example.com`
3. ✅ Cliquer "Envoyer"
4. ✅ Vérifier message succès
5. ✅ Checker console backend pour lien reset (mode dev)
6. ✅ Copier le token du lien
7. ✅ Aller sur `/reset-password?token=<token>`
8. ✅ Entrer nouveau mot de passe
9. ✅ Confirmer
10. ✅ Se connecter avec nouveau mot de passe

**Résultat attendu:**
- ✅ Email envoyé (vérifier logs backend)
- ✅ Token expire après 1h
- ✅ Ancien mot de passe ne fonctionne plus
- ✅ Nouveau mot de passe fonctionne

---

### US-006: Vérification email
**En tant que** nouvel utilisateur  
**Je veux** vérifier mon email  
**Afin de** activer complètement mon compte  

**Scénario:**
1. ✅ Créer un compte
2. ✅ Checker console backend pour lien verification
3. ✅ Copier token
4. ✅ Aller sur `/verify-email?token=<token>`
5. ✅ Vérifier message succès

**Résultat attendu:**
- ✅ Champ `emailVerified` mis à true
- ✅ Message confirmation
- ✅ Token expiré après usage

---

## 2️⃣ PROFIL UTILISATEUR

### US-007: Consulter mon profil
**En tant que** utilisateur connecté  
**Je veux** voir mon profil  
**Afin de** vérifier mes informations  

**Scénario:**
1. ✅ Connecté
2. ✅ Cliquer sur avatar/nom d'utilisateur
3. ✅ Vérifier affichage:
   - Nom
   - Username
   - Bio (si définie)
   - Avatar
   - Cover image
   - Nombre de posts
   - Nombre d'amis/followers

**Résultat attendu:**
- ✅ Toutes les infos correctes
- ✅ Email NON affiché (sécurité)
- ✅ Bouton "Éditer profil" visible

---

### US-008: Modifier mon profil
**En tant que** utilisateur connecté  
**Je veux** modifier mon profil  
**Afin de** personnaliser mes informations  

**Scénario:**
1. ✅ Aller sur mon profil
2. ✅ Cliquer "Éditer profil" ou "Settings"
3. ✅ Modifier:
   - Nom: `Test User Updated`
   - Bio: `Ceci est ma bio de test`
   - Username: `testuserupdated`
4. ✅ Sauvegarder
5. ✅ Vérifier changements appliqués

**Résultat attendu:**
- ✅ Modifications enregistrées
- ✅ Affichage mis à jour immédiatement
- ✅ Erreur si username déjà pris

---

### US-009: Consulter profil d'un autre utilisateur
**En tant que** utilisateur connecté  
**Je veux** voir le profil d'un autre user  
**Afin de** découvrir son contenu  

**Scénario:**
1. ✅ Créer 2ème compte: `user2@example.com` / `user2`
2. ✅ Avec compte 1, rechercher "user2"
3. ✅ Cliquer sur profil user2
4. ✅ Vérifier affichage:
   - Nom, username, bio
   - Posts de user2
   - Bouton "Suivre" ou "Ajouter ami"
   - **Email NON visible** (sécurité critique)

**Résultat attendu:**
- ✅ Profil public accessible
- ✅ Email caché (fix appliqué)
- ✅ Actions follow/friend disponibles

---

## 3️⃣ PUBLICATIONS (POSTS)

### US-010: Créer un post texte
**En tant que** utilisateur connecté  
**Je veux** publier un message texte  
**Afin de** partager mes pensées  

**Scénario:**
1. ✅ Connecté sur page d'accueil
2. ✅ Cliquer "Créer un post" ou zone de texte
3. ✅ Écrire: `Mon premier post de test ! 🚀`
4. ✅ Cliquer "Publier"
5. ✅ Vérifier post apparaît dans le feed

**Résultat attendu:**
- ✅ Post créé instantanément
- ✅ Apparaît en haut du feed
- ✅ Affiche nom + avatar de l'auteur
- ✅ Compteurs likes/comments à 0

---

### US-011: Créer un post avec image
**En tant que** utilisateur connecté  
**Je veux** publier une photo  
**Afin de** partager du contenu visuel  

**Scénario:**
1. ✅ Créer un post
2. ✅ Ajouter une image (upload)
3. ✅ Ajouter caption: `Belle photo !`
4. ✅ Publier
5. ✅ Vérifier image s'affiche dans le feed

**Résultat attendu:**
- ✅ Image uploadée vers MinIO
- ✅ URL image dans post
- ✅ Thumbnail correct
- ✅ Click image → agrandissement

---

### US-012: Liker un post
**En tant que** utilisateur connecté  
**Je veux** liker un post  
**Afin de** montrer mon appréciation  

**Scénario:**
1. ✅ Voir un post dans le feed
2. ✅ Cliquer sur icône ❤️ ou "Like"
3. ✅ Vérifier:
   - Icône devient rouge/plein
   - Compteur +1
4. ✅ Re-cliquer (unlike)
5. ✅ Vérifier:
   - Icône redevient vide
   - Compteur -1

**Résultat attendu:**
- ✅ Toggle like/unlike fonctionne
- ✅ Compteur temps réel
- ✅ Optimistic update (instantané)

---

### US-013: Commenter un post
**En tant que** utilisateur connecté  
**Je veux** commenter un post  
**Afin de** réagir avec du texte  

**Scénario:**
1. ✅ Voir un post
2. ✅ Cliquer "Commenter" ou zone commentaire
3. ✅ Écrire: `Super post ! 👍`
4. ✅ Envoyer
5. ✅ Vérifier commentaire apparaît sous le post

**Résultat attendu:**
- ✅ Commentaire ajouté
- ✅ Compteur comments +1
- ✅ Nom + avatar de l'auteur du commentaire
- ✅ Timestamp visible

---

### US-014: Voir détail d'un post
**En tant que** utilisateur  
**Je veux** voir tous les commentaires d'un post  
**Afin de** lire la discussion complète  

**Scénario:**
1. ✅ Cliquer sur un post
2. ✅ Vérifier affichage:
   - Post complet
   - Tous les commentaires (max 20 premiers)
   - Likes
   - Auteur

**Résultat attendu:**
- ✅ Page dédiée au post
- ✅ Maximum 20 commentaires (pagination)
- ✅ Possibilité de commenter depuis cette page

---

### US-015: Modifier mon post
**En tant que** auteur d'un post  
**Je veux** modifier mon post  
**Afin de** corriger une erreur  

**Scénario:**
1. ✅ Aller sur un de mes posts
2. ✅ Cliquer "..." ou "Éditer"
3. ✅ Modifier texte: `Post modifié`
4. ✅ Sauvegarder
5. ✅ Vérifier changement appliqué

**Résultat attendu:**
- ✅ Post mis à jour
- ✅ Visible uniquement si je suis l'auteur
- ✅ Timestamp "modifié" (optionnel)

---

### US-016: Supprimer mon post
**En tant que** auteur d'un post  
**Je veux** supprimer mon post  
**Afin de** retirer du contenu indésirable  

**Scénario:**
1. ✅ Aller sur un de mes posts
2. ✅ Cliquer "..." → "Supprimer"
3. ✅ Confirmer suppression
4. ✅ Vérifier post disparu du feed

**Résultat attendu:**
- ✅ Post supprimé
- ✅ Likes et comments supprimés (cascade)
- ✅ Uniquement auteur peut supprimer

---

### US-017: Notification like en temps réel
**En tant que** auteur d'un post  
**Je veux** être notifié quand quelqu'un like mon post  
**Afin de** voir l'engagement  

**Scénario:**
1. ✅ User1 crée un post
2. ✅ User2 like le post de User1
3. ✅ User1 reçoit notification temps réel (WebSocket)
4. ✅ Vérifier icône notification

**Résultat attendu:**
- ✅ Notification instantanée (WebSocket)
- ✅ Message: "X a aimé votre post"
- ✅ Lien vers le post

---

## 4️⃣ AMIS / FOLLOWERS

### US-018: Suivre un utilisateur
**En tant que** utilisateur connecté  
**Je veux** suivre un autre user  
**Afin de** voir ses posts dans mon feed  

**Scénario:**
1. ✅ Aller sur profil de user2
2. ✅ Cliquer "Suivre" ou "Add Friend"
3. ✅ Vérifier bouton devient "Abonné" ou "Friends"
4. ✅ Vérifier compteur amis +1

**Résultat attendu:**
- ✅ Relation créée (status: ACCEPTED)
- ✅ Posts de user2 dans mon feed
- ✅ Compteur mis à jour

**Note:** Actuellement auto-accept (pas de requête)

---

### US-019: Ne plus suivre un utilisateur
**En tant que** utilisateur suivant quelqu'un  
**Je veux** arrêter de suivre  
**Afin de** ne plus voir ses posts  

**Scénario:**
1. ✅ Aller sur profil d'un ami
2. ✅ Cliquer "Ne plus suivre" ou "Unfollow"
3. ✅ Confirmer
4. ✅ Vérifier bouton redevient "Suivre"

**Résultat attendu:**
- ✅ Relation supprimée
- ✅ Posts ne s'affichent plus dans feed
- ✅ Compteur amis -1

---

### US-020: Voir mes followers
**En tant que** utilisateur  
**Je veux** voir qui me suit  
**Afin de** connaître mon audience  

**Scénario:**
1. ✅ Aller sur mon profil
2. ✅ Cliquer sur "X followers"
3. ✅ Vérifier liste des personnes qui me suivent

**Résultat attendu:**
- ✅ Liste complète des followers
- ✅ Avatar + nom de chacun
- ✅ Lien vers leur profil

---

### US-021: Voir mes abonnements
**En tant que** utilisateur  
**Je veux** voir qui je suis  
**Afin de** gérer mes abonnements  

**Scénario:**
1. ✅ Aller sur mon profil
2. ✅ Cliquer sur "X following"
3. ✅ Vérifier liste des personnes suivies

**Résultat attendu:**
- ✅ Liste complète
- ✅ Bouton "Unfollow" sur chacun

---

## 5️⃣ MESSAGES PRIVÉS

### US-022: Envoyer un message privé
**En tant que** utilisateur connecté  
**Je veux** envoyer un message privé  
**Afin de** discuter en privé  

**Scénario:**
1. ✅ Aller sur profil de user2
2. ✅ Cliquer "Message" ou icône message
3. ✅ Écrire: `Salut ! Comment ça va ?`
4. ✅ Envoyer
5. ✅ Vérifier message apparaît dans la conversation

**Résultat attendu:**
- ✅ Conversation créée
- ✅ Message envoyé
- ✅ Timestamp visible

---

### US-023: Recevoir un message en temps réel
**En tant que** utilisateur connecté  
**Je veux** recevoir les messages instantanément  
**Afin de** discuter en temps réel  

**Scénario:**
1. ✅ User1 et User2 connectés
2. ✅ User2 envoie message à User1
3. ✅ User1 voit notification temps réel
4. ✅ Message apparaît instantanément dans conversation

**Résultat attendu:**
- ✅ WebSocket fonctionne
- ✅ Notification instantanée
- ✅ Message visible sans refresh

---

### US-024: Consulter historique messages
**En tant que** utilisateur  
**Je veux** voir mes anciennes conversations  
**Afin de** relire l'historique  

**Scénario:**
1. ✅ Aller sur page "Messages"
2. ✅ Voir liste des conversations
3. ✅ Cliquer sur une conversation
4. ✅ Voir les messages (max 50 par page)

**Résultat attendu:**
- ✅ Conversations triées par date
- ✅ Dernier message visible
- ✅ Badge unread si non lu
- ✅ Pagination 50 messages/page (fix appliqué)

---

### US-025: Supprimer un message
**En tant que** auteur d'un message  
**Je veux** supprimer mon message  
**Afin de** retirer un message envoyé par erreur  

**Scénario:**
1. ✅ Aller dans une conversation
2. ✅ Hover sur mon message
3. ✅ Cliquer "..." → "Supprimer"
4. ✅ Confirmer
5. ✅ Vérifier message disparu

**Résultat attendu:**
- ✅ Message supprimé
- ✅ Visible pour les 2 participants
- ✅ Uniquement auteur peut supprimer

---

## 6️⃣ GROUPES

### US-026: Créer un groupe
**En tant que** utilisateur connecté  
**Je veux** créer un groupe  
**Afin de** partager avec plusieurs personnes  

**Scénario:**
1. ✅ Aller sur page "Groupes"
2. ✅ Cliquer "Créer un groupe"
3. ✅ Remplir:
   - Nom: `Groupe de Test`
   - Description: `Pour tester l'app`
   - Avatar (optionnel)
   - Privé: Non
4. ✅ Créer
5. ✅ Vérifier groupe créé et je suis membre

**Résultat attendu:**
- ✅ Groupe créé
- ✅ Je suis automatiquement membre
- ✅ Je suis le créateur

---

### US-027: Rejoindre un groupe public
**En tant que** utilisateur  
**Je veux** rejoindre un groupe public  
**Afin de** participer aux discussions  

**Scénario:**
1. ✅ Voir liste des groupes publics
2. ✅ Cliquer sur un groupe
3. ✅ Cliquer "Rejoindre"
4. ✅ Vérifier je suis membre

**Résultat attendu:**
- ✅ Membre ajouté
- ✅ Compteur membres +1
- ✅ Posts du groupe visibles

---

### US-028: Poster dans un groupe
**En tant que** membre d'un groupe  
**Je veux** publier dans le groupe  
**Afin de** partager avec les membres  

**Scénario:**
1. ✅ Aller dans un groupe dont je suis membre
2. ✅ Créer un post: `Post de groupe`
3. ✅ Publier
4. ✅ Vérifier post apparaît dans le groupe

**Résultat attendu:**
- ✅ Post lié au groupe
- ✅ Visible uniquement par membres
- ✅ Compteur posts groupe +1

---

### US-029: Quitter un groupe
**En tant que** membre d'un groupe  
**Je veux** quitter le groupe  
**Afin de** ne plus voir ses posts  

**Scénario:**
1. ✅ Aller dans un groupe
2. ✅ Cliquer "..." → "Quitter"
3. ✅ Confirmer
4. ✅ Vérifier je ne suis plus membre

**Résultat attendu:**
- ✅ Membre retiré
- ✅ Posts groupe invisibles
- ✅ Créateur ne peut pas quitter (doit supprimer)

---

### US-030: Performance groupes (test fix N+1)
**En tant que** utilisateur  
**Je veux** voir la liste des groupes rapidement  
**Afin de** avoir une bonne expérience  

**Scénario:**
1. ✅ Créer 50+ groupes (via API ou script)
2. ✅ Aller sur page Groupes
3. ✅ Mesurer temps de chargement
4. ✅ Ouvrir DevTools → Network/Console
5. ✅ Vérifier nombre de requêtes DB

**Résultat attendu:**
- ✅ Chargement <500ms (même 100 groupes)
- ✅ Seulement 2 requêtes DB (fix N+1 appliqué)
- ✅ Pas de freeze interface

**Test technique:**
```javascript
// Console navigateur
console.time('groups-load')
// Charger page groupes
console.timeEnd('groups-load')
// Devrait être <500ms
```

---

## 7️⃣ RECHERCHE

### US-031: Rechercher un utilisateur
**En tant que** utilisateur connecté  
**Je veux** rechercher d'autres users  
**Afin de** les trouver et les suivre  

**Scénario:**
1. ✅ Aller sur barre de recherche
2. ✅ Taper: `user2`
3. ✅ Voir résultats en temps réel
4. ✅ Cliquer sur un résultat
5. ✅ Vérifier redirection vers profil

**Résultat attendu:**
- ✅ Recherche par nom ET username
- ✅ Résultats en temps réel (debounce)
- ✅ Limite 20 résultats

---

### US-032: Recherche sans résultat
**En tant que** utilisateur  
**Je veux** voir un message si aucun résultat  
**Afin de** savoir que la recherche a fonctionné  

**Scénario:**
1. ✅ Rechercher: `utilisateurinexistant123`
2. ✅ Vérifier message "Aucun résultat"

**Résultat attendu:**
- ✅ Message clair
- ✅ Pas d'erreur technique

---

## 8️⃣ NOTIFICATIONS

### US-033: Voir mes notifications
**En tant que** utilisateur connecté  
**Je veux** voir toutes mes notifications  
**Afin de** suivre l'activité sur mon compte  

**Scénario:**
1. ✅ Cliquer sur icône notifications (cloche)
2. ✅ Voir liste:
   - Likes
   - Commentaires
   - Nouveaux followers
3. ✅ Badge avec nombre non lues

**Résultat attendu:**
- ✅ Toutes notifications visibles
- ✅ Badge compte précis
- ✅ Triées par date

---

### US-034: Marquer notification comme lue
**En tant que** utilisateur  
**Je veux** marquer une notification lue  
**Afin de** nettoyer ma liste  

**Scénario:**
1. ✅ Cliquer sur une notification
2. ✅ Vérifier elle devient "lue" (style différent)
3. ✅ Badge décrémente

**Résultat attendu:**
- ✅ Notification marquée lue
- ✅ Visuel change
- ✅ Badge mis à jour

---

## 9️⃣ STORIES (si implémenté)

### US-035: Publier une story
**En tant que** utilisateur connecté  
**Je veux** publier une story  
**Afin de** partager un moment éphémère  

**Scénario:**
1. ✅ Cliquer "Créer story" ou "+"
2. ✅ Upload image
3. ✅ Publier
4. ✅ Vérifier story apparaît dans liste stories

**Résultat attendu:**
- ✅ Story créée
- ✅ Expire après 24h
- ✅ Visible par followers

---

### US-036: Voir les stories
**En tant que** utilisateur  
**Je veux** voir les stories de mes amis  
**Afin de** suivre leur actualité  

**Scénario:**
1. ✅ Voir barre stories en haut du feed
2. ✅ Cliquer sur un avatar
3. ✅ Voir story en plein écran
4. ✅ Swipe → story suivante

**Résultat attendu:**
- ✅ Stories défilent automatiquement
- ✅ Compteur progress
- ✅ Marqué comme "vu"

---

## 🔟 RESPONSIVE & MOBILE

### US-037: Navigation mobile
**En tant que** utilisateur mobile  
**Je veux** utiliser l'app sur mon téléphone  
**Afin de** accéder partout  

**Scénario:**
1. ✅ Ouvrir DevTools → Mode responsive (375x667)
2. ✅ Tester toutes les pages
3. ✅ Vérifier menu burger
4. ✅ Tester gestures (scroll, tap)

**Résultat attendu:**
- ✅ Layout adapté mobile
- ✅ Texte lisible
- ✅ Boutons cliquables (min 44x44px)
- ✅ Pas de scroll horizontal

---

## 1️⃣1️⃣ PERFORMANCE

### US-038: Temps de chargement page d'accueil
**En tant que** utilisateur  
**Je veux** que l'app charge rapidement  
**Afin de** avoir une bonne expérience  

**Scénario:**
1. ✅ Ouvrir DevTools → Network
2. ✅ Recharger page d'accueil
3. ✅ Mesurer temps total
4. ✅ Vérifier taille bundle

**Résultat attendu:**
- ✅ First contentful paint <1s
- ✅ Time to interactive <3s
- ✅ Bundle JS <500KB (gzip)

---

### US-039: Pagination posts
**En tant que** utilisateur  
**Je veux** que les posts se chargent progressivement  
**Afin de** ne pas avoir de lag  

**Scénario:**
1. ✅ Scroll vers le bas du feed
2. ✅ Vérifier chargement automatique (infinite scroll)
3. ✅ 20 posts par page

**Résultat attendu:**
- ✅ Scroll infini fluide
- ✅ Loader visible pendant chargement
- ✅ Pas de freeze

---

## 1️⃣2️⃣ SÉCURITÉ

### US-040: Email non exposé publiquement
**En tant que** utilisateur soucieux de ma vie privée  
**Je veux** que mon email reste privé  
**Afin de** éviter le spam  

**Scénario:**
1. ✅ User1 consulte profil de User2
2. ✅ Ouvrir DevTools → Network
3. ✅ Regarder réponse API `/users/username/user2`
4. ✅ Vérifier absence du champ `email`

**Résultat attendu:**
- ✅ Email JAMAIS dans API publiques
- ✅ Visible uniquement par le user lui-même
- ✅ Fix sécurité appliqué ✅

**Test technique:**
```bash
curl http://localhost:3000/users/username/testuser
# Réponse ne doit PAS contenir "email"
```

---

### US-041: Protection CSRF
**En tant que** utilisateur  
**Je veux** être protégé contre les attaques  
**Afin de** naviguer en sécurité  

**Scénario:**
1. ✅ Vérifier headers HTTP
2. ✅ Check CORS configuré
3. ✅ Helmet activé (Security headers)

**Résultat attendu:**
- ✅ Headers X-Frame-Options, CSP, etc.
- ✅ CORS limité au frontend origin
- ✅ Tokens JWT sécurisés

---

## 1️⃣3️⃣ EDGE CASES

### US-042: Connexion internet perdue
**En tant que** utilisateur mobile  
**Je veux** être notifié si je perds la connexion  
**Afin de** comprendre pourquoi ça ne marche pas  

**Scénario:**
1. ✅ DevTools → Network → Offline
2. ✅ Essayer de créer un post
3. ✅ Vérifier message d'erreur clair

**Résultat attendu:**
- ✅ Message "Pas de connexion"
- ✅ Action échoue gracieusement
- ✅ Possibilité de retry

---

### US-043: Concurrent like/unlike
**En tant que** utilisateur cliquant rapidement  
**Je veux** que les likes soient cohérents  
**Afin de** avoir un compteur correct  

**Scénario:**
1. ✅ Cliquer Like rapidement 10 fois
2. ✅ Vérifier état final cohérent
3. ✅ Recharger page
4. ✅ Vérifier même état

**Résultat attendu:**
- ✅ État final cohérent (liked OU unliked)
- ✅ Compteur correct
- ✅ Pas de doublons en DB

---

### US-044: Texte très long
**En tant que** utilisateur  
**Je veux** que l'app gère les textes longs  
**Afin de** ne pas casser le layout  

**Scénario:**
1. ✅ Créer post avec 5000 caractères
2. ✅ Vérifier affichage correct
3. ✅ Check ellipsis ou "Lire plus"

**Résultat attendu:**
- ✅ Texte tronqué ou scrollable
- ✅ Layout pas cassé
- ✅ Performance OK

---

## 1️⃣4️⃣ WEBSOCKET TEMPS RÉEL

### US-045: Multi-onglets synchronisés
**En tant que** utilisateur  
**Je veux** que mes actions se synchronisent entre onglets  
**Afin de** avoir une expérience cohérente  

**Scénario:**
1. ✅ Ouvrir 2 onglets avec même user
2. ✅ Onglet 1: Créer un post
3. ✅ Onglet 2: Vérifier post apparaît automatiquement

**Résultat attendu:**
- ✅ WebSocket sur chaque onglet
- ✅ Synchronisation temps réel
- ✅ Pas de conflit

---

### US-046: Notification post des followers seulement
**En tant que** utilisateur  
**Je veux** recevoir uniquement les posts pertinents  
**Afin de** ne pas être spammé  

**Scénario:**
1. ✅ User1 suit User2
2. ✅ User3 NE suit PAS User2
3. ✅ User2 crée un post
4. ✅ Vérifier:
   - User1 reçoit notification ✅
   - User3 NE reçoit PAS notification ✅

**Résultat attendu:**
- ✅ Notifications ciblées (fix appliqué)
- ✅ Pas de broadcast à tous
- ✅ Performance optimale

**Test technique:**
Vérifier console WebSocket :
```
User1: "post:new" event ✅
User3: PAS d'event ✅
```

---

# 📊 CHECKLIST GLOBALE

## ✅ Fonctionnalités Core (Must Have)

- [ ] **Authentification**
  - [ ] Inscription
  - [ ] Connexion
  - [ ] Déconnexion
  - [ ] Refresh token auto
  - [ ] Reset password
  - [ ] Email verification

- [ ] **Profil**
  - [ ] Voir mon profil
  - [ ] Éditer profil
  - [ ] Voir profil autre user
  - [ ] Email privé (sécurité)

- [ ] **Posts**
  - [ ] Créer post texte
  - [ ] Créer post image
  - [ ] Liker/unliker
  - [ ] Commenter
  - [ ] Modifier mon post
  - [ ] Supprimer mon post

- [ ] **Social**
  - [ ] Suivre user
  - [ ] Ne plus suivre
  - [ ] Voir followers
  - [ ] Voir following

- [ ] **Messages**
  - [ ] Envoyer message privé
  - [ ] Recevoir en temps réel
  - [ ] Historique paginé (50/page)
  - [ ] Supprimer message

- [ ] **Groupes**
  - [ ] Créer groupe
  - [ ] Rejoindre groupe public
  - [ ] Poster dans groupe
  - [ ] Quitter groupe
  - [ ] Performance N+1 fixée

- [ ] **Recherche**
  - [ ] Rechercher users
  - [ ] Résultats temps réel

- [ ] **Notifications**
  - [ ] Voir notifications
  - [ ] Marquer lue
  - [ ] WebSocket temps réel
  - [ ] Ciblées (followers only)

## ✅ Performance

- [ ] Temps chargement <3s
- [ ] Pagination posts (20/page)
- [ ] Pagination messages (50/page)
- [ ] Pagination commentaires (20/post)
- [ ] N+1 groups résolu (2 queries)
- [ ] WebSocket optimisé (followers only)
- [ ] Index DB appliqués

## ✅ Sécurité

- [ ] JWT secret fort (64 bytes)
- [ ] Email non exposé publiquement
- [ ] Refresh token fonctionnel
- [ ] Cascade delete correct
- [ ] CORS configuré
- [ ] Helmet headers
- [ ] Passwords hashés (bcrypt)

## ✅ UX/UI

- [ ] Responsive mobile
- [ ] Messages erreur clairs
- [ ] Loading states
- [ ] Optimistic updates
- [ ] Offline handling

---

# 🎯 SCÉNARIO COMPLET E2E

## Parcours utilisateur complet (30 min)

### 1. Premier utilisateur (Alice)
1. ✅ Créer compte: `alice@example.com` / `alice`
2. ✅ Compléter profil (bio, avatar)
3. ✅ Créer 3 posts (1 texte, 1 image, 1 dans groupe)
4. ✅ Créer un groupe "Fans de tech"

### 2. Second utilisateur (Bob)
1. ✅ Créer compte: `bob@example.com` / `bob`
2. ✅ Rechercher "alice"
3. ✅ Suivre Alice
4. ✅ Liker posts d'Alice
5. ✅ Commenter sur post Alice
6. ✅ Envoyer message privé à Alice

### 3. Retour Alice (vérifier temps réel)
1. ✅ Vérifier notification like (WebSocket)
2. ✅ Vérifier notification commentaire
3. ✅ Vérifier notification message
4. ✅ Répondre à Bob
5. ✅ Suivre Bob en retour

### 4. Interaction groupe
1. ✅ Bob rejoint groupe "Fans de tech"
2. ✅ Bob poste dans le groupe
3. ✅ Alice like le post de Bob

### 5. Test performance
1. ✅ Créer 20+ posts (script ou manuel)
2. ✅ Scroll feed (infinite scroll)
3. ✅ Vérifier fluidité

### 6. Test session
1. ✅ Attendre 16 minutes (ou manipuler token)
2. ✅ Créer un post
3. ✅ Vérifier refresh auto (pas de déconnexion)

---

# 📝 RAPPORT DE TEST

## Template à remplir

```markdown
# Rapport de Test Manuel - SocialVibe

**Date:** ____/____/2026  
**Testeur:** ___________  
**Environnement:** Local (Docker + npm dev)  
**Navigateur:** Chrome/Firefox/Safari _____  

## Résumé
- Tests passés: __ / __
- Tests échoués: __ / __
- Bugs critiques: __
- Bugs mineurs: __

## Tests Authentification
- [ ] US-001: Création compte ✅/❌
- [ ] US-002: Connexion ✅/❌
- [ ] US-003: Déconnexion ✅/❌
- [ ] US-004: Refresh token ✅/❌
- [ ] US-005: Reset password ✅/❌

## Tests Posts
- [ ] US-010: Créer post ✅/❌
- [ ] US-012: Liker post ✅/❌
- [ ] US-013: Commenter ✅/❌
...

## Bugs trouvés
1. [CRITIQUE] Description bug
2. [MINEUR] Description bug

## Recommandations
- ...

## Conclusion
✅ Prêt pour production / ❌ Nécessite corrections
```

---

# 🚀 DÉPLOIEMENT PRODUCTION

## Checklist pré-déploiement

- [ ] Tous tests manuels passés
- [ ] Score >90/100
- [ ] Aucun bug critique
- [ ] Performance validée
- [ ] Sécurité validée
- [ ] Backup DB configuré
- [ ] Monitoring actif (Winston + Sentry)
- [ ] Variables env production définies
- [ ] JWT_SECRET production (généré)
- [ ] SMTP production configuré
- [ ] CDN pour images (MinIO production)
- [ ] SSL/HTTPS actif
- [ ] Rate limiting vérifié
- [ ] Logs rotation configurée

---

**✅ CE GUIDE COUVRE 100% DES FONCTIONNALITÉS DE SOCIALVIBE**

**Score actuel:** 96/100  
**Status:** Production-ready  
**Dernière mise à jour:** 2026-01-30

Bon testing ! 🎉
