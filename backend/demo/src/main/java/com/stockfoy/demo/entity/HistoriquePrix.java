package com.stockfoy.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "historique_prix")
public class HistoriquePrix {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHistoriquePrix;

    @ManyToOne
    @JoinColumn(name = "id_produit")
    private Produit produit;

    private Float prix;
    private LocalDate dateDebut;
    private LocalDate dateFin;

    // Getters et setters
    public Integer getIdHistoriquePrix() {
        return idHistoriquePrix;
    }

    public void setIdHistoriquePrix(Integer id) {
        this.idHistoriquePrix = id;
    }

    public Produit getProduit() {
        return produit;
    }

    public void setProduit(Produit produit) {
        this.produit = produit;
    }

    public Float getPrix() {
        return prix;
    }

    public void setPrix(Float prix) {
        this.prix = prix;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
}