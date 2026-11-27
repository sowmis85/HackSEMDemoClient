import { Injectable, inject} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { EventListResponse } from '../models/event-list-response.model';
import { environment } from '../../../../environments/environment';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly http = inject(HttpClient);  

  private readonly apiUrl = `${environment.apiUrl}/events`;
  

  getEventById(eventId: string): Observable<EventModel> {
  return this.http.get<EventModel>(`${this.apiUrl}/${eventId}`).pipe(
    tap(event => console.log('Event details:', event))
  );
}
    register(eventId: string, payload: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${eventId}/registrations`,
      payload
    );
  }
   getEvents(
    search: string = '',
    category: string = ''
  ): Observable<EventListResponse> {

    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<EventListResponse>(
      this.apiUrl,
      { params }
    );
  }
  createEvent(event: any) {
  return this.http.post(
    `${this.apiUrl}`,
    event);
}
    publishEvent(eventId: string) { 
    return this.http.put(
      `${this.apiUrl}/${eventId}/publish`,  {}
    );
  }

  deleteEvent(eventId: string) {
    return this.http.delete(
      `${this.apiUrl}/${eventId}`
    );
  }
  updateEvent(eventId: string, event: any) {
  return this.http.put(
    `${this.apiUrl}/${eventId}`,
    event
  );
}


}