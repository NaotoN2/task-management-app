import MiniCalendarPanel from './MiniCalendar';
import SummaryCard from './SummaryCard';
import TodayTasksPanel from './TodayTaskPanel';
import UrgentTodayPanel from './UrgentAndTodayPanel';

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl">Dashboard</h1>
      </div>

      <section className="mb-6 grid grid-cols-3 gap-4">
        <SummaryCard title="完了タスク" />
        <SummaryCard title="残りのタスク" />
        <SummaryCard title="期限超過" />
      </section>

      <section className="grid grid-cols-[2fr_1fr] gap-4">
        <TodayTasksPanel />

        <div className="flex flex-col gap-4">
          <UrgentTodayPanel />
          <MiniCalendarPanel />
        </div>
      </section>
    </main>
  );
}
