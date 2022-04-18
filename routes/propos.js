var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();

//methode http chargee de la route /accueil
router.get('/', function (req, res) {
  sess = req.session;
  var utilisateur = sess.username;
  res.render('pages/propos.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "active",username: utilisateur,nbreParPage : 9,recherche:true, marque:req.query.marque,q:req.query.q });
});

module.exports = router;