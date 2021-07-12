Projet Pekocko
INSTALLATION:
cloner le repository

Pour le dossier frontend effectuer les commandes suivantes dans le terminal :
npm install
npm start

Pour le dossier backend effectuer les commandes suivantes dans le terminal :
npm install
nodemon server
Ouvrir une page HTML et dans l'url, ajoutez 'http://localhost:4200'.
 
INTITULÉ:
Contexte du projet
 
So Pekocko est une entreprise familiale de 10 salariés. Son activité principale est la création de sauces piquantes dont la composition est tenue secrète. Forte de son succès, l’entreprise souhaite se développer et créer une application web, dans laquelle les utilisateurs pourront
ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres.
Réalisation de l’API
Points de vigilance
L’entreprise ayant subi quelques attaques sur son site web ces dernières semaines, le
fondateur souhaite que les données des utilisateurs soient parfaitement protégées.
Pour cela, l’API utilisée devra impérativement respecter des pratiques de code sécurisé.
 
Exigences concernant la sécurité :
● l’API doit respecter le RGPD et les standards OWASP ;
● le mot de passe des utilisateurs doit être chiffré ;
● 2 types de droits administrateur à la base de données doivent être définis : un accès pour supprimer ou modifier des tables, et un accès pour éditer le contenu de la base de données ;
● la sécurité de la base de données MongoDB (à partir d’un service tel que MongoDBAtlas) doit être faite de telle sorte que le validateur puisse lancer l’application depuis sa machine ;
● l’authentification est renforcée sur les routes requises ;
● les mots de passe sont stockés de manière sécurisée ;
● les adresses mails de la base de données sont uniques et un plugin Mongoose
approprié est utilisé pour s’assurer de leur caractère unique et rapporter des erreurs.
 
Erreurs API
Toute erreur doit être renvoyée telle quelle, sans aucune modification ni ajout. Si nécessaire, utiliser une nouvelle Erreur().

Routes API
Toutes les routes relatives à la sauce doivent exiger une demande authentifiée (contenant un jeton valide dans son en-tête d'autorisation : "Bearer <token>").
 
Modèle de données
Sauce
Le modèle de données pour une sauce est le suivant :
 
● id: ObjectID — identifiant unique créé par MongoDB ;
● userId: string — identifiant unique MongoDB pour l'utilisateur qui a créé la
sauce ;
● name: string — nom de la sauce ;
● manufacturer: string — fabricant de la sauce ;
● description: string — description de la sauce ;
● mainPepper: string — principal ingrédient dans la sauce ;
● imageUrl: string — string de l'image de la sauce téléchargée par l'utilisateur ;
● heat: number — nombre entre 1 et 10 décrivant la sauce ;
● likes: number — nombre d'utilisateurs qui aiment la sauce ;
● dislikes: number — nombre d'utilisateurs qui n'aiment pas la sauce ;
● usersLiked: [string] — tableau d'identifiants d'utilisateurs ayant aimé la sauce;
● usersDisliked: [string] — tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce.
 
Utilisateur
Le modèle de données pour un utilisateur est le suivant :
 
● userId: string — identifiant unique MongoDB pour l'utilisateur qui a créé la sauce ;
● email: string — adresse électronique de l'utilisateur [unique] ;
● password: string — hachage du mot de passe de l'utilisateur.
 
Technologies à utiliser
● framework : Express ;
● serveur : NodeJS ;
● base de données : MongoDB ;
● Toutes les opérations de la base de données doivent utiliser le pack Mongoose avec des schémas de données stricts.
 
Dépôt GitHub
Lien du dépôt
Le lien du dépôt GitHub pour la partie frontend est le suivant : Piquante.
Procédure
1. Cloner le projet.
2. Exécuter npm install.
3. Exécuter npm start..
4. Exécution de l’API sur http://localhost:3000.
 
Informations complémentaires
Le nombre de likes/dislikes et les tableaux like/dislike doivent être mis à jour pour mettre en œuvre la fonctionnalité.
 

