import { Database } from './database.types';

export type Task = Database['public']['Tables']['task']['Row'];
export type NewTask = Database['public']['Tables']['task']['Insert'];
export type UpdatedTask = Database['public']['Tables']['task']['Update'];

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];

export type TaskListItem = Pick<Task, 'id' | 'title' | 'event_task' | 'due_date' | 'status' | 'priority' | 'memo'>;
