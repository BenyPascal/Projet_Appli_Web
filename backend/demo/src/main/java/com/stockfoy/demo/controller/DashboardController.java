package com.stockfoy.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockfoy.demo.entity.Courses;
import com.stockfoy.demo.services.AchatService;
import com.stockfoy.demo.services.CoursesService;
import com.stockfoy.demo.services.ProduitService;
import com.stockfoy.demo.services.StockService;
import com.stockfoy.demo.services.VenteService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final ProduitService produitService;
    private final StockService stockService;
    private final AchatService achatService;
    private final VenteService venteService;

    public DashboardController(ProduitService produitService, StockService stockService, AchatService achatService, VenteService venteService) {
        this.produitService = produitService;
        this.stockService = stockService;
        this.achatService = achatService;
        this.venteService = venteService;
    }

    @GetMapping
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProduits", produitService.findAll().size());
        // Stock faible
        List<com.stockfoy.demo.entity.Stock> stocks = stockService.findAll();
        long lowStockProduits = stocks.stream().filter(s -> s.getQuantiteDisponible() < (s.getQuantiteVoulue() != null ? s.getQuantiteVoulue() * 0.5 : 0)).count();
        stats.put("lowStockProduits", lowStockProduits);
        stats.put("totalPurchasesAmount", 0);
        stats.put("totalSalesAmount", 0);
        stats.put("recentPurchases", new ArrayList<>());
        stats.put("recentSales", new ArrayList<>());
        // Statut du stock
        long optimal = stocks.stream().filter(s -> s.getQuantiteDisponible() != null && s.getQuantiteVoulue() != null && s.getQuantiteDisponible() >= s.getQuantiteVoulue() * 0.8).count();
        long warning = stocks.stream().filter(s -> s.getQuantiteDisponible() != null && s.getQuantiteVoulue() != null && s.getQuantiteDisponible() >= s.getQuantiteVoulue() * 0.5 && s.getQuantiteDisponible() < s.getQuantiteVoulue() * 0.8).count();
        long critical = stocks.stream().filter(s -> s.getQuantiteDisponible() != null && s.getQuantiteVoulue() != null && s.getQuantiteDisponible() < s.getQuantiteVoulue() * 0.5).count();
        Map<String, Long> stockStatus = new HashMap<>();
        stockStatus.put("optimal", optimal);
        stockStatus.put("warning", warning);
        stockStatus.put("critical", critical);
        stats.put("stockStatus", stockStatus);
        return stats;
    }
}