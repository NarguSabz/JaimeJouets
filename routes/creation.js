var express = require('express');
var mysql = require('mysql');
var router = express.Router();



//ajout d'une connection a la base de donnees
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "bdproto" });

//methode http chargee de la route /creerCompte
router.get('/', function (req, res) {
    //active le lien vers la page de creation du compte et desactive tous les autres liens
    res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "" });
});

//methode qui se charge d'envoyer les informations necessaires pour la creation d'un compte
//vers la BD en s'assurant que ces entrées sont acceptables (select & insert)
router.post('/', function (req, res) {

    var userMessageText = "";
    var userMessageStatus = "";

    var userUsername = req.body.username.toString().trim();
    var userPassword = req.body.passwordUser.toString().trim();
    var userFirstname = req.body.fname.toString().trim();
    var userLastname = req.body.lname.toString().trim();
    var userEmail = req.body.email.toString().trim();
    var userAddress = req.body.adresse.toString().trim();

    var resultTest = 0; //initialisation du premier ID a 0 si necessaire

    if (!checkAllFieldsEmpty(req)) {
        connection.query("SELECT * from panier ORDER BY id_panier DESC LIMIT 1", function (err, result) {
            if (typeof result[0] != 'undefined') { //chercher le plus gros ID s'il existe pour iterer dessus
                resultTest = result[0].id_panier;
                resultTest++;
            }

            //verifier si le username existe deja si non, inserer les données de l'utilisateur dans la BD
            connection.query("SELECT compte_client_nom_utilisateur from panier WHERE compte_client_nom_utilisateur = '" + userUsername + "'", function (err, result) {
                if (typeof result[0] != 'undefined') {
                    //message d'erreur pour un nom d'utilsateur deja pris
                    userMessageText = "Nom d'utilisateur utilisé";
                    userMessageStatus = "alertBad";
                    userMessageArray = [userMessageText, userMessageStatus]; //console.log(userMessageArray);
                    //afficher le message a l'utilisateur
                    res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "", items: userMessageArray });
                    res.end()
                } else {
                    connection.query("INSERT INTO panier (id_panier, compte_client_nom_utilisateur) VALUES ( " + resultTest + "," + " '" + userUsername + "')", function (err, result) {
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
                        connection.query("INSERT INTO compte_client (nom_utilisateur, mdp, prenom, nom ,email, adresse, panier_id_panier) VALUES ( '" + userUsername + "', '" + userPassword + "', '" + userFirstname + "', '" + userLastname + "', '" + userEmail + "', '" + userAddress + "', " + resultTest + ")", function (err, result) {
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

module.exports = router;