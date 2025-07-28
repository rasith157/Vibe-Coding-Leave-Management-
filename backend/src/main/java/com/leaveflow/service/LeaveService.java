package com.leaveflow.service;

import com.leaveflow.entity.Leave;
import com.leaveflow.entity.User;
import com.leaveflow.repository.LeaveRepository;
import com.leaveflow.repository.UserRepository;
import com.leaveflow.dto.CreateLeaveRequest;
import com.leaveflow.dto.LeaveResponse;
import com.leaveflow.dto.ApproveLeaveRequest;

import jakarta.inject.Singleton;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Singleton
public class LeaveService {
    
    @Inject
    private LeaveRepository leaveRepository;
    
    @Inject
    private UserRepository userRepository;
    
    @Inject
    private UserService userService;
    
    public LeaveResponse createLeave(Long userId, CreateLeaveRequest request) {
        // Validate user exists
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        
        // Validate leave type
        if (!isValidLeaveType(request.getLeaveType())) {
            throw new RuntimeException("Invalid leave type");
        }
        
        // Check if user has sufficient leave balance
        if (!hasEnoughLeaveBalance(user, request.getLeaveType(), request.getDuration())) {
            throw new RuntimeException("Insufficient leave balance for " + request.getLeaveType().toLowerCase() + " leave");
        }
        
        // Validate dates
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Start date cannot be after end date");
        }
        
        // Create leave entity
        Leave leave = new Leave();
        leave.setUserId(userId);
        leave.setLeaveType(request.getLeaveType().toUpperCase());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setDuration(request.getDuration());
        leave.setReason(request.getReason());
        leave.setStatus("PENDING");
        
