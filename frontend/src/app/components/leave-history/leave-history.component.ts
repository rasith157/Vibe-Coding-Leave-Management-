import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LeaveResponse, LeaveType, LeaveStatus } from '../../interfaces/leave.interface';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="leave-history-container">
      <!-- Header -->
      <div class="page-header">
        <button class="back-button" (click)="goBack()">
          <span class="back-icon">←</span>
          Back to Dashboard
        </button>
        <h1>Leave History</h1>
        <p>View and manage all your leave requests</p>
      </div>

      <!-- Filters and Actions -->
      <div class="controls-section">
        <div class="filters">
          <div class="filter-group">
            <label for="statusFilter">Status:</label>
            <select id="statusFilter" [(ngModel)]="filters.status" (change)="applyFilters()">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="typeFilter">Type:</label>
            <select id="typeFilter" [(ngModel)]="filters.type" (change)="applyFilters()">
              <option value="">All Types</option>
              <option value="ANNUAL">Annual</option>
              <option value="SICK">Sick</option>
              <option value="CASUAL">Casual</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="yearFilter">Year:</label>
            <select id="yearFilter" [(ngModel)]="filters.year" (change)="applyFilters()">
              <option value="">All Years</option>
              <option *ngFor="let year of availableYears" [value]="year">{{year}}</option>
            </select>
          </div>

          <button class="clear-filters-btn" (click)="clearFilters()" *ngIf="hasActiveFilters()">
            Clear Filters
          </button>
        </div>

        <div class="actions">
          <button class="btn-primary" (click)="navigateToNewRequest()">
            <span class="btn-icon">➕</span>
            New Request
          </button>
          <button class="btn-secondary" (click)="refreshData()">
            <span class="btn-icon">🔄</span>
            Refresh
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="summary-stats" *ngIf="summaryStats">
        <div class="stat-card pending">
          <div class="stat-number">{{summaryStats.pending}}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card approved">
          <div class="stat-number">{{summaryStats.approved}}</div>
          <div class="stat-label">Approved</div>
        </div>
        <div class="stat-card rejected">
          <div class="stat-number">{{summaryStats.rejected}}</div>
          <div class="stat-label">Rejected</div>
        </div>
        <div class="stat-card total">
          <div class="stat-number">{{summaryStats.total}}</div>
          <div class="stat-label">Total Requests</div>
        </div>
      </div>

      <!-- Leave Requests Table -->
      <div class="table-container">
        <div class="table-header">
          <h2>Leave Requests</h2>
          <div class="sort-controls">
            <label>Sort by:</label>
            <select [(ngModel)]="sortField" (change)="applySorting()">
              <option value="createdAt">Date Created</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
              <option value="leaveType">Type</option>
              <option value="status">Status</option>
              <option value="duration">Duration</option>
            </select>
            <button class="sort-direction-btn" (click)="toggleSortDirection()">
              {{sortDirection === 'asc' ? '↑' : '↓'}}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner-large"></div>
          <p>Loading your leave requests...</p>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!isLoading && filteredLeaves.length === 0">
          <div class="empty-icon">📋</div>
          <h3>No leave requests found</h3>
          <p *ngIf="!hasActiveFilters()">You haven't submitted any leave requests yet.</p>
          <p *ngIf="hasActiveFilters()">No requests match your current filters.</p>
          <button class="btn-primary" (click)="navigateToNewRequest()" *ngIf="!hasActiveFilters()">
            Create Your First Request
          </button>
          <button class="btn-secondary" (click)="clearFilters()" *ngIf="hasActiveFilters()">
            Clear Filters
          </button>
        </div>

        <!-- Leaves Table -->
        <div class="table-responsive" *ngIf="!isLoading && filteredLeaves.length > 0">
          <table class="leaves-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let leave of filteredLeaves" class="leave-row">
                <td>
                  <span class="leave-type-badge" [ngClass]="leave.leaveType.toLowerCase()">
                    {{formatLeaveType(leave.leaveType)}}
                  </span>
                </td>
                <td>
                  <div class="date-info">
                    <div class="dates">{{formatDate(leave.startDate)}} - {{formatDate(leave.endDate)}}</div>
                    <div class="created-date">Created: {{formatDate(leave.createdAt)}}</div>
                  </div>
                </td>
                <td>
                  <span class="duration">{{leave.duration}} day{{leave.duration !== 1 ? 's' : ''}}</span>
                </td>
                <td>
                  <span class="status-badge" [ngClass]="leave.status.toLowerCase()">
                    <span class="status-indicator"></span>
                    {{formatStatus(leave.status)}}
                  </span>
                  <div class="approval-info" *ngIf="leave.approvedByName && leave.approvedAt">
                    <small>by {{leave.approvedByName}}</small>
                    <small>{{formatDate(leave.approvedAt)}}</small>
                  </div>
                </td>
                <td>
                  <div class="reason-cell">
                    <span class="reason-text" [title]="leave.reason">
                      {{leave.reason || 'No reason provided'}}
                    </span>
                    <div class="comments" *ngIf="leave.comments">
                      <strong>Comments:</strong> {{leave.comments}}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      *ngIf="leave.status === 'PENDING'"
                      class="btn-delete"
                      (click)="deleteLeave(leave)"
                      title="Delete request">
                      🗑️
                    </button>
                    <button 
                      class="btn-view"
                      (click)="viewLeaveDetails(leave)"
                      title="View details">
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Leave Details Modal -->
      <div class="modal-overlay" *ngIf="selectedLeave" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Leave Request Details</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="detail-row">
              <strong>Type:</strong>
              <span class="leave-type-badge" [ngClass]="selectedLeave.leaveType.toLowerCase()">
                {{formatLeaveType(selectedLeave.leaveType)}}
              </span>
            </div>
            <div class="detail-row">
              <strong>Duration:</strong>
              <span>{{selectedLeave.duration}} day{{selectedLeave.duration !== 1 ? 's' : ''}}</span>
            </div>
            <div class="detail-row">
              <strong>Start Date:</strong>
              <span>{{formatDate(selectedLeave.startDate)}}</span>
            </div>
            <div class="detail-row">
              <strong>End Date:</strong>
              <span>{{formatDate(selectedLeave.endDate)}}</span>
            </div>
            <div class="detail-row">
              <strong>Status:</strong>
              <span class="status-badge" [ngClass]="selectedLeave.status.toLowerCase()">
                <span class="status-indicator"></span>
                {{formatStatus(selectedLeave.status)}}
              </span>
            </div>
            <div class="detail-row" *ngIf="selectedLeave.reason">
              <strong>Reason:</strong>
              <span>{{selectedLeave.reason}}</span>
            </div>
            <div class="detail-row" *ngIf="selectedLeave.comments">
              <strong>Comments:</strong>
              <span>{{selectedLeave.comments}}</span>
            </div>
            <div class="detail-row" *ngIf="selectedLeave.approvedByName">
              <strong>Approved By:</strong>
              <span>{{selectedLeave.approvedByName}}</span>
            </div>
            <div class="detail-row" *ngIf="selectedLeave.approvedAt">
              <strong>Approved On:</strong>
              <span>{{formatDate(selectedLeave.approvedAt)}}</span>
            </div>
            <div class="detail-row">
              <strong>Submitted:</strong>
              <span>{{formatDate(selectedLeave.createdAt)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .leave-history-container {
      max-width: 1200px;
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

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .filter-group label {
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

    .stat-card.pending { border-left-color: #f59e0b; }
    .stat-card.approved { border-left-color: #10b981; }
    .stat-card.rejected { border-left-color: #ef4444; }
    .stat-card.total { border-left-color: #6b7280; }

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

    .leaves-table {
      width: 100%;
      border-collapse: collapse;
    }

    .leaves-table th {
      background: #f9fafb;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
    }

    .leaves-table td {
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
    }

    .leave-row:hover {
      background: #f9fafb;
    }

    .leave-type-badge {
      display: inline-block;
      padding: 4px 12px;
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

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .dates {
      font-weight: 600;
      color: #1f2937;
    }

    .created-date {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .duration {
      font-weight: 600;
      color: #1f2937;
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

    .status-badge.pending { color: #f59e0b; }
    .status-badge.pending .status-indicator { background: #f59e0b; }

    .status-badge.approved { color: #10b981; }
    .status-badge.approved .status-indicator { background: #10b981; }

    .status-badge.rejected { color: #ef4444; }
    .status-badge.rejected .status-indicator { background: #ef4444; }

    .approval-info {
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .approval-info small {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .reason-cell {
      max-width: 300px;
    }

    .reason-text {
      display: block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #374151;
    }

    .comments {
      margin-top: 8px;
      padding: 8px;
      background: #f9fafb;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-delete, .btn-view {
      background: none;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 6px 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .btn-delete:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    .btn-view:hover {
      background: #f0f9ff;
      border-color: #93c5fd;
    }

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
      min-width: 120px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .leave-history-container {
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

      .leaves-table {
        font-size: 0.875rem;
      }

      .leaves-table th,
      .leaves-table td {
        padding: 8px;
      }

      .reason-cell {
        max-width: 150px;
      }

      .modal-content {
        margin: 10px;
        max-height: calc(100vh - 20px);
      }

      .modal-header,
      .modal-body {
        padding: 16px;
      }

      .detail-row {
        flex-direction: column;
        gap: 4px;
      }

      .detail-row strong {
        min-width: auto;
      }
    }
  `]
})
export class LeaveHistoryComponent implements OnInit {
  allLeaves: LeaveResponse[] = [];
  filteredLeaves: LeaveResponse[] = [];
  selectedLeave: LeaveResponse | null = null;
  isLoading = true;

  filters = {
    status: '',
    type: '',
    year: ''
  };

  sortField = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  availableYears: number[] = [];
  summaryStats: any = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeaveHistory();
  }

  loadLeaveHistory() {
    this.isLoading = true;
    this.apiService.getMyLeaves().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allLeaves = response.data;
          this.generateAvailableYears();
          this.calculateSummaryStats();
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading leave history:', error);
        this.isLoading = false;
      }
    });
  }

  generateAvailableYears() {
    const years = new Set<number>();
    this.allLeaves.forEach(leave => {
      const year = new Date(leave.createdAt).getFullYear();
      years.add(year);
    });
    this.availableYears = Array.from(years).sort((a, b) => b - a);
  }

  calculateSummaryStats() {
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: this.allLeaves.length
    };

    this.allLeaves.forEach(leave => {
      switch (leave.status) {
        case LeaveStatus.PENDING:
          stats.pending++;
          break;
        case LeaveStatus.APPROVED:
          stats.approved++;
          break;
        case LeaveStatus.REJECTED:
          stats.rejected++;
          break;
      }
    });

    this.summaryStats = stats;
  }

  applyFilters() {
    let filtered = [...this.allLeaves];

    // Apply status filter
    if (this.filters.status) {
      filtered = filtered.filter(leave => leave.status === this.filters.status);
    }

    // Apply type filter
    if (this.filters.type) {
      filtered = filtered.filter(leave => leave.leaveType === this.filters.type);
    }

    // Apply year filter
    if (this.filters.year) {
      const year = parseInt(this.filters.year);
      filtered = filtered.filter(leave => 
        new Date(leave.createdAt).getFullYear() === year
      );
    }

    this.filteredLeaves = filtered;
    this.applySorting();
  }

  applySorting() {
    this.filteredLeaves.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'createdAt':
        case 'startDate':
        case 'endDate':
        case 'approvedAt':
          aValue = new Date(a[this.sortField as keyof LeaveResponse] as string);
          bValue = new Date(b[this.sortField as keyof LeaveResponse] as string);
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        default:
          aValue = a[this.sortField as keyof LeaveResponse];
          bValue = b[this.sortField as keyof LeaveResponse];
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
      status: '',
      type: '',
      year: ''
    };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.status || this.filters.type || this.filters.year);
  }

  deleteLeave(leave: LeaveResponse) {
    if (confirm(`Are you sure you want to delete your ${leave.leaveType.toLowerCase()} leave request?`)) {
      this.apiService.deleteLeave(leave.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadLeaveHistory(); // Refresh the list
          }
        },
        error: (error) => {
          console.error('Error deleting leave:', error);
          alert('Failed to delete leave request. Please try again.');
        }
      });
    }
  }

  viewLeaveDetails(leave: LeaveResponse) {
    this.selectedLeave = leave;
  }

  closeModal() {
    this.selectedLeave = null;
  }

  refreshData() {
    this.loadLeaveHistory();
  }

  navigateToNewRequest() {
    this.router.navigate(['/leave-request']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
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