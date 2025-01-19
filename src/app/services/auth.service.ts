// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

export interface User {
  email: string;
  password: string;
  role: string; // 'admin' or 'user'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In-memory user list. Pre-seed with an admin account.
  private users: User[] = [
    {
      email: 'admin@site.com',
      password: 'admin123', // Obviously insecure in real scenarios
      role: 'admin'
    }
  ];

  // BehaviorSubject to track the currently logged-in JWT
  private currentTokenSubject = new BehaviorSubject<string | null>(null);
  public currentToken$: Observable<string | null> = this.currentTokenSubject.asObservable();

  constructor() {
    // If there's a token in localStorage, load it
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      this.currentTokenSubject.next(savedToken);
    }
  }

  /**
   * Register a new user in our in-memory array. 
   * By default, new users have role 'user'.
   */
  register(email: string, password: string): Observable<User> {
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      return throwError({ message: 'User already exists' });
    }

    const newUser: User = {
      email,
      password,
      role: 'user'
    };

    this.users.push(newUser);
    return of(newUser);
  }

  /**
   * Login checks our in-memory array. If found, we emit a mock JWT.
   */
  login(email: string, password: string): Observable<string> { // Returns JWT as string
    const foundUser = this.users.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      return throwError({ message: 'Invalid credentials' });
    }

    // Generate a mock JWT (Base64-encoded JSON)
    const tokenPayload = {
      email: foundUser.email,
      role: foundUser.role,
      // You can add more fields like expiration here
    };
    const token = btoa(JSON.stringify(tokenPayload)); // Base64 encoding as a mock JWT

    // Mark as logged in
    this.currentTokenSubject.next(token);
    localStorage.setItem('authToken', token);
    return of(token);
  }

  /**
   * Logout: clear token from BehaviorSubject and localStorage
   */
  logout(): void {
    this.currentTokenSubject.next(null);
    localStorage.removeItem('authToken');
  }

  /**
   * Check if user is authenticated by verifying the presence of a token
   */
  isAuthenticated(): boolean {
    return !!this.currentTokenSubject.value;
  }

  /**
   * Check if current user is admin by decoding the token
   */
  isAdmin(): boolean {
    const token = this.currentTokenSubject.value;
    if (token) {
      try {
        const payload = JSON.parse(atob(token));
        return payload.role === 'admin';
      } catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Decode the current JWT to get user information
   */
  getCurrentUser(): { email: string; role: string } | null {
    const token = this.currentTokenSubject.value;
    if (token) {
      try {
        const payload = JSON.parse(atob(token));
        return { email: payload.email, role: payload.role };
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Public getter to access the current token
   */
  getToken(): string | null {
    return this.currentTokenSubject.value;
  }
}
