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
        //location.replace("../index");
        //<a href="../">Accueil</a>
        return res.redirect('/pages/index.ejs');
        /** var collection = db.get('produits');

        collection.aggregate([
            {
                $lookup:
                {
                    from: 'categories',
                    localField: 'categories_id',
                    foreignField: 'numid',
                    as: 'categories_id'
                }

            },
            {
                $lookup:
                {
                    from: "marques",
                    localField: "marques_id",
                    foreignField: "numid",
                    as: "marques_id"
                }
            }, { $sort: { date_parution: -1, numid: 1 } }, { $limit: 8 }
        ], function (err, resultat) {
            if (err) throw err;
            var utilisateur = sess.username;
            res.render('pages/index.ejs', { login: "", accueil: "active", creationCompte: "", produit: "", produits: resultat, marques: ["Barbie", "Fisher-Price", "Hot Wheels", "Lego", "Vtech"], username: utilisateur });
            //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
            db.close();
        });
    */
    }

    
    //active le lien vers la page de login et desactive tous les autres liens
   

   
    //db.collection('produits').find({}, {}, function (e, docs) {
    //    res.json(docs);
    //});
   

  
});

router.post('/', function (req, res) {
   

    tempRes = res;
    tempReq = req;
    fillVariablesUpdateInput(tempReq);
    console.log();
    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        if (typeof result[0] == 'undefined') {  
            userMessageTextGlobal = "l'item " + tempItemId + " est introuvable dans la base de donnée!";
            userMessageAlertGlobal = "alertBad";
           
        } else {
            updateQuantity();
            updatePrice();
        }
        
    });
});

function updateQuantity() {

    if (tempReq.body.incSetAmount == "incChange"){
        db.collection("produits").update({ numid: tempItemId }, { $inc: { nombrestock: tempAmountChange } }).then(() => {
            positiveStock();
        });
    } else {
        db.collection("produits").update({ numid: tempItemId }, { $set: { nombrestock: tempAmountChange } }).then(() => {
            positiveStock();
        });
    }
}

function positiveStock() {

    db.collection("produits").find({ numid: tempItemId }, function (err, result) {
        
        if (typeof result[0] == 'undefined') {
            userMessageTextGlobal = "l'item " + tempItemId + " est introuvable dans la base de donnée! ";
            userMessageAlertGlobal = "alertBad";

        } else {
            if (result[0].nombrestock <= 0) {
                setQuantityZero();
            } else {
                userMessageTextGlobal = "nouveau stock de l'item " + tempItemId + " est de : " + result[0].nombrestock + " ! \n";
                
            }
        }
    });

}

function setQuantityZero() {
    db.collection("produits").update({ numid: tempItemId }, { $set: { nombrestock: 0 } }).then(() => {
        userMessageTextGlobal = "nouveau stock de l'item " + tempItemId + " est de : 0 ! "
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

function updatePrice() {

    if (tempReq.body.incSetPrice == "incPrice") {
        db.collection("produits").update({ numid: tempItemId }, { $inc: { prix: tempPriceChange } }).then(() => {
            positivePrice();
        });
    } else {
        db.collection("produits").update({ numid: tempItemId }, { $set: { prix: tempPriceChange } }).then(() => {
            positivePrice();
        });
    }
}

function positivePrice() {

    db.collection("produits").find({ numid: tempItemId }, function (err, result) {

        if (typeof result[0] == 'undefined') {
            userMessageTextGlobal = "l'item " + tempItemId + " est introuvable dans la base de donnée! ";
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

function setPriceZero() {
    db.collection("produits").update({ numid: tempItemId }, { $set: { prix: 0 } }).then(() => {
        userMessageTextGlobal += "nouveau prix de l'item " + tempItemId + " est de : 0 !";
        printResult(userMessageTextGlobal, userMessageAlertGlobal);
    });
}


module.exports = router;