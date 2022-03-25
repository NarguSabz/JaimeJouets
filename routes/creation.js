var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var userUsername = "";
var userPassword = "";
var userFirstname = "";
var userLastname = "";
var userEmail = "";
var userAddress = "";
var tempRes;
//var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/protodb');

//methode http chargee de la route /creerCompte
router.get('/', function (req, res) {
    //active le lien vers la page de creation du compte et desactive tous les autres liens
    res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "" });
});

//methode qui se charge d'envoyer les informations necessaires pour la creation d'un compte
//vers la BD en s'assurant que ces entrées sont acceptables (select & insert)
router.post('/', function (req, res) {

    fillVariablesInput(req);
    //console.log(userAddress);

    /*
    const query = MySchema.findOne({ name: /tester/gi });
    const userData = await query.exec();
    console.log(userData)
    */
        tempRes = res;
        if (!checkAllFieldsEmpty()) {
            
            checkUserNameAvailable();

        } else {
            printResult("il manque un champs!", "alertBad")
        }

});


function insertUserPanier() {

    var myobj = {  compte_client: userUsername };
    MongoClient.connect(url, function (err, db) {
        db.db("protodb").collection("panier").insertOne(myobj, function (err, res) {
       
        if (err) throw err;
        db.close();
    });
    });
}

function insertUserCompteClient() {

    var myobj = { username: userUsername, mdp: userPassword, prenom: userFirstname, nom: userLastname, email: userEmail, adresse: userAddress };
    MongoClient.connect(url, function (err, db) {
        
        db.db("protodb").collection("compte_client").insertOne(myobj, function (err, res) {
            
            if (err) throw err;
            db.close();
        });

    });
}

function printResult(userMessageTextTmp, userMessageAlertTmp) {
    userMessageArray = [userMessageTextTmp, userMessageAlertTmp];
    tempRes.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", items: userMessageArray });
    tempRes.end();

}

function checkUserNameAvailable() {
            MongoClient.connect(url, function (err, db) {
                db.db("protodb").collection("panier").find({ compte_client: userUsername }).limit(1).toArray(function (err, result) {
                    

                    //console.log(result);
                    if (!result[0]) { 
                        db.close();
                        insertUserPanier();
                        insertUserCompteClient();

                        printResult("Creation du compte avec succes!", "alertGood")
                        
                    }
                    db.close();
                    printResult("nom d'utilisateur utiliser!", "alertBad")
                });

            });
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

function checkOneFieldEmpty(fieldToCheck) {
    if (fieldToCheck.trim() == "") {
        return 1;
    }
    return 0;
}

function fillVariablesInput(req) {

    userUsername = req.body.username.toString().trim();
    userPassword = req.body.passwordUser.toString().trim();
    userFirstname = req.body.fname.toString().trim();
    userLastname = req.body.lname.toString().trim();
    userEmail = req.body.email.toString().trim();
    userAddress = req.body.adresse.toString().trim();

}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


module.exports = router;