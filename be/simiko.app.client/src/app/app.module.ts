import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './middlewares/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './components/shared/shared.module';
import { PeriodeFormComponent } from './components/periode/periode-form.component';
import { PeriodeListComponent } from './components/periode/periode-list.component';
import { AuthService } from './services/auth.service';

// Function to initialize app and check token validity
export function initializeApp(authService: AuthService) {
  return () => {
    // Only verify if token exists
    const token = localStorage.getItem('token');
    if (token) {
      return authService.verifyToken().then(isValid => {
        if (!isValid) {
          authService.logout();
        }
        return true;
      }).catch(() => {
        authService.logout();
        return false;
      });
    }
    return Promise.resolve(true);
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PeriodeListComponent,
    PeriodeFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // Initialize the app with token validation
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
