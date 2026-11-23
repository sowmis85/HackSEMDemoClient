import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  successMessage = '';
  errorMessage = '';

  registerForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],
    role: ['Admin', Validators.required]
  });

  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage = 'Account created successfully';
          this.errorMessage = '';
          this.registerForm.reset({ role: 'Admin' });

          setTimeout(() => {
            void this.router.navigate(['/login']);
          }, 1000);
        },
        error: error => {
          this.successMessage = '';
          this.errorMessage = error instanceof HttpErrorResponse
            ? error.error?.message ?? error.message
            : error instanceof Error
              ? error.message
              : 'Failed to create account';
        }
      });
  }
}
