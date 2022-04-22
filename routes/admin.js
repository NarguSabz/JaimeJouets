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
var userMessageAlertGlobal = "alertBad";
var userMessageTextGlobal = "";


//methode http chargee de la route /admin
router.get('/items', function (req, res) {

    //verifier si l'utilsateur connecter est l'administrateur, sinon redirect l'utilisateur vers la page principale
    sess = req.session;
    utilisateur = sess.username;
    if (utilisateur == "test") {
        res.render('pages/admin-items.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: utilisateur });
    } else {
        res.redirect('/');
   } 
});

//methode http chargee de la route /admin
router.get('/', function (req, res) {

    //verifier si l'utilsateur connecter est l'administrateur, sinon redirect l'utilisateur vers la page principale
    sess = req.session;
    utilisateur = sess.username;
    if (utilisateur == "test") {
        res.render('pages/admin.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: utilisateur });
    } else {
        res.redirect('/');
   } 
});

//methode http chargee de la route /admin
router.get('/users', function (req, res) {

    //verifier si l'utilsateur connecter est l'administrateur, sinon redirect l'utilisateur vers la page principale
    sess = req.session;
    utilisateur = sess.username;
    if (utilisateur == "test") {
        res.render('pages/admin-users.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: utilisateur });
    } else {
        res.redirect('/');
   } 
});

//methode qui se charge de charger d'afficher la liste des items dans une table
router.get('/itemlist', function (req, res) {
  
    db.collection('produits').find({}, {}, function (e, docs) {
        res.json(docs);
    });

});

//methode qui se charge de faire les transactions lorsque le boutton est cliquer.
router.post('/', function (req, res) {
   

    tempRes = res;
    tempReq = req;
    fillVariablesUpdateInput(tempReq);
    //verifier que l'item existe dans la bd
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        //imprimer un message d'erreur si l'item n'existe pas dans la bd
        if (typeof result[0] == 'undefined') {  
            userMessageTextGlobal = "l'item " + tempItemId + " est introuvable dans la base de donn�e!";
            userMessageAlertGlobal = "alertBad";
            printResult(userMessageTextGlobal,userMessageAlertGlobal);
        } else {
            //mettre a jour les documents necessaires et les mettres a zero si negatif
            updateDocument("nombrestock", tempReq.body.incSetAmount, tempAmountChange);
            updateDocument("prix", tempReq.body.incSetPrice, tempPriceChange)
            positiveDocument();
            
                    
                }
  
        
    });
});


//remplir les variables globales necessaires au fonctionnement de la page
function fillVariablesUpdateInput(req) {
    tempItemId = req.body.itemID.toString().trim();
    tempAmountChange = Number(req.body.amountChange);
    tempPriceChange = Number(req.body.priceChange);
}

//imprimer le resultat final si tout est correcte
function printFinishedResult(req) {
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        
            stockTmp = setPosInt(result[0].nombrestock);
            priceTmp = setPosInt(result[0].prix);

            userMessageTextGlobal = "l'item " + tempItemId + " a un stock de "+ stockTmp + " avec le prix de "+ priceTmp +" dollars canadiens!";
            userMessageAlertGlobal = "alertGood";
        
        printResult(userMessageTextGlobal,userMessageAlertGlobal);
    });
}

//imprimer un resultat 
function printResult(userMessageTextTmp, userMessageAlertTmp) {
    userMessageArray = [userMessageTextTmp, userMessageAlertTmp];
    tempRes.render('pages/admin-items.ejs', { login: "", accueil: "", creationCompte: "", produit: "", items: userMessageArray, username: utilisateur });
    tempRes.end();
}

//mettre a jour un document selon le radiobutton choisis (increment or set)
function updateDocument(docTmp, radioToCheck, tempChange) {

    if (radioToCheck == "incChange"){
        db.collection("produits").update({ numid: tempItemId }, { $inc: { [docTmp]: tempChange } }).then(() => {
           
        });
    } else {
        db.collection("produits").update({ numid: tempItemId }, { $set: { [docTmp]: tempChange } }).then(() => {
            
        });
    }
}
//mettre a zero un int negatif
function setPosInt(intTmp) {

    if (intTmp <= 0) 
        return 0;
    
    return intTmp;
}

//mettre a zero un document si negatif
function positiveDocument(docList) {
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
            if (result[0].nombrestock <= 0) 
                setDocumentZero("nombrestock");
            
            if (result[0].prix <= 0) 
                setDocumentZero("prix");

    });
    printFinishedResult();    
   
}

//mettre a zero un document 
function setDocumentZero(docTmp) {
   
        db.collection("produits").update({ numid: tempItemId }, { $set: { [docTmp]: 0 } }).then(() => {
      
        });
     
}
/** deprecated
function checkVarInt(){
    if (!isinstance(tempAmountChange, int) ||!isinstance(tempPriceChange, int)){
        userMessageTextGlobal = "les valeurs entrers doivent etres des entiers relatifs!";
        userMessageAlertGlobal = "alertBad";
    }

}
*/

/** deprecated
function setEmptyZero(){
    if (tempAmountChange = 'undefined')
        tempAmountChange = 0;    

    if (tempPriceChange = 'undefined')
        tempPriceChange = 0;  
}
*/
module.exports = router;