var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();


router.get('/', function (req, res) {
    sess = req.session;
    if(!sess.username){
        res.render('pages/login.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: sess.username, email: sess.email, propos: "",nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q});
    }else{
        res.render('pages/modifierEmail.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "", mdp: sess.mdp, nom: sess.nom, adresse: sess.adresse, prenom: sess.prenom, username: sess.username, email: sess.email, nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q });
        //on active egalement le lien vers la page d accueil et desactive tous les autres liens     
    }   
});

router.post('/emailModifiee', function (req, res) {
    sess = req.session;
    if(!sess.username){
        res.render('pages/login.ejs', { login: "", accueil: "", creationCompte: "", produit: "", username: sess.username, email: sess.email, propos: "",nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q});
    }else{
        var userMessageText = "";
        var userMessageStatus = "";        
        if(req.body.newEmail == ""){
            userMessageText = "Espace vide";
            userMessageStatus = "alertBad";
            userMessageArray = [userMessageText, userMessageStatus];
            res.render('pages/modifierEmail.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "", mdp: sess.mdp, nom: sess.nom, adresse: sess.adresse, prenom: sess.prenom, username: sess.username, email: sess.email, items: userMessageArray, nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q });
        }else{
            db.collection("compte_client").update({ username: sess.username }, { $set: { email: req.body.newEmail} }).then(() => {
                sess.email = req.body.newEmail;
                userMessageText = "Adresse courriel changée!";
                userMessageStatus = "alertGood";
                userMessageArray = [userMessageText, userMessageStatus];
                res.render('pages/profil.ejs', { login: "", accueil: "", creationCompte: "", produit: "", propos: "", mdp: sess.mdp, nom: sess.nom, adresse: sess.adresse, prenom: sess.prenom, username: sess.username, email: sess.email, items: userMessageArray, nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q });
            });
           
        }
    }   
});


module.exports = router;