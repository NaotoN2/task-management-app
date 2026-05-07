import Link from 'next/link';
import { ReactNode } from 'react';
import SidebarNav from './SidebarNav';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="h-16 flex items-center justify-between px-4 border-b">
        <div>header</div>
        <form action="/auth/logout" method="post">
          <button className='cursor-pointer'  type="submit">ログアウト</button>
        </form>
      </header>

      <div className="flex">
        <aside className="px-4 w-48">
          <SidebarNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
