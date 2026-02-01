package com.fitness.adminservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitness.adminservice.dto.AdminRequestDTO;
import com.fitness.adminservice.dto.AdminResponseDTO;
import com.fitness.adminservice.dto.UserDTO;
import com.fitness.adminservice.entity.Activity;
import com.fitness.adminservice.service.ActivityService;
import com.fitness.adminservice.service.AdminService;
import com.fitness.adminservice.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final ActivityService activityService;

    @GetMapping("/me")
    public ResponseEntity<AdminResponseDTO> getMe(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(adminService.getMe(jwt));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminResponseDTO> createAdmin(@RequestBody AdminRequestDTO request, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(adminService.createAdmin(request, jwt));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminResponseDTO> getAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    // User management
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<java.util.List<UserDTO>> listUsers() {
        return ResponseEntity.ok(userService.listAll());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.update(id, dto));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    // Activity
    @GetMapping("/activity")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<java.util.List<Activity>> listActivity() {
        return ResponseEntity.ok(activityService.listAll());
    }

    @GetMapping("/activity/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<java.util.List<Activity>> listActivityForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(activityService.listByUser(userId));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<java.util.Map<String, Object>> stats() {
        // simple aggregated stats
        java.util.Map<String, Object> m = java.util.Map.of(
            "totalUsers", userService.listAll().size(),
            "totalActivities", activityService.listAll().size()
        );
        return ResponseEntity.ok(m);
    }
}

