'use client';

import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-5xl font-bold">Task Manager</h1>

        <p className="text-xl text-gray-500">タスク管理を効率的に</p>

        {error && <p className="text-red-500">ログインに失敗しました。</p>}

        <button className="cursor-pointer" onClick={handleLogin}>
          <img src="/google-ctn.svg" alt="Googleで続ける"/>
        </button>
      </div>
    </main>
  );
}
