var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
const panier = require('../config/Panier.js');


//methode http chargee de la route /unProduit
router.get('/', (req, res) => {
  sess = req.session;
  var utilisateur = sess.username;

    res.render('../views/pages/pagePanier.ejs', {
      login: "", accueil: "", creationCompte: "", propos: "", produit: "", username: utilisateur, panier: panier,

    });
  

});
router.post('/ajouterPanier', (req, res) => {
  //si l utilisateur n est pas connectee
  panier.ajouterAuPanier(req.body.produit, req.body.qty);

  res.end();
});
router.get('/quickview', (req, res) => {
  res.render('../views/pages/panier.ejs', {
    panier: panier,
  });
});
router.get('/enlever/:id', (req, res) => {
  let id = req.params.id;
  panier.enleverProduit(parseInt(id, 10));
  res.redirect('/panier/quickview');

});
module.exports = router;
