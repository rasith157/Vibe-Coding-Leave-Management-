import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuditLoggerService } from '../../../services/audit-logger.service';
import { ApiService } from '../../../services/api.service';
import { RegisterRequest } from '../../../interfaces/auth.interface';

@Component({
  selector: 'app-register',
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
          <div class="shape shape-5"></div>
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

        <!-- Registration Form Card -->
        <div class="card fade-in-up">
          <div class="card-header">
            <h2 class="card-title">Create your account</h2>
            <p class="card-subtitle">Join your organization's smart leave management system</p>
          </div>

          <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="space-y-5">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input 
                  type="text" 
                  class="form-control"
                  placeholder="John"
                  [(ngModel)]="userData.firstName"
                  (ngModelChange)="onFirstNameChange()"
                  name="firstName"
                  required
                  minlength="2"
                  autocomplete="given-name">
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input 
                  type="text" 
                  class="form-control"
                  placeholder="Doe"
                  [(ngModel)]="userData.lastName"
                  (ngModelChange)="onLastNameChange()"
                  name="lastName"
                  required
                  minlength="2"
                  autocomplete="family-name">
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <i class="input-icon fas fa-envelope"></i>
                <input 
                  type="email" 
                  class="form-control"
                  placeholder="Enter your work email"
                  [(ngModel)]="userData.email"
                  (ngModelChange)="onEmailChange()"
                  name="email"
                  required
                  email
                  autocomplete="email">
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <i class="input-icon fas fa-lock"></i>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  class="form-control"
                  placeholder="Create a strong password"
                  [(ngModel)]="userData.password"
                  (ngModelChange)="onPasswordChange()"
                  name="password"
                  required
                  minlength="6"
                  autocomplete="new-password">
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  (click)="togglePassword()">
                  <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-group">
                <i class="input-icon fas fa-lock"></i>
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'" 
                  class="form-control"
                  placeholder="Confirm your password"
                  [(ngModel)]="userData.confirmPassword"
                  (ngModelChange)="onConfirmPasswordChange()"
                  name="confirmPassword"
                  required
                  autocomplete="new-password">
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  (click)="toggleConfirmPassword()">
                  <i [class]="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <div *ngIf="userData.confirmPassword && userData.password !== userData.confirmPassword" 
                   class="text-error text-sm mt-1 flex items-center">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                Passwords do not match
              </div>
            </div>

            <!-- Terms and Privacy -->
            <div class="form-group">
              <label class="flex items-start cursor-pointer group">
                <input 
                  type="checkbox" 
                  class="mt-1 mr-3 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary group-hover:border-primary transition-colors"
                  [(ngModel)]="userData.agreedToTerms"
                  (ngModelChange)="onTermsChange()"
                  name="agreedToTerms"
                  required>
                <span class="text-sm text-gray-700 leading-relaxed">
                  I agree to the 
                  <button type="button" class="text-primary hover:text-primary-dark font-semibold transition-colors underline" (click)="onTermsClick()">Terms of Service</button>
                  and 
                  <button type="button" class="text-primary hover:text-primary-dark font-semibold transition-colors underline" (click)="onPrivacyClick()">Privacy Policy</button>
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ errorMessage }}
              </div>
            </div>

            <!-- Create Account Button -->
            <button 
              type="submit" 
              class="btn btn-primary btn-full btn-large group"
              [disabled]="!isFormValid() || isLoading">
              <span *ngIf="!isLoading" class="flex items-center justify-center">
                <i class="fas fa-user-plus mr-2 group-hover:scale-110 transition-transform"></i>
                Create Account
              </span>
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Creating account...
              </span>
            </button>
          </form>

          

          <!-- Sign In Link -->
          <div class="text-center mt-8 pt-6 border-t border-gray-200">
            <p class="text-gray-700">
              Already have an account? 
              <a routerLink="/login" class="text-primary font-semibold hover:text-primary-dark transition-colors ml-1" (click)="onSignInLinkClick()">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-sm text-white/70 fade-in">
          <p class="mb-2">Join thousands of teams worldwide</p>
          <div class="flex justify-center items-center space-x-4">
            <div class="flex items-center space-x-2">
              <i class="fas fa-shield-alt text-success-500"></i>
              <span>Secure</span>
            </div>
            <span>•</span>
            <div class="flex items-center space-x-2">
              <i class="fas fa-lock text-primary-400"></i>
              <span>Private</span>
            </div>
            <span>•</span>
            <div class="flex items-center space-x-2">
              <i class="fas fa-rocket text-warning-500"></i>
              <span>Fast</span>
            </div>
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
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(1px);
      animation: float 8s ease-in-out infinite;
    }

    .shape-1 {
      width: 250px;
      height: 250px;
      top: 5%;
      left: -5%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 180px;
      height: 180px;
      top: 50%;
      right: -10%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 120px;
      height: 120px;
      top: 25%;
      right: 15%;
      animation-delay: 4s;
    }

    .shape-4 {
      width: 200px;
      height: 200px;
      bottom: 15%;
      left: 15%;
      animation-delay: 1s;
    }

    .shape-5 {
      width: 150px;
      height: 150px;
      top: 70%;
      left: 60%;
      animation-delay: 3s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
      }
      33% {
        transform: translateY(-15px) rotate(120deg);
        opacity: 0.5;
      }
      66% {
        transform: translateY(-30px) rotate(240deg);
        opacity: 0.4;
      }
    }

    /* Enhanced Form Styling */
    .space-y-5 > * + * {
      margin-top: 1.25rem;
    }

    .space-y-8 > * + * {
      margin-top: 2rem;
    }

    .space-x-4 > * + * {
      margin-left: 1rem;
    }

    .space-x-2 > * + * {
      margin-left: 0.5rem;
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

    .border-gray-300 {
      border-color: var(--gray-300);
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

    .mt-1 {
      margin-top: 0.25rem;
    }

    .mr-1 {
      margin-right: 0.25rem;
    }

    .mr-3 {
      margin-right: 0.75rem;
    }

    .gap-4 {
      gap: 1rem;
    }

    .h-4 {
      height: 1rem;
    }

    .w-4 {
      width: 1rem;
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

    .from-white\/20 {
      --tw-gradient-from: rgba(255, 255, 255, 0.2);
    }

    .to-white\/10 {
      --tw-gradient-to: rgba(255, 255, 255, 0.1);
    }

    .border-white\/20 {
      border-color: rgba(255, 255, 255, 0.2);
    }

    .text-error {
      color: var(--error-600);
    }

    .text-success-500 {
      color: var(--success-500);
    }

    .text-primary-400 {
      color: var(--primary-400);
    }

    .text-warning-500 {
      color: var(--warning-500);
    }

    /* Animation delays */
    .fade-in {
      animation-delay: 0.2s;
    }

    .fade-in-up {
      animation-delay: 0.1s;
    }

    /* Enhanced Interactive Elements */
    .group:hover .group-hover\\:scale-110 {
      transform: scale(1.1);
    }

    .tracking-tight {
      letter-spacing: -0.025em;
    }

    .duration-300 {
      transition-duration: 300ms;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .leading-relaxed {
      line-height: 1.625;
    }

    .underline {
      text-decoration: underline;
    }

    .focus\\:ring-primary:focus {
      --tw-ring-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .group:hover .group-hover\\:border-primary {
      border-color: var(--primary-500);
    }

    /* Responsive adjustments */
    @media (max-width: 480px) {
      .grid-cols-2 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }

      .shape {
        opacity: 0.2;
      }
      
      .shape-1 {
        width: 150px;
        height: 150px;
      }
      
      .shape-2 {
        width: 120px;
        height: 120px;
      }
      
      .shape-3 {
        width: 80px;
        height: 80px;
      }
      
      .shape-4 {
        width: 130px;
        height: 130px;
      }

      .shape-5 {
        width: 100px;
        height: 100px;
      }

      .space-x-4 > * + * {
        margin-left: 0.5rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  userData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  };
  
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  private componentStartTime: number = Date.now();

  constructor(
    private auditLogger: AuditLoggerService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auditLogger.logComponentLifecycle('RegisterComponent', 'OnInit', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href
    });

    this.auditLogger.logNavigation(document.referrer || 'direct', '/register');
    this.auditLogger.logUserAction('Page Load', 'RegisterComponent', {
      loadTime: Date.now() - this.componentStartTime
    });
  }

  ngOnDestroy() {
    this.auditLogger.logComponentLifecycle('RegisterComponent', 'OnDestroy', {
      sessionDuration: Date.now() - this.componentStartTime,
      wasFormSubmitted: this.isLoading,
      formCompleteness: this.getFormCompleteness()
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.auditLogger.logUserAction('Toggle Password Visibility', 'RegisterComponent', {
      passwordVisible: this.showPassword,
      field: 'password'
    });
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
    this.auditLogger.logUserAction('Toggle Password Visibility', 'RegisterComponent', {
      passwordVisible: this.showConfirmPassword,
      field: 'confirmPassword'
    });
  }

  onFirstNameChange() {
    this.auditLogger.logFormValidation('register-form', 'firstName', !!this.userData.firstName && this.userData.firstName.length >= 2);
  }

  onLastNameChange() {
    this.auditLogger.logFormValidation('register-form', 'lastName', !!this.userData.lastName && this.userData.lastName.length >= 2);
  }

  onEmailChange() {
    this.auditLogger.logFormValidation('register-form', 'email', this.isValidEmail(this.userData.email));
  }

  onPasswordChange() {
    const isValid = this.userData.password.length >= 6;
    this.auditLogger.logFormValidation('register-form', 'password', isValid);
    
    // Also check confirm password if it has value
    if (this.userData.confirmPassword) {
      this.onConfirmPasswordChange();
    }
  }

  onConfirmPasswordChange() {
    const isValid = this.userData.confirmPassword === this.userData.password;
    this.auditLogger.logFormValidation('register-form', 'confirmPassword', isValid, 
      isValid ? undefined : 'Passwords do not match');
  }

  onTermsChange() {
    this.auditLogger.logUserAction('Terms Agreement Changed', 'RegisterComponent', {
      agreedToTerms: this.userData.agreedToTerms,
      timestamp: new Date().toISOString()
    });
  }

  onSubmit() {
    this.errorMessage = ''; // Clear previous errors
    
    this.auditLogger.logFormSubmission('register-form', {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      hasPassword: !!this.userData.password,
      hasConfirmPassword: !!this.userData.confirmPassword,
      passwordsMatch: this.userData.password === this.userData.confirmPassword,
      agreedToTerms: this.userData.agreedToTerms
    }, this.isFormValid());

    if (this.isFormValid()) {
      this.isLoading = true;
      
      this.auditLogger.logUserAction('Registration Attempt Started', 'RegisterComponent', {
        email: this.userData.email,
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        timestamp: new Date().toISOString(),
        browserInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled
        }
      });
      
      // Real API call to backend
      const registerRequest: RegisterRequest = {
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
        password: this.userData.password,
        role: 'EMPLOYEE' // Default role
      };
      
      this.apiService.register(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success && response.data) {
            // Registration successful
            this.auditLogger.logRegistrationAttempt(this.userData, true);
            this.auditLogger.logUserAction('Registration Success', 'RegisterComponent', {
              redirectTo: '/dashboard',
              authMethod: 'email_password',
              userId: response.data.user.id,
              userRole: response.data.user.role
            });
            
            console.log('✅ Registration successful:', {
              user: response.data.user,
              message: response.data.message,
              timestamp: new Date().toISOString()
            });
            
            // Navigate to dashboard
            this.router.navigate(['/dashboard']);
            
          } else {
            // Registration failed - handle API response error
            const errorMsg = response.message || 'Registration failed';
            this.errorMessage = errorMsg;
            
            this.auditLogger.logRegistrationAttempt(this.userData, false, errorMsg);
            this.auditLogger.logUserAction('Registration Failed', 'RegisterComponent', {
              errorMessage: errorMsg,
              apiResponse: false
            });
            
            console.error('❌ Registration failed:', {
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
          
          this.auditLogger.logRegistrationAttempt(this.userData, false, errorMsg);
          this.auditLogger.logUserAction('Registration Network Error', 'RegisterComponent', {
            errorMessage: errorMsg,
            errorType: 'network'
          });
          
          this.auditLogger.logError('AUTH', 'Registration Network Error', error, {
            email: this.userData.email,
            baseUrl: 'http://localhost:8080'
          });
          
          console.error('❌ Registration network error:', {
            email: this.userData.email,
            error: errorMsg,
            fullError: error,
            timestamp: new Date().toISOString()
          });
        }
      });
      
    } else {
      // Form validation failed
      const validationIssues = this.getValidationIssues();
      this.errorMessage = validationIssues.join(', ');
      
      this.auditLogger.logUserAction('Registration Form Validation Failed', 'RegisterComponent', {
        validationIssues,
        formCompleteness: this.getFormCompleteness()
      });
      
      this.auditLogger.logSimpleError('FORM', 'Registration Form Invalid', {
        issues: validationIssues
      });
    }
  }

  isFormValid(): boolean {
    return (
      !!this.userData.firstName &&
      !!this.userData.lastName &&
      !!this.userData.email &&
      !!this.userData.password &&
      !!this.userData.confirmPassword &&
      this.userData.password === this.userData.confirmPassword &&
      !!this.userData.agreedToTerms
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getFormCompleteness(): any {
    return {
      firstName: !!this.userData.firstName,
      lastName: !!this.userData.lastName,
      email: !!this.userData.email,
      password: !!this.userData.password,
      confirmPassword: !!this.userData.confirmPassword,
      agreedToTerms: this.userData.agreedToTerms,
      completenessPercentage: this.calculateCompleteness()
    };
  }

  private calculateCompleteness(): number {
    const fields = [
      !!this.userData.firstName,
      !!this.userData.lastName,
      !!this.userData.email,
      !!this.userData.password,
      !!this.userData.confirmPassword,
      this.userData.agreedToTerms
    ];
    const completed = fields.filter(field => field).length;
    return Math.round((completed / fields.length) * 100);
  }

  private getValidationIssues(): string[] {
    const issues: string[] = [];
    
    if (!this.userData.firstName) issues.push('First name required');
    if (!this.userData.lastName) issues.push('Last name required');
    if (!this.userData.email) issues.push('Email required');
    else if (!this.isValidEmail(this.userData.email)) issues.push('Invalid email format');
    if (!this.userData.password) issues.push('Password required');
    else if (this.userData.password.length < 6) issues.push('Password too short');
    if (!this.userData.confirmPassword) issues.push('Confirm password required');
    else if (this.userData.password !== this.userData.confirmPassword) issues.push('Passwords do not match');
    if (!this.userData.agreedToTerms) issues.push('Terms agreement required');
    
    return issues;
  }

  // Event handlers for audit logging
  onSignInLinkClick() {
    this.auditLogger.logUserAction('Sign In Link Clicked', 'RegisterComponent', {
      fromPage: '/register',
      toPage: '/login',
      formCompleteness: this.getFormCompleteness()
    });
  }

  onBackToHomeClick() {
    this.auditLogger.logUserAction('Back to Home Clicked', 'RegisterComponent', {
      fromPage: '/register',
      toPage: '/home',
      formCompleteness: this.getFormCompleteness()
    });
  }

  onTermsClick() {
    this.auditLogger.logUserAction('Terms of Service Clicked', 'RegisterComponent', {
      timestamp: new Date().toISOString()
    });
  }

  onPrivacyClick() {
    this.auditLogger.logUserAction('Privacy Policy Clicked', 'RegisterComponent', {
      timestamp: new Date().toISOString()
    });
  }


} 