// Audit Logging Demonstration Script
// This script demonstrates the comprehensive audit logging capabilities

import { AuditLoggerService } from '../services/audit-logger.service';

export class AuditDemo {
  constructor(private auditLogger: AuditLoggerService) {}

  demonstrateLogging() {
    console.log('🎯 Starting Audit Logging Demonstration...\n');

    // 1. System Initialization
    this.auditLogger.logInfo('SYSTEM', 'Demo Started', {
      demoVersion: '1.0.0',
      timestamp: new Date().toISOString()
    });

    // 2. Authentication Examples
    console.log('📝 Authentication Logging Examples:');
    this.auditLogger.logAuthAttempt('user@example.com', true);
    this.auditLogger.logAuthAttempt('invalid@example.com', false, 'Invalid credentials');
    
    this.auditLogger.logRegistrationAttempt({
      email: 'newuser@example.com',
      firstName: 'John',
      lastName: 'Doe'
    }, true);

    // 3. Form Interaction Examples
    console.log('📋 Form Logging Examples:');
    this.auditLogger.logFormValidation('login-form', 'email', true);
    this.auditLogger.logFormValidation('login-form', 'password', false, 'Password too short');
    this.auditLogger.logFormSubmission('register-form', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }, true);

    // 4. Navigation Examples
    console.log('🧭 Navigation Logging Examples:');
    this.auditLogger.logNavigation('/home', '/login');
    this.auditLogger.logNavigation('/login', '/register');
    this.auditLogger.logNavigation('/register', '/dashboard');

    // 5. User Action Examples
    console.log('👤 User Action Logging Examples:');
    this.auditLogger.logUserAction('Button Click', 'LoginComponent', {
      buttonText: 'Sign In',
      timeToClick: 2300
    });
    this.auditLogger.logUserAction('Feature Card Hover', 'HomeComponent', {
      featureName: 'Analytics & Insights',
      hoverDuration: 1500
    });

    // 6. API Call Examples
    console.log('🌐 API Call Logging Examples:');
    this.auditLogger.logApiCall('POST', '/api/auth/login', 200, 450);
    this.auditLogger.logApiCall('GET', '/api/user/profile', 401, 320, new Error('Unauthorized'));
    this.auditLogger.logApiCall('POST', '/api/leave/request', 201, 890);

    // 7. Error Logging Examples
    console.log('❌ Error Logging Examples:');
    this.auditLogger.logError('AUTH', 'Session Expired', new Error('JWT token expired'), {
      userId: 'user_123',
      lastActivity: new Date(Date.now() - 3600000).toISOString()
    });
    this.auditLogger.logSimpleError('FORM', 'Validation Failed', {
      fieldCount: 5,
      errorCount: 2
    });

    // 8. Component Lifecycle Examples
    console.log('🔄 Component Lifecycle Logging Examples:');
    this.auditLogger.logComponentLifecycle('LoginComponent', 'OnInit', {
      loadTime: 150
    });
    this.auditLogger.logComponentLifecycle('DashboardComponent', 'OnDestroy', {
      sessionDuration: 45000
    });

    // 9. Security Events
    console.log('🔒 Security Event Logging Examples:');
    this.auditLogger.logWarn('AUTH', 'Multiple Failed Login Attempts', {
      email: 'attacker@suspicious.com',
      attemptCount: 5,
      ipAddress: '192.168.1.100',
      userAgent: 'Suspicious Bot'
    });

    // 10. Debug Information
    console.log('🐛 Debug Logging Examples:');
    this.auditLogger.logDebug('SYSTEM', 'Performance Metrics', {
      pageLoadTime: 1250,
      apiResponseTime: 340,
      renderTime: 56
    });

    console.log('\n✅ Audit Logging Demonstration Complete!');
    console.log('📊 Check the browser console to see all logged events.');
    console.log('🔍 In production, these logs would be sent to your logging service.');
  }

  demonstrateUserJourney() {
    console.log('🚀 Demonstrating Complete User Journey...\n');

    // User arrives at homepage
    this.auditLogger.logNavigation('direct', '/home');
    this.auditLogger.logUserAction('Page Load', 'HomeComponent', {
      referrer: 'direct',
      userAgent: navigator.userAgent
    });

    // User clicks on features
    setTimeout(() => {
      this.auditLogger.logUserAction('Feature Card Hover', 'HomeComponent', {
        featureName: 'Easy Request Management'
      });
    }, 1000);

    // User decides to register
    setTimeout(() => {
      this.auditLogger.logUserAction('Get Started Clicked', 'HomeComponent', {
        timeOnPage: 5000
      });
      this.auditLogger.logNavigation('/home', '/register');
    }, 2000);

    // User fills registration form
    setTimeout(() => {
      this.auditLogger.logFormValidation('register-form', 'firstName', true);
      this.auditLogger.logFormValidation('register-form', 'email', true);
      this.auditLogger.logFormValidation('register-form', 'password', true);
    }, 3000);

    // User submits registration
    setTimeout(() => {
      this.auditLogger.logFormSubmission('register-form', {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com'
      }, true);
      
      this.auditLogger.logRegistrationAttempt({
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User'
      }, true);
      
      this.auditLogger.setUserId('user_demo_123');
    }, 4000);

    console.log('📈 User journey logging complete - check console for timeline!');
  }

  demonstrateErrorScenarios() {
    console.log('⚠️ Demonstrating Error Scenarios...\n');

    // Failed login attempts
    this.auditLogger.logAuthAttempt('wrong@email.com', false, 'User not found');
    this.auditLogger.logAuthAttempt('user@example.com', false, 'Invalid password');
    this.auditLogger.logAuthAttempt('user@example.com', false, 'Account locked');

    // API failures
    this.auditLogger.logApiCall('POST', '/api/auth/login', 500, 5000, new Error('Server error'));
    this.auditLogger.logApiCall('GET', '/api/user/data', 404, 200, new Error('User not found'));

    // Form validation errors
    this.auditLogger.logFormValidation('login-form', 'email', false, 'Invalid email format');
    this.auditLogger.logFormValidation('register-form', 'password', false, 'Password too weak');

    // System errors
    this.auditLogger.logError('SYSTEM', 'Database Connection Failed', new Error('Connection timeout'), {
      retryCount: 3,
      lastAttempt: new Date().toISOString()
    });

    console.log('🔍 Error scenarios logged - useful for debugging and monitoring!');
  }
} 