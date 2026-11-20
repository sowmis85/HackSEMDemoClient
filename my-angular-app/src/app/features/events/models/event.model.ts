export interface EventModel {
  eventId: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: string;
  capacity: number;
  reservedSeats: number;
  availableSeats: number;
}