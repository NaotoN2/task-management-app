import { createClient } from '@/lib/supabase/server';
import MiniCalendar from './MiniCalendar';

export default async function MiniCalendarContainer() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>ユーザーの取得に失敗しました。</div>;
  }

  const { data: tasks, error } = await supabase.from('task').select('spot_task,task_date').eq('user_id', user.id);

  if (error) {
    console.error(error);
    return <div>データの取得に失敗しました</div>;
  }

  return <MiniCalendar tasks={tasks} />;
}
