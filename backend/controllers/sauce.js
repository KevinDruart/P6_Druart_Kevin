const sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'sauce enregistré !' }))
    .catch(error => {
      console.log("erreur ajout sauce")
      res.status(400).json({ error })
    });
};

exports.getOneSauce = (req, res, next) => {
  sauce.findOne({
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
  sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifié !' }))
    .catch(error => {
      console.log("erreur modification")
      res.status(400).json({ error })
    });
};
  
exports.deleteSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id })
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
  sauce.find()
  .then(
    (sauce) => { res.status(200).json(sauce); })
    .catch(
    (error) => {
      console.log("erreur recherche toutes les sauces"); 
      res.status(400).json({ error: error }); })
};