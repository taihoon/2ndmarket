import { Routes } from '@angular/router';
import { AUTH_ROUTES } from '@app/pages/auth/auth-routes';
import { MESSAGES_ROUTES } from '@app/pages/messages/messages-routes';
import { PREFERENCE_ROUTES } from '@app/pages/preference/preference-routes';
import { PRODUCTS_ROUTES } from '@app/pages/products/products-routes';
import { TabComponent } from '@app/tab.component';
import { TestComponent } from '@app/pages/test/test.component';


export const routes: Routes = [
    ...AUTH_ROUTES,
  {
    path: '',
    component: TabComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products'
      },
      ...PRODUCTS_ROUTES,
      ...MESSAGES_ROUTES,
      ...PREFERENCE_ROUTES,
      {
        path: 'test/:productId',
        component: TestComponent
      }
    ]
  }
];

