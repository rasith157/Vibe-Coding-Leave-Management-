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
import { 
  LeaveResponse, 
  CreateLeaveRequest, 
  ApproveLeaveRequest, 
  LeaveBalance, 
  User as LeaveUser 
} from '../interfaces/leave.interface';
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

    // Enhanced console logging with red error messages
    console.group(`%c🔴 API ERROR: ${method} ${url}`, 'color: red; font-weight: bold;');
    console.error(`%cStatus: ${error.status}`, 'color: red;');
    console.error(`%cMessage: ${errorMessage}`, 'color: red;');
    console.error(`%cResponse Time: ${responseTime}ms`, 'color: orange;');
    if (error.error) {
      console.error(`%cError Details:`, 'color: red;', error.error);
    }
    console.groupEnd();

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
        
        // Enhanced console logging for successful requests
        console.group(`%c✅ API SUCCESS: ${method} ${url}`, 'color: green; font-weight: bold;');
        console.log(`%cStatus: 200 OK`, 'color: green;');
        console.log(`%cResponse Time: ${responseTime}ms`, 'color: blue;');
        console.log(`%cResponse:`, 'color: green;', response);
        console.groupEnd();
        
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

  // Leave Management Methods

  /**
   * Create a new leave request
   */
  createLeave(request: CreateLeaveRequest): Observable<ApiResponse<LeaveResponse>> {
    this.auditLogger.logInfo('API', 'Creating Leave Request', {
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      duration: request.duration
    });

    return this.request<LeaveResponse>('POST', '/leaves', request);
  }

  /**
   * Get current user's leave requests
   */
  getMyLeaves(): Observable<ApiResponse<LeaveResponse[]>> {
    return this.request<LeaveResponse[]>('GET', '/leaves/my');
  }

  /**
   * Get leave balance for current user
   */
  getLeaveBalance(): Observable<ApiResponse<LeaveBalance>> {
    return this.request<LeaveBalance>('GET', '/leaves/balance');
  }

  /**
   * Get specific leave by ID
   */
  getLeaveById(id: number): Observable<ApiResponse<LeaveResponse>> {
    return this.request<LeaveResponse>('GET', `/leaves/${id}`);
  }

  /**
   * Delete leave request (only if pending)
   */
  deleteLeave(id: number): Observable<ApiResponse<void>> {
    return this.request<void>('DELETE', `/leaves/${id}`);
  }

  // Admin Methods

  /**
   * Get all leave requests (Admin only)
   */
  getAllLeaves(): Observable<ApiResponse<LeaveResponse[]>> {
    return this.request<LeaveResponse[]>('GET', '/leaves');
  }

  /**
   * Get pending leave requests (Admin only)
   */
  getPendingLeaves(): Observable<ApiResponse<LeaveResponse[]>> {
    return this.request<LeaveResponse[]>('GET', '/leaves/pending');
  }

  /**
   * Get leaves by status (Admin only)
   */
  getLeavesByStatus(status: string): Observable<ApiResponse<LeaveResponse[]>> {
    return this.request<LeaveResponse[]>('GET', `/leaves/status/${status}`);
  }

  /**
   * Approve or reject leave request (Admin only)
   */
  approveLeave(id: number, request: ApproveLeaveRequest): Observable<ApiResponse<LeaveResponse>> {
    this.auditLogger.logInfo('API', 'Approving Leave Request', {
      leaveId: id,
      status: request.status,
      comments: request.comments
    });

    return this.request<LeaveResponse>('PUT', `/leaves/${id}/approve`, request);
  }

  /**
   * Get all users (Admin only)
   */
  getAllUsers(): Observable<ApiResponse<LeaveUser[]>> {
    return this.request<LeaveUser[]>('GET', '/admin/users');
  }

  /**
   * Get database status (Admin only)
   */
  getDatabaseStatus(): Observable<ApiResponse<any>> {
    return this.request<any>('GET', '/admin/db-status');
  }

  /**
   * Create test data (Admin only)
   */
  createTestData(): Observable<ApiResponse<any>> {
    return this.request<any>('GET', '/admin/create-test-data');
  }

  // Utility Methods

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