const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');
const rateLimit = require("express-rate-limit");

//limite de connexion
const createAccountLimiter = rateLimit({
    // 1 heure
    windowMs: 60 * 60 * 1000, 
    // Blocage aprés 2 requetes
    max: 2, 
    message:(JSON.stringify("Trop de tentative de connexion, compte bloquer pendant 1 heure"))
  });

// Endpoint crée un nouvel utilisateur
router.post('/signup', verifyPassword, userCtrl.signup); 
// Endpoint connexion d'un utilisateur
router.post('/login', createAccountLimiter, userCtrl.login); 

module.exports = router;
