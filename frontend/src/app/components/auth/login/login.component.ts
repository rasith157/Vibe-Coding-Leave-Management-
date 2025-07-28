import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuditLoggerService } from '../../../services/audit-logger.service';
import { ApiService } from '../../../services/api.service';
import { LoginRequest } from '../../../interfaces/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
        </div>
      </div>

      <div class="max-w-md w-full space-y-8 relative z-10 fade-in-up">
        <!-- Back to home link -->
        <div class="text-left">
          <button 
            class="flex items-center text-white/80 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10 rounded-full px-4 py-2"
            routerLink="/home"
            (click)="onBackToHomeClick()">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to home
          </button>
        </div>

        <!-- Logo and Title -->
        <div class="text-center fade-in">
          <div class="flex items-center justify-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mr-4 shadow-xl border border-white/20">
              <i class="fas fa-calendar-alt text-white text-2xl"></i>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-white tracking-tight">LeaveFlow</h1>
              <p class="text-white/80 text-sm font-medium">Smart Leave Management</p>
            </div>
          </div>
        </div>

        <!-- Login Form Card -->
        <div class="card fade-in-up">
          <div class="card-header">
            <h2 class="card-title">Welcome back</h2>
            <p class="card-subtitle">Sign in to manage your team's leave requests efficiently</p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-6">
            <!-- Email -->
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <i class="input-icon fas fa-envelope"></i>
                <input 
                  type="email" 
                  class="form-control"
                  placeholder="Enter your email address"
                  [(ngModel)]="credentials.email"
                  (ngModelChange)="onEmailChange()"
                  name="email"
                  required
                  email
                  autocomplete="email">
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <div class="flex justify-between items-center mb-2">
                <label class="form-label">Password</label>
                <button type="button" class="text-primary text-sm font-medium hover:text-primary-dark transition-colors" (click)="onForgotPasswordClick()">
                  Forgot password?
                </button>
              </div>
              <div class="input-group">
                <i class="input-icon fas fa-lock"></i>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  class="form-control"
                  placeholder="Enter your password"
                  [(ngModel)]="credentials.password"
                  (ngModelChange)="onPasswordChange()"
                  name="password"
                  required
                  autocomplete="current-password">
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  (click)="togglePassword()">
                  <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary mr-3">
                <span class="text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ errorMessage }}
              </div>
            </div>

            <!-- Sign In Button -->
            <button 
              type="submit" 
              class="btn btn-primary btn-full btn-large group"
              [disabled]="!loginForm.valid || isLoading">
              <span *ngIf="!isLoading" class="flex items-center justify-center">
                <i class="fas fa-sign-in-alt mr-2 group-hover:translate-x-1 transition-transform"></i>
                Sign In
              </span>
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </span>
            </button>
          </form>

          <!-- Sign Up Link -->
          <div class="text-center mt-8 pt-6 border-t border-gray-200">
            <p class="text-gray-600">
              Don't have an account? 
              <a routerLink="/register" class="text-primary font-semibold hover:text-primary-dark transition-colors ml-1" (click)="onSignUpLinkClick()">
                Create one now
              </a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-sm text-white/70 fade-in">
          <p class="mb-2">Secure & trusted by teams worldwide</p>
          <div class="flex justify-center space-x-4">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Floating Background Animation */
    .floating-shapes {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(1px);
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: -10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: -5%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      top: 30%;
      right: 20%;
      animation-delay: 4s;
    }

    .shape-4 {
      width: 250px;
      height: 250px;
      bottom: 10%;
      left: 20%;
      animation-delay: 1s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.6;
      }
    }

    /* Enhanced Form Styling */
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }

    .space-y-8 > * + * {
      margin-top: 2rem;
    }

    .space-x-4 > * + * {
      margin-left: 1rem;
    }

    .input-group {
      position: relative;
    }

    .absolute {
      position: absolute;
    }

    .right-3 {
      right: 0.75rem;
    }

    .top-1\/2 {
      top: 50%;
    }

    .transform {
      transform: translateY(-50%);
    }

    .-translate-y-1\/2 {
      transform: translateY(-50%);
    }

    .border-t {
      border-top-width: 1px;
    }

    .border-gray-200 {
      border-color: var(--gray-200);
    }

    .pt-6 {
      padding-top: 1.5rem;
    }

    .ml-1 {
      margin-left: 0.25rem;
    }

    .mb-2 {
      margin-bottom: 0.5rem;
    }

    /* Enhanced Text Colors */
    .text-white\/80 {
      color: rgba(255, 255, 255, 0.8);
    }

    .text-white\/70 {
      color: rgba(255, 255, 255, 0.7);
    }

    .bg-white\/10 {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .bg-white\/20 {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .from-white\/20 {
      --tw-gradient-from: rgba(255, 255, 255, 0.2);
    }

    .to-white\/10 {
      --tw-gradient-to: rgba(255, 255, 255, 0.1);
    }

    .border-white\/20 {
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* Animation delays */
    .fade-in {
      animation-delay: 0.2s;
    }

    .fade-in-up {
      animation-delay: 0.1s;
    }

    /* Enhanced Interactive Elements */
    .group:hover .group-hover\\:translate-x-1 {
      transform: translateX(0.25rem);
    }

    .tracking-tight {
      letter-spacing: -0.025em;
    }

    .duration-300 {
      transition-duration: 300ms;
    }

    /* Responsive adjustments */
    @media (max-width: 480px) {
      .shape {
        opacity: 0.3;
      }
      
      .shape-1 {
        width: 200px;
        height: 200px;
      }
      
      .shape-2 {
        width: 150px;
        height: 150px;
      }
      
      .shape-3 {
        width: 100px;
        height: 100px;
      }
      
      .shape-4 {
        width: 180px;
        height: 180px;
      }
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  credentials = {
    email: '',
    password: ''
  };
  
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  private componentStartTime: number = Date.now();

  constructor(
    private auditLogger: AuditLoggerService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auditLogger.logComponentLifecycle('LoginComponent', 'OnInit', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href
    });

    this.auditLogger.logNavigation(document.referrer || 'direct', '/login');
    this.auditLogger.logUserAction('Page Load', 'LoginComponent', {
      loadTime: Date.now() - this.componentStartTime
    });
  }

  ngOnDestroy() {
    this.auditLogger.logComponentLifecycle('LoginComponent', 'OnDestroy', {
      sessionDuration: Date.now() - this.componentStartTime,
      wasFormSubmitted: this.isLoading
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.auditLogger.logUserAction('Toggle Password Visibility', 'LoginComponent', {
      passwordVisible: this.showPassword,
      hasPasswordValue: !!this.credentials.password
    });
  }

  onEmailChange() {
    this.auditLogger.logFormValidation('login-form', 'email', this.isValidEmail(this.credentials.email));
  }

  onPasswordChange() {
    this.auditLogger.logFormValidation('login-form', 'password', !!this.credentials.password);
  }

  onSubmit() {
    this.errorMessage = ''; // Clear previous errors
    
    this.auditLogger.logFormSubmission('login-form', {
      email: this.credentials.email,
      hasPassword: !!this.credentials.password
    }, this.isFormValid());

    if (this.credentials.email && this.credentials.password) {
      this.isLoading = true;
      
      this.auditLogger.logUserAction('Login Attempt Started', 'LoginComponent', {
        email: this.credentials.email,
        timestamp: new Date().toISOString(),
        browserInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled
        }
      });
      
      // Real API call to backend
      const loginRequest: LoginRequest = {
        email: this.credentials.email,
        password: this.credentials.password
      };
      
      this.apiService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success && response.data) {
            // Login successful
            this.auditLogger.logAuthAttempt(this.credentials.email, true);
            this.auditLogger.logUserAction('Login Success', 'LoginComponent', {
              redirectTo: '/dashboard',
              authMethod: 'email_password',
              userId: response.data.user.id,
              userRole: response.data.user.role
            });
            
            console.log('✅ Login successful:', {
              user: response.data.user,
              message: response.data.message,
              timestamp: new Date().toISOString()
            });
            
            // Navigate to dashboard
            this.router.navigate(['/dashboard']);
            
          } else {
            // Login failed - handle API response error
            const errorMsg = response.message || 'Login failed';
            this.errorMessage = errorMsg;
            
            this.auditLogger.logAuthAttempt(this.credentials.email, false, errorMsg);
            this.auditLogger.logUserAction('Login Failed', 'LoginComponent', {
              errorMessage: errorMsg,
              apiResponse: false
            });
            
            console.error('❌ Login failed:', {
              error: errorMsg,
              timestamp: new Date().toISOString()
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          
          // Handle network or server errors
          const errorMsg = error.message || 'Unable to connect to server. Please try again.';
          this.errorMessage = errorMsg;
          
          this.auditLogger.logAuthAttempt(this.credentials.email, false, errorMsg);
          this.auditLogger.logUserAction('Login Network Error', 'LoginComponent', {
            errorMessage: errorMsg,
            errorType: 'network'
          });
          
          this.auditLogger.logError('AUTH', 'Login Network Error', error, {
            email: this.credentials.email,
            baseUrl: 'http://localhost:8080'
          });
          
          console.error('❌ Login network error:', {
            email: this.credentials.email,
            error: errorMsg,
            fullError: error,
            timestamp: new Date().toISOString()
          });
        }
      });
      
    } else {
      // Form validation failed
      this.errorMessage = 'Please fill in all required fields';
      
      this.auditLogger.logUserAction('Login Form Validation Failed', 'LoginComponent', {
        missingFields: {
          email: !this.credentials.email,
          password: !this.credentials.password
        }
      });
      
      this.auditLogger.logSimpleError('FORM', 'Login Form Incomplete', {
        email: !!this.credentials.email,
        password: !!this.credentials.password
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isFormValid(): boolean {
    return !!(this.credentials.email && this.credentials.password && this.isValidEmail(this.credentials.email));
  }

  // Event handlers for audit logging
  onForgotPasswordClick() {
    this.auditLogger.logUserAction('Forgot Password Clicked', 'LoginComponent', {
      hasEmailValue: !!this.credentials.email,
      timestamp: new Date().toISOString()
    });
  }

  onSignUpLinkClick() {
    this.auditLogger.logUserAction('Sign Up Link Clicked', 'LoginComponent', {
      fromPage: '/login',
      toPage: '/register'
    });
  }

  onBackToHomeClick() {
    this.auditLogger.logUserAction('Back to Home Clicked', 'LoginComponent', {
      fromPage: '/login',
      toPage: '/home'
    });
  }


} 