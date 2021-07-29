//Importation des plugins requis
//framework express
const express = require('express');

//extraction json
const bodyParser = require('body-parser');

//connexion a la base de données
const mongoose = require('mongoose');

//protection des requetes http
const helmet = require('helmet');
const hpp = require('hpp');

//parametre cookie
const cookieSession = require('cookie-session');

//protection contres les attaques xss
const xssClean = require('xss-clean');


const sauce = require('./models/sauce');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://userAdmin:gzdQHZbGu233g8c7@cluster0.oziog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Cookie session
app.use(cookieSession({

    name: 'session',
    keys: new Keygrip([process.env.COOKIESECRET], 'SHA256', 'base64'),

    // Cookie Options
    path: '/',
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 600000, // 10 minutes
    sameSite: 'strict'
}));


// Protection contre les attaques DOS
app.use(hpp());

// Protection contre les attaques XSS
app.use(xssClean());

app.use(bodyParser.json());

//définit des en-têtes de réponse HTTP liés à la sécurité pour se protéger contre certaines vulnérabilités Web bien connues
app.use(helmet());


// route sauces
app.use('/api/sauces', sauceRoutes);

//route users
app.use('/api/auth', userRoutes);

//routes de stockage pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;