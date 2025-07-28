package com.leaveflow.dto;

import com.leaveflow.entity.Leave;
import com.leaveflow.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveResponse {
    
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer duration;
    private String reason;
    private String status;
    private Long approvedBy;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private String comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public LeaveResponse() {}
    
    public LeaveResponse(Leave leave) {
        this.id = leave.getId();
        this.userId = leave.getUserId();
        this.leaveType = leave.getLeaveType();
        this.startDate = leave.getStartDate();
        this.endDate = leave.getEndDate();
        this.duration = leave.getDuration();
        this.reason = leave.getReason();
        this.status = leave.getStatus();
        this.approvedBy = leave.getApprovedBy();
        this.approvedAt = leave.getApprovedAt();
        this.comments = leave.getComments();
        this.createdAt = leave.getCreatedAt();
        this.updatedAt = leave.getUpdatedAt();
    }
    
    public LeaveResponse(Leave leave, User user) {
        this(leave);
        if (user != null) {
            this.userName = user.getFullName();
            this.userEmail = user.getEmail();
        }
    }
    
    public LeaveResponse(Leave leave, User user, User approver) {
        this(leave, user);
        if (approver != null) {
            this.approvedByName = approver.getFullName();
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Long getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }
    
    public String getApprovedByName() { return approvedByName; }
    public void setApprovedByName(String approvedByName) { this.approvedByName = approvedByName; }
    
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 