import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { register } from '../../../../core/models/register.model';
import { FieldErrorComponent } from "../../../../shared/validators/field-error/field-error.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FieldErrorComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,   
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
      
      this.isSubmitting = true;
       const model: register = this.registerForm.value;
       this.authService.register(model)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (res) => {
            this.toastr.success(
              res.message || 'حساب کاربری با موفقیت ایجاد شد',
              'موفق',
            );
            this.router.navigate(['/']);
          },
          error: (err) => {
            const message = err?.error?.message || 'خطایی رخ داده است.';
            this.toastr.error(message, 'خطا');
          },
        });  

  }

}
