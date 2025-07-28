import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuditLoggerService } from '../../services/audit-logger.service';

@Component({
  selector: 'app-connection-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Connection Test</h2>
          <p class="text-gray-600">Testing frontend to backend connectivity</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <!-- Connection Status -->
          <div class="flex items-center justify-between p-4 rounded-lg" 
               [class]="getConnectionStatusClass()">
            <div class="flex items-center">
              <i [class]="getConnectionIcon()" class="mr-3 text-xl"></i>
              <div>
                <h3 class="font-semibold">Backend Connection</h3>
                <p class="text-sm">{{ connectionStatus }}</p>
              </div>
            </div>
            <div *ngIf="isLoading" class="animate-spin">
              <i class="fas fa-spinner text-xl"></i>
            </div>
          </div>

          <!-- Test Details -->
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Backend URL:</span>
              <span class="font-mono text-blue-600">http://localhost:8080</span>
            </div>
            <div class="flex justify-between">
              <span>Test Endpoint:</span>
              <span class="font-mono text-blue-600">/api/auth/test</span>
            </div>
            <div class="flex justify-between" *ngIf="responseTime">
              <span>Response Time:</span>
              <span class="font-mono text-green-600">{{ responseTime }}ms</span>
            </div>
            <div class="flex justify-between" *ngIf="lastTested">
              <span>Last Tested:</span>
              <span class="text-gray-600">{{ lastTested }}</span>
            </div>
          </div>

          <!-- Error Details -->
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 class="font-semibold text-red-800 mb-2">Error Details:</h4>
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
            
            <div class="mt-3 text-sm text-red-600">
              <h5 class="font-semibold mb-1">Troubleshooting Steps:</h5>
              <ul class="list-disc list-inside space-y-1">
                <li>Make sure the backend is running on port 8080</li>
                <li>Check if CORS is properly configured</li>
                <li>Verify the backend API endpoint exists</li>
                <li>Check network connectivity</li>
              </ul>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button 
              class="btn btn-primary flex-1"
              (click)="testConnection()"
              [disabled]="isLoading">
              <i class="fas fa-sync-alt mr-2"></i>
              {{ isLoading ? 'Testing...' : 'Test Connection' }}
            </button>
            <button 
              class="btn btn-secondary"
              (click)="goBack()">
              <i class="fas fa-arrow-left mr-2"></i>
              Back
            </button>
          </div>

          <!-- Logs Section -->
          <div class="border-t pt-4">
            <h4 class="font-semibold text-gray-900 mb-2">Recent Connection Tests:</h4>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <div *ngFor="let log of connectionLogs" 
                   class="text-xs p-2 rounded" 
                   [class]="log.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                <div class="flex justify-between">
                  <span>{{ log.timestamp }}</span>
                  <span class="font-mono">{{ log.responseTime }}ms</span>
                </div>
                <div>{{ log.message }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .btn {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-primary:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #4b5563;
    }

    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }

    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }

    .space-y-4 > * + * {
      margin-top: 1rem;
    }

    .space-y-8 > * + * {
      margin-top: 2rem;
    }

    .list-disc {
      list-style-type: disc;
    }

    .list-inside {
      list-style-position: inside;
    }
  `]
})
export class ConnectionTestComponent implements OnInit {
  connectionStatus = 'Not tested';
  isLoading = false;
  errorMessage = '';
  responseTime: number | null = null;
  lastTested: string | null = null;
  connectionLogs: Array<{
    timestamp: string;
    success: boolean;
    message: string;
    responseTime: number;
  }> = [];

  constructor(
    private apiService: ApiService,
    private auditLogger: AuditLoggerService
  ) {}

  ngOnInit() {
    this.auditLogger.logComponentLifecycle('ConnectionTestComponent', 'OnInit', {
      purpose: 'Backend connectivity testing'
    });

    // Auto-test connection on load
    this.testConnection();
  }

  testConnection() {
    this.isLoading = true;
    this.errorMessage = '';
    this.connectionStatus = 'Testing...';
    
    const startTime = Date.now();

    this.auditLogger.logUserAction('Connection Test Started', 'ConnectionTestComponent', {
      baseUrl: 'http://localhost:8080',
      endpoint: '/api/auth/test'
    });

    // Test the connection using a simple GET request
    this.apiService.testConnection().subscribe({
      next: (isConnected) => {
        this.responseTime = Date.now() - startTime;
        this.isLoading = false;
        this.lastTested = new Date().toLocaleTimeString();

        if (isConnected) {
          this.connectionStatus = 'Connected ✅';
          this.auditLogger.logInfo('API', 'Connection Test Successful', {
            responseTime: this.responseTime,
            status: 'success'
          });

          this.addConnectionLog(true, 'Backend connection successful', this.responseTime);
        } else {
          this.connectionStatus = 'Connection failed ❌';
          this.errorMessage = 'Backend returned an error or unexpected response';
          
          this.auditLogger.logWarn('API', 'Connection Test Failed', {
            responseTime: this.responseTime,
            status: 'failed'
          });

          this.addConnectionLog(false, 'Backend connection failed', this.responseTime);
        }
      },
      error: (error) => {
        this.responseTime = Date.now() - startTime;
        this.isLoading = false;
        this.lastTested = new Date().toLocaleTimeString();
        this.connectionStatus = 'Connection error ❌';
        
        // Determine error type and message
        if (error.status === 0) {
          this.errorMessage = 'Cannot reach backend server. Is it running on port 8080?';
        } else if (error.status === 404) {
          this.errorMessage = 'Backend is running but test endpoint not found. Check API configuration.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Backend server error. Check backend logs.';
        } else {
          this.errorMessage = `Connection error: ${error.message || 'Unknown error'}`;
        }

        this.auditLogger.logError('API', 'Connection Test Error', error, {
          responseTime: this.responseTime,
          errorStatus: error.status,
          errorMessage: this.errorMessage
        });

        this.addConnectionLog(false, this.errorMessage, this.responseTime);
      }
    });
  }

  private addConnectionLog(success: boolean, message: string, responseTime: number) {
    this.connectionLogs.unshift({
      timestamp: new Date().toLocaleTimeString(),
      success,
      message,
      responseTime
    });

    // Keep only last 5 logs
    if (this.connectionLogs.length > 5) {
      this.connectionLogs = this.connectionLogs.slice(0, 5);
    }
  }

  getConnectionStatusClass(): string {
    if (this.isLoading) {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    } else if (this.connectionStatus.includes('✅')) {
      return 'bg-green-50 border-green-200 text-green-800';
    } else if (this.connectionStatus.includes('❌')) {
      return 'bg-red-50 border-red-200 text-red-800';
    } else {
      return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

  getConnectionIcon(): string {
    if (this.isLoading) {
      return 'fas fa-spinner fa-spin text-blue-600';
    } else if (this.connectionStatus.includes('✅')) {
      return 'fas fa-check-circle text-green-600';
    } else if (this.connectionStatus.includes('❌')) {
      return 'fas fa-times-circle text-red-600';
    } else {
      return 'fas fa-question-circle text-gray-600';
    }
  }

  goBack() {
    this.auditLogger.logUserAction('Back Button Clicked', 'ConnectionTestComponent', {
      connectionStatus: this.connectionStatus
    });
    
    // Navigate back to home or previous page
    window.history.back();
  }
} 