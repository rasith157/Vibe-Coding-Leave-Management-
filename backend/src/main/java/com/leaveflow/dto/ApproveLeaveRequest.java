package com.leaveflow.dto;

import jakarta.validation.constraints.NotBlank;

public class ApproveLeaveRequest {
    
    @NotBlank
    private String status; // APPROVED or REJECTED
    
    private String comments;
    
    // Constructors
    public ApproveLeaveRequest() {}
    
    public ApproveLeaveRequest(String status, String comments) {
        this.status = status;
        this.comments = comments;
    }
    
    // Getters and Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
} 