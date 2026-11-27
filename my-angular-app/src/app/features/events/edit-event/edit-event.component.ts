import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../services/event.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './edit-event.component.html',
    styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);

  eventId = '';
  event: any;

  eventForm = this.formBuilder.group({
    title: [''],
    description: [''],
    category:[''],
    location: [''],
    capacity: [1],    
    availableSeats: [0],
     startDate: [''],
      endDate: ['']
  });

  ngOnInit(): void {

    this.eventId =
      this.route.snapshot.paramMap.get('eventId')!;

    this.loadEvent();
  }

  loadEvent(): void {

    this.eventService
      .getEventById(this.eventId)
      .subscribe(event => {
        this.event=event;
        this.event.startDate =  event.startDate?.substring(0,16);
         this.event.endDate =  event.endDate?.substring(0,16);
        this.eventForm.patchValue({
         title: event.title,
         description: event.description,
         category: event.category,
         location: event.location,
         capacity: event.capacity,
         availableSeats: event.availableSeats,         
          // startDate: event.startDate ? event.startDate.substring(0, 16) : '',
         // endDate: event.endDate ? event.endDate.substring(0, 16) : ''
        });
        console.log('API Start Date', event.startDate);
      console.log('Formatted Start Date', event.startDate?.substring(0, 16));
      });
  }

  updateEvent(): void {

    if (this.eventForm.invalid) {
      return;
    }
    const request = {
      ...this.eventForm.value,
      startDate: new Date(this.eventForm.value.startDate!),
      endDate: new Date(this.eventForm.value.endDate!)
    };
   this.eventService.updateEvent(this.eventId, request)
      .subscribe({
        next: () => {

          alert('Event Updated Successfully');

          this.router.navigate(['/events']);

        }
      });
  }
}