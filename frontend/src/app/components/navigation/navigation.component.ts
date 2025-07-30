import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UserResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navigation-bar" *ngIf="currentUser">
      <div class="nav-container">
        <!-- Logo and Brand -->
        <div class="nav-brand">
          <div class="brand-logo" (click)="navigateToHome()">
            <div class="logo-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <span class="brand-name">LeaveFlow</span>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="nav-links desktop-only">
          <!-- Employee Navigation -->
          <ng-container *ngIf="currentUser.role === 'EMPLOYEE'">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="onNavClick('dashboard')">
              <i class="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
            <a 
              routerLink="/leave-request" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="onNavClick('new-request')">
              <i class="fas fa-plus-circle"></i>
              <span>New Request</span>
            </a>
            <a 
              routerLink="/leave-history" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="onNavClick('my-leaves')">
              <i class="fas fa-history"></i>
              <span>My Leaves</span>
            </a>
          </ng-container>

          <!-- Admin Navigation -->
          <ng-container *ngIf="currentUser.role === 'ADMIN'">
            <a 
              routerLink="/admin" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="onNavClick('admin-dashboard')">
              <i class="fas fa-tachometer-alt"></i>
              <span>Admin Dashboard</span>
            </a>
            <a 
              routerLink="/admin/all-leaves" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="onNavClick('all-leaves')">
              <i class="fas fa-clipboard-list"></i>
              <span>All Leaves</span>
            </a>
            <a 
              routerLink="/admin/users" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="onNavClick('users')">
              <i class="fas fa-users"></i>
              <span>Users</span>
            </a>
            <!-- Employee views for admin -->
            <div class="nav-divider"></div>
            <a 
              routerLink="/dashboard" 
              routerLinkActive="active" 
              class="nav-link secondary"
              (click)="onNavClick('employee-view')">
              <i class="fas fa-user"></i>
              <span>Employee View</span>
            </a>
          </ng-container>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn mobile-only" (click)="toggleMobileMenu()">
          <div class="hamburger" [class.active]="mobileMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <!-- User Menu -->
        <div class="user-menu desktop-only">
          <div class="user-info" (click)="toggleUserMenu()">
            <div class="user-avatar">
              <span class="avatar-text">{{getUserInitials()}}</span>
            </div>
            <div class="user-details">
              <div class="user-name">{{currentUser.firstName}} {{currentUser.lastName}}</div>
              <div class="user-role">
                <i [class]="getRoleIcon(currentUser.role)" class="mr-1"></i>
                {{formatRole(currentUser.role)}}
              </div>
            </div>
            <div class="dropdown-arrow" [class.rotated]="userMenuOpen">
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>

          <!-- Desktop Dropdown Menu -->
          <div class="user-dropdown" [class.open]="userMenuOpen" (click)="closeUserMenu()">
            <div class="dropdown-header">
              <div class="dropdown-avatar">{{getUserInitials()}}</div>
              <div class="dropdown-info">
                <div class="dropdown-name">{{currentUser.firstName}} {{currentUser.lastName}}</div>
                <div class="dropdown-email">{{currentUser.email}}</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" (click)="viewProfile()">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </div>
            <div class="dropdown-item" (click)="viewSettings()">
              <i class="fas fa-cog"></i>
              <span>Settings</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item logout" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Slide Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <div class="mobile-menu-overlay" (click)="closeMobileMenu()"></div>
        <div class="mobile-menu-content">
          <!-- Mobile User Info -->
          <div class="mobile-user-info">
            <div class="mobile-avatar">{{getUserInitials()}}</div>
            <div class="mobile-user-details">
              <div class="mobile-user-name">{{currentUser.firstName}} {{currentUser.lastName}}</div>
              <div class="mobile-user-role">
                <i [class]="getRoleIcon(currentUser.role)" class="mr-2"></i>
                {{formatRole(currentUser.role)}}
              </div>
              <div class="mobile-user-email">{{currentUser.email}}</div>
            </div>
          </div>

          <div class="mobile-nav-divider"></div>

          <!-- Mobile Navigation Links -->
          <div class="mobile-nav-links">
            <!-- Employee Navigation -->
            <ng-container *ngIf="currentUser.role === 'EMPLOYEE'">
              <a 
                routerLink="/dashboard" 
                routerLinkActive="active" 
                class="mobile-nav-link"
                (click)="navigateAndCloseMobile('/dashboard')">
                <i class="fas fa-home"></i>
                <span>Dashboard</span>
                <i class="fas fa-chevron-right"></i>
              </a>
              <a 
                routerLink="/leave-request" 
                routerLinkActive="active" 
                class="mobile-nav-link"
                (click)="navigateAndCloseMobile('/leave-request')">
                <i class="fas fa-plus-circle"></i>
                <span>New Request</span>
                <i class="fas fa-chevron-right"></i>
              </a>
              <a 
                routerLink="/leave-history" 
                routerLinkActive="active" 
                class="mobile-nav-link"
                (click)="navigateAndCloseMobile('/leave-history')">
                <i class="fas fa-history"></i>
                <span>My Leaves</span>
                <i class="fas fa-chevron-right"></i>
              </a>
            </ng-container>

            <!-- Admin Navigation -->
            <ng-container *ngIf="currentUser.role === 'ADMIN'">
              <a 
                routerLink="/admin" 
                routerLinkActive="active" 
                class="mobile-nav-link"
                (click)="navigateAndCloseMobile('/admin')">
                <i class="fas fa-tachometer-alt"></i>
                <span>Admin Dashboard</span>
                <i class="fas fa-chevron-right"></i>
              </a>
              <a 
                routerLink="/admin/all-leaves" 
                routerLinkActive="active" 
                class="mobile-nav-link"
                (click)="navigateAndCloseMobile('/admin/all-leaves')">
                <i class="fas fa-clipboard-list"></i>
                <span>All Leaves</span>
                <i class="fas fa-chevron-right"></i>
              </a>
              <a 
                routerLink="/admin/users" 
                routerLinkActive="active" 
                class="mobile-nav-link"
                (click)="navigateAndCloseMobile('/admin/users')">
                <i class="fas fa-users"></i>
                <span>Users</span>
                <i class="fas fa-chevron-right"></i>
              </a>
              
              <div class="mobile-nav-section">
                <div class="mobile-nav-section-title">Employee View</div>
                <a 
                  routerLink="/dashboard" 
                  routerLinkActive="active" 
                  class="mobile-nav-link secondary"
                  (click)="navigateAndCloseMobile('/dashboard')">
                  <i class="fas fa-user"></i>
                  <span>Employee Dashboard</span>
                  <i class="fas fa-chevron-right"></i>
                </a>
              </div>
            </ng-container>
          </div>

          <div class="mobile-nav-divider"></div>

          <!-- Mobile Menu Actions -->
          <div class="mobile-menu-actions">
            <button class="mobile-action-btn" (click)="viewProfile()">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </button>
            <button class="mobile-action-btn" (click)="viewSettings()">
              <i class="fas fa-cog"></i>
              <span>Settings</span>
            </button>
            <button class="mobile-action-btn logout" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navigation-bar {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
    }

    /* Enhanced Brand */
    .nav-brand {
      display: flex;
      align-items: center;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .brand-logo:hover {
      background: rgba(99, 102, 241, 0.1);
      transform: translateY(-1px);
    }

    .logo-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .brand-name {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--gray-900);
      letter-spacing: -0.025em;
    }

    /* Enhanced Navigation Links */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-radius: 1rem;
      color: var(--gray-700);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s ease;
    }

    .nav-link:hover::before {
      left: 100%;
    }

    .nav-link:hover {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-700);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }

    .nav-link.active {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .nav-link.active:hover {
      background: linear-gradient(135deg, var(--primary-700), var(--primary-800));
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }

    .nav-link.secondary {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .nav-link i {
      font-size: 1rem;
      width: 1.25rem;
      text-align: center;
    }

    .nav-divider {
      width: 1px;
      height: 2rem;
      background: var(--gray-300);
      margin: 0 1rem;
    }

    /* Enhanced User Menu */
    .user-menu {
      position: relative;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .user-info:hover {
      background: rgba(99, 102, 241, 0.08);
      border-color: rgba(99, 102, 241, 0.2);
      transform: translateY(-1px);
    }

    .user-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .avatar-text {
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
      z-index: 2;
    }

    .user-avatar::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: rotate 3s linear infinite;
    }

    @keyframes rotate {
      to { transform: rotate(360deg); }
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-name {
      font-weight: 700;
      color: var(--gray-900);
      font-size: 0.875rem;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--primary-700);
      font-weight: 600;
      display: flex;
      align-items: center;
    }

    .dropdown-arrow {
      color: var(--gray-500);
      transition: all 0.3s ease;
      font-size: 0.75rem;
    }

    .dropdown-arrow.rotated {
      transform: rotate(180deg);
    }

    /* Enhanced Dropdown */
    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 1.5rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      min-width: 280px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-1rem) scale(0.95);
      transition: all 0.3s ease;
      z-index: 1100;
      overflow: hidden;
    }

    .user-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
      border-bottom: 1px solid rgba(99, 102, 241, 0.15);
    }

    .dropdown-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .dropdown-info {
      flex: 1;
    }

    .dropdown-name {
      font-weight: 700;
      color: var(--gray-900);
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .dropdown-email {
      font-size: 0.75rem;
      color: var(--gray-700);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--gray-800);
      font-weight: 500;
    }

    .dropdown-item:hover {
      background: rgba(99, 102, 241, 0.08);
      color: var(--primary-700);
      transform: translateX(0.25rem);
    }

    .dropdown-item.logout {
      color: var(--error-600);
    }

    .dropdown-item.logout:hover {
      background: rgba(239, 68, 68, 0.08);
      color: var(--error-700);
    }

    .dropdown-item i {
      font-size: 1rem;
      width: 1.25rem;
      text-align: center;
    }

    .dropdown-divider {
      height: 1px;
      background: rgba(0, 0, 0, 0.08);
      margin: 0.5rem 0;
    }

    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      background: rgba(99, 102, 241, 0.1);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .mobile-menu-btn:hover {
      background: rgba(99, 102, 241, 0.2);
      transform: scale(1.05);
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      transition: all 0.3s ease;
    }

    .hamburger span {
      width: 1.25rem;
      height: 2px;
      background: var(--primary-600);
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(0.3rem, 0.3rem);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(0.3rem, -0.3rem);
    }

    /* Mobile Menu */
    .mobile-menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 2000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .mobile-menu.open {
      opacity: 1;
      visibility: visible;
    }

    .mobile-menu-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
    }

    .mobile-menu-content {
      position: absolute;
      top: 0;
      right: 0;
      width: 90%;
      max-width: 400px;
      height: 100%;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .mobile-menu.open .mobile-menu-content {
      transform: translateX(0);
    }

    .mobile-user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
      border-bottom: 1px solid rgba(99, 102, 241, 0.15);
    }

    .mobile-avatar {
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .mobile-user-details {
      flex: 1;
    }

    .mobile-user-name {
      font-weight: 700;
      color: var(--gray-900);
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .mobile-user-role {
      font-size: 0.875rem;
      color: var(--primary-700);
      font-weight: 600;
      display: flex;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .mobile-user-email {
      font-size: 0.75rem;
      color: var(--gray-700);
    }

    .mobile-nav-divider {
      height: 1px;
      background: rgba(0, 0, 0, 0.08);
      margin: 1rem 0;
    }

    .mobile-nav-links {
      flex: 1;
      padding: 0 1rem;
    }

    .mobile-nav-section {
      margin: 1.5rem 0;
    }

    .mobile-nav-section-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--gray-600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
      padding: 0 1rem;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 1rem;
      color: var(--gray-800);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;
    }

    .mobile-nav-link:hover,
    .mobile-nav-link.active {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-700);
      transform: translateX(0.5rem);
    }

    .mobile-nav-link i:first-child {
      font-size: 1.25rem;
      width: 1.5rem;
      text-align: center;
    }

    .mobile-nav-link i:last-child {
      margin-left: auto;
      font-size: 0.875rem;
      opacity: 0.5;
    }

    .mobile-nav-link.secondary {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .mobile-menu-actions {
      padding: 1.5rem;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    .mobile-action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: none;
      border: none;
      color: var(--gray-800);
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;
    }

    .mobile-action-btn:hover {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-700);
    }

    .mobile-action-btn.logout {
      color: var(--error-600);
    }

    .mobile-action-btn.logout:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error-700);
    }

    .mobile-action-btn i {
      font-size: 1.25rem;
      width: 1.5rem;
      text-align: center;
    }

    /* Responsive */
    .desktop-only {
      display: flex;
    }

    .mobile-only {
      display: none;
    }

    @media (max-width: 1024px) {
      .nav-container {
        padding: 0 1.5rem;
      }

      .nav-links {
        gap: 0.25rem;
      }

      .nav-link {
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
      }

      .nav-link span {
        display: none;
      }

      .nav-link i {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 768px) {
      .nav-container {
        padding: 0 1rem;
        height: 70px;
      }

      .desktop-only {
        display: none;
      }

      .mobile-only {
        display: flex;
      }

      .brand-name {
        font-size: 1.25rem;
      }

      .logo-icon {
        width: 2rem;
        height: 2rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        padding: 0 1rem;
      }

      .brand-name {
        display: none;
      }

      .mobile-menu-content {
        width: 100%;
      }
    }
  `]
})
export class NavigationComponent implements OnInit {
  currentUser: UserResponse | null = null;
  userMenuOpen = false;
  mobileMenuOpen = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.userMenuOpen = false;
    }
  }

  ngOnInit() {
    this.currentUser = this.apiService.getCurrentUser();
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  formatRole(role: string): string {
    return role.charAt(0) + role.slice(1).toLowerCase();
  }

  getRoleIcon(role: string): string {
    return role === 'ADMIN' ? 'fas fa-crown' : 'fas fa-user';
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  navigateToHome() {
    this.closeUserMenu();
    if (this.currentUser?.role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  navigateAndCloseMobile(route: string) {
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  onNavClick(action: string) {
    // Analytics or tracking can be added here
    console.log('Navigation clicked:', action);
  }

  viewProfile() {
    this.closeUserMenu();
    this.closeMobileMenu();
    // TODO: Implement profile page
    console.log('Navigate to profile');
  }

  viewSettings() {
    this.closeUserMenu();
    this.closeMobileMenu();
    // TODO: Implement settings page
    console.log('Navigate to settings');
  }

  logout() {
    this.closeUserMenu();
    this.closeMobileMenu();
    this.apiService.logout();
    this.router.navigate(['/home']);
  }
} 