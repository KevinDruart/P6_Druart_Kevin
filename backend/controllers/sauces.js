const Thing = require('../models/thing');

exports.createThing = (req, res, next) => {
  const thing = new Thing({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    userLiked: req.body.userLiked,
    userDisliked: req.body.userDisliked
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'sauce ajouter avec succés!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};