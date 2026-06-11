import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateAmount',
  standalone: true
})
export class SeparateAmountPipe implements PipeTransform {

  transform(value: number | string, suffix: string = 'تومان'): string {
    if (value === null || value === undefined) return '';

    // تبدیل به عدد و سپس فرمت‌دهی سه‌رقم سه‌رقم
    const amount = Number(value);
    if (isNaN(amount)) return value.toString();

    const formatted = amount.toLocaleString('en-US'); // جدا کردن با کاما

    return `${formatted} ${suffix}`;
  }

}
