export interface EventModel {
  eventId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  capacity: number;
  reservedSeats: number;
  availableSeats: number;  
}