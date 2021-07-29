const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');
const rateLimit = require("express-rate-limit");

//limite de connexion
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 2, // Blocage aprés 2 requetes
    message:(JSON.stringify("Trop de tentative de connexion, compte bloquer pendant 1 heure"))
  });

// Endpoint crée un nouvel utilisateur
router.post('/signup', verifyPassword, userCtrl.signup); 
// Endpoint connexion d'un utilisateur
router.post('/login', createAccountLimiter, userCtrl.login); 

module.exports = router;
