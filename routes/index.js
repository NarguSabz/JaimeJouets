var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();

//methode http chargee de la route /accueil
router.get('/', function (req, res) {
  sess = req.session;
  console.log(sess.username);
  
    //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits et de aller chercher les 8 les plus recents produits, dans la base de donnees
    var collection = db.get('produits');

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
        }},{$sort:{ date_parution : -1,numid:1}},{$limit:8}
     ],function(err, resultat) {
         if (err) throw err; 
         var utilisateur = sess.username;
         res.render('pages/index.ejs', { login: "", accueil: "active", creationCompte: "", produit: "", produits: resultat,marques:["Barbie","Fisher-Price","Hot Wheels","Lego","Vtech"], username: utilisateur });
         //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
         db.close();
       });
});

module.exports = router;