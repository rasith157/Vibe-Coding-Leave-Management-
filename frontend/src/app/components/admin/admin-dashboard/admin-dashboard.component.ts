import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { UserResponse } from '../../../interfaces/auth.interface';
import { LeaveResponse, User, LeaveType, LeaveStatus } from '../../../interfaces/leave.interface';

interface SystemStats {
  totalUsers: number;
  totalLeaves: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  activeEmployees: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-text">
            <h1>Admin Dashboard</h1>
            <p>System overview and leave management</p>
                </div>
          <div class="header-actions">
            <button class="btn-secondary" (click)="refreshData()">
              <span class="btn-icon">🔄</span>
              Refresh
              </button>
            <button class="btn-primary" (click)="navigateToUserManagement()">
              <span class="btn-icon">👥</span>
              Manage Users
              </button>
            </div>
          </div>
        </div>

      <!-- System Stats -->
      <div class="stats-section">
        <h2>System Overview</h2>
        <div class="stats-grid" *ngIf="systemStats">
          <div class="stat-card users">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>Total Users</h3>
              <div class="stat-number">{{systemStats.totalUsers}}</div>
              <p class="stat-detail">{{systemStats.activeEmployees}} active employees</p>
            </div>
        </div>

          <div class="stat-card leaves">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <h3>Total Leaves</h3>
              <div class="stat-number">{{systemStats.totalLeaves}}</div>
              <p class="stat-detail">All time requests</p>
            </div>
          </div>

          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <h3>Pending</h3>
              <div class="stat-number">{{systemStats.pendingLeaves}}</div>
              <p class="stat-detail">Awaiting approval</p>
            </div>
          </div>

          <div class="stat-card approved">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>Approved</h3>
              <div class="stat-number">{{systemStats.approvedLeaves}}</div>
              <p class="stat-detail">This month</p>
              </div>
            </div>
          </div>

        <div class="loading-placeholder" *ngIf="loadingStats">
          <p>Loading system statistics...</p>
          </div>
        </div>

      <!-- Pending Approvals -->
      <div class="pending-section">
        <div class="section-header">
          <h2>Pending Approvals</h2>
          <span class="pending-count" *ngIf="pendingLeaves.length > 0">
            {{pendingLeaves.length}} request{{pendingLeaves.length !== 1 ? 's' : ''}} pending
          </span>
          </div>

        <div class="pending-grid" *ngIf="!loadingPending && pendingLeaves.length > 0">
          <div class="pending-card" *ngFor="let leave of pendingLeaves">
            <div class="card-header">
              <div class="employee-info">
                <h4>{{leave.userName || 'Unknown User'}}</h4>
                <p>{{leave.userEmail}}</p>
            </div>
              <div class="leave-type-badge" [ngClass]="leave.leaveType.toLowerCase()">
                {{formatLeaveType(leave.leaveType)}}
              </div>
            </div>

            <div class="card-body">
              <div class="leave-details">
                <div class="detail-item">
                  <strong>Duration:</strong>
                  <span>{{leave.duration}} day{{leave.duration !== 1 ? 's' : ''}}</span>
            </div>
                <div class="detail-item">
                  <strong>Dates:</strong>
                  <span>{{formatDate(leave.startDate)}} - {{formatDate(leave.endDate)}}</span>
                    </div>
                <div class="detail-item" *ngIf="leave.reason">
                  <strong>Reason:</strong>
                  <span>{{leave.reason}}</span>
                      </div>
                <div class="detail-item">
                  <strong>Submitted:</strong>
                  <span>{{formatDate(leave.createdAt)}}</span>
                      </div>
                      </div>
                    </div>

