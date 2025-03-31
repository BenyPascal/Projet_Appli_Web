package com.stockfoy.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Stocks")
public class Stock {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idStock;

    @ManyToOne
    @JoinColumn(name = "idProduct")
    private Product produit;

    private Integer quantiteDisponible;
    
    private Integer quantiteVoulue;
}
