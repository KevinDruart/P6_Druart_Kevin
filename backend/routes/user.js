const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');

// Endpoint crée un nouvel utilisateur
router.post('/signup', verifyPassword, userCtrl.signup); 
// Endpoint connexion d'un utilisateur
router.post('/login', userCtrl.login); 

module.exports = router;
