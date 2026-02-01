package com.fitness.adminservice.dto;

import java.time.Instant;

public class ActivityDTO {
    private Long id;
    private Long userId;
    private String action;
    private Instant timestamp;

    public ActivityDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
