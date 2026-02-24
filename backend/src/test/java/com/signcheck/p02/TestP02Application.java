package com.signcheck.p02;

import org.springframework.boot.SpringApplication;

public class TestP02Application {

	public static void main(String[] args) {
		SpringApplication.from(DocumentSignatureApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
