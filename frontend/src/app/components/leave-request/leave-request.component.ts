import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CreateLeaveRequest, LeaveType, LeaveBalance } from '../../interfaces/leave.interface';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="leave-request-container">
      <!-- Header -->
      <div class="page-header">
        <button class="back-button" (click)="goBack()">
          <span class="back-icon">←</span>
          Back to Dashboard
        </button>
        <h1>Request Leave</h1>
        <p>Submit a new leave request for approval</p>
      </div>

      <!-- Leave Balance Summary -->
      <div class="balance-summary" *ngIf="leaveBalance">
        <h2>Your Current Leave Balance</h2>
        <div class="balance-cards">
          <div class="balance-card annual">
            <div class="balance-type">Annual Leave</div>
            <div class="balance-amount">{{leaveBalance.annualRemaining}} days</div>
          </div>
          <div class="balance-card sick">
            <div class="balance-type">Sick Leave</div>
            <div class="balance-amount">{{leaveBalance.sickRemaining}} days</div>
          </div>
          <div class="balance-card casual">
            <div class="balance-type">Casual Leave</div>
            <div class="balance-amount">{{leaveBalance.casualRemaining}} days</div>
          </div>
        </div>
      </div>

      <!-- Leave Request Form -->
      <div class="form-container">
        <form (ngSubmit)="submitLeaveRequest()" #leaveForm="ngForm">
          <!-- Leave Type -->
          <div class="form-group">
            <label for="leaveType" class="form-label">
              Leave Type <span class="required">*</span>
            </label>
            <select 
              id="leaveType"
              name="leaveType"
              [(ngModel)]="leaveRequest.leaveType"
              required
              class="form-select"
              [class.error]="leaveForm.submitted && !leaveRequest.leaveType">
              <option value="">Select leave type</option>
              <option value="ANNUAL">Annual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="EMERGENCY">Emergency Leave</option>
            </select>
            <div class="error-message" *ngIf="leaveForm.submitted && !leaveRequest.leaveType">
              Please select a leave type
            </div>
          </div>

          <!-- Date Range -->
          <div class="form-row">
            <div class="form-group">
              <label for="startDate" class="form-label">
                Start Date <span class="required">*</span>
              </label>
              <input 
                type="date"
                id="startDate"
                name="startDate"
                [(ngModel)]="leaveRequest.startDate"
                [min]="minDate"
                required
                class="form-input"
                [class.error]="leaveForm.submitted && (!leaveRequest.startDate || dateError)"
                (change)="calculateDuration()">
              <div class="error-message" *ngIf="leaveForm.submitted && !leaveRequest.startDate">
                Please select a start date
              </div>
            </div>

            <div class="form-group">
              <label for="endDate" class="form-label">
                End Date <span class="required">*</span>
              </label>
              <input 
                type="date"
                id="endDate"
                name="endDate"
                [(ngModel)]="leaveRequest.endDate"
                [min]="leaveRequest.startDate || minDate"
                required
                class="form-input"
                [class.error]="leaveForm.submitted && (!leaveRequest.endDate || dateError)"
                (change)="calculateDuration()">
              <div class="error-message" *ngIf="leaveForm.submitted && !leaveRequest.endDate">
                Please select an end date
              </div>
            </div>
          </div>

          <!-- Duration (calculated) -->
          <div class="form-group">
            <label class="form-label">Duration</label>
            <div class="duration-display">
              <span class="duration-value">{{leaveRequest.duration || 0}}</span>
              <span class="duration-unit">day(s)</span>
            </div>
            <div class="help-text">Duration is automatically calculated based on selected dates</div>
          </div>

          <!-- Reason -->
          <div class="form-group">
            <label for="reason" class="form-label">
              Reason <span class="optional">(optional)</span>
            </label>
            <textarea 
              id="reason"
              name="reason"
              [(ngModel)]="leaveRequest.reason"
              rows="4"
              class="form-textarea"
              placeholder="Please provide a reason for your leave request (optional)..."
              maxlength="500"></textarea>
            <div class="character-count">
              {{(leaveRequest.reason || '').length}} / 500 characters
            </div>
          </div>

          <!-- Validation Messages -->
          <div class="validation-messages" *ngIf="validationErrors.length > 0">
            <div class="error-banner">
              <h4>Please fix the following issues:</h4>
              <ul>
                <li *ngFor="let error of validationErrors">{{error}}</li>
              </ul>
            </div>
          </div>

          <!-- Error Message -->
          <div class="error-banner" *ngIf="submitError">
            <strong>Error:</strong> {{submitError}}
          </div>

          <!-- Success Message -->
          <div class="success-banner" *ngIf="submitSuccess">
            <strong>Success!</strong> Your leave request has been submitted successfully.
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button 
              type="button" 
              class="btn-secondary"
              (click)="resetForm()"
              [disabled]="isSubmitting">
              Reset Form
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="!leaveForm.valid || isSubmitting || validationErrors.length > 0">
              <span *ngIf="!isSubmitting">Submit Request</span>
              <span *ngIf="isSubmitting" class="loading-text">
                <span class="spinner"></span>
                Submitting...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .leave-request-container {
      max-width: 800px;
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

    .balance-summary {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .balance-summary h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .balance-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .balance-card {
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .balance-card.annual {
      background: #dbeafe;
      border: 1px solid #93c5fd;
    }

    .balance-card.sick {
      background: #fee2e2;
      border: 1px solid #fca5a5;
    }

    .balance-card.casual {
      background: #d1fae5;
      border: 1px solid #86efac;
    }

    .balance-type {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .balance-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .form-container {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }

    .required {
      color: #ef4444;
    }

    .optional {
      color: #6b7280;
      font-weight: 400;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      background: white;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input.error, .form-select.error, .form-textarea.error {
      border-color: #ef4444;
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    .duration-display {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }

    .duration-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .duration-unit {
      color: #6b7280;
    }

    .help-text {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 4px;
    }

    .character-count {
      text-align: right;
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 4px;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .validation-messages {
      margin-bottom: 24px;
    }

    .error-banner {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .error-banner h4 {
      color: #dc2626;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .error-banner ul {
      margin: 0;
      padding-left: 20px;
      color: #dc2626;
    }

    .error-banner strong {
      color: #dc2626;
    }

    .success-banner {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      color: #166534;
    }

    .success-banner strong {
      color: #166534;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid;
      min-width: 140px;
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
      background: #9ca3af;
      border-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: white;
      color: #6b7280;
      border-color: #d1d5db;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-text {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .leave-request-container {
        padding: 16px;
      }

      .form-container {
        padding: 24px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .balance-cards {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class LeaveRequestComponent implements OnInit {
  leaveRequest: CreateLeaveRequest = {
    leaveType: '',
    startDate: '',
    endDate: '',
    duration: 0,
    reason: ''
  };

  leaveBalance: LeaveBalance | null = null;
  validationErrors: string[] = [];
  submitError = '';
  submitSuccess = false;
  isSubmitting = false;
  dateError = false;
  minDate: string;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadLeaveBalance();
  }

  loadLeaveBalance() {
    this.apiService.getLeaveBalance().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.leaveBalance = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading leave balance:', error);
      }
    });
  }

  calculateDuration() {
    this.dateError = false;
    this.validationErrors = this.validationErrors.filter(error => 
      !error.includes('date') && !error.includes('Duration')
    );

    if (this.leaveRequest.startDate && this.leaveRequest.endDate) {
      const startDate = new Date(this.leaveRequest.startDate);
      const endDate = new Date(this.leaveRequest.endDate);
      
      if (endDate < startDate) {
        this.dateError = true;
        this.leaveRequest.duration = 0;
        if (!this.validationErrors.includes('End date must be after start date')) {
          this.validationErrors.push('End date must be after start date');
        }
        return;
      }

      // Calculate business days (excluding weekends)
      let duration = 0;
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
          duration++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      this.leaveRequest.duration = duration;
      
      // Validate against available balance
      this.validateLeaveBalance();
    } else {
      this.leaveRequest.duration = 0;
    }
  }

  validateLeaveBalance() {
    if (!this.leaveBalance || !this.leaveRequest.leaveType || !this.leaveRequest.duration) {
      return;
    }

    const balanceError = 'Insufficient leave balance for the requested duration';
    this.validationErrors = this.validationErrors.filter(error => error !== balanceError);

    let availableBalance = 0;
    switch (this.leaveRequest.leaveType) {
      case LeaveType.ANNUAL:
        availableBalance = this.leaveBalance.annualRemaining;
        break;
      case LeaveType.SICK:
        availableBalance = this.leaveBalance.sickRemaining;
        break;
      case LeaveType.CASUAL:
        availableBalance = this.leaveBalance.casualRemaining;
        break;
      case LeaveType.EMERGENCY:
        // Emergency leave might not have a specific balance limit
        return;
    }

    if (this.leaveRequest.duration > availableBalance) {
      this.validationErrors.push(balanceError);
    }
  }

  submitLeaveRequest() {
    this.submitError = '';
    this.submitSuccess = false;
    this.validationErrors = [];

    // Validate form
    if (!this.leaveRequest.leaveType) {
      this.validationErrors.push('Please select a leave type');
    }

    if (!this.leaveRequest.startDate) {
      this.validationErrors.push('Please select a start date');
    }

    if (!this.leaveRequest.endDate) {
      this.validationErrors.push('Please select an end date');
    }

    if (this.leaveRequest.duration <= 0) {
      this.validationErrors.push('Duration must be at least 1 day');
    }

    // Re-validate dates and balance
    this.calculateDuration();

    if (this.validationErrors.length > 0) {
      return;
    }

    this.isSubmitting = true;

    this.apiService.createLeave(this.leaveRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.submitSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        } else {
          this.submitError = response.message || 'Failed to submit leave request';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error.message || 'An error occurred while submitting your request';
        console.error('Error submitting leave request:', error);
      }
    });
  }

  resetForm() {
    this.leaveRequest = {
      leaveType: '',
      startDate: '',
      endDate: '',
      duration: 0,
      reason: ''
    };
    this.validationErrors = [];
    this.submitError = '';
    this.submitSuccess = false;
    this.dateError = false;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
} 