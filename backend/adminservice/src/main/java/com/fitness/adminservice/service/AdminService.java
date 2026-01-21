package com.fitness.adminservice.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitness.adminservice.dto.AdminAuditLogDTO;
import com.fitness.adminservice.dto.DashboardStatsDTO;
import com.fitness.adminservice.dto.UserDTO;
import com.fitness.adminservice.entity.AdminAuditLog;
import com.fitness.adminservice.entity.User;
import com.fitness.adminservice.entity.UserRole;
import com.fitness.adminservice.repository.AdminAuditLogRepository;
import com.fitness.adminservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;

    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long adminUsers = userRepository.countByRole(UserRole.ADMIN);
        long regularUsers = userRepository.countByRole(UserRole.USER);
        
        return new DashboardStatsDTO(totalUsers, adminUsers, regularUsers);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public UserDTO getUserById(String id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDTO(user);
    }

    @Transactional
    @SuppressWarnings("null")
    public UserDTO updateUserRole(String id, UserRole role, String adminKeycloakId) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        UserRole oldRole = user.getRole();
        user.setRole(role);
        User updatedUser = userRepository.save(user);

        writeAuditLog(adminKeycloakId, "UPDATE_ROLE", id, Map.of(
                "oldRole", String.valueOf(oldRole),
                "newRole", String.valueOf(role)));

        log.info("Updated role for user {} to {}", id, role);
        return convertToDTO(updatedUser);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteUser(String id, String adminKeycloakId) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);

        writeAuditLog(adminKeycloakId, "DELETE_USER", id, Map.of());

        log.info("Deleted user with id: {}", id);
    }

    public List<AdminAuditLogDTO> getRecentAuditLogs(int limit, String targetUserId) {
        int safeLimit = Math.max(1, Math.min(limit, 200));
        PageRequest page = PageRequest.of(0, safeLimit);

        List<AdminAuditLog> logs;
        if (targetUserId != null && !targetUserId.isBlank()) {
            logs = adminAuditLogRepository.findByTargetUserIdOrderByCreatedAtDesc(targetUserId, page);
        } else {
            logs = adminAuditLogRepository.findAllByOrderByCreatedAtDesc(page);
        }

        return logs.stream()
                .map(l -> new AdminAuditLogDTO(
                        l.getId(),
                        l.getAdminKeycloakId(),
                        l.getAction(),
                        l.getTargetUserId(),
                        l.getMetadata(),
                        l.getCreatedAt()))
                .toList();
    }

    private void writeAuditLog(String adminKeycloakId, String action, String targetUserId, Map<String, Object> metadata) {
        if (adminKeycloakId == null || adminKeycloakId.isBlank()) {
            // If auth is misconfigured, still allow operation but log it.
            adminKeycloakId = "UNKNOWN";
        }

        AdminAuditLog logEntity = new AdminAuditLog();
        logEntity.setAdminKeycloakId(adminKeycloakId);
        logEntity.setAction(action);
        logEntity.setTargetUserId(targetUserId);
        logEntity.setMetadata(metadata == null || metadata.isEmpty() ? null : metadata.toString());
        logEntity.setCreatedAt(Instant.now());
        adminAuditLogRepository.save(logEntity);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole(),
            user.getKeycloakId(),
            user.getCreateAt(),
            user.getUpdateAt()
        );
    }

    /**
     * Ban a user
     */
    @Transactional
    @SuppressWarnings("null")
    public UserDTO banUser(String id, String reason, String adminKeycloakId) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setAccountStatus("BANNED");
        user.setDeactivatedAt(java.time.LocalDateTime.now());
        user.setDeactivationReason(reason);
        User bannedUser = userRepository.save(user);
        
        writeAuditLog(adminKeycloakId, "BAN_USER", id, Map.of("reason", reason));
        log.info("Banned user {}: {}", id, reason);
        return convertToDTO(bannedUser);
    }

    /**
     * Suspend a user
     */
    @Transactional
    @SuppressWarnings("null")
    public UserDTO suspendUser(String id, String reason, String adminKeycloakId) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setAccountStatus("SUSPENDED");
        user.setDeactivatedAt(java.time.LocalDateTime.now());
        user.setDeactivationReason(reason);
        User suspendedUser = userRepository.save(user);
        
        writeAuditLog(adminKeycloakId, "SUSPEND_USER", id, Map.of("reason", reason));
        log.info("Suspended user {}: {}", id, reason);
        return convertToDTO(suspendedUser);
    }

    /**
     * Deactivate a user
     */
    @Transactional
    @SuppressWarnings("null")
    public UserDTO deactivateUser(String id, String reason, String adminKeycloakId) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setAccountStatus("DEACTIVATED");
        user.setDeactivatedAt(java.time.LocalDateTime.now());
        user.setDeactivationReason(reason);
        User deactivatedUser = userRepository.save(user);
        
        writeAuditLog(adminKeycloakId, "DEACTIVATE_USER", id, Map.of("reason", reason));
        log.info("Deactivated user {}: {}", id, reason);
        return convertToDTO(deactivatedUser);
    }

    /**
     * Reactivate a user
     */
    @Transactional
    @SuppressWarnings("null")
    public UserDTO reactivateUser(String id, String adminKeycloakId) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setAccountStatus("ACTIVE");
        user.setDeactivatedAt(null);
        user.setDeactivationReason(null);
        User reactivatedUser = userRepository.save(user);
        
        writeAuditLog(adminKeycloakId, "REACTIVATE_USER", id, Map.of());
        log.info("Reactivated user {}", id);
        return convertToDTO(reactivatedUser);
    }

    /**
     * Get user statistics
     */
    public Map<String, Object> getUserStatistics() {
        long totalUsers = userRepository.count();
        long adminUsers = userRepository.countByRole(UserRole.ADMIN);
        long regularUsers = userRepository.countByRole(UserRole.USER);
        
        return Map.of(
            "totalUsers", totalUsers,
            "adminUsers", adminUsers,
            "regularUsers", regularUsers,
            "activePercentage", totalUsers > 0 ? ((regularUsers + adminUsers) * 100 / totalUsers) : 0
        );
    }

    /**
     * Get activity statistics (placeholder - calls activity service or local cache)
     */
    public Map<String, Object> getActivityStatistics() {
        // Placeholder for activity stats
        // In production, this would call the activity service or fetch from a cache
        return Map.of(
            "totalActivities", 0,
            "activitiesThisWeek", 0,
            "averagePerUser", 0.0,
            "lastUpdated", java.time.Instant.now().toString()
        );
    }
}

