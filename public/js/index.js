
var rechercher = false;
var marque = "";
var q = "";

function showResult(str, marque) {

    if (str.length == 0) {
        //document.getElementById("livesearch").outerHTML = "";
        const element2 = document.querySelector('#livesearch');
        if (element2.firstChild != null) {
            while (element2.firstChild) {
                element2.removeChild(element2.firstChild);
            }
        } element2.insertAdjacentHTML("afterBegin", '');
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
            // const element = document.querySelector('#livesearch');
            const element2 = document.querySelector('#livesearch');
            if (element2.firstChild != null) {
                while (element2.firstChild) {
                    element2.removeChild(element2.firstChild);
                }
            } element2.insertAdjacentHTML("afterBegin", text);
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

            //document.getElementById("panier").innerHTML = text;
            const element2 = document.querySelector('#panier');
            if (element2.firstChild != null) {
                while (element2.firstChild) {
                    element2.removeChild(element2.firstChild);
                }

                // document.getElementById("panier").innerHTML = '';

            } element2.insertAdjacentHTML("afterBegin", text);
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
            //document.getElementById("panier").innerHTML = text;
            const element2 = document.querySelector('#panier');
            if (element2.firstChild != null) {
                while (element2.firstChild) {
                    element2.removeChild(element2.firstChild);
                }

                //document.getElementById("panier").innerHTML = '';

            } element2.insertAdjacentHTML("afterBegin", text);
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
            enleverPage(id);
            //document.getElementById("panier").outerHTML = text;
            const element2 = document.querySelector('#panier');
            console.log(element2);
            if (element2.firstChild != null) {

                while (element2.firstChild) {
                    element2.removeChild(element2.firstChild);
                }

                // document.getElementById("panier").innerHTML = '';

            } element2.insertAdjacentHTML("afterBegin", text);



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

                    const element = document.querySelector('#pagePanier').parentNode;
                    element.removeChild(element.firstChild);
                    element.insertAdjacentHTML("afterBegin", text);
                   
                    const element2 = document.querySelector('#panier');
                    if (element2.firstChild != null) {

                        while (element2.firstChild) {
                            element2.removeChild(element2.firstChild);
                        }

                        //document.getElementById("panier").innerHTML = '';

                    } element2.insertAdjacentHTML("afterBegin", text1);

                    jqueryAjax();

                });
            });


        });
    });
}
function jqueryAjax(){
    $('.qty-down').on('click', function () {
        console.log('kk');
    
    var value = parseInt($(this).parent().find('input[type="number"]').val()) - 1;
    value = value < 1 ? 1 : value;
    $(this).parent().find('input[type="number"]').val(value);
    //	$input.trigger('mouseup');
    
    $(this).parent().find('input[type="number"]').trigger( 'change' );
    //$input.change();
    //updatePriceSlider($(this), value)
    })
    
    $('.qty-up').on('click', function () {
    var value = parseInt($(this).parent().find('input[type="number"]').val()) + 1;
    $(this).parent().find('input[type="number"]').val(value);
    //$input.trigger('mouseup');
    $(this).parent().find('input[type="number"]').trigger( 'change' );
    //$input.change();
    //updatePriceSlider($this, value)
    })
}
function ajouterQuantite(id, qty = 1) {
    fetch('/panier/ajouterQuantite/' + id + "/" + qty, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        response.text().then(function (text) {
            const element2 = document.querySelector('#panier');
            if (element2.firstChild != null) {

                while (element2.firstChild) {
                    element2.removeChild(element2.firstChild);
                }

                // document.getElementById("panier").innerHTML = '';

            } element2.insertAdjacentHTML("afterBegin", text);

        });
    });
}

function mettreAJour(nbreParPage) {

    if (document.getElementById("marqueRecherche").dataset.recherche == "false") {

        fetch('/produits?nbre=' + nbreParPage, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            response.text().then(function (text) {
                document.getElementById("conteneur").innerHTML = text;
                document.getElementById("conteneur").innerHTML = document.getElementById("conteneurProd").innerHTML;


            });
        });
    } else {

        fetch('/rechercher?nbrePage=' + nbreParPage + "&q=" + document.getElementById("marqueRecherche").dataset.query + "&marque=" + document.getElementById("marqueRecherche").dataset.marque, {

            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            response.text().then(function (text) {
                document.getElementById("conteneur").innerHTML = text;
                document.getElementById("conteneur").innerHTML = document.getElementById("conteneurProd").innerHTML;

            });
        });
    }
}
function soumettre() {
    document.getElementById("nbrePage").value = document.getElementById("selectorNombrePage").value;

}
window.onload = (event) => {
    document.getElementById("selectorNombrePage").value = document.getElementById("selectorNombrePage").dataset.nbrePage;

};

window.addEventListener("beforeunload", function (evt) {
    const params = {
        typeDeconnexion: 'ajax',
    }
    fetch('/profil/deconnexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        }, body: JSON.stringify(params)
    });
});

function filtrer(){
    var filtres = document.forms[1];

 
    fetch('/filtrer?filtres=' + filtres, {

        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        response.text().then(function (text) {
            document.getElementById("conteneur").innerHTML = text;
            document.getElementById("conteneur").innerHTML = document.getElementById("conteneurProd").innerHTML;

        });
    });
}
   // document.getElementById("order").value = "You ordered a coffee with: " + txt;
  

