package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.CategorieProduit;
import com.stockfoy.demo.repository.CategorieProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategorieProduitService {
    @Autowired
    private CategorieProduitRepository categorieProduitRepository;

    public List<CategorieProduit> findAll() {
        return categorieProduitRepository.findAll();
    }

    public CategorieProduit save(CategorieProduit categorie) {
        return categorieProduitRepository.save(categorie);
    }

    public void deleteById(Integer id) {
        categorieProduitRepository.deleteById(id);
    }
}