package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Produit;
import com.stockfoy.demo.entity.Stock;
import com.stockfoy.demo.repository.StockRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StockService {
    private final StockRepository stockRepository;

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
            stock.setQuantitePrecedente(stock.getQuantiteDisponible());
            stock.setQuantiteDisponible(updatedStock.getQuantiteDisponible());
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