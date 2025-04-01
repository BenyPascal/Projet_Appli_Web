package com.stockfoy.demo.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "Produits")
public class Produit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProduit;

    private String nomProduit;

    private String categorie;

    private Float conditionnement;

    private Float prix_HT;

    private Float tva;

    private Float prix_vente_TTC;

    private Float marge_totale;

    public Produit(){
    }

    public Integer getidProduit() { 
        return idProduit; 
    }

    public void setidProduit(Integer idProduit) { 
        this.idProduit = idProduit; 
    }

    public String getNomProduit() { 
        return nomProduit; 
    }

    public void setNomProduit(String nomProduit) { 
        this.nomProduit = nomProduit; 
    }
    
    public String getCategorie() { 
        return categorie; 
    }

    public void setCategorie(String categorie) { 
        this.categorie = categorie; 
    }
    
    public Float getConditionnement() { 
        return conditionnement; 
    }

    public void setConditionnement(Float conditionnement) { 
        this.conditionnement = conditionnement; 
    }

    public Float getPrixAchatHt() { 
        return prix_HT; 
    }

    public void setPrixAchatHt(Float prixAchatHt) { 
        this.prix_HT = prixAchatHt; 
    }

    public Float getTva() { 
        return tva; 
    }

    public void setTva(Float tva) { 
        this.tva = tva; 
    }

    public Float getPrixVenteTtc() { 
        return prix_vente_TTC; 
    }

    public void setPrixVenteTtc(Float prix_vente_TTC) { 
        this.prix_vente_TTC = prix_vente_TTC; 
    }

    public Float getMargeTotale() { 
        return marge_totale; 
    }

    public void setMargeTotale(Float marge_totale) { 
        this.marge_totale = marge_totale; 
    }
}
