# Administration ProRenoNeuf

## Ce qui est préparé

La page `/admin` utilise Firebase Authentication (e-mail / mot de passe), la persistance de session du navigateur et la custom claim booléenne `admin: true`. Les demandes ne sont chargées qu’après vérification de ce rôle. La déconnexion masque immédiatement la liste et détruit son état React. Les requêtes lisent le serveur, par pages de 20 demandes, triées par date puis identifiant. Il n’y a ni inscription publique dans l’interface, ni modification ou suppression des demandes.

`vercel.json` prépare les accès directs et rechargements de `/admin` ainsi qu’un en-tête `X-Robots-Tag: noindex, nofollow`. Le code admin est chargé séparément du site public. `noindex` n’est pas un contrôle d’accès : les règles Firestore font autorité.

## Configuration Firebase à effectuer

1. Dans Firebase Conso le, sélectionner le projet correspondant aux variables `VITE_FIREBASE_*` de Vercel.
2. Dans **Authentication → Sign-in method**, activer **E-mail/Mot de passe**. Il n’est pas nécessaire d’activer les liens de connexion sans mot de passe.
3. Dans **Authentication → Users → Ajouter un utilisateur**, créer le compte destiné à l’administrateur avec un mot de passe solide. Copier son UID. Ne jamais envoyer le mot de passe dans un ticket ou le stocker dans le dépôt.
4. Dans **Authentication → Settings → Authorized domains**, ajouter le domaine de production et le domaine Vercel effectivement utilisé. Ajouter `localhost` pour le développement si nécessaire. Utiliser les six variables de `.env.example` dans un `.env.local` ignoré et dans Vercel ; aucune clé Admin ne doit être préfixée `VITE_`.
5. Attribuer le rôle avec le script ci-dessous, depuis une machine de confiance. La création d’un compte ne donne pas le rôle administrateur.
6. Dans **Firestore Database → Règles**, intégrer les blocs de `firestore.rules` aux règles existantes puis publier manuellement. Ce fichier ne connaît que `testimonials` et `contactRequests` : conserver et examiner les règles des autres collections. Supprimer toute règle générale qui autoriserait publiquement la lecture des demandes, car les permissions de plusieurs blocs s’additionnent.
7. Après attribution du rôle, se déconnecter puis se reconnecter sur `/admin` pour obtenir un nouveau jeton. Les changements de claims ne modifient pas un jeton déjà émis.

Les comptes sans rôle restent bloqués, même s’ils peuvent se connecter à Firebase Authentication. Les lectures de `contactRequests` par les navigateurs restent bloquées jusqu’à publication des règles préparées.

## Attribuer ou retirer le rôle

Installer les outils séparés (ils ne font pas partie du bundle web) :

```powershell
npm.cmd --prefix tools/firebase install
```

Configurer l’authentification Admin sur la machine de confiance, avec un fichier de compte de service conservé **hors du dépôt** :

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\chemin-prive\service-account.json'
npm.cmd --prefix tools/firebase run admin-role -- prorenoneuf-89527 UID_A_REMPLACER grant
```

Vérifier le projet et l’UID avant exécution. Le script ne crée aucun compte et préserve les autres custom claims.

Pour retirer le rôle :

```powershell
npm.cmd --prefix tools/firebase run admin-role -- prorenoneuf-89527 UID_A_REMPLACER revoke
```

Le retrait révoque aussi les jetons de renouvellement. Un jeton d’accès déjà émis peut toutefois rester valable jusqu’à son expiration (environ une heure) : ce mécanisme ne garantit pas une révocation immédiate. Une exigence de retrait immédiat nécessite un contrôle supplémentaire des sessions/rôles côté serveur ou dans les règles.

## Règles et index

La création publique conserve le schéma du formulaire : les sept champs sont requis, les champs supplémentaires sont refusés, `status` vaut `new`, `source` vaut `website`, `createdAt` doit être un horodatage serveur égal à `request.time`. Les limites de taille sont explicites. Les demandes ne peuvent être lues que par un administrateur, et aucune mise à jour/suppression cliente n’est permise.

La pagination utilise `createdAt` décroissant et l’identifiant décroissant ; l’index standard de date suffit normalement. Si Firestore demande un index, un administrateur doit examiner et créer l’index indiqué dans la console. Ne pas rendre la collection publique pour contourner cette erreur. Les documents dépourvus de `createdAt` ne sont pas retournés par ce tri : corriger les anciennes données par une procédure Admin vérifiée, si nécessaire.

## Tests locaux isolés

```powershell
npm.cmd --prefix tools/firebase run test:rules
npm.cmd run typecheck
npm.cmd run build
```

Les tests utilisent le projet fictif `demo-prorenoneuf` et exigent l’émulateur, sans accès aux demandes de production. L’émulateur nécessite Java et peut télécharger son moteur au premier lancement. Le script de test ne publie aucune règle.

Vérifier ensuite dans le navigateur : accès direct et rechargement de `/admin`, connexion invalide, compte sans rôle, compte admin, message complet, actualisation, pagination (20 puis page suivante), déconnexion et disparition des demandes. Vérifier aussi le site public et le formulaire. Ne pas créer de fausses demandes en production pour cette validation.

## Références officielles

- Claims et renouvellement des jetons : https://firebase.google.com/docs/auth/admin/custom-claims
- Persistance de session : https://firebase.google.com/docs/auth/web/auth-state-persistence

Aucun compte, rôle, règle distante ou déploiement n’est automatiquement modifié par l’ajout de ces fichiers.

## Validation effectuée lors de l’intégration

- Contrôle TypeScript et build de production : réussis.
- Sept tests sur l’émulateur Firestore : réussis (droits de lecture, schéma de création, refus des modifications/suppressions, témoignages publiés et pagination avec dates identiques).
- Aperçu de production : réponses HTTP 200 pour `/`, `/admin` et `/admin/`.
- Aucun navigateur connecté disponible : rendu mobile, saisie des identifiants et parcours interactif de connexion/déconnexion restent à vérifier après configuration, avec les comptes autorisés. La réécriture Vercel est préparée mais n’a pas été testée sur un déploiement.
