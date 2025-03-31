package com.stockfoy.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Stocks")
public class Stock {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idStock;

    @ManyToOne
    @JoinColumn(name = "idProduct")
    private Product product;

    private Integer quantiteDisponible;

    private Integer quantiteVoulue;

    public Integer getIdStock() { 
        return idStock; 
    }

    public void setIdStock(Integer idStock) { 
        this.idStock = idStock; 
    }

    public Product getProduct() { 
        return product; 
    }

    public void setProduct(Product product) { 
        this.product = product; 
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
