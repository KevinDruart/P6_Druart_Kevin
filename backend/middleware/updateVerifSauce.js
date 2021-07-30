//Middleware qui vérifie si les champs ne sont constitués QUE d'espaces à la suite. (l'absence de caractères est déjà vérifiée par le front => bouton submit disabled)

const fs = require('fs');
const spaceRegex = /^ +$/;

module.exports = (req, res, next) => {
	try {

		// nouvelle image
		if (req.file) {
			const sauce = JSON.parse(req.body.sauce);
	
			let name = sauce.name;
			let manufacturer = sauce.manufacturer;
			let description = sauce.description;
			let mainPepper = sauce.mainPepper;
			
			
			if (!spaceRegex.test(name) && !spaceRegex.test(manufacturer) && !spaceRegex.test(description) && !spaceRegex.test(mainPepper)) {
				
				console.log("les champs sont BONS, et il y a une nouvelle image");
				
				// enlever les espaces en début et fin de string
				sauce.name = name.trim();
				sauce.mainPepper = mainPepper.trim();
				sauce.manufacturer = manufacturer.trim();
				sauce.description = description.trim();
				
				// restringifier la sauce parce que le controller parse la requete une deuxième fois.
				req.body.sauce = JSON.stringify(sauce);
				
				// si tout est ok, on peut passer la requête au prochain middleware
				next();

			} else {
				console.log("les champs sont FAUX, et il y a une nouvelle image");

				// multer sauvegarde la nouvelle image avant l'exécution de ce middleware
				fs.unlink(`images/${req.file.filename}`, () => {
					console.log("suppression de l'image du dossier images");
					res.status(400).json({ error: 'Requête non valable, l\'image a été supprimée' });
				})
			}
		} else {
			// il n'y pas de nouvelle image

			let name = req.body.name;
			let manufacturer = req.body.manufacturer;
			let description = req.body.description;
			let mainPepper = req.body.mainPepper;

			if (!spaceRegex.test(name) && !spaceRegex.test(manufacturer) && !spaceRegex.test(description) && !spaceRegex.test(mainPepper)) {
				console.log("Les champs sont BONS, et il n'y a PAS de nouvelle image");
				
				// enlever les espaces en début et fin de string
				req.body.mainPepper = mainPepper.trim();
				req.body.name = name.trim();
				req.body.manufacturer = manufacturer.trim();
				req.body.description = description.trim();
				
				next();

			} else {
				console.log("Les champs sont FAUX, et il n'y a PAS de nouvelle image");
				res.status(400).json({ error: 'Requête non valable' });
			}
		} 
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'Requête non valable' });
	}
};