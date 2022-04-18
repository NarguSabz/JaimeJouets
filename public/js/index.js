
var rechercher = false;
var marque = "";
var q = "";

function showResult(str, marque) {

    if (str.length == 0) {
        document.getElementById("livesearch").innerHTML = "";
        document.getElementById("livesearch").style.border = "0px";
        document.getElementById("layer").style.display = "none";
        return;
    }
    fetch('/rechercherSuggestions?q=' + str + "&marque=" + marque, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        response.text().then(function (text) {
            document.getElementById("livesearch").innerHTML = text;
            document.getElementById("layer").style = "position: fixed; display: block; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 99; cursor: pointer;"
            document.getElementsByClassName("livesearch").style = "background-color:white;";

        })
    })

}
function ajoutAuPanier(nom, image, id, prix, qty = 1) {
    var produit = { nom: nom, image: image, id: id, prix: prix };
    const params = {
        produit: produit,
        qty: qty

    }
    fetch('/panier/ajouterPanier', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        }, body: JSON.stringify(params)
    });

    fetch('/panier/quickview', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        response.text().then(function (text) {

            document.getElementById("panier").innerHTML = text;
        });
    });
}
document.getElementById("body").onload = onPageReloud();
function onPageReloud() {
    fetch('/panier/quickview', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        response.text().then(function (text) {

            document.getElementById("panier").innerHTML = text;

        });
    });
}
function enlever(id) {
    fetch('/panier/enlever/' + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        response.text().then(function (text) {

            document.getElementById("panier").innerHTML = text;

        });
    });

}

function enleverPage(id) {
        fetch('/panier/enlever/' + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        response.text().then(function (text1) {

            fetch('/panier', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                response.text().then(function (text) {
                    document.getElementById("pagePanier").innerHTML = text;
                    document.getElementById("panier").innerHTML = text1;


                });
            });


        });
    });
}
function ajouterQuantite(id,qty = 1) {
    fetch('/panier/ajouterQuantite/' + id+"/"+qty, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}).then(function (response) {
    response.text().then(function (text1) {

                document.getElementById("panier").innerHTML = text1;
    });
});
}
function mettreAJour(nbreParPage){

    if(document.getElementById("marqueRecherche").dataset.recherche == "false"){    

        fetch('/produits?nbre=' + nbreParPage , {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            response.text().then(function (text) {
                document.getElementById("conteneur").innerHTML = text;
                document.getElementById("conteneur").innerHTML = document.getElementById("conteneurProd").innerHTML ;
    
            });
        });
    }else{
        
    fetch('/rechercher?nbrePage=' + nbreParPage +"&q="+document.getElementById("marqueRecherche").dataset.query+"&marque="+document.getElementById("marqueRecherche").dataset.marque, {
        
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        response.text().then(function (text) {
           document.getElementById("conteneur").innerHTML = text;
            document.getElementById("conteneur").innerHTML = document.getElementById("conteneurProd").innerHTML ;

        });
    });}
}
function soumettre(){
    document.getElementById("nbrePage").value = document.getElementById("selectorNombrePage").value;

}
window.onload = (event) => {
    document.getElementById("selectorNombrePage").value = document.getElementById("selectorNombrePage").dataset.nbrePage ;
    console.log( document.getElementById("selectorNombrePage").dataset.nbrePage); 

  };


  
