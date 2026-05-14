'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Link from 'next/link';

export default function MiniCalendarPanel() {
  return (
    <section className="rounded-lg border p-4">
      <div className="pb-4 flex justify-end ">
        <Link href="/calendar" className="text-sm hover:underline">
          カレンダー ⇒
        </Link>
      </div>
      <div className="mini-calendar">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          height="auto"
          fixedWeekCount={false}
          showNonCurrentDates={false}
        />
      </div>
    </section>
  );
}
