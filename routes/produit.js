var express = require('express');
var mysql = require('mysql');
var router = express.Router();

//ajout d'une connection a la base de donnees
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "bdproto" });

//methode http chargee de la route /unProduit
router.get('/produit/:id', function (req, res) {
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

module.exports = router;