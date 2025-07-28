# 🔍 LeaveFlow Audit Logging System

## Overview

LeaveFlow now includes a comprehensive audit logging system that tracks user actions, authentication events, form interactions, API calls, and system events. This system provides detailed insights for debugging, security monitoring, and compliance purposes.

## 🎯 Features

### ✅ **Complete Activity Tracking**
- **Authentication Events** - Login attempts, registrations, session management
- **Form Interactions** - Field validation, form submissions, completion tracking
- **Navigation Events** - Page visits, user journey tracking
- **User Actions** - Button clicks, feature interactions, hover events
- **API Calls** - Request/response logging with performance metrics
- **Component Lifecycle** - Component load/unload tracking
- **Error Logging** - Structured error tracking with context
- **Security Events** - Failed attempts, suspicious activity

### 🛡️ **Security & Privacy**
- **Email Masking** - Automatically masks email addresses in logs
- **Session Tracking** - Unique session IDs for user journey tracking
- **User ID Management** - Secure user identification
- **Production Ready** - Configurable for different environments

### 📊 **Structured Logging**
- **Categorized Logs** - AUTH, FORM, NAVIGATION, API, USER_ACTION, SYSTEM
- **Log Levels** - INFO, WARN, ERROR, DEBUG
- **Rich Context** - Detailed metadata for every event
- **Timestamps** - ISO 8601 formatted timestamps

## 🚀 Usage Examples

### Authentication Logging
```typescript
// Login attempt
this.auditLogger.logAuthAttempt('user@example.com', true);
this.auditLogger.logAuthAttempt('invalid@example.com', false, 'Invalid credentials');

// Registration attempt
this.auditLogger.logRegistrationAttempt({
  email: 'newuser@example.com',
  firstName: 'John',
  lastName: 'Doe'
}, true);

// Set user context
this.auditLogger.setUserId('user_123');
```

### Form Interaction Logging
```typescript
// Field validation
this.auditLogger.logFormValidation('login-form', 'email', true);
this.auditLogger.logFormValidation('login-form', 'password', false, 'Password too short');

// Form submission
this.auditLogger.logFormSubmission('register-form', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
}, true);
```

### User Action Logging
```typescript
// Button clicks
this.auditLogger.logUserAction('Button Click', 'LoginComponent', {
  buttonText: 'Sign In',
  timeToClick: 2300
});

// Feature interactions
this.auditLogger.logUserAction('Feature Card Hover', 'HomeComponent', {
  featureName: 'Analytics & Insights',
  hoverDuration: 1500
});
```

### API Call Logging
```typescript
// Successful API call
this.auditLogger.logApiCall('POST', '/api/auth/login', 200, 450);

// Failed API call
this.auditLogger.logApiCall('GET', '/api/user/profile', 401, 320, new Error('Unauthorized'));
```

### Error Logging
```typescript
// Structured error logging
this.auditLogger.logError('AUTH', 'Session Expired', new Error('JWT token expired'), {
  userId: 'user_123',
  lastActivity: new Date(Date.now() - 3600000).toISOString()
});

// Simple error logging
this.auditLogger.logSimpleError('FORM', 'Validation Failed', {
  fieldCount: 5,
  errorCount: 2
});
```

## 📋 Log Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `AUTH` | Authentication & authorization events | Login, logout, registration, session management |
| `FORM` | Form interactions & validation | Field validation, form submission, completion tracking |
| `NAVIGATION` | Page navigation & routing | Page visits, navigation flows, user journey |
| `API` | API calls & responses | HTTP requests, response times, errors |
| `USER_ACTION` | User interface interactions | Button clicks, hovers, feature usage |
| `SYSTEM` | System & component events | Component lifecycle, performance metrics |

## 📊 Log Levels

| Level | Purpose | Usage |
|-------|---------|-------|
| `INFO` | General information | Normal operations, successful actions |
| `WARN` | Warning conditions | Potential issues, deprecated features |
| `ERROR` | Error conditions | Failed operations, exceptions |
| `DEBUG` | Debug information | Detailed troubleshooting data |

## 🔧 Implementation Details

### Service Architecture
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuditLoggerService {
  private sessionId: string;
  private userId?: string;
  
  // Core logging methods
  logInfo(category, action, details)
  logWarn(category, action, details)
  logError(category, action, error, context)
  logDebug(category, action, details)
  
  // Specialized methods
  logAuthAttempt(email, success, errorMessage?)
  logRegistrationAttempt(userData, success, errorMessage?)
  logFormSubmission(formName, formData, isValid)
  logNavigation(from, to)
  logUserAction(action, component, details)
  logApiCall(method, url, statusCode?, responseTime?, error?)
}
```

### Component Integration
Every component includes comprehensive logging:

```typescript
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private auditLogger: AuditLoggerService) {}

  ngOnInit() {
    this.auditLogger.logComponentLifecycle('LoginComponent', 'OnInit', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    });
  }

  onSubmit() {
    this.auditLogger.logFormSubmission('login-form', this.credentials, this.isFormValid());
    // ... rest of login logic
  }
}
```

## 📈 Sample Log Output

### Successful Login
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "category": "AUTH",
  "action": "Login Attempt",
  "details": {
    "email": "us***@example.com",
    "success": true,
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2024-01-15T10:30:45.123Z"
  },
  "userId": "user_1705312245123",
  "sessionId": "session_1705312245123_abc123def"
}
```

