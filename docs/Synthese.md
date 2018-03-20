# 42-hypertube

## Contraintes

### Technologies

- Serveur
  - Apache
  - Nginx
  - Built-in Web-Serveur
- Compatibilité
  - Firefox >= 41
  - Chrome >= 46
- Responsivité
  - Oui
- Elements
  - Header
  - Footer
- Locales
  - Anglais (Défaut)
  - Francais

### Fonctionnalités de base

- Deconnexion depuis n'importe quelle page
- Traduction de l'application en deux langues

### Modules prohibés

- webtorrent
- pulsar
- peerflix

### Accès restreint
  - Bibliothèque
  - Stream
  - ? Profil utilisateur

## Fonctionnalités

### Expérience utilisateur

- Omniauth (Inscription + Connexion)
  - 2 Stratégies minimum
    - API 42
    - Au choix (Facebook envisagé)
- [x] Inscription
  - E-mail
  - Username
  - Photo de profil
  - Nom
  - Prénom
  - Mot de passe (Sécurisé)
- [x] Connexion
  - Username
  - Mot de passe
- [x] Reinitialisation du mot de passe
  - Email
- [x] Edition de profil
  - Photo de profil
  - Nom
  - Prénom
- [ ] Edition de compte
  - Email
  - Username
  - Mot de passe
- [ ] Profil
  - Photo de profil
  - Nom
  - Prenom
  - Username
  - Informations au choix (Likes...)

### Bibliothèque

- Champ de recherche
  - Fonctionnalités
    - Auto-complétion (maximum 5 propositions)
    - 3 lettres minimum
    - Miniatures (Bonus)
  - Contraintes
    - 2 Sources externes de torrent (Minimum)
      - legittorrents + archive.org
    - Limiter le resultat aux formats vidéo
- Champs de magnets

- Liste de miniatures
  - Comportement
    - Clic: Accès a la page du film
    - Survol: Affichage du titre (Bonus)
    - Pas de recherche par l'utilisateur (Champ vide)
      - Afficher les médias les plus populaires
      - Trié par un critère de notre choix
  - Contraintes
    - Doit être triée par nom
    - Informations affichées
      - Année de production
      - Note
      - Photo de couverture
      - Nom de la vidéo
      - Couleur selon visionnage du film
    - Pagination infinie
      - Pas de liens pour la page suivante
      - Technologie envisagée: scrollspy
  - Fonctionnalités
    - Tri et filtre
      - Nom
      - Genre
      - Note
      - Intervalle de production
      - Film visionné/ non visionné

### Partie vidéo

- Player
  - Contraintes
    - Lancer la lecture après téléchargement suffisant des données
    - Lancer la lecture directement si le fichier existe déjà
    - Traitement seamless du telechargement de données
    - Selection des sous-titres si disponibles
      - Langue préférée (défaut)
      - Langue secondaire
  - Fonctionnalités
      - Téléchargement des sous-titres si disponibles pour le film
- Informations
  - Résumé (si disponible)
  - Casting: producteur, réalisateur, acteurs principaux
  - Année de production
  - Durée
  - Note
  - Image de couverture
- Commentaires
  - Ajouter des commentaires
  - Voir les commentaires des autres utilisateurs
- Fichier téléchargé
  - Contraintes
    - Sauvegarde sur le serveur
    - Suppression du fichier après 1 mois sans visionnage (CRON)
  - Sous-titres
    - Contraintes
      - Téléchargement des sous-titres si disponibles pour le film
- Flux vidéo
  - Formats supportés
    - MP4
    - WEBM
    - MkV (minimum)

## Recherches

### Technologies envisagées

- UI / UX
  - semantic-ui
  - ant-design
  - bootstrap4
- Traduction du site
  - react-i18next (i18n)
- Workflow
  - Bundler
    - webpack
    - webpack-dev-server

```JSON
{
  "movie": {
    "torrent": {},
    "comments": null,
    "likes": null,
    "views": null,
    "isDownloaded": false
  }
}
```
> Vérifier la meilleure facon de gérer l'accès aux routes.
> Vérifier comment gérer les sous-titres (Associé au torrent ou recupérer sur un site externe)
