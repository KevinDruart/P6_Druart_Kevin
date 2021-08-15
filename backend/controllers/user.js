//securisation authentification avec un TOKEN genéré
const jwt = require('jsonwebtoken');

//hashage MDP
const bcrypt = require('bcrypt');

//schemas modele user
const User = require('../models/user');

//maskage email
const maskData = require('../node_modules/maskdata/index');



/*-----------------------------------------SIGNUP--------------------------------------------*/
// INSCRIPTION D'UN UTILISATEUR avec hashage MDP (BCRYPT) et maskage email(maskdata)
exports.signup = (req, res, next) => {
  //On attribue un nombre de tour au hashage et ou salage
  const saltRounds = 10;
  // On appelle la méthode hash de bcrypt
  bcrypt
  //on hash le mot de passe 
    .hash(req.body.password, saltRounds)
    // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD mongoDB
    .then((hash) => {
      //Definition des options de maskage email
      const emailMask2Options = {
        maskWith: "*",
        unmaskedStartCharactersBeforeAt: 2,
        unmaskedEndCharactersAfterAt: 3,
        maskAtTheRate: false
      };
      // Création du nouvel utilisateur avec le modele user
      const user = new User({
        email: req.body.email,
        //maskage de l'email
        emailMasked: maskData.maskEmail2(req.body.email, emailMask2Options),
        password: hash,
      });
      // On enregistre l'utilisateur dans la base de données
      user
        //sauvegarde de l'utilisateur
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch(() => res.status(401).json({ error: "Email existant" }));
    })
    .catch((error) => res.status(500).json({ error }));
};


/*-----------------------------------------LOGIN--------------------------------------------*/
exports.login = (req, res, next) => {
  // On doit trouver l'utilisateur qui correspond à l'adresse entrée par l'utilisateur
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Adresse email et ou mot de passe incorrect !' });
      }
      // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Adresse email et ou mot de passe incorrect !' });
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
