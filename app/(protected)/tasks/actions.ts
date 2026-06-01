'use server';

import { NewTask, Task, UpdatedTask } from '@/app/types/task';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const VALID_STATUS = ['todo', 'in_progress', 'done'];
const VALID_PRIORITY = ['low', 'medium', 'high'];

async function getActionContext() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function resolveTaskStatus({ spotTask, status }: { spotTask: boolean; status: Task['status'] }): Task['status'] {
  if (!spotTask) {
    return status;
  }
  return status === 'done' ? 'done' : 'todo';
}

export async function addTask(formData: FormData) {
  const { supabase, user } = await getActionContext();

  if (!user) {
    return;
  }

  const title = formData.get('title');
  const spot_task = formData.get('spot_task');
  const status = formData.get('status');
  const priority = formData.get('priority');
  const taskDate = formData.get('task_date');
  const memo = formData.get('memo');
  const remind_at = formData.get('remind_at');

  if (typeof title !== 'string' || title.trim() === '') {
    return;
  }

  if (typeof spot_task !== 'string' || !['true', 'false'].includes(spot_task)) {
    return;
  }

  const spotTask = spot_task === 'true';

  if (typeof status !== 'string' || !VALID_STATUS.includes(status)) {
    return;
  }

  if (typeof priority !== 'string' || !VALID_PRIORITY.includes(priority)) {
    return;
  }

  const taskPriority = priority as Task['priority'];

  if (typeof taskDate !== 'string' || taskDate.trim() === '') {
    return;
  }

  let memoText: string | null = null;

  if (typeof memo === 'string' && memo.trim() !== '') {
    memoText = memo.trim();
  }

  let remindAt: string | null = null;

  if (typeof remind_at === 'string' && remind_at.trim() !== '') {
    remindAt = new Date(`${remind_at}T09:00:00+09:00`).toISOString();
  }

  const taskStatus = resolveTaskStatus({
    spotTask,
    status: status as Task['status']
  });

  const newTask: NewTask = {
    title: title.trim(),
    spot_task: spotTask,
    status: taskStatus,
    priority: taskPriority,
    task_date: taskDate,
    memo: memoText,
    remind_at: remindAt,
    user_id: user.id
  };

  const { error } = await supabase.from('task').insert([newTask]);

  if (error) {
    console.error('タスク追加エラー:', error.message);
    return { success: false };
  }

  revalidatePath('/dashboard');
  revalidatePath('/tasks');

  return { success: true };
}

export async function deleteTask(formData: FormData) {
  const { supabase, user } = await getActionContext();

  if (!user) {
    return;
  }

  const taskId = formData.get('taskId');

  if (typeof taskId !== 'string') return;

  const trimmedTaskId = taskId.trim();

  if (trimmedTaskId === '') return;

  const taskIdNumber = Number(trimmedTaskId);

  if (Number.isNaN(taskIdNumber)) return;

  const { error } = await supabase.from('task').delete().eq('id', taskIdNumber).eq('user_id', user.id);

  if (error) {
    console.error('タスク削除エラー', error.message);
    return { success: false };
  }

  revalidatePath('/dashboard');
  revalidatePath('/tasks');

  return { success: true };
}

export async function updateTask(formData: FormData) {
  const { supabase, user } = await getActionContext();

  if (!user) {
    return;
  }

  const taskId = formData.get('taskId');

  if (typeof taskId !== 'string') return;

  const trimmedTaskId = taskId.trim();

  if (trimmedTaskId === '') return;

  const taskIdNumber = Number(trimmedTaskId);

  if (Number.isNaN(taskIdNumber)) return;

  const title = formData.get('title');
  const spot_task = formData.get('spot_task');
  const status = formData.get('status');
  const priority = formData.get('priority');
  const taskDate = formData.get('task_date');
  const memo = formData.get('memo');
  const remind_at = formData.get('remind_at');

  if (typeof title !== 'string' || title.trim() === '') {
    return;
  }

  if (typeof spot_task !== 'string' || !['true', 'false'].includes(spot_task)) {
    return;
  }

  const spotTask = spot_task === 'true';

  if (typeof status !== 'string' || !VALID_STATUS.includes(status)) {
    return;
  }

  if (typeof priority !== 'string' || !VALID_PRIORITY.includes(priority)) {
    return;
  }

  const taskPriority = priority as Task['priority'];

  if (typeof taskDate !== 'string' || taskDate.trim() === '') {
    return;
  }

  let memoText: string | null = null;

  if (typeof memo === 'string' && memo.trim() !== '') {
    memoText = memo.trim();
  }

  let remindAt: string | null = null;

  if (typeof remind_at === 'string' && remind_at.trim() !== '') {
    remindAt = new Date(`${remind_at}T09:00:00+09:00`).toISOString();
  }

  const taskStatus = resolveTaskStatus({
    spotTask,
    status: status as Task['status']
  });

  const updatedTask: UpdatedTask = {
    title: title.trim(),
    spot_task: spotTask,
    status: taskStatus,
    priority: taskPriority,
    task_date: taskDate,
    memo: memoText,
    remind_at: remindAt,
    reminded_at: null
  };

  const { error } = await supabase.from('task').update(updatedTask).eq('id', taskIdNumber).eq('user_id', user.id);

  if (error) {
    console.error('タスク更新エラー:', error.message);
    return { success: false };
  }

  revalidatePath('/dashboard');
  revalidatePath('/tasks');

  return { success: true };
}
