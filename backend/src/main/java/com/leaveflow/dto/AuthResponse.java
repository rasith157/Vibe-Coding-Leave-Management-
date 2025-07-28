package com.leaveflow.dto;

public class AuthResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private UserResponse user;
    private String message;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
        this.message = "Authentication successful";
    }
    
    public AuthResponse(String token, UserResponse user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
} 