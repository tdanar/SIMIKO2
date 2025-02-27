import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth/login';
  constructor(private userService: UserService) { }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, { email, password });

      // Simpan token & user ke UserService
      localStorage.setItem('token', response.data.token);
      this.userService.setUser({
        nip: response.data.nip,
        displayname: response.data.displayname,
        username: response.data.username,
        role: response.data.role
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userService.clearUser();
    window.location.href = '/login'; // Redirect ke login
  }
}
