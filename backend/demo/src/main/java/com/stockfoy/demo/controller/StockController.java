package com.stockfoy.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockfoy.demo.entity.Stock;
import com.stockfoy.demo.services.StockService;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/stocks")
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockService.findAll();
    }

    @PutMapping("/{id}")
    public Stock updateStock(@PathVariable Integer id,  @RequestBody Stock updatedStock) {
        return stockService.updateStock(id, updatedStock);
    }
    
}
