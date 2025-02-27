import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isSidebarExpanded = true;
  tahun: number = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {
    // Check screen size on init and adjust sidebar accordingly
    this.checkScreenSize();

    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  // Toggle sidebar expanded state
  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  // Automatically collapse sidebar on small screens
  private checkScreenSize(): void {
    if (window.innerWidth < 768) {
      this.isSidebarExpanded = false;
    } else {
      this.isSidebarExpanded = true;
    }
  }
}
