const jwt = require('jsonwebtoken'); // importation du package jsonwebtoken
const bcrypt = require('bcrypt'); // importation du package bcrypt
const User = require('../models/user'); // importation du model/schema User

// INSCRIPTION D'UN UTILISATEUR + hashage MDP (BCRYPT)
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  // CONNEXION UTILISATEUR + LOG TOKEN
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        console.log(req.body.password, user.password);
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
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
              console.log("error1",error);
              res.status(500).json({ error })
          });
      })
      .catch(error => {
        console.log("error2");
        res.status(500).json({ error })
    });
  };