package com.stockfoy.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockfoy.demo.entity.Product;
import com.stockfoy.demo.services.ProductService;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProduits() {
        return productService.findAll();
    }

    @PostMapping
    public Product createProduit(@RequestBody Product produit) {
        return productService.save(produit);
    }
}

