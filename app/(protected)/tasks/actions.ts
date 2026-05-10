'use server';

import { NewTask, Task, UpdatedTask } from '@/app/types/task';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const VALID_STATUS = ['todo', 'in_progress', 'done'] ;
const VALID_PRIORITY = ['low', 'medium', 'high'] ;

async function getActionContext() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function getTodayString() {
  return new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Tokyo'
  });
}

function resolveTaskStatus({
  spotTask,
  taskDate,
  status
}: {
  spotTask: boolean;
  taskDate: string | null;
  status: Task['status'];
}): Task['status'] {
  const today = getTodayString();

  if (!spotTask) {
    return status;
  }
  if (taskDate === today) {
    return status === 'done' ? 'done' : 'todo';
  }
  return 'todo';
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

  let task_date: string | null = null;

  if (typeof taskDate === 'string' && taskDate.trim() !== '') {
    task_date = taskDate;
  }

  let memoText: string | null = null;

  if (typeof memo === 'string' && memo.trim() !== '') {
    memoText = memo.trim();
  }

  const taskStatus = resolveTaskStatus({
    spotTask,
    taskDate: task_date,
    status: status as Task['status']
  });

  const newTask: NewTask = {
    title: title.trim(),
    spot_task: spotTask,
    status: taskStatus,
    priority: taskPriority,
    task_date,
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
  const spot_task = formData.get('spot_task');
  const status = formData.get('status');
  const priority = formData.get('priority');
  const taskDate = formData.get('task_date');
  const memo = formData.get('memo');

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

  let task_date: string | null = null;

  if (typeof taskDate === 'string' && taskDate.trim() !== '') {
    task_date = taskDate;
  }

  let memoText: string | null = null;

  if (typeof memo === 'string' && memo.trim() !== '') {
    memoText = memo.trim();
  }

  const taskStatus = resolveTaskStatus({
    spotTask,
    taskDate: task_date,
    status: status as Task['status']
  });

  const updatedTask: UpdatedTask = {
    title: title.trim(),
    spot_task: spotTask,
    status: taskStatus,
    priority: taskPriority,
    task_date,
    memo: memoText
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
