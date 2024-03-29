var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb+srv://dbUser:dbUserpassword@cluster0.g2a61.mongodb.net/protodb');
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
    sauvegarderPanier(req);
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
  sauvegarderPanier(req);

  res.redirect('/panier/quickview');
});
router.get('/ajouterQuantite/:id/:qty', (req, res) => {
  if (!req.session.panier) {
    req.session.panier = sessionPanierVide();
  }
  let id = req.params.id;
  let qty = req.params.qty
  panier.ajouterQuantite(parseInt(id, 10), parseInt(qty, 10),req.session.panier);
  sauvegarderPanier(req);

  res.redirect('/panier/quickview');
});

function sessionPanierVide() {
 return {
    produits: [],
    totals: 0.00,
    TPS: 0,
    TVQ: 0,
    formattedSousTotals: '',
    formattedTotals: '',
    rabais: 0
  };
}
function sauvegarderPanier(req){
  if (req.session.username) {
    panierUser = req.session.panier;
    db.collection("panier").findOneAndUpdate({ "compte_client": panierUser.compte_client }, {
      $set:
      {
        produits: panierUser.produits,
        totals: panierUser.totals,
        TPS: panierUser.TPS,
        TVQ: panierUser.TVQ,
        formattedSousTotals: panierUser.formattedSousTotals,
        formattedTotals: panierUser.formattedTotals
      }
    }).then((updatedDoc) => { console.log(updatedDoc) })
  }
}


module.exports = router;
