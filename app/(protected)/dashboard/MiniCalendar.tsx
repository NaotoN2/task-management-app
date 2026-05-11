'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function MiniCalendarPanel() {
  return (
    <section className="rounded-lg border p-4">
      <div className='pb-4 flex justify-end '>
        <h2>カレンダー ⇒</h2>
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
