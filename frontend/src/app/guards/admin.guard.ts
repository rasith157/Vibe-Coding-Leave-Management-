import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.apiService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.role !== 'ADMIN') {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
} 