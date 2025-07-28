package com.leaveflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public class CreateLeaveRequest {
    
    @NotBlank
    private String leaveType; // ANNUAL, SICK, CASUAL, EMERGENCY
    
    @NotNull
    @Future
    private LocalDate startDate;
    
    @NotNull
    @Future
    private LocalDate endDate;
    
    @NotNull
    @Min(1)
    private Integer duration; // Number of days
    
    private String reason;
    
    // Constructors
    public CreateLeaveRequest() {}
    
    public CreateLeaveRequest(String leaveType, LocalDate startDate, LocalDate endDate, Integer duration, String reason) {
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.duration = duration;
        this.reason = reason;
    }
    
    // Getters and Setters
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
} 