import { EventCard } from './event.model';

export interface EventListResponse {
  events: EventCard[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}