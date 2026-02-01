package com.fitness.adminservice.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String action;

    private Instant timestamp;

    @PrePersist
    public void prePersist() { this.timestamp = Instant.now(); }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Instant getTimestamp() { return timestamp; }
}
