import { Component, OnInit, inject } from '@angular/core';
import { EventService } from '../services/event.service';
import { EventModel } from '../models/event.model';
import { Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-management',
  standalone: true,
   imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss']
})

export class EventManagementComponent implements OnInit {

  events: EventModel[] = [];
  filteredEvents: EventModel[] = [];

  searchText = '';
  selectedStatus = '';

  private readonly router = inject(Router);
  private eventService = inject(EventService); 

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService
      .getEvents()
      .subscribe({
        next: response => {
          this.events = response.events;
           this.filteredEvents = [...response.events];
        }
      });
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(x =>
      x.title.toLowerCase()
      .includes(this.searchText.toLowerCase())
      &&
      (
        !this.selectedStatus ||
        x.status === this.selectedStatus
      )
    );

    this.filteredEvents = this.events.sort(
    (a, b) =>
      new Date(b.startDate).getTime() -
      new Date(a.startDate).getTime()
    );
  }
  createEventClick(): void {       
      this.router.navigate(['/events/create']);
  }
  editEvent(event: EventModel): void {

    this.router.navigate(
      ['/events/edit', event.eventId]
    );
  }

  publishEvent(event: EventModel): void {
    this.eventService
      .publishEvent(event.eventId)
      .subscribe(() => {
        event.status = 'Published';
      });      
  }

  deleteEvent(eventId: string): void {
    if (!confirm('Delete Event ?')) {
      return;
    }
    this.eventService
      .deleteEvent(eventId)
      .subscribe(() => {
        this.loadEvents();
      });
  }
}