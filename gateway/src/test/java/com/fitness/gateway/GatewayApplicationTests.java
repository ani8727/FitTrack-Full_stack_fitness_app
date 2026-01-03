package com.fitness.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@Import(TestSecurityConfig.class)
@SpringBootTest
@ActiveProfiles("test")
class GatewayApplicationTests {

	@Test
	void contextLoads() {
	}

}
