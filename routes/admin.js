var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');


//methode http chargee de la route /login
router.get('/', function (req, res) {
    //active le lien vers la page de login et desactive tous les autres liens
    res.render('pages/admin.ejs', { login: "active", accueil: "", creationCompte: "", produit: "" });
});

router.post('/', function (req, res) {
    var userMessageText = "";
    var userMessageStatus = "";

    db.collection("produits").find({ numid: req.body.itemID }, function (err, result) {
       
        if (typeof result[0] == 'undefined') {  
            userMessageText = "item id incorrecte!";
            userMessageStatus = "alertBad";
            userMessageArray = [userMessageText, userMessageStatus];
            res.render('pages/admin.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", items: userMessageArray });
            res.end();
        } else {
            updateQuantity(req);
           }
        //afficher le message a l'utilisateur
        
    });
});

function updateQuantity(reqTmp) {
    db.collection("produits").updateOne({ numid: reqTmp.body.itemID }, { $inc: { nombrestock: reqTmp.body.amountChange } }, function (err, result) {
        positiveStock(reqTmp);
        //afficher le message a l'utilisateur

    });
}

function updateQuantity(reqTmp) {

    db.collection("produits").find({ numid: reqTmp.body.itemID }, function (err, result) {
        console.log(result);
        if (typeof result[0] == 'undefined') {
            userMessageText = "item id incorrecte!";
            userMessageStatus = "alertBad";
            userMessageArray = [userMessageText, userMessageStatus];
            res.render('pages/admin.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", items: userMessageArray });
            res.end();
        } else {
            if (result[0].nombrestock <= 0) {
                setQuantityZero(reqTmp);
            }
        }
        //afficher le message a l'utilisateur

    });

}

function setQuantityZero(reqTmp) {
    db.collection("produits").updateOne({ numid: reqTmp.body.itemID }, { nombrestock: 0 } , function (err, result) {
    });
}

module.exports = router;