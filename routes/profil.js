var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
var utilisateur;
//methode http chargee de la route /accueil
router.get('/', function (req, res) {
  sess = req.session;
  utilisateur = sess.username;

  res.render('pages/profil.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur, email: sess.email, nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q });
  //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
});

router.post('/deconnexion', function (req, res) {
  //save to cart de la base de donnees
  console.log(req.session.panier)
  if (req.session.username) {
    panier = req.session.panier;
    db.collection("panier").findOneAndUpdate({ "compte_client": panier.compte_client }, {
      $set:
      {
        produits: panier.produits,
        totals: panier.totals,
        TPS: panier.TPS,
        TVQ: panier.TVQ,
        formattedSousTotals: panier.formattedSousTotals,
        formattedTotals: panier.formattedTotals
      }
    }).then((updatedDoc) => { console.log(updatedDoc) })
  }
  
  if(req.body.typeDeconnexion != 'ajax'){
    req.session.destroy();
  sess = req.session;
  res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur, nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q });
  }else{res.end();}

});

module.exports = router;