//securisation authentification avec un TOKEN genéré
const jwt = require('jsonwebtoken');

//hashage MDP
const bcrypt = require('bcrypt');

//schemas modele user
const User = require('../models/user');

const masked = require('masked');


/*-----------------------------------------SIGNUP--------------------------------------------*/
// INSCRIPTION D'UN UTILISATEUR avec hashage MDP (BCRYPT) et encryptage email (crypto-js)
exports.signup = (req, res, next) => {
  
  const saltRounds = 10;
  // On appelle la méthode hash de bcrypt 
  bcrypt.hash(req.body.password, saltRounds)
    // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD mongoDB
    .then(hash => {
      // Création du nouvel utilisateur avec le model
      const user = new User({
        email: req.body.email,
        password: hash
      });

      //mask de l'adresse email
      const maskedUser = masked(user, ['email']);
      console.log(maskedUser);

      user.emailMasked.push(maskedUser)
      // On enregistre l'utilisateur dans la base de données
      user.save()
        //aucune erreur, l'utilisateur est créé
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        //une erreur avec adresse email 
        .catch(error => res.status(400).json({ error: "adresse email deja utilisé"}));
    })
    .catch(error => res.status(500).json({ error: "erreur inscription" }));
};


/*-----------------------------------------LOGIN--------------------------------------------*/
exports.login = (req, res, next) => {



  // On doit trouver l'utilisateur qui correspond à l'adresse entrée par l'utilisateur
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Adresse email et ou mot de passe incorrect !'});
      }
      // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Adresse email et ou mot de passe incorrect !'});
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              {
                userId: user._id
              },
              // Clé d'encodage du token
              process.env.TOKEN,
              // expiration au bout de 24h
              {
                expiresIn: '24h'
              }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
