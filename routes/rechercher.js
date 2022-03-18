var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
var bodyParser = require('body-parser');

//methode http chargee de la route /rechercher
router.get('/', function (req, res) {
    //connection.query("SELECT p.id_produit, p.nom, p.description, p.date_parution, p.prix, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque where p.nom Like"+ "'%"+req.query.q+"%'"+";",  function (err, resultat) {
    //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits et de aller chercher les 8 les plus recents produits, dans la base de donnees
   /* var collection = db.get('produits');
    collection.createIndex({nom: "text"});
    collection.find({ $text : { $search : req.query.q }},function(err, result){console.log(result.length)});*/
    
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
        }, {$match:{ "nom": {$regex: ".*"+ req.query.q +".*" ,$options:"xi"}}}
    ], function (err, resultat) {
        if (err) throw err;
         //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
         var nbreDeVingts = parseInt(resultat.length / 9);
         var nbreDePages;
         if (resultat.length % 9 > 0) {
             nbreDePages = nbreDeVingts + 1;
         } else {
             nbreDePages = nbreDeVingts;
         }
         res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", produits: resultat });
         //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
        db.close();
    });
});

module.exports = router;