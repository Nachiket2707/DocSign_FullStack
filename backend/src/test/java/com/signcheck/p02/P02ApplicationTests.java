package com.signcheck.p02;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class P02ApplicationTests {

	@Test
	void contextLoads() {
	}

}
