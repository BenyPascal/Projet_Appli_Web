export interface Produit {
    idProduit: number;
    nomProduit: string;
    categorie: string;
    conditionnement: string;
    prixAchatHt?: number;
    tva?: number;
    prixVenteTtc?: number;
    margeTotale?: number;
  }