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
      res.status(400).json({ error: error }); })
};

exports.likeDislike = (req, res, next) => {

}