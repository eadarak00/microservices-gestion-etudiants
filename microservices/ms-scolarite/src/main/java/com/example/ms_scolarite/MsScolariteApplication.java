package com.example.ms_scolarite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.ms_scolarite.feign")
public class MsScolariteApplication {
	public static void main(String[] args) {
		SpringApplication.run(MsScolariteApplication.class, args);
	}
}
