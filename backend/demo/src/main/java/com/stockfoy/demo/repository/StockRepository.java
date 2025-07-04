package com.stockfoy.demo.repository;
import com.stockfoy.demo.entity.*;

import org.springframework.data.jpa.repository.JpaRepository;


public interface StockRepository extends JpaRepository<Stock, Integer> {
    Stock findByProduit(Produit produit);
}