import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { PaginationResponse } from '../models/pagination-response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private api:ApiService) { }
  private readonly endpoint = 'Product'; 

    getAllProducts(page: number = 1,
      pageSize: number = 8,
      orderBy: string = '',
      filter: string = ''): Observable<ApiResponse<PaginationResponse<Product>>> {
      return this.api.get<ApiResponse<PaginationResponse<Product>>>(
      `${this.endpoint}/GetAll?Page=${page}&PageSize=${pageSize}&OrderBy=${orderBy}&Filter=${filter}`
      );
    }
    
    createProduct(formData: FormData): Observable<ApiResponse<any>> {
       return this.api.post<ApiResponse<any>>(`${this.endpoint}/Create`, formData);
    }

}
