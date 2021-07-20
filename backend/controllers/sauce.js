const SauceModele = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject._id; 
  const sauce = new SauceModele({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
    .catch(error => {
      console.log(error);
      res.status(400).json({ error })
    });
};

exports.getOneSauce = (req, res, next) => {
  SauceModele.findOne({
    _id: req.params.id
  })
    .then((sauce) => { res.status(200).json(sauce); })
    .catch((error) => {
      console.log("erreur recherche 1 sauce")
      res.status(404).json({ error: error });
    })
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  SauceModele.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifié !' }))
    .catch(error => {
      console.log("erreur modification")
      res.status(400).json({ error })
    });
};

exports.deleteSauce = (req, res, next) => {
  SauceModele.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce supprimé !' }))
          .catch(error => {
            console.log("erreur image desolidarisation avant suppression 1 sauce")
            res.status(400).json({ error })
          });
      });
    })
    .catch(error => {
      console.log("erreur suppression 1 sauce")
      res.status(500).json({ error })
    });
};

exports.getAllSauce = (req, res, next) => {
  SauceModele.find()
    .then(
      (sauce) => { res.status(200).json(sauce); })
    .catch(
      (error) => {
        console.log("erreur recherche toutes les sauces");
        res.status(400).json({ error: error });
      })
};

exports.likeDislike = (req, res, next) => {
  // Like présent dans le body
  let like = req.body.like
  // On prend le userID
  let userId = req.body.userId
  // On prend l'id de la sauce
  let sauceId = req.params.id

  // S'il clique j'aime(On push l'utilisateur et on incrémente le compteur like de 1)
  if (like === 1) {
    SauceModele.updateOne({
      _id: sauceId
    }, {
      // On push l'utilisateur
      $push: {
        usersLiked: userId
      },
      // On incrémente de 1 like avec l'operateur $inc
      $inc: {
        likes: +1
      },
    })
      .then(() => res.status(200).json({ message: "j'aime ajouté !" }))
      .catch((error) => res.status(400).json({ error }))
  }
  // S'il clique je n'aime pas (On push l'utilisateur et on incrémente le compteur dislike de 1)
  if (like === -1) {
    SauceModele.updateOne(
      {
        _id: sauceId
      }, {
      // On push l'utilisateur
      $push: {
        usersDisliked: userId
      },
      // On incrémente de 1 dislike avec l'operateur $inc
      $inc: {
        dislikes: +1
      },
    })
      .then(() => {
        res.status(200).json({ message: "Dislike ajouté !" })
      })
      .catch((error) => res.status(400).json({ error })
      )
  }
  if (like === 0) {

  }

}