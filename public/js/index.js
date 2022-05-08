

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
    try {

        document.getElementById("selectorNombrePage").value = document.getElementById("selectorNombrePage").dataset.nbrePage;
        document.getElementById("selectorPrix").value = document.getElementById("selectorPrix").dataset.prix;
        console.log(document.getElementById("selectorPrix").value);
        var filtre = document.getElementById("aside").dataset.filtre;
        var filtres = document.forms[1];
        for (i = 0; i < filtres.length; i++) {
            console.log(filtres[i].value == filtre + filtre)

            if (filtres[i].value == filtre) {
                $('#' + filtres[i].id).prop('checked', true);
            }
        }
    } catch { }

    document.getElementById("progres5").style.width = document.getElementById("progres5").dataset.progres + "%";
    document.getElementById("progres4").style.width = document.getElementById("progres4").dataset.progres + "%";
    document.getElementById("progres3").style.width = document.getElementById("progres3").dataset.progres + "%";
    document.getElementById("progres2").style.width = document.getElementById("progres2").dataset.progres + "%";
    document.getElementById("progres1").style.width = document.getElementById("progres1").dataset.progres + "%";

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
            if (element2.firstChild != null) {

                while (element2.firstChild) {
                    element2.removeChild(element2.firstChild);
                }
                // document.getElementById("panier").innerHTML = '';

            } element2.insertAdjacentHTML("afterBegin", text);

        });
        if(window.location =='http://localhost:2000/commander'){
        fetch('/commander', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (reponse) {
            reponse.text().then(function (text) {
                if (text.includes('vide')) {
                    var g = document.createElement('script');
                    var s = document.getElementsByTagName('script')[0];
                    g.text = "alert('votre panier est vide!'); window.location = 'http://localhost:2000/';"
                    s.parentNode.insertBefore(g, s);

                } else {
                    const element3 = document.querySelector('.order-summary');
                    if (element3.firstChild != null) {

                        while (element3.firstChild) {
                            element3.removeChild(element3.firstChild);
                        }
                        // document.getElementById("panier").innerHTML = '';

                    } element3.insertAdjacentHTML("afterBegin", text);

                    const element = document.getElementsByClassName('order-summary').item(0);
                    checkout = document.getElementById("checkout").innerHTML;
                    if (element.firstChild != null) {

                        while (element.firstChild) {
                            element.removeChild(element.firstChild);
                        }
                        // document.getElementById("panier").innerHTML = '';

                    } element.insertAdjacentHTML("afterBegin", checkout);
                }
            });
        });}
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
function jqueryAjax() {
    $('.qty-down').on('click', function () {
        console.log('kk');

        var value = parseInt($(this).parent().find('input[type="number"]').val()) - 1;
        value = value < 1 ? 1 : value;
        $(this).parent().find('input[type="number"]').val(value);
        //	$input.trigger('mouseup');

        $(this).parent().find('input[type="number"]').trigger('change');
        //$input.change();
        //updatePriceSlider($(this), value)
    })

    $('.qty-up').on('click', function () {
        var value = parseInt($(this).parent().find('input[type="number"]').val()) + 1;
        $(this).parent().find('input[type="number"]').val(value);
        //$input.trigger('mouseup');
        $(this).parent().find('input[type="number"]').trigger('change');
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
            document.getElementById("sousTotal2").innerHTML = document.getElementById("sousTotal").dataset.sous;
        });
    });
}

/*function mettreAJour() {

    /*if (document.getElementById("marqueRecherche").dataset.recherche == "false") {
        filtrer();
    } else {
        filtrer();*/

/* fetch('/rechercher?nbrePage=' + nbreParPage + "&q=" + document.getElementById("marqueRecherche").dataset.query + "&marque=" + document.getElementById("marqueRecherche").dataset.marque, {

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
 });*/


