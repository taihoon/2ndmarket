import { type Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';


export const PREFERENCE_ROUTES: Routes = [
  {
    path: 'preference',
    loadComponent: () => import('./preference/preference.component').then(c => c.PreferenceComponent),
    canActivate: [authGuard],
  },
  {
    path: 'preference/messages',
    loadComponent: () => import('./preference-messages/preference-messages.component').then(c => c.PreferenceMessagesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'preference/favorites',
    loadComponent: () => import('./preference-favorites/preference-favorites.component').then(c => c.PreferenceFavoritesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'preference/favorites/:productId',
    loadComponent: () => import('../products/products-detail/products-detail.component').then(c => c.ProductsDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'preference/products',
    loadComponent: () => import('./preference-products/preference-products.component').then(c => c.PreferenceProductsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'preference/products/:productId',
    loadComponent: () => import('../products/products-detail/products-detail.component').then(c => c.ProductsDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'preference/user',
    loadComponent: () => import('./preference-user/preference-user.component').then(c => c.PreferenceUserComponent),
    canActivate: [authGuard]
  }
];
