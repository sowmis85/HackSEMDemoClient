import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, defer, finalize, tap, throwError } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../../../core/models/register-request.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/Auth`;
  readonly isLoading = signal(false);
  readonly isAuthenticated = signal(false);
  readonly error = signal<string | null>(null);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.sendRequest(
      this.http.post<LoginResponse>(`${this.baseUrl}/login`, request)
    ).pipe(
      tap(response => {
        if (response.success === false) {
          this.isAuthenticated.set(false);
          const message = response.message || 'Login failed.';
          this.error.set(message);
          throw new Error(message);
        }

        this.isAuthenticated.set(true);
      })
    );
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.sendRequest(
      this.http.post<LoginResponse>(
        `${this.baseUrl}/refresh-token`,
        { refreshToken }
      )
    ).pipe(
      tap(() => this.isAuthenticated.set(true))
    );
  }

  register(request: RegisterRequest): Observable<unknown> {
    return this.sendRequest(
      this.http.post<unknown>(`${this.baseUrl}/register`, request)
    );
  }

  forgotPassword(request: { email: string; newPassword: string }): Observable<unknown> {
    return this.sendRequest(
      this.http.post<unknown>(
        `${this.baseUrl}/forgot-password`,
        request
      )
    );
  }

  private sendRequest<T>(request: Observable<T>): Observable<T> {
    return defer(() => {
      this.isLoading.set(true);
      this.error.set(null);

      return request.pipe(
        catchError(error => {
          this.error.set(
            error instanceof Error ? error.message : 'Invalid Login Credentials'
          );
          return throwError(() => error);
        }),
        finalize(() => this.isLoading.set(false))
      );
    });
  }
}