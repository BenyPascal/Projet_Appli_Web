package com.stockfoy.demo.controller;

import com.stockfoy.demo.entity.Facture;
import com.stockfoy.demo.services.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/factures")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @Value("${facture.upload.dir:uploads/factures}")
    private String uploadDir;

    @PostMapping("/upload")
    public Facture uploadFacture(
            @RequestParam("file") MultipartFile file,
            @RequestParam("issueDate") String issueDate,
            @RequestParam(value = "supplier", required = false) String supplier,
            @RequestParam(value = "totalAmount", required = false) String totalAmount) throws IOException {
        Facture facture = new Facture();
        facture.setFileName(file.getOriginalFilename());
        facture.setIssueDate(LocalDate.parse(issueDate));
        facture.setSupplier(supplier);
        if (totalAmount != null && !totalAmount.isEmpty()) {
            facture.setTotalAmount(Float.parseFloat(totalAmount));
        }
        facture.setFileData(file.getBytes()); // <-- Stocke le PDF en base

        return factureService.save(facture);
    }

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.findAll();
    }

    @GetMapping("/files/{fileName:.+}")
    public @ResponseBody byte[] getFile(@PathVariable String fileName) throws IOException {
        File file = new File(uploadDir, fileName);
        return java.nio.file.Files.readAllBytes(file.toPath());
    }

    @GetMapping("/file/{id}")
    public ResponseEntity<byte[]> downloadFacture(@PathVariable Long id) {
        Facture facture = factureService.findById(id);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + facture.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(facture.getFileData());
    }
}