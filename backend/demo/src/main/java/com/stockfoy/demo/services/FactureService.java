package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Facture;
import com.stockfoy.demo.repository.FactureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FactureService {
    @Autowired
    private FactureRepository factureRepository;

    public Facture save(Facture invoice) {
        return factureRepository.save(invoice);
    }

    public List<Facture> findAll() {
        return factureRepository.findAll();
    }

    public Facture findById(Long id) {
        return factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture not found with id: " + id));
    }

}