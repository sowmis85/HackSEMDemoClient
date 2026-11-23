// models/task-workflow.model.ts

export interface TaskWorkflow {
  taskId: string;
  taskName: string;
  assignedTo: string;
  createdDate: string;
  status: TaskStatus;
  remarks?: string;
}

export type TaskStatus =
  | 'Started' 
  | 'In Progress'
  | 'Waitlisted'
  | 'Confirmed'
  | 'Completed';