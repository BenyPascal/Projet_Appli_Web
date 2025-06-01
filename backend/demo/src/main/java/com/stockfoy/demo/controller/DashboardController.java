package com.stockfoy.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockfoy.demo.entity.Achat;
import com.stockfoy.demo.entity.Courses;
import com.stockfoy.demo.entity.Vente;
import com.stockfoy.demo.services.AchatService;
import com.stockfoy.demo.services.CoursesService;
import com.stockfoy.demo.services.ProduitService;
import com.stockfoy.demo.services.StockService;
import com.stockfoy.demo.services.VenteService;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
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

        public DashboardController(ProduitService produitService, StockService stockService, AchatService achatService,
                        VenteService venteService) {
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
                long lowStockProduits = stocks.stream().filter(
                                s -> s.getQuantiteDisponible() < (s.getQuantiteVoulue() != null
                                                ? s.getQuantiteVoulue() * 0.5
                                                : 0))
                                .count();
                stats.put("lowStockProduits", lowStockProduits);

                // Statut du stock
                long optimal = stocks.stream()
                                .filter(s -> s.getQuantiteDisponible() != null && s.getQuantiteVoulue() != null
                                                && s.getQuantiteDisponible() >= s.getQuantiteVoulue() * 0.8)
                                .count();
                long warning = stocks.stream()
                                .filter(s -> s.getQuantiteDisponible() != null && s.getQuantiteVoulue() != null
                                                && s.getQuantiteDisponible() >= s.getQuantiteVoulue() * 0.5
                                                && s.getQuantiteDisponible() < s.getQuantiteVoulue() * 0.8)
                                .count();
                long critical = stocks.stream()
                                .filter(s -> s.getQuantiteDisponible() != null && s.getQuantiteVoulue() != null
                                                && s.getQuantiteDisponible() < s.getQuantiteVoulue() * 0.5)
                                .count();
                Map<String, Long> stockStatus = new HashMap<>();
                stockStatus.put("optimal", optimal);
                stockStatus.put("warning", warning);
                stockStatus.put("critical", critical);
                stats.put("stockStatus", stockStatus);

                List<Achat> recentPurchases = achatService.findRecentPurchases(5);
                stats.put("recentPurchases", recentPurchases);

                List<Vente> recentSales = venteService.findRecentSales(5);
                stats.put("recentSales", recentSales);
                // Dates pour stats
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime weekAgo = now.minus(7, ChronoUnit.DAYS);
                LocalDateTime yearAgo = now.minus(1, ChronoUnit.YEARS);

                // Dépenses et recettes sur la semaine
                Float depensesSemaine = achatService.getTotalAchatsBetween(weekAgo, now);
                Float recettesSemaine = venteService.getTotalVentesBetween(weekAgo, now);
                stats.put("depensesSemaine", depensesSemaine != null ? depensesSemaine : 0);
                stats.put("recettesSemaine", recettesSemaine != null ? recettesSemaine : 0);

                // Dépenses et recettes sur l'année
                Float depensesAnnee = achatService.getTotalAchatsBetween(yearAgo, now);
                Float recettesAnnee = venteService.getTotalVentesBetween(yearAgo, now);
                stats.put("depensesAnnee", depensesAnnee != null ? depensesAnnee : 0);
                stats.put("recettesAnnee", recettesAnnee != null ? recettesAnnee : 0);

                // Ventes mensuelles pour l'année en cours
                LocalDateTime startOfYear = now.withDayOfYear(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
                List<Float> ventesParMois = new ArrayList<>();
                for (int month = 1; month <= 12; month++) {
                        LocalDateTime start = startOfYear.withMonth(month);
                        LocalDateTime end = (month < 12)
                                        ? startOfYear.withMonth(month + 1)
                                        : startOfYear.plusYears(1);
                        Float total = venteService.getTotalVentesBetween(start, end);
                        ventesParMois.add(total != null ? total : 0f);
                }
                stats.put("ventesMensuelles", ventesParMois);

                return stats;
        }
}