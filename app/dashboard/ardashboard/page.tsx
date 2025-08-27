'use client';

import { useRouter } from 'next/navigation';
import { ARDashboard } from '@/components/ar/ARDashboard';

export default function Page() {
  const router = useRouter();
  return <ARDashboard onBack={() => router.push('/dashboard')} />;
}
