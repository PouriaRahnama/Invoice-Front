import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AdminFooterComponent } from "../components/admin-footer/admin-footer.component";
import { AdminSidebarComponent } from "../components/admin-sidebar/admin-sidebar.component";
import { AdminHeaderComponent } from "../components/admin-header/admin-header.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminFooterComponent, AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  constructor() {   
  }
  
}
