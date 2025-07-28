package com.leaveflow.repository;

import com.leaveflow.entity.User;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(String role);
    
    List<User> findByActive(boolean active);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByEmailAndPassword(String email, String password);
} 