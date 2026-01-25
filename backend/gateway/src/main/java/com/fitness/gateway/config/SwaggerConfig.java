package com.fitness.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FitTrack API")
                        .version("1.0.0")
                        .description("Full-stack fitness application API documentation")
                        .contact(new Contact()
                                .name("FitTrack Team")
                                .email("support@fittrack.com")
                                .url("https://fittrack.com")));
    }
}
