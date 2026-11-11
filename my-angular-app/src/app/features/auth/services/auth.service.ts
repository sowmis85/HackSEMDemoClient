import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

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

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.sendRequest(
      this.http.post<LoginResponse>(`${this.baseUrl}/login`, request)
    );

    if (response.success === false) {
      this.isAuthenticated.set(false);
      this.error.set(response.message || 'Login failed.');
      throw new Error(response.message || 'Login failed.');
    }

    this.isAuthenticated.set(true);
    return response;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await this.sendRequest(
      this.http.post<LoginResponse>(
        `${this.baseUrl}/refresh-token`,
        { refreshToken }
      )
    );
    this.isAuthenticated.set(true);
    return response;
  }

  register(request: RegisterRequest): Promise<unknown> {
    return this.sendRequest(
      this.http.post<unknown>(`${this.baseUrl}/register`, request)
    );
  }

  forgotPassword(request: { email: string; newPassword: string }): Promise<unknown> {
    return this.sendRequest(
      this.http.post<unknown>(
        `${this.baseUrl}/forgot-password`,
        request
      )
    );
  }

  private async sendRequest<T>(request: Observable<T>): Promise<T> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      return await firstValueFrom(request);
    } catch (error) {
      this.error.set(
        error instanceof Error ? error.message : 'Invalid Login Credentials'
      );
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }
}