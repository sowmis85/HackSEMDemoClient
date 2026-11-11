import { Component, DestroyRef, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, startWith, Subject, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { EventModel} from '../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit{

     private eventService = inject(EventService);
     private router = inject(Router);
     private destroyRef = inject(DestroyRef);
     private platformId = inject(PLATFORM_ID);
     searchControl = new FormControl('');

     events: any[] = [];
 selectedCategory = '';
    categories = [
        { label: 'Conferences', value: 'Conference' },
        { label: 'Workshops', value: 'Workshop' },
        { label: 'Hackathons', value: 'Hackathon' },
        { label: 'Webinars', value: 'Webinar' },
        { label: 'Bootcamps', value: 'Bootcamp' }
    ];
    
 private filters$ = new Subject<{ search: string; category: string }>();

ngOnInit(): void {

  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  this.filters$
    .pipe(
      startWith({ search: '', category: '' }),
      switchMap(({ search, category }) => {
        return this.eventService.getEvents(
          search,
          category
        ).pipe(
          map(response => ({
            ...response,
            events: category
              ? response.events.filter(event =>
                  event.category.trim().toLowerCase() === category.toLowerCase()
                )
              : response.events
          })),
          catchError(error => {
            console.error('Failed to load events.', error);
            this.events = [];
            return EMPTY;
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: response => {
        this.events = response.events;
      }
    });

}
onSearch(): void {
  this.loadEvents();
}
clearSearch(): void {
  this.searchControl.setValue('');
  this.selectedCategory = '';
  this.loadEvents();
}
trackByEventId(index: number, event: any): string {
  return event.eventId;
}
selectCategory(category: string): void {

    this.selectedCategory =
      this.selectedCategory === category
        ? ''
        : category;

    this.loadEvents();
  }

  private loadEvents(): void {
    this.filters$.next({
      search: this.searchControl.value ?? '',
      category: this.selectedCategory
    });
  }

  viewEvent(event: EventModel): void {
  this.router.navigate(['/events', event.eventId]);
}
}