type SummaryCardProps = {
  title: string;
};

export default function SummaryCard({ title }: SummaryCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-sm ">{title}</h2>
    </div>
  );
}