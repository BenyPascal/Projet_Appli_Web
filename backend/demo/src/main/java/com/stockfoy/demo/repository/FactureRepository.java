package com.stockfoy.demo.repository;

import com.stockfoy.demo.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactureRepository extends JpaRepository<Facture, Long> {
}