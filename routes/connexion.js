var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var request = require('request');

//ajout d'une connection a la base de donnees

var utilisateur;
//methode http chargee de la route /login
router.get('/', function (req, res) {
    sess = req.session;
    utilisateur = sess.username;
    //active le lien vers la page de login et desactive tous les autres liens
    res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", username : utilisateur });
});

router.post('/', function (req, res) {

    sess = req.session;
    var userMessageText = "";
    var userMessageStatus = "";

    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        userMessageText = "Captcha non reussis!";
        userMessageStatus = "alertBad";
        userMessageArray = [userMessageText, userMessageStatus];
        res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", items: userMessageArray, username : utilisateur});
        res.end();
    } else {

    var secretKey = "6LebWCMfAAAAAC70t95BkcQ5JPxaIoFJ-BDxJqg4";

    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        
        request(verificationUrl, function (error, response, body) {
            
        body = JSON.parse(body);
        sess = req.session;

           
           
            if (body.success) {
                
            db.collection("compte_client").find({ username: req.body.username }, function (err, result) { 
                if (typeof result[0] == 'undefined') {
                    //message d'erreur pour un nom d'utilsateur incorrecte
                    userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
                    userMessageStatus = "alertBad";
                    
                    userMessageArray = [userMessageText, userMessageStatus];
                    res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", items: userMessageArray, username: sess.username });
                    res.end(); 
                } else {
                    
                    if (result[0].mdp == req.body.passwordUser) {
                        //message de succes pour une combinaison de nom d'utilisateur et mot de passe correcte
                        userMessageText = "Combinaison du nom d'utilisateur et mot de passe correcte!";
                        userMessageStatus = "alertGood";
                        console.log(userMessageText);
                        sess.username = result[0].username;
                        sess.email = result[0].email;
                    } else {
                        //message d'erreur pour un mot de passe incorrect
                        userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
                        userMessageStatus = "alertBad";
                        console.log(userMessageText);
                    }

                    if(sess.username){
                        res.render('pages/profil.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", username: sess.username, email: sess.email });
                        res.end();
                    }else{
                        //afficher le message a l'utilisateur
                        userMessageArray = [userMessageText, userMessageStatus];
                        res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", items: userMessageArray, username: sess.username });
                        res.end(); 
                    }
                }
                
                

            });
        }


    });
    }
    //console.log('username used ' + req.body.username);
   
    
});

module.exports = router;