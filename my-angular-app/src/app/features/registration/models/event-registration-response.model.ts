export interface EventRegistrationResponse {
  registrationId: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  quantity: number;
  workflowInstanceId: string;
  status: string;
  createdAt: string;
  success?: boolean;
  message?: string; 
}
