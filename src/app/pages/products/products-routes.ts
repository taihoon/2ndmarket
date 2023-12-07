import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';
import { ProductsComponent } from './products/products.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';


export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products/:productId',
    component: ProductsDetailComponent
  },
  {
    path: 'products/:productId/chattings',
    loadComponent: () =>
      import ('./product-chattings/product-chattings.component').then(c => c.ProductChattingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'products/new/edit',
    loadComponent: () =>
      import('./products-write/products-write.component').then(c => c.ProductsWriteComponent),
    canActivate: [authGuard]
  },
  {
    path: 'products/:productId/edit',
    loadComponent: () =>
      import('./products-edit/products-edit.component').then(c => c.ProductsEditComponent),
    canActivate: [authGuard]
  }
];
