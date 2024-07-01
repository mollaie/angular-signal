import { createInjectable } from 'ngxtension/create-injectable';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { signal, computed, inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';

export const useTaskService = createInjectable(() => {
  const http = inject(HttpClient);
  const tasks = signal<Task[]>([]);
  const loading = signal(false);
  const error = signal<string | null>(null);

  const fetchTasks = () => {
    loading.set(true);
    error.set(null);

    return http.get<Task[]>('/assets/tasks.json').pipe(
      tap({
        next: (fetchedTasks: Task[]) => {
          tasks.set(fetchedTasks);
          loading.set(false);
        },
        error: (err) => {
          error.set('Failed to fetch tasks');
          loading.set(false);
        },
      })
    );
  };

  const addTask = (
    newTask: Omit<Task, 'id' | 'createdDate' | 'updatedDate'>
  ) => {
    const task: Task = {
      ...newTask,
      id: Math.max(...tasks().map((t) => t.id), 0) + 1,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
    tasks.update((currentTasks) => [...currentTasks, task]);
    return task;
  };

  const updateTask = (updatedTask: Task) => {
    tasks.update((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedDate: new Date() }
          : task
      )
    );
    return updatedTask;
  };

  const removeTask = (id: number) => {
    tasks.update((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const getTaskById = (id: number) =>
    computed(() => tasks().find((task) => task.id === id));

  return {
    tasks: computed(() => tasks()),
    loading: computed(() => loading()),
    error: computed(() => error()),
    fetchTasks,
    addTask,
    updateTask,
    removeTask,
    getTaskById,
  };
});
