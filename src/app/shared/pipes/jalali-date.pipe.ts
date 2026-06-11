import { Pipe, PipeTransform } from '@angular/core';
import * as jalaali from 'jalaali-js';

@Pipe({
  name: 'persianDate',
  standalone: true
})
export class JalaliDatePipe implements PipeTransform {

  transform(value: string | Date | null | undefined,showTime: boolean = false): string {
    if (!value) return '';

    const date = new Date(value);

    if (isNaN(date.getTime())) return '';

    const jDate = jalaali.toJalaali(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );

    const year = jDate.jy;
    const month = String(jDate.jm).padStart(2, '0');
    const day = String(jDate.jd).padStart(2, '0');

    if (showTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}/${month}/${day} - ${hours}:${minutes}`;
    }

    return `${year}/${month}/${day}`;
  }

}
