package com.leaveflow.controller;

import com.leaveflow.dto.AuthResponse;
import com.leaveflow.dto.LoginRequest;
import com.leaveflow.dto.RegisterRequest;
import com.leaveflow.dto.UserResponse;
import com.leaveflow.entity.User;
import com.leaveflow.service.UserService;
import com.leaveflow.service.JwtService;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import io.micronaut.validation.Validated;

import jakarta.inject.Inject;
import jakarta.validation.Valid;

import java.util.Optional;

@Controller("/api/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
@Validated
public class AuthController {
    
    @Inject
    private UserService userService;
    
    @Inject
    private JwtService jwtService;
    
    @Post("/login")
    public HttpResponse<AuthResponse> login(@Valid @Body LoginRequest loginRequest) {
        System.out.println("🔑 LOGIN ATTEMPT - Email: " + loginRequest.getEmail());
        
        try {
            Optional<User> userOpt = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            
            if (userOpt.isEmpty()) {
                System.out.println("❌ LOGIN FAILED - Invalid credentials for: " + loginRequest.getEmail());
                return HttpResponse.unauthorized();
            }
            
            User user = userOpt.get();
            System.out.println("✅ LOGIN SUCCESS - User: " + user.getEmail() + " (ID: " + user.getId() + ")");
            
            String token = jwtService.generateToken(user);
            UserResponse userResponse = new UserResponse(user);
            
            System.out.println("🎫 JWT TOKEN GENERATED for user: " + user.getEmail());
            return HttpResponse.ok(new AuthResponse(token, userResponse));
        } catch (Exception e) {
            System.out.println("💥 LOGIN ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    @Post("/register")
    public HttpResponse<AuthResponse> register(@Valid @Body RegisterRequest registerRequest) {
        System.out.println("📝 REGISTER ATTEMPT - Email: " + registerRequest.getEmail() + 
                          " Name: " + registerRequest.getFirstName() + " " + registerRequest.getLastName());
        
        try {
            User user = userService.register(registerRequest);
            System.out.println("✅ REGISTRATION SUCCESS - User: " + user.getEmail() + " (ID: " + user.getId() + ")");
            
            String token = jwtService.generateToken(user);
            UserResponse userResponse = new UserResponse(user);
            
            System.out.println("🎫 JWT TOKEN GENERATED for new user: " + user.getEmail());
            return HttpResponse.created(new AuthResponse(token, userResponse, "Registration successful"));
        } catch (RuntimeException e) {
            System.out.println("❌ REGISTRATION FAILED - RuntimeException: " + e.getMessage());
            return HttpResponse.badRequest();
        } catch (Exception e) {
            System.out.println("💥 REGISTRATION ERROR: " + e.getMessage());
            e.printStackTrace();
            return HttpResponse.serverError();
        }
    }
    
    @Get("/test")
    public HttpResponse<String> testConnection() {
        System.out.println("🔧 TEST ENDPOINT ACCESSED - Backend is running!");
        return HttpResponse.ok("Backend connection successful! LeaveFlow API is running.");
    }
} 