package com.stockfoy.demo.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;


@Entity
@Table(name = "Achats")
public class Achat {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAchat;

    @ManyToOne
    @JoinColumn(name = "idProduit")
    private Produit produit;

    private Integer quantite;
    private Float prixUnitaire;
    private Float prixTotal;

    public Integer getIdAchat() { 
        return idAchat; 
    }

    public void setIdAchat(Integer idAchat) { 
        this.idAchat = idAchat; 
    }

    public Produit getProduit() { 
        return produit; 
    }

    public void setProduit(Produit produit) { 
        this.produit = produit; 
    }

    public Integer getQuantite() { 
        return quantite; 
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Float getPrixUnitaire() {
        return prixUnitaire; 
    }

    public void setPrixUnitaire(Float prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }

    public Float getPrixTotal() { 
        return prixTotal; 
    }

    public void setPrixTotal(Float prixTotal) { 
        this.prixTotal = prixTotal; 
    }

}
