package com.leaveflow.entity;

import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.DateCreated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@MappedEntity("history")
public class History {
    
    @Id
    @GeneratedValue(GeneratedValue.Type.IDENTITY)
    private Long id;
    
    @NotNull
    private Long userId;
    
    @NotNull
    private Long leaveId;
    
    @NotBlank
    private String action; // APPLIED, APPROVED, REJECTED, MODIFIED, CANCELLED
    
    @NotBlank
    private String description;
    
    private Long performedBy; // User ID who performed the action
    
    private String oldStatus;
    private String newStatus;
    
    private String additionalData; // JSON string for any additional data
    
    @DateCreated
    private LocalDateTime timestamp;
    
    // Constructors
    public History() {}
    
    public History(Long userId, Long leaveId, String action, String description, Long performedBy) {
        this.userId = userId;
        this.leaveId = leaveId;
        this.action = action;
        this.description = description;
        this.performedBy = performedBy;
    }
    
    public History(Long userId, Long leaveId, String action, String description, Long performedBy, 
                   String oldStatus, String newStatus) {
        this.userId = userId;
        this.leaveId = leaveId;
        this.action = action;
        this.description = description;
        this.performedBy = performedBy;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getLeaveId() { return leaveId; }
    public void setLeaveId(Long leaveId) { this.leaveId = leaveId; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Long getPerformedBy() { return performedBy; }
    public void setPerformedBy(Long performedBy) { this.performedBy = performedBy; }
    
    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }
    
    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }
    
    public String getAdditionalData() { return additionalData; }
    public void setAdditionalData(String additionalData) { this.additionalData = additionalData; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
} 