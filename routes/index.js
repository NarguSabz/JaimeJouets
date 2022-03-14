var express = require('express');

var mysql = require('mysql');
var router = express.Router();


//methode http chargee de la route /accueil
router.get('/', function (req, res) {
    //query permettant d aller chercher les 8 les plus recents produits, dans la base de donnees mybd, puis on passe le resultat dans le variable produits
    connection.query("SELECT p.id_produit, p.nom, p.description, p.date_parution, p.prix, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque order by p.date_parution desc,p.id_produit ASC limit 8;",
        function (err, resultat) { res.render('pages/index.ejs', { login: "", accueil: "active", creationCompte: "", produit: "", produits: resultat }); });
    //on active egalement le lien vers la page d accueil et desactive tous les autres liens
});

module.exports = router;