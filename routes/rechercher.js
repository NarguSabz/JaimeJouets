var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();

//methode http chargee de la route /accueil
router.get('/', function (req, res) {
    //connection.query("SELECT p.id_produit, p.nom, p.description, p.date_parution, p.prix, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque where p.nom Like"+ "'%"+req.query.q+"%'"+";",  function (err, resultat) {
    var collection = db.get('produits');
    collection.find({}, {}, function (e, resultat) {
        /* var nbreDeVingts = parseInt(resultat.length / 9);
         var nbreDePages;
         if (resultat.length % 9 > 0) {
             nbreDePages = nbreDeVingts + 1;
         } else {
             nbreDePages = nbreDeVingts;
         }
         res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", produits: resultat });
     
     console.log("'%"+req.params.q+"%'");*/
        res.json(resultat);
        console.log(resultat);
    });
    /*  //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
      var nbreDeVingts = parseInt(resultat.length / 9);
      var nbreDePages;
      if (resultat.length % 9 > 0) {
          nbreDePages = nbreDeVingts + 1;
      } else {
          nbreDePages = nbreDeVingts;
      }
      res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", produits: resultat });
  
  console.log("'%"+req.params.q+"%'");*/
    //});
});

module.exports = router;