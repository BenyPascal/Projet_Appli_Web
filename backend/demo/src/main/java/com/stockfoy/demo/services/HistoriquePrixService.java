package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.HistoriquePrix;
import com.stockfoy.demo.repository.HistoriquePrixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoriquePrixService {
    @Autowired
    private HistoriquePrixRepository historiquePrixRepository;

    public List<HistoriquePrix> getByProduit(Integer idProduit) {
        return historiquePrixRepository.findByProduit_IdProduitOrderByDateDebutAsc(idProduit);
    }

    public HistoriquePrix save(HistoriquePrix historiquePrix) {
        return historiquePrixRepository.save(historiquePrix);
    }
}