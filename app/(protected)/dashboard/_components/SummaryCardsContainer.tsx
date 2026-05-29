import { createClient } from '@/lib/supabase/server';
import SummaryCard from './SummaryCard';
import { getTodayString } from '@/lib/date';

export default async function SummaryCardsContainer() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>ユーザーの取得に失敗しました。</div>;
  }

  const today = getTodayString();

  const [{ count: todayAndSpotCount }, { count: progressCount }, { count: overdueCount }] = await Promise.all([
    supabase
      .from('task')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('spot_task', true)
      .eq('task_date', today),

    supabase
      .from('task')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'in_progress'),

    supabase
      .from('task')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('spot_task', false)
      .lt('task_date', today)
      .neq('status', 'done')
  ]);

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard title="今日のスポットタスク" count={todayAndSpotCount ?? 0} />
      <SummaryCard title="進行中" count={progressCount ?? 0} />
      <SummaryCard title="期限切れ" count={overdueCount ?? 0} />
    </section>
  );
}
