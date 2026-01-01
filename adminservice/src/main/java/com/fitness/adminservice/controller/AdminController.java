package com.fitness.adminservice.controller;

import com.fitness.adminservice.dto.DashboardStatsDTO;
import com.fitness.adminservice.dto.UserDTO;
import com.fitness.adminservice.entity.UserRole;
import com.fitness.adminservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
            @RequestBody Map<String, String> request) {
        String roleStr = request.get("role");
        UserRole role = UserRole.valueOf(roleStr.toUpperCase());
        log.info("Updating role for user {} to {}", id, role);
        UserDTO updatedUser = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        log.info("Deleting user with id: {}", id);
        adminService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
