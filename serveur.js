/**
* import all modules
**/

var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

/*
* parse all form data
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
* view engine template parsing (ejs types)
*/

app.set('view engine', 'ejs');

/**
* import all related Javascript and css files to inject in our app
*/
app.use(express.static(__dirname + '/public/'));

//methode http chargee de la route /accueil
app.get('/accueil', function (req, res) {
    res.render('pages/index.ejs');
});

//methode http chargee de la route /login
app.get('/login', function (req, res) {
    res.render('pages/login.ejs');
});

//methode http chargee de la route /creerCompte
app.get('/creerUnCompte', function (req, res) {
    res.render('pages/creerCompte.ejs');
});

//methode http chargee de la route /unProduit
app.get('/unProduit', function (req, res) {
    res.render('pages/unProduit.ejs');
});

//methode http chargee de la route /produits
app.get('/produits', function (req, res) {
    res.render('pages/produits.ejs');
});

var serveur = app.listen(2000, function () {
    console.log("serveur fonctionne sur 2000... ! ");
});