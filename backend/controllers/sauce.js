//requis
//schemas modele sauce
const SauceModele = require('../models/sauce');
const fs = require('fs');

/*------------------------------------CREATE SAUCE------------------------------------- */
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
      res.status(400).json({ error: "erreur ajout sauce" })
    });
};


/*------------------------------------READ ONE SAUCE------------------------------------- */
exports.getOneSauce = (req, res, next) => {
  //on recherche la sauce contenant l'id
  SauceModele.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce === null) {
        res.status(404).json({ error: "sauce introuvable" })
      }
      else {
        res.status(200).json(sauce)
      }
    })
    .catch(error => {
      res.status(404).json({ error: "sauce introuvable" })
    })
};

/*---------------------------------READ ALL SAUCES--------------------------------- */
exports.getAllSauce = (req, res, next) => {
  SauceModele.find()
    .then(
      (sauce) => { res.status(200).json(sauce); })
    .catch(
      (error) => {
        console.log("erreur recherche toutes les sauces");
        res.status(400).json({ error: "error recherche sauce" });
      })
};

/*------------------------------------UPDATE SAUCE------------------------------------- */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  SauceModele.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  
    .then(sauce => {
      console.log(sauce.id)
      if (sauce.id === undefined) {
        console.log("sauce introuvable");
        res.status(404).json({ error: "Cet sauce n'existe pas ou est introuvable."})
      }
      else {
        next;
      }
      //let user = req.body.userId;
      //console.log(user)
      //si l'utilisateur n'est pas celui qui a ajouter la sauce il ne peut pas modifier la sauce
      if (req.body.userId === sauceObject.userId) {
        res.status(200).json({ message: 'sauce modifié !' })
      }
      else {
        res.status(400).json({ error: "Impossible de modifier une sauce qui n'est pas la notre" })
      }
    })
    .catch(error => {
      console.log("erreur");
      res.status(400).json({ error: "erreur modification." })
    });
};



/*------------------------------------DELETE SAUCE------------------------------------- */
exports.deleteSauce = (req, res, next) => {
  SauceModele.findOne({ _id: req.params.id })
    .then(sauce => {
      //let sauceUserId = sauce.userId;
      console.log(sauce);
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            let user = req.body.userId; 
            if (user === sauce.userId) {
              res.status(200).json({ message: 'sauce supprimé !' })
            }
            else {
              res.status(400).json({ error: "vous n'etes pas le proprietaire de cet sauce" })
            }
          })
          .catch(error => {
            console.log("erreur image desolidarisation avant suppression 1 sauce")
            res.status(400).json({ error: "suppresion une sauce" })
          });
      });
    })
    .catch(error => {
      console.log("erreur suppression 1 sauce")
      res.status(500).json({ error: "suppression une sauce requete" })
    });
};


/*---------------Ajout/annulation d'un like / dislike à une sauce----------------- */
exports.likeDislike = (req, res, next) => {

  // On recupere le like présent dans le body
  let like = req.body.like
  // On recupere l'userID dans le body
  let userId = req.body.userId
  // On recupere l'id de la sauce dans url
  let sauceId = req.params.id

  // Si il s'agit d'un like (On push l'utilisateur et on incrémente le compteur like de 1)
  if (like === 1) {
    SauceModele.updateOne({
      _id: sauceId
    }, {
      // On push l'utilisateur 
      $push: {
        usersLiked: userId
      },
      //on incrémente le compteur de 1
      $inc: {
        likes: +1
      },
    })
      .then(() => res.status(200).json({ message: "j'aime ajouté !" }))
      .catch((error) => res.status(400).json({ error: "erreur ajout like" }))
  }

  // S'il s'agit d'un dislike (On push l'utilisateur et on incrémente le compteur dislike de 1)
  if (like === -1) {
    SauceModele.updateOne(
      {
        _id: sauceId
      }, {
      // On push l'utilisateur 
      $push: {
        usersDisliked: userId
      },
      // On incrémente de 1
      $inc: {
        dislikes: +1
      },
    }
    )
      .then(() => {
        res.status(200).json({ message: 'Dislike ajouté !' })
      })
      .catch((error) => res.status(400).json({ error: "erreur ajout dislike" }))
  }
  // Si il s'agit d'annuler un like ou un dislike
  //annuler un like
  if (like === 0) {
    SauceModele.findOne({
      _id: sauceId
    })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          SauceModele.updateOne({
            _id: sauceId
          }, {
            $pull: {
              usersLiked: userId
            },
            // On incrémente de -1
            $inc: {
              likes: -1
            },
          })
            .then(() => res.status(200).json({ message: 'Like retiré !' }))
            .catch((error) => res.status(400).json({ error: "erreur annulation like" }))
        }
        //annuler un dislike
        if (sauce.usersDisliked.includes(userId)) {
          SauceModele.updateOne({
            _id: sauceId
          }, {
            $pull: {
              usersDisliked: userId
            },
            // On incrémente de -1
            $inc: {
              dislikes: -1
            },
          })
            .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
            .catch((error) => res.status(400).json({ error: "erreur annulation dislike" }))
        }
      })
      .catch((error) => res.status(404).json({ error: "erreur annulation like/dislike requete" }))
  }
}
