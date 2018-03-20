# Spécifications génerales de l'API

## Gestion de session

Lors de la connexion d'un utilisateur, un `token` est géneré puis renvoyé au client.
Lorsque le client s'addressera à l'API le `token` sera disposé dans l'entête `x-session-token` du header http .


## Réponse (`code: 2xx`)

Lorsque le serveur d'API considérera que les données envoyées sont conformes, l'utilisateur recevra une réponse de ce type.
Ici l'absence d'erreur permet de déterminer que l'opération s'est bien déroulée.
Le statut de la requête se suffit donc à lui même.

```js
{
  'data': {
    'example': ''  
  },
  'state': { ... }
}
```

#### `data`

Contient le résultat de la requête.

## Réponse (`code: 4xx`)

Lorsque le serveur d'API considérera que les données envoyées ne sont pas conformes, l'utilisateur recevra une réponse de ce type.

```js
{
  'data': { ... },
  'state': {
    'error': Boolean,
    'errors': [
      {
        'field': String,
        'message': String,
        'type': String
      },
      {
        /* Exemple d'erreur */
        'field': 'email',
        'message': 'invalid format',
        'type': 'format'
      }
    ]
  }
}
```

#### `state`

Contient l'état de la requête.

#### `state.error`

Est défini a `true` si une erreur est survenue lors de la validation de la requête.

#### `state.errors`

Dans le cas ou une erreur survient, contient les différentes erreurs associées.
Sinon est un tableau vide.

#### `state.errors.field`

Contient le nom du champ d'entrée ayant provoqué l'erreur.

#### `state.errors.message`

Contient le message d'erreur à afficher associé.

#### `state.errors.type`

Contient le type d'erreur (erreur de validation, requête corrompue...).
