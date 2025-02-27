import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/shared/layout/layout.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect default ke login
      // Add more routes as needed
      { path: 'rekap-nilai', component: DashboardComponent },
      { path: 'cetak-form', component: DashboardComponent },
      { path: 'jabatan-target', component: DashboardComponent },
      { path: 'rekam-assessment', component: DashboardComponent },
      { path: '**', redirectTo: '/dashboard' }
    ]
  }
   
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
