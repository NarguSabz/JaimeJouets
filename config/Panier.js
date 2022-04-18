

class Panier {
    constructor() {
        this.data = {};
        this.data.produits = [];
        this.data.totals = 0;
        this.data.TPS = 0;
        this.data.TVQ = 0;
        this.data.formattedSousTotals = '';
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
    this.data.TPS= (this.data.totals*5)/100;
    this.data.TVQ= (this.data.totals*9.975)/100;
    this.data.formattedSousTotals= this.formattedTotals(this.data.totals);
    this.data.formattedTotals= this.formattedTotals(this.data.totals+this.data.TPS+this.data.TVQ);
    }
    
    formattedTotals(totalAFormatee) {
        let format = new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD' });
        return format.format(totalAFormatee);;
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

    ajouterQuantite(id, qty){
        for(let i = 0; i < this.data.produits.length; i++) {
            let item = this.data.produits[i];
            if(item.id == id) { 
                this.data.produits[i].qty = qty;
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