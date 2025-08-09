'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <SessionContextProvider supabaseClient={supabase}>
        {children}
        <Toaster />
      </SessionContextProvider>
    </ClerkProvider>
  );
}
