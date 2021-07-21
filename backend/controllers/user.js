const jwt = require('jsonwebtoken'); // importation du package jsonwebtoken
const bcrypt = require('bcrypt'); // importation du package bcrypt
const User = require('../models/user'); // importation du model/schema User

// INSCRIPTION D'UN UTILISATEUR + hashage MDP (BCRYPT)
exports.signup = (req, res, next) => {
  let regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let emailTry = regexMail.test(req.body.email);

  let regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  let passwordTry = regexPass.test(req.body.password);
  if (emailTry && passwordTry) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });

      })
      .catch(error => res.status(500).json({ error: "erreur creation utilisateur requete" }));

    user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      .catch(error => res.status(400).json({ error: "erreur creation utilisateur" }));
  }
  else {
    console.log("erreur adresse email et ou mot de passe incorrecte");
    if (emailTry === false) {
      console.log("erreur adresse email");
      res.status(400).json({ error: "l'adresse mail ne correspond pas aux conditions" })
    }
    if (passwordTry === false) {
      console.log("erreur password");
      res.status(400).json({ error: "le mot de passe ne correspond pas aux conditions" })
    }//fin if passwordtry
  }//fin else

};

// CONNEXION UTILISATEUR + LOG TOKEN
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "L'adresse email et ou le mot de passe sont invalide(s)." });
      }
      console.log(req.body.password, user.password);
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "L'adresse email et ou le mot de passe sont invalide(s)." });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'GERUHFBERLJHBRFJRH',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => {
          console.log("error1", error);
          res.status(500).json({ error: "error connexion 1" })
        });
    })
    .catch(error => {
      console.log("error2");
      res.status(500).json({ error: "error connexion 2" })
    });
};