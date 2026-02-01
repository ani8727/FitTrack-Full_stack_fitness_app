package com.fitness.adminservice.service;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitness.adminservice.dto.AdminRequestDTO;
import com.fitness.adminservice.dto.AdminResponseDTO;
import com.fitness.adminservice.entity.Admin;
import com.fitness.adminservice.repository.AdminRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminResponseDTO getMe(org.springframework.security.oauth2.jwt.Jwt jwt) {
        String auth0Id = jwt == null ? null : jwt.getSubject();
        if (auth0Id == null) throw new IllegalArgumentException("Missing subject in JWT");
        return adminRepository.findByAuth0Id(auth0Id).map(this::toDto).orElse(null);
    }

    @Transactional
    public AdminResponseDTO createAdmin(AdminRequestDTO req, org.springframework.security.oauth2.jwt.Jwt jwt) {
        String auth0Id = jwt == null ? null : jwt.getSubject();
        if (auth0Id == null) throw new IllegalArgumentException("Missing subject in JWT");
        Admin existing = adminRepository.findByAuth0Id(auth0Id).orElse(null);
        if (existing != null) return toDto(existing);
        Admin a = new Admin();
        a.setAuth0Id(auth0Id);
        a.setEmail(req.getEmail());
        a.setName(req.getName());
        a.setRole(req.getRole());
        a.setCreatedAt(Instant.now());
        Admin saved = adminRepository.save(a);
        return toDto(saved);
    }

    public AdminResponseDTO getAdminById(Long id) {
        Admin a = adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
        return toDto(a);
    }

    private AdminResponseDTO toDto(Admin a) {
        return new AdminResponseDTO(a.getId(), a.getAuth0Id(), a.getEmail(), a.getName(), a.getRole(), a.getCreatedAt());
    }
}

