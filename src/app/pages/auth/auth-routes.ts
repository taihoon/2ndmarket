import { type Routes } from '@angular/router';


export const AUTH_ROUTES: Routes = [
  {
    path: 'auth/group-select',
    loadComponent: () => import('./group-select/group-select.component').then(c => c.GroupSelectComponent),
  },
  {
    path: 'auth/group-verification/:verificationId',
    loadComponent: ()  => import('./group-verification/group-verification.component').then(c => c.GroupVerificationComponent),
  }
];
