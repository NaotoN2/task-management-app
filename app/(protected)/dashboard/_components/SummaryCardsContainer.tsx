import SummaryCard from './SummaryCard';

export default async function SummaryCardsContainer() {
  return (
    <section className="mb-6 grid grid-cols-3 gap-4">
      <SummaryCard title="今日のスポットタスク" count={0} />
      <SummaryCard title="進行中" count={0} />
      <SummaryCard title="期限切れ" count={0} />
    </section>
  );
}
