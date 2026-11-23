import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  private authService = inject(AuthService);

  constructor(private formBuilder: FormBuilder) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(): void {

    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.authService.forgotPassword({
      email: this.forgotPasswordForm.getRawValue().email,
      newPassword: this.forgotPasswordForm.getRawValue().newPassword
    })
      .subscribe({
        next: () => {
          this.successMessage = 'Password changed successfully.';
          this.errorMessage = '';
          this.forgotPasswordForm.reset();
          this.submitted = false;
        },
        error: error => {
          this.successMessage = '';
          this.errorMessage = error instanceof HttpErrorResponse
            ? error.error?.message ?? error.message
            : error instanceof Error
              ? error.message
              : 'Could not change password.';
        }
      });
  }
  
}
