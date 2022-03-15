var express = require('express');
var mysql = require('mysql');
var router = express.Router();

//ajout d'une connection a la base de donnees
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "bdproto" });

//methode http chargee de la route /login
router.get('/', function (req, res) {
    //active le lien vers la page de login et desactive tous les autres liens
    res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "" });
});

router.post('/', function (req, res) {
    var userMessageText = "";
    var userMessageStatus = "";

    var userUsername = req.body.username.toString().trim();
    var userPassword = req.body.passwordUser.toString().trim();

    //console.log('username used ' + req.body.username);
    connection.query("Select nom_utilisateur, mdp from compte_client where nom_utilisateur = '" + userUsername + "'", function (err, result) {
        if (typeof result[0] == 'undefined') {
            //message d'erreur pour un nom d'utilsateur incorrecte
            userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
            userMessageStatus = "alertBad";
        } else {
            if (result[0].mdp == userPassword) {
                //message de succes pour une combinaison de nom d'utilisateur et mot de passe correcte
                userMessageText = "Combinaison du nom d'utilisateur et mot de passe correcte!";
                userMessageStatus = "alertGood";
            } else {
                //message d'erreur pour un mot de passe incorrect
                userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
                userMessageStatus = "alertBad";
            }
        }
        //afficher le message a l'utilisateur
        userMessageArray = [userMessageText, userMessageStatus];
        res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", items: userMessageArray });
        res.end();
    });
});

module.exports = router;