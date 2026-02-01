package com.fitness.adminservice.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "admin_audit_logs")
public class AdminAuditLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "target_user_id", length = 64)
	private String targetUserId;

	@Column(length = 128)
	private String action;

	@Column(name = "performed_by", length = 64)
	private String performedBy;

	@Column(length = 2000)
	private String details;

	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = Instant.now();
	}

	// getters and setters
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getTargetUserId() { return targetUserId; }
	public void setTargetUserId(String targetUserId) { this.targetUserId = targetUserId; }

	public String getAction() { return action; }
	public void setAction(String action) { this.action = action; }

	public String getPerformedBy() { return performedBy; }
	public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

	public String getDetails() { return details; }
	public void setDetails(String details) { this.details = details; }

	public Instant getCreatedAt() { return createdAt; }
}
