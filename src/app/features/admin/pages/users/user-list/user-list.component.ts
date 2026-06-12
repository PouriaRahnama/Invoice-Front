import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../../../../core/services/user.service';
import { User } from '../../../../../core/models/user.model';
import { PaginationComponent } from "../../../../../shared/components/pagination/pagination.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs';
import { UserDetailsComponent } from "../../../components/user-details/user-details.component";
import { JalaliDatePipe } from "../../../../../shared/pipes/jalali-date.pipe";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [PaginationComponent, ReactiveFormsModule, UserDetailsComponent, JalaliDatePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  
  searchForm!: FormGroup;
  
  constructor(private fb: FormBuilder,private userService:UserService) {}

  users = signal<User[]>([]);
  loading = signal(false);
  totalCount = signal(0);
  totalPages = signal(0);
  page = signal(1);
  pageSize = signal(4);
  selectedUserId = signal<string | null>(null);

  setselectedUserId(userId:string):void{
    this.selectedUserId.set(userId)
  }

  setNotselectedUserId(userId:string):void{
      if (this.selectedUserId() === userId) {
        this.selectedUserId.set(null);
      }
  }

  ngOnInit(): void {

    this.searchForm = this.fb.group({
      username: [''],
      phone: ['']
    })

    this.loadUsers();

    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.page.set(1);
      this.loadUsers();
    });
  }

  changePage(newPage: number): void {
    this.page.set(newPage); 
    this.loadUsers();      
  }

  loadUsers():void{ 
      this.loading.set(true);

      const username = this.searchForm.get('username')?.value?.trim();
      const phone = this.searchForm.get('phone')?.value?.trim();
      let filters: string[] = [];

      if (username) {
        filters.push(`username=${username}`);
      }
      if (phone) {
        filters.push(`phone=${phone}`);
      }
      const filter = filters.join(',');

    this.userService.getAllUsers(this.page(), this.pageSize(),'',filter)
    .pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.users.set(response.data.items);
          this.totalCount.set(response.data.totalCount);
          this.totalPages.set(response.data.totalPages);
        }
      },
      error: (error) => {
        console.error('خطا در دریافت کاربران', error);
      }
    });   
  }

  clearFilters(): void {
    this.searchForm.reset();
  }

}
