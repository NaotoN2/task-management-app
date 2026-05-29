'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav() {
  const pathname = usePathname();

  const getClass = (href: string) => (pathname === href ? 'font-bold text-blue-600' : 'text-gray-700');

  return (
    <nav className="flex flex-row justify-between p-4  md:flex-col md:gap-2 md:p-0 md:mt-2">
      <Link href={'/dashboard'} className={getClass('/dashboard')}>
        Dashboard
      </Link>
      <Link href={'/tasks'} className={getClass('/tasks')}>
        Tasks
      </Link>
      <Link href={'/calendar'} className={getClass('/calendar')}>
        Calendar
      </Link>
    </nav>
  );
}
