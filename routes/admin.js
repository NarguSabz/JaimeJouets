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

    if (utilisateur == "test") {
        res.render('pages/admin.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: utilisateur });
    } else {
        res.redirect('/');
   } 
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
            printResult(userMessageTextGlobal,userMessageAlertGlobal);
        } else {
            
            updateDocument("nombrestock", tempReq.body.incSetAmount);
            updateDocument("prix", tempReq.body.incSetPrice)
            positiveDocument();
            
                    
                }
  
        
    });
});



function fillVariablesUpdateInput(req) {
    tempItemId = req.body.itemID.toString().trim();
    tempAmountChange = Number(req.body.amountChange);
    tempPriceChange = Number(req.body.priceChange);
    setEmptyZero();
}


function setEmptyZero() {
        console.log(tempAmountChange)


}

function printFinishedResult(req) {
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        if (typeof result[0] == 'undefined') {  
            userMessageTextGlobal = "l'item " + tempItemId + " est introuvable dans la base de donn�e!";
            userMessageAlertGlobal = "alertBad";
           
        } else {
            stockTmp = setPosInt(result[0].nombrestock);
            priceTmp = setPosInt(result[0].prix);

            userMessageTextGlobal = "l'item " + tempItemId + " a un stock de "+ stockTmp + " avec le prix de "+ priceTmp +" dollars canadiens!";
           
        }
        printResult(userMessageTextGlobal,userMessageAlertGlobal);
    });
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

function setPosInt(intTmp) {

    if (intTmp <= 0) 
        return 0;
    
    return intTmp;
}

function positiveDocument(docList) {
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
            if (result[0].nombrestock <= 0) 
                setDocumentZero("nombrestock");
            
            if (result[0].prix <= 0) 
                setDocumentZero("prix");

    });
    printFinishedResult();    
   
}


function setDocumentZero(docTmp) {
   
        db.collection("produits").update({ numid: tempItemId }, { $set: { [docTmp]: 0 } }).then(() => {
      
        });
     
}


module.exports = router;