'use strict';


class Panier {
    
    static ajouterAuPanier(produit = null, qty = 1,panier) {
        if(!this.produitExist(produit.id,qty,panier)) {
            let prod = {
                id: produit.id,
                nom: produit.nom,
                prix: produit.prix,
                qty: qty,
                image: produit.image,
              };
            panier.produits.push(prod);
            this.calculateTotals(panier);
        }
    }
    static calculateTotals(panier){
        panier.totals = 0;
        panier.produits.forEach(item => {
            let prix = item.prix;
            let qty = item.qty;
            let somme = prix * qty;

            panier.totals += somme;
        });
        panier.TPS=(panier.totals*5)/100;
        panier.TVQ= (panier.totals*9.975)/100;
        panier.formattedSousTotals= this.formattedTotals(panier.totals);
        panier.formattedTotals= this.formattedTotals(panier.totals+panier.TPS+panier.TVQ);
    }

    static calculateRabais(panier, rabais){
        panier.totals = 0;
        panier.produits.forEach(item => {
            let prix = item.prix;
            let qty = item.qty;
            let somme = prix * qty;

            panier.totals += somme;
        });
        var rabaisEnDollards = (panier.totals * rabais/100)
        panier.TPS=(panier.totals*5)/100;
        panier.TVQ= (panier.totals*9.975)/100;
        panier.formattedSousTotals= this.formattedTotals(panier.totals - rabaisEnDollards);
        panier.formattedTotals= this.formattedTotals(panier.totals-rabaisEnDollards+panier.TPS+panier.TVQ);
    }
    
    static formattedTotals(totalAFormatee) {
        let format = new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD' });
        return format.format(totalAFormatee);;
    }
    static enleverProduit(id,panier){
        for(let i = 0; i < panier.produits.length; i++) {
            let item = panier.produits[i];
            if(item.id == id) {
                panier.produits.splice(i, 1);
                this.calculateTotals(panier);
            }
        }
    }

    static ajouterQuantite(id, qty,panier){
        for(let i = 0; i < panier.produits.length; i++) {
            let item = panier.produits[i];
            if(item.id == id) { 
                panier.produits[i].qty = qty;
                this.calculateTotals(panier);
            }
        }

    }
    static produitExist(produitID = 0,qty,panier) {
        let trouvee = false;
        panier.produits.forEach(item => {
           if(item.id === produitID) {
            item.qty = Number(item.qty) + Number(qty);
               this.calculateTotals(panier);
            trouvee = true;
           }
        });
        return trouvee;
    }
}

module.exports = Panier;