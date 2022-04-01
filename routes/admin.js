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
    res.render('pages/admin.ejs', { login: "active", accueil: "", creationCompte: "", produit: "" });
});

router.post('/', function (req, res) {
    fillVariablesInput(req);
    tempRes = res;

    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
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

    db.collection("produits").update({ numid: tempItemId }, { $inc: { nombrestock: tempAmountChange } }).then(() => {
        
        positiveStock(reqTmp);
    });
    
        //afficher le message a l'utilisateur

    
}

function positiveStock(reqTmp) {

    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        if (typeof result[0] == 'undefined') {
            userMessageText = "item id incorrecte!";
            userMessageStatus = "alertBad";
            userMessageArray = [userMessageText, userMessageStatus];
            res.render('pages/admin.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", items: userMessageArray });
            res.end();
        } else {
            if (result[0].nombrestock <= 0) {
                console.log(result[0].nombrestock);
                setQuantityZero(reqTmp);
            } else {

            }
        }
        //afficher le message a l'utilisateur

    });

}

function setQuantityZero(reqTmp) {;
    db.collection("produits").update({ numid: reqTmp.body.itemID }, { $set: { nombrestock: 0 } });
   
}

function fillVariablesInput(req) {

    tempItemId = reqTmp.body.itemID.toString().trim();
    tempAmountChange = Number(reqTmp.body.amountChange);
}
module.exports = router;