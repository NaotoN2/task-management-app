import { ReactNode } from 'react';
import SidebarNav from './SidebarNav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { getTodayLabel } from '@/lib/date';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

const today = getTodayLabel();

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <header className="h-24 flex items-center justify-between px-4 border-b">
          <div className="flex flex-col">
            <div className="my-2 flex items-center gap-1">
              <LayoutDashboard className="h-8 w-8" />
              <div className="text-2xl font-semibold">Task Manager</div>
            </div>
            <p className="text-gray-600">{today}</p>
          </div>

          <div className="flex items-center">
            <div className="mr-10 flex items-center gap-2">
              <div>
                {user?.user_metadata.avatar_url && (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
              </div>
              <span>{user?.user_metadata.full_name}</span>
            </div>

            <form action="/auth/logout" method="post">
              <button className="flex gap-0.5 items-center  cursor-pointer" type="submit">
                <LogOut className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-sm"> ログアウト</span>
              </button>
            </form>
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          <aside className="w-full border-b px-4 md:w-48 md:border-b-0">
            <SidebarNav />
          </aside>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
