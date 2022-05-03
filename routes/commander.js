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

module.exports = router;