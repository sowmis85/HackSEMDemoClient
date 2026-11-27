import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventRegistrationService } from '../services/event-registration.service';
import { EventService } from '../../events/services/event.service';
import { EventModel } from '../../events/models/event.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink  
  ],
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.scss']
})
export class EventRegistrationComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  private readonly registrationService = inject(EventRegistrationService);
  private readonly destroyRef = inject(DestroyRef);
   private readonly authService = inject(AuthService);

  registrationSuccess = signal(false);
  registrationId = signal('');
  workflowId = signal('');
  registrationError = signal<string | null>(null);
  readonly event = signal<EventModel | null>(null);  

  isLoading = true;

  registrationForm = this.formBuilder.group({
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
    if (eventFromState) {
      this.event.set(eventFromState);
      this.isLoading = false;
      return;
    }

    const eventId =
      this.route.snapshot.paramMap.get('eventId');

    if (!eventId) {
      this.isLoading = false;
      return;
    }
  
    this.eventService
      .getEventById(eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

    const userId = this.authService.getUserId();

    if (!userId) {
      void this.router.navigate(['/login']);
      return;
    }


    const request = {      
      attendeeName: this.registrationForm.value.attendeeName!,
      attendeeEmail: this.registrationForm.value.attendeeEmail!,
      quantity: this.registrationForm.value.quantity!,
      createdBy: userId
    };

    
   this.registrationService
  .register(this.event()!.eventId, request)
  .pipe(takeUntilDestroyed(this.destroyRef))
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
