import { EventModel} from './event.model';

export interface EventListResponse {
  events: EventModel[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}