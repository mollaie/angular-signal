import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { useTaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, ButtonModule],
  template: `
    <div class="card">
      <div class="flex justify-content-between mb-3">
        <h2>Task List</h2>
        <p-button
          icon="pi pi-plus"
          label="Add Task"
          routerLink="/task/new"
        ></p-button>
      </div>
      @if (loading()) {
      <p>Loading tasks...</p>
      } @else if (error()) {
      <p>Error: {{ error() }}</p>
      } @else {
      <p-table
        [value]="tasks()"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[10, 20, 50]"
        [totalRecords]="tasks().length"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-task>
          <tr>
            <td>{{ task.name }}</td>
            <td>
              <span [ngClass]="getStatusClass(task.status)">{{
                task.status
              }}</span>
            </td>
            <td>{{ task.createdDate | date }}</td>
            <td>
              <p-button
                icon="pi pi-pencil"
                styleClass="p-button-rounded mr-2"
                [routerLink]="['/task', task.id]"
              ></p-button>
              <p-button
                icon="pi pi-trash"
                styleClass="p-button-rounded ml-2"
                (click)="deleteTask(task.id)"
              ></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
      }
    </div>
  `,
  styles: [
    `
      :host {
        .status-committed {
          background-color: #fbc02d;
          color: #000;
          padding: 2px 5px;
          border-radius: 3px;
        }
        .status-in-progress {
          background-color: #1e88e5;
          color: #fff;
          padding: 2px 5px;
          border-radius: 3px;
        }
        .status-completed {
          background-color: #43a047;
          color: #fff;
          padding: 2px 5px;
          border-radius: 3px;
        }
        .status-cancelled {
          background-color: #e53935;
          color: #fff;
          padding: 2px 5px;
          border-radius: 3px;
        }
        .status-blocked {
          background-color: #757575;
          color: #fff;
          padding: 2px 5px;
          border-radius: 3px;
        }

        .p-button.p-button-icon-only {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  private taskService = inject(useTaskService);
  tasks = this.taskService.tasks;
  loading = this.taskService.loading;
  error = this.taskService.error;
  totalRecords = () => this.tasks().length;

  ngOnInit() {
    this.taskService.fetchTasks().subscribe();
  }

  deleteTask(id: number) {
    this.taskService.removeTask(id);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }
}
