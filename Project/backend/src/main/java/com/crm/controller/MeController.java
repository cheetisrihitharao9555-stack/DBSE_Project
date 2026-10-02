package com.crm.controller;

import com.crm.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class MeController {

    private final UserRepository userRepository;

    public MeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(new UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public record UserInfo(
            Long id,
            String name,
            String email,
            String role
    ) {
    }
}