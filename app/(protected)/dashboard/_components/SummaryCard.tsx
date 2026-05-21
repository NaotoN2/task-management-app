type SummaryCardProps = {
  title: string;
  count: number;
};

export default function SummaryCard({ title, count }: SummaryCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-sm ">{title}</h2>
      <h2 className="mt-2 text-2xl font-bold ">{count}</h2>
    </div>
  );
}
