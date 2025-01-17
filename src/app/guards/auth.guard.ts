import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // If not authenticated, redirect to /login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check roles if provided
    const expectedRoles = route.data['roles'] as Array<string>;
    if (expectedRoles && expectedRoles.length > 0) {
      const userIsAuthorized = expectedRoles.some(role => {
        // For example, if user is an admin => user.role = 'admin'
        return this.authService.currentUserValue?.user?.role === role;
      });

      if (!userIsAuthorized) {
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }

}
