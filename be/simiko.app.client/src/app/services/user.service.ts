import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any = null; // Data user tersimpan di sini

  constructor() { }

  // Simpan user setelah login
  setUser(userData: any): void {
    this.user = userData;
    localStorage.setItem('user', JSON.stringify(userData)); // Simpan di localStorage untuk persistensi
  }

  // Ambil data user yang tersimpan
  getUser(): any {
    if (!this.user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
    return this.user;
  }

  // Hapus user saat logout
  clearUser(): void {
    this.user = null;
    localStorage.removeItem('user');
  }
}
