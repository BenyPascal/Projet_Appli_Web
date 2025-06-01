package com.stockfoy.demo.repository;

import com.stockfoy.demo.entity.CategorieProduit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieProduitRepository extends JpaRepository<CategorieProduit, Integer> {
}