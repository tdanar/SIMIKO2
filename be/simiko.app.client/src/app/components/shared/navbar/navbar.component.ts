import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any = null;
  avatarUrl = '';
  @Input() isSidebarExpanded = true;
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.avatarUrl = 'http://10.216.204.9/FotoPegawai/API/PegawaiFoto/' + this.user.nip;
  }

  // Adjust the sidebar when toggle button is clicked
  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  logout(): void {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      this.authService.logout();
    }
  }
}
