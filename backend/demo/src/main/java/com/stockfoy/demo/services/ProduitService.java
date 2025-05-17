package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Produit;
import com.stockfoy.demo.repository.ProduitRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProduitService {
    private final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public List<Produit> findAll() {
        return produitRepository.findAll();
    }

    @Autowired
    private StockService stockService;

    public Produit save(Produit produit) {

        Produit savedProduit = produitRepository.save(produit);

        stockService.createInitialStock(savedProduit);
        return savedProduit;
    }
}