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

export async function addTask(formData: FormData) {
  const { supabase, user } = await getActionContext();

  if (!user) {
    return;
  }

  const title = formData.get('title');
  const status = formData.get('status');
  const priority = formData.get('priority');
  const dueDate = formData.get('due_date');
  const memo = formData.get('memo');

  if (typeof title !== 'string' || title.trim() === '') {
    return;
  }

  if (typeof status !== 'string' || !VALID_STATUS.includes(status)) {
    return;
  }

  const taskStatus = status as Task['status'];

  if (typeof priority !== 'string' || !VALID_PRIORITY.includes(priority)) {
    return;
  }

  const taskPriority = priority as Task['priority'];

  let due_date: string | null = null;

  if (typeof dueDate === 'string' && dueDate.trim() !== '') {
    due_date = dueDate;
  }

  let memoText: string | null = null;

  if (typeof memo === 'string' && memo.trim() !== '') {
    memoText = memo.trim();
  }

  const newTask: NewTask = {
    title: title.trim(),
    status: taskStatus,
    priority: taskPriority,
    due_date,
    memo: memoText,
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
  const status = formData.get('status');
  const priority = formData.get('priority');
  const dueDate = formData.get('due_date');
  const memo = formData.get('memo');

  if (typeof title !== 'string' || title.trim() === '') {
    return;
  }

  if (typeof status !== 'string' || !VALID_STATUS.includes(status)) {
    return;
  }

  const taskStatus = status as Task['status'];

  if (typeof priority !== 'string' || !VALID_PRIORITY.includes(priority)) {
    return;
  }

  const taskPriority = priority as Task['priority'];

  let due_date: string | null = null;

  if (typeof dueDate === 'string' && dueDate.trim() !== '') {
    due_date = dueDate;
  }

  let memoText: string | null = null;

  if (typeof memo === 'string' && memo.trim() !== '') {
    memoText = memo.trim();
  }

  const updatedTask : UpdatedTask = {
    title:title.trim(),
    status: taskStatus,
    priority: taskPriority,
    due_date,
    memo:memoText
  }

  const {error} = await supabase.from('task').update(updatedTask).eq('id',taskIdNumber).eq('user_id',user.id);

  if (error) {
    console.error('タスク更新エラー:', error.message);
    return { success: false };
  }

  revalidatePath('/dashboard');
  revalidatePath('/tasks');

  return { success: true };
}
