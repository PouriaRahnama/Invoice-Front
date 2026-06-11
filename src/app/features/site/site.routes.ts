import { Routes } from '@angular/router';

export const SiteRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  { path: '', redirectTo: '', pathMatch: 'full' }
];
