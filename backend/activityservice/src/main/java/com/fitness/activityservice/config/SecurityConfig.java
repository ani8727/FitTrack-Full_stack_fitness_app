package com.fitness.activityservice.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter());

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/activities/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter))
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    private static org.springframework.core.convert.converter.Converter<Jwt, Collection<GrantedAuthority>> jwtGrantedAuthoritiesConverter() {
        // Default converter for scopes (SCOPE_*)
        JwtGrantedAuthoritiesConverter scopes = new JwtGrantedAuthoritiesConverter();

        return jwt -> {
            LinkedHashSet<GrantedAuthority> authorities = new LinkedHashSet<>();
            authorities.addAll(scopes.convert(jwt));

            List<String> roles = new ArrayList<>();
            roles.addAll(extractStringListClaim(jwt, "https://fitness-app/roles"));
            roles.addAll(extractStringListClaim(jwt, "fitness_auth/roles"));
            roles.addAll(extractStringListClaim(jwt, "roles"));
            roles.addAll(extractStringListClaim(jwt, "https://fitness.app/roles"));
            roles.addAll(extractStringListClaim(jwt, "https://fittrack.app/roles"));

            for (String role : roles) {
                if (role == null || role.isBlank()) continue;
                String normalized = role.trim().toUpperCase(Locale.ROOT);
                authorities.add(new SimpleGrantedAuthority("ROLE_" + normalized));
            }

            return new ArrayList<>(authorities);
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

        if (value instanceof Collection<?> collection) {
            List<String> out = new ArrayList<>(collection.size());
            for (Object o : collection) {
                if (o == null) continue;
                String s = Objects.toString(o, "").trim();
                if (!s.isEmpty()) {
                    out.add(s);
                }
            }
            return out;
        }

        String s = Objects.toString(value, "").trim();
        return s.isEmpty() ? List.of() : List.of(s);
    }
}
