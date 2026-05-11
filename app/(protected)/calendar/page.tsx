'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarPage() {
  return (
    <main className="p-6">
      <section>
        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" height="auto" />
      </section>
    </main>
  );
}
