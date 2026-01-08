package com.fitness.userservice.dto;

import lombok.Data;

@Data
public class AccountActionRequest {
    private String reason;
    private String password; // For verification before deletion
}
