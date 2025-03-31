package com.stockfoy.demo.services;

import com.stockfoy.demo.entity.Achat;
import com.stockfoy.demo.repository.AchatRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AchatService {
    private final AchatRepository achatRepository;

    public AchatService(AchatRepository achatRepository) {
        this.achatRepository = achatRepository;
    }

    public List<Achat> findAll() {
        return achatRepository.findAll();
    }
}