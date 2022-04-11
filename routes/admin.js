var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var tempReq;
var tempRes;
var tempItemId;
var tempAmountChange;
var tempPriceChange;
var utilisateur;
var userMessageAlertGlobal = "alertGood";
var userMessageTextGlobal = "";


//methode http chargee de la route /login
router.get('/', function (req, res) {
    sess = req.session;
    utilisateur = sess.username;

    //if (utilisateur == "test") {
        res.render('pages/admin.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: utilisateur });
   // } else {
   //     res.redirect('/');
   // } 
});

router.get('/itemlist', function (req, res) {
  
    db.collection('produits').find({}, {}, function (e, docs) {
        res.json(docs);
    });

});

router.post('/', function (req, res) {
   

    tempRes = res;
    tempReq = req;
    fillVariablesUpdateInput(tempReq);
    console.log();
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        if (typeof result[0] == 'undefined') {  
            userMessageTextGlobal = "l'item " + tempItemId + " est introuvable dans la base de donn�e!";
            userMessageAlertGlobal = "alertBad";
           
        } else {
            updateDocument("nombrestock", tempReq.body.incSetAmount);
            updateDocument("prix", tempReq.body.incSetPrice);
            positiveDocument();
        }
        
    });
});


function positivePrice(docTmp) {

    db.collection("produits").find({ numid: tempItemId }, function (err, result) {

        if (typeof result[0] == 'undefined') {
            userMessageTextGlobal = "l'item " + tempItemId + " est introuvable dans la base de donn�e! ";
            userMessageAlertGlobal = "alertBad";

        } else {
            if (result[0].prix <= 0) {
                setPriceZero();
            } else {
                userMessageTextGlobal += "nouveau prix de l'item " + tempItemId + " est de : " + result[0].prix + " !";
                printResult(userMessageTextGlobal, userMessageAlertGlobal);
            }
        }
    });

}





function fillVariablesUpdateInput(req) {
    tempItemId = req.body.itemID.toString().trim();
    tempAmountChange = Number(req.body.amountChange);
    tempPriceChange = Number(req.body.priceChange);
}

function printResult(userMessageTextTmp, userMessageAlertTmp) {
    userMessageArray = [userMessageTextTmp, userMessageAlertTmp];
    tempRes.render('pages/admin.ejs', { login: "", accueil: "", creationCompte: "", produit: "", items: userMessageArray, username: utilisateur });
    tempRes.end();
}


function updateDocument(docTmp, radioToCheck) {

    if (radioToCheck == "incChange"){
        db.collection("produits").update({ numid: tempItemId }, { $inc: { [docTmp]: tempAmountChange } }).then(() => {
           
        });
    } else {
        db.collection("produits").update({ numid: tempItemId }, { $set: { [docTmp]: tempAmountChange } }).then(() => {
            
        });
    }
}

function positiveDocument() {

    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        if (typeof result[0] == 'undefined') {
            userMessageTextGlobal = "l'item " + tempItemId + " est introuvable dans la base de donn�e! ";
            userMessageAlertGlobal = "alertBad";

        } else {
            if (result[0].nombrestock <= 0) {
                setQuantityZero("nombrestock");
            } else {
                userMessageTextGlobal = "nouveau stock de l'item " + tempItemId + " est de : " + result[0].nombrestock + " ! \n";
                
            }
            if (result[0].prix <= 0) {
                setPriceZero("prix");
            } else {
                userMessageTextGlobal += "nouveau prix de l'item " + tempItemId + " est de : " + result[0].prix + " !";
                printResult(userMessageTextGlobal, userMessageAlertGlobal);
            }

        }
    });

}
function updatePrice(docTmp) {

    if (tempReq.body.incSetPrice == "incPrice") {
        db.collection("produits").update({ numid: tempItemId }, { $inc: { [docTmp]: tempPriceChange } }).then(() => {
            positivePrice(docTmp);
        });
    } else {
        db.collection("produits").update({ numid: tempItemId }, { $set: { [docTmp]: tempPriceChange } }).then(() => {
            positivePrice(docTmp);
        });
    }
}

function setQuantityZero(docTmp) {
    db.collection("produits").update({ numid: tempItemId }, { $set: { [docTmp]: 0 } }).then(() => {
        userMessageTextGlobal = "nouveau stock de l'item " + tempItemId + " est de : 0 ! "
    });
}

function setPriceZero(docTmp) {
    db.collection("produits").update({ numid: tempItemId }, { $set: { [docTmp]: 0 } }).then(() => {
        userMessageTextGlobal += "nouveau prix de l'item " + tempItemId + " est de : 0 !";
        printResult(userMessageTextGlobal, userMessageAlertGlobal);
    });
}


module.exports = router;