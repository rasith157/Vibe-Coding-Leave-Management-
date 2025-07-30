package com.leaveflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;
    
    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;
    
    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @NotBlank
    @Size(min = 6)
    @Column(name = "password", nullable = false)
    private String password;
    
    @NotBlank
    @Column(name = "role", nullable = false)
    private String role; // EMPLOYEE or ADMIN
    
    @Column(name = "active", nullable = false)
    private boolean active = true;
    
    @Column(name = "annual_leave_balance")
    private Integer annualLeaveBalance = 25; // Default 25 days
    
    @Column(name = "sick_leave_balance")
    private Integer sickLeaveBalance = 10; // Default 10 days
    
    @Column(name = "casual_leave_balance")
    private Integer casualLeaveBalance = 5; // Default 5 days
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public User() {}
    
    public User(String firstName, String lastName, String email, String password, String role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
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
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
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