

var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

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

app.post('/login', function (req, res) {
    var userMessageText = "";
    var userMessageStatus = "";
    //console.log('username used ' + req.body.username);
    connection.query("Select nom_utilisateur, mdp from compte_client where nom_utilisateur = '" + req.body.username + "'", function (err, result) {
        if (typeof result[0] == 'undefined') {
            //message d'erreur pour un nom d'utilsateur incorrecte
            userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
            userMessageStatus = "alertBad";
        } else {
            if (result[0].mdp == req.body.MDP) {
                //message de succes pour une combinaison de nom d'utilisateur et mot de passe correcte
                userMessageText = "Combinaison du nom d'utilisateur et mot de passe correcte!";
                userMessageStatus = "alertGood";
            } else {
                //message d'erreur pour un mot de passe incorrect
                userMessageText = "Combinaison du nom d'utilisateur et mot de passe incorrecte!";
                userMessageStatus = "alertBad";
            }
        }
        //afficher le message a l'utilisateur
        userMessageArray = [userMessageText, userMessageStatus];
        res.render('pages/login.ejs', { login: "active", accueil: "", creationCompte: "", produit: "", items: userMessageArray });
        res.end();
    });
});

//methode http chargee de la route /creerCompte
app.get('/creerUnCompte', function (req, res) {
    //active le lien vers la page de creation du compte et desactive tous les autres liens
    res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "" });
});

//methode qui se charge d'envoyer les informations necessaires pour la creation d'un compte
//vers la BD en s'assurant que ces entrées sont acceptables (select & insert)
app.post('/creerUnCompte', function (req, res) {
    var userMessageText = "";
    var userMessageStatus = "";

    var resultTest = 0; //initialisation du premier ID a 0 si necessaire

    if (!checkAllFieldsEmpty(req)) {
        connection.query("SELECT * from panier ORDER BY id_panier DESC LIMIT 1", function (err, result) {
            if (typeof result[0] != 'undefined') { //chercher le plus gros ID s'il existe pour iterer dessus
                resultTest = result[0].id_panier;
                resultTest++;
            }

            //verifier si le username existe deja si non, inserer les données de l'utilisateur dans la BD
            connection.query("SELECT compte_client_nom_utilisateur from panier WHERE compte_client_nom_utilisateur = '" + req.body.username.trim() + "'", function (err, result) {
                if (typeof result[0] != 'undefined') {
                    //message d'erreur pour un nom d'utilsateur deja pris
                    userMessageText = "Nom d'utilisateur utilisé";
                    userMessageStatus = "alertBad";
                    userMessageArray = [userMessageText, userMessageStatus]; //console.log(userMessageArray);
                    //afficher le message a l'utilisateur
                    res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", items: userMessageArray });
                    res.end()
                } else {
                    connection.query("INSERT INTO panier (id_panier, compte_client_nom_utilisateur) VALUES ( " + resultTest + "," + " '" + req.body.username.trim() + "')", function (err, result) {
                        if (err) {
                            //message d'erreur pour un si il y a une erreur au niveau du sql
                            //(primary key ou autre) lors de l'insertion dans la table panier
                            userMessageText = "Problème lors de l'insertion dans la bd (panier)";
                            userMessageStatus = "alertBad";
                            userMessageArray = [userMessageText, userMessageStatus]; //console.log(userMessageArray);
                            //afficher le message a l'utilisateur
                            res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", items: userMessageArray });
                            res.end()
                        }
                        connection.query("INSERT INTO compte_client (nom_utilisateur, mdp, prenom, nom ,email, adresse, panier_id_panier) VALUES ( '" + req.body.username + "', '" + req.body.passwordUser + "', '" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.adresse + "', " + resultTest + ")", function (err, result) {
                            if (err) {
                                //message d'erreur pour un si il y a une erreur au niveau du sql
                                //(primary key ou autre) lors de l'insertion dans la table compte_client
                                userMessageText = "Problème lors de l'insertion dans la bd (compte_client)";
                                userMessageStatus = "alertBad";
                                userMessageArray = [userMessageText, userMessageStatus]; //console.log(userMessageArray);
                                //afficher le message a l'utilisateur
                                res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", items: userMessageArray });
                                res.end()
                            } else {
                                //message de succes pour un compte creer
                                userMessageText = "Compte Créer avec succès!";
                                userMessageStatus = "alertGood";
                                userMessageArray = [userMessageText, userMessageStatus]; //console.log(userMessageArray);
                                //afficher le message a l'utilisateur
                                res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", items: userMessageArray });
                                res.end()
                            }
                        });
                    });
                }
            });
        });
    } else {
        //message d'erreur pour une entree obligatoire manquante
        userMessageText = "Entrée obligatoire manquante!";
        userMessageStatus = "alertBad";
        userMessageArray = [userMessageText, userMessageStatus]; //console.log(userMessageArray);
        res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", items: userMessageArray });
        res.end()
    }
});

function checkAllFieldsEmpty(req) {
    var missingAmount = 0;

    missingAmount += checkOneFieldEmpty(req.body.username);
    missingAmount += checkOneFieldEmpty(req.body.passwordUser);
    missingAmount += checkOneFieldEmpty(req.body.fname);
    missingAmount += checkOneFieldEmpty(req.body.lname);
    missingAmount += checkOneFieldEmpty(req.body.email);
    missingAmount += checkOneFieldEmpty(req.body.adresse);

    return Boolean(missingAmount);
}

function checkOneFieldEmpty(fieldToCheck) {
    if (fieldToCheck.trim() == "") {
        return 1;
    }
    return 0;
}

//methode http chargee de la route /unProduit
app.get('/produit/:id', function (req, res) {
    connection.query("SELECT p.id_produit, p.*, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque where p.id_produit =" + req.params.id + ";",
        function (err, resultat) {
            if (resultat.length == 0) {
                console.log("produit non trouvable");
                res.writeHeader(200, { 'Content-Type': 'text/html ; charset=UTF-8' });
                res.write("<html><body><script>alert('produit non trouvable'); window.location = 'http://localhost:2000/';</script></body></html>");
            } else {
                connection.query("SELECT p.*, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque where p.marques_id_marque ="+resultat[0].marques_id_marque+" and p.id_produit !="+resultat[0].id_produit+";", function (err, result) {
                    res.render('pages/unProduit.ejs', { login: "", accueil: "", creationCompte: "", produit: "active", produit: resultat[0],produitsDeMemeMarque:result})
                });
            };
        });
});

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
            res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", produits: resultat });
        });
    //on active le lien vers la page des produits et desactive tous les autres liens
});

var serveur = app.listen(2000, function () {
    console.log("serveur fonctionne sur 2000... ! ");
});