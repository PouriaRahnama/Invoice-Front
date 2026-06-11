import { Routes } from '@angular/router';
import { SiteLayoutComponent } from './layouts/site/site-layout/site-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/site/site.routes').then(m => m.SiteRoutes)
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.AdminRoutes)
      },
    ]
  },
{ path: '**', redirectTo: '' }
];
