import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/tasks/task-list.component').then(
        (m) => m.TaskListComponent
      ),
  },
  {
    path: 'task/:id',
    loadComponent: () =>
      import('./features/tasks/task-detail.component').then(
        (m) => m.TaskDetailComponent
      ),
  },
];
