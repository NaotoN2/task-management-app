'use client';

import { Task } from '@/app/types/task';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import MemoPopover from '@/components/shared/MemoPopover';
import { AlarmClock, Circle, Pin } from 'lucide-react';
import { ReactNode } from 'react';

type CalendarTask = Pick<Task, 'id' | 'title' | 'spot_task' | 'task_date' | 'priority' | 'memo'>;

type TaskCalendarProps = { tasks: CalendarTask[] };

const PRIORITY_ICON: Record<Task['priority'], ReactNode> = {
  high: <Circle className="h-3 w-3 fill-red-500" strokeWidth={1.0} />,
  medium: <Circle className="h-3 w-3  fill-yellow-400" strokeWidth={1.0} />,
  low: <Circle className="h-3 w-3  fill-green-500" strokeWidth={1.0} />
};

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  high: '重要度：高',
  medium: '重要度：中',
  low: '重要度：低'
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
            eventBackgroundColor="#fcfcfc"
            eventBorderColor="#3b3d54"
            eventTextColor="#2c3966"
            eventContent={(eventInfo) => {
              const priority = eventInfo.event.extendedProps.priority as Task['priority'];

              const spotTask = eventInfo.event.extendedProps.spotTask as boolean;

              const memo = eventInfo.event.extendedProps.memo as string | null;

              return (
                <div className="ml-1 flex items-center gap-2 ">
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
                      <span>
                        {spotTask ? (
                          <Pin className="h-4 w-4 fill-gray-400 " strokeWidth={1.5} />
                        ) : (
                          <AlarmClock className="h-4 w-4" strokeWidth={1.5} />
                        )}
                      </span>
                    </TooltipTrigger>

                    <TooltipContent>{spotTask ? 'スポット' : '期限'}</TooltipContent>
                  </Tooltip>

                  {memo && <MemoPopover memo={memo} />}
                </div>
              );
            }}
          />
        </div>
      </div>
    </section>
  );
}
