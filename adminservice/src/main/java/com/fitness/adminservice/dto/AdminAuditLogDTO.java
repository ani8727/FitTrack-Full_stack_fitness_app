package com.fitness.adminservice.dto;

import java.time.Instant;

public record AdminAuditLogDTO(
        Long id,
        String adminKeycloakId,
        String action,
        String targetUserId,
        String metadata,
        Instant createdAt) {
}
