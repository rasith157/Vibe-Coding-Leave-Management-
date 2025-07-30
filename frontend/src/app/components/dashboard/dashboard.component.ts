import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UserResponse } from '../../interfaces/auth.interface';
import { LeaveResponse, LeaveBalance, LeaveType, LeaveStatus } from '../../interfaces/leave.interface';

@Component({
  selector: 'app-dashboard',
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
        </div>
      </div>

      <div class="dashboard-container relative z-10">
        <!-- Enhanced Header -->
        <div class="dashboard-header fade-in-up">
          <div class="header-content">
            <div class="welcome-section">
              <div class="avatar-section">
                <div class="user-avatar">
                  <i class="fas fa-user text-white text-xl"></i>
                </div>
                <div class="welcome-text">
                  <h1 class="welcome-title">Welcome back, {{currentUser?.firstName}}! 👋</h1>
                  <p class="welcome-subtitle">Here's your leave management overview</p>
                </div>
              </div>
              <div class="header-actions">
                <button class="btn btn-secondary backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30" (click)="refreshData()">
                  <i class="fas fa-refresh mr-2" [class.fa-spin]="loadingBalance || loadingLeaves"></i>
                  Refresh
                </button>
                <button class="btn btn-primary" (click)="navigateToLeaveRequest()">
                  <i class="fas fa-plus mr-2"></i>
                  Request Leave
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Leave Balance Cards -->
        <div class="balance-section fade-in-up" style="animation-delay: 0.1s">
          <h2 class="section-title">
            <i class="fas fa-chart-pie mr-3"></i>
            Leave Balance Overview
          </h2>
          
        <div class="balance-grid" *ngIf="leaveBalance">
            <div class="balance-card annual fade-in-up" style="animation-delay: 0.2s">
              <div class="card-gradient annual-gradient"></div>
              <div class="balance-icon">
                <i class="fas fa-umbrella-beach"></i>
              </div>
            <div class="balance-info">
              <h3>Annual Leave</h3>
              <div class="balance-numbers">
                <span class="remaining">{{leaveBalance.annualRemaining}}</span>
                <span class="separator">/</span>
                <span class="total">{{leaveBalance.annualRemaining + leaveBalance.annualUsed}}</span>
                  <span class="unit">days</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill annual-progress" 
                       [style.width.%]="getProgressPercentage(leaveBalance.annualUsed, leaveBalance.annualRemaining + leaveBalance.annualUsed)">
                  </div>
              </div>
              <p class="used-info">{{leaveBalance.annualUsed}} days used this year</p>
            </div>
          </div>

            <div class="balance-card sick fade-in-up" style="animation-delay: 0.3s">
              <div class="card-gradient sick-gradient"></div>
              <div class="balance-icon">
                <i class="fas fa-hospital"></i>
              </div>
            <div class="balance-info">
              <h3>Sick Leave</h3>
              <div class="balance-numbers">
                <span class="remaining">{{leaveBalance.sickRemaining}}</span>
                <span class="separator">/</span>
                <span class="total">{{leaveBalance.sickRemaining + leaveBalance.sickUsed}}</span>
                  <span class="unit">days</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill sick-progress" 
                       [style.width.%]="getProgressPercentage(leaveBalance.sickUsed, leaveBalance.sickRemaining + leaveBalance.sickUsed)">
                  </div>
              </div>
              <p class="used-info">{{leaveBalance.sickUsed}} days used this year</p>
            </div>
          </div>

            <div class="balance-card casual fade-in-up" style="animation-delay: 0.4s">
              <div class="card-gradient casual-gradient"></div>
              <div class="balance-icon">
                <i class="fas fa-coffee"></i>
              </div>
            <div class="balance-info">
              <h3>Casual Leave</h3>
              <div class="balance-numbers">
                <span class="remaining">{{leaveBalance.casualRemaining}}</span>
                <span class="separator">/</span>
                <span class="total">{{leaveBalance.casualRemaining + leaveBalance.casualUsed}}</span>
                  <span class="unit">days</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill casual-progress" 
                       [style.width.%]="getProgressPercentage(leaveBalance.casualUsed, leaveBalance.casualRemaining + leaveBalance.casualUsed)">
                  </div>
              </div>
              <p class="used-info">{{leaveBalance.casualUsed}} days used this year</p>
            </div>
          </div>
        </div>

          <!-- Enhanced Loading State -->
          <div class="skeleton-grid" *ngIf="loadingBalance">
            <div class="skeleton-card" *ngFor="let item of [1,2,3]">
              <div class="skeleton-content">
                <div class="skeleton-circle"></div>
                <div class="skeleton-text">
                  <div class="skeleton-line skeleton-title"></div>
                  <div class="skeleton-line skeleton-number"></div>
                  <div class="skeleton-line skeleton-subtitle"></div>
                </div>
              </div>
            </div>
        </div>
      </div>

        <!-- Enhanced Quick Actions -->
        <div class="quick-actions-section fade-in-up" style="animation-delay: 0.5s">
          <h2 class="section-title">
            <i class="fas fa-bolt mr-3"></i>
            Quick Actions
          </h2>
        <div class="actions-grid">
            <button class="action-card primary-action" (click)="navigateToLeaveRequest()">
              <div class="action-gradient primary-gradient"></div>
              <div class="action-icon">
                <i class="fas fa-calendar-plus"></i>
              </div>
              <div class="action-content">
                <h3>Request Leave</h3>
                <p>Submit a new leave request</p>
              </div>
              <div class="action-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
          </button>
            
            <button class="action-card secondary-action" (click)="navigateToLeaveHistory()">
              <div class="action-gradient secondary-gradient"></div>
              <div class="action-icon">
                <i class="fas fa-history"></i>
              </div>
              <div class="action-content">
                <h3>View History</h3>
                <p>Check your leave history</p>
              </div>
              <div class="action-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
          </button>
            
            <button class="action-card secondary-action" *ngIf="currentUser?.role === 'ADMIN'" routerLink="/admin">
              <div class="action-gradient admin-gradient"></div>
              <div class="action-icon">
                <i class="fas fa-users-cog"></i>
              </div>
              <div class="action-content">
                <h3>Admin Panel</h3>
                <p>Manage team leaves</p>
              </div>
              <div class="action-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
          </button>
        </div>
          </div>

        <!-- Enhanced Recent Leaves -->
        <div class="recent-leaves-section fade-in-up" style="animation-delay: 0.6s">
          <h2 class="section-title">
            <i class="fas fa-clock mr-3"></i>
            Recent Leave Requests
          </h2>
        
          <div class="leaves-container" *ngIf="recentLeaves.length > 0">
            <div class="leave-item" *ngFor="let leave of recentLeaves; let i = index" 
                 [style.animation-delay]="(0.7 + i * 0.1) + 's'">
              <div class="leave-status-indicator" [ngClass]="leave.status.toLowerCase()"></div>
            <div class="leave-type-badge" [ngClass]="leave.leaveType.toLowerCase()">
                <i [class]="getLeaveTypeIcon(leave.leaveType)" class="mr-2"></i>
              {{formatLeaveType(leave.leaveType)}}
              </div>
            <div class="leave-details">
              <div class="leave-dates">
                  <i class="fas fa-calendar mr-2"></i>
                {{formatDate(leave.startDate)}} - {{formatDate(leave.endDate)}}
                  <span class="duration">({{leave.duration}} day{{leave.duration > 1 ? 's' : ''}})</span>
                </div>
                <div class="leave-reason" *ngIf="leave.reason">
                  <i class="fas fa-comment mr-2"></i>
                  {{leave.reason}}
                </div>
              </div>
              <div class="leave-status" [ngClass]="leave.status.toLowerCase()">
                <div class="status-dot"></div>
                <span>{{formatStatus(leave.status)}}</span>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="!loadingLeaves && recentLeaves.length === 0">
            <div class="empty-icon">
              <i class="fas fa-calendar-times"></i>
            </div>
            <h3>No Leave Requests Yet</h3>
            <p>You haven't submitted any leave requests. Ready to take some time off?</p>
            <button class="btn btn-primary" (click)="navigateToLeaveRequest()">
              <i class="fas fa-plus mr-2"></i>
              Create Your First Request
            </button>
          </div>

          <!-- Enhanced Loading State -->
          <div class="skeleton-list" *ngIf="loadingLeaves">
            <div class="skeleton-leave-item" *ngFor="let item of [1,2,3,4,5]">
              <div class="skeleton-badge"></div>
              <div class="skeleton-content">
                <div class="skeleton-line skeleton-date"></div>
                <div class="skeleton-line skeleton-reason"></div>
              </div>
              <div class="skeleton-status"></div>
            </div>
        </div>

          <div class="view-all-section" *ngIf="recentLeaves.length > 0">
            <button class="view-all-btn" (click)="navigateToLeaveHistory()">
              <span>View All Leave Requests</span>
              <i class="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base Layout */
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Enhanced Header */
    .dashboard-header {
      margin-bottom: 3rem;
    }

    .header-content {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 2rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.5rem;
      letter-spacing: -0.025em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .welcome-subtitle {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1.1rem;
      font-weight: 500;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    /* Section Titles */
    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    /* Enhanced Balance Cards */
    .balance-section {
      margin-bottom: 4rem;
    }

    .balance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .balance-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 2rem;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.4);
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .balance-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      background: rgba(255, 255, 255, 1);
    }

    .card-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      border-radius: 2rem 2rem 0 0;
    }

    .annual-gradient { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
    .sick-gradient { background: linear-gradient(90deg, #ef4444, #dc2626); }
    .casual-gradient { background: linear-gradient(90deg, #10b981, #059669); }

    .balance-icon {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      color: var(--primary-700);
    }

    .balance-info h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 1rem;
      letter-spacing: -0.025em;
    }

    .balance-numbers {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .balance-numbers .remaining {
      font-size: 3rem;
      font-weight: 800;
      color: var(--gray-900);
      line-height: 1;
    }

    .balance-numbers .separator {
      font-size: 2rem;
      color: var(--gray-500);
      font-weight: 300;
    }

    .balance-numbers .total {
      font-size: 2rem;
      color: var(--gray-600);
      font-weight: 600;
    }

    .balance-numbers .unit {
      font-size: 1rem;
      color: var(--gray-700);
      font-weight: 500;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--gray-200);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
      border-radius: 4px;
      transition: width 1s ease-in-out;
      animation: progressAnimation 2s ease-in-out;
    }

    .annual-progress { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
    .sick-progress { background: linear-gradient(90deg, #ef4444, #dc2626); }
    .casual-progress { background: linear-gradient(90deg, #10b981, #059669); }

    @keyframes progressAnimation {
      from { width: 0% !important; }
    }

    .used-info {
      font-size: 0.875rem;
      color: var(--gray-700);
      font-weight: 500;
    }

    /* Enhanced Quick Actions */
    .quick-actions-section {
      margin-bottom: 4rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .action-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 2rem;
      padding: 2rem;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.4);
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      text-align: left;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .action-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      background: rgba(255, 255, 255, 1);
    }

    .action-card:hover .action-arrow {
      transform: translateX(4px);
    }

    .action-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      border-radius: 2rem 2rem 0 0;
    }

    .primary-gradient { background: linear-gradient(90deg, var(--primary-500), var(--primary-600)); }
    .secondary-gradient { background: linear-gradient(90deg, var(--gray-400), var(--gray-500)); }
    .admin-gradient { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }

    .action-icon {
      width: 3.5rem;
      height: 3.5rem;
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--primary-700);
      flex-shrink: 0;
    }

    .action-content {
      flex: 1;
    }

    .action-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
    }

    .action-content p {
      color: var(--gray-700);
      font-size: 0.875rem;
      margin: 0;
    }

    .action-arrow {
      color: var(--primary-700);
      font-size: 1.25rem;
      transition: transform 0.3s ease;
    }

    /* Enhanced Recent Leaves */
    .recent-leaves-section {
      margin-bottom: 4rem;
    }

    .leaves-container {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 2rem;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .leave-item {
      display: flex;
      align-items: center;
      padding: 2rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      gap: 1.5rem;
      position: relative;
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease-out both;
    }

    .leave-item:last-child {
      border-bottom: none;
    }

    .leave-item:hover {
      background: rgba(99, 102, 241, 0.03);
    }

    .leave-status-indicator {
      width: 4px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 0 4px 4px 0;
    }

    .leave-status-indicator.pending { background: #f59e0b; }
    .leave-status-indicator.approved { background: #10b981; }
    .leave-status-indicator.rejected { background: #ef4444; }

    .leave-type-badge {
      padding: 0.75rem 1.25rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .leave-type-badge.annual {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      color: #1e3a8a;
    }

    .leave-type-badge.sick {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #991b1b;
    }

    .leave-type-badge.casual {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
      color: #064e3b;
    }

    .leave-type-badge.emergency {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #78350f;
    }

    .leave-details {
      flex: 1;
    }

    .leave-dates {
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      font-size: 1rem;
    }

    .duration {
      color: var(--gray-600);
      font-weight: 500;
      font-size: 0.875rem;
      margin-left: 0.5rem;
    }

    .leave-reason {
      color: var(--gray-700);
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      line-height: 1.5;
    }

    .leave-status {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.75rem 1.25rem;
      border-radius: 1rem;
      flex-shrink: 0;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .leave-status.pending {
      background: rgba(245, 158, 11, 0.15);
      color: #b45309;
    }

    .leave-status.pending .status-dot { background: #f59e0b; }

    .leave-status.approved {
      background: rgba(16, 185, 129, 0.15);
      color: #047857;
    }

    .leave-status.approved .status-dot { background: #10b981; }

    .leave-status.rejected {
      background: rgba(239, 68, 68, 0.15);
      color: #b91c1c;
    }

    .leave-status.rejected .status-dot { background: #ef4444; }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
      border-radius: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem auto;
      font-size: 2rem;
      color: var(--gray-500);
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: var(--gray-700);
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    /* View All Section */
    .view-all-section {
      padding: 1.5rem;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      text-align: center;
      background: rgba(249, 250, 251, 0.5);
    }

    .view-all-btn {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: white;
      padding: 1rem 2rem;
      border-radius: 1rem;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      font-size: 0.875rem;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .view-all-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    }

    /* Enhanced Skeleton Loading */
    .skeleton-grid, .skeleton-list {
      display: grid;
      gap: 2rem;
    }

    .skeleton-grid {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }

    .skeleton-card, .skeleton-leave-item {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 2rem;
      padding: 2.5rem;
      border: 1px solid rgba(255, 255, 255, 0.4);
      animation: pulse 2s ease-in-out infinite;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .skeleton-leave-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
    }

    .skeleton-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .skeleton-circle {
      width: 4rem;
      height: 4rem;
      background: var(--gray-200);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .skeleton-text {
      flex: 1;
    }

    .skeleton-line {
      background: var(--gray-200);
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .skeleton-title { height: 1.5rem; width: 60%; }
    .skeleton-number { height: 2rem; width: 40%; }
    .skeleton-subtitle { height: 1rem; width: 80%; margin-bottom: 0; }

    .skeleton-badge { width: 6rem; height: 2rem; background: var(--gray-200); border-radius: 1rem; flex-shrink: 0; }
    .skeleton-date { height: 1.25rem; width: 70%; }
    .skeleton-reason { height: 1rem; width: 90%; margin-bottom: 0; }
    .skeleton-status { width: 5rem; height: 2rem; background: var(--gray-200); border-radius: 1rem; flex-shrink: 0; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

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
      width: 300px;
      height: 300px;
      top: 10%;
      left: -5%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      top: 50%;
      right: -5%;
      animation-delay: 3s;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 10%;
      animation-delay: 6s;
    }

    .shape-4 {
      width: 250px;
      height: 250px;
      top: 30%;
      right: 20%;
      animation-delay: 9s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
      }
      25% {
        transform: translateY(-20px) rotate(90deg);
        opacity: 0.4;
      }
      50% {
        transform: translateY(-40px) rotate(180deg);
        opacity: 0.5;
    }
      75% {
        transform: translateY(-20px) rotate(270deg);
        opacity: 0.4;
      }
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .dashboard-container {
        padding: 1.5rem;
      }

      .welcome-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
      }

      .balance-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .welcome-title {
        font-size: 2rem;
      }

      .balance-card {
        padding: 2rem;
      }

      .balance-numbers .remaining {
        font-size: 2.5rem;
      }

      .leave-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem;
      }

      .leave-status {
        align-self: flex-end;
      }

      .action-card {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .balance-grid {
        grid-template-columns: 1fr;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }

      .header-actions .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: UserResponse | null = null;
  leaveBalance: LeaveBalance | null = null;
  recentLeaves: LeaveResponse[] = [];
  loadingBalance = true;
  loadingLeaves = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.apiService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loadLeaveBalance();
    this.loadRecentLeaves();
  }

  loadLeaveBalance() {
    this.loadingBalance = true;
    this.apiService.getLeaveBalance().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.leaveBalance = response.data;
        }
        this.loadingBalance = false;
      },
      error: (error) => {
        console.error('Error loading leave balance:', error);
        this.loadingBalance = false;
      }
    });
  }

  loadRecentLeaves() {
    this.loadingLeaves = true;
    this.apiService.getMyLeaves().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Sort by creation date and take the 5 most recent
          this.recentLeaves = response.data
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
        }
        this.loadingLeaves = false;
      },
      error: (error) => {
        console.error('Error loading recent leaves:', error);
        this.loadingLeaves = false;
      }
    });
  }

  refreshData() {
    this.loadDashboardData();
  }

  navigateToLeaveRequest() {
    this.router.navigate(['/leave-request']);
  }

  navigateToLeaveHistory() {
    this.router.navigate(['/leave-history']);
  }

  getProgressPercentage(used: number, total: number): number {
    if (total === 0) return 0;
    return Math.min((used / total) * 100, 100);
  }

  getLeaveTypeIcon(type: string): string {
    switch (type) {
      case LeaveType.ANNUAL: return 'fas fa-umbrella-beach';
      case LeaveType.SICK: return 'fas fa-hospital';
      case LeaveType.CASUAL: return 'fas fa-coffee';
      case LeaveType.EMERGENCY: return 'fas fa-exclamation-triangle';
      default: return 'fas fa-calendar';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatLeaveType(type: string): string {
    switch (type) {
      case LeaveType.ANNUAL: return 'Annual';
      case LeaveType.SICK: return 'Sick';
      case LeaveType.CASUAL: return 'Casual';
      case LeaveType.EMERGENCY: return 'Emergency';
      default: return type;
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case LeaveStatus.PENDING: return 'Pending';
      case LeaveStatus.APPROVED: return 'Approved';
      case LeaveStatus.REJECTED: return 'Rejected';
      default: return status;
    }
  }
} 