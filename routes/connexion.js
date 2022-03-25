var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');

//ajout d'une connection a la base de donnees
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "bdproto" });

//methode http chargee de la route /login
router.get('/', function (req, res) {
    sess = req.session;
    //active le lien vers la page de login et desactive tous les autres liens
    res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "" });
});

router.post('/', function (req, res) {
    sess = req.session;
    var userMessageText = "";
    var userMessageStatus = "";
    //console.log('username used ' + req.body.username);
    db.collection("compte_client").find({username : req.body.username}, function (err, result) {
        console.log(result);
        if (typeof result[0] == 'undefined') {
            //message d'erreur pour un nom d'utilsateur incorrecte
            userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
            userMessageStatus = "alertBad";
        } else {
            if (result[0].mdp == req.body.passwordUser) {
                //message de succes pour une combinaison de nom d'utilisateur et mot de passe correcte
                sess.email = result[0].email;
                sess.username = result[0].username;
                userMessageText = "Combinaison du nom d'utilisateur et mot de passe correcte!" + sess.email + sess.username;
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