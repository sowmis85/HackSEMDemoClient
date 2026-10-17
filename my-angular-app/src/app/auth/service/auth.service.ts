import { Inject, Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";


export interface AuthResponse{
token: string,
user:
{
 email:string,
 name:string
}
}
export class AuthService{
private http=inject(HttpClient);
private apiUrl='https://localhost:7055/login';

  // Reactive state tracking using an Angular Signal
  private tokenSignal = signal<string | null>(localStorage.getItem('authToken'));

  // Computed state exposed to guards and components
  public isAuthenticated = computed(() => !!this.tokenSignal());

 async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      // firstValueFrom converts the Angular HTTP Observable into a Promise
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      );

      // Save token locally and update the signal state
      localStorage.setItem('authToken', response.token);
      this.tokenSignal.set(response.token);

      return response;
    } catch (error) {
      // Bubble up the error so the component can catch it
      throw error;
    }
  }

  logout():(void)
  {
    localStorage.removeItem('authToken');
    this.tokenSignal.set(null);
    }

    getToken(): string | null {
    return this.tokenSignal();
  }
}
