import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuditLoggerService } from '../../services/audit-logger.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
          <div class="shape shape-6"></div>
        </div>
      </div>

      <!-- Header -->
      <header class="relative z-20 backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div class="container mx-auto px-4 py-6">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <i class="fas fa-calendar-alt text-white text-xl"></i>
              </div>
              <div>
                <span class="text-2xl font-bold text-white tracking-tight">LeaveFlow</span>
                <p class="text-white/70 text-sm">Smart Leave Management</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <button 
                class="btn btn-secondary backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                routerLink="/login"
                (click)="onSignInClick()">
                <i class="fas fa-sign-in-alt mr-2"></i>
                Sign In
              </button>
              <button 
                class="btn btn-primary"
                routerLink="/register"
                (click)="onGetStartedClick()">
                <i class="fas fa-rocket mr-2"></i>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="relative z-10 flex-1 flex items-center justify-center py-20">
        <div class="container mx-auto px-4 text-center">
          <div class="max-w-5xl mx-auto">
            <!-- Main Heading -->
            <div class="fade-in-up">
              <h1 class="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Leave Management
                <br>
                <span class="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
            </div>
            
            <!-- Subtitle -->
            <div class="fade-in-up" style="animation-delay: 0.2s">
              <p class="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Streamline your team's leave requests, approvals, and time-off tracking with 
                our intuitive platform. Trusted by thousands of organizations worldwide.
              </p>
            </div>

            <!-- CTA Buttons -->
            <div class="fade-in-up flex flex-col sm:flex-row gap-4 justify-center mb-20" style="animation-delay: 0.4s">
              <button 
                class="btn btn-primary btn-large group"
                routerLink="/register"
                (click)="onMainCTAClick()">
                <i class="fas fa-rocket mr-2 group-hover:translate-x-1 transition-transform"></i>
                Start Managing Leaves
                <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </button>
              <button 
                class="btn btn-outline btn-large backdrop-blur-sm bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
                routerLink="/login"
                (click)="onWatchDemoClick()">
                <i class="fas fa-play mr-2"></i>
                Watch Demo
              </button>
            </div>

            <!-- Features Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <!-- Feature 1 -->
              <div class="feature-card fade-in-up" style="animation-delay: 0.6s" 
                   (mouseenter)="onFeatureCardHover('Easy Request Management')"
                   (click)="onFeatureCardClick('Easy Request Management')">
                <div class="feature-icon">
                  <i class="fas fa-paper-plane text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-4">Easy Request Management</h3>
                <p class="text-gray-700 leading-relaxed">
                  Submit and approve leave requests with an 
                  intuitive interface that makes time-off 
                  management effortless.
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="feature-card fade-in-up" style="animation-delay: 0.8s"
                   (mouseenter)="onFeatureCardHover('Automated Approvals')"
                   (click)="onFeatureCardClick('Automated Approvals')">
                <div class="feature-icon">
                  <i class="fas fa-check-circle text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-4">Automated Approvals</h3>
                <p class="text-gray-700 leading-relaxed">
                  Streamline approval workflow that saves time for 
                  managers and employees with intelligent 
                  automation.
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="feature-card fade-in-up" style="animation-delay: 1s"
                   (mouseenter)="onFeatureCardHover('Analytics & Insights')"
                   (click)="onFeatureCardClick('Analytics & Insights')">
                <div class="feature-icon">
                  <i class="fas fa-chart-bar text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-4">Analytics & Insights</h3>
                <p class="text-gray-700 leading-relaxed">
                  Track leave patterns and generate reports for 
                  better workforce planning and 
                  decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- CTA Section -->
      <section class="relative z-10 py-20">
        <div class="container mx-auto px-4 text-center">
          <div class="max-w-4xl mx-auto">
            <div class="card fade-in-up">
              <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i class="fas fa-crown text-white text-3xl"></i>
                </div>
                <h2 class="text-4xl font-bold text-gray-900 mb-6">
                  Ready to Transform Your Leave Management?
                </h2>
                <p class="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                  Join thousands of organizations already using LeaveFlow to streamline 
                  their HR processes and boost team productivity.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    class="btn btn-primary btn-large group"
                    routerLink="/register"
                    (click)="onStartTrialClick()">
                    <i class="fas fa-rocket mr-2"></i>
                    Start Free Trial
                    <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </button>
                  <button 
                    class="btn btn-secondary btn-large"
                    routerLink="/login"
                    (click)="onHaveAccountClick()">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    I Have an Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="relative z-10 py-16">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div class="text-center fade-in-up">
              <div class="text-4xl font-bold text-white mb-2">10k+</div>
              <div class="text-white/70">Happy Users</div>
            </div>
            <div class="text-center fade-in-up" style="animation-delay: 0.1s">
              <div class="text-4xl font-bold text-white mb-2">500+</div>
              <div class="text-white/70">Companies</div>
            </div>
            <div class="text-center fade-in-up" style="animation-delay: 0.2s">
              <div class="text-4xl font-bold text-white mb-2">99.9%</div>
              <div class="text-white/70">Uptime</div>
            </div>
            <div class="text-center fade-in-up" style="animation-delay: 0.3s">
              <div class="text-4xl font-bold text-white mb-2">24/7</div>
              <div class="text-white/70">Support</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="relative z-10 backdrop-blur-lg bg-white/5 border-t border-white/10 py-8">
        <div class="container mx-auto px-4 text-center">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center mb-4 md:mb-0">
              <div class="w-8 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-calendar-alt text-white"></i>
              </div>
              <span class="text-white font-semibold">LeaveFlow</span>
            </div>
            <p class="text-white/70 text-sm">
              © 2024 LeaveFlow. Crafted with ❤️ for modern teams.
            </p>
          </div>
        </div>
      </footer>
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
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(1px);
      animation: float 12s ease-in-out infinite;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      top: -10%;
      left: -5%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      top: 20%;
      right: -10%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 200px;
      height: 200px;
      top: 60%;
      left: -5%;
      animation-delay: 4s;
    }

    .shape-4 {
      width: 350px;
      height: 350px;
      bottom: -10%;
      right: 10%;
      animation-delay: 1s;
    }

    .shape-5 {
      width: 250px;
      height: 250px;
      top: 40%;
      left: 30%;
      animation-delay: 3s;
    }

    .shape-6 {
      width: 180px;
      height: 180px;
      bottom: 30%;
      left: 70%;
      animation-delay: 5s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
      }
      25% {
        transform: translateY(-20px) rotate(90deg);
        opacity: 0.5;
      }
      50% {
        transform: translateY(-40px) rotate(180deg);
        opacity: 0.4;
      }
      75% {
        transform: translateY(-20px) rotate(270deg);
        opacity: 0.6;
      }
    }

    /* Feature Cards */
    .feature-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 1.5rem;
      padding: 2.5rem 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .feature-card:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .feature-icon {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
      color: white;
      transition: all 0.3s ease;
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1) rotate(5deg);
    }

    /* Enhanced Text Utilities */
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }

    .text-transparent {
      color: transparent;
    }

    .leading-tight {
      line-height: 1.25;
    }

    .leading-relaxed {
      line-height: 1.625;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .shape {
        opacity: 0.2;
      }
      
      .shape-1 {
        width: 250px;
        height: 250px;
      }
      
      .shape-2 {
        width: 200px;
        height: 200px;
      }
      
      .shape-3 {
        width: 150px;
        height: 150px;
      }
      
      .shape-4 {
        width: 220px;
        height: 220px;
      }

      .shape-5 {
        width: 180px;
        height: 180px;
      }

      .shape-6 {
        width: 120px;
        height: 120px;
      }
      
      h1 {
        font-size: 3rem;
      }
      
      .feature-card {
        padding: 1.5rem;
      }

      .feature-icon {
        width: 4rem;
        height: 4rem;
      }
    }

    @media (max-width: 480px) {
      h1 {
        font-size: 2.5rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private componentStartTime: number = Date.now();

  constructor(private auditLogger: AuditLoggerService) {}

  ngOnInit() {
    this.auditLogger.logComponentLifecycle('HomeComponent', 'OnInit', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href
    });

    this.auditLogger.logNavigation(document.referrer || 'direct', '/home');
    this.auditLogger.logUserAction('Page Load', 'HomeComponent', {
      loadTime: Date.now() - this.componentStartTime,
      isHomePage: true
    });
  }

  ngOnDestroy() {
    this.auditLogger.logComponentLifecycle('HomeComponent', 'OnDestroy', {
      sessionDuration: Date.now() - this.componentStartTime,
      timeOnPage: Date.now() - this.componentStartTime
    });
  }

  // Navigation event handlers
  onSignInClick() {
    this.auditLogger.logUserAction('Sign In Button Clicked', 'HomeComponent', {
      fromPage: '/home',
      toPage: '/login',
      buttonLocation: 'header'
    });
  }

  onGetStartedClick() {
    this.auditLogger.logUserAction('Get Started Button Clicked', 'HomeComponent', {
      fromPage: '/home',
      toPage: '/register',
      buttonLocation: 'header'
    });
  }

  onMainCTAClick() {
    this.auditLogger.logUserAction('Main CTA Button Clicked', 'HomeComponent', {
      fromPage: '/home',
      toPage: '/register',
      buttonLocation: 'hero_section',
      ctaText: 'Start Managing Leaves'
    });
  }

  onWatchDemoClick() {
    this.auditLogger.logUserAction('Watch Demo Button Clicked', 'HomeComponent', {
      fromPage: '/home',
      toPage: '/login',
      buttonLocation: 'hero_section',
      actionType: 'demo_request'
    });
  }

  onStartTrialClick() {
    this.auditLogger.logUserAction('Start Trial Button Clicked', 'HomeComponent', {
      fromPage: '/home',
      toPage: '/register',
      buttonLocation: 'cta_section',
      ctaText: 'Start Free Trial'
    });
  }

  onHaveAccountClick() {
    this.auditLogger.logUserAction('Have Account Button Clicked', 'HomeComponent', {
      fromPage: '/home',
      toPage: '/login',
      buttonLocation: 'cta_section',
      userType: 'returning_user'
    });
  }

  // Feature interaction handlers
  onFeatureCardHover(featureName: string) {
    this.auditLogger.logUserAction('Feature Card Hovered', 'HomeComponent', {
      featureName,
      interactionType: 'hover'
    });
  }

  onFeatureCardClick(featureName: string) {
    this.auditLogger.logUserAction('Feature Card Clicked', 'HomeComponent', {
      featureName,
      interactionType: 'click'
    });
  }

  // Scroll tracking
  onScrollToStats() {
    this.auditLogger.logUserAction('Scrolled to Stats Section', 'HomeComponent', {
      timeOnPage: Date.now() - this.componentStartTime,
      engagement: 'high'
    });
  }

  // Page visibility tracking
  onPageVisibilityChange() {
    if (document.hidden) {
      this.auditLogger.logUserAction('Page Hidden', 'HomeComponent', {
        timeBeforeHidden: Date.now() - this.componentStartTime
      });
    } else {
      this.auditLogger.logUserAction('Page Visible', 'HomeComponent', {
        timeVisible: Date.now() - this.componentStartTime
      });
    }
  }
} 