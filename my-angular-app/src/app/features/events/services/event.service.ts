import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { EventListResponse } from '../models/event-list-response.model';
import { environment } from '../../../../environments/environment';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) { }

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
}