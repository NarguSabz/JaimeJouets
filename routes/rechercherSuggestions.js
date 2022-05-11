var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb+srv://dbUser:dbUserpassword@cluster0.g2a61.mongodb.net/protodb');
var router = express.Router();
var bodyParser = require('body-parser');

//methode http chargee de la route /rechercher
router.get('/', function (req, res) {
    //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits et de aller chercher les 8 les plus recents produits, dans la base de donnees
   var collection = db.get('produits');
    
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
        }, {$match:{$and: [ {"nom": {$regex: ".*"+ req.query.q +".*" ,$options:"i"}},{"marques_id.Nom": {$regex: ".*"+ req.query.marque +".*" ,$options:"i"}}]}},{$limit:3}
    ], function (err, resultat) {
        
         res.render('pages/suggestions.ejs', { character:req.query.q,produits: resultat});
         //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
        db.close();
    });
});

module.exports = router;