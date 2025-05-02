package com.service;

import com.dto.UpdateProfileRequest;
import com.model.User;
import com.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = (User) loadUserByUsername(email);
        
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        
        return userRepository.save(user);
    }

    @Transactional
    public void updateProfilePicture(String email, String profilePicture) {
        User user = (User) loadUserByUsername(email);
        user.setProfilePicture(profilePicture);
        userRepository.save(user);
    }

    @Transactional
    public void updateLastLogin(String email) {
        User user = (User) loadUserByUsername(email);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }
} 