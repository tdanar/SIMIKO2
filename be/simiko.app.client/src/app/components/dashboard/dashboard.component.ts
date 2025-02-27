import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  isLoading = false;
  isUserAdmin = false;

  dashboardCards = [
    {
      title: 'Rekap Nilai',
      icon: 'assessment',
      link: '/rekap-nilai',
      color: 'orange'
    },
    {
      title: 'Cetak Form',
      icon: 'print',
      link: '/cetak-form',
      color: 'orange'
    },
    {
      title: 'Jabatan Target',
      icon: 'business',
      link: '/jabatan-target',
      color: 'orange'
    },
    {
      title: 'Rekam Hasil Assessment',
      icon: 'assignment',
      link: '/rekam-assessment',
      color: 'orange'
    }
  ];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = true;

    // Ambil data user dari UserService
    this.user = this.userService.getUser();
    this.isUserAdmin = this.user?.Role?.includes('Administrator') ?? false;

    setTimeout(() => {
      this.isLoading = false;
    }, 1000); // Simulasi loading
  }
}
