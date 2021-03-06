const fs = require('fs');

module.exports = (req, res, next) => {
	try {

		//on enregistre la sauce dans une variable
		let sauce =  null;/* req.file ? JSON.parse(req.body.sauce) : req.body*/
		if(req.file){
			sauce = JSON.parse(req.body.sauce);
		}
		else {
			sauce = req.body;
		}
		console.log(sauce);

		// enlever les espaces en début et fin de string
		let name = sauce.name.trim();
		let manufacturer = sauce.manufacturer.trim();
		let description = sauce.description.trim();
		let mainPepper = sauce.mainPepper.trim();

		console.log("ligne 21");

		// Vérifier que les champs texte soient remplis
		if (name.length > 0 && manufacturer.length > 0 && description.length > 0 && mainPepper.length > 0) {
			console.log("ligne 26");
			// si tout est ok, on récupère les champs sans les espaces
			sauce.name = name;
			sauce.manufacturer = manufacturer;
			sauce.description = description;
			sauce.mainPepper = mainPepper;

			const regexSauce = new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ,-.]*$");
			// exclut tous ce qui n'est pas alphanumérique sauf ., et -
			if (
				!regexSauce.test(sauce.name) ||
				!regexSauce.test(sauce.manufacturer) ||
				!regexSauce.test(sauce.description) ||
				!regexSauce.test(sauce.mainPepper)
			) {
				console.log("ligne 41");
				res.status(400).json({ error:"Veillez à n'utiliser que des chiffres, des lettres et les caractères , . -" });
			} else {
				console.log("ligne 44");
				// et on peut passer la requête au prochain middleware
				req.body.sauce = JSON.stringify(sauce);
				//on passe au middleware suivant
				next();
			}

		} else {
			console.log("ligne 52");
			// sinon on supprime la nouvelle image que multer a déjà sauvegardé
			fs.unlink(`images/${req.file.filename}`, () => {
				res.status(400).json({ error: 'Requête non valable, l\'image a été supprimée' });
			})
		}

	} catch (error) {
		console.log(error);
		res.status(400).json({ error: "modification impossible" });
	}
};