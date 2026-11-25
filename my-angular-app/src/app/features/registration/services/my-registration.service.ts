import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegistration } from '../models/user-registration.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyRegistrationService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/registrations`;

  getMyRegistrations(userId: string): Observable<UserRegistration[]> {
    return this.http.get<UserRegistration[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  cancelRegistration(registrationId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${registrationId}`
    );
  }
}