            <div class="card-actions">
                    <button 
                class="btn-approve"
                (click)="approveLeave(leave)"
                [disabled]="processingLeaves.has(leave.id)">
                <span *ngIf="!processingLeaves.has(leave.id)">✅ Approve</span>
                <span *ngIf="processingLeaves.has(leave.id)" class="processing">
                  <span class="spinner"></span>Processing...
                </span>
                    </button>
                    <button 
                class="btn-reject"
                (click)="rejectLeave(leave)"
                [disabled]="processingLeaves.has(leave.id)">
                <span *ngIf="!processingLeaves.has(leave.id)">❌ Reject</span>
                <span *ngIf="processingLeaves.has(leave.id)" class="processing">
                  <span class="spinner"></span>Processing...
                </span>
                    </button>
              </div>
            </div>
          </div>

        <div class="empty-state" *ngIf="!loadingPending && pendingLeaves.length === 0">
          <div class="empty-icon">🎉</div>
          <h3>All caught up!</h3>
          <p>No pending leave requests to review.</p>
            </div>

        <div class="loading-placeholder" *ngIf="loadingPending">
          <p>Loading pending requests...</p>
              </div>
            </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h2>Recent Activity</h2>
        
        <div class="activity-list" *ngIf="recentActivity.length > 0">
          <div class="activity-item" *ngFor="let leave of recentActivity">
            <div class="activity-status" [ngClass]="leave.status.toLowerCase()">
              <span class="status-indicator"></span>
                      </div>
            <div class="activity-details">
              <div class="activity-main">
                <strong>{{leave.userName || 'Unknown User'}}</strong>
                <span class="activity-action">
                  {{getActivityAction(leave.status)}}
                      </span>
                <span class="leave-type-badge small" [ngClass]="leave.leaveType.toLowerCase()">
                  {{formatLeaveType(leave.leaveType)}}
                      </span>
              </div>
              <div class="activity-meta">
                {{formatDate(leave.startDate)}} - {{formatDate(leave.endDate)}}
                ({{leave.duration}} day{{leave.duration !== 1 ? 's' : ''}})
                • {{formatRelativeTime(leave.updatedAt)}}
              </div>
            </div>
            </div>
          </div>

        <div class="view-all-activity" *ngIf="recentActivity.length > 0">
          <button class="btn-link" (click)="navigateToAllLeaves()">
            View all leave requests →
              </button>
            </div>

        <div class="loading-placeholder" *ngIf="loadingActivity">
          <p>Loading recent activity...</p>
              </div>
            </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-card" (click)="navigateToAllLeaves()">
            <div class="action-icon">📋</div>
            <div class="action-text">
              <h4>All Leave Requests</h4>
              <p>View and manage all leave requests</p>
                  </div>
          </button>

          <button class="action-card" (click)="navigateToUserManagement()">
            <div class="action-icon">👥</div>
            <div class="action-text">
              <h4>User Management</h4>
              <p>Manage employees and permissions</p>
                  </div>
          </button>

          <button class="action-card" (click)="navigateToReports()">
            <div class="action-icon">📊</div>
            <div class="action-text">
              <h4>Reports</h4>
              <p>Generate leave reports and analytics</p>
                </div>
          </button>

