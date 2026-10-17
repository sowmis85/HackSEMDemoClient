import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit {
  private authService=inject(AuthService);

  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize form controls with validation rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
 async handleLogin() {
  try {
      // Await the promise returned by the service
      await this.authService.login({ email: this.email, password: this.password });

      // On success, redirect to the dashboard
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      // Handle server errors seamlessly
      this.errorMessage.set(err.error?.message || 'Invalid email or password.');
    } finally {
      this.isLoading.set(false);
    }
  }
  }
