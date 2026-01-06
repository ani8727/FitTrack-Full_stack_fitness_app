package com.fitness.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitness.userservice.model.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, String> {
}
