import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/leave.interface';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-management-container">
      <!-- Header -->
      <div class="page-header">
        <button class="back-button" (click)="goBack()">
          <span class="back-icon">←</span>
          Back to Admin Dashboard
        </button>
        <h1>User Management</h1>
        <p>Manage employees and their leave balances</p>
      </div>

      <!-- Controls -->
      <div class="controls-section">
        <div class="filters">
          <div class="filter-group">
            <label for="roleFilter">Role:</label>
            <select id="roleFilter" [(ngModel)]="filters.role" (change)="applyFilters()">
              <option value="">All Roles</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="statusFilter">Status:</label>
            <select id="statusFilter" [(ngModel)]="filters.status" (change)="applyFilters()">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="search-group">
            <label for="searchInput">Search:</label>
            <input 
              id="searchInput"
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="applyFilters()"
              placeholder="Search by name or email..."
              class="search-input">
          </div>

          <button class="clear-filters-btn" (click)="clearFilters()" *ngIf="hasActiveFilters()">
            Clear Filters
          </button>
        </div>

        <div class="actions">
          <button class="btn-secondary" (click)="refreshData()">
            <span class="btn-icon">🔄</span>
            Refresh
          </button>
          <button class="btn-primary" (click)="createTestData()" [disabled]="creatingTestData">
            <span class="btn-icon">🧪</span>
            <span *ngIf="!creatingTestData">Create Test Data</span>
            <span *ngIf="creatingTestData">Creating...</span>
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="summary-stats" *ngIf="summaryStats">
        <div class="stat-card users">
          <div class="stat-number">{{summaryStats.totalUsers}}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card employees">
          <div class="stat-number">{{summaryStats.employees}}</div>
          <div class="stat-label">Employees</div>
        </div>
        <div class="stat-card admins">
          <div class="stat-number">{{summaryStats.admins}}</div>
          <div class="stat-label">Admins</div>
        </div>
        <div class="stat-card active">
          <div class="stat-number">{{summaryStats.activeUsers}}</div>
          <div class="stat-label">Active</div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-container">
        <div class="table-header">
          <h2>Users ({{filteredUsers.length}})</h2>
          <div class="sort-controls">
            <label>Sort by:</label>
            <select [(ngModel)]="sortField" (change)="applySorting()">
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
              <option value="createdAt">Date Created</option>
            </select>
            <button class="sort-direction-btn" (click)="toggleSortDirection()">
              {{sortDirection === 'asc' ? '↑' : '↓'}}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner-large"></div>
          <p>Loading users...</p>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!isLoading && filteredUsers.length === 0">
          <div class="empty-icon">👥</div>
          <h3>No users found</h3>
          <p *ngIf="!hasActiveFilters()">No users in the system yet.</p>
          <p *ngIf="hasActiveFilters()">No users match your current filters.</p>
          <button class="btn-secondary" (click)="clearFilters()" *ngIf="hasActiveFilters()">
            Clear Filters
          </button>
          <button class="btn-primary" (click)="createTestData()" *ngIf="!hasActiveFilters()">
            Create Test Users
          </button>
        </div>

        <!-- Users Table -->
        <div class="table-responsive" *ngIf="!isLoading && filteredUsers.length > 0">
          <table class="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Leave Balances</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers" class="user-row">
                <td>
                  <div class="user-info">
                    <div class="user-avatar">
                      {{getUserInitials(user)}}
                    </div>
                    <div class="user-details">
                      <div class="user-name">{{user.firstName}} {{user.lastName}}</div>
                      <div class="user-email">{{user.email}}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge" [ngClass]="user.role.toLowerCase()">
                    {{formatRole(user.role)}}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [ngClass]="user.active ? 'active' : 'inactive'">
                    <span class="status-indicator"></span>
                    {{user.active ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td>
                  <div class="leave-balances" *ngIf="user.role === 'EMPLOYEE'">
                    <div class="balance-item">
                      <span class="balance-type">Annual:</span>
                      <span class="balance-value">{{user.annualLeaveBalance || 0}}</span>
                    </div>
                    <div class="balance-item">
                      <span class="balance-type">Sick:</span>
                      <span class="balance-value">{{user.sickLeaveBalance || 0}}</span>
                    </div>
                    <div class="balance-item">
                      <span class="balance-type">Casual:</span>
                      <span class="balance-value">{{user.casualLeaveBalance || 0}}</span>
                    </div>
                  </div>
                  <div class="no-balances" *ngIf="user.role !== 'EMPLOYEE'">
                    <span class="text-muted">N/A</span>
                  </div>
                </td>
                <td>
                  <div class="date-info">
                    {{formatDate(user.createdAt)}}
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="btn-view"
                      (click)="viewUserDetails(user)"
                      title="View details">
                      👁️
                    </button>
                    <button 
                      class="btn-edit"
                      (click)="editUser(user)"
                      title="Edit user">
                      ✏️
                    </button>
                    <button 
                      *ngIf="user.role !== 'ADMIN'"
                      class="btn-toggle"
                      (click)="toggleUserStatus(user)"
                      [title]="user.active ? 'Deactivate user' : 'Activate user'">
                      {{user.active ? '🔒' : '🔓'}}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- User Details Modal -->
      <div class="modal-overlay" *ngIf="selectedUser" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>User Details</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="detail-row">
              <strong>Name:</strong>
              <span>{{selectedUser.firstName}} {{selectedUser.lastName}}</span>
            </div>
            <div class="detail-row">
              <strong>Email:</strong>
              <span>{{selectedUser.email}}</span>
            </div>
            <div class="detail-row">
              <strong>Role:</strong>
              <span class="role-badge" [ngClass]="selectedUser.role.toLowerCase()">
                {{formatRole(selectedUser.role)}}
              </span>
            </div>
            <div class="detail-row">
              <strong>Status:</strong>
              <span class="status-badge" [ngClass]="selectedUser.active ? 'active' : 'inactive'">
                <span class="status-indicator"></span>
                {{selectedUser.active ? 'Active' : 'Inactive'}}
              </span>
            </div>
            <div class="detail-row" *ngIf="selectedUser.role === 'EMPLOYEE'">
              <strong>Annual Leave Balance:</strong>
              <span>{{selectedUser.annualLeaveBalance || 0}} days</span>
            </div>
            <div class="detail-row" *ngIf="selectedUser.role === 'EMPLOYEE'">
              <strong>Sick Leave Balance:</strong>
              <span>{{selectedUser.sickLeaveBalance || 0}} days</span>
            </div>
            <div class="detail-row" *ngIf="selectedUser.role === 'EMPLOYEE'">
              <strong>Casual Leave Balance:</strong>
              <span>{{selectedUser.casualLeaveBalance || 0}} days</span>
            </div>
            <div class="detail-row">
              <strong>Joined:</strong>
              <span>{{formatDate(selectedUser.createdAt)}}</span>
            </div>
            <div class="detail-row">
              <strong>Last Updated:</strong>
              <span>{{formatDate(selectedUser.updatedAt)}}</span>
            </div>
          </div>
          
          <!-- Modal Actions -->
          <div class="modal-actions">
            <button 
              *ngIf="selectedUser.role !== 'ADMIN'"
              class="btn-toggle-modal"
              (click)="toggleUserStatus(selectedUser)">
              {{selectedUser.active ? '🔒 Deactivate' : '🔓 Activate'}}
            </button>
            <button 
              class="btn-edit-modal"
              (click)="editUser(selectedUser)">
              ✏️ Edit User
            </button>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div class="toast-container">
        <div class="toast success" *ngIf="successMessage" [@fadeInOut]>
          <span class="toast-icon">✅</span>
          {{successMessage}}
        </div>
        <div class="toast error" *ngIf="errorMessage" [@fadeInOut]>
          <span class="toast-icon">❌</span>
          {{errorMessage}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-management-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      margin-bottom: 30px;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      color: #3b82f6;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 16px;
      padding: 8px 0;
      transition: color 0.2s;
    }

    .back-button:hover {
      color: #2563eb;
    }

    .back-icon {
      font-size: 1.2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .page-header p {
      color: #6b7280;
      font-size: 1.1rem;
    }

    .controls-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 20px;
    }

    .filters {
      display: flex;
      gap: 20px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .filter-group, .search-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .filter-group label, .search-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    .filter-group select {
      padding: 8px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      background: white;
      min-width: 120px;
    }

    .search-input {
      padding: 8px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      background: white;
      min-width: 200px;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .clear-filters-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }

    .clear-filters-btn:hover {
      background: #dc2626;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary, .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
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

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
      border-color: #2563eb;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
    }

    .stat-card.users { border-left-color: #3b82f6; }
    .stat-card.employees { border-left-color: #10b981; }
    .stat-card.admins { border-left-color: #f59e0b; }
    .stat-card.active { border-left-color: #10b981; }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .table-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .sort-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
    }

    .sort-controls label {
      color: #6b7280;
      font-weight: 600;
    }

    .sort-controls select {
      padding: 4px 8px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background: white;
    }

    .sort-direction-btn {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 1rem;
    }

    .sort-direction-btn:hover {
      background: #e5e7eb;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .spinner-large {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      color: #1f2937;
      margin-bottom: 8px;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th {
      background: #f9fafb;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
    }

    .users-table td {
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
    }

    .user-row:hover {
      background: #f9fafb;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-name {
      font-weight: 600;
      color: #1f2937;
    }

    .user-email {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .role-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .role-badge.employee {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .role-badge.admin {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-badge.active { color: #10b981; }
    .status-badge.active .status-indicator { background: #10b981; }

    .status-badge.inactive { color: #ef4444; }
    .status-badge.inactive .status-indicator { background: #ef4444; }

    .leave-balances {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .balance-item {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.875rem;
    }

    .balance-type {
      color: #6b7280;
    }

    .balance-value {
      font-weight: 600;
      color: #1f2937;
    }

    .no-balances {
      color: #9ca3af;
      font-style: italic;
    }

    .date-info {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
    }

    .btn-view, .btn-edit, .btn-toggle {
      background: none;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 6px 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-view:hover {
      background: #f0f9ff;
      border-color: #93c5fd;
    }

    .btn-edit:hover {
      background: #fffbeb;
      border-color: #fbbf24;
    }

    .btn-toggle:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #9ca3af;
      padding: 4px;
    }

    .modal-close:hover {
      color: #6b7280;
    }

    .modal-body {
      padding: 24px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
      gap: 16px;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row strong {
      color: #374151;
      font-weight: 600;
      min-width: 140px;
    }

    .modal-actions {
      padding: 20px 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-toggle-modal, .btn-edit-modal {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-toggle-modal {
      background: #6b7280;
      color: white;
      border-color: #6b7280;
    }

    .btn-toggle-modal:hover {
      background: #4b5563;
      border-color: #4b5563;
    }

    .btn-edit-modal {
      background: #f59e0b;
      color: white;
      border-color: #f59e0b;
    }

    .btn-edit-modal:hover {
      background: #d97706;
      border-color: #d97706;
    }

    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1100;
    }

    .toast {
      background: white;
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      border-left: 4px solid;
    }

    .toast.success {
      border-left-color: #10b981;
    }

    .toast.error {
      border-left-color: #ef4444;
    }

    .toast-icon {
      font-size: 1rem;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .user-management-container {
        padding: 16px;
      }

      .controls-section {
        padding: 16px;
        flex-direction: column;
        align-items: stretch;
      }

      .filters {
        justify-content: center;
      }

      .actions {
        justify-content: center;
      }

      .summary-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .table-header {
        padding: 16px;
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .users-table {
        font-size: 0.875rem;
      }

      .users-table th,
      .users-table td {
        padding: 8px;
      }

      .modal-content {
        margin: 10px;
        max-height: calc(100vh - 20px);
      }

      .detail-row {
        flex-direction: column;
        gap: 4px;
      }

      .detail-row strong {
        min-width: auto;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class UserManagementComponent implements OnInit {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  isLoading = true;
  creatingTestData = false;

  filters = {
    role: '',
    status: ''
  };

  searchTerm = '';
  sortField = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  summaryStats: any = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.apiService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allUsers = response.data;
          this.calculateSummaryStats();
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showError('Failed to load users');
        this.isLoading = false;
      }
    });
  }

  calculateSummaryStats() {
    const stats = {
      totalUsers: this.allUsers.length,
      employees: 0,
      admins: 0,
      activeUsers: 0
    };

    this.allUsers.forEach(user => {
      if (user.role === 'EMPLOYEE') {
        stats.employees++;
      } else if (user.role === 'ADMIN') {
        stats.admins++;
      }
      
      if (user.active) {
        stats.activeUsers++;
      }
    });

    this.summaryStats = stats;
  }

  applyFilters() {
    let filtered = [...this.allUsers];

    // Apply role filter
    if (this.filters.role) {
      filtered = filtered.filter(user => user.role === this.filters.role);
    }

    // Apply status filter
    if (this.filters.status) {
      const isActive = this.filters.status === 'active';
      filtered = filtered.filter(user => user.active === isActive);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
    this.applySorting();
  }

  applySorting() {
    this.filteredUsers.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'createdAt':
        case 'updatedAt':
          aValue = new Date(a[this.sortField]);
          bValue = new Date(b[this.sortField]);
          break;
        default:
          aValue = a[this.sortField as keyof User];
          bValue = b[this.sortField as keyof User];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applySorting();
  }

  clearFilters() {
    this.filters = {
      role: '',
      status: ''
    };
    this.searchTerm = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.role || this.filters.status || this.searchTerm.trim());
  }

  viewUserDetails(user: User) {
    this.selectedUser = user;
  }

  editUser(user: User) {
    // TODO: Implement user editing functionality
    console.log('Edit user:', user);
    this.showSuccess('User editing functionality will be implemented in a future update');
  }

  toggleUserStatus(user: User) {
    // TODO: Implement user status toggle
    console.log('Toggle user status:', user);
    this.showSuccess(`User ${user.active ? 'deactivation' : 'activation'} functionality will be implemented in a future update`);
  }

  createTestData() {
    this.creatingTestData = true;
    this.apiService.createTestData().subscribe({
      next: (response) => {
        this.creatingTestData = false;
        if (response.success) {
          this.showSuccess('Test data created successfully');
          this.loadUsers(); // Refresh the user list
        } else {
          this.showError('Failed to create test data');
        }
      },
      error: (error) => {
        this.creatingTestData = false;
        console.error('Error creating test data:', error);
        this.showError('Failed to create test data');
      }
    });
  }

  closeModal() {
    this.selectedUser = null;
  }

  refreshData() {
    this.loadUsers();
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  getUserInitials(user: User): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }

  formatRole(role: string): string {
    return role.charAt(0) + role.slice(1).toLowerCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
} 