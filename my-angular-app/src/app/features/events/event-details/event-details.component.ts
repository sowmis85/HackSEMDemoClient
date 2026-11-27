import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '../services/event.service';
import { EventModel } from '../models/event.model';
import {DatePipe} from '@angular/common';
import { RouterLink, Router} from '@angular/router';
import { signal } from '@angular/core';
import { finalize } from 'rxjs';

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
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  selectedTab = 'overview';

  readonly event = signal<EventModel | null>(null);
  readonly loading = signal(true);

  isAddingToCalendar = false;

  ngOnInit(): void {

    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  loadEvent(eventId: string): void {
    this.eventService.getEventById(eventId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: event => this.event.set(event),
        error: err => console.error('Failed to load event', err)
      });
  }

  registerEvent(): void {
    console.log('Register clicked');
     const event = this.event();
  if (!event) return;

  void this.router.navigate(
    ['/registration', event.eventId],
    { state: { event } }
  );
  }

  addToCalendar(): void {
    const selectedEvent = this.event();

    if (!selectedEvent?.eventId) {
      return;
    }

    const start =
      new Date(selectedEvent.startDate)
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0] + 'Z';

    const end =
      new Date(selectedEvent.endDate)
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0] + 'Z';

    const url =
  'https://outlook.office.com/calendar/0/deeplink/compose?' +
  `subject=${encodeURIComponent(selectedEvent.title)}` +
  `&body=${encodeURIComponent(selectedEvent.description)}` +
  `&location=${encodeURIComponent('Smart Event Management')}` +
  `&startdt=${encodeURIComponent(start)}` +
  `&enddt=${encodeURIComponent(end)}`;


    window.open(url, '_blank');
  }
}