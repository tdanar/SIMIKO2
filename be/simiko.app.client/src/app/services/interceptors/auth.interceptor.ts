import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Clone the request and add the token to the Authorization header
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      // Handle the response to catch 401 errors
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Check if error is 401 Unauthorized (token expired or invalid)
          if (error.status === 401) {
            // Call the logout method from AuthService to clean up the session
            this.authService.logout();
          }
          return throwError(error);
        })
      );
    }

    // If no token, proceed with the original request
    return next.handle(request);
  }
}
