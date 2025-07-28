import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuditLoggerService } from '../../services/audit-logger.service';

interface Leave {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: string;
  createdAt: string;
  comments?: string;
  approvedByName?: string;
}

interface LeaveBalance {
  annualRemaining: number;
  sickRemaining: number;
  casualRemaining: number;
  annualUsed: number;
  sickUsed: number;
  casualUsed: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <!-- Navigation Bar -->
      <nav class="bg-white shadow-lg border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- Logo and Title -->
            <div class="flex items-center">
              <div class="flex-shrink-0 flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <i class="fas fa-calendar-alt text-white text-lg"></i>
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900">LeaveFlow</h1>
                  <p class="text-xs text-gray-500">Employee Dashboard</p>
                </div>
              </div>
            </div>

            <!-- User Info and Actions -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{currentUser?.firstName}} {{currentUser?.lastName}}</p>
                  <p class="text-xs text-gray-500">{{currentUser?.email}}</p>
                </div>
                <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">{{getUserInitials()}}</span>
                </div>
              </div>
              <button 
                (click)="logout()"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome back, {{currentUser?.firstName}}!</h2>
          <p class="text-lg text-gray-600">Manage your leave requests and view your leave balance.</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" *ngIf="leaveBalance">
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-calendar-check text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Annual Leave</p>
                <p class="text-2xl font-bold text-gray-900">{{leaveBalance.annualRemaining}}</p>
                <p class="text-xs text-gray-500">{{leaveBalance.annualUsed}} days used</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-heartbeat text-blue-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Sick Leave</p>
                <p class="text-2xl font-bold text-gray-900">{{leaveBalance.sickRemaining}}</p>
                <p class="text-xs text-gray-500">{{leaveBalance.sickUsed}} days used</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-coffee text-purple-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Casual Leave</p>
                <p class="text-2xl font-bold text-gray-900">{{leaveBalance.casualRemaining}}</p>
                <p class="text-xs text-gray-500">{{leaveBalance.casualUsed}} days used</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4 mb-8">
          <button 
            (click)="showCreateLeaveForm = true"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg">
            <i class="fas fa-plus mr-2"></i>
            Request Leave
          </button>
          <button 
            (click)="loadMyLeaves()"
            class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg">
            <i class="fas fa-refresh mr-2"></i>
            Refresh
          </button>
          <button 
            *ngIf="currentUser?.role === 'ADMIN'"
            (click)="navigateToAdmin()"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg">
            <i class="fas fa-cog mr-2"></i>
            Admin Panel
          </button>
        </div>

        <!-- Create Leave Form -->
        <div *ngIf="showCreateLeaveForm" class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-900">Request New Leave</h3>
            <button 
              (click)="cancelCreateLeave()"
              class="text-gray-400 hover:text-gray-600 transition-colors">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form (ngSubmit)="submitLeaveRequest()" #leaveForm="ngForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                <select 
                  [(ngModel)]="newLeave.leaveType"
                  name="leaveType"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  <option value="">Select leave type</option>
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
                <input 
                  type="number"
                  [(ngModel)]="newLeave.duration"
                  name="duration"
                  min="1"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Number of days">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input 
                  type="date"
                  [(ngModel)]="newLeave.startDate"
                  name="startDate"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input 
                  type="date"
                  [(ngModel)]="newLeave.endDate"
                  name="endDate"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <textarea 
                [(ngModel)]="newLeave.reason"
                name="reason"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Please provide a reason for your leave request..."></textarea>
            </div>

            <div *ngIf="createLeaveError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ createLeaveError }}
              </div>
            </div>

            <div class="flex justify-end space-x-4">
              <button 
                type="button"
                (click)="cancelCreateLeave()"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200">
                Cancel
              </button>
              <button 
                type="submit"
                [disabled]="!leaveForm.valid || isSubmittingLeave"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                <span *ngIf="!isSubmittingLeave">Submit Request</span>
                <span *ngIf="isSubmittingLeave" class="flex items-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Leave Requests Table -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900">My Leave Requests</h3>
          </div>

          <div *ngIf="isLoading" class="flex justify-center items-center py-12">
            <div class="text-center">
              <i class="fas fa-spinner fa-spin text-blue-500 text-3xl mb-4"></i>
              <p class="text-gray-600">Loading your leave requests...</p>
            </div>
          </div>

          <div *ngIf="!isLoading && leaves.length === 0" class="text-center py-12">
            <i class="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
            <p class="text-xl text-gray-600 mb-2">No leave requests found</p>
            <p class="text-gray-500">Start by creating your first leave request!</p>
          </div>

          <div *ngIf="!isLoading && leaves.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let leave of leaves" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="{
                            'bg-green-100 text-green-800': leave.leaveType === 'ANNUAL',
                            'bg-blue-100 text-blue-800': leave.leaveType === 'SICK',
                            'bg-purple-100 text-purple-800': leave.leaveType === 'CASUAL',
                            'bg-red-100 text-red-800': leave.leaveType === 'EMERGENCY'
                          }">
                      {{getLeaveTypeLabel(leave.leaveType)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{leave.duration}} days
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{formatDate(leave.startDate)}} - {{formatDate(leave.endDate)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="{
                            'bg-yellow-100 text-yellow-800': leave.status === 'PENDING',
                            'bg-green-100 text-green-800': leave.status === 'APPROVED',
                            'bg-red-100 text-red-800': leave.status === 'REJECTED'
                          }">
                      {{leave.status}}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {{leave.reason || 'No reason provided'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      *ngIf="leave.status === 'PENDING'"
                      (click)="deleteLeave(leave.id)"
                      class="text-red-600 hover:text-red-900 transition-colors">
                      <i class="fas fa-trash mr-1"></i>
                      Delete
                    </button>
                    <span *ngIf="leave.status !== 'PENDING'" class="text-gray-400">
                      No actions
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
    }
    
    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      
      .md\\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    
    .gap-4 {
      gap: 1rem;
    }
    
    .gap-6 {
      gap: 1.5rem;
    }
    
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
    
    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }
    
    .space-x-4 > * + * {
      margin-left: 1rem;
    }
    
    .overflow-x-auto {
      overflow-x: auto;
    }
    
    .max-w-xs {
      max-width: 20rem;
    }
    
    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .flex-wrap {
      flex-wrap: wrap;
    }
    
    .divide-y > * + * {
      border-top-width: 1px;
    }
    
    .divide-gray-200 > * + * {
      border-color: rgb(229 231 235);
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  leaves: Leave[] = [];
  leaveBalance: LeaveBalance | null = null;
  isLoading = true;
  showCreateLeaveForm = false;
  isSubmittingLeave = false;
  createLeaveError = '';

  newLeave = {
    leaveType: '',
    startDate: '',
    endDate: '',
    duration: 1,
    reason: ''
  };

  private componentStartTime: number = Date.now();

  constructor(
    private apiService: ApiService,
    private auditLogger: AuditLoggerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.apiService.getCurrentUser();
    this.auditLogger.logComponentLifecycle('DashboardComponent', 'OnInit', {
      userId: this.currentUser?.id,
      userRole: this.currentUser?.role,
      timestamp: new Date().toISOString()
    });

    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.auditLogger.logComponentLifecycle('DashboardComponent', 'OnDestroy', {
      sessionDuration: Date.now() - this.componentStartTime,
      userId: this.currentUser?.id
    });
  }

  loadDashboardData() {
    this.loadMyLeaves();
    this.loadLeaveBalance();
  }

  loadMyLeaves() {
    this.isLoading = true;
    this.auditLogger.logUserAction('Load My Leaves', 'DashboardComponent', {
      userId: this.currentUser?.id
    });

    // Note: This would call the actual API when the backend endpoints are integrated
    // For now, using mock data
    setTimeout(() => {
      this.leaves = [];
      this.isLoading = false;
    }, 1000);
  }

  loadLeaveBalance() {
    // Note: This would call the actual API when the backend endpoints are integrated
    // For now, using mock data
    this.leaveBalance = {
      annualRemaining: 20,
      sickRemaining: 8,
      casualRemaining: 3,
      annualUsed: 5,
      sickUsed: 2,
      casualUsed: 2
    };
  }

  submitLeaveRequest() {
    this.createLeaveError = '';
    
    if (!this.newLeave.leaveType || !this.newLeave.startDate || !this.newLeave.endDate || !this.newLeave.duration) {
      this.createLeaveError = 'Please fill in all required fields';
      return;
    }

    this.isSubmittingLeave = true;
    this.auditLogger.logUserAction('Submit Leave Request', 'DashboardComponent', {
      leaveType: this.newLeave.leaveType,
      duration: this.newLeave.duration,
      userId: this.currentUser?.id
    });

    // Note: This would call the actual API when integrated
    setTimeout(() => {
      this.isSubmittingLeave = false;
      this.showCreateLeaveForm = false;
      this.resetLeaveForm();
      this.loadMyLeaves(); // Refresh the list
    }, 2000);
  }

  cancelCreateLeave() {
    this.showCreateLeaveForm = false;
    this.resetLeaveForm();
    this.auditLogger.logUserAction('Cancel Leave Request', 'DashboardComponent');
  }

  resetLeaveForm() {
    this.newLeave = {
      leaveType: '',
      startDate: '',
      endDate: '',
      duration: 1,
      reason: ''
    };
    this.createLeaveError = '';
  }

  deleteLeave(leaveId: number) {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.auditLogger.logUserAction('Delete Leave Request', 'DashboardComponent', {
        leaveId,
        userId: this.currentUser?.id
      });

      // Note: This would call the actual API when integrated
      this.leaves = this.leaves.filter(leave => leave.id !== leaveId);
    }
  }

  logout() {
    this.auditLogger.logUserAction('Logout', 'DashboardComponent', {
      userId: this.currentUser?.id
    });
    
    this.apiService.logout();
    this.router.navigate(['/home']);
  }

  navigateToAdmin() {
    this.auditLogger.logNavigation('/dashboard', '/admin');
    this.router.navigate(['/admin']);
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getLeaveTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'ANNUAL': 'Annual',
      'SICK': 'Sick',
      'CASUAL': 'Casual',
      'EMERGENCY': 'Emergency'
    };
    return labels[type] || type;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
} 