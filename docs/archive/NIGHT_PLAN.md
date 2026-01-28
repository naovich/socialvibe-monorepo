# 🌙 Opération "Night Builder" : Roadmap SocialVibe (Clone Facebook)

Nadhoir, repose-toi bien. Voici mon plan de bataille pour transformer ce prototype en un réseau social complet (Frontend & Backend) pendant que tu dors.

---

## 🎨 Phase 1 : Frontend "Pixel Perfect" (React + Vite + Tailwind/CSS)
*Objectif : Atteindre la complexité et la fluidité de l'interface Facebook/Instagram.*

1.  **[UI] Système de Navigation Avancé :**
    *   Sidebar gauche (Raccourcis, Amis, Groupes).
    *   Barre de recherche interactive avec historique.
    *   Menu de notifications et messagerie rapide (popovers).
2.  **[UI] Feed "Infinite Scroll" :**
    *   Support multi-média (carrousels d'images, intégration vidéo).
    *   Squelettes de chargement (Shimmer effect) pour le "perceived performance".
3.  **[Features] Créateur de Post Complet :**
    *   Modale complexe avec sélecteur d'humeur/activité.
    *   Preview des images avant upload.
    *   Tagging d'amis et géolocalisation.
4.  **[UI] Profil & Timeline :**
    *   Page profil avec photo de couverture.
    *   Onglets (Posts, Amis, Photos).
    *   Bouton "Edit Profile" fonctionnel.

---

## ⚙️ Phase 2 : Backend "Engine" (NestJS + PostgreSQL + Prisma)
*Objectif : Architecture robuste, scalable et conforme aux meilleures pratiques (Clean Architecture).*

5.  **[Setup] Initialisation du Backend :**
    *   Installation de NestJS et configuration de Docker pour PostgreSQL.
    *   Mise en place de Prisma ORM.
6.  **[DB] Modélisation de la Base de Données :**
    *   Schéma Prisma : `User`, `Post`, `Comment`, `Like`, `Friendship` (modèle many-to-many), `Notification`.
7.  **[Auth] Sécurité & JWT :**
    *   Système complet Register/Login avec Hash (Bcrypt).
    *   Validation des données (class-validator).
    *   Guard JWT pour protéger les routes.
8.  **[API] Endpoints CRUD :**
    *   Module Posts : Création, Edition, Suppression, Pagination.
    *   Module Social : Follow/Unfollow, Accept/Reject Friend Request.
    *   Module Comments/Likes : Nested comments (réponses aux commentaires).

---

## 🚀 Phase 3 : Intégration & Polissage
*Objectif : Relier les deux mondes.*

9.  **[Bridge] Intégration API :**
    *   Remplacement du `store.ts` mocké par des appels `fetch/axios` vers le backend.
    *   Gestion globale des erreurs (Toasts notifications).
10. **[UX] Real-time (Bonus si le temps le permet) :**
    *   WebSockets (Socket.io) pour les likes et notifications en direct.

---

## 📁 Organisation du Travail
Je vais créer un dossier `SocialVibe-Backend` et synchroniser le `SocialVibe` (Frontend).
Je documenterai chaque étape dans un fichier `PROGRESSION_NIGHT.md`.

**Bonne nuit Nadhoir. Demain, tu te réveilles avec un écosystème prêt à l'emploi.** 🦾🚀
