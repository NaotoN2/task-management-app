import { type TaskPriority } from '@/app/types/task';
import { createClient } from '@/lib/supabase/server';
import { AlarmClock, Pin } from 'lucide-react';

const PRIORITY_LABELS: Record<TaskPriority, string> = { low: '低', medium: '中', high: '高' };

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 1,
  medium: 2,
  low: 3
};

export default async function UrgentAndOverduePanel() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>ユーザーの取得に失敗しました。</div>;
  }

  const today = new Date();

  const limitDate = new Date(today);
  limitDate.setDate(limitDate.getDate() + 2);

  const limitDateText = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo'
  }).format(limitDate);

  const { data: tasks, error } = await supabase
    .from('task')
    .select('id,title,spot_task,task_date,priority')
    .eq('user_id', user.id)
    .eq('spot_task', false)
    .neq('status', 'done')
    .lt('task_date', limitDateText)
    .order('task_date', { ascending: true });

  if (error) {
    console.error(error);
    return <div>データの取得に失敗しました。</div>;
  }

  const sortedTasks = (tasks ?? []).sort((a, b) => {
    const dataCompare = a.task_date.localeCompare(b.task_date);

    if (dataCompare !== 0) {
      return dataCompare;
    }

    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });

  return (
    <section className="h-90 rounded-lg border p-4">
      <div className="flex flex-col gap-2">
        <h2 className="my-1">緊急・期限切れ</h2>
        {sortedTasks.map((task) => (
          <div key={task.id} className="rounded-md border px-4 py-2">
            <div className="font-semibold">{task.title}</div>
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
                  </>
                )}
              </span>
              <span>
                {!task.spot_task &&
                  `~ ${Number(task.task_date.split('-')[1])}月${Number(task.task_date.split('-')[2])}日`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
