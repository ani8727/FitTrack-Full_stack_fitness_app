package com.fitness.adminservice.config;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri:}")
    private String issuerUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.audience:}")
    private String audience;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/actuator/info").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        if (issuerUri == null || issuerUri.isBlank()) {
            throw new IllegalStateException("spring.security.oauth2.resourceserver.jwt.issuer-uri must be set");
        }
        JwtDecoder decoder = JwtDecoders.fromOidcIssuerLocation(issuerUri);

        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(audience);
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        if (decoder instanceof org.springframework.security.oauth2.jwt.NimbusJwtDecoder jwtDecoder) {
            jwtDecoder.setJwtValidator(withAudience);
        }
        return decoder;
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            ArrayList<org.springframework.security.core.GrantedAuthority> authorities = new ArrayList<>();
            Object claim = jwt.getClaim("https://fittrack.app/roles");
            if (claim instanceof Collection<?> col) {
                for (Object r : col) {
                    if (r != null) {
                        String role = r.toString();
                        if (!role.startsWith("ROLE_")) {
                            role = "ROLE_" + role;
                        }
                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(role));
                    }
                }
            }
            return authorities;
        });
        return converter;
    }

    static class AudienceValidator implements OAuth2TokenValidator<Jwt> {
        private final String audience;

        AudienceValidator(String audience) {
            this.audience = audience;
        }

        @Override
        public OAuth2TokenValidatorResult validate(Jwt token) {
            if (audience == null || audience.isBlank()) {
                return OAuth2TokenValidatorResult.success();
            }
            Object aud = token.getClaims().get("aud");
            if (aud instanceof String && audience.equals(aud)) {
                return OAuth2TokenValidatorResult.success();
            }
            if (aud instanceof Iterable<?>) {
                for (Object a : (Iterable<?>) aud) {
                    if (audience.equals(a)) {
                        return OAuth2TokenValidatorResult.success();
                    }
                }
            }
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "The required audience is missing", null));
        }
    }

}
