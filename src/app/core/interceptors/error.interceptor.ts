import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorData = error.error;

        switch (error.status) {
          case 400:
            if (errorData?.data && typeof errorData.data === 'object') {
              Object.keys(errorData.data).forEach((key) => {
                const messages = errorData.data[key];
                if (Array.isArray(messages)) {
                  messages.forEach((msg) => this.toastr.error(msg, 'خطای ورودی'));
                }
              });
            } 
            else {
                this.toastr.error(errorData?.message || 'درخواست نامعتبر است.', 'خطا');
            }
            break;

          case 401:
                this.toastr.warning('جلسه کاری شما به پایان رسیده است. لطفا مجدد وارد شوید.', 'عدم دسترسی');
            break;

          case 404:
                this.toastr.error(errorData?.message || 'منبع مورد نظر یافت نشد.', 'خطا ۴۰۴');
            break;

          case 500:
                this.toastr.error('خطایی در سمت سرور رخ داده است. لطفاً بعداً تلاش کنید.', 'خطای سرور');
            break;

          default:
                this.toastr.error('خطای غیرمنتظره‌ای رخ داد.', 'خطا');
            break;
        }

        return throwError(() => error);
      })
    );
  }
}
