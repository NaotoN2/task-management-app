import { TaskPriority, TaskStatus } from '@/app/types/task';

export const SORT_VALUES = {
  DEFAULT: '',
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  PRIORITY_DESC: 'priority_desc',
  PRIORITY_ASC: 'priority_asc'
} as const;

export type SortValue = (typeof SORT_VALUES)[keyof typeof SORT_VALUES];

export function isSortValue(value: unknown): value is SortValue {
    return Object.values(SORT_VALUES).includes(value as SortValue);
  }


export const STATUS_VALUES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
} as const satisfies Record<string, TaskStatus>;

export function isTaskStatus(value: string): value is TaskStatus {
  return Object.values(STATUS_VALUES).includes(value as TaskStatus);
}

export const PRIORITY_VALUES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const satisfies Record<string, TaskPriority>;

export function isTaskPriority(value: string): value is TaskPriority {
  return Object.values(PRIORITY_VALUES).includes(value as TaskPriority);
}
