﻿var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var request = require('request');
var nodemailer = require('nodemailer');

var tempReq;
var tempRes;
//ajout d'une connection a la base de donnees
var utilisateur;


var transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'jaimejouet@outlook.com',
    pass: 'tp2!jaime'
  }
});






//methode http chargee de la route /login
router.get('/', function (req, res) {
    sess = req.session;
    utilisateur = sess.username;
    userMessageArray = ['', ''];
    if (utilisateur == undefined){
        tempRes = res;
        tempReq = req;
        res.render('pages/forgotPassword.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray,username: sess.username,nbreParPage :9,recherche:false, marque:req.query.marque,q:req.query.q});
    }else{
        res.redirect('/');
    }

 });  


router.post('/', function (req, res) {
userEmail = req.body.userEmail;
userUsername = req.body.userUsername;
userPassword = "";
db.collection("compte_client").find({ email: userEmail }, function (err, result) {
        //imprimer un message d'erreur si l'item n'existe pas dans la bd
        if (typeof result[0] == 'undefined') {  
            userMessageTextGlobal = "l'adresse email" + userEmail + " est introuvable dans la base de donnée!";
            userMessageAlertGlobal = "alertBad";
            printResult(userMessageTextGlobal,userMessageAlertGlobal);
        } else {
           if (result[0].username == userUsername)
               userPassword = result[0].mdp;
               mailOptions = createEmailOptions(userEmail, userPassword);
               sendEmail(mailOptions);     
                userMessageTextGlobal = "Mot de passe envoyé!";
                userMessageAlertGlobal = "alertGood";
                printResult(userMessageTextGlobal,userMessageAlertGlobal);
           }
  
        
    });



 });  

 function printResult(userMessageTextTmp, userMessageAlertTmp) {
    userMessageArray = [userMessageTextTmp, userMessageAlertTmp];
    tempRes.render('pages/forgotPassword.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", propos: "",items: userMessageArray});
    tempRes.end();
}

function createEmailOptions(userEmail, userPassword){
 var mailOptions = {
  from: 'jaimejouet@outlook.com',
  to: userEmail,
  subject: 'mot de passe oublier!',
  text: userPassword
};
return mailOptions;
}


function sendEmail(mailOptions){
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});





}



module.exports = router;