

class Panier {
    constructor() {
        this.data = {};
        this.data.produits = [];
        this.data.totals = 0;
        this.data.formattedTotals = '';
     }
    ajouterAuPanier(produit = null, qty = 1) {
        if(!this.produitExist(produit.id,qty)) {
            let prod = {
                id: produit.id,
                nom: produit.nom,
                prix: produit.prix,
                qty: qty,
                image: produit.image,
              };
            this.data.produits.push(prod);
            this.calculateTotals();
        }
    }
    calculateTotals(){
        this.data.totals = 0;
    this.data.produits.forEach(item => {
        let prix = item.prix;
        let qty = item.qty;
        let somme = prix * qty;

        this.data.totals += somme;
    });  
    this.setFormattedTotals();
    }
    setFormattedTotals() {
        let format = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'CAD' });
        let totals = this.data.totals;
        this.data.formattedTotals = format.format(totals);
    }
    enleverProduit(id){
        for(let i = 0; i < this.data.produits.length; i++) {
            let item = this.data.produits[i];
            if(item.id == id) {
                this.data.produits.splice(i, 1);
                console.log(this.data.produits);
                this.calculateTotals();
            }
        }
    }

     produitExist(produitID = 0,qty) {
        let trouvee = false;
        this.data.produits.forEach(item => {
           if(item.id === produitID) {
            item.qty = Number(item.qty) + Number(qty);
               this.calculateTotals();
            trouvee = true;
           }
        });
        return trouvee;
    }
}

module.exports = new Panier();