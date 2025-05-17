package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Vente;
import com.stockfoy.demo.repository.VenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenteService {

    @Autowired private VenteRepository venteRepository;

    public VenteService(VenteRepository venteRepository) {
        this.venteRepository = venteRepository;
    }

    public List<Vente> findAll() {
        return venteRepository.findAll();
    }

}
