package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Achat;
import com.stockfoy.demo.entity.Courses;
import com.stockfoy.demo.entity.Produit;
import com.stockfoy.demo.entity.Stock;
import com.stockfoy.demo.repository.AchatRepository;
import com.stockfoy.demo.repository.CoursesRepository;
import com.stockfoy.demo.repository.ProduitRepository;
import com.stockfoy.demo.repository.StockRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AchatService {
    @Autowired private final AchatRepository achatRepository;
    @Autowired private ProduitRepository produitRepository;
    @Autowired private StockRepository stockRepository;

    public AchatService(AchatRepository achatRepository) {
        this.achatRepository = achatRepository;
    }

    public List<Achat> findAll() {
        return achatRepository.findAll();
    }

    public Achat ajouterAchat(Integer idProduit, Integer quantiteAchat) {
        Produit produit = produitRepository.findById(idProduit).orElse(null);

        Stock stock = stockRepository.findByProduit(produit);
        
        if (stock == null) {
            stock = new Stock();
            stock.setProduit(produit);
            stock.setQuantiteDisponible(0);
            stock.setQuantiteVoulue(0);
        }

        int nouvelleQuantite = stock.getQuantiteDisponible() + quantiteAchat;
        stock.setQuantitePrecedente(stock.getQuantiteDisponible());
        stock.setQuantiteDisponible(nouvelleQuantite);
        stockRepository.save(stock);

        Achat achat = new Achat();
        achat.setProduit(produit);
        achat.setQuantite(quantiteAchat);
        float prixUnitaire = produit.getPrixAchatHt()*(1+produit.getTva()/100)/produit.getConditionnement();
        achat.setPrixUnitaire(prixUnitaire);
        achat.setPrixTotal(prixUnitaire * quantiteAchat);
        achatRepository.save(achat);

        return achat;
    }
}