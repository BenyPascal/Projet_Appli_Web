package com.stockfoy.demo.controller;

import com.stockfoy.demo.entity.Vente;
import com.stockfoy.demo.services.VenteService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/ventes")
public class VenteController {

    private final VenteService venteService;

    public VenteController(VenteService venteService) {
        this.venteService = venteService;
    }

    @GetMapping
    public List<Vente> getAllVentes() {
        return venteService.findAll();
    }
}
