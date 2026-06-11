import { Routes } from '@angular/router';

export const AdminRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/user-list/user-list.component').then(m => m.UserListComponent)
  },  
  {
    path: 'products',
    loadComponent: () => import('./pages/products/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  { 
    path: 'products/create',
    loadComponent: () => import('./pages/products/product-form/product-form.component').then(m => m.ProductFormComponent)
  }, 
  { 
    path: 'products/edit/:id',
    loadComponent: () => import('./pages/products/product-form/product-form.component').then(m => m.ProductFormComponent)
  } ,
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
