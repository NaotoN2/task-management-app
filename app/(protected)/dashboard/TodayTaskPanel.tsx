import { createClient } from '@/lib/supabase/server';

function getTodayString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${date}`;
}

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
    .select('id, title, spot_task, task_date, status')
    .eq('user_id', user.id)
    .or(`and(spot_task.eq.true,task_date.eq.${today}),and(spot_task.eq.false,status.eq.in_progress)`)
    .order('id', { ascending: true });

  if (error) {
    return <div>タスクの表示に失敗しました</div>;
  }

  return (
    <section className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg ">今日のタスク</h2>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-md border px-4 py-3">
            {task.title}
          </div>
        ))}
      </div>
    </section>
  );
}
