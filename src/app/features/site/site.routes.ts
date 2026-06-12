import { Routes } from '@angular/router';

export const SiteRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  }, 
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about-us/about-us.component').then((m) => m.AboutUsComponent),
  },
  { path: '', redirectTo: '', pathMatch: 'full' }
];
