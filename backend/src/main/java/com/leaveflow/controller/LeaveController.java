package com.leaveflow.controller;

import com.leaveflow.dto.CreateLeaveRequest;
import com.leaveflow.dto.LeaveResponse;
import com.leaveflow.dto.ApproveLeaveRequest;
import com.leaveflow.service.LeaveService;
import com.leaveflow.service.JwtService;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import io.micronaut.validation.Validated;

import jakarta.inject.Inject;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@Controller("/api/leaves")
@Secured(SecurityRule.IS_AUTHENTICATED)
@Validated
public class LeaveController {
    
    @Inject
    private LeaveService leaveService;
    
    @Inject
    private JwtService jwtService;
    
    /**
     * Create a new leave request
     */
    @Post
    public HttpResponse<LeaveResponse> createLeave(
            @Valid @Body CreateLeaveRequest request,
            @Header("Authorization") String authHeader) {
        
        System.out.println("📝 CREATE LEAVE REQUEST - Type: " + request.getLeaveType() + 
                          " Duration: " + request.getDuration() + " days");
        
        try {
            Long userId = extractUserIdFromToken(authHeader);
            LeaveResponse response = leaveService.createLeave(userId, request);
            
            System.out.println("✅ LEAVE REQUEST CREATED - ID: " + response.getId() + 
                             " for User: " + userId);
            return HttpResponse.created(response);
        } catch (RuntimeException e) {
            System.out.println("❌ LEAVE REQUEST FAILED - Error: " + e.getMessage());
            return HttpResponse.badRequest();
        } catch (Exception e) {
            System.out.println("💥 LEAVE REQUEST ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    /**
     * Get user's own leave requests
     */
    @Get("/my")
    public HttpResponse<List<LeaveResponse>> getMyLeaves(@Header("Authorization") String authHeader) {
        System.out.println("📋 GET MY LEAVES REQUEST");
        
        try {
            Long userId = extractUserIdFromToken(authHeader);
            List<LeaveResponse> leaves = leaveService.getUserLeaves(userId);
            
            System.out.println("✅ RETRIEVED " + leaves.size() + " leaves for user: " + userId);
            return HttpResponse.ok(leaves);
        } catch (Exception e) {
            System.out.println("💥 GET MY LEAVES ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    /**
     * Get all leave requests (Admin only)
     */
    @Get
    @Secured({"ADMIN"})
    public HttpResponse<List<LeaveResponse>> getAllLeaves() {
        System.out.println("👥 GET ALL LEAVES REQUEST (Admin)");
        
        try {
            List<LeaveResponse> leaves = leaveService.getAllLeaves();
            System.out.println("✅ RETRIEVED " + leaves.size() + " total leaves");
            return HttpResponse.ok(leaves);
        } catch (Exception e) {
            System.out.println("💥 GET ALL LEAVES ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    /**
     * Get pending leave requests (Admin only)
     */
    @Get("/pending")
    @Secured({"ADMIN"})
    public HttpResponse<List<LeaveResponse>> getPendingLeaves() {
        System.out.println("⏳ GET PENDING LEAVES REQUEST (Admin)");
        
        try {
            List<LeaveResponse> leaves = leaveService.getPendingLeaves();
            System.out.println("✅ RETRIEVED " + leaves.size() + " pending leaves");
            return HttpResponse.ok(leaves);
        } catch (Exception e) {
            System.out.println("💥 GET PENDING LEAVES ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    /**
     * Get leaves by status (Admin only)
     */
    @Get("/status/{status}")
    @Secured({"ADMIN"})
    public HttpResponse<List<LeaveResponse>> getLeavesByStatus(@PathVariable String status) {
        System.out.println("🔍 GET LEAVES BY STATUS REQUEST - Status: " + status);
        
        try {
            List<LeaveResponse> leaves = leaveService.getLeavesByStatus(status);
            System.out.println("✅ RETRIEVED " + leaves.size() + " leaves with status: " + status);
            return HttpResponse.ok(leaves);
        } catch (Exception e) {
            System.out.println("💥 GET LEAVES BY STATUS ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    /**
     * Get specific leave request by ID
     */
    @Get("/{id}")
    public HttpResponse<LeaveResponse> getLeaveById(
            @PathVariable Long id,
            @Header("Authorization") String authHeader) {
        
        System.out.println("🔍 GET LEAVE BY ID REQUEST - ID: " + id);
        
        try {
            Long userId = extractUserIdFromToken(authHeader);
            Optional<LeaveResponse> leaveOpt = leaveService.getLeaveById(id);
            
            if (leaveOpt.isEmpty()) {
                System.out.println("❌ LEAVE NOT FOUND - ID: " + id);
                return HttpResponse.notFound();
            }
            
            LeaveResponse leave = leaveOpt.get();
            
            // Check if user can view this leave (own leave or admin)
            String userRole = extractRoleFromToken(authHeader);
            if (!leave.getUserId().equals(userId) && !"ADMIN".equals(userRole)) {
                System.out.println("🚫 ACCESS DENIED - User " + userId + " cannot view leave " + id);
                return HttpResponse.unauthorized();
            }
            
            System.out.println("✅ LEAVE RETRIEVED - ID: " + id);
            return HttpResponse.ok(leave);
        } catch (Exception e) {
            System.out.println("💥 GET LEAVE BY ID ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    /**
     * Approve or reject leave request (Admin only)
     */
    @Put("/{id}/approve")
    @Secured({"ADMIN"})
    public HttpResponse<LeaveResponse> approveLeave(
            @PathVariable Long id,
            @Valid @Body ApproveLeaveRequest request,
            @Header("Authorization") String authHeader) {
        
        System.out.println("⚖️ APPROVE LEAVE REQUEST - ID: " + id + " Status: " + request.getStatus());
        
        try {
            Long approverId = extractUserIdFromToken(authHeader);
            LeaveResponse response = leaveService.approveLeave(id, approverId, request);
            
            System.out.println("✅ LEAVE " + request.getStatus() + " - ID: " + id + 
                             " by Admin: " + approverId);
            return HttpResponse.ok(response);
        } catch (RuntimeException e) {
            System.out.println("❌ LEAVE APPROVAL FAILED - Error: " + e.getMessage());
            return HttpResponse.badRequest();
        } catch (Exception e) {
            System.out.println("💥 LEAVE APPROVAL ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    /**
     * Delete leave request (only if pending and by owner)
     */
    @Delete("/{id}")
    public HttpResponse<Void> deleteLeave(
            @PathVariable Long id,
            @Header("Authorization") String authHeader) {
        
        System.out.println("🗑️ DELETE LEAVE REQUEST - ID: " + id);
        
        try {
            Long userId = extractUserIdFromToken(authHeader);
            leaveService.deleteLeave(id, userId);
            
            System.out.println("✅ LEAVE DELETED - ID: " + id + " by User: " + userId);
            return HttpResponse.noContent();
        } catch (RuntimeException e) {
            System.out.println("❌ LEAVE DELETION FAILED - Error: " + e.getMessage());
            return HttpResponse.badRequest();
        } catch (Exception e) {
            System.out.println("💥 LEAVE DELETION ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    /**
     * Get user's leave balance summary
     */
    @Get("/balance")
    public HttpResponse<Object> getLeaveBalance(@Header("Authorization") String authHeader) {
        System.out.println("📊 GET LEAVE BALANCE REQUEST");
        
        try {
            Long userId = extractUserIdFromToken(authHeader);
            
            // Create balance summary
            var balance = new Object() {
                public final int annualRemaining = leaveService.getRemainingLeaveDays(userId, "ANNUAL");
                public final int sickRemaining = leaveService.getRemainingLeaveDays(userId, "SICK");
                public final int casualRemaining = leaveService.getRemainingLeaveDays(userId, "CASUAL");
                public final int annualUsed = leaveService.getUsedLeaveDays(userId, "ANNUAL", java.time.Year.now().getValue());
                public final int sickUsed = leaveService.getUsedLeaveDays(userId, "SICK", java.time.Year.now().getValue());
                public final int casualUsed = leaveService.getUsedLeaveDays(userId, "CASUAL", java.time.Year.now().getValue());
            };
            
            System.out.println("✅ LEAVE BALANCE RETRIEVED for user: " + userId);
            return HttpResponse.ok(balance);
        } catch (Exception e) {
            System.out.println("💥 GET LEAVE BALANCE ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtService.extractUserId(token);
    }
    
    private String extractRoleFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtService.extractRole(token);
    }
} 