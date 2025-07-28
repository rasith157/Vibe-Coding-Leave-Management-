import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuditLoggerService } from '../../../services/audit-logger.service';

interface Leave {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  annualLeaveBalance: number;
  sickLeaveBalance: number;
  casualLeaveBalance: number;
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <!-- Navigation Bar -->
      <nav class="bg-white shadow-lg border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- Logo and Title -->
            <div class="flex items-center">
              <div class="flex-shrink-0 flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <i class="fas fa-cog text-white text-lg"></i>
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900">LeaveFlow Admin</h1>
                  <p class="text-xs text-gray-500">Administrative Dashboard</p>
                </div>
              </div>
            </div>

            <!-- User Info and Actions -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{currentUser?.firstName}} {{currentUser?.lastName}}</p>
                  <p class="text-xs text-gray-500">Administrator</p>
                </div>
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">{{getUserInitials()}}</span>
                </div>
              </div>
              <button 
                (click)="goToDashboard()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200">
                <i class="fas fa-user mr-2"></i>
                Employee View
              </button>
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
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p class="text-lg text-gray-600">Manage leave requests and system users</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Pending Requests</p>
                <p class="text-2xl font-bold text-gray-900">{{stats.pendingRequests}}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Approved This Month</p>
                <p class="text-2xl font-bold text-gray-900">{{stats.approvedThisMonth}}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-users text-blue-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Users</p>
                <p class="text-2xl font-bold text-gray-900">{{stats.totalUsers}}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-chart-line text-purple-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Requests</p>
                <p class="text-2xl font-bold text-gray-900">{{stats.totalRequests}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6" aria-label="Tabs">
              <button 
                (click)="activeTab = 'pending'"
                [ngClass]="{'border-purple-500 text-purple-600': activeTab === 'pending', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'pending'}"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200">
                <i class="fas fa-clock mr-2"></i>
                Pending Requests ({{pendingLeaves.length}})
              </button>
              <button 
                (click)="activeTab = 'all'"
                [ngClass]="{'border-purple-500 text-purple-600': activeTab === 'all', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'all'}"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200">
                <i class="fas fa-list mr-2"></i>
                All Requests ({{allLeaves.length}})
              </button>
              <button 
                (click)="activeTab = 'users'"
                [ngClass]="{'border-purple-500 text-purple-600': activeTab === 'users', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'users'}"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200">
                <i class="fas fa-users mr-2"></i>
                Users ({{users.length}})
              </button>
            </nav>
          </div>

          <!-- Pending Requests Tab -->
          <div *ngIf="activeTab === 'pending'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-900">Pending Leave Requests</h3>
              <button 
                (click)="loadPendingLeaves()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                <i class="fas fa-refresh mr-2"></i>
                Refresh
              </button>
            </div>

            <div *ngIf="isLoadingPending" class="flex justify-center items-center py-12">
              <div class="text-center">
                <i class="fas fa-spinner fa-spin text-purple-500 text-3xl mb-4"></i>
                <p class="text-gray-600">Loading pending requests...</p>
              </div>
            </div>

            <div *ngIf="!isLoadingPending && pendingLeaves.length === 0" class="text-center py-12">
              <i class="fas fa-check-circle text-green-400 text-4xl mb-4"></i>
              <p class="text-xl text-gray-600 mb-2">No pending requests!</p>
              <p class="text-gray-500">All caught up with leave approvals.</p>
            </div>

            <div *ngIf="!isLoadingPending && pendingLeaves.length > 0" class="space-y-4">
              <div *ngFor="let leave of pendingLeaves" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <h4 class="text-lg font-semibold text-gray-900 mr-3">{{leave.userName}}</h4>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            [ngClass]="{
                              'bg-green-100 text-green-800': leave.leaveType === 'ANNUAL',
                              'bg-blue-100 text-blue-800': leave.leaveType === 'SICK',
                              'bg-purple-100 text-purple-800': leave.leaveType === 'CASUAL',
                              'bg-red-100 text-red-800': leave.leaveType === 'EMERGENCY'
                            }">
                        {{getLeaveTypeLabel(leave.leaveType)}}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{leave.userEmail}}</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Duration</p>
                        <p class="text-sm text-gray-900">{{leave.duration}} days</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-700">Dates</p>
                        <p class="text-sm text-gray-900">{{formatDate(leave.startDate)}} - {{formatDate(leave.endDate)}}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-700">Requested</p>
                        <p class="text-sm text-gray-900">{{formatDate(leave.createdAt)}}</p>
                      </div>
                    </div>
                    <div *ngIf="leave.reason">
                      <p class="text-sm font-medium text-gray-700 mb-1">Reason</p>
                      <p class="text-sm text-gray-900">{{leave.reason}}</p>
                    </div>
                  </div>
                  <div class="ml-6 flex space-x-3">
                    <button 
                      (click)="showApprovalModal(leave, 'APPROVED')"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-200">
                      <i class="fas fa-check mr-2"></i>
                      Approve
                    </button>
                    <button 
                      (click)="showApprovalModal(leave, 'REJECTED')"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-200">
                      <i class="fas fa-times mr-2"></i>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- All Requests Tab -->
          <div *ngIf="activeTab === 'all'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-900">All Leave Requests</h3>
              <div class="flex space-x-4">
                <select 
                  [(ngModel)]="statusFilter"
                  (ngModelChange)="filterLeaves()"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <button 
                  (click)="loadAllLeaves()"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                  <i class="fas fa-refresh mr-2"></i>
                  Refresh
                </button>
              </div>
            </div>

            <div *ngIf="isLoadingAll" class="flex justify-center items-center py-12">
              <div class="text-center">
                <i class="fas fa-spinner fa-spin text-purple-500 text-3xl mb-4"></i>
                <p class="text-gray-600">Loading all requests...</p>
              </div>
            </div>

            <div *ngIf="!isLoadingAll && filteredLeaves.length === 0" class="text-center py-12">
              <i class="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
              <p class="text-xl text-gray-600 mb-2">No leave requests found</p>
              <p class="text-gray-500">No requests match your current filter.</p>
            </div>

            <div *ngIf="!isLoadingAll && filteredLeaves.length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let leave of filteredLeaves" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{leave.userName}}</p>
                        <p class="text-sm text-gray-500">{{leave.userEmail}}</p>
                      </div>
                    </td>
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
                        (click)="showApprovalModal(leave, 'APPROVED')"
                        class="text-green-600 hover:text-green-900 mr-3 transition-colors">
                        <i class="fas fa-check mr-1"></i>
                        Approve
                      </button>
                      <button 
                        *ngIf="leave.status === 'PENDING'"
                        (click)="showApprovalModal(leave, 'REJECTED')"
                        class="text-red-600 hover:text-red-900 transition-colors">
                        <i class="fas fa-times mr-1"></i>
                        Reject
                      </button>
                      <span *ngIf="leave.status !== 'PENDING'" class="text-gray-400">
                        {{leave.approvedByName || 'System'}}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Users Tab -->
          <div *ngIf="activeTab === 'users'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-900">System Users</h3>
              <button 
                (click)="loadUsers()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                <i class="fas fa-refresh mr-2"></i>
                Refresh
              </button>
            </div>

            <div *ngIf="isLoadingUsers" class="flex justify-center items-center py-12">
              <div class="text-center">
                <i class="fas fa-spinner fa-spin text-purple-500 text-3xl mb-4"></i>
                <p class="text-gray-600">Loading users...</p>
              </div>
            </div>

            <div *ngIf="!isLoadingUsers && users.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let user of users" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span class="text-white font-semibold text-sm">{{getUserInitials(user.firstName, user.lastName)}}</span>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900">{{user.firstName}} {{user.lastName}}</h4>
                    <p class="text-sm text-gray-600">{{user.email}}</p>
                  </div>
                </div>
                
                <div class="space-y-2 mb-4">
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Role:</span>
                    <span class="text-sm text-gray-900">{{user.role}}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Status:</span>
                    <span [ngClass]="{'text-green-600': user.active, 'text-red-600': !user.active}" class="text-sm font-medium">
                      {{user.active ? 'Active' : 'Inactive'}}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Annual Leave:</span>
                    <span class="text-sm text-gray-900">{{user.annualLeaveBalance}} days</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Sick Leave:</span>
                    <span class="text-sm text-gray-900">{{user.sickLeaveBalance}} days</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Casual Leave:</span>
                    <span class="text-sm text-gray-900">{{user.casualLeaveBalance}} days</span>
                  </div>
                </div>
                
                <div class="text-xs text-gray-500">
                  Joined: {{formatDate(user.createdAt)}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Approval Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="closeModal()"></div>
          
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                     [ngClass]="{'bg-green-100': modalAction === 'APPROVED', 'bg-red-100': modalAction === 'REJECTED'}">
                  <i [ngClass]="{'fas fa-check text-green-600': modalAction === 'APPROVED', 'fas fa-times text-red-600': modalAction === 'REJECTED'}"></i>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{modalAction === 'APPROVED' ? 'Approve' : 'Reject'}} Leave Request
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{modalAction === 'APPROVED' ? 'Approve' : 'Reject'}} leave request for <strong>{{selectedLeave?.userName}}</strong>?
                    </p>
                    <div class="mt-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Comments (Optional)</label>
                      <textarea 
                        [(ngModel)]="approvalComments"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Add any comments about this decision..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                (click)="confirmApproval()"
                [disabled]="isProcessingApproval"
                class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                [ngClass]="{'bg-green-600 hover:bg-green-700': modalAction === 'APPROVED', 'bg-red-600 hover:bg-red-700': modalAction === 'REJECTED'}">
                <span *ngIf="!isProcessingApproval">
                  {{modalAction === 'APPROVED' ? 'Approve' : 'Reject'}}
                </span>
                <span *ngIf="isProcessingApproval" class="flex items-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </span>
              </button>
              <button 
                (click)="closeModal()"
                [disabled]="isProcessingApproval"
                class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200">
                Cancel
              </button>
            </div>
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
      
      .md\\:grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
    
    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    
    .gap-4 {
      gap: 1rem;
    }
    
    .gap-6 {
      gap: 1.5rem;
    }
    
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    
    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }
    
    .space-x-4 > * + * {
      margin-left: 1rem;
    }
    
    .space-x-8 > * + * {
      margin-left: 2rem;
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
    
    .divide-y > * + * {
      border-top-width: 1px;
    }
    
    .divide-gray-200 > * + * {
      border-color: rgb(229 231 235);
    }
    
    .border-b-2 {
      border-bottom-width: 2px;
    }
    
    .z-50 {
      z-index: 50;
    }
    
    .bg-opacity-75 {
      background-opacity: 0.75;
    }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  activeTab = 'pending';
  
  pendingLeaves: Leave[] = [];
  allLeaves: Leave[] = [];
  filteredLeaves: Leave[] = [];
  users: User[] = [];
  
  isLoadingPending = false;
  isLoadingAll = false;
  isLoadingUsers = false;
  
  statusFilter = '';
  
  // Modal state
  showModal = false;
  selectedLeave: Leave | null = null;
  modalAction = '';
  approvalComments = '';
  isProcessingApproval = false;
  
  stats = {
    pendingRequests: 0,
    approvedThisMonth: 0,
    totalUsers: 0,
    totalRequests: 0
  };

  private componentStartTime: number = Date.now();

  constructor(
    private apiService: ApiService,
    private auditLogger: AuditLoggerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.apiService.getCurrentUser();
    
    // Check if user is admin
    if (this.currentUser?.role !== 'ADMIN') {
      this.auditLogger.logWarn('AUTH', 'Unauthorized Admin Access', {
        userId: this.currentUser?.id,
        userRole: this.currentUser?.role,
        redirectTo: '/dashboard'
      });
      this.router.navigate(['/dashboard']);
      return;
    }

    this.auditLogger.logComponentLifecycle('AdminDashboardComponent', 'OnInit', {
      userId: this.currentUser?.id,
      timestamp: new Date().toISOString()
    });

    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.auditLogger.logComponentLifecycle('AdminDashboardComponent', 'OnDestroy', {
      sessionDuration: Date.now() - this.componentStartTime,
      userId: this.currentUser?.id
    });
  }

  loadDashboardData() {
    this.loadPendingLeaves();
    this.loadAllLeaves();
    this.loadUsers();
    this.updateStats();
  }

  loadPendingLeaves() {
    this.isLoadingPending = true;
    this.auditLogger.logUserAction('Load Pending Leaves', 'AdminDashboardComponent', {
      adminId: this.currentUser?.id
    });

    // Mock data - replace with actual API call
    setTimeout(() => {
      this.pendingLeaves = [
        {
          id: 1,
          userId: 2,
          userName: 'John Smith',
          userEmail: 'john.smith@company.com',
          leaveType: 'ANNUAL',
          startDate: '2024-02-15',
          endDate: '2024-02-19',
          duration: 5,
          reason: 'Family vacation',
          status: 'PENDING',
          createdAt: '2024-02-01'
        },
        {
          id: 2,
          userId: 3,
          userName: 'Jane Doe',
          userEmail: 'jane.doe@company.com',
          leaveType: 'SICK',
          startDate: '2024-02-10',
          endDate: '2024-02-12',
          duration: 3,
          reason: 'Medical appointment',
          status: 'PENDING',
          createdAt: '2024-02-08'
        }
      ];
      this.isLoadingPending = false;
    }, 1000);
  }

  loadAllLeaves() {
    this.isLoadingAll = true;
    this.auditLogger.logUserAction('Load All Leaves', 'AdminDashboardComponent', {
      adminId: this.currentUser?.id
    });

    // Mock data - replace with actual API call
    setTimeout(() => {
      this.allLeaves = [
        ...this.pendingLeaves,
        {
          id: 3,
          userId: 4,
          userName: 'Mike Johnson',
          userEmail: 'mike.johnson@company.com',
          leaveType: 'CASUAL',
          startDate: '2024-01-20',
          endDate: '2024-01-20',
          duration: 1,
          reason: 'Personal work',
          status: 'APPROVED',
          createdAt: '2024-01-15',
          approvedByName: 'Admin User'
        }
      ];
      this.filteredLeaves = [...this.allLeaves];
      this.isLoadingAll = false;
    }, 1000);
  }

  loadUsers() {
    this.isLoadingUsers = true;
    this.auditLogger.logUserAction('Load Users', 'AdminDashboardComponent', {
      adminId: this.currentUser?.id
    });

    // Mock data - replace with actual API call
    setTimeout(() => {
      this.users = [
        {
          id: 2,
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@company.com',
          role: 'EMPLOYEE',
          active: true,
          annualLeaveBalance: 20,
          sickLeaveBalance: 8,
          casualLeaveBalance: 3,
          createdAt: '2024-01-01'
        },
        {
          id: 3,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@company.com',
          role: 'EMPLOYEE',
          active: true,
          annualLeaveBalance: 25,
          sickLeaveBalance: 10,
          casualLeaveBalance: 5,
          createdAt: '2024-01-01'
        }
      ];
      this.isLoadingUsers = false;
    }, 1000);
  }

  updateStats() {
    // Update statistics based on loaded data
    this.stats = {
      pendingRequests: this.pendingLeaves.length,
      approvedThisMonth: this.allLeaves.filter(l => l.status === 'APPROVED').length,
      totalUsers: this.users.length,
      totalRequests: this.allLeaves.length
    };
  }

  filterLeaves() {
    if (this.statusFilter) {
      this.filteredLeaves = this.allLeaves.filter(leave => leave.status === this.statusFilter);
    } else {
      this.filteredLeaves = [...this.allLeaves];
    }
  }

  showApprovalModal(leave: Leave, action: string) {
    this.selectedLeave = leave;
    this.modalAction = action;
    this.approvalComments = '';
    this.showModal = true;
    
    this.auditLogger.logUserAction('Open Approval Modal', 'AdminDashboardComponent', {
      leaveId: leave.id,
      action,
      adminId: this.currentUser?.id
    });
  }

  confirmApproval() {
    if (!this.selectedLeave) return;

    this.isProcessingApproval = true;
    
    this.auditLogger.logUserAction('Process Leave Approval', 'AdminDashboardComponent', {
      leaveId: this.selectedLeave.id,
      action: this.modalAction,
      comments: this.approvalComments,
      adminId: this.currentUser?.id
    });

    // Mock API call - replace with actual implementation
    setTimeout(() => {
      if (this.selectedLeave) {
        this.selectedLeave.status = this.modalAction;
        this.selectedLeave.comments = this.approvalComments;
        this.selectedLeave.approvedByName = this.currentUser?.firstName + ' ' + this.currentUser?.lastName;
        
        // Remove from pending if approved/rejected
        this.pendingLeaves = this.pendingLeaves.filter(l => l.id !== this.selectedLeave!.id);
        
        // Update stats
        this.updateStats();
        this.filterLeaves();
      }
      
      this.isProcessingApproval = false;
      this.closeModal();
    }, 2000);
  }

  closeModal() {
    this.showModal = false;
    this.selectedLeave = null;
    this.modalAction = '';
    this.approvalComments = '';
    this.isProcessingApproval = false;
  }

  goToDashboard() {
    this.auditLogger.logNavigation('/admin', '/dashboard');
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.auditLogger.logUserAction('Logout', 'AdminDashboardComponent', {
      userId: this.currentUser?.id
    });
    
    this.apiService.logout();
    this.router.navigate(['/home']);
  }

  getUserInitials(firstName?: string, lastName?: string): string {
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    if (!this.currentUser) return '';
    const first = this.currentUser.firstName || '';
    const last = this.currentUser.lastName || '';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
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