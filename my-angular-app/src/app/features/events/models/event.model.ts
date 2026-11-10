export interface EventCard {
  eventId: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  status: string;
  capacity: number;
  reservedSeats: number;
  availableSeats: number;
  organizerId: string;
}