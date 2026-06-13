import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, EMPTY, map, Observable, ReplaySubject, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { register } from '../models/register.model';
import { login } from '../models/login.model';
import { token } from '../models/token.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api:ApiService) {}

  private readonly endpoint = 'User'; 

  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly accessTokenExpiresKey = 'accessTokenExpires';

  private currentUserSource = new BehaviorSubject<User | null>(null);;
  currentUser$ = this.currentUserSource.asObservable();

  get currentUserValue() {
    return this.currentUserSource.value;
  } 

  register(register: register): Observable<ApiResponse<boolean>> {
    return this.api.post<ApiResponse<boolean>>(`${this.endpoint}/Register`, register);
  }

  login(login: login): Observable<ApiResponse<token>> {
    return this.api.post<ApiResponse<token>>(`${this.endpoint}/Login`, login);
  }

  logoutUser(refreshToken:string): Observable<ApiResponse<string>> {
    return this.api.post<ApiResponse<string>>(`${this.endpoint}/Logout`, {refreshToken});
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<token>> {
    return this.api.post<ApiResponse<token>>(`${this.endpoint}/GenerateNewToken`, {refreshToken});
  }

  logout():void {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.currentUserSource.next(null);
    return;
    }

    this.logoutUser(refreshToken)
      .subscribe({
        next: () => {
          this.clearTokens();
          this.currentUserSource.next(null);
        },
        error: (err) => {
          this.clearTokens();
          this.currentUserSource.next(null);
          console.log(err.error.data)
        }
      });

}

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.api.get<ApiResponse<User>>(`${this.endpoint}/GetCurrentUser`);
  }

  loadCurrentUser(): Observable<ApiResponse<User>> {
    const token = this.getAccessToken();
    if (token) {
      return this.getCurrentUser().pipe(
        tap((response) => {
          if (response.success) {
            this.setCurrentUser(response.data);
          } else {
            this.setCurrentUser(null);
          }
        }),
      );
    }
    else{
      return EMPTY;
    }
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSource.next(user);
  }

  saveTokens(token:token): void {
    localStorage.setItem(this.accessTokenKey, token.accessToken);
    localStorage.setItem(this.refreshTokenKey, token.refreshToken);
    localStorage.setItem(this.accessTokenExpiresKey, token.accessTokenExpires);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.accessTokenExpiresKey);
    this.currentUserSource.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getAccessTokenExpires(): string | null {
    return localStorage.getItem(this.accessTokenExpiresKey);
  }

}
