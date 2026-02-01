package com.fitness.adminservice.dto;

import java.time.Instant;

public class AdminAuditLogDTO {
	private Long id;
	private String targetUserId;
	private String action;
	private String performedBy;
	private String details;
	private Instant createdAt;

	public AdminAuditLogDTO() {}

	public AdminAuditLogDTO(Long id, String targetUserId, String action, String performedBy, String details, Instant createdAt) {
		this.id = id;
		this.targetUserId = targetUserId;
		this.action = action;
		this.performedBy = performedBy;
		this.details = details;
		this.createdAt = createdAt;
	}

	public Long getId() { return id; }
	public String getTargetUserId() { return targetUserId; }
	public String getAction() { return action; }
	public String getPerformedBy() { return performedBy; }
	public String getDetails() { return details; }
	public Instant getCreatedAt() { return createdAt; }
}
