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
    private Product product;

    private Integer quantite;

    public Integer getIdAchat() { 
        return idAchat; 
    }
    
    public void setIdAchat(Integer idAchat) { 
        this.idAchat = idAchat; 
    }

    public Product getProduct() { 
        return product; 
    }
    
    public void setProduct(Product product) { 
        this.product = product; 
    }
    
    public Integer getQuantite() { 
        return quantite; 
    }
    
    public void setQuantite(Integer quantite) { 
        this.quantite = quantite; 
    }
}
