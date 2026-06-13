import { Injectable } from '@angular/core';
import {HttpErrorResponse,HttpEvent,HttpHandler,HttpInterceptor,HttpRequest} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  constructor(private authService: AuthService,private router: Router) {}

  intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.isAuthRequest(request)) {
      return next.handle(request);
    }

    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      return next.handle(request);
    }

    const authRequest = this.addTokenToRequest(request, accessToken);
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          return this.handleUnauthorizedError(authRequest, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {

    const refreshToken = this.authService.getRefreshToken();

   if (!refreshToken) {
      this.logoutAndRedirect();
      return throwError(() => new Error('Refresh token not found'));
    }

    if (this.isRefreshing) {
      return throwError(() => new Error('Refresh token is already in progress'));
    }

    this.isRefreshing = true;

    return this.authService.refreshToken(refreshToken).pipe(
      switchMap((response) => {

        if (!response.success || !response.data) {
          this.logoutAndRedirect();
          return throwError(() => new Error('Refresh token failed'));
        }

        this.authService.saveTokens(response.data);
        const newRequest = this.addTokenToRequest(request,response.data.accessToken);
        return next.handle(newRequest);
      }),

      catchError((error) => {
        this.logoutAndRedirect();
        return throwError(() => error);
      }),finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>,token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private logoutAndRedirect(): void {
    this.authService.clearTokens();
    this.router.navigate(['/login']);
  }


  private isAuthRequest(request: HttpRequest<any>): boolean {
    return (
      request.url.includes('/api/User/Login') ||
      request.url.includes('/api/User/Register') ||
      request.url.includes('/api/User/GenerateNewToken')
    );
  }
}