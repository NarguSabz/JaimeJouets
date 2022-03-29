var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();

//methode http chargee de la route /accueil
router.get('/', function (req, res) {
  sess = req.session;
    
  var utilisateur
        if(typeof sess.username == undefined){
            utilisateur = "Mon compte";
        }else{
            utilisateur = sess.username;
        }
  
        res.render('pages/profil.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: utilisateur });
        //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
        db.close();
});

module.exports = router;