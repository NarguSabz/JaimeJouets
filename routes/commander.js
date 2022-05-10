var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
const panier = require('../config/Panier.js');


//methode http chargee de la route /unProduit
router.get('/', function (req, res) {
  sess = req.session;
  var utilisateur = sess.username;
  if (sess.panier == undefined) {
    console.log("produit non trouvable");
    res.writeHeader(200, { 'Content-Type': 'text/html ; charset=UTF-8' });
    res.write("<html><body><script>alert('votre panier est vide!'); window.location = 'http://localhost:2000/';</script></body></html>");
  } else {

  res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur,classPanier: panier, panier: req.session.panier,nbreParPage : 9,recherche:false, marque:req.query.marque,q:req.query.q});
  }
});

router.post('/reduction', function (req, res){
  sess = req.session;
  var utilisateur = sess.username;
  if (sess.panier == undefined) {
    console.log("produit non trouvable");
    res.writeHeader(200, { 'Content-Type': 'text/html ; charset=UTF-8' });
    res.write("<html><body><script>alert('votre panier est vide!'); window.location = 'http://localhost:2000/';</script></body></html>");
  } else {
    db.collection("rabais").find({ code: req.body.code }, function (err, result) { 
      if(typeof result[0] == 'undefined'){
        sess.panier.rabais = 0;
        panier.calculateTotals(sess.panier);
        userMessageText = "Ce code de réduction n'est pas valide.";
        userMessageStatus = "alertBad";
        userMessageArray = [userMessageText, userMessageStatus];
        if(sess.username){
          db.collection("panier").update({ compte_client: sess.username }, { $set: { rabais: sess.panier.rabais, formattedSousTotals: sess.panier.formattedSousTotals, formattedTotals: sess.panier.formattedTotals} }).then(() => {
            res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur,classPanier: panier, panier: sess.panier,nbreParPage : 9,recherche:false, marque:req.query.marque,q:req.query.q,items: userMessageArray});
          });
        }else{
          res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur,classPanier: panier, panier: sess.panier,nbreParPage : 9,recherche:false, marque:req.query.marque,q:req.query.q,items: userMessageArray});
        }
      }else if(result[0].utilise == true){
        sess.panier.rabais = 0;
        panier.calculateTotals(sess.panier);
        userMessageText = "Ce code de réduction a déjà été utilisé.";
        userMessageStatus = "alertBad";
        userMessageArray = [userMessageText, userMessageStatus];
        if(sess.username){
          db.collection("panier").update({ compte_client: sess.username }, { $set: { rabais: sess.panier.rabais, formattedSousTotals: sess.panier.formattedSousTotals, formattedTotals: sess.panier.formattedTotals} }).then(() => {
            res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur,classPanier: panier, panier: sess.panier,nbreParPage : 9,recherche:false, marque:req.query.marque,q:req.query.q,items: userMessageArray});
          });
        }else{
          res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur,classPanier: panier, panier: sess.panier,nbreParPage : 9,recherche:false, marque:req.query.marque,q:req.query.q,items: userMessageArray});
        }        
      }else{
        sess.panier.rabais = result[0].pourcentage;
        console.log(sess.panier.rabais);
        panier.calculateRabais(sess.panier, sess.panier.rabais);
        console.log(sess.panier.formattedTotals)
        userMessageText = "Félicitation! vous avez " + sess.panier.rabais +"% de rabais" ;
        userMessageStatus = "alertGood";
        userMessageArray = [userMessageText, userMessageStatus];
        if(sess.username){
          db.collection("panier").update({ compte_client: sess.username }, { $set: { rabais: sess.panier.rabais, formattedSousTotals: sess.panier.formattedSousTotals, formattedTotals: sess.panier.formattedTotals} }).then(() => {
            db.collection("rabais").update({ code: req.body.code }, { $set: { utilise : true} }).then(() => {
              res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur,classPanier: panier, panier: sess.panier,nbreParPage : 9,recherche:false, marque:req.query.marque,q:req.query.q,items: userMessageArray});
            });
          });
        }else{
          res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur,classPanier: panier, panier: sess.panier,nbreParPage : 9,recherche:false, marque:req.query.marque,q:req.query.q,items: userMessageArray});
        }
        
      }
    })

  }
})

module.exports = router;