package com.leaveflow.service;

import com.leaveflow.entity.User;
import com.leaveflow.repository.UserRepository;
import com.leaveflow.dto.RegisterRequest;
import com.leaveflow.dto.UserResponse;

import jakarta.inject.Singleton;
import jakarta.inject.Inject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Singleton
public class UserService {
    
    @Inject
    private UserRepository userRepository;
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> authenticate(String email, String password) {
        String hashedPassword = hashPassword(password);
        return userRepository.findByEmailAndPassword(email, hashedPassword);
    }
    
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(hashPassword(request.getPassword()));
        user.setRole(request.getRole());
        
        return userRepository.save(user);
    }
    
    public List<UserResponse> getAllEmployees() {
        return userRepository.findByRole("EMPLOYEE")
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserResponse::new);
    }
    
    public User updateLeaveBalance(Long userId, String leaveType, int days) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        switch (leaveType.toUpperCase()) {
            case "ANNUAL":
                user.setAnnualLeaveBalance(user.getAnnualLeaveBalance() - days);
                break;
            case "SICK":
                user.setSickLeaveBalance(user.getSickLeaveBalance() - days);
                break;
            case "CASUAL":
                user.setCasualLeaveBalance(user.getCasualLeaveBalance() - days);
                break;
            default:
                throw new RuntimeException("Invalid leave type");
        }
        
        return userRepository.update(user);
    }
    
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
} 