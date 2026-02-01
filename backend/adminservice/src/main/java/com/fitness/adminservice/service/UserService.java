package com.fitness.adminservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitness.adminservice.dto.UserDTO;
import com.fitness.adminservice.entity.User;
import com.fitness.adminservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDTO> listAll() {
        return userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public UserDTO getById(Long id) {
        return userRepository.findById(id).map(this::toDto).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public UserDTO update(Long id, UserDTO updates) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (updates.getFirstName() != null) user.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) user.setLastName(updates.getLastName());
        if (updates.getEmail() != null) user.setEmail(updates.getEmail());
        if (updates.getRole() != null) user.setRole(updates.getRole());
        if (updates.getAccountStatus() != null) user.setAccountStatus(updates.getAccountStatus());
        User saved = userRepository.save(user);
        return toDto(saved);
    }

    @Transactional
    public void softDelete(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountStatus("DELETED");
        userRepository.save(user);
    }

    private UserDTO toDto(User u) {
        return new UserDTO(u.getId(), u.getAuth0Id(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getRole(), u.getAccountStatus(), u.getCreatedAt(), u.getUpdatedAt());
    }
}
