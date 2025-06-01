package com.stockfoy.demo.controller;

import com.stockfoy.demo.entity.CategorieProduit;
import com.stockfoy.demo.services.CategorieProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/categories")
public class CategorieProduitController {

    @Autowired
    private CategorieProduitService categorieProduitService;

    @GetMapping
    public List<CategorieProduit> getAll() {
        return categorieProduitService.findAll();
    }

    @PostMapping
    public CategorieProduit create(@RequestBody CategorieProduit categorie) {
        return categorieProduitService.save(categorie);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        categorieProduitService.deleteById(id);
    }
}