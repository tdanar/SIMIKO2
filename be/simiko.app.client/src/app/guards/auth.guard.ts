import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Cek apakah user sudah login
    if (token) {
      return true; // Jika ada token, izinkan akses
    }

    this.router.navigate(['/login']); // Redirect ke login jika belum login
    return false;
  }
}
