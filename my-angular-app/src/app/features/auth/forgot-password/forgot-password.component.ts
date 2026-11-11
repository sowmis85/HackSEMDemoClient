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

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
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

  async onSubmit(): Promise<void> {

    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    try {
      const response = await this.authService.forgotPassword({
        email: this.forgotPasswordForm.getRawValue().email,
        newPassword: this.forgotPasswordForm.getRawValue().newPassword
      });     

      this.successMessage = 'Password changed successfully.';
      this.errorMessage = '';
      this.forgotPasswordForm.reset();
      this.submitted = false;
    } catch (error) {
      this.successMessage = '';
     this.errorMessage = error instanceof HttpErrorResponse
        ? error.error?.message ?? error.message
        : error instanceof Error
          ? error.message
        : 'Could not change password.';
    }
  }
  
}