package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Vente;
import com.stockfoy.demo.repository.VenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class VenteService {

    @Autowired
    private VenteRepository venteRepository;

    public VenteService(VenteRepository venteRepository) {
        this.venteRepository = venteRepository;
    }

    public List<Vente> findAll() {
        return venteRepository.findAll();
    }

    public Float getTotalVentesBetween(LocalDateTime start, LocalDateTime end) {
        List<Vente> ventes = venteRepository.findByDateVenteBetween(start, end);

        return ventes.stream()
                .map(v -> v.getPrixUnitaire() * v.getQuantite())
                .filter(Objects::nonNull)
                .reduce(0f, Float::sum);
    }

    public List<Vente> findRecentSales(int limit) {
        return venteRepository.findTopNByOrderByDateVenteDesc(limit);
    }
}
