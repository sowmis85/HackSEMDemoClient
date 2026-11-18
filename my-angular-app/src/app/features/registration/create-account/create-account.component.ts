import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  successMessage = '';
  errorMessage = '';

  registerForm: FormGroup = this.fb.group({
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

  async onSubmit(): Promise<void> {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    try {
      await this.authService.register(this.registerForm.getRawValue());
      this.successMessage = 'Account created successfully';
      this.errorMessage = '';
      this.registerForm.reset({ role: 'Admin' });

            setTimeout(() => {
          void this.router.navigate(['/login']);
        }, 1000);
    } catch (error) {
      this.successMessage = '';
      this.errorMessage = error instanceof HttpErrorResponse
        ? error.error?.message ?? error.message
        : error instanceof Error
          ? error.message
          : 'Failed to create account';
    }
  }
}