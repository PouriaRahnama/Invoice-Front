import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../../core/services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../../../../../core/models/api-response.model';
import { ApiService } from '../../../../../core/services/api.service';
import { FieldErrorComponent } from "../../../../../shared/validators/field-error/field-error.component";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FieldErrorComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  
  productForm!: FormGroup;
  isSubmitting: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  selectedFileName: string = '';
  productId: string | null = null;
  isEditMode: boolean = false;
  currentImageUrl: string | null = null; 

  constructor(private fb: FormBuilder,
    private productService:ProductService,
    private apiService:ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = idParam;
      this.loadProductForEdit();
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]] 
    });
  }

  private loadProductForEdit(): void {
    if (!this.productId) return;

    this.isSubmitting = true;
    this.productService.getByProductId(this.productId)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {       
          this.productForm.patchValue({
            name: res.data.name,
            price: res.data.price,
            quantity: res.data.quantity
          });

          this.currentImageUrl = res.data.imagePath || null;
          this.imagePreview = this.apiService.baseUrlForImages + this.currentImageUrl;
        },
        error: (err) => {
          const message = err?.error?.message || 'خطا در بارگذاری اطلاعات محصول.';
          this.toastr.error(message, 'خطا');
          this.router.navigate(['/admin/products']);
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedImage(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.productForm.value.name.toString());
      formData.append('Price', this.productForm.value.price);
      formData.append('Quantity', this.productForm.value.quantity);
      if (this.selectedFile) {formData.append('Image', this.selectedFile);}
      this.isSubmitting = true;

      let request : Observable<ApiResponse<any>>;
      if(this.isEditMode && this.productId)
      {
        formData.append('ProductId', this.productId.toString());
        request = this.productService.UpdateProduct(formData)
      }
      else{
        request = this.productService.createProduct(formData)
      }

      request.pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
        next: (res) => {
          this.toastr.success(res.message || 'محصول با موفقیت ایجاد شد.', 'موفق');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
           const message = err?.error?.message || 'خطایی رخ داده است.';
           this.toastr.error(message, 'خطا');
        }
      });  

    } 
    else {
      this.productForm.markAllAsTouched(); 
    }
  }

}
