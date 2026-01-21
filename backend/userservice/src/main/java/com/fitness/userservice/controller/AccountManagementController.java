package com.fitness.userservice.controller;

import com.fitness.userservice.dto.AccountActionRequest;
import com.fitness.userservice.service.AccountManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AccountManagementController {

    private final AccountManagementService accountManagementService;

    @PostMapping("/{userId}/deactivate")
    public ResponseEntity<String> deactivateAccount(
            @PathVariable String userId,
            @RequestBody AccountActionRequest request) {
        accountManagementService.deactivateAccount(userId, request);
        return ResponseEntity.ok("Account deactivated successfully");
    }

    @PostMapping("/{userId}/delete")
    public ResponseEntity<String> deleteAccount(
            @PathVariable String userId,
            @RequestBody AccountActionRequest request) {
        accountManagementService.deleteAccount(userId, request);
        return ResponseEntity.ok("Account marked for deletion");
    }

    @PostMapping("/{userId}/reactivate")
    public ResponseEntity<String> reactivateAccount(@PathVariable String userId) {
        accountManagementService.reactivateAccount(userId);
        return ResponseEntity.ok("Account reactivated successfully");
    }

    @PostMapping("/{userId}/onboarding/complete")
    public ResponseEntity<String> completeOnboarding(@PathVariable String userId) {
        accountManagementService.completeOnboarding(userId);
        return ResponseEntity.ok("Onboarding completed");
    }

    @GetMapping("/{userId}/onboarding/status")
    public ResponseEntity<Boolean> getOnboardingStatus(@PathVariable String userId) {
        return ResponseEntity.ok(accountManagementService.isOnboardingCompleted(userId));
    }
}
