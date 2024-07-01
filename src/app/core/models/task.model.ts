export interface Task {
  id: number;
  name: string;
  description: string;
  status: statusOptions;
  createdDate: Date;
  updatedDate: Date;
}

export type statusOptions =
  | 'committed'
  | 'in progress'
  | 'completed'
  | 'cancelled'
  | 'blocked';
