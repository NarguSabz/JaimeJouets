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
//ajot d'une connection a la base de donnees
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "mybd" });

app.set('view engine', 'ejs');

/**
* import all related Javascript and css files to inject in our app
*/
app.use(express.static(__dirname + '/public/'));

//methode http chargee de la route /accueil
app.get('/', function (req, res) {
    //query permettant d aller chercher les 8 les plus recents produits, dans la base de donnees mybd, puis on passe le resultat dans le variable produits
    connection.query("SELECT p.id_produit, p.nom, p.description, p.date_parution, p.prix, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque order by p.date_parution desc,p.id_produit ASC limit 8;",
        function (err, resultat) { res.render('pages/index.ejs', { login: "", accueil: "active", creationCompte: "", produit: "", produits: resultat }); });
    //on active egalement le lien vers la page d accueil et desactive tous les autres liens
    });

//methode http chargee de la route /login
app.get('/login', function (req, res) {
        //active le lien vers la page de login et desactive tous les autres liens
    res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "" });
});

//methode http chargee de la route /creerCompte
app.get('/creerUnCompte', function (req, res) {
    //active le lien vers la page de creation du compte et desactive tous les autres liens
    res.render('pages/creerCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "" });
});

//methode http chargee de la route /unProduit
app.get('/unProduit', function (req, res) {
    res.render('pages/unProduit.ejs');
});

//methode http chargee de la route /produits
app.get('/produits', function (req, res) {
    //active le lien vers la page des produits et desactive tous les autres liens
    res.render('pages/produits.ejs', { login: "", accueil: "", creationCompte: "", produit: "active" });
});

var serveur = app.listen(2000, function () {
    console.log("serveur fonctionne sur 2000... ! ");
});