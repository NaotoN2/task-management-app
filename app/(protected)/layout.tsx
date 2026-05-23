import { ReactNode } from 'react';
import SidebarNav from './SidebarNav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LayoutDashboard } from 'lucide-react';
import { getTodayLabel } from '@/lib/date';

const today = getTodayLabel();

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <header className="h-24 flex items-center justify-between px-4 border-b">
          <div className="flex flex-col">
            <div className="my-2 flex items-center">
              <LayoutDashboard className="h-8 w-8" />
              <div className="text-2xl font-semibold">Task Manager</div>
            </div>
            <p className="text-gray-600">{today}</p>
          </div>

          <form action="/auth/logout" method="post">
            <button className="cursor-pointer" type="submit">
              ログアウト
            </button>
          </form>
        </header>

        <div className="flex">
          <aside className="px-4 w-48">
            <SidebarNav />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
