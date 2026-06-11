import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isSidebarOpen = signal(true);

  toggleSidebar() {
    this.isSidebarOpen.update(state => !state);
  }
}