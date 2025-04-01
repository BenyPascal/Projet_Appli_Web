package com.stockfoy.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Stocks")
public class Stock {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idStock;

    @ManyToOne
    @JoinColumn(name = "idProduit")
    private Produit produit;

    private Integer quantiteDisponible;

    private Integer quantiteVoulue;

    public Integer getIdStock() { 
        return idStock; 
    }

    public void setIdStock(Integer idStock) { 
        this.idStock = idStock; 
    }

    public Produit getProduit() { 
        return produit; 
    }

    public void setProduit(Produit produit) { 
        this.produit = produit; 
    }

    public Integer getQuantiteDisponible() {
        return quantiteDisponible; 
    }
    
    public void setQuantiteDisponible(Integer quantiteDisponible) { 
        this.quantiteDisponible = quantiteDisponible; 
    }

    public Integer getQuantiteVoulue() { 
        return quantiteVoulue; 
    }

    public void setQuantiteVoulue(Integer quantiteVoulue) { 
        this.quantiteVoulue = quantiteVoulue; 
    }
}
