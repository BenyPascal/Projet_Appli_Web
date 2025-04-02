export interface Produit {
    idProduit: number;
    nomProduit: string;
    categorie: string;
    conditionnement: number;
    prixAchatHt?: number;
    tva?: number;
    prixVenteTtc?: number;
    margeTotale?: number;
  }

  export interface Stock {
    idStock: number;
    quantiteDisponible: number;
    quantiteVoulue: number;
    produit: Produit;
  }