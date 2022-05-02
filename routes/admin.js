var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var tempReq;
var tempRes;

var tempItemId;
var tempAmountChange;
var tempPriceChange;

var utilisateur;

var userUsername = "";
var userPassword = "";
var userFirstname = "";
var userLastname = "";
var userEmail = "";
var userAddress = "";

var userMessageAlertGlobal = "alertBad";
var userMessageTextGlobal = "";

//methode http chargee de la route /admin
router.get('/items/', function (req, res) {

    //verifier si l'utilsateur connecter est l'administrateur, sinon redirect l'utilisateur vers la page principale
    sess = req.session;
    utilisateur = sess.username;
    userMessageArray = ['', ''];
         utilisateur= "test";
    if (utilisateur == "test") {
        
        res.render('pages/admin-items.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
    } else {
        res.redirect('/');
      // res.render('pages/admin-items.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
   } 
});

/* DELETE to deleteuser. */
router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userToDelete = req.params.id;
  collection.remove({ '_id' : userToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

//methode http chargee de la route /admin
router.get('/', function (req, res) {

    //verifier si l'utilsateur connecter est l'administrateur, sinon redirect l'utilisateur vers la page principale
    sess = req.session;
    utilisateur = sess.username;
         utilisateur= "test";
    userMessageArray = ['', ''];
    if (utilisateur == "test") {
       
        res.render('pages/admin.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
    } else {
        res.redirect('/');
    //res.render('pages/admin.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
   } 
});

//methode http chargee de la route /admin
router.get('/users/', function (req, res) {
    
    //verifier si l'utilsateur connecter est l'administrateur, sinon redirect l'utilisateur vers la page principale
    sess = req.session;
    utilisateur = sess.username;
            utilisateur= "test";
    userMessageArray = ['', ''];
    if (utilisateur == "test") {
    
        res.render('pages/admin-users.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
    } else {
        res.redirect('/');
        //res.render('pages/admin-users.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
   } 
});

//methode qui se charge de charger d'afficher la liste des items dans une table
router.get('/itemlist/', function (req, res) {
    db.collection('produits').find({}, {}, function (e, docs) {
        res.json(docs);
    });

});

router.get('/userlist/', function (req, res) {
    db.collection('compte_client').find({}, {}, function (e, docs) {
        res.json(docs);
    });

});

//methode qui se charge de faire les transactions lorsque le boutton est cliquer.
router.post('/items/', function (req, res) {
   

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

router.post('/users/', function (req, res) {
    fillUserInput(req);
    tempRes = res;
    tempReq = req;

    if (tempReq.body.setAddUser == "addChange"){
        if (!checkAllFieldsEmpty()) {
                
                checkUserNameAvailable();
                
            } else {
                 userMessageTextGlobal = "Champs d'informations manquants!";
                 userMessageAlertGlobal = "alertBad";
                 printResultUsers(userMessageTextGlobal,userMessageAlertGlobal);
            }
    } else {
      updateUser()

    }
    
});

function checkUserNameAvailable() {
    MongoClient.connect(url, function (err, db) {
        db.db("protodb").collection("panier").find({ compte_client: userUsername }).limit(1).toArray(function (err, result) {

            if (!result[0]) {
                db.close();
                insertUserPanier();
                insertUserCompteClient();

                printResultUsers("Creation du compte avec succes!", "alertGood");

            }else{
            db.close();
            printResultUsers("nom d'utilisateur utiliser!", "alertBad");
            }
            
        });

    });
}

function updateUser() {
    MongoClient.connect(url, function (err, db) {
        db.db("protodb").collection("panier").find({ compte_client: userUsername }).limit(1).toArray(function (err, result) {

            if (!result[0]) {
              printResultUsers("nom d'utilisateur n'existe pas!", "alertBad");
              db.close();
            }else{
                updateUserDocument();
            }
            
            
        });

    });
}

function updateUserDocument() {
const userInfoList = [userPassword,userFirstname,userLastname,userEmail,userAddress];
const docInfoList = ["mdp","prenom","nom","email","adresse"];
console.log(userInfoList);

for (let i = 0; i < userInfoList.length; i++) {
  if (userInfoList[i] != ""){
    docTmp = docInfoList[i];
    tempChange= userInfoList[i];

    db.collection("compte_client").update({ username: userUsername }, { $set: { [docTmp]: tempChange } }).then(() => {
            
        });
  }
}
 printResultUsers("utilisateur modifier!", "alertGood");      

}

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

function insertUserCompteClient() {

    var myobj = { username: userUsername, mdp: userPassword, prenom: userFirstname, nom: userLastname, email: userEmail, adresse: userAddress };
    MongoClient.connect(url, function (err, db) {

        db.db("protodb").collection("compte_client").insertOne(myobj, function (err, res) {

            if (err) throw err;
            db.close();
        });

    });
}
//remplir les variables globales necessaires au fonctionnement de la page
function fillVariablesUpdateInput(req) {
    tempItemId = req.body.itemID.toString().trim();
    tempAmountChange = Number(req.body.amountChange);
    tempPriceChange = Number(req.body.priceChange);
}

function fillUserInput(req) {

    userUsername = req.body.userUsername.toString().trim();
    userPassword = req.body.passwordUser.toString().trim();
    userFirstname = req.body.fname.toString().trim();
    userLastname = req.body.lname.toString().trim();
    userEmail = req.body.email.toString().trim();
    userAddress = req.body.adresse.toString().trim();

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
    tempRes.render('pages/admin-items.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
    tempRes.end();
}

function printResultUsers(userMessageTextTmp, userMessageAlertTmp) {
    userMessageArray = [userMessageTextTmp, userMessageAlertTmp];
    tempRes.render('pages/admin-users.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
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