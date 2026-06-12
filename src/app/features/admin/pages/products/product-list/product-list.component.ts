import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../../core/services/product.service';
import { Product } from '../../../../../core/models/product.model';
import { debounceTime, finalize } from 'rxjs';
import { PaginationComponent } from "../../../../../shared/components/pagination/pagination.component";
import { JalaliDatePipe } from "../../../../../shared/pipes/jalali-date.pipe";
import { ApiService } from '../../../../../core/services/api.service';
import { SeparateAmountPipe } from "../../../../../shared/pipes/separate-amount.pipe";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [PaginationComponent, JalaliDatePipe, ReactiveFormsModule, SeparateAmountPipe, ModalComponent,RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  
  searchForm!: FormGroup;
  baseUrl!: string;

  products = signal<Product[]>([]);
  loading = signal(false);
  totalCount = signal(0);
  totalPages = signal(0);
  page = signal(1);
  pageSize = signal(5);
  selectedProduct: Product | null = null;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private apiService:ApiService
  ) {}

  ngOnInit(): void {
    this.baseUrl = this.apiService.baseUrlForImages;
    
    this.searchForm = this.fb.group({
      name: [''],
      code: [''],
    });

    this.loadProducts();

    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.page.set(1);
      this.loadProducts();
    });
  }
  
  loadProducts(): void {
    this.loading.set(true);

    const name = this.searchForm.get('name')?.value?.trim();
    const code = this.searchForm.get('code')?.value?.trim();
    let filters: string[] = [];

    if (name) {
      filters.push(`name=${name}`);
    }
    if (code) {
      filters.push(`code=${code}`);
    }
    const filter = filters.join(',');

    this.productService
      .getAllProducts(this.page(), this.pageSize(), '', filter)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.products.set(response.data.items);
            this.totalCount.set(response.data.totalCount);
            this.totalPages.set(response.data.totalPages);
          }
        },
        error: (error) => {
          console.error('خطا در دریافت محصولات', error);
        },
      });
  }

  changePage(newPage: number): void {
    this.page.set(newPage);
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchForm.reset();
  }

  openDetails(product: Product) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }
}
