import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventWorkflowService } from '../workflow/services/task-workflow.services';

interface WorkflowStep {
  name?: string;
  status: string;
}

@Component({    
  selector: 'app-task-workflow',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-workflow.component.html',
  styleUrl: './task-workflow.component.scss'
})
export class TaskWorkflowComponent implements OnInit {

  instanceId = '';
  eventName='';
  attendeeEmail='';
  workflowSteps: WorkflowStep[] = [];

  readonly registrationSummary = signal({
    eventName: '',
    attendeeEmail: '',
    registrationId: '',
    status: '',
    submittedDate: ''
  });

  
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly workflowService = inject(EventWorkflowService); 

  ngOnInit(): void {
    this.instanceId =
      this.route.snapshot.paramMap.get('workflowId') ?? '';
    this.eventName =
        this.route.snapshot.queryParamMap.get('eventName') ?? '';
    this.attendeeEmail =
        this.route.snapshot.queryParamMap.get('attendeeEmail') ?? '';

  this.workflowSteps = [
            { name: 'Workflow Status', status: 'current' }
          ];
    if (this.instanceId) {
      this.loadWorkflowStatus();
    }
  }

  loadWorkflowStatus(): void {

    this.workflowService
      .getWorkflowStatus(this.instanceId)
      .subscribe({

        next: response => {        

          this.workflowSteps = [
            { name: 'Initial Status', status: 'In progress' },
            { name: 'Workflow Status', status: 'completed' }            
          ];

          this.registrationSummary.set({
            eventName: this.eventName,           
            attendeeEmail: this.attendeeEmail,
            registrationId: response.registrationId,
            status: response.currentState,
            submittedDate: response.startedOn
          });
        }
      });
  }

  getStepClass(status: string): string {

    switch (status.toLowerCase()) {

      case 'completed':
        return 'completed';

      case 'confirmed':
      case 'in progress':
        return 'In progress';

      default:
        return 'pending';
    }
  }
}