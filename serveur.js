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
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "bdproto" });

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

app.post('/login/connexion', function (req, res){
    console.log('username used ' + req.body.username);
    connection.query("Select nom_utilisateur, mdp from compte_client where nom_utilisateur = '" + req.body.username + "'", function(err, result){
        if (typeof result[0] == 'undefined') {
            console.log('username used ' + req.body.username);
            res.writeHeader(200, {'Content-Type': 'text/html ; charset=UTF-8'});
            res.write("<html><body><script>alert('Pas Ok');</script></body></html>");
            res.end();
        }else{
            if(result[0].mdp == req.body.MDP){
            res.writeHeader(200, {'Content-Type': 'text/html ; charset=UTF-8'});
            res.write("<html><body><script>alert('Ok');</script></body></html>");
            console.log('Test réussi');
            res.end();
            }else{
                res.writeHeader(200, {'Content-Type': 'text/html ; charset=UTF-8'});
                res.write("<html><body><script>alert('Pas Ok');</script></body></html>");
                res.end()
            }
            
        }
    });
    
});

//methode qui se charge d'envoyer les informations necessaires pour la creation d'un compte 
//vers la BD en s'assurant que ces entrées sont acceptables 
app.post('/creerUnCompte', function (req, res) {
	
	var resultTest = 0; //initialisation du premier ID a 0 si necessaire
	
	if (req.body.username.trim() == "") { //verifier si le username est vide
		console.log('invalid username')
		throw err;
	}
	
	connection.query("SELECT * from panier ORDER BY id_panier DESC LIMIT 1", function (err, result) {
		
		if (typeof result[0] != 'undefined') { //chercher le plus gros ID s'il existe pour iterer dessus
			resultTest = result[0].id_panier;
			resultTest++;
		}
		
		//verifier si le username existe deja si non, inserer les données de l'utilisateur dans la BD
		connection.query("SELECT compte_client_nom_utilisateur from panier WHERE compte_client_nom_utilisateur = '" + req.body.username.trim() + "'", function (err, result) {
			if (typeof result[0] != 'undefined') {
				console.log('username used' + req.body.username.trim());
				throw err;
			} else {
				connection.query("INSERT INTO panier (id_panier, compte_client_nom_utilisateur) VALUES ( " + resultTest + "," + " '" + req.body.username.trim() + "')", function (err, result) {
					if (err) throw err;
					//console.log("INSERT INTO compte_client (nom_utilisateur, mdp, prenom, nom ,email, adresse, panier_id_panier) VALUES ( '" + req.body.username + "', '" + req.body.passwordUser + "', '" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.adresse + "', " + resultTest + ")");
					connection.query("INSERT INTO compte_client (nom_utilisateur, mdp, prenom, nom ,email, adresse, panier_id_panier) VALUES ( '" + req.body.username + "', '" + req.body.passwordUser + "', '" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.adresse + "', " + resultTest + ")", function (err, result) {
						if (err) throw err;
						
					res.writeHeader(200, {'Content-Type': 'text/html ; charset=UTF-8'});
					res.write("<html><body><script>alert('Compte Créer');</script></body></html>");
					console.log('Test réussi');
					
					});
				});
			}
		});
	});
});

//methode http chargee de la route /creerCompte
app.get('/creerUnCompte', function (req, res) {
    //active le lien vers la page de creation du compte et desactive tous les autres liens
    res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "" });
});

//methode http chargee de la route /unProduit
/*app.get('/unProduit', function (req, res) {
    res.render('pages/unProduit.ejs', {login: "", accueil: "", creationCompte: "", produit: "active"});
});*/

//methode http chargee de la route /unProduit
app.get('/produit/:id', function (req, res) {
    connection.query("SELECT p.id_produit, p.nom, p.description, p.date_parution, p.prix, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque where p.id_produit =" + req.params.id +";",
    function (err, resultat) {
        if(resultat.length == 0){
            console.log("produit non trouvable");
            res.writeHeader(200, {'Content-Type': 'text/html ; charset=UTF-8'});
			res.write("<html><body><script>alert('produit non trouvable'); window.location = 'http://localhost:2000/';</script></body></html>");
        }else{
        res.render('pages/unProduit.ejs', {login: "", accueil: "", creationCompte: "", produit: "active",produit: resultat[0]})};
});});
//methode http chargee de la route /produits
app.get('/produits', function (req, res) {
    //query permettant d aller chercher tous les produits, dans la base de donnees mybd, puis on passe le resultat dans le variable produits
    connection.query("SELECT p.id_produit, p.nom, p.description, p.date_parution, p.prix, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque;",
        function (err, resultat) {
            //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
            var nbreDeVingts = parseInt(resultat.length / 9);
            var nbreDePages;
            if (resultat.length % 9 > 0) {
                nbreDePages = nbreDeVingts + 1;
            } else {
                nbreDePages = nbreDeVingts;
            }
            res.render('pages/produits.ejs', {nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", produits: resultat });
        });
    //on active le lien vers la page des produits et desactive tous les autres liens
});

var serveur = app.listen(2000, function () {
    console.log("serveur fonctionne sur 2000... ! "); 
});