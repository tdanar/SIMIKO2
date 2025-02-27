import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  hidePassword = true;
  tahun: number = new Date().getFullYear();

  constructor(private authService: AuthService,
    private router: Router) { }

  async login() {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Silakan masukkan email dan password!';
      return;
    }

    this.isLoading = true; // Mulai loading
    try {
      await this.authService.login(this.username, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login gagal', error);
      alert('Login gagal. Pastikan email dan password benar.');
    } finally {
      this.isLoading = false; // Selesai loading
    }
  }
}
