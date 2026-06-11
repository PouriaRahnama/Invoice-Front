import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginationResponse } from '../models/pagination-response.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api:ApiService) { }
  private readonly endpoint = 'User'; 


  getAllUsers(page: number = 1,
    pageSize: number = 8,
    orderBy: string = '',
    filter: string = ''): Observable<ApiResponse<PaginationResponse<User>>> {
    return this.api.get<ApiResponse<PaginationResponse<User>>>(
    `${this.endpoint}/GetAll?Page=${page}&PageSize=${pageSize}&OrderBy=${orderBy}&Filter=${filter}`
    );
  }


}
