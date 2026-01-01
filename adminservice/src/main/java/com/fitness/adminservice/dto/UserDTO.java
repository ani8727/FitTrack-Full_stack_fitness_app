package com.fitness.adminservice.dto;

import com.fitness.adminservice.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;
    private String keycloakId;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
