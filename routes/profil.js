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
  console.log(sess.username);
  
  
    res.render('pages/profil.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: utilisateur, email: sess.email});
    //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
    db.close();
});

router.post('/deconnexion', function(req, res){
    req.session.destroy();
    sess = req.session;
    res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", username: utilisateur});
    //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
    db.close();

});

module.exports = router;