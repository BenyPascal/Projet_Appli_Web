package com.stockfoy.demo.entity;

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
}
