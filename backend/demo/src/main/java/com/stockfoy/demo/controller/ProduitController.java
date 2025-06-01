package com.stockfoy.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockfoy.demo.entity.Produit;
import com.stockfoy.demo.entity.HistoriquePrix;
import com.stockfoy.demo.services.ProduitService;
import com.stockfoy.demo.repository.ProduitRepository;
import com.stockfoy.demo.repository.HistoriquePrixRepository;
import java.util.List;
import java.time.LocalDate;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/produits")
public class ProduitController {
    private final ProduitService produitService;
    private final ProduitRepository produitRepository;
    private final HistoriquePrixRepository historiquePrixRepository;

    public ProduitController(ProduitService produitService, ProduitRepository produitRepository,
            HistoriquePrixRepository historiquePrixRepository) {
        this.produitService = produitService;
        this.produitRepository = produitRepository;
        this.historiquePrixRepository = historiquePrixRepository;
    }

    @GetMapping
    public List<Produit> getAllProduits() {
        return produitService.findAll();
    }

    @PostMapping
    public Produit createProduit(@RequestBody Produit produit) {
        return produitService.save(produit);
    }

    @PutMapping("/{id}")
    public Produit updateProduit(@PathVariable Integer id, @RequestBody Produit updatedProduit) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        boolean prixChange = !produit.getPrixVenteTtc().equals(updatedProduit.getPrixVenteTtc());

        produit.setNomProduit(updatedProduit.getNomProduit());
        produit.setCategorie(updatedProduit.getCategorie());
        produit.setConditionnement(updatedProduit.getConditionnement());
        produit.setPrixAchatHt(updatedProduit.getPrixAchatHt());
        produit.setTva(updatedProduit.getTva());
        produit.setPrixVenteTtc(updatedProduit.getPrixVenteTtc());
        produit.setMargeTotale(updatedProduit.getMargeTotale());
        produit.setQuantiteVoulue(updatedProduit.getQuantiteVoulue());

        Produit saved = produitRepository.save(produit);

        if (prixChange) {
            HistoriquePrix historique = new HistoriquePrix();
            historique.setProduit(saved);
            historique.setPrix(saved.getPrixVenteTtc());
            historique.setDateDebut(LocalDate.now());
            historiquePrixRepository.save(historique);
        }

        return saved;
    }
}
