package com.leaveflow.controller;

import com.leaveflow.entity.User;
import com.leaveflow.entity.Leave;
import com.leaveflow.repository.UserRepository;
import com.leaveflow.repository.LeaveRepository;
import com.leaveflow.dto.UserResponse;
import com.leaveflow.dto.LeaveResponse;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import jakarta.inject.Inject;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@Controller("/api/admin")
@Secured(SecurityRule.IS_ANONYMOUS) // Temporarily allow anonymous access for debugging
public class AdminController {
    
    @Inject
    private UserRepository userRepository;
    
    @Inject
    private LeaveRepository leaveRepository;
    
    @Get("/db-status")
    public HttpResponse<Map<String, Object>> getDatabaseStatus() {
        System.out.println("🔍 DATABASE STATUS CHECK");
        
        Map<String, Object> status = new HashMap<>();
        
        try {
            // Count users
            List<User> users = userRepository.findAll();
            status.put("userCount", users.size());
            status.put("users", users.stream()
                .map(user -> Map.of(
                    "id", user.getId(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "active", user.isActive(),
                    "createdAt", user.getCreatedAt()
                ))
                .collect(Collectors.toList()));
            
            // Count leaves
            List<Leave> leaves = leaveRepository.findAll();
            status.put("leaveCount", leaves.size());
            status.put("leaves", leaves.stream()
                .map(leave -> Map.of(
                    "id", leave.getId(),
                    "userId", leave.getUserId(),
                    "leaveType", leave.getLeaveType(),
                    "startDate", leave.getStartDate(),
                    "endDate", leave.getEndDate(),
                    "duration", leave.getDuration(),
                    "status", leave.getStatus(),
                    "reason", leave.getReason() != null ? leave.getReason() : "",
                    "createdAt", leave.getCreatedAt()
                ))
                .collect(Collectors.toList()));
            
            status.put("status", "success");
            status.put("message", "Database is accessible");
            
            System.out.println("✅ DATABASE STATUS: " + users.size() + " users, " + leaves.size() + " leaves");
            
        } catch (Exception e) {
            status.put("status", "error");
            status.put("message", "Database error: " + e.getMessage());
            status.put("userCount", 0);
            status.put("leaveCount", 0);
            
            System.out.println("❌ DATABASE ERROR: " + e.getMessage());
            e.printStackTrace();
        }
        
        return HttpResponse.ok(status);
    }
    
    @Get("/users")
    public HttpResponse<List<Map<String, Object>>> getAllUsers() {
        System.out.println("👥 GET ALL USERS REQUEST");
        
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> userList = users.stream()
                .map(user -> {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("firstName", user.getFirstName());
                    userData.put("lastName", user.getLastName());
                    userData.put("email", user.getEmail());
                    userData.put("role", user.getRole());
                    userData.put("active", user.isActive());
                    userData.put("annualLeaveBalance", user.getAnnualLeaveBalance());
                    userData.put("sickLeaveBalance", user.getSickLeaveBalance());
                    userData.put("casualLeaveBalance", user.getCasualLeaveBalance());
                    userData.put("createdAt", user.getCreatedAt());
                    userData.put("updatedAt", user.getUpdatedAt());
                    return userData;
                })
                .collect(Collectors.toList());
            
            System.out.println("✅ USERS RETRIEVED: " + users.size() + " users");
            return HttpResponse.ok(userList);
            
        } catch (Exception e) {
            System.out.println("❌ GET USERS ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    @Get("/leaves")
    public HttpResponse<List<Map<String, Object>>> getAllLeaves() {
        System.out.println("📋 GET ALL LEAVES REQUEST");
        
        try {
            List<Leave> leaves = leaveRepository.findAll();
            List<Map<String, Object>> leaveList = leaves.stream()
                .map(leave -> {
                    Map<String, Object> leaveData = new HashMap<>();
                    leaveData.put("id", leave.getId());
                    leaveData.put("userId", leave.getUserId());
                    leaveData.put("leaveType", leave.getLeaveType());
                    leaveData.put("startDate", leave.getStartDate());
                    leaveData.put("endDate", leave.getEndDate());
                    leaveData.put("duration", leave.getDuration());
                    leaveData.put("reason", leave.getReason());
                    leaveData.put("status", leave.getStatus());
                    leaveData.put("approvedBy", leave.getApprovedBy());
                    leaveData.put("approvedAt", leave.getApprovedAt());
                    leaveData.put("comments", leave.getComments());
                    leaveData.put("createdAt", leave.getCreatedAt());
                    leaveData.put("updatedAt", leave.getUpdatedAt());
                    return leaveData;
                })
                .collect(Collectors.toList());
            
            System.out.println("✅ LEAVES RETRIEVED: " + leaves.size() + " leaves");
            return HttpResponse.ok(leaveList);
            
        } catch (Exception e) {
            System.out.println("❌ GET LEAVES ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    @Get("/create-test-data")
    public HttpResponse<Map<String, Object>> createTestData() {
        System.out.println("🧪 CREATING TEST DATA");
        
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Create test admin user
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@company.com");
            admin.setPassword("8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"); // Hash of "admin123"
            admin.setRole("ADMIN");
            admin.setActive(true);
            admin.setAnnualLeaveBalance(25);
            admin.setSickLeaveBalance(10);
            admin.setCasualLeaveBalance(5);
            
            User savedAdmin = userRepository.save(admin);
            
            // Create test employee user
            User employee = new User();
            employee.setFirstName("John");
            employee.setLastName("Doe");
            employee.setEmail("john.doe@company.com");
            employee.setPassword("ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"); // Hash of "secret123"
            employee.setRole("EMPLOYEE");
            employee.setActive(true);
            employee.setAnnualLeaveBalance(20);
            employee.setSickLeaveBalance(8);
            employee.setCasualLeaveBalance(3);
            
            User savedEmployee = userRepository.save(employee);
            
            result.put("status", "success");
            result.put("message", "Test data created successfully");
            result.put("adminUser", Map.of(
                "id", savedAdmin.getId(),
                "email", savedAdmin.getEmail(),
                "password", "admin123"
            ));
            result.put("employeeUser", Map.of(
                "id", savedEmployee.getId(),
                "email", savedEmployee.getEmail(),
                "password", "secret123"
            ));
            
            System.out.println("✅ TEST DATA CREATED - Admin: " + savedAdmin.getEmail() + ", Employee: " + savedEmployee.getEmail());
            
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Error creating test data: " + e.getMessage());
            
            System.out.println("❌ TEST DATA CREATION ERROR: " + e.getMessage());
            e.printStackTrace();
        }
        
        return HttpResponse.ok(result);
    }
} 