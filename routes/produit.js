var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();

//methode http chargee de la route /unProduit
router.get('/:id', function (req, res) {
        //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits et de aller chercher les 8 les plus recents produits, dans la base de donnees
    var collection = db.get('produits');

    collection.aggregate([
      { $lookup:
         {
           from: 'categories',
           localField: 'categories_id',
           foreignField: '_id.numid',
           as: 'categories_id'
         } 
        
       } ,
       {$lookup:
         {
             from: "marques",
             localField: "marques_id",
             foreignField: "_id.numid",
             as: "marques_id"
         }},{$match: {'_id.numid': req.params.id}}
      ],function(err, resultat) {
          if (err) throw err;  
          if (resultat.length == 0) {
            console.log("produit non trouvable");
            res.writeHeader(200, { 'Content-Type': 'text/html ; charset=UTF-8' });
            res.write("<html><body><script>alert('produit non trouvable'); window.location = 'http://localhost:2000/';</script></body></html>");
        } else {
            collection.aggregate([
                { $lookup:
                   {
                     from: 'categories',
                     localField: 'categories_id',
                     foreignField: '_id.numid',
                     as: 'categories_id'
                   } 
                  
                 } ,
                 {$lookup:
                   {
                       from: "marques",
                       localField: "marques_id",
                       foreignField: "_id.numid",
                       as: "marques_id"
                   }},{$match: {'marques_id': resultat[0].marques_id}}
                ],function(err, result) {
                res.render('pages/unProduit.ejs', { login: "", accueil: "", creationCompte: "", produit: "active", produit: resultat[0],produitsDeMemeMarque:result})
            });
        };          
          //on active egalement le lien vers la page d accueil et desactive tous les autres liens         
        });
});

module.exports = router;