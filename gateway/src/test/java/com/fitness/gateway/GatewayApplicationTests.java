package com.fitness.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestSecurityConfig.class)
@SpringBootTest
class GatewayApplicationTests {

	@Test
	void contextLoads() {
	}

}
