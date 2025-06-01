package com.stockfoy.demo.repository;

import com.stockfoy.demo.entity.Vente;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VenteRepository extends JpaRepository<Vente, Integer> {
    List<Vente> findByDateVenteBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT v FROM Vente v ORDER BY v.dateVente DESC")
    List<Vente> findTopNByOrderByDateVenteDesc(PageRequest pageable);

    default List<Vente> findTopNByOrderByDateVenteDesc(int n) {
        return findTopNByOrderByDateVenteDesc(PageRequest.of(0, n));
    }
}
