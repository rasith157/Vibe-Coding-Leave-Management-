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
import io.micronaut.validation.Validated;

import jakarta.inject.Inject;
import jakarta.validation.Valid;

import java.util.Optional;

@Controller("/api/auth")
@Validated
public class AuthController {
    
    @Inject
    private UserService userService;
    
    @Inject
    private JwtService jwtService;
    
    @Post("/login")
    public HttpResponse<AuthResponse> login(@Valid @Body LoginRequest loginRequest) {
        try {
            Optional<User> userOpt = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            
            if (userOpt.isEmpty()) {
                return HttpResponse.unauthorized();
            }
            
            User user = userOpt.get();
            String token = jwtService.generateToken(user);
            UserResponse userResponse = new UserResponse(user);
            
            return HttpResponse.ok(new AuthResponse(token, userResponse));
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }
    
    @Post("/register")
    public HttpResponse<AuthResponse> register(@Valid @Body RegisterRequest registerRequest) {
        try {
            User user = userService.register(registerRequest);
            String token = jwtService.generateToken(user);
            UserResponse userResponse = new UserResponse(user);
            
            return HttpResponse.created(new AuthResponse(token, userResponse, "Registration successful"));
        } catch (RuntimeException e) {
            return HttpResponse.badRequest();
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }
    
    @Get("/test")
    public HttpResponse<String> testConnection() {
        return HttpResponse.ok("Backend connection successful! LeaveFlow API is running.");
    }
} 