          <button class="action-card" (click)="navigateToSettings()">
            <div class="action-icon">⚙️</div>
            <div class="action-text">
              <h4>System Settings</h4>
              <p>Configure leave policies and rules</p>
                </div>
              </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .header-content {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .header-text h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .header-text p {
      color: #6b7280;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary, .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .btn-primary:hover {
      background: #2563eb;
      border-color: #2563eb;
    }

    .btn-secondary {
      background: white;
      color: #6b7280;
      border-color: #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-icon {
      font-size: 1rem;
    }

    .stats-section, .pending-section, .activity-section, .quick-actions-section {
      margin-bottom: 40px;
    }

    .stats-section h2, .pending-section h2, .activity-section h2, .quick-actions-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-card.users { border-left-color: #3b82f6; }
    .stat-card.leaves { border-left-color: #10b981; }
    .stat-card.pending { border-left-color: #f59e0b; }
    .stat-card.approved { border-left-color: #10b981; }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-info h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .stat-detail {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .pending-count {
      background: #fef3c7;
      color: #92400e;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .pending-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .pending-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .card-header {
      padding: 20px;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .employee-info h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .employee-info p {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .leave-type-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .leave-type-badge.annual {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .leave-type-badge.sick {
      background: #fee2e2;
      color: #dc2626;
    }

    .leave-type-badge.casual {
      background: #d1fae5;
      color: #065f46;
    }

    .leave-type-badge.emergency {
      background: #fef3c7;
      color: #92400e;
    }

    .card-body {
      padding: 20px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      gap: 16px;
    }

    .detail-item strong {
      color: #374151;
      font-weight: 600;
      min-width: 80px;
    }

    .card-actions {
      padding: 16px 20px;
      background: #f9fafb;
      display: flex;
      gap: 12px;
    }

    .btn-approve, .btn-reject {
      flex: 1;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .btn-approve {
      background: #10b981;
      color: white;
      border-color: #10b981;
    }

    .btn-approve:hover:not(:disabled) {
      background: #059669;
      border-color: #059669;
    }

    .btn-reject {
      background: #ef4444;
      color: white;
      border-color: #ef4444;
    }

    .btn-reject:hover:not(:disabled) {
      background: #dc2626;
      border-color: #dc2626;
    }

    .btn-approve:disabled, .btn-reject:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .processing {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .empty-state, .loading-placeholder {
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      color: #1f2937;
      margin-bottom: 8px;
    }

    .activity-list {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .activity-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f3f4f6;
      gap: 16px;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-status {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .activity-status.approved { background: #d1fae5; }
    .activity-status.rejected { background: #fee2e2; }
    .activity-status.pending { background: #fef3c7; }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .activity-status.approved .status-indicator { background: #10b981; }
    .activity-status.rejected .status-indicator { background: #ef4444; }
    .activity-status.pending .status-indicator { background: #f59e0b; }

    .activity-details {
      flex: 1;
    }

    .activity-main {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      flex-wrap: wrap;
    }

    .activity-action {
      color: #6b7280;
    }

    .leave-type-badge.small {
      padding: 2px 8px;
      font-size: 0.6rem;
    }

    .activity-meta {
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .view-all-activity {
      text-align: center;
      padding: 16px;
      border-top: 1px solid #f3f4f6;
      background: white;
      border-radius: 0 0 12px 12px;
    }

    .btn-link {
      background: none;
      border: none;
      color: #3b82f6;
      cursor: pointer;
      font-weight: 600;
      text-decoration: underline;
    }

    .btn-link:hover {
      color: #2563eb;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .action-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 16px;
      text-align: left;
    }

    .action-card:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .action-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .action-text h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .action-text p {
      color: #6b7280;
      font-size: 0.875rem;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .admin-dashboard-container {
        padding: 16px;
      }

      .header-content {
        padding: 20px;
        flex-direction: column;
        align-items: stretch;
      }

      .header-actions {
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .pending-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .activity-main {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .card-actions {
        flex-direction: column;
      }

      .detail-item {
        flex-direction: column;
        gap: 4px;
      }

      .detail-item strong {
        min-width: auto;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: UserResponse | null = null;
  systemStats: SystemStats | null = null;
  pendingLeaves: LeaveResponse[] = [];
  recentActivity: LeaveResponse[] = [];
  processingLeaves = new Set<number>();
  
  loadingStats = true;
  loadingPending = true;
  loadingActivity = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.apiService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loadSystemStats();
    this.loadPendingLeaves();
    this.loadRecentActivity();
  }

  loadSystemStats() {
    this.loadingStats = true;
    
    // Load database status which includes user and leave counts
    this.apiService.getDatabaseStatus().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const data = response.data;
          
          this.systemStats = {
            totalUsers: data.userCount || 0,
            totalLeaves: data.leaveCount || 0,
            pendingLeaves: 0, // Will be updated from pending leaves call
            approvedLeaves: 0, // Will be calculated from leaves data
            rejectedLeaves: 0, // Will be calculated from leaves data
            activeEmployees: data.users ? data.users.filter((u: any) => u.active).length : 0
          };

          // Calculate status counts from leaves data
          if (data.leaves) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            let approvedThisMonth = 0;
            let rejectedTotal = 0;
            let pendingTotal = 0;

            data.leaves.forEach((leave: any) => {
              const createdDate = new Date(leave.createdAt);
              
              if (leave.status === 'PENDING') {
                pendingTotal++;
              } else if (leave.status === 'REJECTED') {
                rejectedTotal++;
              } else if (leave.status === 'APPROVED') {
                if (createdDate.getMonth() === currentMonth && 
                    createdDate.getFullYear() === currentYear) {
                  approvedThisMonth++;
                }
              }
            });

            this.systemStats.pendingLeaves = pendingTotal;
            this.systemStats.approvedLeaves = approvedThisMonth;
            this.systemStats.rejectedLeaves = rejectedTotal;
          }
        }
        this.loadingStats = false;
      },
      error: (error) => {
        console.error('Error loading system stats:', error);
        this.loadingStats = false;
      }
    });
  }

  loadPendingLeaves() {
    this.loadingPending = true;
    this.apiService.getPendingLeaves().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pendingLeaves = response.data;
        }
        this.loadingPending = false;
      },
      error: (error) => {
        console.error('Error loading pending leaves:', error);
        this.loadingPending = false;
      }
    });
  }

  loadRecentActivity() {
    this.loadingActivity = true;
    this.apiService.getAllLeaves().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Get the 10 most recently updated leaves (excluding pending)
          this.recentActivity = response.data
            .filter(leave => leave.status !== LeaveStatus.PENDING)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 10);
        }
        this.loadingActivity = false;
      },
      error: (error) => {
        console.error('Error loading recent activity:', error);
        this.loadingActivity = false;
      }
    });
  }

  approveLeave(leave: LeaveResponse) {
    this.processLeaveAction(leave, 'APPROVED');
  }

  rejectLeave(leave: LeaveResponse) {
    const comments = prompt('Please provide a reason for rejection (optional):');
    this.processLeaveAction(leave, 'REJECTED', comments || undefined);
  }

  private processLeaveAction(leave: LeaveResponse, status: string, comments?: string) {
    this.processingLeaves.add(leave.id);

    const request = {
      status,
      comments
    };

    this.apiService.approveLeave(leave.id, request).subscribe({
      next: (response) => {
        this.processingLeaves.delete(leave.id);
        if (response.success) {
          // Remove from pending list
          this.pendingLeaves = this.pendingLeaves.filter(l => l.id !== leave.id);
          
          // Add to recent activity
          if (response.data) {
            this.recentActivity.unshift(response.data);
            this.recentActivity = this.recentActivity.slice(0, 10);
          }

          // Update stats
          if (this.systemStats) {
            this.systemStats.pendingLeaves--;
            if (status === 'APPROVED') {
              this.systemStats.approvedLeaves++;
            } else {
              this.systemStats.rejectedLeaves++;
            }
          }
        }
      },
      error: (error) => {
        this.processingLeaves.delete(leave.id);
        console.error('Error processing leave:', error);
        alert('Failed to process leave request. Please try again.');
      }
    });
  }

  refreshData() {
    this.loadDashboardData();
  }

  navigateToAllLeaves() {
    this.router.navigate(['/admin/all-leaves']);
  }

  navigateToUserManagement() {
    this.router.navigate(['/admin/users']);
  }

  navigateToReports() {
    // TODO: Implement reports page
    console.log('Navigate to reports');
  }

  navigateToSettings() {
    // TODO: Implement settings page
    console.log('Navigate to settings');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
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

  getActivityAction(status: string): string {
    switch (status) {
      case LeaveStatus.APPROVED: return 'was approved for';
      case LeaveStatus.REJECTED: return 'was rejected for';
      default: return 'requested';
    }
  }
} 