        Leave savedLeave = leaveRepository.save(leave);
        return new LeaveResponse(savedLeave, user);
    }
    
    public List<LeaveResponse> getUserLeaves(Long userId) {
        List<Leave> leaves = leaveRepository.findByUserId(userId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        return leaves.stream()
                .map(leave -> {
                    LeaveResponse response = new LeaveResponse(leave);
                    if (userOpt.isPresent()) {
                        response.setUserName(userOpt.get().getFullName());
                        response.setUserEmail(userOpt.get().getEmail());
                    }
                    
                    // Get approver info if available
                    if (leave.getApprovedBy() != null) {
                        userRepository.findById(leave.getApprovedBy())
                                .ifPresent(approver -> response.setApprovedByName(approver.getFullName()));
                    }
                    
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public List<LeaveResponse> getAllLeaves() {
        List<Leave> leaves = leaveRepository.findAll();
        return leaves.stream()
                .map(this::enrichLeaveResponse)
                .collect(Collectors.toList());
    }
    
    public List<LeaveResponse> getPendingLeaves() {
        List<Leave> leaves = leaveRepository.findByStatus("PENDING");
        return leaves.stream()
                .map(this::enrichLeaveResponse)
                .collect(Collectors.toList());
    }
    
    public LeaveResponse approveLeave(Long leaveId, Long approverId, ApproveLeaveRequest request) {
        // Validate approver exists and is admin
        Optional<User> approverOpt = userRepository.findById(approverId);
        if (approverOpt.isEmpty()) {
            throw new RuntimeException("Approver not found");
        }
        
        User approver = approverOpt.get();
        if (!"ADMIN".equals(approver.getRole())) {
            throw new RuntimeException("Only admins can approve leave requests");
        }
        
        // Validate leave exists and is pending
        Optional<Leave> leaveOpt = leaveRepository.findById(leaveId);
        if (leaveOpt.isEmpty()) {
            throw new RuntimeException("Leave request not found");
        }
        
        Leave leave = leaveOpt.get();
        if (!"PENDING".equals(leave.getStatus())) {
            throw new RuntimeException("Leave request is not in pending status");
        }
        
        // Validate status
        String status = request.getStatus().toUpperCase();
        if (!"APPROVED".equals(status) && !"REJECTED".equals(status)) {
            throw new RuntimeException("Invalid status. Must be APPROVED or REJECTED");
        }
        
        // Update leave status
        leave.setStatus(status);
        leave.setApprovedBy(approverId);
        leave.setApprovedAt(LocalDateTime.now());
        leave.setComments(request.getComments());
        
        Leave savedLeave = leaveRepository.update(leave);
        
        // If approved, deduct from user's leave balance
        if ("APPROVED".equals(status)) {
            try {
                userService.updateLeaveBalance(leave.getUserId(), leave.getLeaveType(), leave.getDuration());
            } catch (Exception e) {
                // Log error but don't fail the approval
                System.err.println("Failed to update leave balance: " + e.getMessage());
            }
        }
        
        return enrichLeaveResponse(savedLeave);
    }
    
    public Optional<LeaveResponse> getLeaveById(Long leaveId) {
        return leaveRepository.findById(leaveId)
                .map(this::enrichLeaveResponse);
    }
    
    public void deleteLeave(Long leaveId, Long userId) {
        Optional<Leave> leaveOpt = leaveRepository.findById(leaveId);
        if (leaveOpt.isEmpty()) {
            throw new RuntimeException("Leave request not found");
        }
        
        Leave leave = leaveOpt.get();
        
        // Only allow deletion by the user who created it and only if it's pending
        if (!leave.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own leave requests");
        }
        
        if (!"PENDING".equals(leave.getStatus())) {
            throw new RuntimeException("You can only delete pending leave requests");
        }
        
        leaveRepository.deleteById(leaveId);
    }
    
    public List<LeaveResponse> getLeavesByStatus(String status) {
        List<Leave> leaves = leaveRepository.findByStatus(status.toUpperCase());
        return leaves.stream()
                .map(this::enrichLeaveResponse)
                .collect(Collectors.toList());
    }
    
    private LeaveResponse enrichLeaveResponse(Leave leave) {
        LeaveResponse response = new LeaveResponse(leave);
        
        // Get user info
        userRepository.findById(leave.getUserId())
                .ifPresent(user -> {
                    response.setUserName(user.getFullName());
                    response.setUserEmail(user.getEmail());
                });
        
        // Get approver info
        if (leave.getApprovedBy() != null) {
            userRepository.findById(leave.getApprovedBy())
                    .ifPresent(approver -> response.setApprovedByName(approver.getFullName()));
        }
        
        return response;
    }
    
    private boolean isValidLeaveType(String leaveType) {
        String type = leaveType.toUpperCase();
        return "ANNUAL".equals(type) || "SICK".equals(type) || 
               "CASUAL".equals(type) || "EMERGENCY".equals(type);
    }
    
    private boolean hasEnoughLeaveBalance(User user, String leaveType, int requestedDays) {
        switch (leaveType.toUpperCase()) {
            case "ANNUAL":
                return user.getAnnualLeaveBalance() >= requestedDays;
            case "SICK":
                return user.getSickLeaveBalance() >= requestedDays;
            case "CASUAL":
                return user.getCasualLeaveBalance() >= requestedDays;
            case "EMERGENCY":
                // Emergency leave might have different rules - for now, allow if any balance exists
                return user.getAnnualLeaveBalance() > 0 || 
                       user.getSickLeaveBalance() > 0 || 
                       user.getCasualLeaveBalance() > 0;
            default:
                return false;
        }
    }
    
    public int getUsedLeaveDays(Long userId, String leaveType, int year) {
        Integer used = leaveRepository.sumApprovedLeaveDaysByUserAndTypeAndYear(userId, leaveType.toUpperCase(), year);
        return used != null ? used : 0;
    }
    
    public int getRemainingLeaveDays(Long userId, String leaveType) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return 0;
        }
        
        User user = userOpt.get();
        int currentYear = Year.now().getValue();
        int usedDays = getUsedLeaveDays(userId, leaveType, currentYear);
        
        switch (leaveType.toUpperCase()) {
            case "ANNUAL":
                return Math.max(0, user.getAnnualLeaveBalance() - usedDays);
            case "SICK":
                return Math.max(0, user.getSickLeaveBalance() - usedDays);
            case "CASUAL":
                return Math.max(0, user.getCasualLeaveBalance() - usedDays);
            default:
                return 0;
        }
    }
} 