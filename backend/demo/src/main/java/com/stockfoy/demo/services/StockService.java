package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Produit;
import com.stockfoy.demo.entity.Stock;
import com.stockfoy.demo.entity.Vente;
import com.stockfoy.demo.repository.StockRepository;
import com.stockfoy.demo.repository.VenteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {
    private final StockRepository stockRepository;
    @Autowired
    private VenteRepository venteRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<Stock> findAll() {
        return stockRepository.findAll();
    }

    public Stock updateStock(Integer id, Stock updatedStock) {
        Optional<Stock> existingStock = stockRepository.findById(id);

        if (existingStock.isPresent()) {
            Stock stock = existingStock.get();

            int ancienneQuantite = stock.getQuantiteDisponible();
            int nouvelleQuantite = updatedStock.getQuantiteDisponible();

            // Mise à jour de la quantité précédente
            stock.setQuantitePrecedente(ancienneQuantite);
            stock.setQuantiteDisponible(nouvelleQuantite);

            // Si baisse => enregistrer une vente
            if (nouvelleQuantite < ancienneQuantite) {
                int quantiteVendue = ancienneQuantite - nouvelleQuantite;

                Vente vente = new Vente();
                vente.setProduit(stock.getProduit());
                vente.setQuantite(quantiteVendue);
                vente.setDateVente(java.time.LocalDateTime.now());
                venteRepository.save(vente);
            }

            return stockRepository.save(stock);
        } else {
            throw new RuntimeException("Stock non trouvé avec l'ID : " + id);
        }
    }

    public Stock createInitialStock(Produit produit) {
        Stock newStock = new Stock();
        newStock.setProduit(produit);
        newStock.setQuantiteDisponible(0);
        newStock.setQuantitePrecedente(0);
        newStock.setQuantiteVoulue(produit.getQuantiteVoulue());
        return stockRepository.save(newStock);
    }
}