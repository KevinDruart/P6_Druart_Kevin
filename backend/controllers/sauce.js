const sauce = require('../models/sauce');
const fs = require('fs');

exports.createsauce = (req, res, next) => {
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
    .catch(error => res.status(400).json({ error }));
};

exports.getOnesauce = (req, res, next) => {
  sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => { res.status(200).json(sauce); }
  ).catch(
    (error) => { res.status(404).json({ error: error }) }
  )
};
  
exports.modifysauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifié !' }))
    .catch(error => res.status(400).json({ error }));
};
  
exports.deletesauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
  
exports.getAllsauce = (req, res, next) => {
  sauce.find().then(
    (sauce) => { res.status(200).json(sauce); }
  ).catch(
    (error) => { res.status(400).json({ error: error }); }
  )
};