import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Session timeout management
  private sessionTimeout: any;
  private readonly TIMEOUT_DURATION = 30 * 60 * 1000; // 30 menit (bisa disesuaikan)

  constructor(private userService: UserService) {
    // Initialize session timer if token exists
    if (this.hasToken()) {
      this.startSessionTimer();
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, { email, password });

      // Simpan token & user ke UserService
      localStorage.setItem('token', response.data.token);
      this.userService.setUser({
        nip: response.data.nip,
        displayname: response.data.displayname,
        username: response.data.username,
        role: response.data.role
      });

      // Update authentication state
      this.isAuthenticatedSubject.next(true);

      // Start the session timer
      this.startSessionTimer();

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    // Optional: Call backend to invalidate token if your API supports it
    // const token = localStorage.getItem('token');
    // if (token) {
    //   try {
    //     await axios.post(`${this.apiUrl}/logout`, {}, {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //   } catch (error) {
    //     console.error('Error during logout:', error);
    //   }
    // }

    // Clear the session timeout
    this.clearSessionTimer();

    // Remove token and user data
    localStorage.removeItem('token');
    this.userService.clearUser();

    // Update authentication state
    this.isAuthenticatedSubject.next(false);

    // Redirect to login
    window.location.href = '/login';
  }

  /**
   * Verifies if the current token is still valid
   */
  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      // Add an endpoint on your backend to verify token validity
      // This is just a placeholder - you need to implement this endpoint on your backend
      const response = await axios.get(`${this.apiUrl}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return true;
    } catch (error) {
      // If there's an error (401 or otherwise), token is invalid
      this.logout();
      return false;
    }
  }

  /**
   * Starts or resets the session timeout timer
   */
  startSessionTimer(): void {
    this.clearSessionTimer();
    this.sessionTimeout = setTimeout(() => {
      console.log('Session timed out after inactivity');
      this.logout();
    }, this.TIMEOUT_DURATION);
  }

  /**
   * Clears the session timeout
   */
  clearSessionTimer(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
  }

  /**
   * Call this method on user activity to reset the timer
   * You can add this to app.component or to a user activity service
   */
  refreshSession(): void {
    if (this.hasToken()) {
      this.startSessionTimer();
    }
  }
}
