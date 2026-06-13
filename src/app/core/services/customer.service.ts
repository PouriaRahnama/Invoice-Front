import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { PaginationResponse } from '../models/pagination-response.model';
import { Customer } from '../models/customer.model';
import { CreateCustomer } from '../models/CreateCustomer.model';
import { UpdateCustomer } from '../models/UpdateCustomer.model';


@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private api: ApiService) {}
  private readonly endpoint = 'Customer';

  getAllCustomers(
    page: number = 1,
    pageSize: number = 8,
    orderBy: string = '',
    filter: string = '',
  ): Observable<ApiResponse<PaginationResponse<Customer>>> {
    return this.api.get<ApiResponse<PaginationResponse<Customer>>>(
      `${this.endpoint}/GetAll?Page=${page}&PageSize=${pageSize}&OrderBy=${orderBy}&Filter=${filter}`,
    );
  }

  getByCustomertId(customertId: string): Observable<ApiResponse<Customer>> {
    return this.api.get<ApiResponse<Customer>>(
      `${this.endpoint}/GetById?customerId=${customertId}`,
    );
  }

  createCustomer(createCustomer: CreateCustomer): Observable<ApiResponse<string>> {
    return this.api.post<ApiResponse<any>>(`${this.endpoint}/Create`, createCustomer);
  }

  UpdateCustomer(updateCustomer: UpdateCustomer): Observable<ApiResponse<string>> {
    return this.api.post<ApiResponse<any>>(`${this.endpoint}/Update`, updateCustomer);
  }

}
