export interface Produit {
    idProduit: number;
    nomProduit: string;
    categorieProduit: CategorieProduit;
    conditionnement: number;
    prixAchatHt?: number;
    tva?: number;
    prixVenteTtc: number;
    margeTotale?: number;
    quantiteVoulue?: number;
  }

  export interface Stock {
    idStock: number;
    quantiteDisponible: number;
    quantiteVoulue: number;
    produit: Produit;
  }

  export interface Courses {
    idListeCourse: number;
    quantiteStock: number;
    quantiteNecessaire: number;
    produit: Produit;
  }

  export interface Facture {
    id: number;
    fileName: string;
    fileUrl: string;
    issueDate: string;
    supplier?: string;
    totalAmount?: number;
    uploadedAt?: string;
}

export interface CategorieProduit {
  idCategorie: number;
  nom: string;
}