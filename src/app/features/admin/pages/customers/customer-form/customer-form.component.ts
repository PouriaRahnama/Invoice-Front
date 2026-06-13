import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../core/services/customer.service';
import { ApiService } from '../../../../../core/services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FieldErrorComponent } from '../../../../../shared/validators/field-error/field-error.component';
import { finalize, Observable } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api-response.model';
import { CreateCustomer } from '../../../../../core/models/CreateCustomer.model';
import { UpdateCustomer } from '../../../../../core/models/UpdateCustomer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FieldErrorComponent],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent {
  customerForm!: FormGroup;
  isSubmitting: boolean = false;
  customerId: string | null = null;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder,
    private customerService:CustomerService,
    private apiService:ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('customerId');
    if (idParam) {
      this.isEditMode = true;
      this.customerId = idParam;
      this.loadCustomerForEdit();
    }
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      address: [''] 
    });
  }

  private loadCustomerForEdit(): void {
    if (!this.customerId) return;

    this.isSubmitting = true;
    this.customerService.getByCustomertId(this.customerId)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {       
          this.customerForm.patchValue({
            fullname: res.data.fullName,
            phone: res.data.phone,
            address: res.data.address
          });
        },
        error: (err) => {
          this.router.navigate(['/admin/customers']);
        }
      });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.isSubmitting = true;

      let request : Observable<ApiResponse<string>>;
      if(this.isEditMode && this.customerId)
      {
        const model: UpdateCustomer = this.customerForm.value;
        model.customerId = this.customerId.toString();
        request = this.customerService.UpdateCustomer(model)
      }
      else{
        const model: CreateCustomer = this.customerForm.value;
        request = this.customerService.createCustomer(model)
      }

      request.pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
        next: (res) => {
          this.toastr.success(res.message || 'مشتری با موفقیت ایجاد شد.', 'موفق');
          this.router.navigate(['/admin/customers']);
        },
        error: (err) => {
        }
      });  

    } 
    else {
      this.customerForm.markAllAsTouched(); 
    }
  }

}
