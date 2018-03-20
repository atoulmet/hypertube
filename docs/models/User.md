# Modèle utilisateur (`User`)

```typescript

class UserModel extends Model
{
  username: string;
  email: string;
  password: string;
  salt: string;
  token: string;
  photoURL: string;
  firstName: string;
  lastName: string;
  movies: object[];
}

```

## Description et spécificités du modèle


### Pseudonyme (`username`)

Pseudonyme de l'utilisateur.

- Minimum 4 caractères
- Accepté: `[a-zA-Z0-9]`
- Commence par un caractère alphabétique

### Email (`email`)

Email de l'utilisateur.

### Mot de passe (`password`)

Mot de passe de l'utilisateur.

- Minimum 8 caractères
- Au moins une majuscule
- Au moins un chiffre

### Jeton spécifique au mot de passe (`token`)

Token géneré en vue d'une demande de modification du mot de passe.

### URL de la photo de profil (`photoURL`)

Lien hyper-texte décrivant l'image choisie pour le profil de l'utilisateur.

### Prénom (`firstName`)

Prénom de l'utilisateur.

- Minimum 2 caractères
- Maximum 32 caractères
- Accepté: `[a-zA-Z-]`

### Nom (`lastName`)

Nom de l'utilisateur.

- Minimum 2 caractères
- Maximum 32 caractères
- Accepté: `[a-zA-Z-]`

### Films (`movies`)

Tableau d'objets `movie`
