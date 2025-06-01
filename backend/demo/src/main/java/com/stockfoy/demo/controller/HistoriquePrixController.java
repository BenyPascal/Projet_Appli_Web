package com.stockfoy.demo.controller;

import com.stockfoy.demo.entity.HistoriquePrix;
import com.stockfoy.demo.services.HistoriquePrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/historiques-prix")
public class HistoriquePrixController {

    @Autowired
    private HistoriquePrixService historiquePrixService;

    @GetMapping("/produit/{idProduit}")
    public List<HistoriquePrix> getByProduit(@PathVariable Integer idProduit) {
        return historiquePrixService.getByProduit(idProduit);
    }

    @PostMapping
    public HistoriquePrix create(@RequestBody HistoriquePrix historiquePrix) {
        return historiquePrixService.save(historiquePrix);
    }
}