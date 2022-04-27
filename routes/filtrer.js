var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
var bodyParser = require('body-parser');

//methode http chargee de la route /rechercher
router.use('/', function (req, res) {
    sess = req.session;
    var collection = db.get('produits');
    nbreDeProd = req.body.nbrePage;
    filtrePrix = req.body.filtrePrix;
    filtres = req.body.filtres;
    
    if (nbreDeProd == undefined || nbreDeProd == "") {
        nbreDeProd = 9;
    }if (filtrePrix == undefined || filtrePrix == "") {
        filtrePrix = 1;
    }


    var  conditionQuery = {"nom": {$regex: ".*"+ req.body.q +".*" ,$options:"i"}};
    var conditionCategorie = { "categories_id.nom": { $in: filtres.categorie } };;
    var conditionMarque = { "marques_id.Nom": { $in: filtres.marque } };
    var conditionPrix = { 'prix': { $gte: Number(filtres.prix[0]), $lt: Number(filtres.prix[1]) } };
    var conditionEvaluation = {"moyen":{$gte: Number(filtres.evaluation[0])}};
    if (filtres.categorie.length == 0 && filtres.marque.length == 0 && filtres.evaluation.length == 0 ) {
        conditionMarque = conditionPrix;
        conditionCategorie = conditionPrix;
        conditionEvaluation = conditionPrix;

    }else if (filtres.categorie.length == 0 && filtres.evaluation.length == 0) {
        conditionCategorie = conditionMarque;
        conditionEvaluation = conditionMarque;
    } else if (filtres.marque.length == 0 && filtres.evaluation.length == 0) {
        conditionMarque = conditionCategorie;
        conditionEvaluation = conditionCategorie;
    } else if (filtres.marque.length == 0 && filtres.categorie.length == 0) {
        conditionMarque = conditionEvaluation;
        conditionCategorie = conditionEvaluation;
    }
    else if (filtres.categorie.length == 0 ) {
        conditionCategorie = conditionEvaluation;
    } else if (filtres.evaluation.length == 0 ) {
        conditionEvaluation = conditionCategorie;
    }else if (filtres.marque.length == 0 ) {
        conditionMarque = conditionEvaluation;
    }

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
        },
        { $match: { $and: [conditionCategorie, conditionMarque, conditionPrix, conditionQuery,conditionEvaluation] } },{$sort:{ prix :Number(filtrePrix) ,numid:1}}
    ], function (err, resultat) {
        if (err) throw err;
        //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
        var nbreDeVingts = parseInt(resultat.length / Number(nbreDeProd));
        var nbreDePages;
        if (resultat.length % Number(nbreDeProd) > 0) {
            nbreDePages = nbreDeVingts + 1;
        } else {
            nbreDePages = nbreDeVingts;
        }
        var utilisateur = sess.username;

        res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", propos: "", username: utilisateur, produit: "active", produits: resultat, MotCherchee: req.body.q, nbreParPage: nbreDeProd, recherche: true, marque: req.query.marque, q: req.query.q,filtre:req.query.filtre ,filtrePrix:filtrePrix});
        //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
    });
});


module.exports = router;