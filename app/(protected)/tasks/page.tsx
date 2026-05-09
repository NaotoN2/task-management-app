import { createClient } from '@/lib/supabase/server';
import NewTaskButton from './NewTaskButton';
import EditTaskButton from './EditTaskButton';
import type { Task } from '@/app/types/task';
import FilterPopover from './FilterPopover';
import SortPopover from './SortPopover';
import { isSortValue, isTaskPriority, isTaskStatus, SORT_VALUES, type SortValue } from './constants';
import SearchForm from './SearchForm';

const STATUS_LABELS: Record<Task['status'], string> = { todo: '未着手', in_progress: '進行中', done: '完了' };
const PRIORITY_LABELS: Record<Task['priority'], string> = { low: '低', medium: '中', high: '高' };

type TaskPageProps = {
  searchParams: Promise<{ sort?: string; status?: string; priority?: string; q?: string }>;
};

export default async function TasksPage({ searchParams }: TaskPageProps) {
  const { sort, status, priority, q } = await searchParams;
  const normalizedSort: SortValue = isSortValue(sort) ? sort : SORT_VALUES.DEFAULT;
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
    .select('id, title, spot_task ,due_date, status, priority, memo')
    .eq('user_id', user.id);

  if (normalizedStatusValues.length > 0) {
    query = query.in('status', normalizedStatusValues);
  }

  if (normalizedPriorityValues.length > 0) {
    query = query.in('priority', normalizedPriorityValues);
  }

  if (normalizedQuery !== '') {
    query = query.ilike('title', `%${normalizedQuery}%`);
  }

  if (normalizedSort === SORT_VALUES.DUE_ASC) {
    query = query.order('due_date', { ascending: true, nullsFirst: false });
  } else if (normalizedSort === SORT_VALUES.DUE_DESC) {
    query = query.order('due_date', { ascending: false, nullsFirst: false });
  } else if (normalizedSort === SORT_VALUES.PRIORITY_DESC) {
    query = query.order('priority', { ascending: false, nullsFirst: false });
  } else if (normalizedSort === SORT_VALUES.PRIORITY_ASC) {
    query = query.order('priority', { ascending: true, nullsFirst: false });
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
                <td className="border-b px-4 py-3">{task.due_date ?? '-'}</td>
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
