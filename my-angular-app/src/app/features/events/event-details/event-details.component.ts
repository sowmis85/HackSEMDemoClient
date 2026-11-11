import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { EventModel } from '../models/event.model';
import {DatePipe} from '@angular/common';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-event-details',
  standalone:   true,
  imports: [DatePipe, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  selectedTab = 'overview';

  readonly event = signal<EventModel | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {

    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  async loadEvent(eventId: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.eventService.getEventById(eventId)
      );
      this.event.set(response);
    } catch (err) {
      console.error('Failed to load event', err);
    } finally {
      this.loading.set(false);
    }
  }

  registerEvent(): void {
    console.log('Register clicked');
  }

  addToCalendar(): void {
    console.log('Add to calendar clicked');
  }
}