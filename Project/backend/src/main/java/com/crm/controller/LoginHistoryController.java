package com.crm.controller;

import com.crm.entity.LoginHistory;
import com.crm.entity.User;
import com.crm.repository.LoginHistoryRepository;
import com.crm.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/login-history")
public class LoginHistoryController {

    private final LoginHistoryRepository loginHistoryRepository;
    private final UserRepository userRepository;

    public LoginHistoryController(
            LoginHistoryRepository loginHistoryRepository,
            UserRepository userRepository) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<LoginHistoryResponse>> getLoginHistory(
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<LoginHistoryResponse> history =
                loginHistoryRepository
                        .findByUserOrderByLoginTimeDesc(user)
                        .stream()
                        .map(login -> new LoginHistoryResponse(
                                login.getId(),
                                login.getLoginTime()
                        ))
                        .toList();

        return ResponseEntity.ok(history);
    }

    public record LoginHistoryResponse(
            Long id,
            java.time.LocalDateTime loginTime
    ) {}
}