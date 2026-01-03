package com.fitness.userservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service to integrate with Keycloak for user management
 */
@Service
@Slf4j
public class KeycloakService {

    @Value("${keycloak.server-url:http://localhost:8181}")
    private String keycloakServerUrl;

    @Value("${keycloak.realm:fitness-oauth2}")
    private String realm;

    @Value("${keycloak.admin.username:}")
    private String adminUsername;

    @Value("${keycloak.admin.password:}")
    private String adminPassword;

    @Value("${keycloak.admin.client-id:admin-cli}")
    private String adminClientId;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Get admin access token
     */
    private String getAdminToken() {
        try {
            String tokenUrl = keycloakServerUrl + "/realms/master/protocol/openid-connect/token";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("client_id", adminClientId);
            body.add("username", adminUsername);
            body.add("password", adminPassword);
            
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
            
            log.error("Failed to get admin token: {}", response.getStatusCode());
            return null;
        } catch (Exception e) {
            log.error("Error getting admin token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Create user in Keycloak
     */
    public String createKeycloakUser(String email, String firstName, String lastName, String password, List<String> roles) {
        try {
            String adminToken = getAdminToken();
            if (adminToken == null) {
                log.error("Cannot create user: Failed to get admin token");
                return null;
            }

            String createUserUrl = keycloakServerUrl + "/admin/realms/" + realm + "/users";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);
            
            Map<String, Object> userPayload = new HashMap<>();
            userPayload.put("username", email.split("@")[0]);
            userPayload.put("email", email);
            userPayload.put("firstName", firstName);
            userPayload.put("lastName", lastName);
            userPayload.put("enabled", true);
            userPayload.put("emailVerified", true);
            
            // Set credentials
            Map<String, Object> credential = new HashMap<>();
            credential.put("type", "password");
            credential.put("value", password);
            credential.put("temporary", false);
            userPayload.put("credentials", Collections.singletonList(credential));
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(userPayload, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                createUserUrl, 
                HttpMethod.POST, 
                request, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.CREATED) {
                // Extract user ID from Location header
                String location = response.getHeaders().getFirst("Location");
                if (location != null) {
                    String userId = location.substring(location.lastIndexOf('/') + 1);
                    log.info("User created in Keycloak with ID: {}", userId);
                    
                    // Assign roles if provided
                    if (roles != null && !roles.isEmpty()) {
                        assignRolesToUser(userId, roles, adminToken);
                    }
                    
                    return userId;
                }
            }
            
            log.error("Failed to create user in Keycloak: {}", response.getStatusCode());
            return null;
        } catch (Exception e) {
            log.error("Error creating user in Keycloak: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Assign roles to user
     */
    private void assignRolesToUser(String userId, List<String> roleNames, String adminToken) {
        try {
            // Get realm roles
            String rolesUrl = keycloakServerUrl + "/admin/realms/" + realm + "/roles";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            
            ResponseEntity<List> rolesResponse = restTemplate.exchange(
                rolesUrl,
                HttpMethod.GET,
                request,
                List.class
            );
            
            if (rolesResponse.getStatusCode() == HttpStatus.OK && rolesResponse.getBody() != null) {
                List<Map<String, Object>> rolesToAssign = new ArrayList<>();
                
                for (Object roleObj : rolesResponse.getBody()) {
                    Map<String, Object> role = (Map<String, Object>) roleObj;
                    String roleName = (String) role.get("name");
                    
                    if (roleNames.contains(roleName)) {
                        rolesToAssign.add(role);
                    }
                }
                
                // Assign roles to user
                if (!rolesToAssign.isEmpty()) {
                    String assignRolesUrl = keycloakServerUrl + "/admin/realms/" + realm + 
                                           "/users/" + userId + "/role-mappings/realm";
                    
                    HttpEntity<List<Map<String, Object>>> assignRequest = 
                        new HttpEntity<>(rolesToAssign, headers);
                    
                    restTemplate.exchange(
                        assignRolesUrl,
                        HttpMethod.POST,
                        assignRequest,
                        Void.class
                    );
                    
                    log.info("Assigned roles {} to user {}", roleNames, userId);
                }
            }
        } catch (Exception e) {
            log.error("Error assigning roles to user: {}", e.getMessage());
        }
    }

    /**
     * Check if user exists in Keycloak
     */
    public boolean userExistsInKeycloak(String email) {
        try {
            String adminToken = getAdminToken();
            if (adminToken == null) {
                return false;
            }

            String searchUrl = keycloakServerUrl + "/admin/realms/" + realm + 
                              "/users?email=" + email + "&exact=true";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            
            ResponseEntity<List> response = restTemplate.exchange(
                searchUrl,
                HttpMethod.GET,
                request,
                List.class
            );
            
            return response.getStatusCode() == HttpStatus.OK && 
                   response.getBody() != null && 
                   !response.getBody().isEmpty();
        } catch (Exception e) {
            log.error("Error checking user existence in Keycloak: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get user ID by email from Keycloak
     */
    public String getKeycloakUserIdByEmail(String email) {
        try {
            String adminToken = getAdminToken();
            if (adminToken == null) {
                return null;
            }

            String searchUrl = keycloakServerUrl + "/admin/realms/" + realm + 
                              "/users?email=" + email + "&exact=true";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            
            ResponseEntity<List> response = restTemplate.exchange(
                searchUrl,
                HttpMethod.GET,
                request,
                List.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && 
                response.getBody() != null && 
                !response.getBody().isEmpty()) {
                Map<String, Object> user = (Map<String, Object>) response.getBody().get(0);
                return (String) user.get("id");
            }
            
            return null;
        } catch (Exception e) {
            log.error("Error getting user ID from Keycloak: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Delete user from Keycloak
     */
    public boolean deleteKeycloakUser(String userId) {
        try {
            String adminToken = getAdminToken();
            if (adminToken == null) {
                return false;
            }

            String deleteUrl = keycloakServerUrl + "/admin/realms/" + realm + "/users/" + userId;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            
            ResponseEntity<Void> response = restTemplate.exchange(
                deleteUrl,
                HttpMethod.DELETE,
                request,
                Void.class
            );
            
            return response.getStatusCode() == HttpStatus.NO_CONTENT;
        } catch (Exception e) {
            log.error("Error deleting user from Keycloak: {}", e.getMessage());
            return false;
        }
    }
}
