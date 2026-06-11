import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { finalize } from 'rxjs';
import { JalaliDatePipe } from "../../../../shared/pipes/jalali-date.pipe";

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [JalaliDatePipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

    constructor(private userService: UserService) {
    // افکت به تغییرات سیگنال‌ها گوش می‌دهد
    effect(() => {
      const id = this.userId(); 
      if (id && id.length > 0) {
        this.loadUserDetails(id);
      } else {
        this.user.set(null); // اگر آیدی خالی شد، جزئیات قبلی پاک شود
      }
    }, { allowSignalWrites: true });
  }

  userId = input<string | null>(null);
  user = signal<User | null>(null);
  loading = signal(false);
  deleteUserDetailUserId = output<string>();

  loadUserDetails(userId : string):void{
    this.loading.set(true);

    this.userService
      .getAllUsers(1, 1, '', `userId=${userId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success && response.data.items.length > 0) {
            this.user.set(response.data.items[0]);
          } else {
            this.user.set(null);
          }
        },
        error: (error) => {
          console.error('خطا در دریافت کاربر', error);
        },
      });
  }


  deleteUserDetails(){
    if (!this.user()) return;
    this.deleteUserDetailUserId.emit(this.user()!.userId);
  }

}
