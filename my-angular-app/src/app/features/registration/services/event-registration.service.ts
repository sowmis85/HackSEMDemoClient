import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventRegistrationRequest } from '../models/event-registration-request.model';
import { EventRegistrationResponse } from '../models/event-registration-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  register(
    eventId: string,
    request: EventRegistrationRequest
  ): Observable<EventRegistrationResponse> {

    return this.http.post<EventRegistrationResponse>(
      `${this.apiUrl}/registrations/${eventId}`,
      request
    );
  }
}