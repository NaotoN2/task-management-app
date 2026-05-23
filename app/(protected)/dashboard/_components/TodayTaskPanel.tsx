import { type TaskPriority } from '@/app/types/task';
import { getTodayString } from '@/lib/date';
import { createClient } from '@/lib/supabase/server';
import { AlarmClock, Pin } from 'lucide-react';
import Link from 'next/link';

const PRIORITY_LABELS: Record<TaskPriority, string> = { low: '低', medium: '中', high: '高' };



export default async function TodayTasksPanel() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>ユーザー情報を取得できませんでした。</div>;
  }

  const today = getTodayString();

  const { data: tasks, error } = await supabase
    .from('task')
    .select('id, title, spot_task, task_date, status, priority, memo')
    .eq('user_id', user.id)
    .or(`and(spot_task.eq.true,task_date.eq.${today}),and(spot_task.eq.false,status.eq.in_progress)`)
    .order('task_date', { ascending: true });

  if (error) {
    return <div>タスクの表示に失敗しました</div>;
  }

  return (
    <section className="rounded-lg border p-4">
      <div className="flex justify-between">
        <h2 className="mb-4 text-lg ">今日やること</h2>
        <Link href="/tasks" className="text-sm hover:underline">
          {' '}
          タスク一覧 ⇒
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-md border px-4 py-3">
            <div className="text-lg font-semibold">{task.title}</div>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span>{`重要度：${PRIORITY_LABELS[task.priority]}`}</span>
              <span className="flex items-center gap-2">
                {task.spot_task ? (
                  <>
                    <Pin className="h-5 w-5" />
                    スポット - 今日
                  </>
                ) : (
                  <>
                    <AlarmClock className="h-5 w-5" />
                    期限
                  </>
                )}
              </span>
              <span>
                {!task.spot_task &&
                  `~ ${Number(task.task_date.split('-')[1])}月${Number(task.task_date.split('-')[2])}日`}
              </span>
            </div>
            <div className="mt-2 min-h-5 text-sm text-gray-500">{task.memo}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
