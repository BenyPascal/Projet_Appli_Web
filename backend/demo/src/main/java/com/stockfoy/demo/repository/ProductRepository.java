package com.stockfoy.demo.repository;
import com.stockfoy.demo.entity.*;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product, Integer> {
    
}