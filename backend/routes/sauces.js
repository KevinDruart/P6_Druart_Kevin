const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createThing);
router.get('/:id', auth, sauceCtrl.getOneThing);
router.put('/:id', auth, sauceCtrl.modifyThing);
router.delete('/:id', auth, sauceCtrl.deleteThing);

module.exports = router;



