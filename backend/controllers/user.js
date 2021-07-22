const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// INSCRIPTION D'UN UTILISATEUR + hashage MDP (BCRYPT)
exports.signup = (req, res, next) => {
  // On appelle la méthode hash de bcrypt 
  bcrypt.hash(req.body.password, 10)
    // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD mongoDB
    .then(hash => {
      // Création du nouvel utilisateur avec le model
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // On enregistre l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error: "adresse email incorrecte"}));
    })
    .catch(error => res.status(500).json({ error: "erreur inscription" }));
};

exports.login = (req, res, next) => {
  // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
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
              'GERUHFBERLJHBRFJRH',
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
