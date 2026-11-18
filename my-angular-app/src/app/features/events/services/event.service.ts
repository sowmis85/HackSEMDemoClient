import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventListResponse } from '../models/event-list-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) { }

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