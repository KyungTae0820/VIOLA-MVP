'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useClerk } from '@clerk/nextjs';

export default function LogoutButton() {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await Promise.allSettled([
        supabase.auth.signOut({ scope: 'local' }),
        signOut({ redirectUrl: '/login' }),
      ]);
    } finally {
      router.replace('/login');
      router.refresh();

      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 80);
    }
  };

  return (
    <Button
      className="w-full mt-4 bg-red-100 text-red-600 hover:bg-red-200"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
