import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { MyRegistrationService } from '../services/my-registration.service';
import { AuthService } from '../../auth/services/auth.service';
import { UserRegistration } from '../models/user-registration.model';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-registration.component.html',
  styleUrls: ['./my-registration.component.scss']
})
export class MyRegistrationsComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);
  private readonly router=inject (Router);
  private readonly myRegistrationService =inject (MyRegistrationService);

  registrations: UserRegistration[] = [];

  totalRegistrations = 0;
  confirmedCount = 0;
  cancelledCount = 0; 

  ngOnInit(): void {
    this.loadRegistrations();
  }

  private loadRegistrations(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      void this.router.navigate(['/login']);
      return;
    }

    this.myRegistrationService
      .getMyRegistrations(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.registrations = data;          
          this.totalRegistrations = data.length;
          this.confirmedCount =
            data.filter(x => x.status === 'Confirmed').length;
          this.cancelledCount =
            data.filter(x => x.status === 'Cancelled').length;
          this.changeDetectorRef.markForCheck();
        },
        error: error => console.error('Failed to load registrations.', error)
      });
  }

  editRegistration(registration: UserRegistration): void {
    this.router.navigate(['/events', registration.eventId]);
  }
  cancelRegistration(registrationId: string): void {

    if (!confirm('Cancel registration?')) {
      return;
    }

    this.myRegistrationService
      .cancelRegistration(registrationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadRegistrations(),
        error: error => console.error('Failed to cancel registration.', error)
      });
  }
}