import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;

  loginForm = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      Validators.required
    ]
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({
        next: (response) => {

          localStorage.setItem(
            'accessToken',
            response.accessToken
          );

          localStorage.setItem(
            'refreshToken',
            response.refreshToken
          );

          console.log('Login Successful');

            // Redirect to Events Home Page
            this.router.navigate(['/events']);
        },
        error: (error) => {

                console.log('Status:', error.status);

                console.log('Message:', error.message);

                console.log('Error:', error);

        }
      });
  }
}