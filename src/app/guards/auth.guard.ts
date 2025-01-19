// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check for role-based access if 'role' data is provided in the route
    const expectedRole = route.data['role'];
    if (expectedRole) {
      if (expectedRole === 'admin' && !this.authService.isAdmin()) {
        // User does not have the required admin role
        this.router.navigate(['/home']); // Redirect to home or an unauthorized page
        return false;
      }
      // Add more role checks if needed
    }

    // User is authenticated and has the required role
    return true;
  }
}
