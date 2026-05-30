import { createClient } from '@/lib/supabase/server';

import type { Task } from '@/app/types/task';

import { isSortValue, isTaskPriority, isTaskStatus, isTaskTypeValue, SORT_VALUES, type SortValue } from './constants';
import SearchForm from './_components/SearchForm';
import FilterPopover from './_components/FilterPopover';
import NewTaskButton from './_components/NewTaskButton';
import SortPopover from './_components/SortPopover';
import EditTaskButton from './_components/EditTaskButton';
import MemoPopover from '@/components/shared/MemoPopover';
import { Bell, BellCheck } from 'lucide-react';

const STATUS_LABELS: Record<Task['status'], string> = { todo: '未着手', in_progress: '進行中', done: '完了' };
const PRIORITY_LABELS: Record<Task['priority'], string> = { low: '低', medium: '中', high: '高' };

type TaskPageProps = {
  searchParams: Promise<{ sort?: string; type?: string; status?: string; priority?: string; q?: string }>;
};

export default async function TasksPage({ searchParams }: TaskPageProps) {
  const { sort, type, status, priority, q } = await searchParams;
  const normalizedSort: SortValue = isSortValue(sort) ? sort : SORT_VALUES.DEFAULT;
  const normalizedTypeValues = type ? type.split(',').filter(isTaskTypeValue) : [];
  const normalizedStatusValues = status ? status.split(',').filter(isTaskStatus) : [];
  const normalizedPriorityValues = priority ? priority.split(',').filter(isTaskPriority) : [];
  const normalizedQuery = typeof q === 'string' ? q.trim() : '';

  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <main className="p-6">ユーザー情報を取得できませんでした</main>;
  }

  let query = supabase
    .from('task')
    .select('id, title, spot_task ,task_date, status, priority, memo,remind_at,reminded_at')
    .eq('user_id', user.id);

  if (normalizedTypeValues.length === 1) {
    if (normalizedTypeValues.includes('normal')) {
      query = query.eq('spot_task', false);
    }

    if (normalizedTypeValues.includes('spot')) {
      query = query.eq('spot_task', true);
    }
  }

  if (normalizedStatusValues.length > 0) {
    query = query.in('status', normalizedStatusValues);
  }

  if (normalizedPriorityValues.length > 0) {
    query = query.in('priority', normalizedPriorityValues);
  }

  if (normalizedQuery !== '') {
    query = query.ilike('title', `%${normalizedQuery}%`);
  }

  if (normalizedSort === SORT_VALUES.DATE_ASC) {
    query = query.order('task_date', { ascending: true });
  } else if (normalizedSort === SORT_VALUES.DATE_DESC) {
    query = query.order('task_date', { ascending: false });
  } else if (normalizedSort === SORT_VALUES.PRIORITY_DESC) {
    query = query.order('priority', { ascending: false });
  } else if (normalizedSort === SORT_VALUES.PRIORITY_ASC) {
    query = query.order('priority', { ascending: true });
  } else {
    query = query.order('id', { ascending: true });
  }

  const { data: tasks, error } = await query;

  if (error) {
    return <main className="p-6">エラー: {error.message}</main>;
  }

  return (
    <main className="p-6">
      <div className=" mb-6 flex flex-col xl:flex-row xl:justify-between xl:max-w-[1200px] xl:mx-auto">
        <h1 className="mb-2 text-2xl font-bold">タスク一覧</h1>
        <div className="flex flex-col items-start gap-2 lg:flex-row">
          <div className="flex gap-4">
            <SearchForm />
          </div>
          <div className="flex gap-3">
            <SortPopover />

            <FilterPopover />

            <NewTaskButton />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="mx-auto max-w-[1200px] min-w-[1000px]">
          <div className="rounded-lg border">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-left">項目名</th>
                  <th className="border-b px-4 py-3 text-left">分類</th>
                  <th className="border-b px-4 py-3 text-left">日付・期限</th>
                  <th className="border-b px-4 py-3 text-left">状況</th>
                  <th className="border-b px-4 py-3 text-left">重要度</th>
                  <th className="border-b px-4 py-3 text-left">通知</th>
                  <th className="border-b px-4 py-3 text-left">メモ</th>
                  <th className="border-b px-4 py-3 text-left">変更</th>
                </tr>
              </thead>
              <tbody>
                {tasks?.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="border-b px-4 py-3 max-w-[100px] truncate " title={task.title}>
                      {task.title}
                    </td>
                    <td className="border-b px-4 py-3">{task.spot_task ? 'スポット' : '期限'}</td>
                    <td className="border-b px-4 py-3">
                      {task.spot_task
                        ? `${Number(task.task_date.split('-')[1])}月${Number(task.task_date.split('-')[2])}日`
                        : `${Number(task.task_date.split('-')[1])}月${Number(task.task_date.split('-')[2])}日まで`}
                    </td>
                    <td className="border-b px-4 py-3">{STATUS_LABELS[task.status]}</td>
                    <td className="border-b px-4 py-3">{PRIORITY_LABELS[task.priority]}</td>
                    <td className="border-b px-4 py-3">
                      {task.remind_at ? (
                        task.reminded_at ? (
                          <BellCheck className="text-green-600" strokeWidth={1.5} />
                        ) : (
                          <Bell strokeWidth={1.5} />
                        )
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="border-b px-4 py-3">
                      {task.memo ? <MemoPopover memo={task.memo} iconClass={'h-6 w-6'} /> : '-'}
                    </td>
                    <td className="border-b px-4 py-3">
                      <EditTaskButton task={task} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
