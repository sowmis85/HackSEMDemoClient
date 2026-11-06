import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { EventListComponent } from './features/events/event-list/event-list.component';

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
    path: 'events',
    component: EventListComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
