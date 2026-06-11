import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../../core/services/product.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  
  productForm!: FormGroup;
  isSubmitting: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  selectedFileName: string = '';

  constructor(private fb: FormBuilder,
    private productService:ProductService,
    private router: Router,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]]
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
      if (this.selectedFile) {
        formData.append('Image', this.selectedFile);
      }

      this.isSubmitting = true;

      this.productService.createProduct(formData)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
        next: (res) => {
          this.toastr.success(res.message || 'محصول با موفقیت ایجاد شد.', 'موفق');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
           const message = err?.error?.message || 'خطایی در ایجاد محصول رخ داده است.';
           this.toastr.error(message, 'خطا');
        }
      });   
    } else {
      this.productForm.markAllAsTouched(); 
    }
  }

}
