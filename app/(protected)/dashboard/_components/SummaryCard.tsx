import { AlarmClock, CircleAlert, Pin } from 'lucide-react';

type SummaryTitle = '今日のスポットタスク' | '進行中' | '期限切れ';

type SummaryCardProps = {
  title: SummaryTitle;
  count: number;
};

const ICONS = {
  今日のスポットタスク: Pin,
  進行中: AlarmClock,
  期限切れ: CircleAlert
};

export default function SummaryCard({ title, count }: SummaryCardProps) {
  const Icon = ICONS[title];
  const isOverdue = title === '期限切れ';

  return (
    <div className="flex justify-between rounded-lg border p-4">
      <div>
        <div>
          <h2 className="text-sm ">{title}</h2>
          <span>計：</span>
          <span className="mt-2 text-2xl font-bold ">{count}</span>
        </div>
      </div>
      <div className={`rounded-lg p-3 ${isOverdue ? 'bg-red-100' : 'bg-slate-100'}`}>
        <Icon className={`h-9 w-9 ${isOverdue ? 'text-red-300' : 'text-slate-500'}`} />
      </div>
    </div>
  );
}
