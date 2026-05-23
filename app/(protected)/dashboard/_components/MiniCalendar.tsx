'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Link from 'next/link';
import { Task } from '@/app/types/task';

type MiniCalendarTask = Pick<Task, 'spot_task' | 'task_date'>;

type MiniCalendarPanelProps = {
  tasks: MiniCalendarTask[];
};

export default function MiniCalendar({ tasks }: MiniCalendarPanelProps) {
  const events = tasks.map((task) => ({
    start: task.task_date,
    allDay: true,
    extendedProps: {
      spotTask: task.spot_task
    }
  }));

  return (
    <section className="flex h-[480px] flex-col rounded-lg border p-4">
      <div className="pb-4 flex justify-end ">
        <Link href="/calendar" className="text-sm hover:underline">
          カレンダー ⇒
        </Link>
      </div>
      <div className="mini-calendar min-h-0 flex-1">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          height="100%"
          fixedWeekCount={false}
          showNonCurrentDates={false}
          dayMaxEvents={2}
          events={events}
          eventBackgroundColor="#6dbcfc"
          eventBorderColor="#3b3d54"
          eventTextColor="#2c3966"
        />
      </div>
    </section>
  );
}
