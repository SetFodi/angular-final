import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8000/api'; // Your Laravel endpoint
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    // Check if there's a saved user in localStorage
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(userData: any) {
    return this.http.post<any>(`${this.authUrl}/register`, userData);
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.authUrl}/login`, credentials)
      .pipe(map(response => {
        // Suppose the response contains { user: ..., token: ... }
        if (response && response.token) {
          localStorage.setItem('user', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
        return response;
      }));
  }

  logout() {
    // Remove user from local storage
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue?.token;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.user?.role === 'admin';
  }
}
