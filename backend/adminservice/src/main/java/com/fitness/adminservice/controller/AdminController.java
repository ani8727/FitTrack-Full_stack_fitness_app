package com.fitness.adminservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fitness.adminservice.dto.AdminAuditLogDTO;
import com.fitness.adminservice.dto.DashboardStatsDTO;
import com.fitness.adminservice.dto.UserDTO;
import com.fitness.adminservice.entity.UserRole;
import com.fitness.adminservice.service.AdminService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        log.info("Fetching dashboard stats");
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestParam(required = false) String role) {
        log.info("Fetching users with role filter: {}", role);
        
        List<UserDTO> users;
        if (role != null && !role.isEmpty()) {
            users = adminService.getUsersByRole(UserRole.valueOf(role.toUpperCase()));
        } else {
            users = adminService.getAllUsers();
        }
        
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        log.info("Fetching user with id: {}", id);
        UserDTO user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable String id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal Jwt jwt) {
        String roleStr = request.get("role");
        UserRole role = UserRole.valueOf(roleStr.toUpperCase());
        log.info("Updating role for user {} to {}", id, role);
        String adminKeycloakId = jwt != null ? jwt.getSubject() : null;
        UserDTO updatedUser = adminService.updateUserRole(id, role, adminKeycloakId);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        log.info("Deleting user with id: {}", id);
        String adminKeycloakId = jwt != null ? jwt.getSubject() : null;
        adminService.deleteUser(id, adminKeycloakId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AdminAuditLogDTO>> getAuditLogs(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String targetUserId) {
        return ResponseEntity.ok(adminService.getRecentAuditLogs(limit, targetUserId));
    }

    /**
     * Ban a user (mark as BANNED status)
     */
    @PostMapping("/users/{id}/ban")
    public ResponseEntity<UserDTO> banUser(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> request,
            @AuthenticationPrincipal Jwt jwt) {
        String reason = request != null ? request.get("reason") : "Banned by admin";
        log.info("Banning user {}: {}", id, reason);
        String adminKeycloakId = jwt != null ? jwt.getSubject() : null;
        UserDTO bannedUser = adminService.banUser(id, reason, adminKeycloakId);
        return ResponseEntity.ok(bannedUser);
    }

    /**
     * Suspend a user (mark as SUSPENDED status)
     */
    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<UserDTO> suspendUser(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> request,
            @AuthenticationPrincipal Jwt jwt) {
        String reason = request != null ? request.get("reason") : "Suspended by admin";
        log.info("Suspending user {}: {}", id, reason);
        String adminKeycloakId = jwt != null ? jwt.getSubject() : null;
        UserDTO suspendedUser = adminService.suspendUser(id, reason, adminKeycloakId);
        return ResponseEntity.ok(suspendedUser);
    }

    /**
     * Deactivate a user (mark as DEACTIVATED status)
     */
    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<UserDTO> deactivateUser(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> request,
            @AuthenticationPrincipal Jwt jwt) {
        String reason = request != null ? request.get("reason") : "Deactivated by admin";
        log.info("Deactivating user {}: {}", id, reason);
        String adminKeycloakId = jwt != null ? jwt.getSubject() : null;
        UserDTO deactivatedUser = adminService.deactivateUser(id, reason, adminKeycloakId);
        return ResponseEntity.ok(deactivatedUser);
    }

    /**
     * Reactivate a user (mark as ACTIVE status)
     */
    @PostMapping("/users/{id}/reactivate")
    public ResponseEntity<UserDTO> reactivateUser(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        log.info("Reactivating user {}", id);
        String adminKeycloakId = jwt != null ? jwt.getSubject() : null;
        UserDTO reactivatedUser = adminService.reactivateUser(id, adminKeycloakId);
        return ResponseEntity.ok(reactivatedUser);
    }

    /**
     * Get user statistics (total, active, by role, etc.)
     */
    @GetMapping("/stats/users")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        log.info("Fetching user statistics");
        return ResponseEntity.ok(adminService.getUserStatistics());
    }

    /**
     * Get activity statistics
     */
    @GetMapping("/stats/activities")
    public ResponseEntity<Map<String, Object>> getActivityStats() {
        log.info("Fetching activity statistics");
        return ResponseEntity.ok(adminService.getActivityStatistics());
    }
}

