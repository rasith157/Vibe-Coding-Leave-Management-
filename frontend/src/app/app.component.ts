import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NavigationComponent],
  template: `
    <div class="app-container">
      <app-navigation *ngIf="isAuthenticated"></app-navigation>
      <main class="main-content" [class.with-nav]="isAuthenticated">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f9fafb;
    }

    .main-content {
      min-height: 100vh;
    }

    .main-content.with-nav {
      min-height: calc(100vh - 64px);
    }

    /* Global styles for consistency */
    :host ::ng-deep {
      .text-gray-600 {
        color: #6b7280;
      }
      
      .text-muted {
        color: #9ca3af;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'LeaveFlow';
  isAuthenticated = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.checkAuthentication();
  }

  private checkAuthentication() {
    this.isAuthenticated = this.apiService.isAuthenticated();
  }
} 