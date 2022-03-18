var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbo = db.db("protodb");

var userUsername = "";
var userPassword = "";
var userFirstname = "";
var userLastname = "";
var userEmail = "";
var userAddress = "";

var userMessageText = "";
var userMessageStatus = "";

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
        fillVariablesInput();
          
        if (!checkAllFieldsEmpty()) {
            
            if (checkUserNameAvailable(req)) {
                console.log("username check cleared");
                insertUserPanier(req);
                insertUserCompteClient(req);
            } else {
                console.log("username check NOT cleared");
            }

        } else {

            console.log("field empty pls");
        }
       


});


function insertUserPanier(req) {
    var userUsername = req.body.username.toString().trim();
    var myobj = { /*numid: resultTest,*/ compte_client: userUsername };
    console.log(myobj);
    MongoClient.connect(url, function (err, db) {
    dbo.collection("panier").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
    });
}

function insertUserCompteClient(req) {

    var userUsername = req.body.username.toString().trim();
    var userPassword = req.body.passwordUser.toString().trim();
    var userFirstname = req.body.fname.toString().trim();
    var userLastname = req.body.lname.toString().trim();
    var userEmail = req.body.email.toString().trim();
    var userAddress = req.body.adresse.toString().trim();

    var myobj = { username: userUsername, mdp: userPassword, prenom: userFirstname, nom: userLastname, email: userEmail, adresse: userAddress /*, panier_id: resultTest*/ };
    console.log( myobj);
    dbo.collection("panier").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted" );

    });

}

function checkUserNameAvailable(dbo, req) {
    var userUsername = req.body.username.toString().trim();
    dbo.collection("panier").find({ compte_client: userUsername }).limit(1).toArray(function (err, result) {
        console.log(result);
        if (!result[0]) {
            console.log("not used")
            return 1;

        }
        console.log("used")
        return 0;
    });
}



function giveUserId(dbo) {

    dbo.collection("panier").find({}, { projection: { _id: 0, numid: 1 } }).sort({ numid: -1 }).limit(1).toArray(function (err, result) {
        //console.log(result);
        if (typeof result[0] != 'undefined') { //chercher le plus gros ID s'il existe pour iterer dessus
            resultTest = result[0].numid;
            resultTest++;
            console.log(resultTest);
            return resultTest;
        }
        return 0;
    });
    }

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

function fillVariablesInput() {

    userUsername = req.body.username.toString().trim();
    userPassword = req.body.passwordUser.toString().trim();
    userFirstname = req.body.fname.toString().trim();
    userLastname = req.body.lname.toString().trim();
    userEmail = req.body.email.toString().trim();
    userAddress = req.body.adresse.toString().trim();

}






module.exports = router;