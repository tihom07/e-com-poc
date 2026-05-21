package com.infy.poc.e_com_backend.controller;

import com.infy.poc.e_com_backend.dto.UpdatePasswordRequest;
import com.infy.poc.e_com_backend.dto.UpdateProfileRequest;
import com.infy.poc.e_com_backend.model.User;
import com.infy.poc.e_com_backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    private String getEmail() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    // GET profile
    @GetMapping
    public ResponseEntity<?> getProfile() {
        try {
            User user = profileService.getProfile(getEmail());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    // PUT update profile
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        try {
            User user = profileService.updateProfile(getEmail(), request);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("phone", user.getPhone());
            response.put("address", user.getAddress());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    // PUT update password
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @Valid @RequestBody UpdatePasswordRequest request) {
        try {
            profileService.updatePassword(getEmail(), request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password updated successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }
}