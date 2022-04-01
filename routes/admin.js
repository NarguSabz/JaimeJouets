var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/protodb');

var tempRes;
var tempItemId;
var tempAmountChange;


//methode http chargee de la route /login
router.get('/', function (req, res) {
    //active le lien vers la page de login et desactive tous les autres liens
    res.render('pages/admin.ejs', { login: "", accueil: "", creationCompte: "", produit: "" });
});

router.post('/', function (req, res) {
    fillVariablesUpdateInput(req);
    tempRes = res;

    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        if (typeof result[0] == 'undefined') {  
            printResult("l'item " + tempItemId + " est introuvable dans la base de donnée! ", "alertBad");
        } else {
           
            updateQuantity();
           }
      
    });
});

function updateQuantity() {

    db.collection("produits").update({ numid: tempItemId }, { $inc: { nombrestock: tempAmountChange } }).then(() => {
        positiveStock();
    });
    
}

function positiveStock() {

    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        if (typeof result[0] == 'undefined') {
            printResult("item id incorrecte!", "alertBad");

        } else {
            if (result[0].nombrestock <= 0) {
                console.log(result[0].nombrestock);
                setQuantityZero();
            } else {
                printResult("nouveau stock de l'item " + tempItemId +" est de : " + result[0].nombrestock+ " ! ", "alertGood");
            }
        }
    });

}

function setQuantityZero() {
    db.collection("produits").update({ numid: tempItemId }, { $set: { nombrestock: 0 } }).then(() => {
        printResult("nouveau stock de l'item " + tempItemId + " est de : 0 ! ", "alertGood");
    });
}

function fillVariablesUpdateInput(req) {
    tempItemId = req.body.itemID.toString().trim();
    tempAmountChange = Number(req.body.amountChange);
}

function printResult(userMessageTextTmp, userMessageAlertTmp) {
    userMessageArray = [userMessageTextTmp, userMessageAlertTmp];
    tempRes.render('pages/admin.ejs', { login: "", accueil: "", creationCompte: "", produit: "", items: userMessageArray });
    tempRes.end();
}

module.exports = router;