package com.stockfoy.demo.repository;

import com.stockfoy.demo.entity.Vente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenteRepository extends JpaRepository<Vente, Integer> {
}
