package com.stockfoy.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.stockfoy.demo.entity.Achat;
import com.stockfoy.demo.services.AchatService;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/achats")
class AchatController {
    private final AchatService achatService;

    public AchatController(AchatService achatService) {
        this.achatService = achatService;
    }

    @GetMapping
    public List<Achat> getAllAchats() {
        return achatService.findAll();
    }

    @PostMapping("/ajouter")
    public Achat ajouterAchat(@RequestParam Integer idProduit, @RequestParam Integer quantiteAchat) {
        return achatService.ajouterAchat(idProduit, quantiteAchat);
    }

}
