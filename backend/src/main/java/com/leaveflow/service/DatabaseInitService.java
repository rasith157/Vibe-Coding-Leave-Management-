package com.leaveflow.service;

import com.leaveflow.entity.User;
import com.leaveflow.repository.UserRepository;
import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.runtime.server.event.ServerStartupEvent;
import jakarta.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
public class DatabaseInitService implements ApplicationEventListener<ServerStartupEvent> {
    
    private static final Logger LOG = LoggerFactory.getLogger(DatabaseInitService.class);
    
    private final UserRepository userRepository;
    private final UserService userService;
    
    public DatabaseInitService(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }
    
    @Override
    public void onApplicationEvent(ServerStartupEvent event) {
        LOG.info("Initializing database...");
        
        try {
            // Check if admin user exists
            if (!userRepository.existsByEmail("admin@leaveflow.com")) {
                LOG.info("Creating default admin user...");
                User admin = new User();
                admin.setFirstName("System");
                admin.setLastName("Admin");
                admin.setEmail("admin@leaveflow.com");
                admin.setPassword(userService.hashPassword("admin123"));
                admin.setRole("ADMIN");
                admin.setActive(true);
                
                userRepository.save(admin);
                LOG.info("Default admin user created: admin@leaveflow.com / admin123");
            }
            
            // Check if test employee exists
            if (!userRepository.existsByEmail("employee@leaveflow.com")) {
                LOG.info("Creating test employee user...");
                User employee = new User();
                employee.setFirstName("Test");
                employee.setLastName("Employee");
                employee.setEmail("employee@leaveflow.com");
                employee.setPassword(userService.hashPassword("employee123"));
                employee.setRole("EMPLOYEE");
                employee.setActive(true);
                
                userRepository.save(employee);
                LOG.info("Test employee user created: employee@leaveflow.com / employee123");
            }
            
            LOG.info("Database initialization completed successfully!");
            
        } catch (Exception e) {
            LOG.error("Failed to initialize database: {}", e.getMessage(), e);
        }
    }
} 