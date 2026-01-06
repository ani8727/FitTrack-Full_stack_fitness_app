package com.fitness.adminservice.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.fitness.adminservice.entity.AdminAuditLog;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {

    List<AdminAuditLog> findByTargetUserIdOrderByCreatedAtDesc(String targetUserId, Pageable pageable);

    List<AdminAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
