var express = require('express');
var http = require('http');
var mysql = require('mysql');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();

//ajout d'une connection a la base de donnees
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "bdproto" });

//methode http chargee de la route /produits
router.get('/', function (req, res) {
   var collection = db.get('produits'); 
   // collection.find({},{},function(e,docs){
       
     // res.json(docs[0]._id.numid);
      //console.log("yess"+JSON.stringify(docs)); });
      
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
           }}
        ],function(err, res) {
            if (err) throw err;
            console.log(JSON.stringify(res));
            db.close();
          });
    });
  
   

    
    //query permettant d aller chercher tous les produits, dans la base de donnees mybd, puis on passe le resultat dans le variable produits
   /* connection.query("SELECT p.id_produit, p.nom, p.description, p.date_parution, p.prix, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque;",
        function (err, resultat) {
            //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
            var nbreDeVingts = parseInt(resultat.length / 9);
            var nbreDePages;
            if (resultat.length % 9 > 0) {
                nbreDePages = nbreDeVingts + 1;
            } else {
                nbreDePages = nbreDeVingts;
            }
            res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", produits: resultat });
        });*/
    //on active le lien vers la page des produits et desactive tous les autres liens


module.exports = router;