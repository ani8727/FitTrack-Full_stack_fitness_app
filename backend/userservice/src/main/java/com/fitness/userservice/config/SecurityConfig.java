package com.fitness.userservice.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    // Allow internal service-to-service traffic that sets X-Service-ID without requiring JWT
    @Bean
    @Order(0)
    public SecurityFilterChain serviceToServiceChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher(request -> {
                String serviceId = request.getHeader("X-Service-ID");
                return serviceId != null && !serviceId.isBlank();
            })
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .oauth2ResourceServer(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/*/validate").permitAll()
                // Internal service-to-service calls can pass X-Service-ID to bypass JWT
                .requestMatchers("/api/users/**").access((authentication, context) -> {
                    String serviceId = context.getRequest().getHeader("X-Service-ID");
                    if (serviceId != null && !serviceId.isBlank()) {
                        return new AuthorizationDecision(true);
                    }
                    var authn = authentication.get();
                    return new AuthorizationDecision(authn != null && authn.isAuthenticated());
                })
                .requestMatchers("/api/users/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/users/*/deactivate").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/users/*/delete").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/users/*/reactivate").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(this::extractAuthorities);
        return converter;
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Set<String> roles = new HashSet<>();

        // 1) Simple custom claim: { "roles": ["ADMIN", "USER"] }
        Object rolesClaim = jwt.getClaims().get("roles");
        if (rolesClaim instanceof Collection<?> roleList) {
            for (Object r : roleList) {
                if (r != null && !r.toString().isBlank()) {
                    roles.add(r.toString());
                }
            }
        }

        // 2) Auth0 custom namespace: { "https://fitness.app/roles": ["ADMIN", "USER"] }
        Object auth0RolesClaim = jwt.getClaims().get("https://fitness.app/roles");
        if (auth0RolesClaim instanceof Collection<?> auth0RoleList) {
            for (Object r : auth0RoleList) {
                if (r != null && !r.toString().isBlank()) {
                    roles.add(r.toString());
                }
            }
        }

        // 3) Auth0 audience-specific: { "fitness_auth/roles": ["ADMIN", "USER"] }
        Object audienceRolesClaim = jwt.getClaims().get("fitness_auth/roles");
        if (audienceRolesClaim instanceof Collection<?> audienceRoleList) {
            for (Object r : audienceRoleList) {
                if (r != null && !r.toString().isBlank()) {
                    roles.add(r.toString());
                }
            }
        }

        // 4) Keycloak realm roles: { "realm_access": { "roles": ["..."] } }
        Object realmAccessObj = jwt.getClaims().get("realm_access");
        if (realmAccessObj instanceof Map<?, ?> realmAccess) {
            Object realmRolesObj = realmAccess.get("roles");
            if (realmRolesObj instanceof Collection<?> realmRoles) {
                for (Object r : realmRoles) {
                    if (r != null && !r.toString().isBlank()) {
                        roles.add(r.toString());
                    }
                }
            }
        }

        // 5) Keycloak client roles: { "resource_access": { "client": { "roles": ["..."] } } }
        Object resourceAccessObj = jwt.getClaims().get("resource_access");
        if (resourceAccessObj instanceof Map<?, ?> resourceAccess) {
            for (Object clientAccessObj : resourceAccess.values()) {
                if (clientAccessObj instanceof Map<?, ?> clientAccess) {
                    Object clientRolesObj = clientAccess.get("roles");
                    if (clientRolesObj instanceof Collection<?> clientRoles) {
                        for (Object r : clientRoles) {
                            if (r != null && !r.toString().isBlank()) {
                                roles.add(r.toString());
                            }
                        }
                    }
                }
            }
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        for (String role : roles) {
            String normalized = role.startsWith("ROLE_") ? role : "ROLE_" + role;
            authorities.add(new SimpleGrantedAuthority(normalized));
        }
        return authorities;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
