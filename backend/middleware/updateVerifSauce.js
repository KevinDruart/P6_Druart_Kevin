const fs = require('fs');

module.exports = (req, res, next) => {
	try {
		//on enregistre la sauce dans une variable
		let sauce = JSON.parse(req.body.sauce);
		console.log(sauce);

		// enlever les espaces en début et fin de string
		let name = sauce.name.trim();
		let manufacturer = sauce.manufacturer.trim();
		let description = sauce.description.trim();
		let mainPepper = sauce.mainPepper.trim();

		// Vérifier que les champs texte soient remplis
		if (name.length > 0 && manufacturer.length > 0 && description.length > 0 && mainPepper.length > 0) {
			
			// si tout est ok, on récupère les champs sans les espaces
			sauce.name = name;
			sauce.manufacturer = manufacturer;
			sauce.description = description;
			sauce.mainPepper = mainPepper;
			
			// et on peut passer la requête au prochain middleware
			req.body.sauce = JSON.stringify(sauce);

			//on passe au middleware suivant
			next();
		} else {
			// sinon on supprime la nouvelle image que multer a déjà sauvegardé
			fs.unlink(`images/${req.file.filename}`, () => {
				res.status(400).json({ error: 'Requête non valable, l\'image a été supprimée' });
			})
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'Requête non valable' });
	}
};