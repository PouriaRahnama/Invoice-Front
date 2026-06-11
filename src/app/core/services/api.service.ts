import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient:HttpClient) { 
  }
  public baseUrlForImages ='https://localhost:7097';
  private baseUrl = 'https://localhost:7097/api';

  get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}/${url}`);
  }

  post<T>(url: string, data: any): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}/${url}`, data);
  }
  
}
