import { TaskPriority } from '@/app/types/task';
import { createClient } from '@/lib/supabase/server';

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

  const todayText = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo'
  }).format(today);

  const limitDate = new Date(today);
  limitDate.setDate(limitDate.getDate() + 2);

  const limitDateText = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo'
  }).format(limitDate);

  const { data: tasks, error } = await supabase
    .from('task')
    .select('id,title,task_date,priority,memo')
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
    <section className="h-80 rounded-lg border p-4">
      <h2>緊急・期限切れ</h2>
      {sortedTasks.map((task) => (
        <div key={task.id}>
          <p>{task.title}</p>
        </div>
      ))}
    </section>
  );
}
