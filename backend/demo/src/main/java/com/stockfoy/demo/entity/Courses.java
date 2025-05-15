package com.stockfoy.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Liste_Course")
public class Courses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idListeCourse;

    @ManyToOne
    @JoinColumn(name = "id_produit")
    private Produit produit;

    private Integer quantiteStock;
    private Float quantiteNecessaire;

    // Getters et Setters
    public Integer getIdListeCourse() { 
        return idListeCourse; 
    }

    public void setIdListeCourse(Integer idListeCourse) { 
        this.idListeCourse = idListeCourse; 
    }

    public Produit getProduit() { 
        return produit; 
    }

    public void setProduit(Produit produit) { 
        this.produit = produit; }
    public Integer getQuantiteStock() { return quantiteStock; 
    }

    public void setQuantiteStock(Integer quantiteStock) { 
        this.quantiteStock = quantiteStock; 
    }

    public Float getQuantiteNecessaire() { 
        return quantiteNecessaire; 
    }

    public void setQuantiteNecessaire(Float quantiteNecessaire) { 
        this.quantiteNecessaire = quantiteNecessaire; 
    }
}
