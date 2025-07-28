import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuditLoggerService } from '../services/audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private auditLogger: AuditLoggerService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.apiService.isAuthenticated();
    const currentUser = this.apiService.getCurrentUser();
    const requestedUrl = state.url;

    this.auditLogger.logInfo('NAVIGATION', 'Route Access Attempt', {
      requestedUrl,
      isAuthenticated,
      userRole: currentUser?.role || 'anonymous',
      timestamp: new Date().toISOString()
    });

    if (!isAuthenticated) {
      this.auditLogger.logWarn('AUTH', 'Unauthorized Access Attempt', {
        requestedUrl,
        redirectTo: '/login'
      });

      // Redirect to login page with return url
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: requestedUrl } 
      });
      return false;
    }

    // Check role-based access for admin routes
    if (requestedUrl.startsWith('/admin')) {
      if (currentUser?.role !== 'ADMIN') {
        this.auditLogger.logWarn('AUTH', 'Admin Access Denied', {
          requestedUrl,
          userRole: currentUser?.role,
          userId: currentUser?.id,
          redirectTo: '/dashboard'
        });

        // Redirect non-admin users to dashboard
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    this.auditLogger.logInfo('NAVIGATION', 'Route Access Granted', {
      requestedUrl,
      userRole: currentUser?.role,
      userId: currentUser?.id
    });

    return true;
  }
} 