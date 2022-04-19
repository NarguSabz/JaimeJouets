var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
const panier = require('../config/Panier.js');


//methode http chargee de la route /unProduit
router.get('/', (req, res) => {
  if (!req.session.panier) {
    req.session.panier = sessionPanierVide();
  }
  console.log(req.session.panier+"hh");
  sess = req.session;
  var utilisateur = sess.username;

  res.render('../views/pages/pagePanier.ejs', {
    login: "", accueil: "", creationCompte: "", propos: "", produit: "", username: utilisateur, panier: req.session.panier, nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q

  });
});
router.post('/ajouterPanier', (req, res) => {
  if (!req.session.panier) {
    req.session.panier = sessionPanierVide();
  }
  utilisateur = sess.username;
    panier.ajouterAuPanier(req.body.produit, req.body.qty,req.session.panier);
    
    res.end();
  
});
router.get('/quickview', (req, res) => {
  if (!req.session.panier) {
    req.session.panier = sessionPanierVide();
  }
  res.render('../views/pages/panier.ejs', {
    panier: req.session.panier,
  });
});
router.get('/enlever/:id', (req, res) => {
  if (!req.session.panier) {
    req.session.panier = sessionPanierVide();

  }

  let id = req.params.id;
  panier.enleverProduit(parseInt(id, 10),req.session.panier);
  res.redirect('/panier/quickview');
});
router.get('/ajouterQuantite/:id/:qty', (req, res) => {
  if (!req.session.panier) {
    req.session.panier = sessionPanierVide();
  }
  let id = req.params.id;
  let qty = req.params.qty
  panier.ajouterQuantite(parseInt(id, 10), parseInt(qty, 10),req.session.panier);
  res.redirect('/panier/quickview');
});

function sessionPanierVide() {
 return {
    produits: [],
    totals: 0.00,
    TPS: 0,
    TVQ: 0,
    formattedSousTotals: '',
    formattedTotals: ''
  };
}

module.exports = router;
