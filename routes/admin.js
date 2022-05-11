var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('mongodb+srv://dbUser:dbUserpassword@cluster0.g2a61.mongodb.net/protodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://dbUser:dbUserpassword@cluster0.g2a61.mongodb.net/";



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
        
    if (utilisateur == "test") {
        
        res.render('pages/admin-items.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
    } else {
        res.redirect('/');
      // res.render('pages/admin-items.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
   } 
});

//methode qui se charge de suprimer un compte_client
router.delete('/deleteuser:id', function(req, res) {

  var userToDelete = req.params.id;
  db.collection('compte_client').remove({ 'username' : userToDelete }, function(err) {
    //res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    deleteOnePanier(userToDelete,res);
  });
});

//methode http chargee de la route /admin
router.get('/', function (req, res) {

    //verifier si l'utilsateur connecter est l'administrateur, sinon redirect l'utilisateur vers la page principale
    sess = req.session;
    utilisateur = sess.username;
        
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

//methode qui se charge de charger d'afficher la liste des users dans une table
router.get('/userlist/', function (req, res) {
    db.collection('compte_client').find({}, {}, function (e, docs) {
        res.json(docs);
    });

});

//methode qui se charge de faire les modification aux items lorsque le boutton est cliquer.
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

//methode qui se charge de faire les modification aux utilisateurs lorsque le boutton est cliquer.
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

//methode qui se charge de suprimer un panier
function deleteOnePanier(userToDelete,res) {
  db.collection('panier').remove({ 'compte_client' : userToDelete }, function(err) {
    //res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
   
  });
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
            printResultUsers("nom d'utilisateur deja utiliser!", "alertBad");
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

                

            }else{
            db.close();
            printResultUsers("Email deja utiliser!", "alertBad");
            }
            
        });

    });
}

//methode qui met a jours les informations entrés d'un  utilisateur s'il existe dans la bd
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

//methode qui met a jours les informations entrés d'un  utilisateur
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
            printResultUsers("Creation du compte avec succes!", "alertGood");
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

//remplir les variables globales necessaires au fonctionnement de la page
function fillUserInput(req) {

    userUsername = req.body.userUsername.toString().trim();
    userPassword = req.body.passwordUser.toString().trim();
    userFirstname = req.body.fname.toString().trim();
    userLastname = req.body.lname.toString().trim();
    userEmail = req.body.email.toString().trim();
    userAddress = req.body.adresse.toString().trim();

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


//imprimer le resultat final si tout est correcte
function printFinishedResult() {
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        
            stockTmp = setPosInt(result[0].nombrestock);
            priceTmp = setPosInt(result[0].prix);

            userMessageTextGlobal = "l'item " + tempItemId + " a un stock de "+ stockTmp + " avec le prix de "+ priceTmp +" dollars canadiens!";
            userMessageAlertGlobal = "alertGood";
        
        printResult(userMessageTextGlobal,userMessageAlertGlobal);
    });
}

//methode qui affiche le resultat de les modifications d'un item
function printResult(userMessageTextTmp, userMessageAlertTmp) {
    userMessageArray = [userMessageTextTmp, userMessageAlertTmp];
    tempRes.render('pages/admin-items.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray, username: utilisateur,nbreParPage : 9,recherche:true, marque:"",q:"" });
    tempRes.end();
}

//methode qui affiche le resultat de les modifications d'un utilisateur
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
function positiveDocument() {
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
            if (result[0].nombrestock < 0) 
                setDocumentZero("nombrestock");
           
            if (result[0].prix < 0) 
                setDocumentPrixZero("prix");
            
            if (result[0].nombrestock < 0 || result[0].prix < 0){
                positiveDocument();
            }else{
                printFinishedResult();
            }
            
            
            
           
    });
        
   
}


//mettre a zero un document 
function setDocumentZero(docTmp) {
   
        db.collection("produits").update({ numid: tempItemId }, { $set: { [docTmp]: 0 } }).then(() => {
          
        });
     
}
//mettre a zero un document 
function setDocumentPrixZero(docTmp) {
   
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