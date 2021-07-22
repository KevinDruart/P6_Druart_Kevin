const mongoose = require('mongoose');

// Appel le middleware de validation des champs du model de la sauce
const sauceValidation = require('../middleware/verifySauce');


const sauceSchema = mongoose.Schema({
  // UserId de l'utilisateur qui à ajouter la sauce
  userId: {
    type: String,
    required: true
  },
  // Nom de la sauce
  name: {
    type: String,
    required: true,
  },
  // Marque de la sauce
  manufacturer: {
    type: String,
    required: true,
  },
  // description de la sauce
  description: {
    type: String,
    required: true,
  },
  // Ingredients qui pimentent la sauce
  mainPepper: {
    type: String,
    required: true,
  },
  // Adresse de l'image de presentation de la sauce
  imageUrl: {
    type: String,
    required: true
  },
  // niveau du piquant de la sauce
  heat: {
    type: Number,
    required: true
  },
  // nombre de Like reçu
  likes: {
    type: Number
  },
  // nombre de dislike reçu
  dislikes: {
    type: Number
  },
  // Utilisateurs qui Like la sauce
  usersLiked: {
    type: [String]
  },
  // Utilisateur qui DisLike la sauce
  usersDisliked: {
    type: [String]
  },
})

module.exports = mongoose.model('Sauce', sauceSchema);