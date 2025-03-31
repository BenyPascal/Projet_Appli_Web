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
    private Product produit;

    private Integer quantite;

}
