import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Public routes
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  
  // Employee routes (protected by auth)
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'leave-request', 
    loadComponent: () => import('./components/leave-request/leave-request.component').then(m => m.LeaveRequestComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'leave-history', 
    loadComponent: () => import('./components/leave-history/leave-history.component').then(m => m.LeaveHistoryComponent),
    canActivate: [AuthGuard]
  },
  
  // Admin routes (protected by auth + admin role)
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'admin/all-leaves', 
    loadComponent: () => import('./components/admin/all-leaves/all-leaves.component').then(m => m.AllLeavesComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'admin/users', 
    loadComponent: () => import('./components/admin/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  
  // Fallback route
  { path: '**', redirectTo: '/home' }
]; 