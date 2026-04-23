package com.infy.poc.e_com_backend.service;

import com.infy.poc.e_com_backend.dto.LoginRequest;
import com.infy.poc.e_com_backend.dto.LoginResponse;
import com.infy.poc.e_com_backend.dto.RegisterRequest;
import com.infy.poc.e_com_backend.model.User;
import com.infy.poc.e_com_backend.repository.UserRepository;
import com.infy.poc.e_com_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ existing register method — don't touch this
    public void registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encryptedPassword);
        userRepository.save(user);
    }

    // ✅ new login method
    public LoginResponse loginUser(LoginRequest request) {

        // Check if email exists
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check if password matches
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, user.getEmail(), user.getName());
    }
}