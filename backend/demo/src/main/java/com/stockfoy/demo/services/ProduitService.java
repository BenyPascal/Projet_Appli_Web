package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Produit;
import com.stockfoy.demo.entity.HistoriquePrix;
import com.stockfoy.demo.repository.ProduitRepository;
import com.stockfoy.demo.repository.HistoriquePrixRepository;

import java.util.List;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProduitService {
    private final ProduitRepository produitRepository;

    @Autowired
    private StockService stockService;
    
    @Autowired
    private HistoriquePrixRepository historiquePrixRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public List<Produit> findAll() {
        return produitRepository.findAll();
    }

    public Produit save(Produit produit) {
        Produit savedProduit = produitRepository.save(produit);

        stockService.createInitialStock(savedProduit);
        
        HistoriquePrix historiquePrix = new HistoriquePrix();
        historiquePrix.setProduit(savedProduit);
        historiquePrix.setPrix(savedProduit.getPrixVenteTtc());
        historiquePrix.setDateDebut(LocalDate.now());
        historiquePrixRepository.save(historiquePrix);
        
        return savedProduit;
    }
}