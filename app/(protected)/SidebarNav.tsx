'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav() {
  const pathname = usePathname();

  const getClass = (href: string) => (pathname === href ? 'font-bold text-blue-600' : 'text-gray-700');

  return (
    <nav className="flex flex-col gap-2">
      <Link href={'/dashboard'} className={getClass('/dashboard')}>
        Dashboard
      </Link>
      <Link href={'/tasks'} className={getClass('/tasks')}>
        Tasks
      </Link>
    </nav>
  );
}
