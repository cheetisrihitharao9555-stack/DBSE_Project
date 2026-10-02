package com.crm.service;

import com.crm.dto.AuthResponse;
import com.crm.dto.LoginRequest;
import com.crm.dto.RegisterRequest;
import com.crm.entity.LoginHistory;
import com.crm.entity.User;
import com.crm.repository.LoginHistoryRepository;
import com.crm.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            LoginHistoryRepository loginHistoryRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.loginHistoryRepository = loginHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "USER"
        );

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                null,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        LoginHistory loginHistory = new LoginHistory(user);
        loginHistoryRepository.save(loginHistory);

        return user;
    }
}