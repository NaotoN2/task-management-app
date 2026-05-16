import { createClient } from '@/lib/supabase/server';

export default async function CalendarPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <main className="p-6">ユーザー情報を取得できませんでした</main>;
  }

  const { data: tasks, error } = await supabase
    .from('task')
    .select('id, title, spot_task, task_date, status, priority, memo')
    .eq('user_id', user.id)
    .order('priority', { ascending: true });

  if (error) {
    return <main className="p-6">タスクを取得できませんでした。</main>;
  }

  return (
    <main className="p-6">
      カレンダー
    </main>
  );
}
