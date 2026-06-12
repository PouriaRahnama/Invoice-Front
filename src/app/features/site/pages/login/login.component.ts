import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { FieldErrorComponent } from "../../../../shared/validators/field-error/field-error.component";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FieldErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    loginForm!: FormGroup;
    isSubmitting = false;
  
    constructor(private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,   
      private toastr: ToastrService) {}
  
    ngOnInit(): void {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }


  onSubmit(): void {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  this.authService.login(this.loginForm.value)
    .pipe(finalize(() => this.isSubmitting = false))
    .subscribe({
      next: (res) => {

        const tokenData = res.data;
        this.authService.saveTokens(tokenData);
        this.toastr.success(res.message || 'ورود موفقیت آمیز بود','موفق');
        this.router.navigate(['/']);

      },
      error: (err) => {
        const message = err?.error?.message || 'خطا در ورود';
        this.toastr.error(message,'خطا');
      }
    });
  }

}
