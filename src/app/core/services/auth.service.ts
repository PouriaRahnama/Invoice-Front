import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { register } from '../models/register.model';
import { login } from '../models/login.model';
import { token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api:ApiService) { }
  private readonly endpoint = 'User'; 

  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly accessTokenExpiresKey = 'accessTokenExpires';

  register(register: register): Observable<ApiResponse<boolean>> {
    return this.api.post<ApiResponse<any>>(`${this.endpoint}/Register`, register);
  }

  login(login: login): Observable<ApiResponse<token>> {
    return this.api.post<ApiResponse<token>>(`${this.endpoint}/Login`, login);
  }

  saveTokens(token:token): void {
    localStorage.setItem(this.accessTokenKey, token.accessToken);
    localStorage.setItem(this.refreshTokenKey, token.refreshToken);
    localStorage.setItem(this.accessTokenExpiresKey, token.accessTokenExpires);
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.accessTokenExpiresKey);
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

  isLoggedIn(): boolean {
    return this.getAccessToken() == null ? true : false;
  }



}