function soumettre() {
    document.getElementById("nbrePage").value = document.getElementById("selectorNombrePage").value;
    document.getElementById("filtrePrix").value = document.getElementById("selectorPrix").value;
    console.log(document.getElementById("filtrePrix").value + 'lll');
}
/*window.onload = (event) => {
    document.getElementById("selectorNombrePage").value = document.getElementById("selectorNombrePage").dataset.nbrePage;
    console.log(document.getElementById("selectorNombrePage").dataset.nbrePage+"lkl");  
};*/

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

function filtrer() {

    var filtres = document.forms[1];
    var filtresJson = { marque: [], categorie: [], prix: [], evaluation: [] };

    for (i = 0; i < filtres.length; i++) {
        if (filtres[i].checked) {
            if (filtres[i].name == "evaluation") {
                var nom = filtres[i].name;
                filtresJson[nom].push(Number(filtres[i].value));
            } else {
                var nom = filtres[i].name;
                filtresJson[nom].push(filtres[i].value);
            }
        } else if (filtres[i].name == "prix") {
            var nom = filtres[i].name;
            filtresJson[nom].push(filtres[i].value);
        }

    }
    if (filtresJson.evaluation.length != 0) {
        console.log(filtresJson.evaluation)
        filtresJson.evaluation = [Math.min.apply(Math, filtresJson.evaluation)];
    }

    const params = {
        filtres: filtresJson,
        nbrePage: document.getElementById("selectorNombrePage").value,
        q: document.getElementById("marqueRecherche").dataset.query,
        filtrePrix: document.getElementById("selectorPrix").value
    }
    console.log(filtresJson);
    fetch('/filtrer', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(params)

    }).then(function (response) {
        response.text().then(function (text) {
            document.getElementById("conteneur").innerHTML = text;
            document.getElementById("conteneur").innerHTML = document.getElementById("conteneurProd").innerHTML;
        });
    });
}
function changerPageDroite(d) {

    nbrePage = document.getElementById("droite").dataset.page;
    if (Number(nbrePage) > Number(d)) {
        document.getElementById("droite").setAttribute('href', '#tab' + (Number(d) + 1));
        document.getElementById("droite").value = (Number(d) + 1);

        document.getElementById("gauche").setAttribute('href', '#tab' + (Number(d) + 1));
        document.getElementById("gauche").value = (Number(d) + 1);
    } if (Number(nbrePage) - 1 == Number(d)) {
        document.getElementById("droite").style.visibility = "hidden";
    } if (Number(d) == 1) {
        document.getElementById("gauche").style.visibility = "visible";

    }
}
function changerPageGauche(d) {

    nbrePage = document.getElementById("droite").dataset.page;
    if (Number(d) >= 2) {
        document.getElementById("droite").setAttribute('href', '#tab' + (Number(d)) - 1);
        document.getElementById("droite").value = (Number(d) - 1);
        document.getElementById("gauche").setAttribute('href', '#tab' + (Number(d) - 1));
        document.getElementById("gauche").value = (Number(d) - 1);
    } if (Number(d) == 2) {
        document.getElementById("gauche").style.visibility = "hidden";
    } if (Number(d) == Number(nbrePage)) {
        document.getElementById("droite").style.visibility = "visible";

    }
}
function changerPage2(d) {
    nbrePage = document.getElementById("droite").dataset.page;
    document.getElementById("droite").setAttribute('href', '#tab' + (Number(d)));
    document.getElementById("droite").value = (Number(d));
    document.getElementById("gauche").setAttribute('href', '#tab' + (Number(d)));
    document.getElementById("gauche").value = (Number(d));
    if (Number(d) < Number(nbrePage)) {
        document.getElementById("droite").style.visibility = "visible";
    } else {
        document.getElementById("droite").style.visibility = "hidden";
    } if (Number(d) > 1) {
        document.getElementById("gauche").style.visibility = "visible";
    } else {
        document.getElementById("gauche").style.visibility = "hidden";
    }
}




