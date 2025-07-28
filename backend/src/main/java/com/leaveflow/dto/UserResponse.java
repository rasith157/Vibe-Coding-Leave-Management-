package com.leaveflow.dto;

import com.leaveflow.entity.User;

import java.time.LocalDateTime;

public class UserResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private boolean active;
    private Integer annualLeaveBalance;
    private Integer sickLeaveBalance;
    private Integer casualLeaveBalance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public UserResponse() {}
    
    public UserResponse(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.active = user.isActive();
        this.annualLeaveBalance = user.getAnnualLeaveBalance();
        this.sickLeaveBalance = user.getSickLeaveBalance();
        this.casualLeaveBalance = user.getCasualLeaveBalance();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public Integer getAnnualLeaveBalance() { return annualLeaveBalance; }
    public void setAnnualLeaveBalance(Integer annualLeaveBalance) { this.annualLeaveBalance = annualLeaveBalance; }
    
    public Integer getSickLeaveBalance() { return sickLeaveBalance; }
    public void setSickLeaveBalance(Integer sickLeaveBalance) { this.sickLeaveBalance = sickLeaveBalance; }
    
    public Integer getCasualLeaveBalance() { return casualLeaveBalance; }
    public void setCasualLeaveBalance(Integer casualLeaveBalance) { this.casualLeaveBalance = casualLeaveBalance; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
} 