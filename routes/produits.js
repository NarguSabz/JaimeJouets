var express = require('express');
var http = require('http');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();


//methode http chargee de la route /produits
    router.get('/', function (req, res) {
      sess = req.session;
      nbreDeProd = req.query.nbre;

      if(nbreDeProd == undefined){
        nbreDeProd = 9;
      }
       var collection = db.get('produits');
           //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits
          collection.aggregate([
            { $lookup:
               {
                 from: 'categories',
                 localField: 'categories_id',
                 foreignField: 'numid',
                 as: 'categories_id'
               } 
              
             } ,
             {$lookup:
               {
                   from: "marques",
                   localField: "marques_id",
                   foreignField: "numid",
                   as: "marques_id"
               }}
            ],function(err, resultat) {
                if (err) throw err;           
    
                //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
                var nbreDeVingts = parseInt(resultat.length / Number(nbreDeProd ));
                var nbreDePages;
                if (resultat.length % Number(nbreDeProd ) > 0) {
                    nbreDePages = nbreDeVingts + 1;
                } else {
                    nbreDePages = nbreDeVingts;
                }
                var utilisateur = sess.username;
                
                res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", propos: "", produits: resultat, username: utilisateur ,MotCherchee:'', nbreParPage : nbreDeProd,recherche:false, marque:req.query.marque,q:req.query.q, filtre:req.query.filtre});
               //on active le lien vers la page des produits et desactive tous les autres liens
    
                db.close();
              });
              
        });

module.exports = router;