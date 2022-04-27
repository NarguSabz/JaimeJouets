var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();

//methode http chargee de la route /unProduit
router.get('/:id', function (req, res) {
  sess = req.session;
  //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits et de aller chercher les 8 les plus recents produits, dans la base de donnees
  var collection = db.get('produits');

  collection.aggregate([
    {
      $lookup:
      {
        from: 'categories',
        localField: 'categories_id',
        foreignField: 'numid',
        as: 'categories_id'
      }

    },
    {
      $lookup:
      {
        from: "marques",
        localField: "marques_id",
        foreignField: "numid",
        as: "marques_id"
      }
    }, {
      $lookup:
      {
        from: "commentaires",
        localField: "numid",
        foreignField: "produits_id",
        as: "commentaire"
      }
    }, { $match: { 'numid': req.params.id } }
  ], function (err, resultat) {
    if (err) throw err;
    if (resultat.length == 0) {
      console.log("produit non trouvable");
      res.writeHeader(200, { 'Content-Type': 'text/html ; charset=UTF-8' });
      res.write("<html><body><script>alert('produit non trouvable'); window.location = 'http://localhost:2000/';</script></body></html>");
    } else {
      collection.aggregate([
        {
          $lookup:
          {
            from: 'categories',
            localField: 'categories_id',
            foreignField: 'numid',
            as: 'categories_id'
          }

        },
        {
          $lookup:
          {
            from: "marques",
            localField: "marques_id",
            foreignField: "numid",
            as: "marques_id"
          }
        }, { $match: { 'marques_id': resultat[0].marques_id, 'numid': { $ne: resultat[0].numid } } }
      ], function (err, result) {
        //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
        var nbreDeVingts = parseInt(resultat[0]['commentaire'].length / Number(3));
        var nbreDePages;
        if (resultat[0]['commentaire'].length % Number(3) > 0) {
          nbreDePages = nbreDeVingts + 1;
        } else {
          nbreDePages = nbreDeVingts;
        }
        var sommedeno = 0;
        for (var i = 1; i <= 5; i++) {
          sommedeno += Number(resultat[0]['evaluations'][i]);
        }
        var utilisateur = sess.username;


        res.render('pages/unProduit.ejs', { sommeTotal: sommedeno, average: resultat[0]['moyen'], nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", produit: "active", propos: "", produit: resultat[0], produitsDeMemeMarque: result, recherche: "", username: utilisateur, nbreParPage: 9, recherche: false, marque: req.query.marque, q: req.query.q })
      });
    };
    //on active egalement le lien vers la page d accueil et desactive tous les autres liens         
  });
});
router.post('/:id/commenter', function (req, res) {
  sess = req.session;

  //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits et de aller chercher les 8 les plus recents produits, dans la base de donnees
  var nom = req.body.nom;
  var courriel = req.body.courriel;
  var comment = req.body.commentaire;
  var eval = req.body.rating;
  var ev = 'evaluations.' + eval;
  var options = {
    year: 'numeric', month: 'long', day: 'numeric', hour12: false,
    hour: "numeric",
    minute: "numeric"
  };
  var today = new Date();
  comment = { nom: nom, courriel: courriel, commentaire: comment, evaluation: eval, produits_id: req.params.id, date: today.toLocaleDateString("fr-FR", options) }
  var collection = db.get('commentaires');



  collection.insert(comment, function (err, res) {

    if (err) throw err;
    db.close();
  });

  var collection = db.get('produits');
  collection.find({ 'numid': req.params.id }, 'evaluations').then((docs) => {

    collection.update({ 'numid': req.params.id }, {
      $set: {
        [ev]: Number(docs[0].evaluations[eval]) + 1
      }
    }).then((updatedDoc) => {
      collection.find({ 'numid': req.params.id }, 'evaluations').then((produit) => {
      var somme = 0;
      var sommedeno = 0;
      for (var i = 1; i <= 5; i++) {
        somme += Number(produit[0].evaluations[i]) * i;
        sommedeno += Number(produit[0].evaluations[i]);
      } 

      collection.update({ 'numid': req.params.id }, {
        $set: {
          moyen: (somme / sommedeno).toFixed(1)
        }
      }).then((updatedDoc) => {
  
        db.close();
        res.redirect('/produit/' + req.params.id)
      });
    });
  });
});

  //on active egalement le lien vers la page d accueil et desactive tous les autres liens         
});

module.exports = router;