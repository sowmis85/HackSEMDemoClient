import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WorkflowStatusResponse } from '../../workflow/models/task-workflow.status.model';

@Injectable({
  providedIn: 'root'
})
export class EventWorkflowService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getWorkflowStatus(
    instanceId: string
  ) {
    return this.http.get<WorkflowStatusResponse>(
      `${this.apiUrl}/registrations/workflows/${instanceId}`
    );
  }

}