package sn.uasz.m2info.etudiant_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class EtudiantServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EtudiantServiceApplication.class, args);
	}

}
