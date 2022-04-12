var express = require('express');
var http = require('http');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();


//methode http chargee de la route /produits
router.get('/', function (req, res) {
  sess = req.session;
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
            var nbreDeVingts = parseInt(resultat.length / 9);
            var nbreDePages;
            if (resultat.length % 9 > 0) {
                nbreDePages = nbreDeVingts + 1;
            } else {
                nbreDePages = nbreDeVingts;
            }
            var utilisateur = sess.username;
            res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", propos: "", produits: resultat, username: utilisateur });
           //on active le lien vers la page des produits et desactive tous les autres liens

            db.close();
          });
    });

    router.post('/filtres', function (req, res) {
      sess = req.session;
       var collection = db.get('produits');
       var body = null;
      //  if (typeof document !== 'undefined') {
      //   // will run in client's browser only
      //   body = document.getElementsByTagName("body")[0];
      //   }
      //  if(document.getElementById("brand-1").checked || document.getElementById("brand-2").checked || document.getElementById("brand-3").checked || document.getElementById("brand-4").checked || document.getElementById("brand-5").checked){
      //      //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits
      //     collection.aggregate([
      //       { $lookup:
      //          {
      //            from: 'categories',
      //            localField: 'categories_id',
      //            foreignField: 'numid',
      //            as: 'categories_id'
      //          } 
              
      //        } ,
      //        {$lookup:
      //          {
      //              from: "marques",
      //              localField: "marques_id",
      //              foreignField: "numid",
      //              as: "marques_id"
      //          }}
      //       ],function(err, resultat) {
      //           if (err) throw err;           
    
      //           //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
      //           var nbreDeVingts = parseInt(resultat.length / 9);
      //           var nbreDePages;
      //           if (resultat.length % 9 > 0) {
      //               nbreDePages = nbreDeVingts + 1;
      //           } else {
      //               nbreDePages = nbreDeVingts;
      //           }
      //           var utilisateur = sess.username;
      //           res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", propos: "", produits: resultat, username: utilisateur });
      //          //on active le lien vers la page des produits et desactive tous les autres liens
    
      //           db.close();
      //         });
      //       }else{
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
                     }},
               {$match:{$and: [{"categories_id.Nom": {$regex: req.body.categorie.value ,$options:"i"}},{"marques_id.Nom": {$regex: ".*"+ req.body.marque.value +".*" ,$options:"i"}}]
              }}
                  ],function(err, resultat) {
                      if (err) throw err;           
          
                      //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
                      var nbreDeVingts = parseInt(resultat.length / 9);
                      var nbreDePages;
                      if (resultat.length % 9 > 0) {
                          nbreDePages = nbreDeVingts + 1;
                      } else {
                          nbreDePages = nbreDeVingts;
                      }
                      var utilisateur = sess.username;
                      res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", propos: "", produits: resultat, username: utilisateur });
                     //on active le lien vers la page des produits et desactive tous les autres liens
          
                      db.close();
                    })
              //}

        });
    


module.exports = router;