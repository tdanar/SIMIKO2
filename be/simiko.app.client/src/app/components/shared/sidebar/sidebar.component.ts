import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
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
    ]),
    trigger('expandSubmenu', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        visibility: 'visible'
      })),
      state('collapsed', style({
        height: '0',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('expanded <=> collapsed', [
        animate('0.2s ease-in-out')
      ])
    ])
  ]
})
export class SidebarComponent {
  @Input() isExpanded = true;
  @Output() toggleSidebar = new EventEmitter<boolean>();

  @ViewChild('submenuPopup') submenuPopup!: MatMenu;
  @ViewChild('mentorSubmenu') mentorSubmenu!: MatMenu;

  // Track expanded submenu items
  expandedItems: { [key: string]: boolean } = {};

  adminMenuItems = [
    {
      icon: 'people',
      name: 'Manajemen Pengguna',
      link: '/admin/users'
    },
    {
      icon: 'folder',
      name: 'Referensi - referensi',
      hasSubmenu: true,
      expanded: false,
      submenuItems: [
        { name: 'Referensi Kompetensi', link: '/admin/references/competency' },
        { name: 'Referensi Direktorat', link: '/admin/references/directorate' },
        { name: 'Referensi Jabatan', link: '/admin/references/position' }
      ]
    },
    {
      icon: 'login',
      name: 'Login As',
      link: '/admin/login-as'
    },
    {
      icon: 'history',
      name: 'Aktivitas Pengguna',
      link: '/admin/activity'
    }
  ];

  mentoringMenuItems = [
    {
      icon: 'supervisor_account',
      name: 'Mentor Tetap',
      link: '/mentoring/permanent'
    },
    {
      icon: 'person_off',
      name: 'Mentor Tidak Tetap',
      link: '/mentoring/temporary'
    },
    {
      icon: 'description',
      name: 'Form IDP',
      hasSubmenu: true,
      expanded: false,
      submenuItems: [
        { name: 'Form IDP Baru', link: '/mentoring/form-idp/new' },
        { name: 'Daftar Form IDP', link: '/mentoring/form-idp/list' }
      ]
    },
    {
      icon: 'book',
      name: 'Jurnal Mentoring',
      link: '/mentoring/journal'
    }
  ];

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidebar.emit(this.isExpanded);

    // If sidebar is collapsed, collapse all submenus only if we're collapsing the sidebar
    // We leave submenus as they are if we're expanding the sidebar
    if (!this.isExpanded) {
      // Do not automatically collapse submenus when sidebar is collapsed
      // We'll handle this with hover functionality instead
    }
  }

  toggleSubmenu(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();

    // In collapsed mode, expand the sidebar if clicking a menu with submenu
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.toggleSidebar.emit(this.isExpanded);

      // Add small delay to ensure sidebar expands first before showing submenu
      setTimeout(() => {
        item.expanded = true;
      }, 300);
    } else {
      // Normal toggle in expanded mode
      item.expanded = !item.expanded;
    }
  }
}
