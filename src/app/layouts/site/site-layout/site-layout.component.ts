import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { SiteHeaderComponent } from "../components/site-header/site-header.component";
import { SiteFooterComponent } from "../components/site-footer/site-footer.component";

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css'
})
export class SiteLayoutComponent {

}
