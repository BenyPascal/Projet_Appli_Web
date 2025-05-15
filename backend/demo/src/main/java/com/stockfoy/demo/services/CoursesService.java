package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Courses;
import com.stockfoy.demo.repository.CoursesRepository;
import org.springframework.stereotype.Service;
import com.stockfoy.demo.entity.Produit;
import com.stockfoy.demo.entity.Stock;
import com.stockfoy.demo.repository.ProduitRepository;
import com.stockfoy.demo.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.ArrayList;

import java.util.List;

@Service
public class CoursesService {
    @Autowired private ProduitRepository produitRepository;
    @Autowired private StockRepository stockRepository;
    @Autowired private CoursesRepository listeCourseRepository;

    public List<Courses> getAllCourses() {
        return listeCourseRepository.findAll();
    }
    
    public List<Courses> genererListeCourses() {
        List<Produit> produits = produitRepository.findAll();
        List<Courses> listeCourses = new ArrayList<>();

        for (Produit produit : produits) {
            Stock stock = stockRepository.findByProduit(produit);
            if (stock == null) continue;

            int quantiteDisponible = stock.getQuantiteDisponible() != null ? stock.getQuantiteDisponible() : 0;
            int quantiteVoulue = stock.getQuantiteVoulue() != null ? stock.getQuantiteVoulue() : 0;

            if (quantiteDisponible < quantiteVoulue) {
                float conditionnement = produit.getConditionnement();
                int manque = quantiteVoulue - quantiteDisponible;
                int paquets = (int) Math.ceil((double) manque / conditionnement);
                float aAcheter = paquets * conditionnement;

                Courses ligne = new Courses();
                ligne.setProduit(produit);
                ligne.setQuantiteStock(quantiteDisponible);
                ligne.setQuantiteNecessaire(aAcheter);

                listeCourses.add(listeCourseRepository.save(ligne));
            }
        }
        return listeCourses;
    }
}