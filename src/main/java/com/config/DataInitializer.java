package com.config;

import com.model.Role;
import com.model.User;
import com.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.dao.DataAccessException;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            // Check if admin user already exists
            if (!userRepository.existsByEmail("vap@gmail.com")) {
                User admin = User.builder()
                        .username("vap07")
                        .email("vap@gmail.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("Vivek Pandagre")
                        .role(Role.ROLE_ADMIN)
                        .enabled(true)
                        .createdAt(LocalDateTime.now())
                        .build();

                userRepository.save(admin);
                log.info("Admin user created successfully!");
            } else {
                log.info("Admin user already exists");
            }
        } catch (DataAccessException e) {
            log.warn("Could not initialize admin user. This is expected during schema creation: {}", e.getMessage());
        }
    }
} 