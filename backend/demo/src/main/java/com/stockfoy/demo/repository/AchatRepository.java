package com.stockfoy.demo.repository;

import com.stockfoy.demo.entity.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AchatRepository extends JpaRepository<Achat, Integer> {
    List<Achat> findByDateAchatBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Achat a ORDER BY a.dateAchat DESC")
    List<Achat> findTopNByOrderByDateAchatDesc(PageRequest pageable);

    default List<Achat> findTopNByOrderByDateAchatDesc(int n) {
        return findTopNByOrderByDateAchatDesc(PageRequest.of(0, n));
    }

}