import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { useTaskService } from '../../core/services/task.service';
import { statusOptions } from '../../core/models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
  ],
  template: `
    <div class="card">
      <h2>{{ isNewTask ? 'Add Task' : 'Edit Task' }}</h2>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="name">Name</label>
          <input id="name" type="text" pInputText formControlName="name" />
        </div>
        <div class="field">
          <label for="description">Description</label>
          <textarea
            id="description"
            pInputTextarea
            formControlName="description"
          ></textarea>
        </div>
        <div class="field">
          <label for="status">Status</label>
          <p-dropdown
            id="status"
            [options]="statusOptions"
            formControlName="status"
            optionLabel="label"
            optionValue="value"
          ></p-dropdown>
        </div>
        <p-button
          type="submit"
          label="Save"
          [disabled]="taskForm.invalid"
        ></p-button>
      </form>
    </div>
  `,
  styles: [``],
})
export class TaskDetailComponent implements OnInit {
  @Input() id?: string;

  private taskService = inject(useTaskService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  taskForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    status: ['', Validators.required],
  });

  isNewTask = true;
  statusOptions = [
    { label: 'Committed', value: 'committed' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Blocked', value: 'blocked' },
  ];

  ngOnInit() {
    if (this.id && this.id !== 'new') {
      this.isNewTask = false;
      const task = this.taskService.getTaskById(+this.id)();
      if (task) {
        this.taskForm.patchValue(task);
      }
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.getRawValue();
      if (this.isNewTask) {
        this.taskService.addTask({
          ...formValue,
          status: formValue.status as statusOptions,
        });
      } else {
        this.taskService.updateTask({ ...formValue, id: +this.id! } as any);
      }
      this.router.navigate(['/']);
    }
  }
}
