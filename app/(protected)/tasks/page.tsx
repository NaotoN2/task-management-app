import { createClient } from '@/lib/supabase/server';

import type { Task } from '@/app/types/task';

import { isSortValue, isTaskPriority, isTaskStatus, isTaskTypeValue, SORT_VALUES, type SortValue } from './constants';
import SearchForm from './_components/SearchForm';
import FilterPopover from './_components/FilterPopover';
import NewTaskButton from './_components/NewTaskButton';
import SortPopover from './_components/SortPopover';
import EditTaskButton from './_components/EditTaskButton';

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
    .select('id, title, spot_task ,task_date, status, priority, memo')
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">タスク一覧</h1>
        <div className="flex items-center gap-2">
          <SearchForm />

          <SortPopover />

          <FilterPopover />

          <NewTaskButton />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-3 text-left">項目名</th>
              <th className="border-b px-4 py-3 text-left">分類</th>
              <th className="border-b px-4 py-3 text-left">日付</th>
              <th className="border-b px-4 py-3 text-left">状況</th>
              <th className="border-b px-4 py-3 text-left">重要度</th>
              <th className="border-b px-4 py-3 text-left">メモ</th>
              <th className="border-b px-4 py-3 text-left">変更</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-3">{task.title}</td>
                <td className="border-b px-4 py-3">{task.spot_task ? 'スポット' : '期限'}</td>
                <td className="border-b px-4 py-3">{task.task_date}</td>
                <td className="border-b px-4 py-3">{STATUS_LABELS[task.status]}</td>
                <td className="border-b px-4 py-3">{PRIORITY_LABELS[task.priority]}</td>
                <td className="border-b px-4 py-3">{task.memo ?? '-'}</td>
                <td className="border-b px-4 py-3">
                  <EditTaskButton task={task} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
