import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { CreateAccountComponent } from './features/registration/create-account/create-account.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { EventDetailsComponent } from './features/events/event-details/event-details.component';
import { EventRegistrationComponent } from './features/registration/event-registration/event-registration.component';
import { TaskWorkflowComponent } from './features/workflow/task-workflow.component';
import { MyRegistrationsComponent } from './features/registration/my-registrations/my-registration.component';
import { EventManagementComponent } from './features/events/event-management/event-management.component';
import { CreateEventComponent } from './features/events/create-event/create-event.component';
import {EditEventComponent} from './features/events/edit-event/edit-event.component';

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
    path: 'events/create',
    component: CreateEventComponent
  },
   {
    path: 'events/edit/:eventId',
    component: EditEventComponent
  },
   {
    path: 'events/:eventId',
    component: EventDetailsComponent
  },
  {
  path: 'registration/:eventId',
  component: EventRegistrationComponent
  },
  {
    path: 'register',
    component: CreateAccountComponent
  },
  {
    path: 'workflow/:workflowId',
    component: TaskWorkflowComponent
  },
  {
    path: 'my-registrations',
    component: MyRegistrationsComponent
  },
  {
    path: 'event-management',
    component: EventManagementComponent
  },  
  {
    path: '**',
    redirectTo: 'login'
  }
];
