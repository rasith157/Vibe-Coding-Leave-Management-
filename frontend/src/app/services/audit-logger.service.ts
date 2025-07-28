import { Injectable } from '@angular/core';

export interface AuditLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: 'AUTH' | 'FORM' | 'NAVIGATION' | 'API' | 'USER_ACTION' | 'SYSTEM';
  action: string;
  details?: any;
  userId?: string;
  sessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLoggerService {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.logInfo('SYSTEM', 'Audit Logger Service Initialized', { sessionId: this.sessionId });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
    this.logInfo('AUTH', 'User ID Set', { userId });
  }

  clearUserId() {
    this.logInfo('AUTH', 'User ID Cleared', { previousUserId: this.userId });
    this.userId = undefined;
  }

  private createLog(level: AuditLog['level'], category: AuditLog['category'], action: string, details?: any): AuditLog {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      action,
      details,
      userId: this.userId,
      sessionId: this.sessionId
    };
  }

  private writeLog(log: AuditLog) {
    const logMessage = `[${log.timestamp}] [${log.level}] [${log.category}] ${log.action}`;
    const logData = {
      ...log,
      details: log.details ? JSON.stringify(log.details, null, 2) : undefined
    };

    switch (log.level) {
      case 'ERROR':
        console.error(logMessage, logData);
        break;
      case 'WARN':
        console.warn(logMessage, logData);
        break;
      case 'DEBUG':
        console.debug(logMessage, logData);
        break;
      default:
        console.log(logMessage, logData);
    }

    // In production, you could send logs to a remote logging service here
    this.sendToRemoteLogger(log);
  }

  private sendToRemoteLogger(log: AuditLog) {
    // Placeholder for remote logging service integration
    // Example: send to Splunk, ELK stack, or cloud logging service
    if (this.isProduction()) {
      // Implementation would go here
      console.debug('Log would be sent to remote service:', log);
    }
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost';
  }

  // Public logging methods
  logInfo(category: AuditLog['category'], action: string, details?: any) {
    this.writeLog(this.createLog('INFO', category, action, details));
  }

  logWarn(category: AuditLog['category'], action: string, details?: any) {
    this.writeLog(this.createLog('WARN', category, action, details));
  }

  logSimpleError(category: AuditLog['category'], action: string, details?: any) {
    this.writeLog(this.createLog('ERROR', category, action, details));
  }

  logDebug(category: AuditLog['category'], action: string, details?: any) {
    this.writeLog(this.createLog('DEBUG', category, action, details));
  }

  // Specific audit methods for common actions
  logAuthAttempt(email: string, success: boolean, errorMessage?: string) {
    this.logInfo('AUTH', 'Login Attempt', {
      email: this.maskEmail(email),
      success,
      errorMessage,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }

  logRegistrationAttempt(userData: any, success: boolean, errorMessage?: string) {
    this.logInfo('AUTH', 'Registration Attempt', {
      email: this.maskEmail(userData.email),
      firstName: userData.firstName,
      lastName: userData.lastName,
      success,
      errorMessage,
      userAgent: navigator.userAgent
    });
  }

  logFormSubmission(formName: string, formData: any, isValid: boolean) {
    this.logInfo('FORM', 'Form Submission', {
      formName,
      isValid,
      fieldCount: Object.keys(formData).length,
      fields: Object.keys(formData),
      hasErrors: !isValid
    });
  }

  logFormValidation(formName: string, fieldName: string, isValid: boolean, errorMessage?: string) {
    this.logDebug('FORM', 'Field Validation', {
      formName,
      fieldName,
      isValid,
      errorMessage
    });
  }

  logNavigation(from: string, to: string) {
    this.logInfo('NAVIGATION', 'Page Navigation', {
      from,
      to,
      timestamp: new Date().toISOString()
    });
  }

  logUserAction(action: string, component: string, details?: any) {
    this.logInfo('USER_ACTION', action, {
      component,
      ...details
    });
  }

  logApiCall(method: string, url: string, statusCode?: number, responseTime?: number, error?: any) {
    const level = error ? 'ERROR' : statusCode && statusCode >= 400 ? 'WARN' : 'INFO';
    this.writeLog(this.createLog(level, 'API', `${method} ${url}`, {
      statusCode,
      responseTime,
      error: error ? error.message : undefined
    }));
  }

  logComponentLifecycle(component: string, lifecycle: string, details?: any) {
    this.logDebug('SYSTEM', `Component ${lifecycle}`, {
      component,
      ...details
    });
  }

  logError(category: AuditLog['category'], action: string, error: any, context?: any) {
    this.writeLog(this.createLog('ERROR', category, action, {
      error: {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      },
      context
    }));
  }

  // Utility methods
  private maskEmail(email: string): string {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.length > 2 ? 
      local.substring(0, 2) + '*'.repeat(local.length - 2) : 
      local;
    return `${maskedLocal}@${domain}`;
  }

  // Method to export logs (for debugging or admin purposes)
  exportLogs(): void {
    this.logInfo('SYSTEM', 'Logs Export Requested', {
      sessionId: this.sessionId,
      userId: this.userId
    });
  }

  // Method to clear session (on logout)
  clearSession(): void {
    this.logInfo('AUTH', 'Session Cleared', {
      sessionId: this.sessionId,
      userId: this.userId
    });
    this.sessionId = this.generateSessionId();
    this.userId = undefined;
  }
} 