### Form Validation Error
```json
{
  "timestamp": "2024-01-15T10:28:12.456Z",
  "level": "DEBUG",
  "category": "FORM",
  "action": "Field Validation",
  "details": {
    "formName": "login-form",
    "fieldName": "password",
    "isValid": false,
    "errorMessage": "Password too short"
  },
  "sessionId": "session_1705312245123_abc123def"
}
```

### API Call with Error
```json
{
  "timestamp": "2024-01-15T10:31:02.789Z",
  "level": "ERROR",
  "category": "API",
  "action": "POST /api/auth/login",
  "details": {
    "statusCode": 401,
    "responseTime": 320,
    "error": "Unauthorized"
  },
  "userId": "user_1705312245123",
  "sessionId": "session_1705312245123_abc123def"
}
```

## 🔒 Security Features

### Email Masking
```typescript
private maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.substring(0, 2) + '*'.repeat(local.length - 2);
  return `${maskedLocal}@${domain}`;
}
// "john.doe@example.com" → "jo*****@example.com"
```

### Session Management
- Unique session IDs generated for each user session
- Session tracking across page navigation
- Session clearing on logout/timeout

### Production Configuration
```typescript
private isProduction(): boolean {
  return window.location.hostname !== 'localhost';
}

private sendToRemoteLogger(log: AuditLog) {
  if (this.isProduction()) {
    // Send to remote logging service (Splunk, ELK, etc.)
  }
}
```

## 🎭 Demo & Testing

### Run the Demo
```typescript
import { AuditDemo } from './demo/audit-demo';

// In your component or service
const demo = new AuditDemo(this.auditLogger);

// Demonstrate comprehensive logging
demo.demonstrateLogging();

// Show user journey tracking
demo.demonstrateUserJourney();

// Test error scenarios
demo.demonstrateErrorScenarios();
```

### Console Output Examples
- ✅ Authentication events with masked emails
- 📋 Form validation tracking
- 🧭 Navigation flow monitoring
- 👤 User interaction analytics
- 🌐 API performance metrics
- ❌ Error tracking with stack traces

## 🛠️ Integration with External Services

### Splunk Integration
```typescript
private sendToSplunk(log: AuditLog) {
  fetch('/api/logging/splunk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log)
  });
}
```

### ELK Stack Integration
```typescript
private sendToElastic(log: AuditLog) {
  fetch(`${ELASTIC_URL}/logs/_doc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log)
  });
}
```

## 📊 Benefits

### For Development
- **Debugging** - Detailed error context and user actions
- **Performance** - API response times and component load metrics
- **User Flow** - Understanding user behavior and journey
- **Testing** - Automated verification of user interactions

### For Operations
- **Monitoring** - Real-time system health and user activity
- **Security** - Failed login attempts and suspicious behavior
- **Analytics** - User engagement and feature usage
- **Compliance** - Audit trails for regulatory requirements

### For Business
- **User Insights** - Feature usage and engagement metrics
- **Conversion** - Registration and login funnel analysis
- **Support** - Detailed context for user issues
- **Product** - Data-driven feature development decisions

## 🚀 Production Deployment

### Environment Variables
```bash
LOGGING_ENABLED=true
LOGGING_LEVEL=INFO
REMOTE_LOGGING_URL=https://your-logging-service.com
SESSION_TRACKING=true
EMAIL_MASKING=true
```

### Best Practices
1. **Filter sensitive data** before logging
2. **Use structured logging** for better searchability
3. **Set appropriate log levels** for different environments
4. **Monitor log volume** to avoid overwhelming systems
5. **Regular log rotation** and cleanup
6. **Secure log transmission** in production

## 📋 Console Log Examples

When you run the application, you'll see logs like:

```
[2024-01-15T10:30:45.123Z] [INFO] [SYSTEM] Audit Logger Service Initialized
[2024-01-15T10:30:45.124Z] [INFO] [NAVIGATION] Page Navigation
[2024-01-15T10:30:45.125Z] [INFO] [USER_ACTION] Page Load
[2024-01-15T10:30:47.456Z] [DEBUG] [FORM] Field Validation
[2024-01-15T10:30:50.789Z] [INFO] [AUTH] Login Attempt
[2024-01-15T10:30:52.012Z] [INFO] [API] POST /api/auth/login
```

The LeaveFlow audit logging system provides comprehensive tracking for security, debugging, and analytics purposes while maintaining user privacy and production readiness! 🎉 