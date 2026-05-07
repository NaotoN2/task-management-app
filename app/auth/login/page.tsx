'use client';

import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
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
    <div>
      <button className="cursor-pointer" onClick={handleLogin}>
        Googleでログイン
      </button>
    </div>
  );
}
