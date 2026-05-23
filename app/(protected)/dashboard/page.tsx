import MiniCalendarContainer from './_components/MiniCalendarContainer';
import SummaryCardsContainer from './_components/SummaryCardsContainer';
import TodayTasksPanel from './_components/TodayTaskPanel';
import UrgentAndOverduePanel from './_components/UrgentAndOverduePanel';

export default async function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
      </div>

      
      <SummaryCardsContainer/>
   

      <section className="grid grid-cols-[2fr_1fr] gap-4">
        <TodayTasksPanel />

        <div className="flex flex-col gap-4">
          <UrgentAndOverduePanel />
          <MiniCalendarContainer />
        </div>
      </section>
    </main>
  );
}
