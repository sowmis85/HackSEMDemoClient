import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { CreateAccountComponent } from './features/registration/create-account/create-account.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'events',
    component: EventListComponent
  },
   {
    path: 'register',
    component: CreateAccountComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
