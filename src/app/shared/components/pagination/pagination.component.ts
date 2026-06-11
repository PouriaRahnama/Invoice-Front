import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  page = input<number>(0);
  pageSize = input<number>(0);
  totalCount = input<number>(0);
  totalPages = input<number>(0);
  pageChange = output<number>();


  pages = computed(() => {
    return Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    );
  });

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    if (page === this.page()) return;

    this.pageChange.emit(page);
  }
  
}
