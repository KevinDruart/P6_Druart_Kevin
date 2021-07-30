const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


const sauceVerif = require('../middleware/createVerifSauce');
const updateVerif = require('../middleware/updateVerifSauce');


// ROUTE DES METHODES PRESENTENT DANS CONTROLLERS/SAUCE
//endpoint toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauce);
//endpoint ajout sauce
router.post('/', auth, multer, sauceVerif, sauceCtrl.createSauce);
//endpoint une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//endpoint modifier une sauce
router.put('/:id', auth, multer, updateVerif, sauceCtrl.modifySauce);
//endpoint supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//endpoint ajout/annulation like ou dislike sauce
router.post('/:id/like', auth, sauceCtrl.likeDislike);

module.exports = router;