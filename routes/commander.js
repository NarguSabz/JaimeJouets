var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
const panier = require('../config/Panier.js');
var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': 'AfMeBb1CYNaRJfoEtfxbZ1kVoOSNtHr-ANO9QGcG7Ghu61JXv1RdL_jOdvnDwKAsyyL0lI6jm-K6da_0', // please provide your client id here 
  'client_secret': 'EKKuvYqDRI71zdXdoVe-8DM__8H2O7TvL3RRLLatOkzkmLqX-Bk4FQiOaD5zVqc04Wu5b8EfCkFMaNRY' // provide your client secret here 
});


//methode http chargee de la route /unProduit
router.get('/', function (req, res) {
  
  sess = req.session;
  var utilisateur = sess.username;
  if (sess.panier == undefined || sess.panier.produits.length == 0) {
   //res.writeHead(200, { 'Content-Type': 'text/html ; charset=UTF-8' });
    res.send("<html><body><script type='text/javascript' defer>alert('votre panier est vide!'); window.location = 'http://localhost:2000/';</script></body></html>");
  } else {

  res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur,classPanier: panier, panier: req.session.panier,nbreParPage : 9,recherche:false, marque:req.query.marque,q:req.query.q});
  }
});

router.post('/', function (req, res) {
  prix = (req.session.panier.totals +req.session.panier.TPS+req.session.panier.TVQ).toFixed(2);
  var payment = {
    "intent": "authorize",
"payer": {
"payment_method": "paypal"
},
"redirect_urls": {
"return_url": "http://127.0.0.1:2000/success",
"cancel_url": "http://127.0.0.1:2000/err"
},
"transactions": [{
"amount": {
"total":prix ,
"currency": "CAD"
},
"description": " un jouet "
}]
}
createPay( payment )
.then( ( transaction ) => {
    var id = transaction.id; 
    var links = transaction.links;
    var counter = links.length; 
    while( counter -- ) {
        if ( links[counter].method == 'REDIRECT') {
  // redirect to paypal where user approves the transaction 
            return res.redirect( links[counter].href )
        }
    }
})
.catch( ( err ) => { 
    console.log( err ); 
    res.redirect('/err');
});
  
});

var createPay = ( payment ) => {
  return new Promise( ( resolve , reject ) => {
      paypal.payment.create( payment , function( err , payment ) {
       if ( err ) {
           reject(err); 
       }
      else {
          resolve(payment); 
      }
      }); 
  });
}		
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