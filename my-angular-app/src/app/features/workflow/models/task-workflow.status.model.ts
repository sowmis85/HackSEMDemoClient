export interface WorkflowStatusResponse { 
  workflowInstanceId: string;
  registrationId: string;  
  currentState: string;
  startedOn: string;
  lastUpdatedOn:string; 
}

export interface WorkflowStep {
  stepName: string;
  status: string;
}