package com.leaveflow.service;

import com.leaveflow.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import jakarta.inject.Singleton;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Singleton
public class JwtService {
    
    private final String SECRET_KEY = "YourSecretKeyForJWTShouldBeAtLeast32CharactersLong123456789";
    private final long JWT_EXPIRATION = 86400000; // 24 hours
    
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        
        return createToken(claims, user.getEmail());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String extractEmail(String token) {
        Object claim = extractClaim(token, "sub");
        return claim != null ? claim.toString() : null;
    }
    
    public Long extractUserId(String token) {
        return Long.valueOf(extractClaim(token, "userId").toString());
    }
    
    public String extractRole(String token) {
        Object claim = extractClaim(token, "role");
        return claim != null ? claim.toString() : null;
    }
    
    private Object extractClaim(String token, String claimName) {
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get(claimName);
    }
    
    public boolean isTokenExpired(String token) {
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }
    
    public boolean validateToken(String token, String email) {
        final String tokenEmail = extractEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }
} 