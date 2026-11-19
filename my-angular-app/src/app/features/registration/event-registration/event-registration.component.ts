import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventRegistrationService } from '../services/event-registration.service';
import { EventService } from '../../events/services/event.service';
import { EventModel } from '../../events/models/event.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.scss']
})
export class EventRegistrationComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  private readonly registrationService = inject(EventRegistrationService);

  registrationSuccess = signal(false);
  registrationId = signal('');
  workflowId = signal('');
  registrationError = signal<string | null>(null);
  readonly event = signal<EventModel | null>(null);

  isLoading = true;

  registrationForm = this.fb.group({
    attendeeName: ['', Validators.required],
    attendeeEmail: ['', [Validators.required, Validators.email]],
    quantity: [1, [Validators.required, Validators.min(1)]]    
  });

    ngOnInit(): void {
    this.loadEvent();
  }
  private loadEvent(): void {

   let eventFromState: EventModel | undefined;

    if (typeof window !== 'undefined') {
    eventFromState =
        history.state?.event as EventModel;
    }

    // Event available from navigation state
    if (eventFromState) {
      this.event.set(eventFromState);
      this.isLoading = false;
      return;
    }

    // Refresh scenario
    const eventId =
      this.route.snapshot.paramMap.get('eventId');

    if (!eventId) {
      this.isLoading = false;
      return;
    }

    this.eventService
      .getEventById(eventId)
      .subscribe({
        next: (response: EventModel) => {
          this.event.set(response);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }
    clearForm(): void {
      this.registrationForm.reset({
        attendeeName: '',
        attendeeEmail: '',
        quantity: 1
      });
      this.registrationError.set(null);
    } 
   submit(): void {

     this.registrationError.set(null);

     if (this.registrationForm.invalid || !this.event()) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const request = {      
      attendeeName: this.registrationForm.value.attendeeName!,
      attendeeEmail: this.registrationForm.value.attendeeEmail!,
      quantity: this.registrationForm.value.quantity!
    };

    
   this.registrationService
  .register(this.event()!.eventId, request)
  .subscribe({
    next: response => {
      if (response.success === false) {
        this.registrationError.set(response.message ?? 'Registration failed.');
        return;
      }

      this.registrationId.set(response.registrationId);
      this.workflowId.set(response.workflowInstanceId);
      this.registrationSuccess.set(true);
    },
    error: (err: HttpErrorResponse) => {
         if (err.status === 401) {
        this.registrationError.set(
          'Not authorised to register the event'
        );
        return;
      }
      const body = err.error as { message?: unknown } | null;
      console.log(body?.message);
      this.registrationError.set(
        typeof body?.message === 'string'
          ? body.message
          : 'Registration failed. Please try again.'
      );
    }
  });
  }
}