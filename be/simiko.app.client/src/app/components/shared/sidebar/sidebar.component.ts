import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '250px'
      })),
      state('closed', style({
        width: '60px'
      })),
      transition('open <=> closed', [
        animate('0.3s ease-in-out')
      ])
    ])
  ],
})
export class SidebarComponent {
  @Input() isExpanded = true;
  @Output() toggleSidebar = new EventEmitter<boolean>();

  adminMenuItems = [
    { icon: 'people', name: 'Manajemen Pengguna', link: '/admin/users' },
    { icon: 'folder', name: 'Referensi - referensi', link: '/admin/references', hasSubmenu: true },
    { icon: 'login', name: 'Login As', link: '/admin/login-as' },
    { icon: 'history', name: 'Aktivitas Pengguna', link: '/admin/activity' }
  ];

  mentoringMenuItems = [
    { icon: 'supervisor_account', name: 'Mentor Tetap', link: '/mentoring/permanent' },
    { icon: 'person_off', name: 'Mentor Tidak Tetap', link: '/mentoring/temporary' },
    { icon: 'description', name: 'Form IDP', link: '/mentoring/form-idp' },
    { icon: 'book', name: 'Jurnal Mentoring', link: '/mentoring/journal' }
  ];

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidebar.emit(this.isExpanded);
  }
}
