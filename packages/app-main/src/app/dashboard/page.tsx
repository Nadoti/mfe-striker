'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/home');
  }, [router]);

  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Redirecionando...</p>
    </div>
  );
}