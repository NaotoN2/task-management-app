'use client';

import { Task } from '@/app/types/task';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type CalendarTask = Pick<Task, 'id' | 'title' | 'spot_task' | 'task_date' | 'priority' | 'memo'>;

type TaskCalendarProps = { tasks: CalendarTask[] };

const PRIORITY_ICON: Record<Task['priority'], string> = {
  high: '🔴',
  medium: '🟡',
  low: '🔵'
};

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  high: '優先度：高',
  medium: '優先度：中',
  low: '優先度：低'
};

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
  const events = tasks.map((task) => ({
    id: String(task.id),
    title: task.title,
    start: task.task_date,
    allDay: true,

    extendedProps: {
      priority: task.priority,
      spotTask: task.spot_task,
      memo: task.memo
    }
  }));

  return (
    <section>
      <div className="overflow-x-auto">
        <div className="calendar-page mx-auto max-w-[1200px] min-w-[900px]">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            dayMaxEvents={3}
            eventBackgroundColor="#475569"
            eventBorderColor="#64748b"
            eventTextColor="#ffffff"
            eventContent={(eventInfo) => {
              const priority = eventInfo.event.extendedProps.priority as Task['priority'];

              const spotTask = eventInfo.event.extendedProps.spotTask as boolean;

              return (
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{PRIORITY_ICON[priority]}</span>
                    </TooltipTrigger>

                    <TooltipContent>{PRIORITY_LABELS[priority]}</TooltipContent>
                  </Tooltip>

                  <span title={eventInfo.event.title} className="inline-block max-w-[5em] truncate align-middle">
                    {eventInfo.event.title}
                  </span>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{spotTask ? '📍' : '⏰'}</span>
                    </TooltipTrigger>

                    <TooltipContent>{spotTask ? 'スポット' : '期限'}</TooltipContent>
                  </Tooltip>
                </div>
              );
            }}
          />
        </div>
      </div>
    </section>
  );
}
