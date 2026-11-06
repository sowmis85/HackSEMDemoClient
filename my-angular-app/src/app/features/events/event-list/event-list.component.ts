import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EventCard {
  title: string;
  date: string;
  venue: string;
  attendees: number;
  category: string;
  status: string;
}
@Component({
  selector: 'app-event-list',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit{
     events: EventCard[] = [];

     ngOnInit(): void {
    this.events = [];
     }    

}