# Routes du client (Front)
---

Routing du Front-end de l'application.

```js
  /
  /register
  /login
  /forgot-password
  /reset-password
  /movies
  /movies/{title}
  /users/{user}
  /edit/account
  /edit/profile
  /logout
```

---

> Landing Page

```js
  /
```

Page d'accueil de l'application.

---

> Enregistrement de compte

```js
  /register
```

Page permettant à l'utilisateur de créer son compte en utilisant le formulaire d'inscription.

---

> Connexion utilisateur

```js
  /login
```

Page permettant à utilisateur de ce connecter à son compte en utilisant le formulaire de connexion.

---

> Demande de réinitialisation du mot de passe.

```js
  /forgot-password
```

Page permettant à l'utilisateur d'envoyer un email de réinitialisation de mot de passe.

---

> Réinitialisation du mot de passe.

```js
  /reset-password
```

Page permettant à l'utilisateur de réinitialiser son mot passe en utilisant le formulaire de réinitialisation.

---

> Liste des miniatures

```js
  /
```

Page affichant la liste des films disponibles.

---

> Page de film

```js
  /movies/:title
```

Page permettant de visualiser le film, une fonctionnalité de commentaires, et des informations telles que le résumé, le casting ou la note IMDB.

---

> Page de profil

```js
  /users/:user
```

Cette page donne accès aux informations de base de l'utilisateur.

---

> Edition de compte

```js
  /edit/account
```

Page permettant de modifier les informations relatives au compte : le mot de passe, le login et l'adresse mail.

---

> Edition de profil

```js
  /edit/profile
```

Page permettant de modifier les informations relatives au profil : la photo de profil, le prénom et le nom.

---

> Déconnexion

```js
  /logout
```

Url transmettant l'information au serveur que le connecteur s'est déconnecté.
