import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse, 
  ApiError 
} from '../interfaces/auth.interface';
import { AuditLoggerService } from './audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api';
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private auditLogger: AuditLoggerService
  ) {
    // Load token from localStorage on service initialization
    this.token = localStorage.getItem('auth_token');
  }

  // Get default headers with optional authentication
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  // Handle HTTP errors and log them
  private handleError(error: HttpErrorResponse, url: string, method: string, startTime: number): Observable<never> {
    const responseTime = Date.now() - startTime;
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    // Log the API error
    this.auditLogger.logApiCall(method, url, error.status, responseTime, error);
    this.auditLogger.logError('API', `${method} ${url} Failed`, error, {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      responseTime
    });

    const apiError: ApiError = {
      message: errorMessage,
      status: error.status || 0,
      timestamp: new Date().toISOString(),
      path: url
    };

    return throwError(() => apiError);
  }

  // Generic HTTP request method with logging
  private request<T>(method: string, endpoint: string, body?: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    
    this.auditLogger.logApiCall(method, url);

    const httpOptions = {
      headers: this.getHeaders()
    };

    let httpRequest: Observable<T>;

    switch (method.toUpperCase()) {
      case 'GET':
        httpRequest = this.http.get<T>(url, httpOptions);
        break;
      case 'POST':
        httpRequest = this.http.post<T>(url, body, httpOptions);
        break;
      case 'PUT':
        httpRequest = this.http.put<T>(url, body, httpOptions);
        break;
      case 'DELETE':
        httpRequest = this.http.delete<T>(url, httpOptions);
        break;
      default:
        return throwError(() => new Error(`Unsupported HTTP method: ${method}`));
    }

    return httpRequest.pipe(
      map((response: T) => {
        const responseTime = Date.now() - startTime;
        
        // Log successful API call
        this.auditLogger.logApiCall(method, url, 200, responseTime);
        
        return {
          success: true,
          data: response,
          message: 'Request successful'
        } as ApiResponse<T>;
      }),
      catchError((error: HttpErrorResponse) => 
        this.handleError(error, url, method, startTime).pipe(
          map((apiError: ApiError) => ({
            success: false,
            error: apiError,
            message: apiError.message
          } as ApiResponse<T>))
        )
      )
    );
  }

  // Authentication Methods

  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    this.auditLogger.logInfo('API', 'Login Request Started', {
      email: credentials.email,
      timestamp: new Date().toISOString()
    });

    return this.request<AuthResponse>('POST', '/auth/login', credentials).pipe(
      map((response: ApiResponse<AuthResponse>) => {
        if (response.success && response.data) {
          // Store token and user info
          this.token = response.data.token;
          localStorage.setItem('auth_token', this.token);
          localStorage.setItem('user_info', JSON.stringify(response.data.user));
          
          // Set user ID in audit logger
          this.auditLogger.setUserId(response.data.user.id.toString());
          
          this.auditLogger.logInfo('API', 'Login Successful', {
            userId: response.data.user.id,
            userRole: response.data.user.role,
            message: response.data.message
          });
        } else {
          this.auditLogger.logError('API', 'Login Failed', new Error(response.message || 'Unknown error'), {
            email: credentials.email
          });
        }
        
        return response;
      })
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    // Set default role if not provided
    const requestData = {
      ...userData,
      role: userData.role || 'EMPLOYEE'
    };

    this.auditLogger.logInfo('API', 'Registration Request Started', {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: requestData.role,
      timestamp: new Date().toISOString()
    });

    return this.request<AuthResponse>('POST', '/auth/register', requestData).pipe(
      map((response: ApiResponse<AuthResponse>) => {
        if (response.success && response.data) {
          // Store token and user info
          this.token = response.data.token;
          localStorage.setItem('auth_token', this.token);
          localStorage.setItem('user_info', JSON.stringify(response.data.user));
          
          // Set user ID in audit logger
          this.auditLogger.setUserId(response.data.user.id.toString());
          
          this.auditLogger.logInfo('API', 'Registration Successful', {
            userId: response.data.user.id,
            userRole: response.data.user.role,
            message: response.data.message
          });
        } else {
          this.auditLogger.logError('API', 'Registration Failed', new Error(response.message || 'Unknown error'), {
            email: userData.email
          });
        }
        
        return response;
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.auditLogger.logInfo('API', 'Logout Initiated', {
      userId: this.getCurrentUserId(),
      timestamp: new Date().toISOString()
    });

    // Clear stored data
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    
    // Clear audit logger session
    this.auditLogger.clearSession();
    
    this.auditLogger.logInfo('AUTH', 'User Logged Out', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Get current user information
   */
  getCurrentUser(): any {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id.toString() : null;
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return this.token;
  }

  // Future API methods can be added here (leaves, users, etc.)

  /**
   * Health check endpoint
   */
  healthCheck(): Observable<ApiResponse<any>> {
    return this.request<any>('GET', '/health');
  }

  /**
   * Test connection to backend
   */
  testConnection(): Observable<boolean> {
    this.auditLogger.logInfo('API', 'Testing Backend Connection', {
      baseUrl: this.baseUrl,
      timestamp: new Date().toISOString()
    });

    return this.request<any>('GET', '/auth/test').pipe(
      map((response: ApiResponse<any>) => {
        const isConnected = response.success;
        
        this.auditLogger.logInfo('API', 'Connection Test Result', {
          connected: isConnected,
          message: response.message
        });
        
        return isConnected;
      }),
      catchError(() => {
        this.auditLogger.logWarn('API', 'Backend Connection Failed', {
          baseUrl: this.baseUrl
        });
        return throwError(() => false);
      })
    );
  }
} 