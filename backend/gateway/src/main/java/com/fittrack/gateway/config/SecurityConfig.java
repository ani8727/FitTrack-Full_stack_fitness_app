package com.fittrack.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.fittrack.gateway.config.validators.AudienceValidator;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${AUTH0_DOMAIN}")
    private String auth0Domain;

    @Value("${AUTH0_AUDIENCE}")
    private String auth0Audience;

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        String issuer = "https://" + auth0Domain + "/";
        String jwkSetUri = issuer + ".well-known/jwks.json";

        NimbusReactiveJwtDecoder jwtDecoder = NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();

        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuer);
        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(auth0Audience);
        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);
        jwtDecoder.setJwtValidator(validator);

        return jwtDecoder;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(auth0AuthoritiesConverter());

        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers(HttpMethod.OPTIONS).permitAll()
                .pathMatchers("/actuator/health", "/actuator/info", "/actuator/gateway/**", "/public/**").permitAll()
                .pathMatchers("/api/admin/**").hasRole("ADMIN")
                .pathMatchers("/api/**").authenticated()
                .anyExchange().denyAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtDecoder(jwtDecoder())
                    .jwtAuthenticationConverter(new ReactiveJwtAuthenticationConverterAdapter(jwtConverter))
                )
            );

        return http.build();
    }

    private static Converter<Jwt, Collection<GrantedAuthority>> auth0AuthoritiesConverter() {
        return jwt -> {
            // FitTrack frontend checks for roles in these places:
            // - https://fitness-app/roles
            // - roles
            // - fitness_auth/roles
            // This converter supports all of them and emits ROLE_* authorities.
            List<String> roles = new ArrayList<>();
            roles.addAll(extractStringListClaim(jwt, "https://fitness-app/roles"));
            roles.addAll(extractStringListClaim(jwt, "roles"));
            roles.addAll(extractStringListClaim(jwt, "fitness_auth/roles"));

            // Some Auth0 setups use permissions instead of roles. Map those to PERMISSION_*.
            List<String> permissions = extractStringListClaim(jwt, "permissions");

            LinkedHashSet<GrantedAuthority> authorities = new LinkedHashSet<>();
            for (String role : roles) {
                if (role == null || role.isBlank()) {
                    continue;
                }
                String normalized = role.trim().toUpperCase(Locale.ROOT);
                authorities.add(new SimpleGrantedAuthority("ROLE_" + normalized));
            }
            for (String permission : permissions) {
                if (permission == null || permission.isBlank()) {
                    continue;
                }
                String normalized = permission.trim();
                authorities.add(new SimpleGrantedAuthority("PERMISSION_" + normalized));
            }
            return authorities;
        };
    }

    private static List<String> extractStringListClaim(Jwt jwt, String claimName) {
        Object value = jwt.getClaim(claimName);
        if (value == null) {
            return List.of();
        }

        if (value instanceof String) {
            String s = ((String) value).trim();
            return s.isEmpty() ? List.of() : List.of(s);
        }

        if (value instanceof Collection) {
            Collection<?> collection = (Collection<?>) value;
            List<String> out = new ArrayList<>(collection.size());
            for (Object o : collection) {
                if (o == null) {
                    continue;
                }
                String s = Objects.toString(o, "").trim();
                if (!s.isEmpty()) {
                    out.add(s);
                }
            }
            return out;
        }

        // Fallback: stringify unexpected types
        String s = Objects.toString(value, "").trim();
        return s.isEmpty() ? List.of() : List.of(s);
    }
}
