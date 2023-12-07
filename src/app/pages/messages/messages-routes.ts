import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';
import { MessagesComponent } from '@app/pages/messages/messages/messages.component';


export const MESSAGES_ROUTES: Routes = [
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [authGuard]
  }
];
