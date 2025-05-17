package com.stockfoy.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}


// curl -X POST http://localhost:8081/api/courses/generer
// curl -X POST "http://localhost:8081/api/achats/ajouter?idProduit=1&quantiteAchat=24"
