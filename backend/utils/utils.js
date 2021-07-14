//Fonction validation email
//exemple attendu: druart@mail.fr
const mailTest (user.email) => {
    let regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let emailTry = regexMail.test(user.email);
}

//Fonction validation mot de passe verifie presence majuscule, minuscule, chiffre et taille minimale 8  et max 12 caracteres
const passwordTest (password) => {
    let regexPass = /^(?=.*[A-z])(?=.*[0-9])(?=.*[$@])\S{8,12}$/
    let passwordTry = regexPass.test(password);
}