import { Component, signal } from '@angular/core';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { JalaliDatePipe } from '../../../../../shared/pipes/jalali-date.pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SeparateAmountPipe } from '../../../../../shared/pipes/separate-amount.pipe';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { RouterLink } from '@angular/router';
import { Customer } from '../../../../../core/models/customer.model';
import { ApiService } from '../../../../../core/services/api.service';
import { CustomerService } from '../../../../../core/services/customer.service';
import { debounceTime, finalize } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [PaginationComponent, JalaliDatePipe, ReactiveFormsModule, SeparateAmountPipe, ModalComponent,RouterLink],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
  searchForm!: FormGroup;
  baseUrl!: string;

  Customers = signal<Customer[]>([]);
  loading = signal(false);
  totalCount = signal(0);
  totalPages = signal(0);
  page = signal(1);
  pageSize = signal(5);
  selectedCustomer: Customer | null = null;
  
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private apiService:ApiService
  ) {}

  ngOnInit(): void {
    this.baseUrl = this.apiService.baseUrlForImages;
    
    this.searchForm = this.fb.group({
      fullName: [''],
      phone: [''],
    });

    this.loadCustomers();

    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.page.set(1);
      this.loadCustomers();
    });
  }
  
  loadCustomers(): void {
    this.loading.set(true);

    const fullName = this.searchForm.get('fullName')?.value?.trim();
    const phone = this.searchForm.get('phone')?.value?.trim();
    let filters: string[] = [];

    if (fullName) {
      filters.push(`FullName=${fullName}`);
    }
    if (phone) {
      filters.push(`Phone=${phone}`);
    }
    const filter = filters.join(',');

    this.customerService
      .getAllCustomers(this.page(), this.pageSize(), '', filter)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.Customers.set(response.data.items);
            this.totalCount.set(response.data.totalCount);
            this.totalPages.set(response.data.totalPages);
          }
        },
        error: (error) => {
          console.error('خطا در دریافت مشتریان', error);
        },
      });
  }

  changePage(newPage: number): void {
    this.page.set(newPage);
    this.loadCustomers();
  }

  clearFilters(): void {
    this.searchForm.reset();
  }

  openDetails(customer: Customer) {
    this.selectedCustomer = customer;
  }

  closeModal() {
    this.selectedCustomer = null;
  }
}
