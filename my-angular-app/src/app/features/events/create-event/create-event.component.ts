import { Component, inject, DestroyRef} from '@angular/core';
import { EventService } from '../services/event.service';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { signal } from '@angular/core';
import { RouterLink} from '@angular/router';

@Component({
  selector: 'app-create-event',
  standalone:true,
   imports: [FormsModule, RouterLink],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent {

  event: any = {
    eventId: '',
    title: '',
    description: '',
    category: '',
    location: '',
    capacity: 0,
    startDate: '',
    endDate: '',   
    status: 'Draft'
  };

   private eventService = inject(EventService);
   private readonly destroyRef = inject(DestroyRef);
   readonly loading = signal(true);
  saveDraft(): void {

    this.event.status = 'Draft';

    this.eventService
    .createEvent(this.event)
    .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
    .subscribe({
      next: (response: any) => {

        console.log(response);

        localStorage.setItem(
          'eventId',
          response.eventId
        );

        alert('Draft Saved');

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  publishEvent(): void {
  const eventId = localStorage.getItem('eventId');

    if (!eventId) {
    alert('Event Id not found');
    return;
  }
  this.event.status = 'Published';    
  console.log('eventid', eventId)
  this.eventService
    .publishEvent(eventId)
    .subscribe({
      next: () => {
        alert('Event Published');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}