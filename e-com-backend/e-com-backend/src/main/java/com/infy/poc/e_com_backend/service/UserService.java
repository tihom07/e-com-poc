package com.infy.poc.e_com_backend.service;

import com.infy.poc.e_com_backend.dto.RegisterRequest;
import com.infy.poc.e_com_backend.model.User;
import com.infy.poc.e_com_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void registerUser(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Encrypt the password
        String encryptedPassword = passwordEncoder.encode(request.getPassword());

        // Create and save user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encryptedPassword);

        userRepository.save(user);
    }
}