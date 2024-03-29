var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb+srv://dbUser:dbUserpassword@cluster0.g2a61.mongodb.net/protodb');


var request = require('request');

//ajout d'une connection a la base de donnees
var utilisateur;
//methode http chargee de la route /login
router.get('/', function (req, res) {
    sess = req.session;
    if(sess.username){
        res.render('pages/profil.ejs', { login: "", accueil: "", creationCompte: "", produit: "", mdp: sess.mdp, nom: sess.nom, adresse: sess.adresse, prenom: sess.prenom, username: sess.username, email: sess.email, propos: "",nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q});
    }else{
      var utilisateur;
    utilisateur = sess.username;
    //active le lien vers la page de creation du compte et desactive tous les autres liens
    res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", propos: "",username: sess.username,nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q});
    }
});

router.post('/', function (req, res) {

    sess = req.session;
    var userMessageText = "";
    var userMessageStatus = "";

    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        userMessageText = "Captcha non reussis!";
        userMessageStatus = "alertBad";
        userMessageArray = [userMessageText, userMessageStatus];
        console.log(utilisateur + "jj");
        res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username : utilisateur,nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q});
        res.end();
    } else {

    var secretKey = "6LebWCMfAAAAAC70t95BkcQ5JPxaIoFJ-BDxJqg4";

    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationUrl, function (error, response, body) {
        body = JSON.parse(body);
         sess = req.session;
        if (body.success) {
            db.collection("compte_client").find({ username: req.body.username }, function (err, result) {
                db.collection("panier").find({ compte_client: req.body.username }, function (err, resultat) {

                    console.log(result);
                    console.log(resultat);
                    if (typeof result[0] == 'undefined') {
                    //message d'erreur pour un nom d'utilsateur incorrecte
                    userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
                    userMessageStatus = "alertBad";
                    userMessageArray = [userMessageText, userMessageStatus];
                    res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: sess.username,nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q });
                    res.end(); 
                } else {
                    if (result[0].mdp == req.body.passwordUser) {
                            //message de succes pour une combinaison de nom d'utilisateur et mot de passe correcte//message de succes pour une combinaison de nom d'utilisateur et mot de passe correcte
                                userMessageText = "Combinaison du nom d'utilisateur et mot de passe correcte!";
                                userMessageStatus = "alertGood";
                                sess.username = result[0].username;
                                sess.email = result[0].email;
                                sess.adresse = result[0].adresse;
                                sess.prenom = result[0].prenom;
                                sess.nom = result[0].nom;
                                sess.mdp = result[0].mdp;
                                sess.panier = resultat[0];
                    } else {
                        //message d'erreur pour un mot de passe incorrect
                        userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
                        userMessageStatus = "alertBad";
                    }

                    if(sess.username){
                        console.log('hello');

                        res.render('pages/profil.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", propos: "", mdp: sess.mdp, nom: sess.nom, adresse: sess.adresse, prenom: sess.prenom, username: sess.username, email: sess.email, nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q });
                        res.end();
                    }else{
                        //afficher le message a l'utilisateur
                        userMessageArray = [userMessageText, userMessageStatus];
                        res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: sess.username,nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q});
                        res.end(); 
                    }
                }
                
                

            });});
        }


    });
    }
    //console.log('username used ' + req.body.username);
   
    
});

module.exports = router;