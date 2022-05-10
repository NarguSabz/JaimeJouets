var express = require('express');
var router = express.Router();
var request = require('request');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://dbUser:dbUserpassword@cluster0.g2a61.mongodb.net/";

var userUsername = "";
var userPassword = "";
var userFirstname = "";
var userLastname = "";
var userEmail = "";
var userAddress = "";
var tempRes;
var utilisateur;

//methode http chargee de la route /creerCompte
router.get('/', function (req, res) {
    sess = req.session;
    if (sess.username) {
        res.render('pages/profil.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: sess.username, email: sess.email, propos: "", nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q });
    } else {
        var utilisateur;
        utilisateur = sess.username;
        //active le lien vers la page de creation du compte et desactive tous les autres liens
        res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", propos: "", username: sess.username, nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q });
    }
});


//methode qui se charge d'envoyer les informations necessaires pour la creation d'un compte
//vers la BD en s'assurant que ces entrées sont acceptables (select & insert) -- recaptcha 
router.post('/', function (req, res) {
    fillVariablesInput(req);

    tempRes = res;

    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        printResult("Captcha non completer!", "alertBad");
    }

    var secretKey = "6LebWCMfAAAAAC70t95BkcQ5JPxaIoFJ-BDxJqg4";

    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationUrl, function (error, response, body) {
        body = JSON.parse(body);

        if (body.success) {
            console.log("yes")
            if (!checkAllFieldsEmpty()) {

                checkUserNameAvailable();

            } else {
                printResult("il manque un champs!", "alertBad");
            }

        }


    });

});

//methode qui insere un panier pour un utilisateur
function insertUserPanier() {

    var myobj = {
        compte_client: userUsername, produits: [],
        totals: 0.00,
        TPS: 0,
        TVQ: 0,
        formattedSousTotals: '',
        formattedTotals: ''
    };
    MongoClient.connect(url, function (err, db) {
        db.db("protodb").collection("panier").insertOne(myobj, function (err, res) {

            if (err) throw err;
            db.close();
        });
    });
}

//methode qui insere un compte_client pour un utilisateur
function insertUserCompteClient() {

    var myobj = { username: userUsername, mdp: userPassword, prenom: userFirstname, nom: userLastname, email: userEmail, adresse: userAddress };
    MongoClient.connect(url, function (err, db) {

        db.db("protodb").collection("compte_client").insertOne(myobj, function (err, res) {

            if (err) throw err;
            db.close();
        });

    });
}

//methode qui affiche le resultat de la creation d'un utilisateur
function printResult(userMessageTextTmp, userMessageAlertTmp) {
    userMessageArray = [userMessageTextTmp, userMessageAlertTmp];
    tempRes.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", propos: "", items: userMessageArray, username: sess.username, nbreParPage: 9, recherche: false, marque: '', q: '' });
    tempRes.end();

}

//methode qui s'assure que le nom d'utilisateur n'est pas utiliser avant de faire les insertions
function checkUserNameAvailable() {
    MongoClient.connect(url, function (err, db) {
        db.db("protodb").collection("panier").find({ compte_client: userUsername }).limit(1).toArray(function (err, result) {

            if (!result[0]) {
                db.close();
                
                checkEmailAvailable();


            }else{
            db.close();
            printResult("nom d'utilisateur deja utiliser!", "alertBad");
            }
            
        });

    });
}

//methode qui s'assure que l'adresse email n'est pas utiliser avant de faire les insertions
function checkEmailAvailable() {
    MongoClient.connect(url, function (err, db) {
        db.db("protodb").collection("compte_client").find({ email: userEmail }).limit(1).toArray(function (err, result) {

            if (!result[0]) {
                db.close();
                
                insertUserPanier();
                insertUserCompteClient();

                printResult("Creation du compte avec succes!", "alertGood");

            }else{
            db.close();
            printResult("Email deja utiliser!", "alertBad");
            }
            
        });

    });
}

//methode qui s'assure que plusieurs champs d'entrés sont remplis ou non
function checkAllFieldsEmpty() {
    var missingAmount = 0;

    missingAmount += checkOneFieldEmpty(userUsername);
    missingAmount += checkOneFieldEmpty(userPassword);
    missingAmount += checkOneFieldEmpty(userFirstname);
    missingAmount += checkOneFieldEmpty(userLastname);
    missingAmount += checkOneFieldEmpty(userEmail);
    missingAmount += checkOneFieldEmpty(userAddress);

    return Boolean(missingAmount);
}

//methode qui s'assure que un champs d'entrés est remplis ou non
function checkOneFieldEmpty(fieldToCheck) {
    if (fieldToCheck.trim() == "") {
        return 1;
    }
    return 0;
}

//methode qui remplis les variables globales
function fillVariablesInput(req) {

    userUsername = req.body.usernameCreate.toString().trim();
    userPassword = req.body.passwordUser.toString().trim();
    userFirstname = req.body.fname.toString().trim();
    userLastname = req.body.lname.toString().trim();
    userEmail = req.body.email.toString().trim();
    userAddress = req.body.adresse.toString().trim();

}

/**     deprecated 
function giveUserId() {
    MongoClient.connect(url, function (err, db) {
    db.db("protodb").collection("panier").find({}, { projection: { _id: 0, numid: 1 } }).sort({ numid: -1 }).limit(1).toArray(function (err, result) {
        sleep(2000);
        if (typeof result[0] != 'undefined') { //chercher le plus gros ID s'il existe pour iterer dessus
            resultTest = result[0].numid;
            resultTest++;
            console.log(resultTest);
            db.close();
            return resultTest;
        }
        db.close();
        return 0;
    });
    });
    }
*/

/**     deprecated 
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
*/

module.exports = router;