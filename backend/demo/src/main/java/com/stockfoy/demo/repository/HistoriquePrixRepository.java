package com.stockfoy.demo.repository;

import com.stockfoy.demo.entity.HistoriquePrix;
import com.stockfoy.demo.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoriquePrixRepository extends JpaRepository<HistoriquePrix, Integer> {
    List<HistoriquePrix> findByProduitOrderByDateDebutAsc(Produit produit);

    List<HistoriquePrix> findByProduit_IdProduitOrderByDateDebutAsc(Integer idProduit);
}