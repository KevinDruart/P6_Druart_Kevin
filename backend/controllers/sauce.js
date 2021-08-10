//requis
//schemas modele sauce
const SauceModele = require('../models/sauce');
// Récupération du module 'file system' de Node permettant de gérer les images
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
      res.status(400).json({ error: "la sauce ne peut pas etre ajouter, les données de celle-ci ne respecte pas les conditions." })
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
  //on recherche toutes les sauces
  SauceModele.find()
    .then((sauce) => {

      res.status(200).json(sauce)

    })
    .catch(
      (error) => {
        console.log("erreur recherche toutes les sauces");
        res.status(400).json({ error: "erreur recherche sauces" });
      })
};

/*------------------------------------UPDATE SAUCE------------------------------------- */
exports.modifySauce = (req, res, next) => {
  //Récupération et sauvegarde dans une variable de l'userId
  let user = req.userIdToken;
  console.log(user);
  //verification si userId = Sauce.userId (si l'utilisateur est propriètaire de la sauce)
  let sauceObject = {};
  req.file ?
    (
      // Si la modification contient une image
      SauceModele.findOne({
        _id: req.params.id
      }).then((sauce) => {
        // On supprime l'ancienne image du serveur
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlinkSync(`images/${filename}`)
      }),
      sauceObject = {
        // On modifie les données et on ajoute la nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    ) : (
      // Si la modification ne contient pas de nouvelle image
      sauceObject = {
        ...req.body
      }
    )
  if (req.userIdToken === sauce.userId) {
    SauceModele.updateOne(
      // On applique les paramètre de sauceObject
      {
        _id: req.params.id
      }, {
      ...sauceObject,
      _id: req.params.id
    }
    )
      .then(() => res.status(200).json({ message: 'Sauce modifiée !' })
      )
      .catch((error) => res.status(400).json({ error: 'la sauce est introuvable' })
      )
  }
  else {
    res.status(401).json({ error: "Vous ne disposez pas des droits pour modifier cette sauce !" });
  }
}



/*------------------------------------DELETE SAUCE------------------------------------- */
exports.deleteSauce = (req, res, next) => {

  SauceModele.findOne({ _id: req.params.id })
    .then(sauce => {
      //verification si userId = Sauce.userId (si l'utilisateur est propriètaire de la sauce)
      if (req.userIdToken === sauce.userId) {
        //let sauceUserId = sauce.userId;
        console.log(sauce);
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          sauce.deleteOne({ _id: req.params.id })
            .then(() => {

              res.status(200).json({ message: 'sauce supprimé !' })

            })
            .catch(error => {
              console.log("erreur image desolidarisation avant suppression 1 sauce")
              res.status(400).json({ error: "suppresion une sauce" })
            });
        });
      }
      else {
        res.status(401).json({ error: "Vous ne disposez pas des droits pour supprimer cette sauce !" })
      }
    })
    .catch(error => {
      res.status(500).json({ error: "suppression une sauce requete" })
    });


};


/*---------------Ajout/annulation d'un like / dislike à une sauce----------------- */
exports.likeDislike = (req, res, next) => {
  const UID = req.body.userId;

  switch (req.body.like) {
    // like
    case 1:
      SauceModele.updateOne(
        { _id: req.params.id },
        { $inc: { likes: 1 }, $push: { usersLiked: UID } }
      )
        .then(() => res.status(200).json({ message: "Sauce likée !" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    // dislike
    case -1:
      SauceModele.updateOne(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: UID } }
      )
        .then(() => res.status(200).json({ message: "Sauce dislikée !" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    // retrait like ou dislike = if else
    case 0:
      SauceModele.findOne({ _id: req.params.id })
        .then((sauce) => {
          var Liked = sauce.usersLiked;
          // si l'user a liké
          if (Liked.includes(UID)) {
            SauceModele.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: UID },
              }
            )
              .then(() => res.status(200).json({ message: "Like retiré !" }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: UID },
              }
            )
              .then(() => res.status(200).json({ message: "Dislike retiré !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
  }
};