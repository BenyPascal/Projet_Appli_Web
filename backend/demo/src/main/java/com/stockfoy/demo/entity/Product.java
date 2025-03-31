package com.stockfoy.demo.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "Products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduct;

    private String nomProduit;

    private String categorie;

    private Float conditionnement;

    private Float prix_HT;

    private Float tva;

    private Float prix_vente_TTC;

    private Float marge_totale;


}
