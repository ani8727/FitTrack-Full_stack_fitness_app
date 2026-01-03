package com.fitness.adminservice.service;

import com.fitness.adminservice.dto.DashboardStatsDTO;
import com.fitness.adminservice.dto.UserDTO;
import com.fitness.adminservice.entity.User;
import com.fitness.adminservice.entity.UserRole;
import com.fitness.adminservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;

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
    public UserDTO updateUserRole(String id, UserRole role) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setRole(role);
        User updatedUser = userRepository.save(user);
        log.info("Updated role for user {} to {}", id, role);
        return convertToDTO(updatedUser);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteUser(String id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
        log.info("Deleted user with id: {}", id);
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
}
